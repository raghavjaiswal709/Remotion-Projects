import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Activity
} from 'lucide-react';

const EfficiencyProofFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    // Code: if (free == -1)

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-6xl space-y-24">

                <div className="text-center">
                    <h2 className="text-5xl font-bold text-zinc-500 mb-8 uppercase tracking-widest">Maximum Efficiency</h2>
                    <div className="inline-block bg-zinc-900 border-2 border-zinc-700 px-12 py-8 rounded-3xl">
                        <code className="text-7xl font-mono font-bold text-white">
                            if (<span className="text-emerald-500">free</span> == -1)
                        </code>
                        <div className="mt-4 text-red-400 font-bold uppercase tracking-widest">Full Capacity Reached</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                        <div className="text-6xl font-black text-white mb-2">100%</div>
                        <div className="text-zinc-500 font-bold uppercase">Memory Usage</div>
                        <p className="mt-4 text-zinc-400">Every single slot is used before we declare overflow.</p>
                    </div>
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                        <div className="text-6xl font-black text-white mb-2">0%</div>
                        <div className="text-zinc-500 font-bold uppercase">Wasted Space</div>
                        <p className="mt-4 text-zinc-400">No fragmentation. No false overflows.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EfficiencyProofFrame;
