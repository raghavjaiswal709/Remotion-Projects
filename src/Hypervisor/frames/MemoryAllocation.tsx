import { motion } from "framer-motion";
import { MemoryStick } from "lucide-react";
import React from "react";

export const MemoryAllocation: React.FC = () => {
    return (
        <motion.div
            key="frame14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <MemoryStick className="w-10 h-10 text-green-400" />
                    <h2 className="text-2xl font-black uppercase text-green-400">RAM Memory</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-5 space-y-4"
                >
                    <div className="text-center space-y-2">
                        <div className="text-sm text-green-400 uppercase">Total RAM</div>
                        <div className="text-5xl font-black text-green-400">32GB</div>
                    </div>
                    <div className="h-px bg-green-500/30" />
                    <div className="space-y-3">
                        {[
                            { vm: 'VM 1', ram: '16GB', percent: 50, color: 'blue' },
                            { vm: 'VM 2', ram: '8GB', percent: 25, color: 'green' },
                            { vm: 'VM 3', ram: '8GB', percent: 25, color: 'purple' }
                        ].map((allocation, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.3 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between text-base">
                                    <span className="font-bold text-zinc-400">{allocation.vm}</span>
                                    <span
                                        className="font-black"
                                        style={{ color: `rgb(${allocation.color === 'blue' ? '96, 165, 250' : allocation.color === 'green' ? '134, 239, 172' : '192, 132, 252'})` }}
                                    >
                                        {allocation.ram}
                                    </span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${allocation.percent}%` }}
                                        transition={{ delay: 0.5 + i * 0.3 + 0.3, duration: 0.8 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: `rgb(${allocation.color === 'blue' ? '59, 130, 246' : allocation.color === 'green' ? '34, 197, 94' : '168, 85, 247'})` }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
