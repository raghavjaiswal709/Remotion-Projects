import { motion } from "framer-motion";
import { GitBranch, Cpu, ArrowDown } from "lucide-react";
import React from "react";

export const ResourceSlicing: React.FC = () => {
    return (
        <motion.div
            key="frame12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-3">
                    <GitBranch className="w-12 h-12 mx-auto text-cyan-400" />
                    <h2 className="text-3xl font-black uppercase">Resource<br />Slicing</h2>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="bg-zinc-900/50 border-2 border-zinc-700 rounded-xl p-5 space-y-4"
                >
                    <div className="text-center space-y-3">
                        <div className="text-sm text-zinc-500 uppercase">Total Available</div>
                        <div className="bg-amber-500/20 border-2 border-amber-500/40 rounded-xl p-4">
                            <Cpu className="w-14 h-14 mx-auto text-amber-400 mb-2" />
                            <div className="text-3xl font-black text-amber-400">100%</div>
                            <div className="text-sm text-amber-300">CPU Power</div>
                        </div>
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowDown className="w-8 h-8 mx-auto text-cyan-400" />
                        </motion.div>
                        <div className="text-sm text-cyan-400 font-bold uppercase">Hypervisor Divides It</div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { percent: 40, color: 'blue' },
                                { percent: 30, color: 'green' },
                                { percent: 30, color: 'purple' }
                            ].map((slice, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.2 }}
                                    className="rounded-lg p-3"
                                    style={{
                                        backgroundColor: `rgba(${slice.color === 'blue' ? '59, 130, 246' : slice.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.2)`,
                                        border: `1px solid rgba(${slice.color === 'blue' ? '59, 130, 246' : slice.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.4)`
                                    }}
                                >
                                    <div
                                        className="text-2xl font-black"
                                        style={{ color: `rgb(${slice.color === 'blue' ? '96, 165, 250' : slice.color === 'green' ? '134, 239, 172' : '192, 132, 252'})` }}
                                    >
                                        {slice.percent}%
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: `rgb(${slice.color === 'blue' ? '96, 165, 250' : slice.color === 'green' ? '134, 239, 172' : '192, 132, 252'})` }}
                                    >
                                        VM {i + 1}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
