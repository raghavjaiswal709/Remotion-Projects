import { motion } from "framer-motion";
import { Server, Box, DollarSign } from "lucide-react";
import React from "react";

export const OneAppPerServer: React.FC = () => {
    return (
        <motion.div
            key="frame5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-3">
                    <h2 className="text-4xl font-black uppercase text-white drop-shadow-lg">Old Way</h2>
                    <p className="text-lg text-zinc-400 font-medium">One App per Physical Server</p>
                </div>
                <div className="space-y-5">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="border-3 border-zinc-700 bg-zinc-900/60 rounded-2xl p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <Server className="w-14 h-14 text-zinc-500" />
                            <span className="text-base text-zinc-500 uppercase font-bold tracking-wider">Physical Server</span>
                        </div>
                        <div className="h-1 bg-zinc-800 w-full" />
                        <div className="bg-blue-600/20 border-2 border-blue-500/50 rounded-xl p-5 flex flex-col items-center gap-3">
                            <Box className="w-12 h-12 text-blue-400" />
                            <div className="text-2xl text-blue-300 font-black">App A</div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="border-3 border-zinc-700 bg-zinc-900/60 rounded-2xl p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <Server className="w-14 h-14 text-zinc-500" />
                            <span className="text-base text-zinc-500 uppercase font-bold tracking-wider">Physical Server</span>
                        </div>
                        <div className="h-1 bg-zinc-800 w-full" />
                        <div className="bg-purple-600/20 border-2 border-purple-500/50 rounded-xl p-5 flex flex-col items-center gap-3">
                            <Box className="w-12 h-12 text-purple-400" />
                            <div className="text-2xl text-purple-300 font-black">App B</div>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="border-2 border-red-500 bg-red-500/10 rounded-xl p-4"
                >
                    <div className="flex items-center justify-center gap-3">
                        <DollarSign className="w-10 h-10 text-red-400" />
                        <p className="text-lg font-bold text-red-300">Need 10 apps? Buy 10 servers!</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
