import { motion } from "framer-motion";
import { Shield, Box, CheckCircle2 } from "lucide-react";
import React from "react";

export const BenefitIsolation: React.FC = () => {
    return (
        <motion.div
            key="frame19"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <Shield className="w-10 h-10 text-blue-400" />
                    <h2 className="text-2xl font-black uppercase text-blue-400">Benefit 2</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-2 border-blue-500 bg-blue-500/10 rounded-xl p-6 shadow-lg shadow-blue-500/20 space-y-5"
                >
                    <h3 className="text-3xl font-black text-blue-400 uppercase leading-tight text-center">Complete<br />Isolation</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((vm, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + i * 0.2 }}
                                className="bg-zinc-900/50 border-2 border-zinc-700 rounded-xl p-3 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Box className="w-6 h-6 text-blue-400" />
                                        <span className="text-base font-bold text-zinc-400">VM {vm}</span>
                                    </div>
                                    <Shield className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="text-xs text-zinc-600 italic">Cannot see or affect other VMs</div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            <p className="text-sm font-bold text-blue-300">If one crashes</p>
                        </div>
                        <p className="text-sm text-zinc-400 pl-7">Others keep running normally</p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};
