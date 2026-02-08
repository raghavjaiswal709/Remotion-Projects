import { motion } from "framer-motion";
import { Gauge, Zap, BarChart3, Shield } from "lucide-react";
import React from "react";

export const ResourceManagement: React.FC = () => {
    return (
        <motion.div
            key="frame23"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-3">
                    <Gauge className="w-12 h-12 mx-auto text-green-400" />
                    <h2 className="text-3xl font-black uppercase text-center">Smart Resource<br />Management</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-2 border-green-500 bg-green-500/10 rounded-xl p-5 shadow-lg shadow-green-500/20 space-y-4"
                >
                    <div className="space-y-3">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-6 h-6 text-green-400" />
                                <span className="text-base font-bold text-green-300">Dynamic Allocation</span>
                            </div>
                            <p className="text-sm text-zinc-500 pl-8">Adjusts resources in real-time based on demand</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-6 h-6 text-blue-400" />
                                <span className="text-base font-bold text-blue-300">Load Balancing</span>
                            </div>
                            <p className="text-sm text-zinc-500 pl-8">Distributes workload evenly across VMs</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-6 h-6 text-purple-400" />
                                <span className="text-base font-bold text-purple-300">Resource Limits</span>
                            </div>
                            <p className="text-sm text-zinc-500 pl-8">Prevents one VM from hogging all resources</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
