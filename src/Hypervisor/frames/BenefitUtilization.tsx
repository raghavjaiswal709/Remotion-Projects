import { motion } from "framer-motion";
import { TrendingUp, XCircle, ArrowDown, CheckCircle2 } from "lucide-react";
import React from "react";

export const BenefitUtilization: React.FC = () => {
    return (
        <motion.div
            key="frame18"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <TrendingUp className="w-10 h-10 text-green-400" />
                    <h2 className="text-2xl font-black uppercase text-green-400">Benefit 1</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-2 border-green-500 bg-green-500/10 rounded-xl p-6 shadow-lg shadow-green-500/20 space-y-5"
                >
                    <h3 className="text-3xl font-black text-green-400 uppercase leading-tight text-center">Better Resource<br />Utilization</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <span className="text-base text-zinc-400">Before</span>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-black text-red-400">15%</span>
                                <XCircle className="w-6 h-6 text-red-400" />
                            </div>
                        </div>
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <ArrowDown className="w-8 h-8 mx-auto text-green-400" />
                        </motion.div>
                        <div className="flex items-center justify-between bg-green-500/20 border-2 border-green-500/40 rounded-lg p-4">
                            <span className="text-base text-zinc-400">With Hypervisor</span>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-black text-green-400">80%</span>
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                            </div>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-green-500/20 border border-green-500/40 rounded-lg p-4"
                    >
                        <p className="text-sm font-bold text-green-300 leading-relaxed text-center">One server now does<br />the work of 5-10 servers</p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};
