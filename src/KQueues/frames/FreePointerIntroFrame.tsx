import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    MousePointer2,
    ListStart
} from 'lucide-react';

const FreePointerIntroFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);
    const titleY = interpolate(createSpring(10), [0, 1], [-50, 0]);
    const pointerScale = interpolate(createSpring(30), [0, 1], [0, 1]);

    // Chain Visualization
    const chainOpacity = interpolate(frame, [50, 60], [0, 1]);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-24">

                {/* Header */}
                <div style={{ transform: `translateY(${titleY}px)` }} className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 text-emerald-500 mb-4">
                        <MousePointer2 size={48} />
                        <h2 className="text-6xl font-black uppercase tracking-tight">Free Pointer</h2>
                    </div>
                    <p className="text-3xl text-zinc-400">The entry point to our pool of <span className="text-white font-bold">Infinite Potential</span>.</p>
                </div>

                {/* VISUALIZATION */}
                <div className="flex items-center justify-center gap-8">

                    {/* The Free Variable */}
                    <div style={{ transform: `scale(${pointerScale})` }} className="flex flex-col items-center gap-6 z-10">
                        <div className="w-48 h-48 bg-emerald-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)] relative">
                            <span className="text-xl font-bold uppercase tracking-widest text-emerald-900 mb-1">int free</span>
                            <span className="text-8xl font-black text-white">3</span>
                            <div className="absolute -right-4 -bottom-4 bg-white text-zinc-900 px-4 py-2 rounded-lg font-bold shadow-lg">Head</div>
                        </div>
                    </div>

                    {/* Arrow Connection */}
                    <div style={{ opacity: chainOpacity, width: 200 }} className="h-2 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />

                    {/* The Free List Chain (Abstract) */}
                    <div style={{ opacity: chainOpacity }} className="flex gap-4 opacity-50">
                        <div className="w-24 h-24 border-4 border-emerald-500/30 border-dashed rounded-2xl flex items-center justify-center">
                            <span className="text-3xl font-mono text-zinc-500">3</span>
                        </div>
                        <div className="w-24 h-24 border-4 border-emerald-500/30 border-dashed rounded-2xl flex items-center justify-center">
                            <span className="text-3xl font-mono text-zinc-500">6</span>
                        </div>
                        <div className="w-24 h-24 border-4 border-emerald-500/30 border-dashed rounded-2xl flex items-center justify-center">
                            <span className="text-3xl font-mono text-zinc-500">1</span>
                        </div>
                        <div className="grid place-items-center">...</div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default FreePointerIntroFrame;
