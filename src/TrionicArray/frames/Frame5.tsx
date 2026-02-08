import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ArrowDown, Calculator, Crosshair } from 'lucide-react';

/**
 * Frame 5: Middle Index Calculation
 * Duration: 21.64s - 25.56s (117 frames @ 30fps)
 */

const Frame5 = () => {
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
    const leftIndex = 0;
    const rightIndex = 4;
    const midIndex = Math.floor((leftIndex + rightIndex) / 2); // = 2

    // Header animation
    const headerSpring = createSpring(5, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [40, 0]);
    const headerOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

    // Formula animation
    const formulaOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' });
    const formulaSpring = createSpring(25, { stiffness: 80, damping: 10 });
    const formulaScale = interpolate(formulaSpring, [0, 1], [0.8, 1]);

    // Array animation
    const arrayOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' });

    // Mid pointer drop
    const midPointerSpring = createSpring(70, { stiffness: 100, damping: 8 });
    const midPointerY = interpolate(midPointerSpring, [0, 1], [-50, 0]);
    const midPointerOpacity = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: 'clamp' });

    // Crosshair effect on mid element
    const crosshairOpacity = interpolate(frame, [85, 100], [0, 1], { extrapolateRight: 'clamp' });
    const crosshairPulse = frame > 90 ? interpolate(Math.sin((frame - 90) / 8 * Math.PI), [-1, 1], [0.8, 1.1]) : 1;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                    <Calculator size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Step 2</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    Find <span className="text-amber-600">Middle</span>
                </h2>
            </div>

            {/* Formula Display */}
            <div
                style={{ opacity: formulaOpacity, transform: `scale(${formulaScale})` }}
                className="flex items-center gap-2 mb-8 px-5 py-3 rounded-xl bg-gray-100 border border-gray-200"
            >
                <span className="text-xl font-mono font-bold text-gray-600">Mid = (</span>
                <span className="text-xl font-mono font-bold text-blue-600">{leftIndex}</span>
                <span className="text-xl font-mono font-bold text-gray-600">+</span>
                <span className="text-xl font-mono font-bold text-purple-600">{rightIndex}</span>
                <span className="text-xl font-mono font-bold text-gray-600">) / 2 =</span>
                <span className="text-2xl font-black text-amber-600">{midIndex}</span>
            </div>

            {/* Array with Mid Pointer */}
            <div
                style={{ opacity: arrayOpacity }}
                className="relative flex flex-col items-center"
            >
                {/* Pointers above array */}
                <div className="flex gap-2 mb-2">
                    {arrayData.map((_, idx) => (
                        <div key={idx} className="w-14 flex justify-center">
                            {idx === midIndex && (
                                <div
                                    style={{
                                        opacity: midPointerOpacity,
                                        transform: `translateY(${midPointerY}px)`,
                                    }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="px-2 py-1 rounded-lg bg-amber-500 text-white font-bold text-xs shadow flex items-center gap-1">
                                        <Crosshair size={12} />
                                        Mid
                                    </div>
                                    <ArrowDown size={18} className="text-amber-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Array cells */}
                <div className="flex gap-2">
                    {arrayData.map((val, idx) => {
                        const isMid = idx === midIndex;
                        const isLeft = idx === leftIndex;
                        const isRight = idx === rightIndex;

                        return (
                            <div key={idx} className="relative flex flex-col items-center gap-1">
                                {/* Crosshair effect on mid */}
                                {isMid && (
                                    <div
                                        style={{ opacity: crosshairOpacity, transform: `scale(${crosshairPulse})` }}
                                        className="absolute -inset-1.5 border-2 border-amber-400 rounded-xl pointer-events-none"
                                    />
                                )}

                                <div
                                    className={`
                                        w-14 h-14 rounded-xl flex items-center justify-center shadow-md border-2
                                        ${isMid ? 'bg-amber-500 border-amber-600' : ''}
                                        ${isLeft && !isMid ? 'bg-blue-400 border-blue-500' : ''}
                                        ${isRight && !isMid ? 'bg-purple-400 border-purple-500' : ''}
                                        ${!isMid && !isLeft && !isRight ? 'bg-gray-200 border-gray-300' : ''}
                                    `}
                                >
                                    <span className={`text-2xl font-black ${isMid || isLeft || isRight ? 'text-white' : 'text-gray-600'}`}>
                                        {val}
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-gray-500">[{idx}]</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Result card */}
            <div
                style={{ opacity: crosshairOpacity }}
                className="mt-8 px-5 py-3 rounded-xl bg-amber-50 border border-amber-300"
            >
                <div className="text-lg text-gray-700 text-center">
                    Mid = <span className="font-black text-amber-600 text-xl">{arrayData[midIndex]}</span> at index <span className="font-black text-amber-600 text-xl">{midIndex}</span>
                </div>
            </div>

        </div>
    );
};

export default Frame5;
