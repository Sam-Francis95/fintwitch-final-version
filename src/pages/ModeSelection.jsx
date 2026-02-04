import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Calculator } from "lucide-react";

export default function ModeSelection() {
    const { setUser } = useUser();

    const selectMode = (mode) => {
        setUser(prev => ({ ...prev, mode }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#020617] via-[#082f49] to-[#000000] p-6">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 relative z-10"
            >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-heading tracking-tight text-glow-mega">
                    Choose Your Path
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Select how you want to interact with FinTwitch today. You can always switch later.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl w-full relative z-10">

                {/* Option 1: Corporate Career */}
                <Link to="/games" className="group" onClick={() => selectMode('career')}>
                    <motion.div
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-full p-8 card-glass hover:bg-cyan-900/10 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                            <Briefcase size={32} className="text-white" />
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2 font-heading">Enter the World of Finance</h2>
                        <p className="text-slate-400 text-sm mb-4">
                            Step into the high-stakes world of corporate finance. Climb the ladder from a rookie Intern to a legendary CEO, navigating markets, deals, and daily challenges.
                        </p>
                    </motion.div>
                </Link>


                {/* Option 2: Financial Mastery */}
                <Link to="/tools" className="group" onClick={() => selectMode('financial_tools')}>
                    <motion.div
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-full p-8 card-glass hover:bg-orange-900/10 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                            <Calculator size={32} className="text-white" />
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2 font-heading">Master Your Money</h2>
                        <p className="text-slate-400 text-sm mb-4">
                            Take control of your financial destiny. Wield powerful calculators, practice with the Stock Simulator, and build generational wealth with precision.
                        </p>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
