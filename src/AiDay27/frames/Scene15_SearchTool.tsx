/**
 * Scene 15 — Search Tool
 * "A search tool connects the agent to current information."
 * CSV: 66.080s → 69.060s
 * Duration: 107 frames (3.6s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring-in
 *   Phase 2 (frames 20–70):  Magnifying glass search illustration + result cards
 *   Phase 3 (frames 60–end): Scan line sweep, result shimmer, data particles
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

export const Scene15_SearchTool: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headlineEnt = useSpringEntrance(frame, 6);
  const subEnt = useSpringEntrance(frame, 12);

  // ── Phase 2: Content ───────────────────────────────────────────────────────
  // Magnifying glass card
  const searchCard = useSpringEntrance(frame, 18);
  // Circle draw for magnifying glass
  const glassCircum = Math.PI * 2 * 60;
  const glassOffset = usePathDraw(frame, 20, glassCircum, 20);

  // Handle draw
  const handleLen = 50;
  const handleOffset = usePathDraw(frame, 28, handleLen, 12);

  // Result cards
  const res1 = useSpringEntrance(frame, 30);
  const res2 = useSpringEntrance(frame, 40);
  const res3 = useSpringEntrance(frame, 50);

  // Flow arrow from search to results
  const flowLen = 200;
  const flowOffset = usePathDraw(frame, 34, flowLen, 20);

  // Bottom summary
  const summaryEnt = useSpringEntrance(frame, 55);

  // Connector from AGENT to search
  const agentCard = useSpringEntrance(frame, 14);
  const agentConnLen = 120;
  const agentConn = usePathDraw(frame, 22, agentConnLen, 16);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Scan line sweep
  const scanY = interpolate(frame % 40, [0, 40], [0, 240], { extrapolateRight: 'clamp' });
  const scanOp = interpolate(frame % 40, [0, 10, 30, 40], [0, 0.3, 0.3, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Data particles
  const dp1x = interpolate(frame % 50, [0, 50], [460, 700], { extrapolateRight: 'clamp' });
  const dp1op = interpolate(frame % 50, [0, 10, 40, 50], [0, 0.6, 0.6, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TOOL EXAMPLE 1" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEnt.translateY})`} opacity={headlineEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Search
          </text>
          <text x={430} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}>
            Tool
          </text>
        </g>

        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Connects the agent to current information
          </text>
        </g>

        {/* ── ZONE C ──────────────────────────────────────────────────────── */}

        {/* AGENT card (left side) */}
        <g opacity={agentCard.opacity} transform={`translate(0, ${agentCard.translateY})`}>
          <BentoCard x={60} y={440} w={300} h={120} />
          {/* Robot head icon */}
          <rect x={100} y={470} width={30} height={28} rx={6}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={110} cy={482} r={3} fill={COLORS.accent} />
          <circle cx={120} cy={482} r={3} fill={COLORS.accent} />
          <line x1={108} y1={500} x2={122} y2={500}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={145} y={500} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            AGENT
          </text>
        </g>

        {/* Arrow: agent → search */}
        <path d="M 360,500 L 460,640"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={agentConnLen} strokeDashoffset={agentConn}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Main search illustration card */}
        <g opacity={searchCard.opacity} transform={`translate(0, ${searchCard.translateY})`}>
          <BentoCard x={60} y={600} w={460} h={460} accent />

          {/* Large magnifying glass */}
          <g transform="translate(290, 770)">
            {/* Glass circle — path draw */}
            <circle cx={0} cy={0} r={60}
              fill={COLORS.accent} fillOpacity={0.06}
              stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={glassCircum} strokeDashoffset={glassOffset} />
            {/* Handle */}
            <line x1={42} y1={42} x2={80} y2={80}
              stroke={COLORS.accent} strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={handleLen} strokeDashoffset={handleOffset} />
            {/* Search lines inside glass */}
            <line x1={-25} y1={-12} x2={25} y2={-12}
              stroke={COLORS.accent} strokeWidth={2} opacity={shimmer * 0.5} />
            <line x1={-25} y1={4} x2={15} y2={4}
              stroke={COLORS.accent} strokeWidth={2} opacity={shimmer * 0.4} />
            <line x1={-25} y1={20} x2={20} y2={20}
              stroke={COLORS.accent} strokeWidth={2} opacity={shimmer * 0.3} />
          </g>

          {/* Scan line */}
          <line x1={80} y1={640 + scanY} x2={500} y2={640 + scanY}
            stroke={COLORS.accent} strokeWidth={1} opacity={scanOp} />

          <text x={100} y={950} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            search(query)
          </text>
          <text x={100} y={990} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Live web data retrieval
          </text>
        </g>

        {/* Flow arrow: search → results */}
        <path d="M 530,830 L 560,830"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={flowLen} strokeDashoffset={flowOffset}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Data particle */}
        <circle cx={dp1x} cy={828} r={3} fill={COLORS.accent} opacity={dp1op} />

        {/* Result cards (right side) */}
        <g opacity={res1.opacity} transform={`translate(0, ${res1.translateY})`}>
          <BentoCard x={580} y={600} w={440} h={120} />
          <rect x={580} y={600} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={620} y={648} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Result 1
          </text>
          <text x={620} y={688} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Latest market data...
          </text>
          <circle cx={980} cy={660} r={6} fill={COLORS.accent} opacity={shimmer * 0.4} />
        </g>

        <g opacity={res2.opacity} transform={`translate(0, ${res2.translateY})`}>
          <BentoCard x={580} y={740} w={440} h={120} />
          <rect x={580} y={740} width={6} height={120} rx={3} fill={COLORS.accent} opacity={0.6} />
          <text x={620} y={788} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Result 2
          </text>
          <text x={620} y={828} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Current weather info...
          </text>
          <circle cx={980} cy={800} r={6} fill={COLORS.accent} opacity={shimmer * 0.3} />
        </g>

        <g opacity={res3.opacity} transform={`translate(0, ${res3.translateY})`}>
          <BentoCard x={580} y={880} w={440} h={120} />
          <rect x={580} y={880} width={6} height={120} rx={3} fill={COLORS.accent} opacity={0.4} />
          <text x={620} y={928} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Result 3
          </text>
          <text x={620} y={968} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Real-time news feed...
          </text>
          <circle cx={980} cy={940} r={6} fill={COLORS.accent} opacity={shimmer * 0.2} />
        </g>

        {/* ── Bottom summary ──────────────────────────────────────────────── */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={140} accent />
          <text x={100} y={1175} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Current information
          </text>
          <text x={100} y={1220} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Without search, the agent knows only its training cutoff
          </text>

          {/* Globe mini icon at right */}
          <g transform="translate(940, 1180)">
            <circle cx={0} cy={0} r={20}
              fill="none" stroke={COLORS.accent} strokeWidth={2}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            <ellipse cx={0} cy={0} rx={10} ry={20}
              fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
            <line x1={-20} y1={0} x2={20} y2={0}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          </g>
        </g>

        {/* Extra detail cards */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1300} w={460} h={120} />
          <text x={100} y={1348} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Real-time data
          </text>
          <text x={100} y={1388} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            News, prices, weather
          </text>

          <BentoCard x={560} y={1300} w={460} h={120} />
          <text x={600} y={1348} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Knowledge bridge
          </text>
          <text x={600} y={1388} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Beyond training cutoff
          </text>
        </g>

        {/* Floating particles */}
        <circle cx={200} cy={1500 + breathe} r={3} fill={COLORS.accent} opacity={0.08} />
        <circle cx={880} cy={1550 + breathe * 0.8} r={2.5} fill={COLORS.accent} opacity={0.06} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
