import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Zap,
    SearchX
} from 'lucide-react';

const EnqueueNoSearchFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 100, damping: 12 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    // Animation: Scanning vs Direct
    const scanProgress = interpolate(frame, [30, 80], [0, 100]); // Percentage across array
    const directHitScale = interpolate(createSpring(30), [0, 1], [0, 1]);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-6xl space-y-20">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-6xl font-black uppercase tracking-tight">O(1) Access</h2>
                    <p className="text-2xl text-zinc-500">We <strong className="text-red-400">never</strong> search for space.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Scenario A: Linear Scan (Bad) */}
                    <div className="bg-red-900/10 border-2 border-red-500/20 p-8 rounded-3xl opacity-50 relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <SearchX className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-red-500 mb-8 uppercase">The Slow Way</h3>

                        {/* Simulating array slots */}
                        <div className="flex gap-2 relative">
                            {[1, 1, 1, 1, 1, 0, 1].map((occupied, i) => (
                                <div key={i} className={`h-16 flex-1 rounded-lg ${occupied ? 'bg-zinc-800' : 'bg-green-900/20 border-2 border-green-500/50'}`}></div>
                            ))}
                            {/* Scanning Head */}
                            <div
                                style={{ left: `${scanProgress}%` }}
                                className="absolute top-0 w-2 h-16 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                            />
                        </div>
                    </div>

                    {/* Scenario B: Direct Access (Good) */}
                    <div className="bg-emerald-900/10 border-2 border-emerald-500/20 p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <Zap className="text-emerald-500" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-500 mb-8 uppercase">Our Way</h3>

                        <div className="flex gap-2 relative items-end h-32">
                            {[1, 1, 1, 1, 0, 1, 1].map((occupied, i) => (
                                <div key={i} className={`
                                    flex-1 rounded-lg transition-all duration-300
                                    ${i === 4 ? 'bg-emerald-500 h-24 shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-zinc-800 h-16 opacity-30'}
                                `}>
                                    {i === 4 && (
                                        <div style={{ transform: `scale(${directHitScale})` }} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-900 font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                            Here!
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EnqueueNoSearchFrame;
