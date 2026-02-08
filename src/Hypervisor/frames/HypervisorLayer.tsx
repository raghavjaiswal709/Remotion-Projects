import { motion } from "framer-motion";
import { Server, Layers } from "lucide-react";
import React from "react";

export const HypervisorLayer: React.FC = () => {
    return (
        <motion.div
            key="frame10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-5">
                <div className="text-center text-xl uppercase tracking-[0.2em] text-zinc-500 font-bold">Layer 2: The Manager</div>
                <div className="space-y-4">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="border-3 border-zinc-700 bg-zinc-900/70 rounded-2xl p-4"
                    >
                        <div className="flex items-center justify-center gap-3 text-zinc-500">
                            <Server className="w-8 h-8" />
                            <span className="text-lg font-bold uppercase tracking-wider">Hardware</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center gap-6 h-8"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                className="w-1.5 h-full bg-gradient-to-t from-zinc-700 to-cyan-500 rounded-full"
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative"
                    >
                        <motion.div
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl"
                        />
                        <div className="relative border-3 border-cyan-400 bg-gradient-to-br from-cyan-900/60 to-blue-900/60 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                            <div className="text-center space-y-3">
                                <Layers className="w-16 h-16 mx-auto text-cyan-200 drop-shadow-glow" />
                                <div className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-md">HYPERVISOR</div>
                                <div className="text-sm text-cyan-300 uppercase tracking-[0.2em] font-bold">The Magic Glass Layer</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex justify-center gap-6 h-8"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 + 0.5 }}
                                className="w-1.5 h-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full"
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
