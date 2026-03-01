
// Single Financial Knowledge concept — replaces the old 3-dream-path system
export const FINANCIAL_KNOWLEDGE = {
    id: 'fk',
    label: 'Financial Knowledge',
    color: '#f59e0b',
    icon: '🧠',
    tiers: [
        { min: 0,  max: 19,  label: 'Novice',      badge: '🌱', description: 'Just starting your financial journey' },
        { min: 20, max: 39,  label: 'Learner',     badge: '📚', description: 'Building foundational money habits' },
        { min: 40, max: 59,  label: 'Savvy',       badge: '💡', description: 'Making smarter money moves' },
        { min: 60, max: 79,  label: 'Proficient',  badge: '🎯', description: 'Financial decisions are getting sharper' },
        { min: 80, max: 100, label: 'Expert',      badge: '🏆', description: 'You think like a CFO' },
    ]
};

// Keep LIFE_DREAMS exported for any legacy imports
export const LIFE_DREAMS = [];

export const SCENARIOS = [
    {
        id: 1,
        title: "The Morning Dilemma",
        description: "It's 6 AM. You have two hours free. A friend says to 'just vibe', but you know money won't grow on its own. How do you use this time?",
        choices: [
            {
                id: 'read_finance',
                label: 'Read about Index Funds & SIPs',
                cost: { money: 0, time: 2 },
                impact: { financialKnowledge: 18 },
                consequence: "You now understand rupee-cost averaging and why SIPs beat lump-sum investing for beginners.",
                alternate: "Skipping this would have left you guessing about your money for another year."
            },
            {
                id: 'side_project',
                label: 'Build a SaaS side project',
                cost: { money: 50, time: 2 },
                impact: { financialKnowledge: 6 },
                consequence: "You built something tangible. Entrepreneurship is valuable, but financial basics still need your attention.",
                alternate: "The ₹50 server cost was a real expense — do you track small costs like this?"
            },
            {
                id: 'sleep',
                label: 'Sleep in & scroll social media',
                cost: { money: 0, time: 2 },
                impact: { financialKnowledge: -5 },
                consequence: "You feel rested, but you also spent 2 hours watching people flex cars you can't afford yet.",
                alternate: "Even 20 minutes of finance reading would have moved the needle."
            }
        ]
    },
    {
        id: 2,
        title: "The Salary Credit",
        description: "₹45,000 just hit your bank account. Your friends are planning a weekend trip costing ₹8,000. What's your move?",
        choices: [
            {
                id: 'invest_first',
                label: 'Invest ₹15,000 first, then decide',
                cost: { money: 15000, time: 0 },
                impact: { financialKnowledge: 20 },
                consequence: "You paid yourself first. This is the #1 habit of financially independent people — automate savings before spending.",
                alternate: "Spending first and saving 'what's left' is how most people end up with nothing left."
            },
            {
                id: 'go_trip',
                label: 'Join the trip — YOLO',
                cost: { money: 8000, time: 48 },
                impact: { financialKnowledge: -8 },
                consequence: "Great memories, but your savings rate this month is 0%. Experiences matter, but so does compounding.",
                alternate: "You could have attended and still invested ₹10,000 beforehand."
            },
            {
                id: 'budget_split',
                label: 'Budget it: ₹10k invest, ₹5k fun, ₹30k expenses',
                cost: { money: 5000, time: 1 },
                impact: { financialKnowledge: 14 },
                consequence: "The 50/30/20 rule in action. Smart budgeting lets you enjoy life while building wealth.",
                alternate: "An even better split: automate savings the day salary arrives so you never 'accidentally' spend it."
            }
        ]
    },
    {
        id: 3,
        title: "The Credit Card Trap",
        description: "Your credit card bill is ₹12,000. You only have ₹3,000 in your account right now. What do you do?",
        choices: [
            {
                id: 'minimum_pay',
                label: 'Pay only the minimum due (₹600)',
                cost: { money: 600, time: 0 },
                impact: { financialKnowledge: -12 },
                consequence: "The remaining balance attracts 36–42% annual interest. You just set a debt trap for yourself.",
                alternate: "Credit card interest is one of the most expensive debts. Never carry a balance if avoidable."
            },
            {
                id: 'borrow_pay_full',
                label: 'Borrow from family, pay full ₹12,000',
                cost: { money: 12000, time: 0 },
                impact: { financialKnowledge: 15 },
                consequence: "Smart. You avoided 42% interest by borrowing at 0%. Always clear credit card dues before month-end.",
                alternate: "Build an emergency fund so you're not in this position again."
            },
            {
                id: 'ignore',
                label: 'Ignore — deal with it next month',
                cost: { money: 0, time: 0 },
                impact: { financialKnowledge: -15 },
                consequence: "Your CIBIL score dropped. Late payments stay on your credit report for 7 years.",
                alternate: "One missed payment can cost you lakhs in higher loan interest rates later."
            }
        ]
    },
    {
        id: 4,
        title: "The Investment Pitch",
        description: "A friend in a WhatsApp group promises 30% monthly returns on a 'crypto arbitrage' scheme. You have ₹20,000 saved.",
        choices: [
            {
                id: 'invest_scheme',
                label: 'Invest ₹20,000 — sounds legit',
                cost: { money: 20000, time: 0 },
                impact: { financialKnowledge: -20 },
                consequence: "You lost ₹20,000. This was a Ponzi scheme. If it sounds too good to be true, it always is.",
                alternate: "SEBI-regulated instruments max out around 12–15% annual returns. 30% monthly is a red flag."
            },
            {
                id: 'research_then_skip',
                label: 'Research it first, then skip',
                cost: { money: 0, time: 2 },
                impact: { financialKnowledge: 18 },
                consequence: "You found it listed as a scam on SEBI's warning list. Research saved you ₹20,000.",
                alternate: "Always verify investments on sebi.gov.in before committing money."
            },
            {
                id: 'put_in_index_fund',
                label: 'Put ₹20,000 in a Nifty 50 index fund instead',
                cost: { money: 20000, time: 0 },
                impact: { financialKnowledge: 22 },
                consequence: "Low-cost, diversified, and historically ~12% annually. You just made your smartest investment yet.",
                alternate: "The scheme would have given you 0%. You chose boring but reliable wealth creation."
            }
        ]
    },
    {
        id: 5,
        title: "The Emergency",
        description: "Your laptop breaks down. Repair costs ₹15,000. You have no emergency fund and your next salary is 3 weeks away.",
        choices: [
            {
                id: 'credit_card_emi',
                label: 'Put it on a credit card EMI',
                cost: { money: 15000, time: 0 },
                impact: { financialKnowledge: -5 },
                consequence: "EMIs feel painless but come with 14–24% interest. Always read the fine print.",
                alternate: "A 3-month emergency fund would have covered this with zero stress or interest."
            },
            {
                id: 'personal_loan',
                label: 'Take a personal loan',
                cost: { money: 15000, time: 0 },
                impact: { financialKnowledge: -8 },
                consequence: "Personal loans carry 12–18% interest and ding your credit utilisation ratio.",
                alternate: "This is exactly why every financial advisor says: build a 3–6 month emergency fund first."
            },
            {
                id: 'resolve_to_save',
                label: 'Borrow from family + commit to building emergency fund',
                cost: { money: 15000, time: 0 },
                impact: { financialKnowledge: 16 },
                consequence: "Interest-free borrowing + a real lesson learned. You set up a recurring transfer to an emergency fund that same day.",
                alternate: "Had you started this fund 6 months ago, this emergency would have been painless."
            }
        ]
    },
    {
        id: 6,
        title: "The Tax Season",
        description: "It's March. You haven't done any tax planning. Your taxable income is ₹8 lakh. What do you do?",
        choices: [
            {
                id: 'ignore_tax',
                label: 'Pay whatever TDS was deducted, do nothing',
                cost: { money: 0, time: 0 },
                impact: { financialKnowledge: -10 },
                consequence: "You overpaid tax by ₹46,800. Section 80C alone could have saved you that much.",
                alternate: "₹1.5 lakh in 80C deductions via ELSS or PPF is free money from the government."
            },
            {
                id: 'last_minute_80c',
                label: 'Rush ₹1.5L into ELSS to claim 80C',
                cost: { money: 150000, time: 2 },
                impact: { financialKnowledge: 12 },
                consequence: "You saved ₹46,800 in tax. But investing at year-end means missing 11 months of compounding.",
                alternate: "Start an ELSS SIP in April to get the deduction AND full-year compounding."
            },
            {
                id: 'plan_apr',
                label: 'Plan from April: SIP + NPS + HRA + 80D',
                cost: { money: 0, time: 3 },
                impact: { financialKnowledge: 22 },
                consequence: "You mapped out all deductions for the coming year. Proactive tax planning is a superpower most people ignore.",
                alternate: "Tax saved = money earned. Every lakhs in deductions puts thousands back in your pocket."
            }
        ]
    }
];
