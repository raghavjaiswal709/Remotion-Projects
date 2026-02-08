import { motion } from "framer-motion";
import { Box } from "lucide-react";
import React from "react";

export const VMLayer: React.FC = () => {
    return (
        <motion.div
            key="frame11"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full w-full px-6"
        >
            <div className="w-full max-w-md space-y-5">
                <div className="text-center text-xl uppercase tracking-wider text-zinc-500 font-bold">Layer 3: Virtual Machines</div>
                <div className="space-y-4">
                    {[
                        { name: 'VM 1', os: 'Windows', color: 'blue' },
                        { name: 'VM 2', os: 'Linux', color: 'green' },
                        { name: 'VM 3', os: 'macOS', color: 'purple' }
                    ].map((vm, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -60, opacity: 0, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.3, type: 'spring' }}
                            className="relative"
                        >
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        `0 0 15px rgba(${vm.color === 'blue' ? '59, 130, 246' : vm.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.2)`,
                                        `0 0 25px rgba(${vm.color === 'blue' ? '59, 130, 246' : vm.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.4)`,
                                        `0 0 15px rgba(${vm.color === 'blue' ? '59, 130, 246' : vm.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.2)`
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                className="border-2 rounded-xl p-5"
                                style={{
                                    borderColor: `rgb(${vm.color === 'blue' ? '59, 130, 246' : vm.color === 'green' ? '34, 197, 94' : '168, 85, 247'})`,
                                    backgroundColor: `rgba(${vm.color === 'blue' ? '59, 130, 246' : vm.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.1)`
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Box
                                            className="w-10 h-10"
                                            style={{ color: `rgb(${vm.color === 'blue' ? '96, 165, 250' : vm.color === 'green' ? '134, 239, 172' : '192, 132, 252'})` }}
                                        />
                                        <div className="text-left">
                                            <div
                                                className="text-lg font-bold"
                                                style={{ color: `rgb(${vm.color === 'blue' ? '96, 165, 250' : vm.color === 'green' ? '134, 239, 172' : '192, 132, 252'})` }}
                                            >
                                                {vm.name}
                                            </div>
                                            <div className="text-sm text-zinc-500">{vm.os}</div>
                                        </div>
                                    </div>
                                    <div
                                        className="text-xs uppercase tracking-wider px-3 py-1.5 rounded"
                                        style={{
                                            backgroundColor: `rgba(${vm.color === 'blue' ? '59, 130, 246' : vm.color === 'green' ? '34, 197, 94' : '168, 85, 247'}, 0.2)`,
                                            color: `rgb(${vm.color === 'blue' ? '96, 165, 250' : vm.color === 'green' ? '134, 239, 172' : '192, 132, 252'})`
                                        }}
                                    >
                                        Virtual
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-base text-cyan-400 font-bold text-center"
                >
                    All Running On One Physical Server
                </motion.div>
            </div>
        </motion.div>
    );
};
