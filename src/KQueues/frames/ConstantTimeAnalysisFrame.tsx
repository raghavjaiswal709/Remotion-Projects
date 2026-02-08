import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Timer,
    CheckCircle2
} from 'lucide-react';

const ConstantTimeAnalysisFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 100, damping: 10 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    // Badge Entry
    const badgeScale = interpolate(createSpring(10), [0, 1], [0, 1]);

    // Checkmarks
    const check1 = createSpring(40);
    const check2 = createSpring(50);
    const check3 = createSpring(60);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-24 flex flex-col items-center">

                {/* O(1) Badge */}
                <div style={{ transform: `scale(${badgeScale})` }} className="w-80 h-80 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[3rem] rotate-12 flex flex-col items-center justify-center shadow-[0_20px_60px_rgba(251,191,36,0.5)] border-4 border-white">
                    <Timer size={80} className="text-white mb-4" />
                    <span className="text-9xl font-black text-white drop-shadow-md">O(1)</span>
                </div>

                {/* Checklist */}
                <div className="space-y-6 text-left">
                    <div style={{ opacity: interpolate(check1, [0, 1], [0, 1]), transform: `translateX(${interpolate(check1, [0, 1], [-20, 0])}px)` }} className="flex items-center gap-6">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                        <span className="text-3xl font-bold text-white">No Loops</span>
                    </div>
                    <div style={{ opacity: interpolate(check2, [0, 1], [0, 1]), transform: `translateX(${interpolate(check2, [0, 1], [-20, 0])}px)` }} className="flex items-center gap-6">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                        <span className="text-3xl font-bold text-white">Direct Index Access</span>
                    </div>
                    <div style={{ opacity: interpolate(check3, [0, 1], [0, 1]), transform: `translateX(${interpolate(check3, [0, 1], [-20, 0])}px)` }} className="flex items-center gap-6">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                        <span className="text-3xl font-bold text-white">Instant Updates</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConstantTimeAnalysisFrame;
