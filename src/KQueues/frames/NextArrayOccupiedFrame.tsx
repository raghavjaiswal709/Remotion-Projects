import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Share2,
    Link as LinkIcon
} from 'lucide-react';

const NextArrayOccupiedFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    // Scenario: Q0 has elements at 0 -> 5 -> 7
    // next[0] = 5, next[5] = 7, next[7] = -1
    // We only show these relevant indices in a simplified view
    const nextData = [
        { idx: 0, val: 5, active: true },
        { idx: 5, val: 7, active: true },
        { idx: 7, val: -1, active: true },
    ];

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);
    const titleY = interpolate(createSpring(10), [0, 1], [-50, 0]);

    // Animate arrow logic
    const arrowProgress = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-24">

                {/* Header */}
                <div style={{ transform: `translateY(${titleY}px)` }} className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 text-purple-500 mb-4">
                        <Share2 size={48} />
                        <h2 className="text-6xl font-black uppercase tracking-tight">Next Array <span className="text-zinc-600">|</span> Occupied</h2>
                    </div>
                    <p className="text-3xl text-zinc-400">If index <span className="font-mono text-white">i</span> is full, <span className="font-mono text-purple-400">next[i]</span> points to the next item in that queue.</p>
                </div>

                {/* VISUALIZATION */}
                <div className="flex items-center justify-center gap-32">
                    {nextData.map((item, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center gap-4 relative">
                                <span className="font-mono text-zinc-500 font-bold text-xl">Index {item.idx}</span>
                                <div className="w-40 h-40 bg-purple-900/20 border-4 border-purple-500 rounded-3xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                                    <span className="text-6xl font-black font-mono">{item.val}</span>
                                    <span className="text-purple-400 font-bold uppercase tracking-widest text-xs mt-2">Next</span>
                                </div>

                                {/* Item Data Context */}
                                <div className="absolute -bottom-16 bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold opacity-50">
                                    In Queue 0
                                </div>
                            </div>

                            {/* Arrow */}
                            {i < nextData.length - 1 && (
                                <div className="relative">
                                    <div style={{ width: interpolate(arrowProgress, [0, 1], [0, 100]) + 'px' }} className="h-2 bg-purple-500 overflow-hidden" />
                                    <LinkIcon className="text-purple-500 absolute top-1/2 -translate-y-1/2 left-full animate-pulse" size={32} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default NextArrayOccupiedFrame;
