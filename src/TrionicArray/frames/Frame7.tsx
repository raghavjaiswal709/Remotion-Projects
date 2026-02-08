import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CheckCircle, PartyPopper, Trophy } from 'lucide-react';

/**
 * Frame 7: Match Found - Success Case
 * Duration: 28.38s - 33.36s (149 frames @ 30fps)
 */

const Frame7 = () => {
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
    const targetValue = 23;
    const foundIndex = arrayData.indexOf(targetValue); // = 2

    // Title animation
    const titleSpring = createSpring(5, { stiffness: 100, damping: 10 });
    const titleScale = interpolate(titleSpring, [0, 1], [0, 1]);
    const titleOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });

    // Element reveal
    const elementSpring = createSpring(25, { stiffness: 120, damping: 8 });
    const elementScale = interpolate(elementSpring, [0, 1], [0.5, 1]);
    const elementOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' });

    // Ring animation
    const ringProgress = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' });
    const ringScale1 = interpolate(ringProgress, [0, 1], [0.8, 1.8]);
    const ringOpacity = interpolate(ringProgress, [0, 0.5, 1], [0, 0.6, 0]);

    // Success badge
    const badgeSpring = createSpring(65, { stiffness: 80, damping: 10 });
    const badgeScale = interpolate(badgeSpring, [0, 1], [0, 1]);
    const badgeOpacity = interpolate(frame, [65, 85], [0, 1], { extrapolateRight: 'clamp' });

    // Summary text
    const summaryOpacity = interpolate(frame, [95, 115], [0, 1], { extrapolateRight: 'clamp' });
    const summarySpring = createSpring(95, { stiffness: 60, damping: 12 });
    const summaryY = interpolate(summarySpring, [0, 1], [30, 0]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Celebration gradient */}
            <div
                style={{ opacity: elementOpacity * 0.15 }}
                className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-transparent to-teal-200 pointer-events-none"
            />

            {/* Title */}
            <div
                style={{ opacity: titleOpacity, transform: `scale(${titleScale})` }}
                className="flex flex-col items-center gap-2 mb-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                    <PartyPopper size={14} />
                    <span className="uppercase tracking-widest text-xs font-bold">Success</span>
                </div>
                <h2 className="text-4xl font-black text-center text-emerald-600">
                    MATCH FOUND!
                </h2>
            </div>

            {/* Found Element Display */}
            <div className="relative flex flex-col items-center mb-8">

                {/* Expanding ring */}
                <div
                    style={{ opacity: ringOpacity, transform: `scale(${ringScale1})` }}
                    className="absolute w-28 h-28 rounded-full border-4 border-emerald-400 pointer-events-none"
                />

                {/* The element */}
                <div
                    style={{ opacity: elementOpacity, transform: `scale(${elementScale})` }}
                    className="relative"
                >
                    <div className="absolute -top-2 -right-2">
                        <CheckCircle size={24} className="text-emerald-500 fill-white" />
                    </div>
                    <div className="flex flex-col items-center gap-2 px-10 py-6 rounded-2xl bg-emerald-500 border-2 border-emerald-600 shadow-xl">
                        <span className="text-sm font-bold text-emerald-100 uppercase tracking-widest">Found at [{foundIndex}]</span>
                        <span className="text-6xl font-black text-white leading-none">{targetValue}</span>
                    </div>
                </div>
            </div>

            {/* Success Badge */}
            <div
                style={{ opacity: badgeOpacity, transform: `scale(${badgeScale})` }}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-500 shadow-lg mb-6"
            >
                <Trophy size={20} className="text-white" />
                <span className="text-lg font-black text-white uppercase tracking-wider">Search Complete</span>
                <Trophy size={20} className="text-white" />
            </div>

            {/* Summary */}
            <div
                style={{ opacity: summaryOpacity, transform: `translateY(${summaryY}px)` }}
                className="text-center max-w-xs"
            >
                <p className="text-lg text-gray-700">
                    When <span className="text-amber-600 font-bold">Mid == Target</span>, return index.
                </p>
            </div>

        </div>
    );
};

export default Frame7;
