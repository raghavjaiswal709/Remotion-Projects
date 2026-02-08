import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Search, Zap, Clock } from 'lucide-react';

/**
 * Frame 1: Title Introduction
 * Duration: 0.00s - 4.58s (137 frames @ 30fps)
 * Narration: "Here's how binary search works and why it's so powerful—explained in 60 seconds."
 */

const Frame1 = () => {
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
    const titleSpring = createSpring(5, { stiffness: 80, damping: 12 });
    const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
    const titleOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

    // Subtitle animation
    const subtitleSpring = createSpring(20, { stiffness: 60, damping: 12 });
    const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);
    const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });

    // Badge animations
    const badge1Spring = createSpring(45, { stiffness: 100, damping: 10 });
    const badge2Spring = createSpring(55, { stiffness: 100, damping: 10 });
    const badge3Spring = createSpring(65, { stiffness: 100, damping: 10 });

    // Central glow pulse
    const glowPulse = frame > 30 ? interpolate(Math.sin((frame - 30) / 12 * Math.PI), [-1, 1], [0.3, 0.6]) : 0;

    const badges = [
        { icon: Search, text: 'Interview', color: 'bg-blue-500', spring: badge1Spring },
        { icon: Zap, text: 'Efficient', color: 'bg-amber-500', spring: badge2Spring },
        { icon: Clock, text: 'Algorithm', color: 'bg-emerald-500', spring: badge3Spring },
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans overflow-hidden relative" style={{ transform: 'scale(2)', transformOrigin: 'center center' }}>

            {/* Subtle grid background */}
            <div
                style={{ opacity: 0.06 }}
                className="absolute inset-0 pointer-events-none"
            >
                <div
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                    }}
                    className="absolute inset-0"
                />
            </div>

            {/* Central glow */}
            <div
                style={{ opacity: glowPulse }}
                className="absolute w-[300px] h-[300px] rounded-full bg-blue-400 blur-[80px] pointer-events-none"
            />

            {/* Title */}
            <div
                style={{
                    opacity: titleOpacity,
                    transform: `translateY(${titleY}px)`,
                }}
                className="flex flex-col items-center gap-3 mb-8"
            >
                <h1 className="text-5xl font-black tracking-tight text-center">
                    <span className="text-blue-600">BINARY</span>
                </h1>
                <h1 className="text-5xl font-black tracking-tight text-center text-gray-800">
                    SEARCH
                </h1>
            </div>

            {/* Subtitle */}
            <div
                style={{
                    opacity: subtitleOpacity,
                    transform: `translateY(${subtitleY}px)`,
                }}
                className="flex items-center gap-2 mb-10"
            >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                    <Clock size={18} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-600">60 SECONDS</span>
            </div>

            {/* Feature badges */}
            <div className="flex gap-3">
                {badges.map((badge, idx) => {
                    const IconComponent = badge.icon;
                    const scale = interpolate(badge.spring, [0, 1], [0, 1]);

                    return (
                        <div
                            key={idx}
                            style={{ transform: `scale(${scale})` }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${badge.color} text-white shadow-lg`}
                        >
                            <IconComponent size={16} />
                            <span className="text-sm font-bold uppercase tracking-wider">{badge.text}</span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Frame1;
