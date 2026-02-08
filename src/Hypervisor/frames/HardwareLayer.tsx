import { motion } from "framer-motion";
import { Server, Cpu, MemoryStick, HardDrive } from "lucide-react";
import React from "react";

export const HardwareLayer: React.FC = () => {
    return (
        <motion.div
            key="frame9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center text-xl uppercase tracking-[0.2em] text-zinc-500 font-bold">Layer 1: The Base</div>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="border-3 border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl p-6 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] space-y-6"
                >
                    <div className="text-center space-y-4">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Server className="w-24 h-24 mx-auto text-amber-400 drop-shadow-xl" />
                        </motion.div>
                        <h3 className="text-3xl font-black text-amber-400 uppercase tracking-wide">Physical<br />Hardware</h3>
                        <div className="space-y-3 pt-3">
                            <div className="flex items-center justify-center gap-3 text-lg bg-amber-900/30 py-2 rounded-xl border border-amber-500/20">
                                <Cpu className="w-6 h-6 text-amber-400" />
                                <span className="text-amber-200 font-bold">CPU Cores</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-lg bg-amber-900/30 py-2 rounded-xl border border-amber-500/20">
                                <MemoryStick className="w-6 h-6 text-amber-400" />
                                <span className="text-amber-200 font-bold">RAM Memory</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-lg bg-amber-900/30 py-2 rounded-xl border border-amber-500/20">
                                <HardDrive className="w-6 h-6 text-amber-400" />
                                <span className="text-amber-200 font-bold">Storage</span>
                            </div>
                        </div>
                        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-xl p-3 mt-4">
                            <p className="text-base text-amber-300 font-bold">The Real Physical Server</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
