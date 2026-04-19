/**
 * Scene 22 — CompileTimeLimitation
 * "And the decision cannot be made at compile time."
 * CSV: 67.180s → 69.340s
 * Duration: 80 frames (2.7s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + hero text
 *   Phase 2 (frames 14–55): Compiler box with big red X, timeline bar
 *   Phase 3 (frames 50–end): Pulse, shimmer, breathe
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene22_CompileTimeLimitation: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const heroA = useSpringEntrance(frame, 4);
  const heroB = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const compBox  = useSpringEntrance(frame, 14);
  const crossSpr = spring({ frame: Math.max(0, frame - 24), fps, config: SPRING_SNAP });
  const crossScl = interpolate(crossSpr, [0, 1], [2.5, 1]);
  const crossOp  = interpolate(Math.max(0, frame - 24), [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  const timeBar  = useSpringEntrance(frame, 30);
  const qCard    = useSpringEntrance(frame, 36);
  const detailL  = useSpringEntrance(frame, 42);
  const detailR  = useSpringEntrance(frame, 48);
  const summE    = useSpringEntrance(frame, 54);

  // Cross lines path draw
  const crossLen = 200;
  const crossD1  = usePathDraw(frame, 24, crossLen, 12);
  const crossD2  = usePathDraw(frame, 25, crossLen, 12);

  // Timeline arrow draw
  const timeArrLen = 900;
  const timeArrD   = usePathDraw(frame, 30, timeArrLen, 30);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const xPulse  = 1 + Math.sin(frame * 0.12) * 0.03;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  // Gear teeth path
  const gearTeeth = (cx: number, cy: number, r: number, teeth: number) => {
    let d = '';
    const innerR = r * 0.65;
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.35) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a4 = ((i + 0.85) / teeth) * Math.PI * 2;
      d += `${i === 0 ? 'M' : 'L'} ${cx + Math.cos(a1) * innerR},${cy + Math.sin(a1) * innerR} `;
      d += `L ${cx + Math.cos(a2) * r},${cy + Math.sin(a2) * r} `;
      d += `L ${cx + Math.cos(a3) * r},${cy + Math.sin(a3) * r} `;
      d += `L ${cx + Math.cos(a4) * innerR},${cy + Math.sin(a4) * innerR} `;
    }
    d += 'Z';
    return d;
  };

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            COMPILE-TIME · LIMITATION
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.white}>
            Decision <tspan fill={COLORS.vibrant_red}>Cannot</tspan>
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Be Made at Compile Time
          </text>
        </g>

        {/* ── Compiler box with red X ────────────────────────────────────── */}
        <g opacity={compBox.opacity} transform={`translate(0, ${compBox.translateY})`}>
          <BentoCard x={200} y={520} w={680} h={300} />
          {/* Compiler header */}
          <rect x={200} y={520} width={680} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={540} y={558} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            JAVA COMPILER (javac)
          </text>
          {/* Gear icon */}
          <path d={gearTeeth(540, 680, 50, 8)}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2} opacity={0.3} />
          <circle cx={540} cy={680} r={18}
            fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={2} opacity={0.3} />
          {/* "Cannot resolve" text */}
          <text x={540} y={780} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Parent or Child version?
          </text>
        </g>

        {/* ── Big red X overlay ──────────────────────────────────────────── */}
        <g opacity={crossOp}
          transform={`scale(${crossScl})`}
          style={{ transformOrigin: '540px 670px' }}>
          <line x1={320} y1={550} x2={760} y2={790}
            stroke={COLORS.vibrant_red} strokeWidth={6}
            strokeDasharray={crossLen * 2} strokeDashoffset={crossD1 * 2}
            strokeLinecap="round" />
          <line x1={760} y1={550} x2={320} y2={790}
            stroke={COLORS.vibrant_red} strokeWidth={6}
            strokeDasharray={crossLen * 2} strokeDashoffset={crossD2 * 2}
            strokeLinecap="round" />
        </g>
        {/* X pulse ring */}
        <circle cx={540} cy={670} r={120}
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
          opacity={crossOp * 0.2}
          transform={`scale(${xPulse})`}
          style={{ transformOrigin: '540px 670px' }} />

        {/* ── Timeline bar ───────────────────────────────────────────────── */}
        <g opacity={timeBar.opacity} transform={`translate(0, ${timeBar.translateY})`}>
          <BentoCard x={60} y={870} w={960} h={120} />
          {/* Timeline line */}
          <line x1={120} y1={930} x2={1000} y2={930}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={timeArrLen} strokeDashoffset={timeArrD}
            strokeLinecap="round" />
          {/* Compile marker */}
          <circle cx={300} cy={930} r={10}
            fill={COLORS.bg_primary} stroke={COLORS.vibrant_red} strokeWidth={3} />
          <text x={300} y={910} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.vibrant_red}>
            COMPILE
          </text>
          {/* Runtime marker */}
          <circle cx={760} cy={930} r={10}
            fill={COLORS.accent} stroke={COLORS.accent} strokeWidth={3} />
          <text x={760} y={910} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent}>
            RUNTIME
          </text>
          {/* Arrow head at right */}
          <polygon points="1000,930 985,920 985,940"
            fill={COLORS.accent} opacity={0.7} />
        </g>

        {/* ── Question card ──────────────────────────────────────────────── */}
        <g opacity={qCard.opacity} transform={`translate(0, ${qCard.translateY})`}>
          <BentoCard x={160} y={1040} w={760} h={120} accent />
          <text x={540} y={1112} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>
            Train t = new ExpressTrain();
          </text>
        </g>

        {/* ── Detail tiles ───────────────────────────────────────────────── */}
        <g opacity={detailL.opacity} transform={`translate(0, ${detailL.translateY})`}>
          <BentoCard x={60} y={1210} w={460} h={130} />
          <rect x={60} y={1210} width={6} height={130} rx={3}
            fill={COLORS.vibrant_red} />
          <text x={100} y={1268}
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>
            Declared type: Train
          </text>
          <text x={100} y={1310}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Compiler sees parent only
          </text>
        </g>
        <g opacity={detailR.opacity} transform={`translate(0, ${detailR.translateY})`}>
          <BentoCard x={560} y={1210} w={460} h={130} accent />
          <rect x={560} y={1210} width={6} height={130} rx={3}
            fill={COLORS.accent} />
          <text x={600} y={1268}
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent}>
            Actual type: ExpressTrain
          </text>
          <text x={600} y={1310}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Only known at runtime
          </text>
        </g>

        {/* ── Summary ────────────────────────────────────────────────────── */}
        <g opacity={summE.opacity} transform={`translate(0, ${summE.translateY})`}>
          <BentoCard x={100} y={1400} w={880} h={120} />
          <text x={540} y={1472} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Overloading resolves at <tspan fill={COLORS.vibrant_red}>compile time</tspan> — but this needs <tspan fill={COLORS.accent}>runtime</tspan>
          </text>
        </g>

        {/* ── Bottom insight ─────────────────────────────────────────────── */}
        <g opacity={summE.opacity * shimmer}>
          <BentoCard x={120} y={1570} w={840} h={100} />
          <text x={540} y={1632} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            The JVM must decide at <tspan fill={COLORS.accent} fontStyle="italic">execution time</tspan>
          </text>
        </g>

        {/* ── Floating micro-anim ────────────────────────────────────────── */}
        <g transform={`translate(140, ${1710 + breathe})`} opacity={0.08}>
          <circle cx={0} cy={0} r={6}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(940, ${1720 + breathe * 0.7})`} opacity={shimmer * 0.06}>
          <circle cx={0} cy={0} r={5} fill={COLORS.accent} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s22.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
