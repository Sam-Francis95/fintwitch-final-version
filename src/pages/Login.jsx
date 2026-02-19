import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";

export default function Login() {
    const { signin, signup, resetPassword } = useUser();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isReset, setIsReset] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: ""
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isReset) {
                await resetPassword(formData.email);
                setSuccess("Password reset email sent! Check your inbox.");
            } else if (isLogin) {
                await signin(formData.email, formData.password);
                navigate("/mode-selection");
            } else {
                await signup(formData.email, formData.password, formData.username);
                navigate("/mode-selection");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#020617] via-[#082f49] to-[#000000]">
            {/* Background blobs for aesthetics */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 card-glass relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white mb-2 font-heading tracking-tight">
                        {isReset ? "Reset Password" : (isLogin ? "Welcome Back" : "Join FinTwitch")}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isReset
                            ? "Enter your email to receive a reset link"
                            : (isLogin ? "Enter your credentials to access your portfolio" : "Start your financial legacy today")}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-bold text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && !isReset && (
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        />
                    </div>

                    {!isReset && (
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    )}

                    {isLogin && !isReset && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsReset(true)}
                                className="text-xs text-slate-400 hover:text-white transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 rounded-xl font-bold text-sm tracking-wide mt-6 flex items-center justify-center gap-2 group cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {isReset ? "Send Reset Link" : (isLogin ? "Sign In" : "Create Account")}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {isReset ? (
                        <button
                            onClick={() => setIsReset(false)}
                            className="text-slate-500 text-sm hover:text-white transition-colors"
                        >
                            &larr; Back to Login
                        </button>
                    ) : (
                        <p className="text-slate-500 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-400 font-bold hover:text-blue-300 transition-colors cursor-pointer"
                            >
                                {isLogin ? "Sign Up" : "Log In"}
                            </button>
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
