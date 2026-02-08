import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    ArrowLeft
} from 'lucide-react';

const UpdateFreePointerFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // free = i;
    // free moves from 6 to 5.

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);
    const numberUpdate = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-24">

                <div className="text-center">
                    <code className="text-7xl font-mono font-bold text-white">
                        free = <span className="text-zinc-400">i</span>;
                    </code>
                </div>

                <div className="flex flex-col items-center gap-8">
                    <div className="w-64 h-64 bg-emerald-500 rounded-full flex flex-col items-center justify-center relative shadow-[0_0_80px_rgba(16,185,129,0.4)] overflow-hidden">
                        <span className="text-2xl font-bold uppercase tracking-widest text-emerald-900 mb-2">free</span>

                        <div className="relative w-full text-center h-24">
                            {/* 6 exiting */}
                            <span
                                style={{ transform: `translateY(${numberUpdate * 150}%)`, opacity: 1 - numberUpdate }}
                                className="absolute inset-0 text-9xl font-black text-white block"
                            >6</span>
                            {/* 5 entering */}
                            <span
                                style={{ transform: `translateY(${(1 - numberUpdate) * -150}%)`, opacity: numberUpdate }}
                                className="absolute inset-0 text-9xl font-black text-white block"
                            >5</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UpdateFreePointerFrame;
