export const CHATBOT_DATA = {
    greeting: "Hello! I'm your Financial Mentor. I can help you understand the 6 levels of your career journey, clarify financial doubts, or just give you a motivation boost. What's on your mind?",
    motivation: [
        "Every penny saved is a step towards freedom. Keep going!",
        "Compounding is the 8th wonder of the world. Start early, even if it's small.",
        "Financial freedom isn't about being rich; it's about having control over your time.",
        "Don't trade what you want most for what you want now.",
        "Investing in yourself pays the best interest.",
        "It's not about how much money you make, but how much money you keep.",
        "The best time to plant a tree was 20 years ago. The second best time is now.",
        "Wealth consists not in having great possessions, but in having few wants."
    ],
    unknown: "I'm not sure specificially about that yet. I'm constantly learning! Try asking about 'Stocks', 'Taxes', 'Savings', or specific career levels.",
    topics: {
        // --- CAREER LEVELS ---
        "level 1": {
            keywords: ["level 1", "basics", "money basis", "needs", "wants"],
            title: "Level 1: Basis of Money",
            content: "Level 1 focuses on the foundation: Needs vs. Wants. It's about understanding where your money goes. \n\n**Tip:** Track every expense for a week. You'll be surprised how much 'little' things add up.",
            resource: "Resource: Investopedia - 'Needs vs Wants'"
        },
        "level 2": {
            keywords: ["level 2", "saving", "habits", "emergency fund"],
            title: "Level 2: Saving Habits",
            content: "Level 2 is about building the habit of saving. The goal isn't the amount, but the consistency. Start with an Emergency Fund (3-6 months of expenses).",
            resource: "Resource: NerdWallet - 'Emergency Fund Guide'"
        },
        "level 3": {
            keywords: ["level 3", "debt", "loans", "emi", "borrowing"],
            title: "Level 3: Debt & Loans",
            content: "Level 3 covers managing debt. Not all debt is bad, but high-interest debt (like credit cards) is a wealth killer. Pay that off first!",
            resource: "Resource: Dave Ramsey - 'Debt Snowball Method'"
        },
        "level 4": {
            keywords: ["level 4", "investing", "mutual funds", "sip", "compound"],
            title: "Level 4: Investing Foundation",
            content: "Level 4 introduces investing. Your money should work for you. Learn about Mutual Funds and the power of Compound Interest.",
            resource: "Resource: Morningstar - 'Investing Basics'"
        },
        "level 5": {
            keywords: ["level 5", "goals", "planning", "retirement", "fire"],
            title: "Level 5: Financial Goal Planning",
            content: "Level 5 is strategic. It's about planning for big life goals: buying a home, children's education, or early retirement (FIRE).",
            resource: "Resource: Mr. Money Mustache - 'The Shockingly Simple Math Behind Early Retirement'"
        },
        "level 6": {
            keywords: ["level 6", "wealth", "legacy", "estate", "building wealth"],
            title: "Level 6: Building Wealth",
            content: "Level 6 is the endgame: Legacy and long-term wealth preservation. It involves asset allocation and estate planning.",
            resource: "Resource: The Balance - 'Asset Allocation'"
        },

        // --- BASICS ---
        "income": {
            keywords: ["income", "salary", "wage", "earning"],
            title: "Income",
            content: "Income is money you receive, usually from a job or investments. \n\n**Active Income:** Money you work for (Salary).\n**Passive Income:** Money that works for you (Rent, Dividends)."
        },
        "expense": {
            keywords: ["expense", "spending", "cost", "expenditure"],
            title: "Expenses",
            content: "Expenses are the cost of operations that a company incurs to generate revenue. For individuals, it's simply money flowing out."
        },
        "budget": {
            keywords: ["budget", "budgeting", "plan", "allocation"],
            title: "Budgeting",
            content: "A budget is a plan for your money. The **50/30/20 rule** is popular: 50% Needs, 30% Wants, 20% Savings/Debt Repayment."
        },
        "inflation": {
            keywords: ["inflation", "rising prices", "cost of living"],
            title: "Inflation",
            content: "Inflation is the rate at which prices rise over time. If inflation is 6%, your money buys 6% less next year. This is why investing is crucial."
        },

        // --- SAVINGS & BANKING ---
        "savings account": {
            keywords: ["savings account", "bank", "interest"],
            title: "Savings Account",
            content: "A basic bank account that pays interest. Good for emergency funds, but usually returns less than inflation."
        },
        "fd": {
            keywords: ["fixed deposit", "fd", "term deposit"],
            title: "Fixed Deposit (FD)",
            content: "A secure investment where you deposit money for a fixed period at a fixed interest rate. Safe, but returns are often taxable."
        },
        "rd": {
            keywords: ["recurring deposit", "rd"],
            title: "Recurring Deposit (RD)",
            content: "Similar to an FD, but you deposit a small fixed amount monthly. Good for building a saving habit."
        },
        "emergency fund": {
            keywords: ["emergency fund", "rainy day", "safety net"],
            title: "Emergency Fund",
            content: "Money set aside for unexpected expenses (medical, job loss). Aim for 3-6 months of essential living expenses."
        },

        // --- INVESTING TERMS ---
        "stock": {
            keywords: ["stock", "shares", "equity", "market"],
            title: "Stocks (Equity)",
            content: "Buying a stock means owning a small piece of a company. Over the long term, stocks have historically provided the highest returns."
        },
        "bond": {
            keywords: ["bond", "debt instrument", "government securities"],
            title: "Bonds",
            content: "A bond is a loan you give to a government or company. They pay you interest (coupon) and return your principal at the end. Safer than stocks."
        },
        "mutual fund": {
            keywords: ["mutual fund", "mf", "pooled money"],
            title: "Mutual Funds",
            content: "A pool of money from many investors, managed by a professional to buy stocks or bonds. Great for beginners to diversify."
        },
        "etf": {
            keywords: ["etf", "exchange traded fund"],
            title: "ETF (Exchange Traded Fund)",
            content: "Like a mutual fund, but trades on the stock exchange like a single stock. Often has lower fees."
        },
        "sip": {
            keywords: ["sip", "systematic investment plan"],
            title: "SIP (Systematic Investment Plan)",
            content: "A method of investing a fixed sum regularly (e.g., monthly) in a mutual fund. It helps in 'Rupee Cost Averaging'."
        },
        "dividend": {
            keywords: ["dividend", "payout", "profit share"],
            title: "Dividend",
            content: "A portion of a company's profit distributed to shareholders. Not all companies pay dividends; some reinvest profits to grow."
        },
        "bull market": {
            keywords: ["bull market", "bullish", "market going up"],
            title: "Bull Market",
            content: "A financial market condition where prices are rising or are expected to rise. Optimism is high."
        },
        "bear market": {
            keywords: ["bear market", "bearish", "market going down", "crash"],
            title: "Bear Market",
            content: "A market condition where prices fall 20% or more from recent highs. Pessimism and fear are high."
        },
        "portfolio": {
            keywords: ["portfolio", "holdings", "asset mix"],
            title: "Portfolio",
            content: "A collection of financial investments like stocks, bonds, cash, and commodities held by an individual."
        },
        "diversification": {
            keywords: ["diversification", "diversify", "spread risk"],
            title: "Diversification",
            content: "'Don't put all your eggs in one basket.' Spreading investments across different assets to reduce risk."
        },
        "risk": {
            keywords: ["risk", "volatility"],
            title: "Risk vs Return",
            content: "Generally, higher potential returns come with higher risk. Understanding your risk tolerance is key to happy investing."
        },

        // --- TAXES ---
        "tax": {
            keywords: ["tax", "income tax", "itr"],
            title: "Income Tax",
            content: "A mandatory charge levied by the government on your income. Used for public services."
        },
        "deduction": {
            keywords: ["deduction", "80c", "tax saving"],
            title: "Tax Deductions",
            content: "Investments or expenses that reduce your taxable income (e.g., Section 80C in India covers PPF, ELSS, LIC)."
        },
        "elss": {
            keywords: ["elss", "equity linked savings scheme"],
            title: "ELSS (Equity Linked Savings Scheme)",
            content: "A type of mutual fund that qualifies for tax intent (Sec 80C) and has a 3-year lock-in period."
        },

        // --- RETIREMENT ---
        "retirement": {
            keywords: ["retirement", "pension", "old age"],
            title: "Retirement Planning",
            content: "Preparing for life after paid work. The earlier you start, the less you need to save monthly due to compounding."
        },
        "ppf": {
            keywords: ["ppf", "public provident fund"],
            title: "PPF (Public Provident Fund)",
            content: "A long-term, government-backed savings scheme in India with attractive interest rates and tax benefits."
        },
        "nps": {
            keywords: ["nps", "national pension system"],
            title: "NPS (National Pension System)",
            content: "A voluntary retirement savings scheme giving market-linked returns."
        },

        // --- CREDIT & DEBT ---
        "credit score": {
            keywords: ["credit score", "cibil", "credit rating"],
            title: "Credit Score",
            content: "A number (300-900) that depicts a consumer's creditworthiness. High score = easier loan approvals and lower interest rates."
        },
        "interest rate": {
            keywords: ["interest rate", "apr"],
            title: "Interest Rate",
            content: "The amount a lender charges for the use of assets expressed as a percentage of the principal."
        },
    },
    scenarios: [
        {
            keywords: ["spend", "buy", "purchase", "save", "iphone", "phone"],
            question: "I'm thinking about buying a new phone on EMI vs saving that money. What should I do?",
            answer: "Let's look at the impact:\n\n**Option A: Buy on EMI**\n- **Short-term:** Instant gratification.\n- **Long-term:** You pay interest (often 15%+), making the phone cost more. You lose the opportunity to invest that monthly EMI.\n\n**Option B: Save & Invest**\n- **Short-term:** Delayed gratification.\n- **Long-term:** That same monthly amount in a SIP (12% return) could grow significantly over 5 years. \n\n**Verdict:** Unless the phone is essential for earning income, **save up and buy cash**."
        },
        {
            keywords: ["loan", "borrow", "credit card", "vacation", "trip"],
            question: "Should I use my credit card for a vacation?",
            answer: "**Decision Consequence:**\nUsing a credit card without the cash to pay it off immediately often incurs 30-40% annual interest.\n\n- **Result:** A $1000 trip could cost you $1400+ if paid over a year.\n- **Advice:** Save for the trip beforehand. Memories are sweeter without debt stress."
        },
        {
            keywords: ["stock", "market", "risk", "crash", "loss", "sell"],
            question: "The market is crashing, should I sell everything?",
            answer: "**Panic Selling Analysis:**\n- **Short-term:** You stop the pain of seeing red numbers.\n- **Long-term:** You lock in actual losses and miss the recovery.\n\n**Advice:** History shows markets recover. If your goals are long-term (5+ years), stay invested. 'Time in the market beats timing the market.'"
        }
    ]
};
