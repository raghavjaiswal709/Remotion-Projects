import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import React from "react";

export const HowItWorks: React.FC = () => {
    return (
        <motion.div
            key="frame22"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-3">
                    <Settings className="w-12 h-12 mx-auto text-cyan-400" />
                    <h2 className="text-3xl font-black uppercase">How It Works</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { step: 1, text: 'Hypervisor boots on hardware', delay: 0.3 },
                        { step: 2, text: 'Maps all physical resources', delay: 0.6 },
                        { step: 3, text: 'Creates virtual hardware pool', delay: 0.9 },
                        { step: 4, text: 'Allocates to each VM', delay: 1.2 },
                        { step: 5, text: 'VMs run independently', delay: 1.5 }
                    ].map((item) => (
                        <motion.div
                            key={item.step}
                            initial={{ x: -60, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: item.delay }}
                            className="bg-zinc-900/50 border-2 border-zinc-700 rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                                    <span className="text-base font-black text-cyan-400">{item.step}</span>
                                </div>
                                <p className="text-base font-bold text-zinc-300">{item.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
