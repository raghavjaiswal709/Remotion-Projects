import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GitCompare, HelpCircle, ArrowUpDown } from 'lucide-react';

/**
 * Frame 6: Compare Mid to Target
 * Duration: 25.56s - 28.38s (85 frames @ 30fps)
 */

const Frame6 = () => {
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
    const midValue = arrayData[midIndex]; // 23
    const targetValue = 38;

    // Header animation
    const headerSpring = createSpring(3, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [30, 0]);
    const headerOpacity = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });

    // Mid box
    const midOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
    const midSpring = createSpring(15, { stiffness: 80, damping: 10 });
    const midScale = interpolate(midSpring, [0, 1], [0.8, 1]);

    // Connector
    const connectorOpacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });

    // Target box
    const targetOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' });
    const targetSpring = createSpring(30, { stiffness: 80, damping: 10 });
    const targetScale = interpolate(targetSpring, [0, 1], [0.8, 1]);

    // Question reveal
    const questionOpacity = interpolate(frame, [55, 70], [0, 1], { extrapolateRight: 'clamp' });
    const questionSpring = createSpring(55, { stiffness: 100, damping: 10 });
    const questionScale = interpolate(questionSpring, [0, 1], [0, 1]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700">
                    <GitCompare size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Step 3</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    The <span className="text-violet-600">Comparison</span>
                </h2>
            </div>

            {/* Comparison Area */}
            <div className="flex flex-col items-center gap-4">

                {/* Mid Value Box */}
                <div
                    style={{ opacity: midOpacity, transform: `scale(${midScale})` }}
                    className="flex flex-col items-center gap-1 px-8 py-4 rounded-2xl bg-amber-100 border-2 border-amber-400 shadow-lg"
                >
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Mid Value</span>
                    <span className="text-5xl font-black text-amber-600">{midValue}</span>
                    <span className="text-sm font-mono text-amber-600">arr[{midIndex}]</span>
                </div>

                {/* Connector */}
                <div
                    style={{ opacity: connectorOpacity }}
                    className="flex flex-col items-center gap-1"
                >
                    <ArrowUpDown size={24} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Compare</span>
                </div>

                {/* Target Value Box */}
                <div
                    style={{ opacity: targetOpacity, transform: `scale(${targetScale})` }}
                    className="flex flex-col items-center gap-1 px-8 py-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 shadow-lg"
                >
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Target</span>
                    <span className="text-5xl font-black text-emerald-600">{targetValue}</span>
                </div>

                {/* Question */}
                <div
                    style={{ opacity: questionOpacity, transform: `scale(${questionScale})` }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-100 border border-violet-300 mt-4"
                >
                    <HelpCircle size={20} className="text-violet-600" />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-violet-700">Is {midValue} == {targetValue}?</span>
                        <span className="text-sm font-mono text-gray-600">{midValue} == {targetValue} → <span className="text-red-500 font-bold">FALSE</span></span>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Frame6;
