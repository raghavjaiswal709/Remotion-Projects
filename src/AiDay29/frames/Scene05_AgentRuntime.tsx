/**
 * Scene 05 — AgentRuntime
 * "This is the agent runtime."
 * CSV: 15.400s → 17.800s
 * Duration: 72 frames (2.4s)
 *
 * Animation phases:
 *   Phase 1 (0–20):  Label + headline entrance
 *   Phase 2 (15–50): Hero title with border-draw, robot runtime diagram
 *   Phase 3 (45–end): Pulse, float, shimmer micro-anims
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene05_AgentRuntime: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 5);
  const h2 = useSpringEntrance(frame, 10);

  // ── Phase 2: Hero card ─────────────────────────────────────────────────────
  const heroCard = useSpringEntrance(frame, 15);
  const heroPerim = 2 * (960 + 320);
  const heroDash = usePathDraw(frame, 15, heroPerim, 28);

  // Hero text per-word
  const heroWords = ['AGENT', 'RUNTIME'];
  const heroWordSprings = heroWords.map((_, i) => {
    const f = Math.max(0, frame - 18 - i * 6);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const ty = interpolate(sp, [0, 1], [28, 0]);
    return { opacity: op, translateY: ty };
  });

  // Runtime block diagram — outer shell wrapping model
  const diagramCard = useSpringEntrance(frame, 25);
  const diagramPerim = 2 * (800 + 460);
  const diagramDash = usePathDraw(frame, 25, diagramPerim, 30);

  // Inner model box
  const modelBox = useSpringEntrance(frame, 32);
  const modelPerim = 2 * (280 + 120);
  const modelDash = usePathDraw(frame, 32, modelPerim, 20);

  // Orbit arrows around model (runtime wraps model)
  const orbitCircum = 2 * Math.PI * 160;
  const orbitDash = usePathDraw(frame, 36, orbitCircum, 30);

  // Labels
  const labelRuntime = useSpringEntrance(frame, 38);
  const labelModel = useSpringEntrance(frame, 34);

  // Bottom summary
  const bottomCard = useSpringEntrance(frame, 40);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const rotation = frame * 0.5;

  // Particles
  const particles = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + frame * 0.01;
    const r = 380 + Math.sin(frame * 0.02 + i) * 30;
    return {
      x: 540 + Math.cos(a) * r,
      y: 950 + Math.sin(a) * r * 0.35,
      op: 0.08 + Math.sin(frame * 0.05 + i) * 0.06,
      size: 2 + (i % 4),
    };
  });

  // Circuit lines on diagram (decorative)
  const circuitLines = [
    { x1: 230, y1: 780, x2: 230, y2: 860, delay: 28 },
    { x1: 850, y1: 780, x2: 850, y2: 860, delay: 30 },
    { x1: 340, y1: 1060, x2: 540, y2: 1060, delay: 32 },
    { x1: 540, y1: 1060, x2: 740, y2: 1060, delay: 34 },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · TOOL USE" y={160} />
        </g>

        {/* ── ZONE B — Hero title ────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.text_muted}>
            This is the
          </text>
        </g>
        {heroWords.map((word, i) => (
          <g key={i} transform={`translate(0, ${heroWordSprings[i].translateY})`}
            opacity={heroWordSprings[i].opacity}>
            <text x={60 + i * 460} y={420} fontFamily={FONT}
              fontSize={110} fontWeight={800}
              fill={i === 1 ? COLORS.accent : COLORS.white}
              fontStyle={i === 1 ? 'italic' : 'normal'}>
              {word}
            </text>
          </g>
        ))}

        {/* ── ZONE C — Runtime wrapping Model diagram ───────────────────── */}
        <g opacity={diagramCard.opacity} transform={`translate(0, ${diagramCard.translateY})`}>
          {/* Outer runtime shell */}
          <rect x={140} y={520} width={800} height={540} rx={24}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={diagramPerim} strokeDashoffset={diagramDash} />

          {/* Runtime label top-left */}
          <g opacity={labelRuntime.opacity} transform={`translate(0, ${labelRuntime.translateY})`}>
            <text x={180} y={570}
              fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.accent} letterSpacing="0.12em">
              RUNTIME
            </text>
          </g>

          {/* Orbit ring around model */}
          <ellipse cx={540} cy={790} rx={200} ry={130}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4}
            strokeDasharray={orbitCircum} strokeDashoffset={orbitDash}
            transform={`rotate(${rotation * 0.3}, 540, 790)`} />

          {/* Arrow dots on orbit */}
          {[0, 90, 180, 270].map((deg, i) => {
            const rad = (deg + rotation * 0.3) * Math.PI / 180;
            const cx = 540 + Math.cos(rad) * 200;
            const cy = 790 + Math.sin(rad) * 130;
            const op = interpolate(frame, [36 + i * 3, 42 + i * 3], [0, 0.6], { extrapolateRight: 'clamp' });
            return <circle key={i} cx={cx} cy={cy} r={5} fill={COLORS.accent} opacity={op} />;
          })}

          {/* Inner model box */}
          <g opacity={modelBox.opacity} transform={`translate(0, ${modelBox.translateY * 0.3})`}>
            <rect x={400} y={730} width={280} height={120} rx={16}
              fill={COLORS.bg_primary}
              stroke={COLORS.white} strokeWidth={1.5}
              strokeDasharray={modelPerim} strokeDashoffset={modelDash} />
            <g opacity={labelModel.opacity}>
              <text x={540} y={802} textAnchor="middle"
                fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
                MODEL
              </text>
            </g>
          </g>

          {/* Circuit decoration lines */}
          {circuitLines.map((ln, i) => {
            const lnOp = interpolate(frame, [ln.delay, ln.delay + 12], [0, 0.3], { extrapolateRight: 'clamp' });
            return (
              <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
                stroke={COLORS.accent} strokeWidth={1} opacity={lnOp}
                strokeDasharray="4,4" />
            );
          })}

          {/* I/O labels */}
          <g opacity={labelRuntime.opacity * 0.7}>
            <text x={200} y={720} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
              INPUT
            </text>
            <line x1={200} y1={730} x2={380} y2={790} stroke={COLORS.text_muted}
              strokeWidth={1} opacity={0.4} />
            <text x={820} y={720} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
              OUTPUT
            </text>
            <line x1={680} y1={790} x2={810} y2={730} stroke={COLORS.text_muted}
              strokeWidth={1} opacity={0.4} />
          </g>

          {/* Tool exec indicator */}
          <g opacity={labelRuntime.opacity * 0.6}>
            <text x={540} y={960} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
              TOOL EXECUTION · PROMPT FORMAT · API CALLS
            </text>
          </g>
        </g>

        {/* ── Bottom summary card ────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={160} accent />
          <rect x={60} y={1120} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={120} y={1215}
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The code that makes the agent{' '}
          </text>
          <text x={780} y={1215}
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            work
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={COLORS.accent} opacity={p.op} />
        ))}

        {/* ── Pulsing ring decoration ────────────────────────────────────── */}
        <g transform={`translate(540, ${1480 + breathe})`}>
          <circle cx={0} cy={0} r={36} fill={COLORS.accent} opacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.25} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ───────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
