import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Snowflake, XCircle, ArrowDown } from 'lucide-react';

/**
 * Frame 11: Left Elements Are Smaller
 * Duration: 49.20s - 51.82s (78 frames @ 30fps)
 */

const Frame11 = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number; mass?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 12 },
        });
    };

    // Data - 5 elements
    const arrayData = [5, 12, 23, 38, 56];
    const midIndex = 2;

    // Header animation
    const headerSpring = createSpring(3, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [30, 0]);
    const headerOpacity = interpolate(frame, [3, 15], [0, 1], { extrapolateRight: 'clamp' });

    // Array animation
    const arrayOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

    // Freeze effect on left elements
    const freezeProgress = interpolate(frame, [35, 65], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-300">
                    <Snowflake size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Skip Left</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    Left is <span className="text-cyan-600">Too Small</span>
                </h2>
            </div>

            {/* Array with freeze effect */}
            <div
                style={{ opacity: arrayOpacity }}
                className="relative flex flex-col items-center"
            >
                {/* Mid Pointer */}
                <div className="flex gap-2 mb-2">
                    {arrayData.map((_, idx) => (
                        <div key={idx} className="w-12 flex justify-center">
                            {idx === midIndex && (
                                <div className="flex flex-col items-center">
                                    <div className="px-2 py-0.5 rounded-lg bg-amber-500 text-white font-bold text-xs">Mid</div>
                                    <ArrowDown size={14} className="text-amber-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Array cells */}
                <div className="flex gap-2">
                    {arrayData.map((val, idx) => {
                        const isLeft = idx <= midIndex;
                        const isRight = idx > midIndex;

                        const freezeFade = isLeft ? freezeProgress : 0;

                        return (
                            <div key={idx} className="relative flex flex-col items-center gap-1">
                                <div
                                    style={{ opacity: isLeft ? 1 - freezeFade * 0.4 : 1 }}
                                    className={`
                                        w-12 h-12 rounded-lg flex items-center justify-center border-2 shadow-md
                                        ${isLeft ? 'bg-cyan-200 border-cyan-300' : 'bg-emerald-400 border-emerald-500'}
                                    `}
                                >
                                    <span className={`text-xl font-black ${isRight ? 'text-white' : 'text-cyan-600'}`}>
                                        {val}
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-gray-500">[{idx}]</span>

                                {/* X mark on left elements */}
                                {isLeft && freezeFade > 0.5 && (
                                    <XCircle
                                        size={16}
                                        className="absolute -top-1 -right-1 text-cyan-500"
                                        style={{ opacity: (freezeFade - 0.5) * 2 }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Explanation */}
            <div
                style={{ opacity: freezeProgress }}
                className="mt-8 text-center max-w-xs"
            >
                <p className="text-lg text-gray-700">
                    All left values are <span className="text-cyan-600 font-bold">smaller than Target</span>.
                </p>
            </div>

        </div>
    );
};

export default Frame11;
