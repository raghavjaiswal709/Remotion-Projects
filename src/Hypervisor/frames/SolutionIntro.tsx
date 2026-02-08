import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import React from "react";

export const SolutionIntro: React.FC = () => {
    return (
        <motion.div
            key="frame6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-8 text-center">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 1, repeat: 2 }}
                    className="inline-block relative"
                >
                    <div className="absolute inset-0 bg-yellow-500/30 blur-2xl rounded-full" />
                    <Lightbulb className="w-40 h-40 text-yellow-400 drop-shadow-[0_0_40px_rgba(250,204,21,0.6)] relative z-10" />
                </motion.div>
                <div className="space-y-5">
                    <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 uppercase drop-shadow-sm leading-tight">
                        The<br />Solution
                    </h2>
                    <p className="text-3xl text-cyan-300 font-black uppercase tracking-[0.2em] drop-shadow-lg">
                        Enter Hypervisor
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
