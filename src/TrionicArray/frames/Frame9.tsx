import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scissors, ArrowRight } from 'lucide-react';

/**
 * Frame 9: Discard The Right Half
 * Duration: 38.00s - 44.62s (198 frames @ 30fps)
 */

const Frame9 = () => {
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
    const oldMidIndex = 2;
    const newRightIndex = oldMidIndex - 1; // = 1

    // Header animation
    const headerSpring = createSpring(5, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [40, 0]);
    const headerOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });

    // Array animation
    const arrayOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });

    // Discard animation
    const discardProgress = interpolate(frame, [50, 90], [0, 1], { extrapolateRight: 'clamp' });

    // Pointer movement
    const pointerMoveProgress = interpolate(frame, [100, 140], [0, 1], { extrapolateRight: 'clamp' });
    const pointerSpring = createSpring(100, { stiffness: 60, damping: 12 });

    // New boundary display
    const newBoundaryOpacity = interpolate(frame, [150, 175], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600">
                    <Scissors size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Elimination</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    Discard <span className="text-red-500">Right</span>
                </h2>
            </div>

            {/* Array with animations */}
            <div
                style={{ opacity: arrayOpacity }}
                className="relative flex flex-col items-center"
            >
                {/* Array cells */}
                <div className="flex gap-2">
                    {arrayData.map((val, idx) => {
                        const isDiscarded = idx >= oldMidIndex;
                        const isKept = idx < oldMidIndex;

                        const fadeEffect = isDiscarded ? discardProgress : 0;

                        return (
                            <div key={idx} className="relative flex flex-col items-center gap-1">
                                <div
                                    style={{
                                        opacity: isDiscarded ? 1 - fadeEffect * 0.6 : 1,
                                        transform: isDiscarded ? `scale(${1 - fadeEffect * 0.1})` : 'scale(1)',
                                    }}
                                    className={`
                                        w-12 h-12 rounded-lg flex items-center justify-center border-2 shadow-md
                                        ${isKept ? 'bg-emerald-400 border-emerald-500' : 'bg-red-200 border-red-300'}
                                    `}
                                >
                                    <span className={`text-xl font-black ${isKept ? 'text-white' : 'text-red-400'}`}>
                                        {val}
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-gray-500">[{idx}]</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pointer Movement Display */}
            <div
                style={{ opacity: pointerMoveProgress }}
                className="mt-8 flex items-center gap-3"
            >
                <div className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-purple-100 border border-purple-200">
                    <span className="text-xs text-gray-500">Old R</span>
                    <span className="text-lg font-mono font-bold text-purple-400 line-through">4</span>
                </div>
                <ArrowRight size={20} className="text-purple-500" />
                <div
                    style={{ transform: `scale(${pointerSpring})` }}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-purple-600 shadow-lg"
                >
                    <span className="text-xs text-purple-200">New R</span>
                    <span className="text-lg font-mono font-bold text-white">{newRightIndex}</span>
                </div>
            </div>

            {/* Formula */}
            <div
                style={{ opacity: pointerMoveProgress }}
                className="mt-3 text-sm font-mono text-gray-600"
            >
                R = Mid - 1 = 2 - 1 = <span className="text-purple-600 font-bold">{newRightIndex}</span>
            </div>

            {/* New Search Space */}
            <div
                style={{ opacity: newBoundaryOpacity }}
                className="mt-6 w-full max-w-xs"
            >
                <div className="h-8 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative">
                    <div
                        style={{ width: `${((newRightIndex + 1) / arrayData.length) * 100}%` }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-emerald-400"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">New: {newRightIndex + 1} Elements</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Frame9;
