/**
 * Scene 22 — OneThing
 * "Now, there is one thing this loop still needs. A purpose."
 * CSV: 62.620s → 65.480s
 * Duration: 86 frames (2.87s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline
 *   Phase 2 (14–60): loop diagram with empty center → purpose stamp
 *   Phase 3 (50–end): micro
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene22_OneThing: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);

  // Per-word headline: "One Thing Missing"
  const words = ['One', 'Thing', 'Missing'];
  const wordEnts = words.map((_, i) => {
    const f2 = Math.max(0, frame - 4 - i * 6);
    const sp = spring({ frame: f2, fps, config: SPRING_SNAP });
    return {
      ty: interpolate(sp, [0, 1], [24, 0]),
      op: interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
    };
  });

  const subEnt = useSpringEntrance(frame, 14);

  // Loop ring
  const CX = 540, CY = 860, R = 200;
  const circ = 2 * Math.PI * R;
  const ringDash = usePathDraw(frame, 16, circ, 30);

  // 4 nodes on ring
  const nodeLabels = ['ACT', 'OBSERVE', 'DECIDE', 'EXECUTE'];
  const nodeEnts = nodeLabels.map((_, i) => useSpringEntrance(frame, 22 + i * 5));

  // Question mark in center (appears then gets replaced)
  const questionOp = interpolate(frame, [30, 38, 48, 56], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // PURPOSE stamp
  const purposeDelay = 52;
  const purposeF = Math.max(0, frame - purposeDelay);
  const purposeSp = spring({ frame: purposeF, fps, config: SPRING_SNAP });
  const purposeScale = interpolate(purposeSp, [0, 1], [2.5, 1]);
  const purposeOp = interpolate(purposeSp, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Cards
  const card1 = useSpringEntrance(frame, 56);
  const card2 = useSpringEntrance(frame, 62);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Dashed ring for "missing" feel
  const dashedRingOp = interpolate(frame, [16, 30], [0, 0.3], { extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        {words.map((w, i) => (
          <text key={i} x={60} y={290 + i * 90} opacity={wordEnts[i].op}
            transform={`translate(0, ${wordEnts[i].ty})`}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={i === 2 ? COLORS.vibrant_red : COLORS.white}>{w}</text>
        ))}

        <g opacity={subEnt.opacity} transform={`translate(0, ${subEnt.translateY})`}>
          <text x={60} y={560} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>The loop needs a purpose</text>
        </g>

        {/* Outer ring */}
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={circ} strokeDashoffset={ringDash} />

        {/* Dashed inner ring (missing / incomplete feel) */}
        <circle cx={CX} cy={CY} r={R - 40}
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={1}
          strokeDasharray="12 8" opacity={dashedRingOp} />

        {/* Nodes */}
        {nodeLabels.map((lbl, i) => {
          const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
          const nx = CX + Math.cos(angle) * R;
          const ny = CY + Math.sin(angle) * R;
          const ent = nodeEnts[i];
          return (
            <g key={i} opacity={ent.opacity}>
              <circle cx={nx} cy={ny} r={32}
                fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
              <text x={nx} y={ny + 6} textAnchor="middle"
                fontFamily={FONT} fontSize={14} fontWeight={800} fill={COLORS.accent}>{lbl}</text>
              {/* Outer glow */}
              <circle cx={nx} cy={ny} r={40} fill={COLORS.accent} opacity={0.04 * shimmer} />
            </g>
          );
        })}

        {/* Question mark center */}
        <text x={CX} y={CY + 28} textAnchor="middle"
          fontFamily={FONT} fontSize={120} fontWeight={800}
          fill={COLORS.vibrant_red} opacity={questionOp}>?</text>

        {/* PURPOSE stamp */}
        <g opacity={purposeOp} transform={`translate(${CX}, ${CY}) scale(${purposeScale})`}>
          <text x={0} y={16} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">PURPOSE</text>
        </g>

        {/* Ring pulse */}
        <circle cx={CX} cy={CY} r={R + 20}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={purposeOp * 0.1 * pulse}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: `${CX}px ${CY}px` }} />

        {/* Cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={140} />
          <rect x={60} y={1160} width={6} height={140} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={1216} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>WITHOUT PURPOSE</text>
          <text x={100} y={1258} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>The loop runs aimlessly</text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1160} w={460} h={140} accent />
          <rect x={560} y={1160} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={600} y={1216} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>WITH PURPOSE</text>
          <text x={600} y={1258} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.white}>It knows when to stop</text>
        </g>

        {/* Bottom */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={100} />
          <text x={540} y={1403} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Every agent needs a <tspan fill={COLORS.accent} fontStyle="italic">goal</tspan>
          </text>
        </g>

        {/* Floating */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + frame * 0.01;
          const pr = R + 80 + Math.sin(frame * 0.02 + i) * 15;
          return (
            <circle key={i} cx={CX + Math.cos(a) * pr} cy={CY + Math.sin(a) * pr}
              r={2} fill={COLORS.accent} opacity={0.05 * shimmer} />
          );
        })}

        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} opacity={0.03} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.08} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
