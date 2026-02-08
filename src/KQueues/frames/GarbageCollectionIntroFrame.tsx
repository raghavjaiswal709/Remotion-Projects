import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Recycle,
    Trash2
} from 'lucide-react';

const GarbageCollectionIntroFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 100, damping: 10 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    // Scale Up Icon
    const iconScale = interpolate(createSpring(10), [0, 1], [0, 1]);
    const textEnter = createSpring(30);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-16 text-center">

                <div style={{ transform: `scale(${iconScale})` }} className="inline-flex bg-emerald-500/10 p-12 rounded-full border-4 border-emerald-500/30 mb-8">
                    <Recycle size={120} className="text-emerald-500 animate-spin-slow" />
                </div>

                <div style={{ opacity: interpolate(textEnter, [0, 1], [0, 1]), transform: `translateY(${interpolate(textEnter, [0, 1], [20, 0])}px)` }}>
                    <h2 className="text-7xl font-black uppercase tracking-tight text-white mb-6">
                        Recycle <span className="text-emerald-500">Everything</span>
                    </h2>
                    <p className="text-3xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                        We don't throw memory away. We return it to the <span className="text-white font-bold">Free Pool</span> immediately.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default GarbageCollectionIntroFrame;
