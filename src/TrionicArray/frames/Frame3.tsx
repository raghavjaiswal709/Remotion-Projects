import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AlertTriangle, CheckCircle, Shuffle } from 'lucide-react';

/**
 * Frame 3: Sorted Constraint
 * Duration: 12.02s - 16.42s (132 frames @ 30fps)
 */

const Frame3 = () => {
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
    const sortedArray = [5, 12, 23, 38, 56];
    const unsortedArray = [23, 5, 56, 12, 38];

    // Header animation
    const headerSpring = createSpring(5, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [40, 0]);
    const headerOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

    // Warning badge shake
    const warningShake = frame > 10 && frame < 30 ? Math.sin(frame * 2) * 3 : 0;

    // Sorted array animation
    const sortedOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

    // Unsorted array animation
    const unsortedOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp' });

    // Explanation
    const explainOpacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' });
    const explainSpring = createSpring(100, { stiffness: 60, damping: 12 });
    const explainY = interpolate(explainSpring, [0, 1], [30, 0]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header with Warning Badge */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px) translateX(${warningShake}px)` }}
                className="flex flex-col items-center gap-2 mb-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 border border-red-300">
                    <AlertTriangle size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Critical</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    Must Be <span className="text-red-500">Sorted</span>
                </h2>
            </div>

            {/* Sorted Array - WORKS */}
            <div
                style={{ opacity: sortedOpacity }}
                className="flex flex-col items-center gap-2 mb-6"
            >
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-emerald-500" />
                    <span className="text-lg font-bold text-emerald-600 uppercase tracking-widest">Sorted ✓</span>
                </div>
                <div className="flex gap-2">
                    {sortedArray.map((val, idx) => (
                        <div
                            key={idx}
                            className="w-12 h-12 rounded-lg bg-emerald-500 border-2 border-emerald-600 flex items-center justify-center shadow-md"
                        >
                            <span className="text-xl font-black text-white">{val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Unsorted Array - FAILS */}
            <div
                style={{ opacity: unsortedOpacity }}
                className="flex flex-col items-center gap-2 mb-8"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Shuffle size={18} className="text-red-500" />
                    <span className="text-lg font-bold text-red-600 uppercase tracking-widest">Unsorted ✗</span>
                </div>
                <div className="flex gap-2 relative">
                    {unsortedArray.map((val, idx) => (
                        <div
                            key={idx}
                            className="w-12 h-12 rounded-lg bg-red-400 border-2 border-red-500 flex items-center justify-center shadow-md opacity-60"
                        >
                            <span className="text-xl font-black text-white">{val}</span>
                        </div>
                    ))}
                    {/* X overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-red-600 rotate-12 absolute" />
                        <div className="w-full h-0.5 bg-red-600 -rotate-12 absolute" />
                    </div>
                </div>
            </div>

            {/* Explanation Card */}
            <div
                style={{ opacity: explainOpacity, transform: `translateY(${explainY}px)` }}
                className="w-full max-w-sm p-4 rounded-2xl bg-amber-50 border border-amber-300"
            >
                <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-amber-700 mb-1">Why Sorted?</h3>
                        <p className="text-sm text-gray-600">
                            Binary search uses the <span className="font-bold text-blue-600">order</span> to decide which half to keep.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Frame3;
