import { motion } from "framer-motion";
import { Workflow, Server, Box, ArrowRight, CheckCircle2 } from "lucide-react";
import React from "react";

export const LiveMigration: React.FC = () => {
    return (
        <motion.div
            key="frame24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Workflow className="w-12 h-12 mx-auto text-cyan-400" />
                    <h2 className="text-3xl font-black uppercase text-cyan-400">Live Migration</h2>
                    <p className="text-sm text-zinc-500">Advanced Feature</p>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-2 border-cyan-500 bg-cyan-500/10 rounded-xl p-5 shadow-lg shadow-cyan-500/20 space-y-4"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex-1"
                            >
                                <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-center">
                                    <Server className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
                                    <div className="text-sm text-zinc-500">Server 1</div>
                                    <div className="mt-2 bg-blue-500/20 border border-blue-500/40 rounded p-2">
                                        <Box className="w-6 h-6 mx-auto text-blue-400" />
                                        <div className="text-xs text-blue-400">VM</div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ArrowRight className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                            </motion.div>
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex-1"
                            >
                                <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-center">
                                    <Server className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
                                    <div className="text-sm text-zinc-500">Server 2</div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="mt-2 bg-blue-500/20 border border-blue-500/40 rounded p-2"
                                    >
                                        <Box className="w-6 h-6 mx-auto text-blue-400" />
                                        <div className="text-xs text-blue-400">VM</div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 }}
                            className="bg-cyan-500/20 border border-cyan-500/40 rounded-lg p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                                <span className="text-base font-bold text-cyan-300">Zero Downtime</span>
                            </div>
                            <p className="text-sm text-zinc-500 pl-7">Move running VM between servers<br />without stopping it</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
