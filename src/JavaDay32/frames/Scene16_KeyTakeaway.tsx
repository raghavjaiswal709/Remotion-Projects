/**
 * Scene16_KeyTakeaway — Method Overriding Key Takeaway
 * Duration: 120 frames (4s)
 * Typographic summary of Day 32's core concept
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Headline spring in, corner accents
 *   Phase 2 (frames 20–80):  Key concept cards stagger in with border draw
 *   Phase 3 (frames 80–end): Pulse on core definition, breathing elements
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, CornerAccents, Divider } from '../helpers/components';

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

const TAKEAWAYS = [
  { label: 'What', text: 'Child class redefines inherited method', color: COLORS.orange },
  { label: 'How', text: 'Same name, same params, different body', color: COLORS.sky_blue },
  { label: 'When', text: 'Runtime — JVM picks the actual object type', color: COLORS.green },
  { label: 'Why', text: 'Polymorphism — one interface, many forms', color: COLORS.purple },
];

export const Scene16_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Reveal ────────────────────────────────────────────────────────
  const cornerEnter = interpolate(frame, [0, 20], [0, 0.4], { extrapolateRight: 'clamp' });
  const headlineSp = spring({ frame, fps, config: SPRING_SNAP });
  const headlineOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const headlineTy = interpolate(headlineSp, [0, 1], [28, 0]);
  const subline = useSpringEntrance(frame, 8);
  const dividerDraw = usePathDraw(frame, 10, 960, 20);

  // ── Phase 2: Takeaway cards ────────────────────────────────────────────────
  const card0 = useSpringEntrance(frame, 22);
  const card1 = useSpringEntrance(frame, 34);
  const card2 = useSpringEntrance(frame, 46);
  const card3 = useSpringEntrance(frame, 58);
  const cardSprings = [card0, card1, card2, card3];

  const CARD_PERIM = 2 * (920 + 170);
  const border0 = interpolate(frame, [22, 48], [CARD_PERIM, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const border1 = interpolate(frame, [34, 60], [CARD_PERIM, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const border2 = interpolate(frame, [46, 72], [CARD_PERIM, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const border3 = interpolate(frame, [58, 84], [CARD_PERIM, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const borderDashes = [border0, border1, border2, border3];

  // Definition highlight badge
  const defBadge = useSpringEntrance(frame, 72);
  const BADGE_PERIM = 2 * (800 + 100);
  const badgeBorder = interpolate(frame, [72, 98], [BADGE_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={cornerEnter} color={COLORS.orange} />

        {/* ── ZONE A — KEY TAKEAWAY label ────────────────────────────────── */}
        <text x={540} y={120} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500}
          fill={COLORS.cool_silver} letterSpacing="0.18em"
          opacity={headlineOp * 0.55}>
          KEY TAKEAWAY
        </text>

        {/* ── ZONE B — Main headline ─────────────────────────────────────── */}
        <g opacity={headlineOp} transform={`translate(0, ${headlineTy})`}>
          <text x={540} y={250} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={64} fontWeight={900}
            fill={COLORS.deep_black}>
            Method Overriding
          </text>
        </g>
        <g opacity={subline.opacity} transform={`translate(0, ${subline.translateY})`}>
          <text x={540} y={330} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={500}
            fill={COLORS.orange}>
            Inherited methods, redefined behavior
          </text>
        </g>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <line x1={60} y1={380} x2={1020} y2={380}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.15}
          strokeDasharray={960} strokeDashoffset={dividerDraw} />

        {/* ── ZONE C — Takeaway cards ────────────────────────────────────── */}
        {TAKEAWAYS.map((t, i) => {
          const y = 430 + i * 195;
          const float = frame > 80 ? breathe * (i % 2 === 0 ? 1 : -1) * 0.5 : 0;

          return (
            <g key={i} opacity={cardSprings[i].opacity}
              transform={`translate(80, ${y + cardSprings[i].translateY + float})`}>
              {/* Card border draw */}
              <rect x={0} y={0} width={920} height={170} rx={16}
                fill="none" stroke={t.color} strokeWidth={2}
                strokeDasharray={CARD_PERIM} strokeDashoffset={borderDashes[i]} />
              <rect x={0} y={0} width={920} height={170} rx={16}
                fill={t.color} fillOpacity={0.04} />
              <rect x={0} y={0} width={6} height={170} rx={3} fill={t.color} />

              {/* Label badge */}
              <rect x={24} y={20} width={80} height={36} rx={18}
                fill={t.color} fillOpacity={0.15} />
              <text x={64} y={44} textAnchor="middle"
                fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={700}
                fill={t.color} letterSpacing="0.08em">
                {t.label.toUpperCase()}
              </text>

              {/* Content */}
              <text x={24} y={105}
                fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700}
                fill={COLORS.deep_black}>
                {t.text}
              </text>

              {/* Right-side dot indicator */}
              <circle cx={880} cy={85} r={8} fill={t.color} fillOpacity={0.25 * shimmer} />
              <circle cx={880} cy={85} r={4} fill={t.color} />
            </g>
          );
        })}

        {/* ── Definition highlight badge ──────────────────────────────────── */}
        <g opacity={defBadge.opacity} transform={`translate(0, ${defBadge.translateY + breathe * 0.5})`}>
          <rect x={140} y={1250} width={800} height={100} rx={50}
            fill="none" stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={BADGE_PERIM} strokeDashoffset={badgeBorder} />
          <rect x={140} y={1250} width={800} height={100} rx={50}
            fill={COLORS.orange} fillOpacity={0.08} />

          {/* Pulse ring */}
          {frame > 85 && (
            <rect x={136} y={1246} width={808} height={108} rx={54}
              fill="none" stroke={COLORS.orange} strokeWidth={1.5}
              opacity={shimmer * 0.35}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '540px 1300px' }} />
          )}

          <text x={540} y={1312} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={38} fontWeight={900}
            fill={COLORS.orange}>
            Same Contract, Different Execution
          </text>
        </g>

        {/* ── Bottom supporting text ─────────────────────────────────────── */}
        <g opacity={defBadge.opacity * 0.7}>
          <text x={540} y={1420} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}>
            The child decides how it responds.
          </text>
          <text x={540} y={1460} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}>
            The parent provides the interface.
          </text>
        </g>

        {/* ── Decorative dots at bottom ──────────────────────────────────── */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={510 + i * 30} cy={1530} r={4}
            fill={COLORS.orange} opacity={0.3 + shimmer * 0.2} />
        ))}

        {/* ── Bottom accent line ─────────────────────────────────────────── */}
        <line x1={440} y1={1580} x2={640} y2={1580}
          stroke={COLORS.orange} strokeWidth={2} opacity={0.2} strokeLinecap="round" />

      </svg>
    </AbsoluteFill>
  );
};
