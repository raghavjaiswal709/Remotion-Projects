/**
 * Scene 02 — RecapRuntime
 * "Last day, we learned what an agent runtime is."
 * CSV: 5.360s → 8.480s
 * Duration: ~94 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + headline spring in
 *   Phase 2 (frames 20–80):  Runtime loop diagram with path-draw connectors
 *   Phase 3 (frames 60–end): Gear rotation, pulse rings, floating particles
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

export const Scene02_RecapRuntime: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);
  const nodeModel = useSpringEntrance(frame, 25);
  const nodeLoop  = useSpringEntrance(frame, 37);
  const nodeTools = useSpringEntrance(frame, 49);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const connectorLen = 180;
  const conn1Dash = usePathDraw(frame, 35, connectorLen, 20);
  const conn2Dash = usePathDraw(frame, 47, connectorLen, 20);
  const loopArcLen = 500;
  const loopArcDash = usePathDraw(frame, 55, loopArcLen, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 4;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.8, 1]);
  const gearRot  = frame * 1.2;
  const floatY   = Math.sin(frame * 0.05) * 5;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 5 · AGENT RUNTIME" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headlines ────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Agent
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}>
            Runtime
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={450} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Yesterday's concept — the execution engine
          </text>
        </g>

        {/* ── ZONE C — Runtime loop diagram ─────────────────────────────── */}

        {/* Model node */}
        <g opacity={nodeModel.opacity} transform={`translate(0, ${nodeModel.translateY})`}>
          <BentoCard x={60} y={540} w={300} h={160} accent />
          {/* Gear icon */}
          <g transform={`translate(210, 620) rotate(${gearRot})`} style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              return (
                <line key={i}
                  x1={Math.cos(angle) * 20} y1={Math.sin(angle) * 20}
                  x2={Math.cos(angle) * 30} y2={Math.sin(angle) * 30}
                  stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
                />
              );
            })}
          </g>
          <text x={100} y={600} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            MODEL
          </text>
          <text x={100} y={645} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            LLM Core
          </text>
        </g>

        {/* Connector 1: Model → Loop */}
        <path
          d="M 360,620 L 420,620"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connectorLen} strokeDashoffset={conn1Dash}
          markerEnd="url(#arrow)"
        />

        {/* Loop node */}
        <g opacity={nodeLoop.opacity} transform={`translate(0, ${nodeLoop.translateY})`}>
          <BentoCard x={420} y={540} w={300} h={160} accent />
          {/* Circular arrow icon */}
          <path
            d={`M 570,580 A 25,25 0 1,1 545,605`}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round"
            opacity={shimmer}
          />
          <polygon points="543,598 543,612 555,605" fill={COLORS.accent} opacity={shimmer} />
          <text x={460} y={645} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            LOOP
          </text>
          <text x={460} y={685} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Think → Act → Observe
          </text>
        </g>

        {/* Connector 2: Loop → Tools */}
        <path
          d="M 720,620 L 780,620"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connectorLen} strokeDashoffset={conn2Dash}
          markerEnd="url(#arrow)"
        />

        {/* Tools node */}
        <g opacity={nodeTools.opacity} transform={`translate(0, ${nodeTools.translateY})`}>
          <BentoCard x={780} y={540} w={240} h={160} accent />
          <text x={820} y={620} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            TOOLS
          </text>
          <text x={820} y={660} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            External
          </text>
        </g>

        {/* Feedback loop arc (Tools → Model) */}
        <path
          d="M 900,700 C 900,850 180,850 180,700"
          fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.5}
          strokeDasharray={loopArcLen} strokeDashoffset={loopArcDash}
          strokeLinecap="round"
        />

        {/* ── Summary cards below diagram ────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={800} w={960} h={160} />
          <rect x={60} y={800} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={870} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The runtime wraps the model
          </text>
          <text x={100} y={920} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Code that orchestrates every cycle of the agent loop
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={990} w={460} h={180} />
          <text x={100} y={1065} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Executes
          </text>
          <text x={100} y={1110} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Think → Act → Observe
          </text>
          <BentoCard x={560} y={990} w={460} h={180} accent />
          <text x={600} y={1065} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Manages
          </text>
          <text x={600} y={1110} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            State + Memory + Tools
          </text>
        </g>

        {/* ── Decorative elements ────────────────────────────────────────── */}
        {/* Floating signal dots */}
        <g opacity={interpolate(frame, [50, 70], [0, 0.4], { extrapolateRight: 'clamp' })}>
          <circle cx={150} cy={1300 + floatY} r={4} fill={COLORS.accent} opacity={0.5} />
          <circle cx={930} cy={1280 + breathe} r={3} fill={COLORS.accent} opacity={0.4} />
          <circle cx={540} cy={1350 + floatY * 0.8} r={5} fill={COLORS.accent} opacity={0.3} />
        </g>

        {/* Pulse ring on loop node */}
        <circle
          cx={570} cy={620}
          r={interpolate(frame, [35, 80], [20, 80], { extrapolateRight: 'clamp' })}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={interpolate(frame, [35, 80], [0.35, 0], { extrapolateRight: 'clamp' })}
        />

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
