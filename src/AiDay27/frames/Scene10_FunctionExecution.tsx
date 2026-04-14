/**
 * Scene 10 — Function Execution
 * "It runs the actual function and returns the result
 *  as the next observation."
 * CSV: 41.080s → 45.860s
 * Duration: 161 frames (5.4s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring, "EXECUTION" pop
 *   Phase 2 (frames 20–100): Execution pipeline flow (call → function → result → observation) with path-draw
 *   Phase 3 (frames 80–end): Gear rotation, data flow shimmer, observation pulse
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

// Gear tooth path generator
function gearPath(cx: number, cy: number, outerR: number, innerR: number, teeth: number): string {
  const parts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.8) / teeth) * Math.PI * 2;
    parts.push(
      `${i === 0 ? 'M' : 'L'} ${cx + Math.cos(a1) * innerR},${cy + Math.sin(a1) * innerR}`,
      `L ${cx + Math.cos(a2) * outerR},${cy + Math.sin(a2) * outerR}`,
      `L ${cx + Math.cos(a3) * outerR},${cy + Math.sin(a3) * outerR}`,
      `L ${cx + Math.cos(a4) * innerR},${cy + Math.sin(a4) * innerR}`,
    );
  }
  parts.push('Z');
  return parts.join(' ');
}

export const Scene10_FunctionExecution: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 14);

  // ── Phase 2: Execution pipeline ────────────────────────────────────────────
  const callNode = useSpringEntrance(frame, 22);
  const funcNode = useSpringEntrance(frame, 34);
  const resultNode = useSpringEntrance(frame, 48);
  const obsNode = useSpringEntrance(frame, 60);

  // Vertical arrow draws (connecting pipeline steps)
  const arrowLen = 80;
  const arrow1 = usePathDraw(frame, 30, arrowLen, 15);
  const arrow2 = usePathDraw(frame, 44, arrowLen, 15);
  const arrow3 = usePathDraw(frame, 56, arrowLen, 15);

  // Gear border draw
  const gearPerim = 400;
  const gearDraw = usePathDraw(frame, 36, gearPerim, 25);

  // Bottom cards
  const bottomLeft = useSpringEntrance(frame, 70);
  const bottomRight = useSpringEntrance(frame, 80);
  const summaryCard = useSpringEntrance(frame, 90);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const gearRotation = frame * 1.2;
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const dataPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.4, 0.9]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="EXECUTION PIPELINE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Runs The
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Actual Function
          </text>
        </g>

        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={470} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Result returns as the next observation
          </text>
        </g>

        {/* ── ZONE C — Vertical pipeline ──────────────────────────────────── */}

        {/* LEFT COLUMN — Pipeline steps */}

        {/* Step 1: Tool Call */}
        <g opacity={callNode.opacity} transform={`translate(0, ${callNode.translateY})`}>
          <BentoCard x={60} y={530} w={580} h={120} />
          <circle cx={110} cy={590} r={24} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={110} y={597} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>1</text>
          <text x={160} y={580} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            TOOL CALL
          </text>
          <text x={160} y={622} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            search(&quot;latest AI&quot;)
          </text>
        </g>

        {/* Arrow 1 down */}
        <line x1={350} y1={660} x2={350} y2={710}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow1}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Step 2: Function Executes */}
        <g opacity={funcNode.opacity} transform={`translate(0, ${funcNode.translateY})`}>
          <BentoCard x={60} y={720} w={580} h={160} accent />
          <circle cx={110} cy={800} r={24} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={110} y={807} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>2</text>
          <text x={160} y={785} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            FUNCTION EXECUTES
          </text>
          <text x={160} y={830} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Real work happens — API call, file read, etc.
          </text>
          {/* Progress indicator */}
          <rect x={160} y={850} width={440} height={6} rx={3} fill="rgba(255,255,255,0.08)" />
          <rect x={160} y={850}
            width={interpolate(frame, [40, 70], [0, 440], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            height={6} rx={3} fill={COLORS.accent} opacity={dataPulse} />
        </g>

        {/* Arrow 2 down */}
        <line x1={350} y1={890} x2={350} y2={940}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow2}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Step 3: Result Returns */}
        <g opacity={resultNode.opacity} transform={`translate(0, ${resultNode.translateY})`}>
          <BentoCard x={60} y={950} w={580} h={120} />
          <circle cx={110} cy={1010} r={24} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={110} y={1017} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>3</text>
          <text x={160} y={1000} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            RESULT RETURNS
          </text>
          <text x={160} y={1040} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Data flows back to the agent
          </text>
        </g>

        {/* Arrow 3 down */}
        <line x1={350} y1={1080} x2={350} y2={1130}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow3}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Step 4: Observation */}
        <g opacity={obsNode.opacity} transform={`translate(0, ${obsNode.translateY})`}>
          <BentoCard x={60} y={1140} w={580} h={120} accent />
          <circle cx={110} cy={1200} r={24} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={110} y={1207} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>4</text>
          <text x={160} y={1190} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            OBSERVATION
          </text>
          <text x={160} y={1232} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Model receives the result
          </text>
        </g>

        {/* RIGHT COLUMN — Gear illustration */}
        <g opacity={funcNode.opacity} transform={`translate(0, ${funcNode.translateY})`}>
          <g transform={`translate(830, 780) rotate(${gearRotation})`}
            style={{ transformOrigin: '0px 0px' }}>
            {/* Main gear */}
            <path d={gearPath(0, 0, 80, 60, 8)}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={gearPerim} strokeDashoffset={gearDraw} />
            {/* Inner circle */}
            <circle cx={0} cy={0} r={28}
              fill={COLORS.accent} fillOpacity={0.08}
              stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Center dot */}
            <circle cx={0} cy={0} r={8} fill={COLORS.accent} opacity={0.5 * shimmer} />
          </g>

          {/* Small gear */}
          <g transform={`translate(920, 890) rotate(${-gearRotation * 1.4})`}
            style={{ transformOrigin: '0px 0px' }}>
            <path d={gearPath(0, 0, 36, 26, 6)}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
            <circle cx={0} cy={0} r={10}
              fill={COLORS.accent} fillOpacity={0.06}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
          </g>

          {/* "WORK" label near gear */}
          <text x={830} y={920} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.6 * shimmer}>
            ACTUAL WORK
          </text>
        </g>

        {/* Right side mini cards */}
        <g opacity={resultNode.opacity} transform={`translate(0, ${resultNode.translateY})`}>
          <BentoCard x={680} y={980} w={340} h={140} />
          {/* Eye icon for observation */}
          <g transform={`translate(730, 1050)`}>
            <path d="M -20,0 C -20,-14 -8,-26 0,-26 C 8,-26 20,-14 20,0 C 20,14 8,26 0,26 C -8,26 -20,14 -20,0 Z"
              fill="none" stroke={COLORS.accent} strokeWidth={2}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            <circle cx={0} cy={0} r={7} fill={COLORS.accent} opacity={0.6} />
          </g>
          <text x={770} y={1040} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Result becomes
          </text>
          <text x={770} y={1080} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            next observation
          </text>
        </g>

        {/* ── Bottom summary card ──────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1310} w={460} h={160} />
          <text x={100} y={1380} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The cycle:
          </text>
          <text x={100} y={1430} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Think → Call → Execute → Observe
          </text>
        </g>

        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1310} w={460} h={160} accent />
          <text x={600} y={1380} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Key Insight
          </text>
          <text x={600} y={1430} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Tool returns feed the loop
          </text>
        </g>

        {/* Floating dots */}
        <circle cx={120} cy={1540} r={3} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={960} cy={1560} r={2.5} fill={COLORS.accent} opacity={0.12 * shimmer} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
