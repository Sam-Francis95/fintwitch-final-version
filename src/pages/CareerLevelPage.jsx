import React, { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";
import { STORY_MODULES } from "../data/storyModules";
import StoryModulePlayer from "../components/StoryModulePlayer";
import useGameStore from "../store/useGameStore";

// ---------- Career Level Page (Story Mode) ----------
export default function CareerLevelPage() {
    const { levelId } = useParams();
    const num = Number(levelId) || 1;
    const { user, completeCareerLevel, transact } = useContext(UserContext);
    const { push } = useContext(ToastContext);

    // Game Store
    const { level, addXp, completeLesson } = useGameStore();

    // Get the rich module data
    const moduleData = STORY_MODULES[num];
    const locked = num > level; // Use store level

    if (!moduleData) return <div className="text-white p-10 text-center">Module Coming Soon...</div>;
    if (locked) return <div className="p-10 text-center text-slate-400">Locked. Clear previous level first.</div>;

    const handleModuleCompletion = (passed, score) => {
        if (passed) {
            const xpEarned = 100; // Fixed reward per level for now
            completeLesson(user?.uid, `level-${num}`, xpEarned);

            push(`Module ${num} Completed! Earned ${xpEarned} XP`, { style: "success" });

            // Redirect happens via the player button or handling routing here
            setTimeout(() => {
                window.location.href = '/games';
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-[#090b10]">
            {/* Navigation Header */}
            <div className="p-4 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <Link to="/games" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
                        ← Back to Career Map
                    </Link>
                </div>
            </div>

            {/* Main Player Area */}
            <StoryModulePlayer
                module={moduleData}
                onComplete={handleModuleCompletion}
            />
        </div>
    );
}
