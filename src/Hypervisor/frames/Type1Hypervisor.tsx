import { motion } from "framer-motion";
import { Server, ArrowDown, Layers, Box, CheckCircle2 } from "lucide-react";
import React from "react";

export const Type1Hypervisor: React.FC = () => {
    return (
        <motion.div
            key="frame16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="text-sm uppercase tracking-wider text-zinc-500">Hypervisor Types</div>
                    <h2 className="text-3xl font-black uppercase text-cyan-400">Type 1<br />Bare Metal</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-2 border-cyan-500 bg-cyan-500/10 rounded-xl p-5 shadow-lg shadow-cyan-500/20 space-y-4"
                >
                    <div className="space-y-3">
                        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-center">
                            <Server className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
                            <div className="text-sm text-zinc-400 font-bold">Hardware</div>
                        </div>
                        <ArrowDown className="w-8 h-8 mx-auto text-cyan-400" />
                        <div className="bg-cyan-500/20 border-2 border-cyan-500/40 rounded-lg p-3 text-center">
                            <Layers className="w-10 h-10 mx-auto text-cyan-400 mb-2" />
                            <div className="text-lg font-bold text-cyan-300 uppercase">Hypervisor</div>
                            <div className="text-xs text-cyan-400">Runs directly on hardware</div>
                        </div>
                        <ArrowDown className="w-8 h-8 mx-auto text-purple-400" />
                        <div className="grid grid-cols-3 gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                    className="bg-purple-500/20 border border-purple-500/40 rounded-lg p-3"
                                >
                                    <Box className="w-6 h-6 mx-auto text-purple-400 mb-1" />
                                    <div className="text-xs text-purple-400">VM</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-3"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <p className="text-sm font-bold text-green-300">Better Performance</p>
                        </div>
                    </motion.div>
                </motion.div>
                <div className="text-xs text-zinc-600 text-center italic">Examples: VMware ESXi, Microsoft Hyper-V, KVM</div>
            </div>
        </motion.div>
    );
};
