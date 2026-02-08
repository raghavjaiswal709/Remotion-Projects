import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Trophy, Divide, CheckCircle, Sparkles } from 'lucide-react';

/**
 * Frame 15: Outro - Problem Solved
 * Duration: 67.60s - 71.50s (117 frames @ 30fps)
 */

const Frame15 = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number; mass?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 12 },
        });
    };

    // Title animation
    const titleSpring = createSpring(5, { stiffness: 100, damping: 10 });
    const titleScale = interpolate(titleSpring, [0, 1], [0.5, 1]);
    const titleOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });

    // Trophy bounce
    const trophySpring = createSpring(15, { stiffness: 120, damping: 8 });
    const trophyY = interpolate(trophySpring, [0, 1], [-50, 0]);
    const trophyOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

    // Divide by 2 visual
    const divideOpacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });
    const divideSpring = createSpring(35, { stiffness: 80, damping: 10 });
    const divideScale = interpolate(divideSpring, [0, 1], [0.8, 1]);

    // Summary bullets
    const bullet1Opacity = interpolate(frame, [55, 68], [0, 1], { extrapolateRight: 'clamp' });
    const bullet2Opacity = interpolate(frame, [65, 78], [0, 1], { extrapolateRight: 'clamp' });
    const bullet3Opacity = interpolate(frame, [75, 88], [0, 1], { extrapolateRight: 'clamp' });

    // Final celebration
    const celebOpacity = interpolate(frame, [95, 110], [0, 1], { extrapolateRight: 'clamp' });
    const celebSpring = createSpring(95, { stiffness: 100, damping: 10 });
    const celebScale = interpolate(celebSpring, [0, 1], [0.8, 1]);

    const bullets = [
        { text: 'Works on sorted data', opacity: bullet1Opacity },
        { text: 'O(log n) complexity', opacity: bullet2Opacity },
        { text: 'Halves each step', opacity: bullet3Opacity },
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Celebration gradient */}
            <div
                style={{ opacity: celebOpacity * 0.1 }}
                className="absolute inset-0 bg-gradient-to-br from-violet-200 via-pink-100 to-amber-100 pointer-events-none"
            />

            {/* Title with Trophy */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div
                    style={{ opacity: trophyOpacity, transform: `translateY(${trophyY}px)` }}
                    className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center shadow-lg"
                >
                    <Trophy size={28} className="text-white" />
                </div>

                <div
                    style={{ opacity: titleOpacity, transform: `scale(${titleScale})` }}
                    className="text-center"
                >
                    <h2 className="text-4xl font-black text-gray-800">
                        <span className="text-emerald-600">PROBLEM</span> SOLVED!
                    </h2>
                </div>
            </div>

            {/* Divide by 2 Visual */}
            <div
                style={{ opacity: divideOpacity, transform: `scale(${divideScale})` }}
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-violet-100 border border-violet-300 mb-8"
            >
                <Divide size={24} className="text-violet-600" />
                <span className="text-2xl font-black text-violet-600">DIVIDE BY 2</span>
                <Sparkles size={24} className="text-violet-600" />
            </div>

            {/* Summary Bullets */}
            <div className="flex flex-col gap-2 w-full max-w-xs mb-8">
                {bullets.map((bullet, idx) => (
                    <div
                        key={idx}
                        style={{ opacity: bullet.opacity }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200"
                    >
                        <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-700">{bullet.text}</span>
                    </div>
                ))}
            </div>

            {/* Final Celebration */}
            <div
                style={{ opacity: celebOpacity, transform: `scale(${celebScale})` }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 shadow-lg"
            >
                <span className="text-xl font-black text-white uppercase tracking-wider">Binary Search Mastered!</span>
            </div>

        </div>
    );
};

export default Frame15;
