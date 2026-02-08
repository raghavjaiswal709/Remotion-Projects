import { motion } from "framer-motion";
import { Server, Boxes } from "lucide-react";
import React from "react";

export const RealWorldAnalogy: React.FC = () => {
    return (
        <motion.div
            key="frame2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-8">
                <div className="text-center text-2xl uppercase tracking-[0.2em] text-zinc-500 font-bold">
                    Imagine This
                </div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="border-3 border-blue-500 bg-blue-500/10 rounded-2xl p-6 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] space-y-6"
                >
                    <div className="text-center space-y-4">
                        <Server className="w-20 h-20 mx-auto text-blue-400 drop-shadow-lg" />
                        <h2 className="text-3xl font-black text-blue-300 uppercase tracking-wide">
                            One Big Building
                        </h2>
                        <div className="h-1 bg-blue-500/30 w-32 mx-auto rounded-full" />
                        <p className="text-xl text-blue-400 leading-relaxed font-medium">
                            A building with all the space<br />and power you need
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="border-3 border-cyan-500 bg-cyan-500/10 rounded-2xl p-6 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]"
                >
                    <div className="text-center space-y-4">
                        <Boxes className="w-16 h-16 mx-auto text-cyan-400" />
                        <p className="text-2xl font-bold text-cyan-300 leading-tight">
                            Split It Into<br />Separate Apartments
                        </p>
                        <div className="text-lg text-zinc-400 italic font-medium">
                            Each gets its own space
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
