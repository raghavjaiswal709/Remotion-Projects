import { motion } from "framer-motion";
import { Server } from "lucide-react";
import React from "react";

export const PhysicalServersWastage: React.FC = () => {
    return (
        <motion.div
            key="frame4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center text-xl uppercase tracking-[0.2em] text-zinc-500 font-bold">
                    Traditional Setup
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'Server 1', usage: 15, color: 'red' },
                        { name: 'Server 2', usage: 12, color: 'orange' },
                        { name: 'Server 3', usage: 18, color: 'yellow' }
                    ].map((server, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.3 }}
                            className="border-3 border-zinc-800 bg-zinc-900/80 rounded-2xl p-5 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Server className="w-8 h-8 text-zinc-600" />
                                    <span className="text-xl font-bold text-zinc-300">{server.name}</span>
                                </div>
                                <span className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Physical</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-base font-medium">
                                    <span className="text-zinc-500">CPU Usage</span>
                                    <span className="font-bold text-xl" style={{ color: `rgb(${server.color === 'red' ? '239, 68, 68' : server.color === 'orange' ? '249, 115, 22' : '234, 179, 8'})` }}>
                                        {server.usage}%
                                    </span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden border border-zinc-700">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${server.usage}%` }}
                                        transition={{ delay: i * 0.3 + 0.5, duration: 0.8 }}
                                        className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                        style={{ backgroundColor: `rgb(${server.color === 'red' ? '239, 68, 68' : server.color === 'orange' ? '249, 115, 22' : '234, 179, 8'})` }}
                                    />
                                </div>
                                <div className="text-sm text-zinc-500 italic text-right">85% wasted</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-xl text-red-400 font-bold text-center p-3 border-2 border-red-500/30 rounded-xl bg-red-500/10"
                >
                    Expensive & Inefficient
                </motion.div>
            </div>
        </motion.div>
    );
};
