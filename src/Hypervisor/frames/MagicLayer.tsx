import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import React from "react";

export const MagicLayer: React.FC = () => {
    return (
        <motion.div
            key="frame8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
                        <Sparkles className="w-16 h-16 mx-auto text-yellow-400 relative z-10" />
                    </div>
                    <h2 className="text-4xl font-black uppercase text-yellow-400 drop-shadow-lg">The Magic Layer</h2>
                </div>
                <div className="space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-zinc-900/80 border-3 border-zinc-700 rounded-2xl p-6 space-y-6 shadow-2xl"
                    >
                        <div className="text-xl text-zinc-400 uppercase text-center font-bold tracking-widest border-b border-zinc-700 pb-3">What it does</div>
                        <div className="space-y-4">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-4 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-4"
                            >
                                <CheckCircle2 className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                                <span className="text-xl text-cyan-100 font-bold">Divides Resources</span>
                            </motion.div>
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center gap-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4"
                            >
                                <CheckCircle2 className="w-8 h-8 text-blue-400 flex-shrink-0" />
                                <span className="text-xl text-blue-100 font-bold">Creates VMs</span>
                            </motion.div>
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.1 }}
                                className="flex items-center gap-4 bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4"
                            >
                                <CheckCircle2 className="w-8 h-8 text-purple-400 flex-shrink-0" />
                                <span className="text-xl text-purple-100 font-bold">Manages Everything</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
