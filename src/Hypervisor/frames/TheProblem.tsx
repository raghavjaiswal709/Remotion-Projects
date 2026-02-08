import { motion } from "framer-motion";
import { AlertTriangle, Server, XCircle } from "lucide-react";
import React from "react";

export const TheProblem: React.FC = () => {
    return (
        <motion.div
            key="frame3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-8">
                <div className="flex items-center justify-center gap-3">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                    <h2 className="text-3xl font-black uppercase text-red-500 tracking-wide">
                        The Old Problem
                    </h2>
                </div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="border-3 border-red-600 bg-red-600/10 rounded-2xl p-6 shadow-[0_0_50px_-15px_rgba(220,38,38,0.4)] space-y-6"
                >
                    <div className="space-y-6">
                        <Server className="w-24 h-24 mx-auto text-red-500" strokeWidth={1.5} />

                        <div className="bg-red-500/20 border-2 border-red-500/40 rounded-2xl p-5 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-3 justify-center">
                                <XCircle className="w-8 h-8 text-red-400" />
                                <span className="text-xl font-bold text-red-300">Wasted Resources</span>
                            </div>
                            <p className="text-lg text-zinc-300 text-center font-medium leading-relaxed">
                                Servers running at only<br />
                                <span className="text-5xl font-black text-red-500 block my-3 drop-shadow-lg">10-15%</span>
                                capacity
                            </p>
                        </div>

                        <div className="bg-red-500/20 border-2 border-red-500/40 rounded-2xl p-4">
                            <p className="text-lg text-zinc-300 text-center font-medium">
                                Most of the expensive<br />hardware sits idle
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
