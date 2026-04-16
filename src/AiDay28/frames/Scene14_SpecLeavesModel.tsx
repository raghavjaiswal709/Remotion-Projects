/**
 * Scene 14 — SpecLeavesModel
 * "That specification leaves the model."
 * CSV: 45.680s → 47.880s
 * Duration: 83 frames (2.77s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring
 *   Phase 2 (frames 12–55):  Model box on left, spec document flies out toward right
 *                             Arrow path-draws across, boundary line drawn
 *   Phase 3 (frames 45–end): Document float, model idle glow, particles
 *
 * Visual: Robot/model box on left, animated document/spec flying rightward
 *         across a boundary line. Shows the spec "leaving" the model.
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene14_SpecLeavesModel: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // ── Phase 2 ──────────────────────────────────────────────────────────────

  // Model box
  const modelEnter = useSpringEntrance(frame, 12);
  const modelPerim = 2 * (320 + 440);
  const modelBorder = interpolate(frame, [12, 36], [modelPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Boundary line (dashed vertical)
  const boundaryLen = 700;
  const boundaryDash = usePathDraw(frame, 16, boundaryLen, 20);

  // "Outside" label
  const outsideEnter = useSpringEntrance(frame, 24);

  // Spec document — starts inside model, flies out to right
  const specProgress = spring({
    frame: Math.max(0, frame - 20),
    fps, config: SPRING_SOFT,
  });
  const specX = interpolate(specProgress, [0, 1], [200, 680]);
  const specOpacity = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Arrow from model to spec
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 22, arrowLen, 18);

  // Destination box (external system)
  const destEnter = useSpringEntrance(frame, 30);
  const destPerim = 2 * (280 + 440);
  const destBorder = interpolate(frame, [30, 54], [destPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Robot head inside model
  const robotPulse = 1 + Math.sin(frame * 0.08) * 0.01;
  const eyeBlink = Math.sin(frame * 0.12) > 0.95 ? 0.2 : 1;

  // Bottom description cards
  const card1Enter = useSpringEntrance(frame, 36);
  const card2Enter = useSpringEntrance(frame, 44);
  const card3Enter = useSpringEntrance(frame, 50);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const docFloat = Math.sin(frame * 0.07) * 4;
  const modelGlow = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.03, 0.07]);

  // Trail particles along the arrow path
  const trailParticles = Array.from({ length: 5 }, (_, i) => {
    const offset = (frame * 3 + i * 40) % 200;
    return {
      x: 300 + offset * 1.8,
      y: 780 + Math.sin(offset * 0.05) * 10,
      opacity: interpolate(offset, [0, 100, 200], [0, 0.3, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      }),
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · HANDOFF" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Spec Leaves
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={375}
            fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            The Model
          </text>
        </g>

        {/* ── ZONE C — Model → Boundary → Outside ────────────────────────── */}

        {/* MODEL BOX (left side) */}
        <g opacity={modelEnter.opacity} transform={`translate(0, ${modelEnter.translateY})`}>
          <BentoCard x={60} y={520} w={320} h={440} accent />
          {/* Border draw */}
          <rect x={60} y={520} width={320} height={440} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={modelPerim} strokeDashoffset={modelBorder} />
          {/* Glow */}
          <rect x={58} y={518} width={324} height={444} rx={22}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={modelGlow} />
          {/* MODEL label */}
          <text x={220} y={570} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            MODEL
          </text>
          {/* Robot head */}
          <g transform={`translate(220, 720) scale(${robotPulse})`}
             style={{ transformOrigin: '0px 0px' }}>
            {/* Head */}
            <rect x={-50} y={-60} width={100} height={80} rx={14}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Eyes */}
            <circle cx={-18} cy={-28} r={8}
              fill={COLORS.accent} opacity={eyeBlink * shimmer} />
            <circle cx={18} cy={-28} r={8}
              fill={COLORS.accent} opacity={eyeBlink * shimmer} />
            {/* Antenna */}
            <line x1={0} y1={-60} x2={0} y2={-80}
              stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={-84} r={5} fill={COLORS.accent} opacity={0.6} />
            {/* Body outline */}
            <rect x={-40} y={28} width={80} height={60} rx={10}
              fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
            {/* Circuit lines on body */}
            <line x1={-25} y1={42} x2={25} y2={42}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
            <line x1={-25} y1={58} x2={25} y2={58}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
            <line x1={0} y1={28} x2={0} y2={88}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          </g>
        </g>

        {/* BOUNDARY LINE (dashed vertical) */}
        <line x1={500} y1={480} x2={500} y2={1000}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray="12,8" opacity={0.4}
          strokeLinecap="round" />
        {/* Boundary label */}
        <g opacity={outsideEnter.opacity}>
          <rect x={470} y={470} width={60} height={28} rx={6}
            fill={COLORS.bg_primary} />
          <text x={500} y={492} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            EXIT
          </text>
        </g>

        {/* ARROW — Model → Outside */}
        <line x1={380} y1={780} x2={580} y2={780}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Trail particles */}
        {trailParticles.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={2}
            fill={COLORS.accent} opacity={pt.opacity} />
        ))}

        {/* SPEC DOCUMENT — animated position */}
        <g opacity={specOpacity} transform={`translate(${specX}, ${760 + docFloat})`}>
          {/* Document rect */}
          <rect x={-60} y={-40} width={120} height={80} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Doc lines */}
          <line x1={-40} y1={-20} x2={40} y2={-20}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <line x1={-40} y1={-4} x2={30} y2={-4}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3} />
          <line x1={-40} y1={12} x2={36} y2={12}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3} />
          {/* Spec label */}
          <text x={0} y={4} textAnchor="middle"
            fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.accent} opacity={0.8}>
            SPEC
          </text>
        </g>

        {/* DESTINATION BOX (right side — external system) */}
        <g opacity={destEnter.opacity} transform={`translate(0, ${destEnter.translateY})`}>
          <BentoCard x={740} y={520} w={280} h={440} />
          <rect x={740} y={520} width={280} height={440} rx={20}
            fill="none" stroke={COLORS.text_muted} strokeWidth={1.5}
            strokeDasharray={destPerim} strokeDashoffset={destBorder}
            opacity={0.4} />
          {/* SYSTEM label */}
          <text x={880} y={570} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">
            SYSTEM
          </text>
          {/* Gear icon */}
          <g transform="translate(880, 740)">
            <circle cx={0} cy={0} r={30} fill="none"
              stroke={COLORS.text_muted} strokeWidth={2} opacity={0.5} />
            <circle cx={0} cy={0} r={12} fill="none"
              stroke={COLORS.text_muted} strokeWidth={2} opacity={0.4} />
            {/* Gear teeth */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const x1 = Math.cos(angle) * 30;
              const y1 = Math.sin(angle) * 30;
              const x2 = Math.cos(angle) * 40;
              const y2 = Math.sin(angle) * 40;
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={COLORS.text_muted} strokeWidth={4} opacity={0.3}
                  strokeLinecap="round" />
              );
            })}
          </g>
        </g>

        {/* ── Bottom description cards ───────────────────────────────────── */}
        <g opacity={card1Enter.opacity} transform={`translate(0, ${card1Enter.translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={140} accent />
          <text x={100} y={1162}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Model produces spec
          </text>
        </g>

        <g opacity={card2Enter.opacity} transform={`translate(0, ${card2Enter.translateY})`}>
          <BentoCard x={560} y={1080} w={460} h={140} />
          <text x={600} y={1162}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Spec exits boundary
          </text>
        </g>

        <g opacity={card3Enter.opacity} transform={`translate(0, ${card3Enter.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={140} />
          <text x={540} y={1344} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            System receives the instruction for execution
          </text>
        </g>

        {/* ── Floating accent particles ──────────────────────────────────── */}
        {[
          { x: 100, y: 1500 }, { x: 980, y: 1520 },
          { x: 300, y: 1600 }, { x: 800, y: 1620 },
          { x: 540, y: 1700 }, { x: 150, y: 1680 },
          { x: 900, y: 1700 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 0.8) * 4}
            r={2.5} fill={COLORS.accent} opacity={0.08 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
