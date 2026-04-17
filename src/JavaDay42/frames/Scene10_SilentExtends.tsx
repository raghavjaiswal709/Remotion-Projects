/**
 * Scene 10 — Silent Extends
 * "every single one silently extends Object."
 * CSV: 36.000s → 40.200s
 * Duration: 126 frames (4.2s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring
 *   Phase 2 (frames 14–70):  Inheritance tree: Object at top, 4 children below, arrows draw
 *   Phase 3 (frames 60–end): Pulse on Object node, float, shimmer
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

const CHILDREN = [
  { name: 'Train', x: 100 },
  { name: 'Station', x: 350 },
  { name: 'Ticket', x: 620 },
  { name: 'Passenger', x: 860 },
];

export const Scene10_SilentExtends: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 — tree ─────────────────────────────────────────────────────────
  const rootEnt  = useSpringEntrance(frame, 14);
  const childEnts = CHILDREN.map((_, i) => useSpringEntrance(frame, 24 + i * 10));
  const arrowLen = 160;
  const arrowDashes = CHILDREN.map((_, i) => usePathDraw(frame, 28 + i * 10, arrowLen, 20));

  // ── "extends" labels ───────────────────────────────────────────────────────
  const extendsEnts = CHILDREN.map((_, i) => useSpringEntrance(frame, 36 + i * 10));

  // ── Bottom card ────────────────────────────────────────────────────────────
  const bottomEnt = useSpringEntrance(frame, 56);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const rootCY   = 620;
  const childCY  = 960;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="INHERITANCE · OBJECT CLASS" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Silently Extends
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Object
          </text>
        </g>

        {/* ── ROOT NODE: Object ───────────────────────────────────────── */}
        <g opacity={rootEnt.opacity} transform={`translate(0, ${rootEnt.translateY})`}>
          {/* Glow ring */}
          <circle cx={540} cy={rootCY} r={78} fill="none"
            stroke={COLORS.accent} strokeWidth={2} opacity={0.15}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 620px' }} />

          <rect x={420} y={rootCY - 45} width={240} height={90} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />

          {/* Crown SVG */}
          <polygon
            points="540,548 520,570 530,565 540,575 550,565 560,570"
            fill={COLORS.accent} fillOpacity={0.6} />

          <text x={540} y={rootCY + 8} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            Object
          </text>
        </g>

        {/* ── Arrows from root to children ────────────────────────────── */}
        {CHILDREN.map((child, i) => (
          <path
            key={`arrow-${i}`}
            d={`M 540,${rootCY + 45} L ${child.x + 80},${childCY - 45}`}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDashes[i]}
            strokeLinecap="round" markerEnd="url(#arrow)"
            opacity={0.6}
          />
        ))}

        {/* ── "extends" labels on arrows ──────────────────────────────── */}
        {CHILDREN.map((child, i) => {
          const midX = (540 + child.x + 80) / 2;
          const midY = (rootCY + 45 + childCY - 45) / 2;
          return (
            <text key={`ext-${i}`}
              x={midX} y={midY - 8} textAnchor="middle"
              fontFamily={FONT} fontSize={20} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic"
              opacity={extendsEnts[i].opacity * 0.6}>
              extends
            </text>
          );
        })}

        {/* ── CHILD NODES ─────────────────────────────────────────────── */}
        {CHILDREN.map((child, i) => (
          <g key={child.name} opacity={childEnts[i].opacity}
            transform={`translate(0, ${childEnts[i].translateY})`}>
            <rect x={child.x} y={childCY - 40} width={160} height={80} rx={16}
              fill={COLORS.bg_secondary}
              stroke={i === 0 ? COLORS.accent : 'rgba(255,255,255,0.1)'}
              strokeWidth={i === 0 ? 2 : 1} />
            <text x={child.x + 80} y={childCY + 8} textAnchor="middle"
              fontFamily={FONT} fontSize={30} fontWeight={800}
              fill={i === 0 ? COLORS.accent : COLORS.white}>
              {child.name}
            </text>
          </g>
        ))}

        {/* ── Bottom summary card ─────────────────────────────────────── */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1140} w={960} h={240} />
          <rect x={60} y={1140} width={6} height={240} rx={3} fill={COLORS.accent} />
          <text x={100} y={1220} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Every class is a child
          </text>
          <text x={100} y={1280} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            of java.lang.Object
          </text>
          <text x={100} y={1340} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Even when you never write "extends"
          </text>
        </g>

        {/* ── Decorative float dots ───────────────────────────────────── */}
        <circle cx={80} cy={500 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.2 * shimmer} />
        <circle cx={1000} cy={560 - breathe * 0.7} r={2.5} fill={COLORS.accent} fillOpacity={0.15} />
        <circle cx={200} cy={1500 + breathe * 0.5} r={3.5} fill={COLORS.accent} fillOpacity={0.12} />
        <circle cx={900} cy={1420 - breathe} r={2} fill={COLORS.accent} fillOpacity={0.18} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
