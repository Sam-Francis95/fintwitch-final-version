import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import useGameStore from "../store/useGameStore";

// ---------- Tools Area (Premium Redesign) ----------
export default function ToolsArea() {
    const { user } = useContext(UserContext);
    const { level } = useGameStore();

    // ... (State logic unchanged) ...
    const [income, setIncome] = useState("");
    const [expenseSplitResult, setExpenseSplitResult] = useState(null);
    // Level 2 States
    const [efExpenses, setEfExpenses] = useState("");
    const [efSavings, setEfSavings] = useState("");
    const [efResult, setEfResult] = useState(null);
    const [sgAmount, setSgAmount] = useState("");
    const [sgMonths, setSgMonths] = useState("");
    const [sgResult, setSgResult] = useState("");
    // Level 4 States
    const [lsAmount, setLsAmount] = useState("");
    const [lsRate, setLsRate] = useState("");
    const [lsYears, setLsYears] = useState("");
    const [lsResult, setLsResult] = useState("");
    // Level 6 States
    const [wAge, setWAge] = useState("");
    const [wIncome, setWIncome] = useState("");
    const [wNetWorth, setWNetWorth] = useState("");
    const [wSavingsRate, setWSavingsRate] = useState("");
    const [wResult, setWResult] = useState(null);

    const [fireCorpus, setFireCorpus] = useState("");
    const [tax, setTax] = useState("");
    const [fireResult, setFireResult] = useState("");
    const [taxResult, setTaxResult] = useState("");
    const [sipInvestment, setSipInvestment] = useState("");
    const [sipRate, setSipRate] = useState("");
    const [sipYears, setSipYears] = useState("");
    const [sipResult, setSipResult] = useState("");
    const [emiLoan, setEmiLoan] = useState("");
    const [emiRate, setEmiRate] = useState("");
    const [emiYears, setEmiYears] = useState("");
    const [emiResult, setEmiResult] = useState("");
    const [infAmount, setInfAmount] = useState("");
    const [infRate, setInfRate] = useState("");
    const [infYears, setInfYears] = useState("");
    const [inflationResult, setInflationResult] = useState("");
    const [retStart, setRetStart] = useState("");
    const [retEnd, setRetEnd] = useState("");
    const [retYears, setRetYears] = useState("");
    const [returnResult, setReturnResult] = useState("");

    // Logic functions
    const calcExpenseSplit = () => {
        const val = parseFloat(income || 0);
        if (!val) return setExpenseSplitResult(null);

        const needs = val * 0.50;
        const wants = val * 0.30;
        const savings = val * 0.20;

        setExpenseSplitResult({ needs, wants, savings });
    };

    const calcFire = () => {
        const val = 25 * parseFloat(fireCorpus || 0);
        setFireResult(val ? `Required corpus: ₹${val.toLocaleString()}` : "Enter your annual expenses");
    };
    const calcTax = () => {
        const taxable = parseFloat(tax || 0);
        const result = taxable * 0.05; // Simplified logic
        setTaxResult(`Tax Payable: ₹${result.toLocaleString()}`);
    };
    const calcSIP = () => {
        /* ... logic unchanged ... */
        const investment = parseFloat(sipInvestment || 0);
        const rate = parseFloat(sipRate || 0);
        const years = parseFloat(sipYears || 0);
        if (!investment || !rate || !years) return setSipResult("Fill all fields");
        const monthlyRate = rate / 12 / 100;
        const months = years * 12;
        const futureValue = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        setSipResult(`Future Value: ₹${futureValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`);
    };
    const calcEMI = () => {
        const loan = parseFloat(emiLoan || 0);
        const rate = parseFloat(emiRate || 0);
        const years = parseFloat(emiYears || 0);
        if (!loan || !rate || !years) return setEmiResult(null); // Or error string? keeping null for cleaner UI reset if valid needed

        const monthlyRate = rate / 12 / 100;
        const months = years * 12;
        const emi = (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const total = emi * months;
        const interest = total - loan;

        setEmiResult({
            emi,
            principal: loan,
            interest,
            total,
            interestRatio: (interest / total) * 100
        });
    };
    const calcInflation = () => {
        /* ... logic unchanged ... */
        const amount = parseFloat(infAmount || 0);
        const rate = parseFloat(infRate || 0);
        const years = parseFloat(infYears || 0);
        if (!amount || !rate || !years) return setInflationResult("Fill all fields");
        const reduced = amount / Math.pow(1 + rate / 100, years);
        setInflationResult(`Value: ₹${reduced.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`);
    };
    const calcReturn = () => {
        /* ... logic unchanged ... */
        const start = parseFloat(retStart || 0);
        const end = parseFloat(retEnd || 0);
        const years = parseFloat(retYears || 0);
        if (!start || !end || !years) return setReturnResult("Please fill all fields");
        const cagr = ((end / start) ** (1 / years) - 1) * 100;
        setReturnResult(`CAGR: ${cagr.toFixed(2)}%`);
    };


    // Level 2 Functions
    const calcEmergency = () => {
        const exp = parseFloat(efExpenses || 0);
        const sav = parseFloat(efSavings || 0);
        if (!exp) return setEfResult(null);

        const target = exp * 6;
        const gap = target - sav;
        const runway = sav / exp;

        setEfResult({ target, gap, runway });
    };

    const calcSavingsGoal = () => {
        const amt = parseFloat(sgAmount || 0);
        const mth = parseFloat(sgMonths || 0);
        if (!amt || !mth) return setSgResult("Enter valid numbers");

        const monthly = amt / mth;
        setSgResult(`Save ₹${monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })} / month`);
    };

    const calcLumpSum = () => {
        const p = parseFloat(lsAmount || 0);
        const r = parseFloat(lsRate || 0);
        const n = parseFloat(lsYears || 0);
        if (!p || !r || !n) return setLsResult("Fill all fields");

        // FV = P * (1 + r/100)^n
        const fv = p * Math.pow(1 + r / 100, n);
        const gain = fv - p;
        const savingsFV = p * Math.pow(1 + 0.03, n); // 3% savings acct comparison

        // simple text result for now, can enhance
        setLsResult(`Future Value: ₹${fv.toLocaleString(undefined, { maximumFractionDigits: 0 })} (+₹${gain.toLocaleString()})`);
    };

    const calcWealth = () => {
        const age = parseFloat(wAge || 0);
        const nw = parseFloat(wNetWorth || 0);
        const inc = parseFloat(wIncome || 0);
        const rate = parseFloat(wSavingsRate || 0);

        if (!age || !inc || !rate) return setWResult(null);

        const monthlySavings = inc * (rate / 100);
        const annualSavings = monthlySavings * 12;
        const returnRate = 0.10; // Assume 10% market return

        // 10 year projection
        let currentNW = nw;
        for (let i = 0; i < 10; i++) {
            currentNW = (currentNW + annualSavings) * (1 + returnRate);
        }

        // 20 year projection
        let nw20 = nw;
        for (let i = 0; i < 20; i++) {
            nw20 = (nw20 + annualSavings) * (1 + returnRate);
        }

        setWResult({
            projected10y: currentNW,
            projected20y: nw20,
            monthlySavings
        });
    };

    // Level Requirements
    const TOOL_LEVELS = {
        'expense_splitter': 1,
        'emergency_fund': 2,
        'savings_goal': 3,
        'fire': 4,
        'tax': 4,
        'sip': 5,
        'lump_sum': 5,
        'emi': 5,
        'inflation': 6,
        'return': 6,
        'wealth_dashboard': 7
    };

    const ToolCard = ({ title, icon, unlockedKey, inputs, action, result }) => {
        const requiredLevel = TOOL_LEVELS[unlockedKey] || 1;
        // Unlock if level is met OR if user is in 'financial_tools' mode
        const isUnlocked = level >= requiredLevel || user?.mode === 'financial_tools';

        return (
            <div className={`card-glass p-6 relative transition-all duration-300 ${!isUnlocked ? 'opacity-80 grayscale-[0.5]' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-brand-primary">{icon}</span> {title}
                    </h3>
                    {!isUnlocked ? (
                        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-red-400 border border-red-500/20">
                            🔒 Requires Lvl {requiredLevel}
                        </span>
                    ) : (
                        <span className="text-xs bg-brand-dark px-2 py-1 rounded text-brand-success border border-brand-success/20">
                            Unlocked
                        </span>
                    )}
                </div>

                {isUnlocked ? (
                    <div className="space-y-3">
                        {inputs}
                        <button onClick={action} className="w-full btn-primary py-2 text-sm mt-2">Calculate</button>
                        {result && (
                            <div className="mt-3 p-3 bg-brand-surface rounded-lg border border-brand-primary/20">
                                <p className="text-brand-accent font-mono font-bold text-sm">{result}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-4 bg-black/20 rounded-lg">
                        <p className="text-sm text-slate-400 mb-2">Advance your career to unlock this tool.</p>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-[120px]">
                            <div className="bg-red-500 h-full" style={{ width: `${(level / requiredLevel) * 100}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">{level} / {requiredLevel} Level</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Financial Tools 🧮</h2>
                <p className="text-slate-400">Pro-grade calculators to plan your wealth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Level 6 Tool (Wealth Dashboard) */}
                <ToolCard
                    title="Wealth Projections"
                    icon="💎"
                    unlockedKey="wealth_dashboard"
                    action={calcWealth}
                    result={wResult ? (
                        <div className="space-y-3 mt-2">
                            <div className="p-3 bg-brand-surface rounded border border-brand-primary/20 text-center">
                                <p className="text-slate-400 text-[10px] uppercase">Net Worth in 10 Years</p>
                                <p className="text-xl font-bold text-brand-accent">₹{Math.round(wResult.projected10y).toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-brand-surface rounded border border-white/5 text-center">
                                <p className="text-slate-400 text-[10px] uppercase">Net Worth in 20 Years</p>
                                <p className="text-lg font-bold text-white">₹{Math.round(wResult.projected20y).toLocaleString()}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 text-center">Assumes 10% annual return on savings.</p>
                        </div>
                    ) : null}
                    inputs={
                        <>
                            <input type="number" placeholder="Current Age" value={wAge} onChange={e => setWAge(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Net Worth (₹)" value={wNetWorth} onChange={e => setWNetWorth(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Monthly Income (₹)" value={wIncome} onChange={e => setWIncome(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Savings Rate (%)" value={wSavingsRate} onChange={e => setWSavingsRate(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white" />
                        </>
                    }
                />

                {/* Level 1 Tool */}
                <ToolCard
                    title="Expense Splitter"
                    icon="💸"
                    unlockedKey="expense_splitter"
                    action={calcExpenseSplit}
                    result={expenseSplitResult ? (
                        <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Needs (50%)</span> <span>₹{expenseSplitResult.needs.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-blue-500 h-full" style={{ width: '50%' }}></div>
                            </div>
                            {/* ... bars ... */}
                            <p className="text-[10px] text-slate-500 mt-2 text-center">Standard 50-30-20 Rule</p>
                        </div>
                    ) : null}
                    inputs={
                        <input type="number" placeholder="Monthly Income (₹)" value={income} onChange={e => setIncome(e.target.value)}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none" />
                    }
                />

                {/* Level 2 Tools (Bundled under emergency_fund key) */}
                <ToolCard
                    title="Emergency Fund"
                    icon="🆘"
                    unlockedKey="emergency_fund"
                    action={calcEmergency}
                    result={efResult ? (
                        <div className="text-xs space-y-1">
                            <p>Target (6mo): <span className="text-white font-bold">₹{efResult.target.toLocaleString()}</span></p>
                            <p>Current Runway: <span className={efResult.runway < 3 ? "text-red-400" : "text-brand-success"}>{efResult.runway.toFixed(1)} months</span></p>
                            {efResult.gap > 0 && <p className="text-slate-400">Shortfall: ₹{efResult.gap.toLocaleString()}</p>}
                        </div>
                    ) : null}
                    inputs={
                        <>
                            <input type="number" placeholder="Monthly Expenses (₹)" value={efExpenses} onChange={e => setEfExpenses(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Current Savings (₹)" value={efSavings} onChange={e => setEfSavings(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white" />
                        </>
                    }
                />

                <ToolCard
                    title="Savings Goal"
                    icon="🎯"
                    unlockedKey="emergency_fund"
                    action={calcSavingsGoal}
                    result={sgResult}
                    inputs={
                        <>
                            <input type="number" placeholder="Goal Amount (₹)" value={sgAmount} onChange={e => setSgAmount(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Months to achieve" value={sgMonths} onChange={e => setSgMonths(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white" />
                        </>
                    }
                />

                <ToolCard
                    title="FIRE Calculator"
                    icon="💸"
                    unlockedKey="expense_splitter"
                    action={calcExpenseSplit}
                    result={expenseSplitResult ? (
                        <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Needs (50%)</span> <span>₹{expenseSplitResult.needs.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-blue-500 h-full" style={{ width: '50%' }}></div>
                            </div>

                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Wants (30%)</span> <span>₹{expenseSplitResult.wants.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-purple-500 h-full" style={{ width: '30%' }}></div>
                            </div>

                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Savings (20%)</span> <span>₹{expenseSplitResult.savings.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-green-500 h-full" style={{ width: '20%' }}></div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 text-center">Standard 50-30-20 Rule</p>
                        </div>
                    ) : null}
                    inputs={
                        <input type="number" placeholder="Monthly Income (₹)" value={income} onChange={e => setIncome(e.target.value)}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none" />
                    }
                />

                <ToolCard
                    title="FIRE Calculator"
                    icon="🔥"
                    unlockedKey="fire"
                    action={calcFire}
                    result={fireResult}
                    inputs={
                        <input type="number" placeholder="Annual Expenses (₹)" value={fireCorpus} onChange={e => setFireCorpus(e.target.value)}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none" />
                    }
                />

                <ToolCard
                    title="Tax Estimator"
                    icon="📋"
                    unlockedKey="tax"
                    action={calcTax}
                    result={taxResult}
                    inputs={
                        <input type="number" placeholder="Taxable Income (₹)" value={tax} onChange={e => setTax(e.target.value)}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none" />
                    }
                />

                <ToolCard
                    title="CAGR Return"
                    icon="📈"
                    unlockedKey="return"
                    action={calcReturn}
                    result={returnResult}
                    inputs={
                        <>
                            <input type="number" placeholder="Start Value (₹)" value={retStart} onChange={e => setRetStart(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2 focus:border-brand-primary outline-none" />
                            <input type="number" placeholder="End Value (₹)" value={retEnd} onChange={e => setRetEnd(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2 focus:border-brand-primary outline-none" />
                            <input type="number" placeholder="Duration (Years)" value={retYears} onChange={e => setRetYears(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none" />
                        </>
                    }
                />

                <ToolCard
                    title="SIP Planner"
                    icon="🌱"
                    unlockedKey="sip"
                    action={calcSIP}
                    result={sipResult}
                    inputs={
                        <>
                            <input type="number" placeholder="Monthly Investment (₹)" value={sipInvestment} onChange={e => setSipInvestment(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Exp. Return (%)" value={sipRate} onChange={e => setSipRate(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Duration (Years)" value={sipYears} onChange={e => setSipYears(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white" />
                        </>
                    }
                />

                <ToolCard
                    title="Lump Sum Growth"
                    icon="💰"
                    unlockedKey="sip"
                    action={calcLumpSum}
                    result={lsResult}
                    inputs={
                        <>
                            <input type="number" placeholder="Investment Amount (₹)" value={lsAmount} onChange={e => setLsAmount(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Exp. Return (%)" value={lsRate} onChange={e => setLsRate(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Duration (Years)" value={lsYears} onChange={e => setLsYears(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white" />
                        </>
                    }
                />

                <ToolCard
                    title="Loan EMI"
                    icon="🏠"
                    unlockedKey="emi"
                    action={calcEMI}
                    result={emiResult ? (
                        <div className="space-y-3 mt-2">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 text-xs">Monthly EMI</span>
                                <span className="text-xl font-bold text-white">₹{Math.round(emiResult.emi).toLocaleString()}</span>
                            </div>

                            {/* Visual Bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider">
                                    <span>Principal</span>
                                    <span>Interest ({Math.round(emiResult.interestRatio)}%)</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
                                    <div className="bg-blue-500 h-full" style={{ width: `${100 - emiResult.interestRatio}%` }}></div>
                                    <div className="bg-red-500 h-full" style={{ width: `${emiResult.interestRatio}%` }}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 bg-brand-dark rounded border border-white/5">
                                    <div className="text-slate-500">Principal</div>
                                    <div className="text-blue-400 font-bold">₹{emiResult.principal.toLocaleString()}</div>
                                </div>
                                <div className="p-2 bg-brand-dark rounded border border-white/5">
                                    <div className="text-slate-500">Interest</div>
                                    <div className="text-red-400 font-bold">₹{emiResult.interest.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex justify-between text-xs">
                                <span className="text-slate-400">Total Payable</span>
                                <span className="text-brand-accent font-bold">₹{emiResult.total.toLocaleString()}</span>
                            </div>
                        </div>
                    ) : null}
                    inputs={
                        <>
                            <input type="number" placeholder="Loan Amount (₹)" value={emiLoan} onChange={e => setEmiLoan(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Interest Rate (%)" value={emiRate} onChange={e => setEmiRate(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Tenure (Years)" value={emiYears} onChange={e => setEmiYears(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white" />
                        </>
                    }
                />

                <ToolCard
                    title="Inflation Check"
                    icon="🎈"
                    unlockedKey="inflation"
                    action={calcInflation}
                    result={inflationResult}
                    inputs={
                        <>
                            <input type="number" placeholder="Amount (₹)" value={infAmount} onChange={e => setInfAmount(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Inflation Rate (%)" value={infRate} onChange={e => setInfRate(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white mb-2" />
                            <input type="number" placeholder="Years" value={infYears} onChange={e => setInfYears(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg p-2 text-sm text-white" />
                        </>
                    }
                />

            </div>
        </div>
    );
}
