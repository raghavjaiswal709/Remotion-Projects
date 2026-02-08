import { motion } from "framer-motion";
import { HardDrive } from "lucide-react";
import React from "react";

export const StorageAllocation: React.FC = () => {
    return (
        <motion.div
            key="frame15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <HardDrive className="w-10 h-10 text-purple-400" />
                    <h2 className="text-2xl font-black uppercase text-purple-400">Storage</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-5 space-y-4"
                >
                    <div className="text-center space-y-2">
                        <div className="text-sm text-purple-400 uppercase">Total Storage</div>
                        <div className="text-5xl font-black text-purple-400">1TB</div>
                    </div>
                    <div className="h-px bg-purple-500/30" />
                    <div className="space-y-3">
                        {[
                            { vm: 'VM 1', storage: '500GB', color: 'blue' },
                            { vm: 'VM 2', storage: '300GB', color: 'green' },
                            { vm: 'VM 3', storage: '200GB', color: 'purple' }
                        ].map((allocation, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.3 }}
                                className="flex items-center justify-between bg-zinc-900/50 border border-zinc-700 rounded-lg p-3"
                            >
                                <div className="flex items-center gap-2">
                                    <HardDrive className="w-5 h-5 text-zinc-600" />
                                    <span className="text-base font-bold text-zinc-400">{allocation.vm}</span>
                                </div>
                                <span
                                    className="text-base font-black"
                                    style={{ color: `rgb(${allocation.color === 'blue' ? '96, 165, 250' : allocation.color === 'green' ? '134, 239, 172' : '192, 132, 252'})` }}
                                >
                                    {allocation.storage}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="bg-purple-500/20 border border-purple-500/40 rounded-lg p-3"
                    >
                        <p className="text-sm text-purple-300 font-bold">Each VM Gets Its Own Virtual Disk</p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};
