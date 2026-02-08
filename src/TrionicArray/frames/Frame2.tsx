import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Target, SortAsc } from 'lucide-react';

/**
 * Frame 2: Sorted List Concept
 * Duration: 4.58s - 12.02s (223 frames @ 30fps)
 */

const Frame2 = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number; mass?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 12 },
        });
    };

    // Data - 5 elements only
    const arrayData = [5, 12, 23, 38, 56];
    const targetValue = 23;

    // Header animation
    const headerSpring = createSpring(5, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [40, 0]);
    const headerOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

    // Array animation
    const arrayOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

    // Target reveal
    const targetSpring = createSpring(80, { stiffness: 80, damping: 10 });
    const targetScale = interpolate(targetSpring, [0, 1], [0, 1]);
    const targetOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: 'clamp' });

    // Explanation cards
    const card1Spring = createSpring(120, { stiffness: 60, damping: 12 });
    const card1Y = interpolate(card1Spring, [0, 1], [30, 0]);
    const card1Opacity = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: 'clamp' });

    const card2Spring = createSpring(150, { stiffness: 60, damping: 12 });
    const card2Y = interpolate(card2Spring, [0, 1], [30, 0]);
    const card2Opacity = interpolate(frame, [150, 170], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    <SortAsc size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Sorted List</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    The <span className="text-blue-600">Array</span>
                </h2>
            </div>

            {/* Array - horizontal single row */}
            <div
                style={{ opacity: arrayOpacity }}
                className="flex gap-2 mb-8"
            >
                {arrayData.map((val, idx) => {
                    const cellSpring = createSpring(35 + idx * 8, { stiffness: 80, damping: 10 });
                    const cellScale = interpolate(cellSpring, [0, 1], [0, 1]);

                    return (
                        <div
                            key={idx}
                            style={{ transform: `scale(${cellScale})` }}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="w-14 h-14 rounded-xl bg-blue-500 border-2 border-blue-600 flex items-center justify-center shadow-md">
                                <span className="text-2xl font-black text-white">{val}</span>
                            </div>
                            <span className="text-xs font-mono text-gray-500">[{idx}]</span>
                        </div>
                    );
                })}
            </div>

            {/* Target Value Display */}
            <div
                style={{ opacity: targetOpacity, transform: `scale(${targetScale})` }}
                className="flex flex-col items-center gap-2 mb-8"
            >
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-amber-100 border-2 border-amber-400 shadow-lg">
                    <Target size={24} className="text-amber-600" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Target</span>
                        <span className="text-4xl font-black text-amber-600">{targetValue}</span>
                    </div>
                </div>
            </div>

            {/* Explanation Cards */}
            <div className="flex flex-col gap-3 w-full max-w-sm">
                <div
                    style={{ opacity: card1Opacity, transform: `translateY(${card1Y}px)` }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200"
                >
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Array is <span className="text-blue-600 font-bold">sorted</span></span>
                </div>
                <div
                    style={{ opacity: card2Opacity, transform: `translateY(${card2Y}px)` }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200"
                >
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Find the <span className="text-amber-600 font-bold">target</span></span>
                </div>
            </div>

        </div>
    );
};

export default Frame2;
