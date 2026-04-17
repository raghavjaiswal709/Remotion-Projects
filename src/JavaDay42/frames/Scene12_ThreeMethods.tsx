/**
 * Scene 12 — Three Methods
 * "every object inherits three methods used constantly."
 * CSV: 45.540s → 51.540s
 * Duration: 180 frames (6.0s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline
 *   Phase 2 (frames 14–80):  3 method cards with path-draw borders, staggered
 *   Phase 3 (frames 70–end): Pulse, counter "3", micro floaters
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

const METHODS = [
  { name: 'toString()', desc: 'Converts to readable string', icon: 'T' },
  { name: 'equals()', desc: 'Compares two objects', icon: '=' },
  { name: 'hashCode()', desc: 'Numeric code for hashing', icon: '#' },
];

export const Scene12_ThreeMethods: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 10);

  // ── Hero counter ───────────────────────────────────────────────────────────
  const counterEnt = useSpringEntrance(frame, 8);
  const counterVal = useCounter(frame, 10, 3, 30);

  // ── Phase 2 — method cards ─────────────────────────────────────────────────
  const cardEnts = METHODS.map((_, i) => useSpringEntrance(frame, 20 + i * 14));
  const PERIM = 2 * (960 + 260);
  const borderDashes = METHODS.map((_, i) => usePathDraw(frame, 24 + i * 14, PERIM, 25));

  // ── Bottom card ────────────────────────────────────────────────────────────
  const bottomEnt = useSpringEntrance(frame, 70);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OBJECT · INHERITED METHODS" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero counter + headline ────────────────────────── */}
        <g opacity={counterEnt.opacity} transform={`translate(0, ${counterEnt.translateY})`}>
          <text x={540} y={360} textAnchor="middle"
            fontFamily={FONT} fontSize={240} fontWeight={800}
            fill={COLORS.accent} opacity={0.08}>
            {counterVal}
          </text>
          <text x={540} y={350} textAnchor="middle"
            fontFamily={FONT} fontSize={180} fontWeight={800}
            fill={COLORS.accent}>
            {counterVal}
          </text>
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={540} y={450} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.white}>
            Inherited Methods
          </text>
        </g>

        {/* ── 3 Method Cards ──────────────────────────────────────────── */}
        {METHODS.map((m, i) => {
          const cardY = 540 + i * 280;
          return (
            <g key={m.name} opacity={cardEnts[i].opacity}
              transform={`translate(0, ${cardEnts[i].translateY})`}>
              {/* Fill */}
              <BentoCard x={60} y={cardY} w={960} h={240} accent={i === 0} />

              {/* Animated border draw */}
              <rect x={60} y={cardY} width={960} height={240} rx={20}
                fill="none" stroke={COLORS.accent} strokeWidth={2}
                strokeDasharray={PERIM} strokeDashoffset={borderDashes[i]}
                opacity={0.4} />

              {/* Icon circle */}
              <circle cx={140} cy={cardY + 80} r={36} fill={COLORS.accent} fillOpacity={0.12}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={140} y={cardY + 92} textAnchor="middle"
                fontFamily={MONO} fontSize={32} fontWeight={800} fill={COLORS.accent}>
                {m.icon}
              </text>

              {/* Method name */}
              <text x={200} y={cardY + 75} fontFamily={MONO} fontSize={36} fontWeight={800}
                fill={COLORS.accent}>
                {m.name}
              </text>

              {/* Description */}
              <text x={200} y={cardY + 125} fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.white}>
                {m.desc}
              </text>

              {/* Inherited from badge */}
              <rect x={200} y={cardY + 155} width={260} height={40} rx={10}
                fill={COLORS.accent} fillOpacity={0.1} />
              <text x={210} y={cardY + 183} fontFamily={FONT} fontSize={22} fontWeight={800}
                fill={COLORS.accent} fontStyle="italic">
                from java.lang.Object
              </text>

              {/* Accent left bar */}
              <rect x={60} y={cardY} width={6} height={240} rx={3} fill={COLORS.accent} />
            </g>
          );
        })}

        {/* ── Bottom summary card ─────────────────────────────────────── */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={140} />
          <text x={100} y={1480} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Every class gets these 3 methods{' '}
            <tspan fill={COLORS.accent}>for free</tspan>
          </text>
          <text x={100} y={1520} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            But their defaults are rarely useful — override them
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={50} cy={1620 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.2 * shimmer} />
        <circle cx={1030} cy={1580 - breathe * 0.5} r={2.5} fill={COLORS.accent} fillOpacity={0.15} />

        {/* ── Pulse ring ──────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1680 + breathe * 0.3})`} opacity={0.06}>
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
