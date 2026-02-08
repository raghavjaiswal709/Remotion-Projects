import { motion } from "framer-motion";
import { Layers, Users, Award } from "lucide-react";
import React from "react";

export const Summary: React.FC = () => {
    return (
        <motion.div
            key="frame26"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-5">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="relative"
                >
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-2xl"
                    />
                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                        <Layers className="w-14 h-14 text-cyan-400" strokeWidth={2} />
                    </div>
                </motion.div>
                <div className="space-y-4 text-center">
                    <h2 className="text-4xl font-black uppercase leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">HYPERVISOR</span>
                    </h2>
                    <div className="space-y-2">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-left"
                        >
                            <p className="text-sm text-zinc-400"><span className="text-cyan-400 font-bold">Divides</span> physical resources</p>
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-left"
                        >
                            <p className="text-sm text-zinc-400"><span className="text-blue-400 font-bold">Creates</span> virtual machines</p>
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.1 }}
                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-left"
                        >
                            <p className="text-sm text-zinc-400"><span className="text-purple-400 font-bold">Powers</span> cloud computing</p>
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, type: 'spring' }}
                    className="space-y-3"
                >
                    <Award className="w-12 h-12 mx-auto text-yellow-400" />
                    <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 rounded-xl p-4">
                        <Users className="w-10 h-10 mx-auto text-cyan-400 mb-2" />
                        <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Follow For More<br />Cloud Concepts</div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
