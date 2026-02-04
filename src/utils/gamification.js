// src/utils/gamification.js

export const LEVEL_THRESHOLDS = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 250 },
    { level: 4, xp: 500 },
    { level: 5, xp: 1000 },
    { level: 6, xp: 2000 },
    { level: 7, xp: 4000 },
    { level: 8, xp: 8000 },
    { level: 9, xp: 15000 },
    { level: 10, xp: 30000 },
];

/**
 * Calculates the current level based on total XP.
 * @param {number} xp 
 * @returns {number} Current Level (1-based)
 */
export const calculateLevel = (xp) => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i].xp) {
            return LEVEL_THRESHOLDS[i].level;
        }
    }
    return 1;
};

/**
 * Calculates progress towards the next level.
 * @param {number} xp 
 * @returns {object} { currentLevel, nextLevel, progressPercent, xpToNext }
 */
export const getLevelProgress = (xp) => {
    const currentLevel = calculateLevel(xp);
    const currentThreshold = LEVEL_THRESHOLDS.find(l => l.level === currentLevel)?.xp || 0;
    const nextThresholdObj = LEVEL_THRESHOLDS.find(l => l.level === currentLevel + 1);

    if (!nextThresholdObj) {
        return {
            currentLevel,
            nextLevel: currentLevel,
            progressPercent: 100,
            xpToNext: 0,
            currentThreshold
        };
    }

    const nextThreshold = nextThresholdObj.xp;
    const xpInLevel = xp - currentThreshold;
    const range = nextThreshold - currentThreshold;
    const progressPercent = Math.min(100, Math.max(0, (xpInLevel / range) * 100));

    return {
        currentLevel,
        nextLevel: currentLevel + 1,
        progressPercent,
        xpToNext: nextThreshold - xp,
        currentThreshold
    };
};
