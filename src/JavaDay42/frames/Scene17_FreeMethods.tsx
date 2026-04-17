/**
 * Scene 17 — Free Methods
 * "These come for free."
 * CSV: 75.980s → 78.480s
 * Duration: 75 frames (2.5s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):   Label + headline
 *   Phase 2 (frames 12–50):  Three method badges spring in + "FREE" gift tag
 *   Phase 3 (frames 40–end): Gift-tag float, micro shimmer
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
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene17_FreeMethods: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt  = useSpringEntrance(frame, 4);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const methods = [
    { name: 'toString()', desc: 'readable text' },
    { name: 'equals()',   desc: 'value compare' },
    { name: 'hashCode()', desc: 'numeric ID' },
  ];
  const cardEnts = methods.map((_, i) => useSpringEntrance(frame, 12 + i * 8));

  // "FREE" tag
  const tagEnt = useSpringEntrance(frame, 32);
  const tagScale = spring({ frame: Math.max(0, frame - 34), fps, config: SPRING_SNAP });

  // Gift box
  const giftEnt = useSpringEntrance(frame, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="INHERITANCE · GIFT" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={320} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            For Free
          </text>
          <text x={540} y={410} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Inherited from Object
          </text>
        </g>

        {/* ── Gift box illustration ────────────────────────────────────── */}
        <g opacity={giftEnt.opacity} transform={`translate(540, ${580 + breathe})`}>
          {/* Box body */}
          <rect x={-80} y={-30} width={160} height={100} rx={12}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Ribbon V */}
          <line x1={0} y1={-30} x2={0} y2={70} stroke={COLORS.accent} strokeWidth={3} />
          {/* Ribbon H */}
          <line x1={-80} y1={20} x2={80} y2={20} stroke={COLORS.accent} strokeWidth={3} />
          {/* Lid */}
          <rect x={-90} y={-50} width={180} height={30} rx={8}
            fill={COLORS.accent} fillOpacity={0.2} stroke={COLORS.accent} strokeWidth={2} />
          {/* Bow */}
          <ellipse cx={-20} cy={-58} rx={20} ry={12}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <ellipse cx={20} cy={-58} rx={20} ry={12}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
        </g>

        {/* ── Three method cards ──────────────────────────────────────── */}
        {methods.map((m, i) => {
          const cardY = 740 + i * 180;
          return (
            <g key={i} opacity={cardEnts[i].opacity}
              transform={`translate(0, ${cardEnts[i].translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={150} accent={i === 0} />
              <rect x={60} y={cardY} width={6} height={150} rx={3} fill={COLORS.accent} />
              <text x={120} y={cardY + 65} fontFamily={MONO} fontSize={36} fontWeight={800}
                fill={COLORS.accent}>{m.name}</text>
              <text x={120} y={cardY + 115} fontFamily={FONT} fontSize={30} fontWeight={800}
                fill={COLORS.text_muted}>{m.desc}</text>
              {/* "inherited" badge */}
              <rect x={780} y={cardY + 40} width={200} height={36} rx={18}
                fill={COLORS.accent} fillOpacity={0.1} />
              <text x={880} y={cardY + 65} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
                INHERITED
              </text>
            </g>
          );
        })}

        {/* ── FREE tag ────────────────────────────────────────────────── */}
        <g opacity={tagEnt.opacity}
          transform={`translate(540, 1380) scale(${tagScale})`}
          style={{ transformOrigin: '0px 0px' }}>
          <rect x={-120} y={-35} width={240} height={70} rx={35}
            fill={COLORS.accent} fillOpacity={0.18}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={0} y={12} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>
            FREE
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={120} cy={1550 + breathe * 0.7} r={3} fill={COLORS.accent} fillOpacity={0.14 * shimmer} />
        <circle cx={960} cy={1600 - breathe} r={2} fill={COLORS.accent} fillOpacity={0.1} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
