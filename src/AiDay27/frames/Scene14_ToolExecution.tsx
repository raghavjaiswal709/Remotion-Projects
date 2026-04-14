/**
 * Scene 14 — Tool's Job Is Execution
 * "The tool's job is execution, doing the actual work in the real world."
 * CSV: 59.980s → 65.400s
 * Duration: 181 frames (6.0s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + "EXECUTION" headline spring
 *   Phase 2 (frames 25–100): Real-world actions bento grid — API call, file write, email, DB query
 *   Phase 3 (frames 90–end): Gear rotation, pulse, data flow particles
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene14_ToolExecution: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headlineEnt = useSpringEntrance(frame, 6);
  const subEnt = useSpringEntrance(frame, 14);

  // ── Phase 2: Four action cards ─────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 24);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);
  const card4 = useSpringEntrance(frame, 60);

  // Border draw for hero card
  const heroPerim = 2 * (960 + 200);
  const heroBorder = usePathDraw(frame, 70, heroPerim, 25);
  const heroCard = useSpringEntrance(frame, 72);

  // Connector lines between cards and hero
  const connLen = 100;
  const conn1 = usePathDraw(frame, 64, connLen, 16);
  const conn2 = usePathDraw(frame, 68, connLen, 16);

  // Bottom insight
  const insightCard = useSpringEntrance(frame, 84);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const gearAngle = frame * 1.2;

  // Data flow particles
  const pX = interpolate(frame % 60, [0, 60], [80, 1000], { extrapolateRight: 'clamp' });
  const pOp = interpolate(frame % 60, [0, 10, 50, 60], [0, 0.4, 0.4, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TOOL'S ROLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEnt.translateY})`} opacity={headlineEnt.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.text_muted}>
            The Tool&apos;s Job Is
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={110} fontWeight={800} fill={COLORS.accent}>
            EXECUTION
          </text>
        </g>

        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={60} y={465} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Doing the actual work in the real world
          </text>
        </g>

        {/* ── ZONE C — Real-world action cards ────────────────────────────── */}

        {/* 2x2 grid of action cards */}
        {/* Card 1: API Call */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={520} w={460} h={180} accent />
          {/* Lightning bolt icon */}
          <polygon points="124,548 112,580 128,576 116,608"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinejoin="round" />
          <text x={150} y={590} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            API Call
          </text>
          <text x={150} y={630} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            HTTP request sent
          </text>
          {/* Status dot */}
          <circle cx={480} cy={610} r={8} fill={COLORS.accent} opacity={shimmer * 0.6} />
        </g>

        {/* Card 2: File Write */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={520} w={460} h={180} />
          {/* File icon */}
          <rect x={590} y={545} width={28} height={36} rx={3}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <polyline points="606,545 618,545 618,557"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <line x1={598} y1={562} x2={610} y2={562}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <line x1={598} y1={570} x2={610} y2={570}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <text x={630} y={590} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            File Write
          </text>
          <text x={630} y={630} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Data saved to disk
          </text>
        </g>

        {/* Card 3: Send Email */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={720} w={460} h={180} />
          {/* Envelope icon */}
          <rect x={90} y={760} width={36} height={24} rx={3}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <polyline points="90,760 108,776 126,760"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={140} y={795} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Send Email
          </text>
          <text x={140} y={835} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Message delivered
          </text>
        </g>

        {/* Card 4: DB Query */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={720} w={460} h={180} accent />
          {/* Database icon */}
          <ellipse cx={604} cy={770} rx={18} ry={8}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <path d="M586,770 L586,798 A18,8 0 0,0 622,798 L622,770"
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <ellipse cx={604} cy={784} rx={18} ry={5}
            fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
          <text x={636} y={798} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            DB Query
          </text>
          <text x={636} y={838} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Rows returned
          </text>
        </g>

        {/* ── Connector arrows to hero card ────────────────────────────────── */}
        <line x1={290} y1={910} x2={290} y2={970}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn1}
          markerEnd="url(#arrow)" />
        <line x1={790} y1={910} x2={790} y2={970}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn2}
          markerEnd="url(#arrow)" />

        {/* ── Hero card: REAL WORLD ───────────────────────────────────────── */}
        <g opacity={heroCard.opacity} transform={`translate(0, ${heroCard.translateY})`}>
          <rect x={60} y={980} width={960} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={heroPerim} strokeDashoffset={heroBorder} />
          <rect x={60} y={980} width={960} height={200} rx={20}
            fill={COLORS.bg_secondary} />

          {/* Gear icon — animated rotation */}
          <g transform={`translate(160, 1080) rotate(${gearAngle})`} style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={0} r={10} fill={COLORS.accent} opacity={0.3} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect key={angle} x={-3} y={-32} width={6} height={12} rx={2}
                fill={COLORS.accent}
                transform={`rotate(${angle})`} style={{ transformOrigin: '0px 0px' }} />
            ))}
          </g>

          <text x={220} y={1060} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
            REAL WORLD
          </text>
          <text x={220} y={1110} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Actions have consequences
          </text>
          <text x={220} y={1150} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Bytes written, packets sent, queries run
          </text>
        </g>

        {/* Data flow particle */}
        <circle cx={pX} cy={975} r={3} fill={COLORS.accent} opacity={pOp} />

        {/* ── Bottom insight card ──────────────────────────────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1220} w={960} h={140} />
          <rect x={60} y={1220} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1275} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Tools produce side effects
          </text>
          <text x={100} y={1320} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The model proposes — the tool disposes
          </text>
        </g>

        {/* ── Bottom accent illustration — stacked layers ─────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1400} w={460} h={100} />
          <circle cx={120} cy={1450} r={12} fill={COLORS.accent} opacity={0.15 * pulse} />
          <circle cx={120} cy={1450} r={8} fill={COLORS.accent} opacity={0.3} />
          <text x={150} y={1458} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Input → Process
          </text>

          <BentoCard x={560} y={1400} w={460} h={100} accent />
          <circle cx={620} cy={1450} r={12} fill={COLORS.accent} opacity={0.15 * pulse} />
          <circle cx={620} cy={1450} r={8} fill={COLORS.accent} opacity={0.5} />
          <text x={650} y={1458} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Process → Output
          </text>
        </g>

        {/* Floating micro-animation */}
        <circle cx={540} cy={1580 + breathe} r={4} fill={COLORS.accent} opacity={0.08} />
        <circle cx={300} cy={1620 + breathe * 0.7} r={3} fill={COLORS.accent} opacity={0.06} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
