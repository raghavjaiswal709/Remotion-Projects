import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    ArrowRight
} from 'lucide-react';

const DequeueUpdateFrontFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // front[q] = next[i];
    // Index 5 was head. next[5] is 7. 
    // New head should be 7.

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    // Anim
    const nextValReveal = createSpring(30);
    const moveAnimation = interpolate(createSpring(60), [0, 1], [0, 1]);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-6xl space-y-24">

                {/* Code Header */}
                <div className="text-center space-y-8">
                    <div className="inline-block bg-zinc-900 border border-zinc-700 px-8 py-4 rounded-2xl">
                        <code className="text-6xl font-mono font-bold text-white">
                            front[q] = <span className="text-purple-400">next[i]</span>;
                        </code>
                    </div>
                </div>

                {/* Interaction */}
                <div className="flex items-center justify-center gap-32">

                    {/* Source: next[5] */}
                    <div style={{ transform: `scale(${nextValReveal})` }} className="flex flex-col items-center gap-4">
                        <span className="text-purple-400 font-bold uppercase tracking-widest text-xl">next[5]</span>
                        <div className="w-40 h-40 bg-purple-900/20 border-4 border-purple-500 rounded-3xl flex flex-col items-center justify-center relative">
                            <span className="text-7xl font-black text-white">7</span>
                            {/* Ghost element moving */}
                            <div
                                style={{
                                    opacity: moveAnimation > 0.1 && moveAnimation < 0.9 ? 1 : 0,
                                    left: `${moveAnimation * 400}px`,
                                    top: '20px'
                                }}
                                className="absolute w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl z-50 pointer-events-none"
                            >7</div>
                        </div>
                    </div>

                    {/* Destination: front[0] */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-blue-500 font-bold uppercase tracking-widest text-xl">front[0]</span>
                        <div className="w-40 h-40 bg-zinc-900 border-4 border-blue-500 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Old Value 5 sliding out */}
                            <span style={{ transform: `translateY(${moveAnimation * 150}%)`, opacity: 1 - moveAnimation }} className="absolute text-7xl font-black text-zinc-500">5</span>
                            {/* New Value 7 sliding in */}
                            <span style={{ transform: `translateY(${(1 - moveAnimation) * -150}%)`, opacity: moveAnimation }} className="absolute text-7xl font-black text-white">7</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DequeueUpdateFrontFrame;
