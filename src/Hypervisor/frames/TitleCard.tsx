import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import React from "react";

export const TitleCard: React.FC = () => {
    return (
        <motion.div
            key="frame1"
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
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-[60px]"
                    />
                    <div className="relative w-40 h-40 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-[2rem] flex items-center justify-center border-4 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                        <Layers className="w-20 h-20 text-cyan-400" strokeWidth={2} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center space-y-6"
                >
                    <h1 className="text-6xl font-black uppercase leading-none tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 drop-shadow-2xl">
                            HYPER
                        </span>
                        <br />
                        <span className="text-white drop-shadow-xl">VISOR</span>
                    </h1>
                    <p className="text-2xl font-bold text-cyan-300 tracking-wide">
                        The Magic Behind<br />Cloud Computing
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};
