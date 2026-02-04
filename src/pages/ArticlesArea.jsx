import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";
import { fetchPolicyNews } from "../services/PolicyService";
import { Newspaper, Bell, ExternalLink, ScrollText } from "lucide-react";

export default function ArticlesArea() {
    const { trackDailyAction } = useContext(UserContext);
    const { push } = useContext(ToastContext);

    const [policyNews, setPolicyNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);

    // Fetch Policy News
    useEffect(() => {
        async function loadNews() {
            setLoadingNews(true);
            const news = await fetchPolicyNews(10);
            setPolicyNews(news);
            setLoadingNews(false);
        }
        loadNews();
    }, []);

    const resourceLibrary = [
        {
            level: 1,
            title: "Basics of Money",
            resources: [
                {
                    source: "Investopedia",
                    title: "8 Financial Basics for Young Adults",
                    url: "https://www.investopedia.com/articles/younginvestors/08/eight-steps-to-financial-success.asp",
                    summary: "Master the fundamental steps to financial success, from budgeting effectively to understanding credit scores and debt."
                }
            ]
        },
        {
            level: 2,
            title: "Saving Habits",
            resources: [
                {
                    source: "Investopedia",
                    title: "Guide to Saving Money",
                    url: "https://www.investopedia.com/saving-money-4689743",
                    summary: "A comprehensive guide on strategies to save money, where to keep your savings, and how to reach your financial potential."
                },
                {
                    source: "Practical Money Skills",
                    title: "Practical Money Skills Hub",
                    url: "https://www.practicalmoneyskills.com",
                    summary: "Interactive tools, games, and calculators designed to help you practice and improve your daily budgeting and saving habits."
                }
            ]
        },
        {
            level: 3,
            title: "Debt & Loans",
            resources: [
                {
                    source: "Consumer Finance",
                    title: "Debt Collection & Tools",
                    url: "https://www.consumerfinance.gov/consumer-tools/debt-collection/",
                    summary: "Official government resources to help you understand your rights, manage debt, and deal with debt collectors safely."
                },
                {
                    source: "Money Under 30",
                    title: "Debt Payoff Strategies",
                    url: "https://moneyunder30.com",
                    summary: "Targeted advice for young adults on how to manage student loans, credit card debt, and build a debt-free future."
                }
            ]
        },
        {
            level: 4,
            title: "Investing Foundations",
            resources: [
                {
                    source: "Indeed",
                    title: "Setting Financial Career Goals",
                    url: "https://www.indeed.com/career-advice/career-development/finance-goals",
                    summary: "Learn how to align your career growth with financial investing goals to maximize your long-term wealth building."
                },
                {
                    source: "NGPF",
                    title: "Investing Curriculum",
                    url: "https://www.ngpf.org/curriculum/investing/",
                    summary: "A structured curriculum explaining stock markets, index funds, and the power of compounding for beginners."
                }
            ]
        },
        {
            level: 5,
            title: "Financial Goal Planning",
            resources: [
                {
                    source: "Smart About Money",
                    title: "Smart About Money",
                    url: "https://www.smartaboutmoney.org",
                    summary: "Guidance on critical life events like buying a house, marriage, and retirement, ensuring your goals are financially backed."
                },
                {
                    source: "FPA",
                    title: "Find a Financial Planner",
                    url: "https://www.plannersearch.org/financial-planning/",
                    summary: "Understand the role of professional financial planning and how to find certified experts to help map your future."
                }
            ]
        }
    ];

    const handleRead = (url) => {
        trackDailyAction('readArticle');
        window.open(url, '_blank');
        push("+10 XP: Knowledge Acquired!", { style: "success" });
    };

    return (
        <div className="max-w-[1440px] mx-auto space-y-8 font-body">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-4">
                <div>
                    <h2 className="text-4xl font-black text-white font-heading tracking-tight">
                        Data Log
                    </h2>
                    <p className="text-slate-400 mt-1">Curated resources to master every level of your financial journey.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Resource Library (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">
                    {resourceLibrary.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                    {section.level}
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{section.title}</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {section.resources.map((res, rIdx) => (
                                    <div
                                        key={rIdx}
                                        className="card-glass p-5 hover:bg-white/5 transition-all group flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">
                                                    {res.source}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                                {res.title}
                                            </h4>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                {res.summary}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRead(res.url)}
                                            className="shrink-0 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:text-white hover:border-blue-500 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                                        >
                                            Read <ExternalLink size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Schemes & Policies (4 Columns) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Newspaper size={20} className="text-emerald-500" />
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider text-sm">Schemes & Policies</h3>
                        </div>
                        <span className="animate-pulse flex items-center gap-1.5 text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 uppercase tracking-tighter">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> LIVE
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {loadingNews ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="card-glass p-4 animate-pulse">
                                    <div className="h-3 w-1/4 bg-white/10 rounded mb-3"></div>
                                    <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                                </div>
                            ))
                        ) : (
                            policyNews.map((news) => (
                                <div key={news.id} className="card-glass p-4 hover:border-emerald-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{news.source}</span>
                                        <span className="text-[10px] text-slate-500">{news.timestamp.split(',')[0]}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                                        {news.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                                        {news.summary}
                                    </p>
                                    <a
                                        href={news.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[10px] font-bold text-slate-200 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                                    >
                                        Read Full Report <ExternalLink size={12} />
                                    </a>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <Bell size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Policy Alerts</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            Government fiscal policies can impact your career trajectory and market returns. Stay informed to maximize your earnings.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
