import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    MousePointer2,
    MoveRight
} from 'lucide-react';

const EnqueueGrabFreeFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    // i = free;
    // free = 3; therefore i = 3;

    // Anim
    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);
    const titleY = interpolate(createSpring(10), [0, 1], [-50, 0]);

    // Variables
    const freeVarScale = interpolate(createSpring(30), [0, 1], [0, 1]);
    const iVarScale = interpolate(createSpring(80), [0, 1], [0, 1]);
    const arrowProgress = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-24">

                {/* Header */}
                <div style={{ transform: `translateY(${titleY}px)` }} className="text-center space-y-8">
                    <div className="inline-block bg-zinc-900 border border-zinc-700 px-8 py-4 rounded-2xl">
                        <code className="text-6xl font-mono font-bold text-white">
                            int i = <span className="text-emerald-500">free</span>;
                        </code>
                    </div>
                </div>

                {/* VISUALIZATION */}
                <div className="flex items-center justify-center gap-24">

                    {/* FREE Variable */}
                    <div style={{ transform: `scale(${freeVarScale})` }} className="flex flex-col items-center gap-6">
                        <div className="w-48 h-48 bg-emerald-500 rounded-full flex flex-col items-center justify-center relative shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                            <span className="text-xl font-bold uppercase tracking-widest text-emerald-900 mb-1">free</span>
                            <span className="text-8xl font-black text-white">3</span>
                        </div>
                    </div>

                    {/* Transfer Animation */}
                    <div className="flex flex-col items-center gap-2">
                        <MoveRight size={64} className="text-zinc-600" />
                        <div style={{ width: interpolate(arrowProgress, [0, 1], [0, 100]) + '%' }} className="h-2 bg-emerald-500 w-32 rounded-full overflow-hidden" />
                    </div>

                    {/* I Variable (New) */}
                    <div style={{ transform: `scale(${iVarScale})` }} className="flex flex-col items-center gap-6">
                        <div className="w-48 h-48 bg-zinc-900 border-4 border-white rounded-full flex flex-col items-center justify-center relative shadow-2xl">
                            <div className="absolute -top-4 bg-white text-black px-4 py-1 rounded-lg font-bold">Target Index</div>
                            <span className="text-xl font-bold uppercase tracking-widest text-zinc-500 mb-1">i</span>
                            <span className="text-8xl font-black text-white">3</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default EnqueueGrabFreeFrame;
