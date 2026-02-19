import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ClickSpark = () => {
    const [sparks, setSparks] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            const newSpark = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
            };
            setSparks((prev) => [...prev, newSpark]);

            // Cleanup spark after animation
            setTimeout(() => {
                setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
            }, 800);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {sparks.map((spark) => (
                    <motion.div
                        key={spark.id}
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            left: spark.x,
                            top: spark.y,
                            width: '40px',
                            height: '40px',
                            transform: 'translate(-50%, -50%)',
                        }}
                        className="rounded-full"
                    >
                        {/* Inner Core */}
                        <div className="absolute inset-0 bg-cyan-400 rounded-full blur-sm opacity-60"></div>
                        {/* Outer Ring */}
                        <div className="absolute inset-[-20px] border-2 border-cyan-500 rounded-full opacity-40"></div>
                        {/* Shockwave */}
                        <div className="absolute inset-[-40px] border border-blue-500 rounded-full opacity-20"></div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ClickSpark;
