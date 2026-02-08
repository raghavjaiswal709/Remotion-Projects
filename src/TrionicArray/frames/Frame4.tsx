import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ArrowDown, Ruler } from 'lucide-react';

/**
 * Frame 4: Left and Right Boundaries
 * Duration: 16.42s - 21.64s (157 frames @ 30fps)
 */

const Frame4 = () => {
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

    // Header animation
    const headerSpring = createSpring(5, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [40, 0]);
    const headerOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

    // Array animation
    const arrayOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' });

    // Left pointer animation
    const leftPointerSpring = createSpring(55, { stiffness: 80, damping: 10 });
    const leftPointerY = interpolate(leftPointerSpring, [0, 1], [-40, 0]);
    const leftPointerOpacity = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: 'clamp' });

    // Right pointer animation
    const rightPointerSpring = createSpring(75, { stiffness: 80, damping: 10 });
    const rightPointerY = interpolate(rightPointerSpring, [0, 1], [-40, 0]);
    const rightPointerOpacity = interpolate(frame, [75, 95], [0, 1], { extrapolateRight: 'clamp' });

    // Search space indicator
    const searchSpaceOpacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' });

    // Info cards
    const card1Opacity = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: 'clamp' });
    const card2Opacity = interpolate(frame, [135, 155], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                    <Ruler size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Boundaries</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    L & R <span className="text-purple-600">Pointers</span>
                </h2>
            </div>

            {/* Array with Pointers */}
            <div
                style={{ opacity: arrayOpacity }}
                className="relative flex flex-col items-center"
            >
                {/* Pointers above array */}
                <div className="flex gap-2 mb-2">
                    {arrayData.map((_, idx) => (
                        <div key={idx} className="w-14 flex justify-center">
                            {idx === leftIndex && (
                                <div
                                    style={{
                                        opacity: leftPointerOpacity,
                                        transform: `translateY(${leftPointerY}px)`,
                                    }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="px-2 py-1 rounded-lg bg-blue-500 text-white font-bold text-xs shadow">
                                        L={leftIndex}
                                    </div>
                                    <ArrowDown size={16} className="text-blue-500" />
                                </div>
                            )}
                            {idx === rightIndex && (
                                <div
                                    style={{
                                        opacity: rightPointerOpacity,
                                        transform: `translateY(${rightPointerY}px)`,
                                    }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="px-2 py-1 rounded-lg bg-purple-500 text-white font-bold text-xs shadow">
                                        R={rightIndex}
                                    </div>
                                    <ArrowDown size={16} className="text-purple-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Array cells */}
                <div className="flex gap-2">
                    {arrayData.map((val, idx) => {
                        const isLeft = idx === leftIndex;
                        const isRight = idx === rightIndex;

                        return (
                            <div key={idx} className="flex flex-col items-center gap-1">
                                <div
                                    className={`
                                        w-14 h-14 rounded-xl flex items-center justify-center shadow-md border-2
                                        ${isLeft ? 'bg-blue-500 border-blue-600' : ''}
                                        ${isRight ? 'bg-purple-500 border-purple-600' : ''}
                                        ${!isLeft && !isRight ? 'bg-gray-200 border-gray-300' : ''}
                                    `}
                                >
                                    <span className={`text-2xl font-black ${isLeft || isRight ? 'text-white' : 'text-gray-600'}`}>
                                        {val}
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-gray-500">[{idx}]</span>
                            </div>
                        );
                    })}
                </div>

                {/* Search Space Indicator */}
                <div
                    style={{ opacity: searchSpaceOpacity }}
                    className="mt-4 flex flex-col items-center"
                >
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-purple-400" style={{ width: '100%' }} />
                    <span className="mt-1 text-sm font-bold text-gray-600 uppercase tracking-widest">Search Space</span>
                </div>
            </div>

            {/* Info Cards */}
            <div className="flex gap-3 mt-8">
                <div
                    style={{ opacity: card1Opacity }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200"
                >
                    <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-xs">L</div>
                    <span className="text-sm font-semibold text-gray-700">= <span className="text-blue-600 font-bold">0</span></span>
                </div>
                <div
                    style={{ opacity: card2Opacity }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 border border-purple-200"
                >
                    <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-white font-bold text-xs">R</div>
                    <span className="text-sm font-semibold text-gray-700">= <span className="text-purple-600 font-bold">n-1</span></span>
                </div>
            </div>

        </div>
    );
};

export default Frame4;
