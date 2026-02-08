import { motion } from "framer-motion";
import { Workflow, CheckCircle2 } from "lucide-react";
import React from "react";

export const BenefitFlexibility: React.FC = () => {
    return (
        <motion.div
            key="frame20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <Workflow className="w-10 h-10 text-purple-400" />
                    <h2 className="text-2xl font-black uppercase text-purple-400">Benefit 3</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-2 border-purple-500 bg-purple-500/10 rounded-xl p-6 shadow-lg shadow-purple-500/20 space-y-5"
                >
                    <h3 className="text-3xl font-black text-purple-400 uppercase leading-tight text-center">Ultimate<br />Flexibility</h3>
                    <div className="space-y-3">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                <span className="text-base font-bold text-purple-300">Run Different OS</span>
                            </div>
                            <div className="flex gap-2 pl-7">
                                {['Win', 'Linux', 'Mac'].map((os, i) => (
                                    <div key={i} className="text-xs bg-purple-500/20 px-2 py-1 rounded text-purple-400">{os}</div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                <span className="text-base font-bold text-purple-300">Create VM in Minutes</span>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                <span className="text-base font-bold text-purple-300">Delete Instantly</span>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                <span className="text-base font-bold text-purple-300">Take Snapshots</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
