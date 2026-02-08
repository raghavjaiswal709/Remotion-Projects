import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import React from "react";

export const HypervisorDesc: React.FC = () => {
    return (
        <motion.div
            key="frame7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-10">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="relative"
                >
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-[60px]"
                    />
                    <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border-2 border-cyan-500/50 shadow-2xl">
                        <Layers className="w-16 h-16 text-cyan-400" strokeWidth={2} />
                    </div>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6 text-center"
                >
                    <div className="space-y-3">
                        <h2 className="text-5xl font-black uppercase leading-none tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 filter drop-shadow-lg">HYPERVISOR</span>
                        </h2>
                        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-cyan-900/40 border-2 border-cyan-500/40 rounded-2xl p-6 backdrop-blur-md"
                    >
                        <p className="text-2xl font-bold text-cyan-100 leading-relaxed">
                            A Software Layer That<br />Sits Between <span className="text-amber-400">Hardware</span><br />and <span className="text-purple-400">Virtual Machines</span>
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-lg text-zinc-400 italic font-medium"
                    >
                        Think of it as a super smart manager
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};
