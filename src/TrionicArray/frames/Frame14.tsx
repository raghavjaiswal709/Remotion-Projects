import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Zap, Timer, Lightbulb, BarChart3 } from 'lucide-react';

/**
 * Frame 14: Time Complexity O(log n)
 * Duration: 63.26s - 67.60s (131 frames @ 30fps)
 */

const Frame14 = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number; mass?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 12 },
        });
    };

    // Header animation
    const headerSpring = createSpring(5, { stiffness: 60, damping: 12 });
    const headerY = interpolate(headerSpring, [0, 1], [40, 0]);
    const headerOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });

    // Big O reveal
    const bigOSpring = createSpring(25, { stiffness: 100, damping: 8 });
    const bigOScale = interpolate(bigOSpring, [0, 1], [0, 1]);
    const bigOOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' });

    // Comparison chart
    const chartOpacity = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: 'clamp' });
    const chartSpring = createSpring(55, { stiffness: 60, damping: 12 });
    const chartY = interpolate(chartSpring, [0, 1], [30, 0]);

    // Interview tip
    const tipOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: 'clamp' });
    const tipSpring = createSpring(90, { stiffness: 60, damping: 12 });
    const tipY = interpolate(tipSpring, [0, 1], [30, 0]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    <Timer size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Efficiency</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    Time <span className="text-emerald-600">Complexity</span>
                </h2>
            </div>

            {/* Big O Display */}
            <div
                style={{ opacity: bigOOpacity, transform: `scale(${bigOScale})` }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 shadow-xl">
                    <Zap size={32} className="text-white" />
                    <span className="text-5xl font-black text-white tracking-tight">O(log n)</span>
                </div>
            </div>

            {/* Comparison Chart */}
            <div
                style={{ opacity: chartOpacity, transform: `translateY(${chartY}px)` }}
                className="w-full max-w-xs mb-8"
            >
                <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={16} className="text-gray-600" />
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Comparison</span>
                </div>
                <div className="space-y-3">
                    {/* Linear Search */}
                    <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                            <span className="text-sm font-bold text-red-500">O(n)</span>
                        </div>
                        <div className="flex-1 h-6 rounded-lg bg-red-100 overflow-hidden">
                            <div className="h-full w-full bg-red-400 rounded-lg" />
                        </div>
                        <span className="text-xs text-gray-500 w-14">Linear</span>
                    </div>
                    {/* Binary Search */}
                    <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                            <span className="text-sm font-bold text-emerald-600">O(log n)</span>
                        </div>
                        <div className="flex-1 h-6 rounded-lg bg-emerald-100 overflow-hidden">
                            <div className="h-full w-1/5 bg-emerald-500 rounded-lg" />
                        </div>
                        <span className="text-xs text-gray-500 w-14">Binary</span>
                    </div>
                </div>
                <div className="mt-3 text-center text-sm text-gray-600">
                    <span className="font-bold text-violet-600">1M</span> elements:
                    <span className="text-red-500 font-bold"> 1,000,000</span> vs
                    <span className="text-emerald-600 font-bold"> 20</span> steps!
                </div>
            </div>

            {/* Interview Tip */}
            <div
                style={{ opacity: tipOpacity, transform: `translateY(${tipY}px)` }}
                className="w-full max-w-xs"
            >
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-300">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <Lightbulb size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-amber-700 mb-1">Interview Tip</h3>
                        <p className="text-sm text-gray-600">
                            Binary search is a <span className="text-amber-600 font-bold">must-know</span>!
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Frame14;
