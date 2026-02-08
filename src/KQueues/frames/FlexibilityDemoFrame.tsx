import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Maximize
} from 'lucide-react';

const FlexibilityDemoFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 60, damping: 20 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    // Vis: Array bar fully blue vs mixed
    // We animate a bar growing to fill the whole space
    const grow = interpolate(frame, [30, 90], [30, 100], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-6xl space-y-24 text-center">

                <div>
                    <div className="inline-flex items-center gap-4 text-cyan-400 mb-6">
                        <Maximize size={48} />
                        <h2 className="text-6xl font-black uppercase tracking-tight">Total Flexibility</h2>
                    </div>
                    <p className="text-3xl text-zinc-400 max-w-3xl mx-auto">
                        One queue can consume the <span className="text-white font-bold">entire</span> array if needed.
                    </p>
                </div>

                <div className="relative h-32 bg-zinc-900 rounded-full border-2 border-zinc-800 overflow-hidden w-full">
                    {/* Background markers */}
                    <div className="absolute inset-0 flex justify-between px-8 items-center z-10 opacity-30">
                        <div className="w-1 h-8 bg-white" />
                        <div className="w-1 h-8 bg-white" />
                        <div className="w-1 h-8 bg-white" />
                        <div className="w-1 h-8 bg-white" />
                        <div className="w-1 h-8 bg-white" />
                    </div>

                    {/* The Bar */}
                    <div
                        style={{ width: `${grow}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.5)] flex items-center justify-center relative z-0"
                    >
                        <span className="text-white font-black text-2xl uppercase tracking-widest absolute right-8">Queue 0 Growing...</span>
                    </div>
                </div>

                <div className="text-xl text-zinc-500 font-mono mt-8">
                    Queue 0 Capacity: {Math.floor(grow)}%
                </div>

            </div>
        </div>
    );
};

export default FlexibilityDemoFrame;
