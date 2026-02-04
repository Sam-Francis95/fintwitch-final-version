export const STORY_MODULES = {
    1: {
        id: 1,
        title: "Basics of Money",
        passingScore: 70, // 70% to unlock activity
        rewards: {
            cash: 200,
            xp: 100
        },
        progression: {
            success: "Activity Zone unlocked + Level 2",
            fail: "Reset Level 1"
        },
        stages: [
            {
                type: "slide", // New type for pure content slides
                title: "Concept Overview — Understanding Money",
                content: `
**Money** is a medium of exchange that enables people to buy goods and services.

**Understanding money includes:**
*   How income is earned
*   How money is spent
*   Difference between needs vs wants
*   Importance of tracking cash flow

**📌 Learning Focus:**
Building foundational financial awareness for everyday decisions.
`
            },
            {
                type: "slide",
                title: "Scenario Reminder",
                content: `
**Asha** is a college student.

*   **Monthly allowance:** ₹8,000
*   **Expenses:** Food, travel, mobile recharge, entertainment
*   **Goal:** Avoid running out of money before month-end
`
            },
            {
                type: "quiz",
                question: "What Is Money? Which statement BEST describes money?",
                options: [
                    "A tool only for rich people",
                    "A medium to exchange goods and services",
                    "A way to show social status",
                    "Something used only for saving"
                ],
                answer: 1,
                explanation: {
                    correct: "Money allows buying and selling efficiently without barter.",
                    wrong: "A: Everyone uses money. C: Social status is not its purpose. D: Money is also used for spending.",
                    source: "https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking"
                },
                skillImpact: { "Money Basics": 20 }
            },
            {
                type: "quiz",
                question: "Which of the following is an INCOME source for Asha?",
                options: [
                    "Paying hostel rent",
                    "Buying movie tickets",
                    "Monthly allowance",
                    "Mobile data recharge"
                ],
                answer: 2,
                explanation: {
                    correct: "Income is money received, not spent.",
                    wrong: "All others are expenses (money flowing out).",
                    source: "https://www.investopedia.com/terms/i/income.asp"
                },
                skillImpact: { "Income Awareness": 20 }
            },
            {
                type: "quiz",
                question: "Which expense is a NEED?",
                options: [
                    "Online shopping",
                    "Restaurant food",
                    "Daily transportation",
                    "Movie subscription"
                ],
                answer: 2,
                explanation: {
                    correct: "Transportation is essential for daily activities.",
                    wrong: "They are optional lifestyle expenses (Wants).",
                    source: "https://www.consumerfinance.gov/consumer-tools/money-as-you-grow"
                },
                skillImpact: { "Spending Control": 20 }
            },
            {
                type: "quiz",
                question: "If Asha spends more than her income, what happens?",
                options: [
                    "Savings increase",
                    "Money lasts longer",
                    "Financial stress increases",
                    "Income automatically grows"
                ],
                answer: 2,
                explanation: {
                    correct: "Overspending leads to shortages and stress.",
                    wrong: "Savings decrease, money runs out, and income doesn't change just because you spend.",
                    source: "https://www.nerdwallet.com/article/finance/what-is-cash-flow"
                },
                skillImpact: { "Money Basics": 10, "Spending Control": 10 }
            },
            {
                type: "quiz",
                question: "Which habit helps manage money better?",
                options: [
                    "Ignoring expenses",
                    "Spending first, saving later",
                    "Tracking income and expenses",
                    "Borrowing regularly"
                ],
                answer: 2,
                explanation: {
                    correct: "Tracking helps control spending and plan better.",
                    wrong: "Ignoring pushes problems away. Spending first leaves nothing. Borrowing creates debt.",
                    source: "https://www.moneyhelper.org.uk/en/everyday-money/budgeting"
                },
                skillImpact: { "Spending Control": 20 }
            },
            // MIDDLE BARRIER - CHECK SCORE HERE in Logic
            {
                type: "activity",
                activityType: "odd_one_out",
                title: "Activity Zone — Odd One Out",
                description: "Identify the 'Luxury watch' (Want) among the basic Needs.",
                items: ["Grocery bill", "Bus ticket", "Mobile recharge", "Luxury watch"],
                correctItem: "Luxury watch"
            }
        ]
    },
    2: {
        id: 2,
        title: "Saving Habits",
        passingScore: 70,
        rewards: {
            cash: 500,
            xp: 150
        },
        progression: {
            success: "Activity Zone + Level 3",
            fail: "Reset Level 2"
        },
        stages: [
            {
                type: "slide",
                title: "Concept Overview — Importance of Saving",
                content: `
**Saving money** means setting aside a portion of income for:
*   Future needs
*   Emergencies
*   Goals

Strong saving habits create financial security and discipline.

**📌 Learning Focus:**
Developing consistent and realistic saving behavior.
`
            },
            {
                type: "slide",
                title: "Scenario Reminder",
                content: `
**Rohit** (Intern)
*   **Income:** ₹15,000/month
*   **Goal:** Buy a laptop worth ₹45,000 in 1 year
*   **Current State:** Saves irregularly
`
            },
            {
                type: "quiz",
                question: "What does saving mean?",
                options: [
                    "Spending leftover money",
                    "Keeping money aside for future",
                    "Borrowing for emergencies",
                    "Avoiding all expenses"
                ],
                answer: 1,
                explanation: {
                    correct: "Saving is strictly regarding setting aside money for future use.",
                    wrong: "Spending is opposite. Borrowing is debt. Avoiding expenses is frugality, not saving itself.",
                    source: "https://www.investopedia.com/terms/s/savings.asp"
                },
                skillImpact: { "Saving Discipline": 15 }
            },
            {
                type: "quiz",
                question: "If Rohit saves 20% of ₹15,000, how much is that?",
                options: [
                    "₹2,000",
                    "₹2,500",
                    "₹3,000",
                    "₹4,000"
                ],
                answer: 2,
                explanation: {
                    correct: "20% of 15,000 = (20/100) * 15000 = ₹3,000.",
                    wrong: "Math check: 2000 is 13%, 4000 is 26%.",
                    source: null
                },
                skillImpact: { "Financial Planning": 20 }
            },
            {
                type: "quiz",
                question: "Why is an emergency fund important?",
                options: [
                    "For shopping",
                    "For vacations",
                    "For unexpected expenses",
                    "For investments"
                ],
                answer: 2,
                explanation: {
                    correct: "It balances shocks from unexpected events.",
                    wrong: "Shopping/Vacations are goals. Investments are for growth.",
                    source: "https://www.nerdwallet.com/article/finance/emergency-fund"
                },
                skillImpact: { "Saving Discipline": 15, "Financial Planning": 10 }
            },
            {
                type: "quiz",
                question: "Which habit encourages saving?",
                options: [
                    "Saving only when extra money remains",
                    "Saving first, spending later",
                    "Ignoring goals",
                    "Using credit for savings"
                ],
                answer: 1,
                explanation: {
                    correct: "Pay yourself first ensures saving happens before spending.",
                    wrong: "Saving leftovers usually means saving nothing.",
                    source: "https://www.khanacademy.org/college-careers-more/financial-literacy"
                },
                skillImpact: { "Saving Discipline": 20 }
            },
            {
                type: "quiz",
                question: "How much will Rohit save in one year at ₹3,000/month?",
                options: [
                    "₹30,000",
                    "₹36,000",
                    "₹45,000",
                    "₹50,000"
                ],
                answer: 1,
                explanation: {
                    correct: "₹3,000 × 12 months = ₹36,000.",
                    wrong: "Math check.",
                    source: null
                },
                skillImpact: { "Goal Awareness": 20, "Financial Planning": 10 }
            },
            {
                type: "activity",
                activityType: "odd_one_out",
                title: "Activity Zone — Odd One Out",
                description: "Identify the item that doesn't belong in a Savings Plan context: 'Shopping Cart'.",
                items: ["Piggy bank", "Bank savings account", "Emergency fund jar", "Shopping cart"],
                correctItem: "Shopping cart"
            }
        ]
    }
};
