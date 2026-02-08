import { motion } from "framer-motion";
import { Cloud, CheckCircle2 } from "lucide-react";
import React from "react";

export const PowersTheCloud: React.FC = () => {
    return (
        <motion.div
            key="frame25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-3">
                    <Cloud className="w-14 h-14 mx-auto text-blue-400" />
                    <h2 className="text-3xl font-black uppercase">Powers The<br />Cloud</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-2 border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 shadow-lg shadow-blue-500/20 space-y-5"
                >
                    <div className="text-center space-y-3">
                        <p className="text-base text-blue-300 font-bold">AWS, Azure, Google Cloud</p>
                        <div className="h-px bg-blue-500/30 w-20 mx-auto" />
                        <p className="text-sm text-zinc-400 leading-relaxed">All use hypervisors to create<br />thousands of virtual servers<br />from physical hardware</p>
                    </div>
                    <div className="space-y-3">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
                        >
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            <span className="text-base text-blue-300 font-bold">Rent virtual servers</span>
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3"
                        >
                            <CheckCircle2 className="w-5 h-5 text-purple-400" />
                            <span className="text-base text-purple-300 font-bold">Pay only for what you use</span>
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.1 }}
                            className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3"
                        >
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="text-base text-green-300 font-bold">Scale instantly</span>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-3"
                    >
                        <p className="text-sm font-bold text-cyan-300 text-center">Hypervisors Made Cloud<br />Computing Possible</p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};
