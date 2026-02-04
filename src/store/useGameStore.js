import { create } from 'zustand';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { calculateLevel } from '../utils/gamification';

const useGameStore = create((set, get) => ({
    // State
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    unlockedTools: [],
    completedLessons: [],
    isLoading: true,

    // Actions
    initializeUser: async (uid) => {
        console.log("[GameStore] initializeUser called for:", uid);
        if (!uid) return;
        set({ isLoading: true });

        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                console.log("[GameStore] Loaded User Data:", data);
                set({
                    xp: data.xp || 0,
                    level: calculateLevel(data.xp || 0),
                    streak: data.streak || 0,
                    lastActiveDate: data.lastActiveDate || null,
                    unlockedTools: data.unlockedTools || [],
                    completedLessons: data.completedLessons || [],
                    isLoading: false
                });

                // Check Streak Validity
                get().checkStreak(uid);
            } else {
                console.log("[GameStore] No user doc found, starting fresh.");
                set({ isLoading: false });
            }
        } catch (error) {
            console.error("Game Store Init Error:", error);
            set({ isLoading: false });
        }
    },

    addXp: async (uid, amount) => {
        const { xp } = get();
        const newXp = xp + amount;
        const newLevel = calculateLevel(newXp);

        set({ xp: newXp, level: newLevel });

        if (uid) {
            try {
                const userRef = doc(db, 'users', uid);
                await updateDoc(userRef, {
                    xp: newXp,
                    currentLevel: newLevel
                });
            } catch (error) {
                console.error("Failed to sync XP:", error);
            }
        }
    },

    checkStreak: async (uid) => {
        const { lastActiveDate, streak } = get();
        const today = new Date().toISOString().split('T')[0];
        const lastActive = lastActiveDate ? new Date(lastActiveDate).toISOString().split('T')[0] : null;

        // If active today, usually we return. BUT if streak is 0 (bug/init state), we must fix it to 1.
        if (lastActive === today && streak > 0) return;

        let newStreak = streak;

        if (lastActive) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastActive === yesterdayStr) {
                newStreak += 1;
            } else {
                newStreak = 1; // Reset if missed a day, or start fresh
            }
        } else {
            newStreak = 1;
        }

        set({ streak: newStreak, lastActiveDate: new Date().toISOString() });

        if (uid) {
            try {
                const userRef = doc(db, 'users', uid);
                await updateDoc(userRef, {
                    streak: newStreak,
                    lastActiveDate: new Date().toISOString()
                });
            } catch (error) {
                console.error("Failed to sync streak:", error);
            }
        }
    },

    completeLesson: async (uid, lessonId, xpReward = 50) => {
        const { completedLessons } = get();
        if (completedLessons.includes(lessonId)) return; // Already done

        const newCompleted = [...completedLessons, lessonId];
        set({ completedLessons: newCompleted });

        // Grant XP
        await get().addXp(uid, xpReward);

        // Update Firestore
        if (uid) {
            try {
                const userRef = doc(db, 'users', uid);
                await updateDoc(userRef, {
                    completedLessons: newCompleted
                });
            } catch (error) {
                console.error("Failed to save lesson:", error);
            }
        }
    }
}));

export default useGameStore;
