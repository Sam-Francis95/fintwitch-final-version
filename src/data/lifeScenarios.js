
export const LIFE_DREAMS = [
    { id: 'swe', label: 'Become a Software Engineer', color: '#3b82f6', icon: '💻' },
    { id: 'startup', label: 'Start a Startup', color: '#8b5cf6', icon: '🚀' },
    { id: 'fire', label: 'Financial Independence (FIRE)', color: '#10b981', icon: '💰' }
];

export const SCENARIOS = [
    {
        id: 1,
        title: "The Morning Dilemma",
        description: "It's 6 AM. You have two precious hours before your classes/work start. How do you invest this time?",
        choices: [
            {
                id: 'code',
                label: 'Grind LeetCode & Algorithms',
                cost: { money: 0, time: 2 }, // Hours
                impact: {
                    skills: 5,
                    network: 0,
                    alignment: { swe: 15, startup: 5, fire: 0 }
                },
                consequence: "You solved 3 medium-level problems. Your logical thinking sharpened significantly.",
                alternate: "If you had slept in, you'd feel rested but would have missed a crucial skill-building window."
            },
            {
                id: 'side_project',
                label: 'Work on your SaaS Idea',
                cost: { money: 50, time: 2 }, // Server costs
                impact: {
                    skills: 3,
                    network: 0,
                    alignment: { swe: 5, startup: 20, fire: 5 }
                },
                consequence: "You built a new landing page. It's ugly, but it's live.",
                alternate: "Ignoring your idea would save ₹50, but your dream would remain just a dream."
            },
            {
                id: 'sleep',
                label: 'Sleep in & Save Energy',
                cost: { money: 0, time: 0 },
                impact: {
                    skills: -1,
                    network: 0,
                    alignment: { swe: -2, startup: -2, fire: 0 }
                },
                consequence: "You feel refreshed, but guilty. The world moved forward while you dreamt.",
                alternate: "Working now would have been exhausting, but discipline builds empires."
            }
        ]
    },
    {
        id: 2,
        title: "The Tech Meetup",
        description: "There's a local tech mixer tonight. Ticket is ₹500. You're tired and broke.",
        choices: [
            {
                id: 'go_network',
                label: 'Buy Ticket & Go Network',
                cost: { money: 500, time: 4 },
                impact: {
                    skills: 2,
                    network: 20,
                    alignment: { swe: 10, startup: 25, fire: -5 }
                },
                consequence: "You met a potential co-founder and got added to an exclusive invite-only group.",
                alternate: "Staying home saves ₹500, but your network remains stagnant."
            },
            {
                id: 'stay_home',
                label: 'Stay Home & Read Finance Books',
                cost: { money: 0, time: 2 },
                impact: {
                    skills: 5,
                    network: 0,
                    alignment: { swe: 0, startup: 5, fire: 15 }
                },
                consequence: "You learned about Index Funds and compounding. Your financial IQ increased.",
                alternate: "The mixer could have changed your career trajectory with one handshake."
            }
        ]
    },
    {
        id: 3,
        title: "The Job Offer",
        description: "You got an offer for a stable corporate job paying ₹60k/mo, but it's boring legacy code.",
        choices: [
            {
                id: 'accept_job',
                label: 'Accept the Stable Job',
                cost: { money: 0, time: 40 }, // Hours/week implied
                impact: {
                    skills: 2,
                    network: 5,
                    alignment: { swe: 10, startup: -10, fire: 20 }
                },
                consequence: "Stable income secures your FIRE goals, but your startup dreams take a backseat.",
                alternate: "Rejecting it would keep you hungry, but financial stress kills creativity."
            },
            {
                id: 'reject_job',
                label: 'Reject & Bootstrap Startup',
                cost: { money: 5000, time: 60 }, // Burn rate
                impact: {
                    skills: 10,
                    network: 10,
                    alignment: { swe: 5, startup: 30, fire: -10 }
                },
                consequence: "You're burning cash, but you feel alive. You learned React and Marketing in one week.",
                alternate: "The corporate job was safe. This path is terrifying but potentially limitless."
            }
        ]
    }
];
