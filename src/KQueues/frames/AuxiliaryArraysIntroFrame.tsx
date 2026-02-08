import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Database,
    ArrowUpFromLine,
    ArrowDownToLine,
    Share2,
    MousePointer2
} from 'lucide-react';

const AuxiliaryArraysIntroFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- Helpers ---
    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 12 },
        });
    };

    // --- Animations ---
    const containerOpacity = interpolate(frame, [0, 15], [0, 1]);

    // Entries for the 4 Cards
    const card1Enter = createSpring(10);
    const card2Enter = createSpring(20);
    const card3Enter = createSpring(30);
    const card4Enter = createSpring(40);

    // Highlighting Logic (based on script flow)
    // 0:43 start.
    // 0:48 Front highlight
    // 0:52 Rear highlight
    // 0:57 Next highlight
    // 1:10 Free highlight... (This frame covers up to 0:48/50 ish mainly, but sets stage)
    // Actually this frame is 0:43-0:48 "We implement this using three auxiliary arrays and one pointer"
    // So just the intro of all 4.

    const getCardStyle = (springVal: number) => ({
        opacity: interpolate(springVal, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(springVal, [0, 1], [50, 0])}px)`
    });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div
                style={{ opacity: containerOpacity }}
                className="w-full max-w-7xl space-y-16"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-6xl font-black uppercase tracking-tight">
                        The <span className="text-cyan-500">Blueprint</span>
                    </h2>
                    <p className="text-2xl text-zinc-500">
                        3 Arrays + 1 Pointer = Infinite Flexibility
                    </p>
                </div>

                {/* The 4 Components Grid */}
                <div className="grid grid-cols-2 gap-8 px-12">

                    {/* 1. FRONT ARRAY */}
                    <div
                        style={getCardStyle(card1Enter)}
                        className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex gap-6 items-center shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute right-0 top-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />

                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-inner">
                            <ArrowUpFromLine size={48} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white mb-2">front[ ]</h3>
                            <p className="text-zinc-400 text-lg">Tracks the <span className="text-blue-400 font-bold">Head</span> of each queue.</p>
                        </div>
                    </div>

                    {/* 2. REAR ARRAY */}
                    <div
                        style={getCardStyle(card2Enter)}
                        className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex gap-6 items-center shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute right-0 top-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-inner">
                            <ArrowDownToLine size={48} className="text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white mb-2">rear[ ]</h3>
                            <p className="text-zinc-400 text-lg">Tracks the <span className="text-indigo-400 font-bold">Tail</span> of each queue.</p>
                        </div>
                    </div>

                    {/* 3. NEXT ARRAY */}
                    <div
                        style={getCardStyle(card3Enter)}
                        className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex gap-6 items-center shadow-2xl relative overflow-hidden col-span-2 md:col-span-1"
                    >
                        <div className="absolute right-0 top-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-inner">
                            <Share2 size={48} className="text-purple-500" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white mb-2">next[ ]</h3>
                            <p className="text-zinc-400 text-lg">Stores <span className="text-purple-400 font-bold">Links</span> (Next Item or Next Free).</p>
                        </div>
                    </div>

                    {/* 4. FREE POINTER */}
                    <div
                        style={getCardStyle(card4Enter)}
                        className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex gap-6 items-center shadow-2xl relative overflow-hidden col-span-2 md:col-span-1"
                    >
                        <div className="absolute right-0 top-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-inner">
                            <MousePointer2 size={48} className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white mb-2">free</h3>
                            <p className="text-zinc-400 text-lg">Points to the <span className="text-emerald-400 font-bold">First Available</span> slot.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuxiliaryArraysIntroFrame;
