import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RefreshCw, Calculator, GitCompare, Move, LogOut } from 'lucide-react';

/**
 * Frame 13: The Loop Process
 * Duration: 56.32s - 63.26s (208 frames @ 30fps)
 */

const Frame13 = () => {
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

    // Cycle icon rotation
    const cycleRotation = frame > 30 ? interpolate(frame - 30, [0, 180], [0, 360]) : 0;

    // Steps animation
    const step1Opacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: 'clamp' });
    const step2Opacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' });
    const step3Opacity = interpolate(frame, [80, 95], [0, 1], { extrapolateRight: 'clamp' });

    // Exit conditions
    const exitOpacity = interpolate(frame, [110, 130], [0, 1], { extrapolateRight: 'clamp' });
    const exitSpring = createSpring(110, { stiffness: 60, damping: 12 });
    const exitY = interpolate(exitSpring, [0, 1], [30, 0]);

    // Search space shrink visualization
    const shrinkProgress = interpolate(frame, [140, 200], [0, 1], { extrapolateRight: 'clamp' });
    const barWidths = [100, 80, 60, 40, 20, 10];

    const steps = [
        { icon: Calculator, label: 'Calculate Mid', color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-100' },
        { icon: GitCompare, label: 'Compare', color: 'bg-violet-500', textColor: 'text-violet-700', bgLight: 'bg-violet-100' },
        { icon: Move, label: 'Move Pointer', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-100' },
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Header */}
            <div
                style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)` }}
                className="flex flex-col items-center gap-2 mb-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                    <RefreshCw size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">The Loop</span>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800">
                    <span className="text-indigo-600">Repeat</span> Until Done
                </h2>
            </div>

            {/* Rotating Cycle Icon */}
            <div
                style={{ transform: `rotate(${cycleRotation}deg)` }}
                className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center mb-6 shadow-lg"
            >
                <RefreshCw size={28} className="text-white" />
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-2 w-full max-w-xs mb-6">
                {steps.map((step, idx) => {
                    const opacity = idx === 0 ? step1Opacity : idx === 1 ? step2Opacity : step3Opacity;
                    const IconComponent = step.icon;

                    return (
                        <div
                            key={idx}
                            style={{ opacity }}
                            className={`flex items-center gap-3 p-3 rounded-xl ${step.bgLight} border`}
                        >
                            <div className={`w-8 h-8 rounded-lg ${step.color} flex items-center justify-center`}>
                                <IconComponent size={16} className="text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${step.textColor}`}>{idx + 1}.</span>
                                <span className="text-sm font-semibold text-gray-700">{step.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Exit Conditions */}
            <div
                style={{ opacity: exitOpacity, transform: `translateY(${exitY}px)` }}
                className="w-full max-w-xs mb-6"
            >
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                        <LogOut size={16} className="text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">Exit When:</span>
                    </div>
                    <ul className="space-y-1 ml-6 text-sm">
                        <li className="text-gray-600">✓ <span className="text-emerald-600 font-bold">Found</span> target</li>
                        <li className="text-gray-600">✓ <span className="text-red-500 font-bold">L {'>'} R</span> (not found)</li>
                    </ul>
                </div>
            </div>

            {/* Search Space Shrinking */}
            <div
                style={{ opacity: shrinkProgress }}
                className="w-full max-w-xs"
            >
                <div className="text-center mb-2">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Space Halves Each Time</span>
                </div>
                <div className="space-y-1">
                    {barWidths.map((width, idx) => {
                        const barProgress = interpolate(shrinkProgress, [idx * 0.15, idx * 0.15 + 0.15], [0, 1], {
                            extrapolateLeft: 'clamp',
                            extrapolateRight: 'clamp',
                        });

                        return (
                            <div
                                key={idx}
                                style={{ width: `${width}%`, opacity: barProgress }}
                                className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto"
                            />
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default Frame13;
