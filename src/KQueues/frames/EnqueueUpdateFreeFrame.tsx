import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    ArrowRight
} from 'lucide-react';

const EnqueueUpdateFreeFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    // Code: free = next[i];
    // i = 3; next[i] = 6; So free becomes 6.

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);
    const titleY = interpolate(createSpring(10), [0, 1], [-50, 0]);

    // Animations
    const nextArrayEnter = createSpring(30);
    const valueMove = interpolate(createSpring(60), [0, 1], [0, 1]); // Moving value 6 to free
    const freeUpdate = interpolate(frame, [90, 100], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-24">

                {/* Header */}
                <div style={{ transform: `translateY(${titleY}px)` }} className="text-center space-y-8">
                    <div className="inline-block bg-zinc-900 border border-zinc-700 px-8 py-4 rounded-2xl">
                        <code className="text-6xl font-mono font-bold text-white">
                            free = <span className="text-purple-400">next[i]</span>;
                        </code>
                    </div>
                </div>

                {/* Main Action */}
                <div className="flex items-center justify-center gap-16 relative h-64">

                    {/* Next Array Slot [3] */}
                    <div style={{ transform: `scale(${nextArrayEnter})` }} className="flex flex-col items-center gap-4">
                        <span className="font-mono text-zinc-500 font-bold text-xl">Index 3 (i)</span>
                        <div className="w-40 h-40 bg-purple-900/10 border-4 border-purple-500 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-purple-400 uppercase font-bold text-xs mb-2">next[3]</span>
                            <span className="text-6xl font-black text-white">6</span>
                        </div>
                    </div>

                    {/* The Path */}
                    <div className="flex-1 border-t-4 border-dashed border-zinc-700 relative">
                        <ArrowRight className="absolute -right-2 -top-4 text-zinc-700" size={32} />

                        {/* Flying value */}
                        <div
                            style={{
                                left: `${valueMove * 100}%`,
                                opacity: valueMove < 0.1 || valueMove > 0.9 ? 0 : 1
                            }}
                            className="absolute -top-8 -ml-8 bg-white text-black text-3xl font-black w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-20"
                        >
                            6
                        </div>
                    </div>

                    {/* Free Variable */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="font-mono text-zinc-500 font-bold text-xl">Variable</span>
                        <div className="w-40 h-40 bg-zinc-900 border-4 border-emerald-500 rounded-full flex flex-col items-center justify-center overflow-hidden relative">
                            <span className="text-emerald-500 uppercase font-bold text-xs mb-2">free</span>

                            {/* Number Swap - 3 goes up, 6 comes in */}
                            <div className="relative h-16 w-full text-center">
                                <span style={{ transform: `translateY(${freeUpdate * -150}%)`, opacity: 1 - freeUpdate }} className="absolute inset-0 text-6xl font-black text-white block transition-all">3</span>
                                <span style={{ transform: `translateY(${(1 - freeUpdate) * 150}%)`, opacity: freeUpdate }} className="absolute inset-0 text-6xl font-black text-emerald-400 block transition-all">6</span>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EnqueueUpdateFreeFrame;
