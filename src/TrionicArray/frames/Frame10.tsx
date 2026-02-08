import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ChevronDown, AlertTriangle, ArrowDown } from 'lucide-react';

/**
 * Frame 10: Mid < Target - Target on Right
 * Duration: 44.62s - 49.20s (138 frames @ 30fps)
 */

const Frame10 = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number; mass?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 12 },
        });
    };

    // Data - 5 elements (for this case: mid=23, target=38, so mid < target)
    const arrayData = [5, 12, 23, 38, 56];
    const midIndex = 2;
    const midValue = arrayData[midIndex]; // 23
    const targetValue = 38;

    // Header animation
    const headerSpring = createSpring(5, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [40, 0]);
    const headerOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });

    // Comparison display
    const compSpring = createSpring(22, { stiffness: 80, damping: 10 });
    const compScale = interpolate(compSpring, [0, 1], [0.8, 1]);
    const compOpacity = interpolate(frame, [22, 40], [0, 1], { extrapolateRight: 'clamp' });

    // Array animation
    const arrayOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: 'clamp' });

    // Left side fade
    const leftFadeProgress = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });

    // Explanation
    const explainOpacity = interpolate(frame, [95, 115], [0, 1], { extrapolateRight: 'clamp' });
    const explainSpring = createSpring(95, { stiffness: 60, damping: 12 });
    const explainY = interpolate(explainSpring, [0, 1], [30, 0]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">
                    <ChevronDown size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Mid {'<'} Target</span>
                </div>
                <h2 className="text-2xl font-black text-center text-gray-800">
                    <span className="text-amber-600">Mid</span> is <span className="text-cyan-600">Smaller</span>
                </h2>
            </div>

            {/* Comparison Visual */}
            <div
                style={{ opacity: compOpacity, transform: `scale(${compScale})` }}
                className="flex items-center gap-4 mb-6"
            >
                <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-amber-100 border border-amber-400">
                    <span className="text-xs font-bold text-amber-700 uppercase">Mid</span>
                    <span className="text-4xl font-black text-amber-600">{midValue}</span>
                </div>
                <span className="text-3xl font-black text-cyan-500">{'<'}</span>
                <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-emerald-100 border border-emerald-400">
                    <span className="text-xs font-bold text-emerald-700 uppercase">Target</span>
                    <span className="text-4xl font-black text-emerald-600">{targetValue}</span>
                </div>
            </div>

            {/* Array with pointer */}
            <div
                style={{ opacity: arrayOpacity }}
                className="relative flex flex-col items-center"
            >
                {/* Pointer above mid */}
                <div className="flex gap-2 mb-2">
                    {arrayData.map((_, idx) => (
                        <div key={idx} className="w-12 flex justify-center">
                            {idx === midIndex && (
                                <div className="flex flex-col items-center">
                                    <div className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-xs">Mid</div>
                                    <ArrowDown size={14} className="text-amber-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Array cells */}
                <div className="flex gap-2">
                    {arrayData.map((val, idx) => {
                        const isMid = idx === midIndex;
                        const isLeft = idx <= midIndex;
                        const isRight = idx > midIndex;

                        const leftFade = isLeft && !isMid ? leftFadeProgress : 0;

                        return (
                            <div key={idx} className="relative flex flex-col items-center gap-1">
                                <div
                                    style={{ opacity: isLeft && !isMid ? 1 - leftFade * 0.4 : 1 }}
                                    className={`
                                        w-12 h-12 rounded-lg flex items-center justify-center border-2 shadow-md
                                        ${isMid ? 'bg-amber-500 border-amber-600' : ''}
                                        ${isLeft && !isMid ? 'bg-cyan-200 border-cyan-300' : ''}
                                        ${isRight ? 'bg-emerald-400 border-emerald-500' : ''}
                                    `}
                                >
                                    <span className={`text-xl font-black ${isMid || isRight ? 'text-white' : 'text-cyan-600'}`}>
                                        {val}
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-gray-500">[{idx}]</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Explanation Card */}
            <div
                style={{ opacity: explainOpacity, transform: `translateY(${explainY}px)` }}
                className="w-full max-w-sm mt-6"
            >
                <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-50 border border-cyan-200">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={16} className="text-white" />
                    </div>
                    <p className="text-sm text-gray-600">
                        Left side <span className="text-cyan-600 font-bold">eliminated</span> - target is on the <span className="text-emerald-600 font-bold">right</span>.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Frame10;
