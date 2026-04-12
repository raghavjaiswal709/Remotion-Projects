/**
 * Scene 12 — WristwatchComputers
 * "Apollo 8 ran on computers less powerful than a wristwatch."
 * CSV: 56.540s → 60.180s
 * Duration: 127 frames (4.23s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–70): AGC vs smartwatch comparison, memory counter
 *   Phase 3 (60–end): Watch pulse, number shimmer
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene12_WristwatchComputers: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const agcBox = useSpringEntrance(frame, 18);
  const watchBox = useSpringEntrance(frame, 30);
  const vsLabel = useSpringEntrance(frame, 24);
  const memoryBar1 = useSpringEntrance(frame, 36);
  const memoryBar2 = useSpringEntrance(frame, 42);
  const factCard = useSpringEntrance(frame, 50);
  const bottomCard = useSpringEntrance(frame, 62);

  // Counters
  const agcKB = useCounter(frame, 36, 2, 30);
  const watchMB = useCounter(frame, 42, 512, 35);

  // AGC box perimeter draw
  const agcPerimeter = 2 * (380 + 320);
  const agcDash = usePathDraw(frame, 18, agcPerimeter, 30);
  const watchPerimeter = 2 * (380 + 320);
  const watchDash = usePathDraw(frame, 30, watchPerimeter, 30);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Ghost background multiplier */}
        <text x={820} y={520} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={320} fontWeight={900} fill={COLORS.sky_blue} opacity={0.025}>
          256K
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="COMPUTING POWER · COMPARISON" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', sans-serif" fontSize={64} fontWeight={800} fill={COLORS.deep_black}>
            Less Powerful Than
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={450} fontFamily="'Inter', sans-serif" fontSize={64} fontWeight={800} fill={COLORS.sky_blue}>
            A Wristwatch
          </text>
        </g>

        {/* Zone C — AGC Box (left/top) */}
        <g opacity={agcBox.opacity} transform={`translate(60, ${560 + agcBox.translateY})`}>
          <rect x={0} y={0} width={960} height={280} rx={16}
            fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
            strokeDasharray={agcPerimeter} strokeDashoffset={agcDash}
          />
          <rect x={0} y={0} width={960} height={280} rx={16} fill={COLORS.cool_silver} fillOpacity={0.03} />
          {/* AGC computer illustration */}
          <rect x={40} y={40} width={120} height={200} rx={4} fill="none" stroke={COLORS.cool_silver} strokeWidth={1.5} />
          {/* Control panel dots */}
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={70 + (i % 4) * 24} cy={80 + Math.floor(i / 4) * 24} r={4}
              fill={COLORS.cool_silver} fillOpacity={0.2} />
          ))}
          {/* Keyboard area */}
          <rect x={50} y={180} width={100} height={40} rx={2} fill={COLORS.cool_silver} fillOpacity={0.06} />

          <text x={200} y={100} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800} fill={COLORS.cool_silver}>
            Apollo Guidance Computer
          </text>
          <text x={200} y={145} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={0.7}>
            1968 — RAM: {agcKB} KB
          </text>
          <text x={200} y={185} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={0.7}>
            Speed: 0.043 MHz
          </text>
          <text x={200} y={225} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={0.7}>
            Weight: 32 kg
          </text>
        </g>

        {/* VS label */}
        <g opacity={vsLabel.opacity}>
          <text x={540} y={880} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={900} fill={COLORS.vibrant_red} opacity={0.3}>
            VS
          </text>
        </g>

        {/* Watch Box (right/bottom) */}
        <g opacity={watchBox.opacity} transform={`translate(60, ${920 + watchBox.translateY})`}>
          <rect x={0} y={0} width={960} height={280} rx={16}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2}
            strokeDasharray={watchPerimeter} strokeDashoffset={watchDash}
          />
          <rect x={0} y={0} width={960} height={280} rx={16} fill={COLORS.sky_blue} fillOpacity={0.03} />
          {/* Watch illustration */}
          <circle cx={100} cy={140} r={55} fill="none" stroke={COLORS.sky_blue} strokeWidth={2} />
          <circle cx={100} cy={140} r={48} fill={COLORS.sky_blue} fillOpacity={0.05} />
          {/* Watch band */}
          <rect x={80} y={60} width={40} height={20} rx={4} fill={COLORS.sky_blue} fillOpacity={0.1} />
          <rect x={80} y={200} width={40} height={20} rx={4} fill={COLORS.sky_blue} fillOpacity={0.1} />
          {/* Watch face ticks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 - 90) * Math.PI / 180;
            return (
              <line key={i}
                x1={100 + Math.cos(angle) * 38} y1={140 + Math.sin(angle) * 38}
                x2={100 + Math.cos(angle) * 44} y2={140 + Math.sin(angle) * 44}
                stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.4}
              />
            );
          })}
          {/* Watch hands */}
          <line x1={100} y1={140} x2={100} y2={105} stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          <line x1={100} y1={140} x2={125} y2={140} stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.4} />

          <text x={200} y={100} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800} fill={COLORS.sky_blue}>
            Modern Smartwatch
          </text>
          <text x={200} y={145} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.7}>
            2025 — RAM: {watchMB} MB
          </text>
          <text x={200} y={185} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.7}>
            Speed: 1,800 MHz
          </text>
          <text x={200} y={225} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.7}>
            Weight: 0.04 kg
          </text>
        </g>

        {/* Memory comparison bars */}
        <g opacity={memoryBar1.opacity} transform={`translate(60, ${1260 + memoryBar1.translateY})`}>
          <text x={0} y={0} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.cool_silver}>
            AGC Memory
          </text>
          <rect x={0} y={12} width={960} height={10} rx={5} fill={COLORS.deep_black} opacity={0.04} />
          <rect x={0} y={12} width={4} height={10} rx={5} fill={COLORS.cool_silver} opacity={0.5} />
        </g>

        <g opacity={memoryBar2.opacity} transform={`translate(60, ${1320 + memoryBar2.translateY})`}>
          <text x={0} y={0} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            Smartwatch Memory
          </text>
          <rect x={0} y={12} width={960} height={10} rx={5} fill={COLORS.deep_black} opacity={0.04} />
          <rect x={0} y={12} width={interpolate(watchMB, [0, 512], [0, 960], { extrapolateRight: 'clamp' })} height={10} rx={5} fill={COLORS.sky_blue} opacity={0.6} />
        </g>

        {/* Scale factor */}
        <g opacity={factCard.opacity * shimmer} transform={`translate(0, ${factCard.translateY})`}>
          <text x={540} y={1430} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900} fill={COLORS.sky_blue}>
            256,000x
          </text>
          <text x={540} y={1430} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900} fill={COLORS.sky_blue} opacity={0.08}>
            256,000x
          </text>
          <text x={540} y={1480} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.cool_silver}>
            MORE MEMORY IN A WATCH
          </text>
        </g>

        {/* Bottom note */}
        <g opacity={bottomCard.opacity} transform={`translate(60, ${1560 + bottomCard.translateY})`}>
          <rect x={0} y={0} width={960} height={80} rx={12} fill={COLORS.deep_black} fillOpacity={0.02} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />
          <text x={480} y={48} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.deep_black} opacity={0.6}>
            They reached the moon with less computing power than your wrist
          </text>
        </g>

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          2 KB → 512 MB · 256,000× MORE
        </text>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
