import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Link
} from 'lucide-react';

const EnqueueLinkRearFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Code:
    // next[rear[q]] = i; 
    // rear[q] = i;

    // rear[0] = 7 (Tail)
    // i = 3 (New Node)
    // Link 7 -> 3
    // Update rear[0] -> 3

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    // Phase 1: Linking 7 -> 3
    const node7Enter = createSpring(10);
    const node3Enter = createSpring(20);
    const linkProgress = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });

    // Phase 2: Updating Rear
    const variableUpdate = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-6xl space-y-16">

                <div className="text-center">
                    <code className="text-5xl font-mono font-bold text-zinc-400">
                        <div style={{ opacity: frame < 90 ? 1 : 0.3 }} className="transition-opacity duration-300">
                            next[rear[q]] = <span className="text-white">i</span>;
                        </div>
                        <div style={{ opacity: frame > 90 ? 1 : 0.3 }} className="mt-4 transition-opacity duration-300">
                            rear[q] = <span className="text-white">i</span>;
                        </div>
                    </code>
                </div>

                <div className="relative h-96 w-full flex items-center justify-center gap-48">

                    {/* Old Tail (7) */}
                    <div style={{ transform: `scale(${node7Enter})` }} className="flex flex-col items-center relative">
                        <div className="text-zinc-500 font-bold mb-4 uppercase tracking-widest">Old Tail</div>
                        <div className="w-32 h-32 bg-blue-900/30 border-4 border-blue-600 rounded-2xl flex items-center justify-center z-10">
                            <span className="text-4xl font-black">Val</span>
                        </div>
                        <div className="absolute -bottom-16 font-mono text-zinc-600 font-bold text-xl">Index 7</div>

                        {/* Next Pointer Box */}
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-purple-900 border-2 border-purple-500 w-12 h-12 flex items-center justify-center z-20 rounded shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    </div>

                    {/* The Link Line */}
                    <div className="absolute left-[38%] top-1/2 -translate-y-1/2 w-[24%] h-2 bg-zinc-800 overflow-hidden z-0">
                        <div style={{ width: `${linkProgress * 100}%` }} className="h-full bg-purple-500 transition-all rounded-r-full" />
                    </div>

                    {/* New Node (3) */}
                    <div style={{ transform: `scale(${node3Enter})` }} className="flex flex-col items-center">
                        <div className="text-emerald-500 font-bold mb-4 uppercase tracking-widest">New Node (i)</div>
                        <div className="w-32 h-32 bg-white text-black border-4 border-white rounded-2xl flex items-center justify-center z-10 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                            <span className="text-4xl font-black">Data</span>
                        </div>
                        <div className="absolute -bottom-16 font-mono text-white font-bold text-2xl">Index 3</div>

                        {/* Rear Label Badge updates position */}
                        <div
                            style={{
                                opacity: variableUpdate,
                                transform: `translateY(${interpolate(variableUpdate, [0, 1], [20, 0])}px)`
                            }}
                            className="absolute -top-24 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-xl border-2 border-indigo-400"
                        >
                            New Rear
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default EnqueueLinkRearFrame;
