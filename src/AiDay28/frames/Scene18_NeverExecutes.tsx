/**
 * Scene 18 — NeverExecutes
 * "The model never directly executes anything."
 * CSV: 57.380s → 60.260s
 * Duration: 106 frames (3.53s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + "NEVER" headline slam-in
 *   Phase 2 (frames 14–60): Robot with crossed-out hands, model boundary, forbidden zone
 *   Phase 3 (frames 50–end): Pulsing forbidden sign, locked-out particles
 *
 * Visual: Large robot figure with crossed arms, surrounded by a boundary.
 *         Beyond the boundary are real-world elements (database, API, files)
 *         The model CANNOT reach them — a clear forbidden/barrier visual.
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

export const Scene18_NeverExecutes: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const neverSlam = spring({ frame: Math.max(0, frame - 3), fps, config: SPRING_SNAP });
  const neverScale = interpolate(neverSlam, [0, 1], [1.4, 1]);
  const neverOpacity = interpolate(neverSlam, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleEnter = useSpringEntrance(frame, 10);

  // ── Phase 2 ──────────────────────────────────────────────────────────────

  // Central robot figure (model)
  const robotEnter = useSpringEntrance(frame, 14);

  // Boundary circle (model boundary)
  const boundaryCircum = 2 * Math.PI * 180;
  const boundaryDash = usePathDraw(frame, 16, boundaryCircum, 28);

  // Forbidden X over hands
  const xLen = 120;
  const xDash = usePathDraw(frame, 30, xLen, 15);

  // Outer real-world elements (can't reach)
  const dbEnter = useSpringEntrance(frame, 24);
  const apiEnter = useSpringEntrance(frame, 30);
  const fileEnter = useSpringEntrance(frame, 36);

  // Barrier flash lines
  const barrierFlash = interpolate(frame, [30, 35, 38], [0, 0.4, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Big X overlay
  const bigXLen = 300;
  const bigXDash1 = usePathDraw(frame, 42, bigXLen, 16);
  const bigXDash2 = usePathDraw(frame, 45, bigXLen, 16);

  // Bottom cards
  const card1 = useSpringEntrance(frame, 48);
  const card2 = useSpringEntrance(frame, 54);
  const card3 = useSpringEntrance(frame, 60);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.03;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Forbidden ring pulse
  const forbidRing = interpolate(frame, [50, 80], [180, 210], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const forbidRingOp = interpolate(frame, [50, 80], [0.25, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Locked particles
  const lockParticles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + frame * 0.015;
    return {
      x: 380 + Math.cos(angle) * 210,
      y: 820 + Math.sin(angle) * 210,
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · LIMITS" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — NEVER headline slam ──────────────────────────────── */}
        <g opacity={neverOpacity}
           transform={`translate(540, 280) scale(${neverScale})`}
           style={{ transformOrigin: '0px 0px' }}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.vibrant_red}>
            NEVER
          </text>
        </g>

        <g transform={`translate(0, ${subtitleEnter.translateY})`} opacity={subtitleEnter.opacity}>
          <text x={540} y={380} textAnchor="middle"
            fontFamily={FONT} fontSize={46} fontWeight={800}
            fill={COLORS.text_muted}>
            Directly Executes Anything
          </text>
        </g>

        {/* ── ZONE C — Model boundary with robot ────────────────────────── */}

        {/* Robot (model) centered at 380, 820 */}
        <g opacity={robotEnter.opacity}
           transform={`translate(${robotEnter.translateY * 0.5}, ${robotEnter.translateY})`}>

          {/* Robot head */}
          <rect x={335} y={710} width={90} height={70} rx={14}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Antenna */}
          <line x1={380} y1={710} x2={380} y2={690}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={380} cy={685} r={4} fill={COLORS.accent} opacity={0.6} />
          {/* Eyes */}
          <circle cx={358} cy={740} r={7} fill={COLORS.accent} opacity={0.8} />
          <circle cx={402} cy={740} r={7} fill={COLORS.accent} opacity={0.8} />
          {/* Mouth — flat line */}
          <line x1={362} y1={764} x2={398} y2={764}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />

          {/* Body */}
          <rect x={340} y={790} width={80} height={90} rx={10}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Crossed arms */}
          <line x1={326} y1={810} x2={370} y2={850}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <line x1={434} y1={810} x2={390} y2={850}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          {/* Legs */}
          <line x1={360} y1={880} x2={360} y2={920}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <line x1={400} y1={880} x2={400} y2={920}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Boundary circle */}
        <circle cx={380} cy={820} r={180}
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
          strokeDasharray={boundaryCircum} strokeDashoffset={boundaryDash}
          opacity={0.6} />

        {/* Barrier flash */}
        <circle cx={380} cy={820} r={180}
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={6}
          opacity={barrierFlash} />

        {/* Forbidden pulse ring */}
        <circle cx={380} cy={820} r={forbidRing}
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
          opacity={forbidRingOp} />

        {/* Forbidden X over the robot */}
        <line x1={310} y1={750} x2={450} y2={890}
          stroke={COLORS.vibrant_red} strokeWidth={4}
          strokeDasharray={xLen} strokeDashoffset={xDash}
          strokeLinecap="round" opacity={0.7} />
        <line x1={450} y1={750} x2={310} y2={890}
          stroke={COLORS.vibrant_red} strokeWidth={4}
          strokeDasharray={xLen} strokeDashoffset={xDash}
          strokeLinecap="round" opacity={0.7} />

        {/* Lock particles orbiting boundary */}
        {lockParticles.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={2.5}
            fill={COLORS.vibrant_red} opacity={0.15 * shimmer} />
        ))}

        {/* ── Real-world elements (outside boundary, unreachable) ─────── */}

        {/* Database (right) */}
        <g opacity={dbEnter.opacity}
           transform={`translate(${780 + breathe * 0.5}, ${700 + dbEnter.translateY})`}>
          <ellipse cx={0} cy={0} rx={50} ry={16}
            fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          <rect x={-50} y={0} width={100} height={60} rx={0}
            fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          <ellipse cx={0} cy={60} rx={50} ry={16}
            fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          <text x={0} y={84} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            DATABASE
          </text>
        </g>

        {/* API (far right bottom) */}
        <g opacity={apiEnter.opacity}
           transform={`translate(${780 + breathe * -0.3}, ${920 + apiEnter.translateY})`}>
          <rect x={-50} y={-24} width={100} height={48} rx={12}
            fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          <text x={0} y={6} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            API
          </text>
        </g>

        {/* File system (top-right) */}
        <g opacity={fileEnter.opacity}
           transform={`translate(${710}, ${580 + fileEnter.translateY + breathe * 0.4})`}>
          <rect x={-36} y={-28} width={72} height={56} rx={4}
            fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          <line x1={-20} y1={-12} x2={20} y2={-12}
            stroke={COLORS.text_muted} strokeWidth={1} opacity={0.5} />
          <line x1={-20} y1={0} x2={20} y2={0}
            stroke={COLORS.text_muted} strokeWidth={1} opacity={0.5} />
          <line x1={-20} y1={12} x2={10} y2={12}
            stroke={COLORS.text_muted} strokeWidth={1} opacity={0.5} />
          <text x={0} y={48} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            FILES
          </text>
        </g>

        {/* Dashed "can't reach" lines to real-world elements */}
        <line x1={560} y1={760} x2={680} y2={720}
          stroke={COLORS.vibrant_red} strokeWidth={1.5}
          strokeDasharray="6 8" opacity={0.3} />
        <line x1={560} y1={820} x2={680} y2={930}
          stroke={COLORS.vibrant_red} strokeWidth={1.5}
          strokeDasharray="6 8" opacity={0.3} />
        <line x1={560} y1={680} x2={670} y2={600}
          stroke={COLORS.vibrant_red} strokeWidth={1.5}
          strokeDasharray="6 8" opacity={0.3} />

        {/* Big X overlay across entire diagram region */}
        <line x1={200} y1={580} x2={900} y2={950}
          stroke={COLORS.vibrant_red} strokeWidth={5}
          strokeDasharray={bigXLen} strokeDashoffset={bigXDash1}
          strokeLinecap="round" opacity={0.12} />
        <line x1={900} y1={580} x2={200} y2={950}
          stroke={COLORS.vibrant_red} strokeWidth={5}
          strokeDasharray={bigXLen} strokeDashoffset={bigXDash2}
          strokeLinecap="round" opacity={0.12} />

        {/* ── Bottom cards ───────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1100} w={300} h={140} />
          <rect x={60} y={1100} width={6} height={140} rx={3}
            fill={COLORS.vibrant_red} />
          <text x={100} y={1155}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            No databases
          </text>
          <text x={100} y={1200}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            accessed
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={390} y={1100} w={300} h={140} />
          <rect x={390} y={1100} width={6} height={140} rx={3}
            fill={COLORS.vibrant_red} />
          <text x={430} y={1155}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            No APIs
          </text>
          <text x={430} y={1200}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            called
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={720} y={1100} w={300} h={140} />
          <rect x={720} y={1100} width={6} height={140} rx={3}
            fill={COLORS.vibrant_red} />
          <text x={760} y={1155}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            No files
          </text>
          <text x={760} y={1200}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            read
          </text>
        </g>

        {/* Wide summary card */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY + 6})`}>
          <BentoCard x={60} y={1290} w={960} h={130} accent />
          <text x={540} y={1370} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The model <tspan fill={COLORS.vibrant_red} fontStyle="italic">never</tspan> directly executes
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────── */}
        {[
          { x: 100, y: 1520 }, { x: 980, y: 1540 },
          { x: 300, y: 1580 }, { x: 760, y: 1600 },
          { x: 540, y: 1660 }, { x: 180, y: 1700 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.05 + i) * 4}
            r={2} fill={COLORS.vibrant_red}
            opacity={0.06 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s18.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
