/**
 * Scene07 — Tower of Rockets
 * "a tower of solid rockets pulls the Orion capsule away from the SLS booster at 700 km/h in under three seconds."
 * CSV: 29.620s → 38.980s
 * Duration: 299 frames (9.97s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline with per-word spring
 *   Phase 2 (20–120): Content — rocket separation diagram, speed counter, timer
 *   Phase 3 (100–end): Micro — exhaust flicker, capsule float, speed pulse
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
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene07_TowerOfRockets: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineWords = ['700 km/h', 'in Under', '3 Seconds'];
  const wordSprings = headlineWords.map((_, i) => {
    const f = Math.max(0, frame - i * 8);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  // ── Phase 2 ──
  const rocketGroup = useSpringEntrance(frame, 18);
  const capsuleGroup = useSpringEntrance(frame, 28);
  const speedCard = useSpringEntrance(frame, 40);
  const timeCard = useSpringEntrance(frame, 52);
  const factCard1 = useSpringEntrance(frame, 64);
  const factCard2 = useSpringEntrance(frame, 76);

  // Counters
  const speedValue = useCounter(frame, 40, 700, 50);
  const timeValue = interpolate(frame, [52, 97], [0, 3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Path draws
  const separationLine = 300;
  const sepDash = usePathDraw(frame, 30, separationLine, 30);
  const exhaustPath = 200;
  const exhaustDash = usePathDraw(frame, 35, exhaustPath, 20);

  // Separation animation — capsule moves up over time
  const capsuleLift = interpolate(frame, [30, 90], [0, -140], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.05) * 3;
  const flameFlicker = interpolate(Math.sin(frame * 0.35), [-1, 1], [0.65, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.orange} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={280} fontWeight={900} fill={COLORS.orange} opacity={0.04}>
          SRB
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="LAUNCH ESCAPE · SOLID ROCKETS" y={260} opacity={0.55} />
        </g>

        {/* Zone B — headline per-word */}
        {headlineWords.map((word, i) => (
          <text key={i} x={60} y={360 + i * 75}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={i === 0 ? 80 : 64} fontWeight={i === 0 ? 900 : 700}
            fill={i === 0 ? COLORS.orange : COLORS.deep_black}>
            {word}
          </text>
        ))}

        {/* Zone C — Rocket separation diagram */}
        {/* SLS Booster (stationary) */}
        <g opacity={rocketGroup.opacity}
          transform={`translate(300, ${800 + rocketGroup.translateY})`}>
          {/* Main body */}
          <rect x={-35} y={0} width={70} height={260} rx={6}
            fill={COLORS.deep_black} fillOpacity={0.05}
            stroke={COLORS.cool_silver} strokeWidth={2} />
          {/* Side boosters */}
          <rect x={-55} y={40} width={16} height={180} rx={3}
            fill={COLORS.cool_silver} fillOpacity={0.1}
            stroke={COLORS.cool_silver} strokeWidth={1} />
          <rect x={39} y={40} width={16} height={180} rx={3}
            fill={COLORS.cool_silver} fillOpacity={0.1}
            stroke={COLORS.cool_silver} strokeWidth={1} />
          {/* Nozzle */}
          <path d="M -25,260 L -35,290 L 35,290 L 25,260"
            fill={COLORS.cool_silver} fillOpacity={0.1}
            stroke={COLORS.cool_silver} strokeWidth={1} />
          {/* Label */}
          <text x={0} y={140} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600} fill={COLORS.cool_silver}>
            SLS
          </text>
        </g>

        {/* Orion capsule (moving up) */}
        <g opacity={capsuleGroup.opacity}
          transform={`translate(300, ${730 + capsuleGroup.translateY + capsuleLift + breathe})`}>
          {/* LAS Tower */}
          <line x1={0} y1={-10} x2={0} y2={-100}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          {/* LAS nozzle */}
          <path d="M -12,-100 L 0,-115 L 12,-100"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Capsule */}
          <path d="M -30,-10 L -40,40 L 40,40 L 30,-10 Z"
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={2.5} />
          {/* Heat shield */}
          <rect x={-40} y={38} width={80} height={6} rx={3}
            fill={COLORS.sky_blue} fillOpacity={0.3} />
          {/* LAS fire plume */}
          <g opacity={flameFlicker * 0.7}>
            <path d="M -8,-115 Q -12,-145 0,-160 Q 12,-145 8,-115"
              fill={COLORS.vibrant_red} fillOpacity={0.25} />
            <path d="M -4,-115 Q -6,-135 0,-145 Q 6,-135 4,-115"
              fill={COLORS.orange} fillOpacity={0.35} />
          </g>
          {/* Label */}
          <text x={65} y={20} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.sky_blue}>
            ORION
          </text>
        </g>

        {/* Separation line (dashed) */}
        <line x1={200} y1={795} x2={400} y2={795}
          stroke={COLORS.vibrant_red} strokeWidth={1.5}
          strokeDasharray="8,6" opacity={rocketGroup.opacity * 0.5} />
        <text x={300} y={785} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={20} fontWeight={600} fill={COLORS.vibrant_red}
          opacity={rocketGroup.opacity * 0.6}>
          SEPARATION
        </text>

        {/* Separation arrow going up */}
        <path d={`M 300,780 L 300,${780 - 120}`}
          fill="none" stroke={COLORS.green} strokeWidth={2.5}
          strokeDasharray={separationLine} strokeDashoffset={sepDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Exhaust trail behind capsule */}
        <path d={`M 300,${770 + capsuleLift} Q 310,${800 + capsuleLift} 300,${850}`}
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
          strokeDasharray={exhaustPath} strokeDashoffset={exhaustDash}
          opacity={0.3} strokeLinecap="round" />

        {/* Speed stat card */}
        <g opacity={speedCard.opacity}
          transform={`translate(560, ${640 + speedCard.translateY})`}>
          <rect x={0} y={0} width={440} height={160} rx={16}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2} />
          <text x={220} y={75} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900} fill={COLORS.orange}>
            {speedValue}
          </text>
          <text x={220} y={120} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={500} fill={COLORS.cool_silver}>
            KM/H
          </text>
        </g>

        {/* Time stat card */}
        <g opacity={timeCard.opacity}
          transform={`translate(560, ${840 + timeCard.translateY})`}>
          <rect x={0} y={0} width={440} height={160} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <text x={220} y={75} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900} fill={COLORS.sky_blue}
            style={{ transform: `scale(${pulse})`, transformOrigin: '780px 915px' }}>
            {'<'}{timeValue.toFixed(0)}
          </text>
          <text x={220} y={120} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={500} fill={COLORS.cool_silver}>
            SECONDS
          </text>
        </g>

        {/* Fact cards */}
        <g opacity={factCard1.opacity}
          transform={`translate(60, ${1160 + factCard1.translateY})`}>
          <rect x={0} y={0} width={460} height={90} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.05}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.vibrant_red} />
          <text x={30} y={36} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            Solid Rocket Tower
          </text>
          <text x={30} y={66} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            Fixed thrust, zero throttle control
          </text>
        </g>

        <g opacity={factCard2.opacity}
          transform={`translate(560, ${1160 + factCard2.translateY})`}>
          <rect x={0} y={0} width={460} height={90} rx={12}
            fill={COLORS.green} fillOpacity={0.05}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.green} />
          <text x={30} y={36} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            Pulls Away From Booster
          </text>
          <text x={30} y={66} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            Capsule escapes in under 3s
          </text>
        </g>

        {/* Decorative exhaust particles */}
        {Array.from({ length: 8 }, (_, i) => {
          const px = 300 + Math.sin(i * 1.2 + frame * 0.1) * (30 + i * 5);
          const py = 1080 + i * 10;
          return (
            <circle key={i} cx={px} cy={py} r={2 + i * 0.3}
              fill={COLORS.cool_silver} opacity={0.06 * shimmer} />
          );
        })}

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">3 ROCKETS · 400,000 LBS THRUST · 2 SEC</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
