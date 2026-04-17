/**
 * Scene 06 — Parent Class
 * "Every class in Java has a parent."
 * CSV: 21.580s → 24.420s
 * Duration: 85 frames (2.8s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline springs
 *   Phase 2 (frames 20–60):  Tree diagram — Object at top, child classes below with arrows
 *   Phase 3 (frames 50–end): Float + pulse micro-animations
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

export const Scene06_ParentClass: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt   = useSpringEntrance(frame, 0);
  const headlineA  = useSpringEntrance(frame, 5);
  const headlineB  = useSpringEntrance(frame, 10);

  // ── Phase 2 — tree diagram ─────────────────────────────────────────────────
  const parentNode  = useSpringEntrance(frame, 14);
  const child1      = useSpringEntrance(frame, 22);
  const child2      = useSpringEntrance(frame, 28);
  const child3      = useSpringEntrance(frame, 34);

  // ── Arrow path draws ──────────────────────────────────────────────────────
  const arrowLen = 180;
  const arrow1Dash = usePathDraw(frame, 20, arrowLen, 20);
  const arrow2Dash = usePathDraw(frame, 26, arrowLen, 20);
  const arrow3Dash = usePathDraw(frame, 32, arrowLen, 20);

  // ── Bottom card ────────────────────────────────────────────────────────────
  const bottomEnt = useSpringEntrance(frame, 40);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe   = Math.sin(frame * 0.06) * 4;
  const pulse     = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer   = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // ── Connector glow ─────────────────────────────────────────────────────────
  const connGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.4, 0.8]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  const children = [
    { label: 'Train', x: 160, color: COLORS.accent },
    { label: 'Station', x: 540, color: COLORS.white },
    { label: 'Ticket', x: 920, color: COLORS.accent },
  ];
  const childEnts = [child1, child2, child3];
  const arrowDashes = [arrow1Dash, arrow2Dash, arrow3Dash];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 2 · INHERITANCE" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Every Class
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}>
            Has a Parent
          </text>
        </g>

        {/* ── ZONE C — Inheritance tree ───────────────────────────────────── */}

        {/* Parent node — Object */}
        <g opacity={parentNode.opacity} transform={`translate(0, ${parentNode.translateY})`}>
          <BentoCard x={340} y={520} w={400} h={120} accent />
          <rect x={340} y={520} width={400} height={40} rx={20}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={540} y={598} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Object
          </text>
          {/* Crown icon above */}
          <g transform={`translate(540, ${500 + breathe * 0.5})`} opacity={shimmer}>
            <polygon points="0,-18 -12,0 12,0"
              fill={COLORS.accent} fillOpacity={0.5} />
            <rect x={-14} y={0} width={28} height={5} rx={2}
              fill={COLORS.accent} fillOpacity={0.3} />
          </g>
        </g>

        {/* Arrows from parent to children */}
        {children.map((ch, i) => (
          <path key={`arrow-${i}`}
            d={`M 540,640 Q ${540 + (ch.x - 540) * 0.3},720 ${ch.x},780`}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDashes[i]}
            strokeLinecap="round" opacity={connGlow}
            markerEnd="url(#arrow)" />
        ))}

        {/* Child nodes */}
        {children.map((ch, i) => (
          <g key={ch.label} opacity={childEnts[i].opacity}
            transform={`translate(0, ${childEnts[i].translateY})`}>
            <BentoCard x={ch.x - 140} y={780} w={280} h={100} />
            <text x={ch.x} y={842} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={ch.color}>
              {ch.label}
            </text>
          </g>
        ))}

        {/* ── "extends" labels ────────────────────────────────────────────── */}
        {children.map((ch, i) => {
          const ent = childEnts[i];
          return (
            <text key={`ext-${i}`} x={ch.x} y={760} textAnchor="middle"
              fontFamily={FONT} fontSize={22} fontWeight={800}
              fill={COLORS.text_muted} opacity={ent.opacity * 0.6}>
              extends
            </text>
          );
        })}

        {/* ── Decorative ring behind parent ───────────────────────────────── */}
        <circle cx={540} cy={580} r={90} fill="none"
          stroke={COLORS.accent} strokeWidth={1} opacity={0.08 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 580px' }} />
        <circle cx={540} cy={580} r={120} fill="none"
          stroke={COLORS.accent} strokeWidth={0.5} opacity={0.05 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 580px' }} />

        {/* ── Bottom explanation card ─────────────────────────────────────── */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={940} w={960} h={240} />
          <rect x={60} y={940} width={6} height={240} rx={3} fill={COLORS.accent} />
          <text x={100} y={1020} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Java enforces single inheritance
          </text>
          <text x={100} y={1070} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Every class has exactly one parent class.
          </text>
          <text x={100} y={1120} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            If you don't specify one, it's
          </text>
          <text x={630} y={1120} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Object
          </text>
        </g>

        {/* ── Floating accents ────────────────────────────────────────────── */}
        <circle cx={100} cy={600 + breathe} r={4}
          fill={COLORS.accent} fillOpacity={0.2} />
        <circle cx={980} cy={700 + breathe * 0.7} r={3}
          fill={COLORS.accent} fillOpacity={0.15} />
        <circle cx={200} cy={1000 - breathe * 0.5} r={2.5}
          fill={COLORS.accent} fillOpacity={0.2} />
        <circle cx={880} cy={1100 + breathe * 0.3} r={3.5}
          fill={COLORS.accent} fillOpacity={0.18} />

        {/* ── Bottom decorative track ─────────────────────────────────────── */}
        <g opacity={0.06 * shimmer}>
          <line x1={60} y1={1300} x2={1020} y2={1300}
            stroke={COLORS.text_muted} strokeWidth={3} />
          <line x1={60} y1={1312} x2={1020} y2={1312}
            stroke={COLORS.text_muted} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 80} y={1296} width={20} height={20} rx={2}
              fill={COLORS.text_muted} fillOpacity={0.3} />
          ))}
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
