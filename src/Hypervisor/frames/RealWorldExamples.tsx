import { motion } from "framer-motion";
import { Award } from "lucide-react";
import React from "react";

export const RealWorldExamples: React.FC = () => {
    return (
        <motion.div
            key="frame21"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-3">
                    <Award className="w-12 h-12 mx-auto text-yellow-400" />
                    <h2 className="text-3xl font-black uppercase">Popular<br />Hypervisors</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'VMware ESXi', type: 'Type 1', color: 'cyan', desc: 'Industry Leader' },
                        { name: 'Microsoft Hyper-V', type: 'Type 1', color: 'blue', desc: 'Windows Integration' },
                        { name: 'KVM', type: 'Type 1', color: 'green', desc: 'Linux Built-in' },
                        { name: 'VirtualBox', type: 'Type 2', color: 'purple', desc: 'Free & Easy' }
                    ].map((hyper, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -60, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="border-2 rounded-xl p-4"
                            style={{
                                borderColor: `rgb(${hyper.color === 'cyan' ? '34, 211, 238' : hyper.color === 'blue' ? '59, 130, 246' : hyper.color === 'green' ? '34, 197, 94' : '168, 85, 247'})`,
                                backgroundColor: `rgba(${hyper.color === 'cyan' ? '34, 211, 238' : hyper.color === 'blue' ? '59, 130, 246' : hyper.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.1)`
                            }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-bold text-base text-white">{hyper.name}</div>
                                <div
                                    className="text-xs uppercase tracking-wider px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: `rgba(${hyper.color === 'cyan' ? '34, 211, 238' : hyper.color === 'blue' ? '59, 130, 246' : hyper.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.2)`,
                                        color: `rgb(${hyper.color === 'cyan' ? '103, 232, 249' : hyper.color === 'blue' ? '96, 165, 250' : hyper.color === 'green' ? '134, 239, 172' : '192, 132, 252'})`
                                    }}
                                >
                                    {hyper.type}
                                </div>
                            </div>
                            <div className="text-sm text-zinc-500">{hyper.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
