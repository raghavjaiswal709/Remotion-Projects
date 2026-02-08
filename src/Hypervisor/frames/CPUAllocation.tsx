import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import React from "react";

export const CPUAllocation: React.FC = () => {
    return (
        <motion.div
            key="frame13"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <Cpu className="w-10 h-10 text-blue-400" />
                    <h2 className="text-2xl font-black uppercase text-blue-400">CPU Cores</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-5 space-y-4"
                >
                    <div className="text-center space-y-2">
                        <div className="text-sm text-blue-400 uppercase">Physical Server Has</div>
                        <div className="text-5xl font-black text-blue-400">8</div>
                        <div className="text-base text-blue-300">CPU Cores</div>
                    </div>
                    <div className="h-px bg-blue-500/30" />
                    <div className="space-y-3">
                        <div className="text-sm text-zinc-500 uppercase text-center">Hypervisor Assigns</div>
                        {[
                            { vm: 'VM 1', cores: 3, color: 'blue' },
                            { vm: 'VM 2', cores: 2, color: 'green' },
                            { vm: 'VM 3', cores: 3, color: 'purple' }
                        ].map((allocation, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.3 }}
                                className="flex items-center justify-between bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                            >
                                <span className="text-base font-bold text-zinc-400">{allocation.vm}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[...Array(allocation.cores)].map((_, j) => (
                                            <motion.div
                                                key={j}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5 + i * 0.3 + j * 0.1 }}
                                                className="w-4 h-4 rounded-sm"
                                                style={{ backgroundColor: `rgb(${allocation.color === 'blue' ? '59, 130, 246' : allocation.color === 'green' ? '34, 197, 94' : '168, 85, 247'})` }}
                                            />
                                        ))}
                                    </div>
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: `rgb(${allocation.color === 'blue' ? '96, 165, 250' : allocation.color === 'green' ? '134, 239, 172' : '192, 132, 252'})` }}
                                    >
                                        {allocation.cores} cores
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
