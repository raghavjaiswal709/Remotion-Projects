import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    ArrowUpFromLine,
    Target
} from 'lucide-react';

const DequeueIntroFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    // i = front[q];
    // Find Head.

    // Anim
    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);
    const titleY = interpolate(createSpring(10), [0, 1], [-50, 0]);

    // Box scale
    const boxScale = interpolate(createSpring(30), [0, 1], [0, 1]);

    // Highlighting 'i'
    const iFound = interpolate(frame, [60, 80], [0, 1]);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-24">

                {/* Header */}
                <div style={{ transform: `translateY(${titleY}px)` }} className="text-center space-y-8">
                    <div className="inline-block bg-zinc-900 border border-zinc-700 px-8 py-4 rounded-2xl">
                        <code className="text-6xl font-mono font-bold text-white">
                            int i = <span className="text-blue-500">front[q]</span>;
                        </code>
                    </div>
                </div>

                {/* VISUALIZATION */}
                <div className="flex items-center justify-center gap-24">

                    {/* Front Array Access */}
                    <div style={{ transform: `scale(${boxScale})` }} className="flex flex-col items-center gap-6">
                        <span className="text-blue-500 font-bold uppercase tracking-widest text-xl">front[0]</span>
                        <div className="w-48 h-48 bg-blue-900/20 border-4 border-blue-500 rounded-3xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                            <span className="text-8xl font-black text-white">5</span>
                        </div>
                    </div>

                    {/* Result Logic */}
                    <div style={{ opacity: iFound, transform: `translateX(${interpolate(iFound, [0, 1], [-50, 0])}px)` }} className="flex items-center gap-8">
                        <div className="h-1 w-32 bg-zinc-700" />

                        <div className="bg-zinc-800 border-2 border-white p-8 rounded-2xl flex items-center gap-6">
                            <Target size={40} className="text-red-500" />
                            <div>
                                <h3 className="text-xl font-bold text-white">Target Acquired</h3>
                                <p className="text-zinc-400">Removing Node at Index 5</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DequeueIntroFrame;
