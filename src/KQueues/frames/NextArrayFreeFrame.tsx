import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Share2,
    Recycle
} from 'lucide-react';

const NextArrayFreeFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    // Scenario: Free slots at 3 -> 6 -> 1 -> -1
    // next[3] = 6, next[6] = 1, next[1] = -1
    const nextData = [
        { idx: 3, val: 6 },
        { idx: 6, val: 1 },
        { idx: 1, val: -1 },
    ];

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);
    const titleY = interpolate(createSpring(10), [0, 1], [-50, 0]);
    const arrowProgress = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-24">

                {/* Header */}
                <div style={{ transform: `translateY(${titleY}px)` }} className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 text-emerald-500 mb-4">
                        <Share2 size={48} />
                        <h2 className="text-6xl font-black uppercase tracking-tight">Next Array <span className="text-zinc-600">|</span> Free</h2>
                    </div>
                    <p className="text-3xl text-zinc-400">If index <span className="font-mono text-white">i</span> is empty, <span className="font-mono text-emerald-400">next[i]</span> points to the next <i>available</i> slot.</p>
                </div>

                {/* VISUALIZATION */}
                <div className="flex items-center justify-center gap-32">
                    {nextData.map((item, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center gap-4 relative">
                                <span className="font-mono text-zinc-500 font-bold text-xl">Index {item.idx}</span>
                                <div className="w-40 h-40 bg-emerald-900/10 border-4 border-emerald-500/50 rounded-3xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)] border-dashed">
                                    <span className="text-6xl font-black font-mono text-zinc-300">{item.val}</span>
                                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-2">Next Free</span>
                                </div>

                                {/* Item Data Context */}
                                <div className="absolute -bottom-16 bg-emerald-900/30 text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                    <Recycle size={14} /> Empty
                                </div>
                            </div>

                            {/* Arrow */}
                            {i < nextData.length - 1 && (
                                <div className="relative">
                                    <div style={{ width: interpolate(arrowProgress, [0, 1], [0, 100]) + 'px' }} className="h-2 bg-emerald-500 overflow-hidden" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default NextArrayFreeFrame;
