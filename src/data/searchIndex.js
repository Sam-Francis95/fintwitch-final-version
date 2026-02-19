export const searchIndex = [
    // --- GAMES ---
    {
        title: "Stock Market Game",
        path: "/games/stockmarket",
        keywords: ["stock", "market", "trade", "buy", "sell", "portfolio", "invest", "equity", "share", "game", "finance", "sim"]
    },
    {
        title: "Dream Life Planner",
        path: "/games/dreamlife",
        keywords: ["dream", "life", "goal", "plan", "house", "car", "luxury", "buy", "asset", "future", "retire"]
    },
    {
        title: "Career Mode",
        path: "/games/career/1",
        keywords: ["career", "job", "work", "level", "corp", "ladder", "promotion", "salary", "income", "role"]
    },
    {
        title: "Games Arcade",
        path: "/games",
        keywords: ["games", "play", "arcade", "fun", "hub", "menu"]
    },

    // --- TOOLS ---
    {
        title: "Financial Tools",
        path: "/tools",
        keywords: ["tool", "calculator", "finance", "math", "analysis", "debt", "interest", "compound", "sip", "emi"]
    },

    // --- EDUCATION ---
    {
        title: "Knowledge Hub",
        path: "/articles",
        keywords: ["article", "news", "learn", "read", "blog", "education", "knowledge", "study", "tip", "guide"]
    },

    // --- UTILITIES ---
    {
        title: "Habit Tracker",
        path: "/habit",
        keywords: ["habit", "track", "discipline", "routine", "daily", "streak", "check", "goal"]
    },
    {
        title: "Transaction History",
        path: "/transactions",
        keywords: ["transaction", "history", "log", "record", "money", "spend", "earn", "past", "ledger"]
    },
    {
        title: "Mission Control",
        path: "/",
        keywords: ["home", "dashboard", "main", "start", "mission", "control", "hub"]
    },
    {
        title: "Mode Selection",
        path: "/mode-selection",
        keywords: ["mode", "switch", "change", "profile", "user", "select"]
    },
    {
        title: "Login",
        path: "/login",
        keywords: ["login", "signin", "signup", "register", "auth", "account"]
    }
];

export const findBestMatch = (query) => {
    if (!query) return null;
    const lowerQuery = query.toLowerCase().trim();

    // 1. Exact Title Match (Loose)
    const titleMatch = searchIndex.find(item => item.title.toLowerCase().includes(lowerQuery));
    if (titleMatch) return titleMatch;

    // 2. Keyword Match
    const keywordMatch = searchIndex.find(item =>
        item.keywords.some(k => k.toLowerCase().includes(lowerQuery) || lowerQuery.includes(k.toLowerCase()))
    );
    if (keywordMatch) return keywordMatch;

    return null;
};
