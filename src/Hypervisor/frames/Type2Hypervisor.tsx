import { motion } from "framer-motion";
import { Server, ArrowDown, Settings, Layers, Box, AlertTriangle } from "lucide-react";
import React from "react";

export const Type2Hypervisor: React.FC = () => {
    return (
        <motion.div
            key="frame17"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="text-sm uppercase tracking-wider text-zinc-500">Hypervisor Types</div>
                    <h2 className="text-3xl font-black uppercase text-blue-400">Type 2<br />Hosted</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-2 border-blue-500 bg-blue-500/10 rounded-xl p-5 shadow-lg shadow-blue-500/20 space-y-4"
                >
                    <div className="space-y-3">
                        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-center">
                            <Server className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
                            <div className="text-sm text-zinc-400 font-bold">Hardware</div>
                        </div>
                        <ArrowDown className="w-8 h-8 mx-auto text-blue-400" />
                        <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-3 text-center">
                            <Settings className="w-10 h-10 mx-auto text-blue-400 mb-2" />
                            <div className="text-lg font-bold text-blue-300">Host OS</div>
                            <div className="text-xs text-blue-400">Windows/Mac/Linux</div>
                        </div>
                        <ArrowDown className="w-8 h-8 mx-auto text-cyan-400" />
                        <div className="bg-cyan-500/20 border-2 border-cyan-500/40 rounded-lg p-3 text-center">
                            <Layers className="w-8 h-8 mx-auto text-cyan-400 mb-2" />
                            <div className="text-lg font-bold text-cyan-300 uppercase">Hypervisor</div>
                            <div className="text-xs text-cyan-400">Runs as application</div>
                        </div>
                        <ArrowDown className="w-8 h-8 mx-auto text-purple-400" />
                        <div className="grid grid-cols-2 gap-2">
                            {[0, 1].map((i) => (
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
                        className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
                    >
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            <p className="text-sm font-bold text-yellow-300">Easier to use, slower</p>
                        </div>
                    </motion.div>
                </motion.div>
                <div className="text-xs text-zinc-600 text-center italic">Examples: VirtualBox, VMware Workstation</div>
            </div>
        </motion.div>
    );
};
