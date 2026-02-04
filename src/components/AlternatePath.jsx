import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Split } from 'lucide-react';

export default function AlternatePath({ alternateText, onDismiss }) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="mt-6 border-t border-white/10 pt-6">
            {!revealed ? (
                <button
                    onClick={() => setRevealed(true)}
                    className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-400 hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2"
                >
                    <Split size={16} />
                    See the Road Not Taken?
                </button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-slate-900/50 p-4 rounded-xl border-l-2 border-slate-500"
                >
                    <h4 className="text-xs text-slate-500 uppercase mb-1 font-bold">Alternate Reality</h4>
                    <p className="text-slate-300 italic text-sm">
                        "{alternateText}"
                    </p>
                    <button
                        onClick={onDismiss}
                        className="mt-3 text-xs text-brand-primary hover:underline"
                    >
                        Continue Journey →
                    </button>
                </motion.div>
            )}
        </div>
    );
}
