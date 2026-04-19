/**
 * Scene 25 — The Audit Trail of Intelligence
 * "It's the audit trail of intelligence."
 * CSV: 62.800s → 65.700s
 * Duration: 87 frames (2.9s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline
 *   Phase 2 (12–50): Audit trail visual, stamp
 *   Phase 3 (40–end): Pulse
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

function usePathDraw(frame: number, start: number, len: number, dur = 20) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene25_AuditTrail: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const words = ["It's", "the", "audit", "trail", "of", "intelligence."];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - i * 4);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const stampScale = spring({ frame: Math.max(0, frame - 30), fps, config: SPRING_SNAP });
  const stampOp = interpolate(frame, [30, 36], [0, 1], { extrapolateRight: 'clamp' });

  const trailCards = [0, 1, 2, 3, 4, 5].map(i => useSpringEntrance(frame, 15 + i * 5));
  const summaryE = useSpringEntrance(frame, 50);

  const connLen = 60;
  const connDashes = [0, 1, 2, 3, 4].map(i => usePathDraw(frame, 18 + i * 5, connLen, 10));

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s25.from);

  const entries = [
    { time: '00:00', label: 'Goal received', icon: 'G' },
    { time: '00:01', label: 'Search tool called', icon: 'A' },
    { time: '00:02', label: 'Results returned', icon: 'O' },
    { time: '00:03', label: 'Document read', icon: 'A' },
    { time: '00:04', label: 'Text extracted', icon: 'O' },
    { time: '00:05', label: 'Summary produced', icon: 'A' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="TRAJECTORY · METAPHOR" y={160} opacity={0.8} />
        </g>

        {/* Per-word headline */}
        {words.map((w, i) => {
          const isKey = w === 'audit' || w === 'trail' || w === 'intelligence.';
          return (
            <text key={i}
              x={60 + i * (i < 3 ? 130 : i < 5 ? 100 : 0) + (i >= 3 ? 390 : 0) + (i >= 5 ? 110 : 0)}
              y={i < 3 ? 320 : 420}
              opacity={wordSprings[i].op}
              transform={`translate(0, ${wordSprings[i].ty})`}
              fontFamily={FONT} fontSize={i < 3 ? 80 : 80} fontWeight={800}
              fill={isKey ? COLORS.accent : COLORS.white}
              fontStyle={isKey ? 'italic' : 'normal'}
            >
              {w}
            </text>
          );
        })}

        {/* Simpler headline layout */}
        <g opacity={0}>
          <text x={60} y={320} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            placeholder
          </text>
        </g>

        {/* Audit trail vertical log */}
        {entries.map((e, i) => {
          const ey = 520 + i * 140;
          const ec = trailCards[i];
          return (
            <g key={i} opacity={ec.opacity} transform={`translate(0, ${ec.translateY})`}>
              {/* Timeline dot */}
              <circle cx={120} cy={ey + 50} r={16}
                fill={COLORS.bg_secondary} stroke={COLORS.accent}
                strokeWidth={2} />
              <text x={120} y={ey + 56} textAnchor="middle"
                fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.accent}>
                {e.icon}
              </text>
              {/* Timestamp */}
              <text x={160} y={ey + 38}
                fontFamily="'Fira Code', 'Courier New', monospace"
                fontSize={22} fontWeight={500} fill={COLORS.text_muted}>
                {e.time}
              </text>
              {/* Label card */}
              <BentoCard x={160} y={ey + 48} w={820} h={60} />
              <text x={200} y={ey + 88}
                fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
                {e.label}
              </text>
              {/* Connector line to next */}
              {i < 5 && (
                <line x1={120} y1={ey + 66} x2={120} y2={ey + 140 + 34}
                  stroke={COLORS.accent} strokeWidth={2}
                  strokeDasharray={connLen} strokeDashoffset={connDashes[i]}
                  strokeLinecap="round" />
              )}
            </g>
          );
        })}

        {/* VERIFIED stamp */}
        <g opacity={stampOp}
          transform={`translate(800, 700) rotate(-12) scale(${stampScale})`}
          style={{ transformOrigin: '0px 0px' }}>
          <rect x={-80} y={-30} width={160} height={60} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={4} />
          <text x={0} y={10} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            VERIFIED
          </text>
        </g>

        {/* Summary */}
        <g opacity={summaryE.opacity} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={120} accent />
          <text x={540} y={1474} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Every step <tspan fill={COLORS.accent}>recorded</tspan>, every decision{' '}
            <tspan fill={COLORS.accent}>traceable</tspan>
          </text>
        </g>

        {/* Floating orbs */}
        {[200, 540, 880].map((x, i) => (
          <circle key={i} cx={x} cy={1620 + breathe} r={6}
            fill={COLORS.accent} opacity={0.08}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${x}px 1620px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s25.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
