import React, { createContext, useState, useEffect, useContext, useRef, useMemo } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useLocalState } from "../hooks/useLocalState";
import { useToast } from "./ToastContext";
import { todayStr, yesterdayStr, round2, fmt } from "../utils/format";

export const UserContext = createContext(null);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
}

const INITIAL_USER_STATE = {
    username: null,
    balance: 10000,
    lastLogin: null,
    streak: 0,
    loginDates: [],
    readArticles: {},
    investments: [],
    transactions: [],
    careerLevel: 1,
    careerProgress: {},
    unlockedTools: [], // Tools unlock after levels
    habitStats: {
        savings: { score: 1, note: "" },
        spending: { score: 1, note: "" },
        investing: { score: 1, note: "" },
    },
    mode: "career", // 'career' | 'financial_tools'
    dailyActions: {
        date: null,
        readArticle: false,
        careerLevel: false,
        reviewPortfolio: false
    },
    tradingLicense: false // New state for Training Quiz
};

export function UserProvider({ children }) {
    const [user, setUser] = useLocalState("fintwitch_user", INITIAL_USER_STATE);
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { push } = useToast();

    // Use a Ref to keep track of the latest user state without triggering effect re-runs
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    const isFetching = useRef(false);
    const isSigningUp = useRef(false); // NEW: Lock to prevent race conditions during signup

    // Highly stable profile fetcher (Internal only) with Timeout
    const fetchProfile = async (uid, email) => {
        if (isFetching.current) return;
        isFetching.current = true;

        try {
            console.log("[UserContext] Initializing profile for:", email);
            const docRef = doc(db, "users", uid);

            // Race condition: Firestore fetch vs 3s Timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Firestore timeout")), 4000)
            );

            const snap = await Promise.race([
                getDoc(docRef),
                timeoutPromise
            ]);

            if (snap.exists()) {
                const data = snap.data();
                setUser(prev => ({ ...prev, ...data }));
            } else {
                // New user flow
                const fallbackName = email?.split('@')[0] || "Trader";
                const initialData = {
                    ...userRef.current,
                    username: userRef.current.username || fallbackName,
                    balance: Math.max(userRef.current.balance || 10000, 10000)
                };
                setDoc(docRef, initialData).catch(e => console.warn("Firestore init error (offline?):", e.message));
                setUser(initialData);
            }
        } catch (err) {
            console.warn("[UserContext] Profile fetch warning:", err.message);
            // Fallback to local state if fetch fails/times out
            if (!userRef.current.username) {
                setUser(prev => ({ ...prev, username: email?.split('@')[0] || "Trader" }));
            }
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    };

    // Auth Change Listener (Stable)
    useEffect(() => {
        const safetyTimer = setTimeout(() => setIsLoading(false), 10000);

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) {
                setFirebaseUser(u);
                // Only fetch profile if we are NOT currently in the middle of a manual signup
                // This prevents the race condition where fetchProfile tries to create a doc 
                // while signup is also trying to create it.
                if (!isSigningUp.current) {
                    fetchProfile(u.uid, u.email);
                }
            } else {
                setFirebaseUser(null);
                setIsLoading(false);
            }
            clearTimeout(safetyTimer);
        });

        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Firestore Sync Hook (Defensive)
    useEffect(() => {
        const sync = async () => {
            if (!firebaseUser || isLoading || isFetching.current || isSigningUp.current) return;
            try {
                const docRef = doc(db, "users", firebaseUser.uid);
                await updateDoc(docRef, user).catch(async (err) => {
                    if (err.code === 'not-found') await setDoc(docRef, user);
                });
            } catch (e) { /* sync failure is okay */ }
        };
        const timer = setTimeout(sync, 1500); // 1.5s debounce to save writes
        return () => clearTimeout(timer);
    }, [user, firebaseUser, isLoading]);

    // Methods
    const signin = async (email, password) => {
        setIsLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await fetchProfile(result.user.uid, result.user.email);
            return true;
        } catch (error) {
            console.error("Login failed:", error.code);
            let msg = "Invalid credentials";
            if (error.code === 'auth/network-request-failed') msg = "Network error - check connection";
            push(msg, { style: "danger" });
            setIsLoading(false);
            throw error;
        }
    };

    const signup = async (email, password, username) => {
        setIsLoading(true);
        isSigningUp.current = true; // Lock the listener
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Manually initialize the user data since we blocked the listener
            const initialData = { ...INITIAL_USER_STATE, username, balance: 10000 };
            const docRef = doc(db, "users", result.user.uid);

            // Protected Firestore Write with Timeout
            try {
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Firestore write timeout")), 5000)
                );
                await Promise.race([setDoc(docRef, initialData), timeoutPromise]);
            } catch (docRefError) {
                console.warn("[UserContext] Firestore Init Failed (Offline?), continuing locally:", docRefError);
                // We proceed anyway so the user isn't stuck
            }

            setUser(initialData);
            setIsLoading(false);
            return true;
        } catch (error) {
            push(error.message, { style: "danger" });
            setIsLoading(false);
            throw error;
        } finally {
            // Slight delay to ensure state propagates before releasing lock, 
            // though synchronous execution should be fine.
            setTimeout(() => { isSigningUp.current = false; }, 1000);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(prev => ({ ...prev, username: null }));
            push("Signed out successfully", { style: "success" });
        } catch (e) { console.error(e); }
    };

    const resetPassword = async (email) => {
        try { await sendPasswordResetEmail(auth, email); return true; }
        catch (error) { throw error; }
    };

    const transact = (amount, { source = "system", label = null } = {}) => {
        setUser((u) => {
            const newBalance = round2(Math.max(0, u.balance + amount));
            const tx = { id: Date.now(), ts: new Date().toISOString(), amount: round2(amount), balanceAfter: newBalance, source, label };
            return { ...u, balance: newBalance, transactions: [...(u.transactions || []), tx].slice(-200) };
        });
        push(`${amount > 0 ? "+" : ""}${fmt(amount)} (${label || source})`, { style: amount >= 0 ? "success" : "danger" });
    };

    const markArticleRead = (id, reward = 10) => {
        setUser((u) => {
            if (u.readArticles?.[id]) return u;
            const newBal = round2(u.balance + reward);
            return { ...u, readArticles: { ...(u.readArticles || {}), [id]: true }, balance: newBal };
        });
        push(`Read article reward +${fmt(reward)}`, { style: "success" });
    };

    const invest = (investment) => setUser((u) => ({ ...u, investments: [...(u.investments || []), investment] }));

    const realizeInvestment = (id, multiplier) => setUser((u) => {
        const inv = (u.investments || []).find((i) => i.id === id);
        if (!inv) return u;
        const returned = round2(inv.amount * multiplier);
        const nextBalance = round2(u.balance + returned);
        push(`Investment return ${fmt(returned)}`, { style: "success" });
        return { ...u, balance: nextBalance, investments: u.investments.filter((i) => i.id !== id) };
    });

    const completeCareerLevel = (level, performance) => {
        setUser((u) => {
            const nextLevel = Math.min(6, Math.max(u.careerLevel, level + 1));
            // Roadmap: L1->Splitter, L2->Emergency, L3->EMI, L4->SIP, L5->FIRE, L6->Wealth
            const allTools = ["expense_splitter", "emergency_fund", "emi", "sip", "fire", "wealth_dashboard"];

            // Logic to unlock specific tools based on level (Strict Mapping)
            // L1 done -> Unlock Splitter (Index 0)
            // L2 done -> Unlock Emergency (Index 1)
            const toolToUnlock = allTools[level - 1];

            const currentUnlocked = new Set(u.unlockedTools || []);
            if (toolToUnlock && !currentUnlocked.has(toolToUnlock)) {
                currentUnlocked.add(toolToUnlock);
                push(`Tool unlocked: ${toolToUnlock.replace('_', ' ').toUpperCase()} 🔓`, { style: "success" });
            }

            const updatedTools = Array.from(currentUnlocked);
            const careerProgress = { ...(u.careerProgress || {}), [level]: performance };

            // Trigger Streak Action
            // Note: Since we are inside setUser, we cannot call trackDailyAction which also calls setUser. 
            // We need to handle this trigger outside or call a side-effect.
            // Wait, infinite loop risk if we just chain.
            // Better approach: Let's split this. 
            // OR simpler: Just mark the dailyAction flag true HERE in this update.

            const today = new Date().toISOString().split('T')[0];
            const currentDaily = u.dailyActions?.date === today
                ? u.dailyActions
                : { date: today, readArticle: false, careerLevel: false, reviewPortfolio: false };

            const nextDaily = { ...currentDaily, careerLevel: true };
            // Note: We won't trigger the FULL streak check here to keep it simple, 
            // or we copy the streak logic here. 
            // Let's rely on the user visiting the HabitTracker or just doing another action to "finalize" the streak?
            // No, the Req says "moment the user clicks".
            // So we MUST evaluate streak here.

            const allDone = nextDaily.readArticle && nextDaily.careerLevel && nextDaily.reviewPortfolio;
            let newStreak = u.streak;
            let lastStreakDate = u.lastStreakCompletion;

            if (allDone && u.lastStreakCompletion !== today) {
                // Copied logic from trackDailyAction (Simplified)
                const yester = new Date(); yester.setDate(yester.getDate() - 1);
                const strYester = yester.toISOString().split('T')[0];

                if (lastStreakDate === strYester) newStreak += 1;
                else if (lastStreakDate !== today) newStreak = 1;

                lastStreakDate = today;
                // Side effect in reducer? No, we can't push toast effectively for streak if we want to be pure, 
                // but we can just let the separate toast call happen later or ignore it.
                // We'll rely on the UI to show the streak fire.
            }

            return {
                ...u,
                careerLevel: nextLevel,
                careerProgress,
                unlockedTools: updatedTools,
                dailyActions: nextDaily,
                streak: newStreak,
                lastStreakCompletion: lastStreakDate
            };
        });
    };

    const updateHabitStats = (domain, score, note) => {
        setUser((u) => ({ ...u, habitStats: { ...(u.habitStats || {}), [domain]: { score, note } } }));
    };

    const trackDailyAction = (actionType) => {
        const today = new Date().toISOString().split('T')[0];

        setUser((prev) => {
            // Reset if new day
            const currentDaily = prev.dailyActions?.date === today
                ? prev.dailyActions
                : { date: today, readArticle: false, careerLevel: false, reviewPortfolio: false };

            if (currentDaily[actionType]) return prev; // Already done

            const updatedDaily = { ...currentDaily, [actionType]: true };

            // Check for Streak Completion
            const allDone = updatedDaily.readArticle && updatedDaily.careerLevel && updatedDaily.reviewPortfolio;
            let newStreak = prev.streak;
            let newLoginDates = prev.loginDates || [];

            if (allDone && prev.dailyActions?.date !== today) {
                // Determine streak increment logic
                // Ensure we haven't already rewarded streak for today (though dailyActions check helps, double safety)

                // Logic: If last login was yesterday, increment. Else reset to 1. 
                // However, since we are tracking *streak completion*, we usually look at the last *streak date*.
                // For simplicity here, we assume if they did it today, it counts.
                // We need to store 'lastStreakDate' to avoid double counting if logic gets complex.
                // But `prev.dailyActions?.date !== today` with `allDone` failing before is enough for single trigger.

                // Actually, wait. We need to check if streak was ALREADY incremented today? 
                // The dailyActions.date reset handles the "new day" part.
                // But we need to know if streak was already bumped. 
                // Let's rely on the fact that we transition from !allDone to allDone exactly once per day.

                const lastStreakDate = prev.lastStreakDate;
                const yesterday = yesterdayStr(); // We need a helper for yesterday or calc it
                // Simple approach: 
                // If lastStreakDate == yesterday, streak++
                // If lastStreakDate == today, do nothing (already streak'd)
                // Else streak = 1

                // *Self-correction*: Let's stick to the Plan's logic or `HabitTracker`'s logic.
                // HabitTracker used `lastDate` in streak object.
                // We should move `streak` object to root or keep using `streak` integer + `lastLogin`?
                // The `INITIAL_USER_STATE` has `streak: 0`. Let's assume simple integer.
                // And we need `lastStreakDate` to track *streak* updates explicitly separate from just logging in.
                // Let's add `lastStreakDate` to user state dynamically if missing.

                // We'll treat `lastLogin` as "Last app open". We need `lastStreakCompletion`.

                const lastCompletion = prev.lastStreakCompletion;
                const yester = new Date(); yester.setDate(yester.getDate() - 1);
                const strYester = yester.toISOString().split('T')[0];

                if (lastCompletion === strYester) {
                    newStreak += 1;
                } else if (lastCompletion === today) {
                    // already updated, do nothing
                } else {
                    newStreak = 1; // Broken streak or first time
                }

                if (lastCompletion !== today) {
                    push("Daily Streak Achieved! 🔥", { style: "success" });
                }

                return {
                    ...prev,
                    dailyActions: updatedDaily,
                    streak: newStreak,
                    lastStreakCompletion: today
                };
            }

            // Just update actions if not yet complete
            return { ...prev, dailyActions: updatedDaily };
        });
    };

    const grantTradingLicense = () => {
        setUser((prev) => {
            if (prev.tradingLicense) return prev;
            return {
                ...prev,
                tradingLicense: true,
                balance: prev.balance + 500 // Bonus for completing training
            };
        });
        push("Trading License Granted! +$500 Bonus", { style: "success" });
    };

    // Stable Context Value
    const contextValue = useMemo(() => ({
        user, setUser,
        signin, login: signin, // Alias for compatibility
        signup, logout, resetPassword,
        transact, addBalance: transact, // Alias
        markArticleRead, invest, realizeInvestment,
        completeCareerLevel, updateHabitStats,
        trackDailyAction, grantTradingLicense, // New Export
        isLoading, firebaseUser
    }), [user, isLoading, firebaseUser]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}
