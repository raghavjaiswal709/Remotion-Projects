/**
 * Scene 02 — ToolCallingRecap
 * "Last day, we learned how tool calling works."
 * CSV: 5.200s → 8.020s
 * Duration: 85 frames (2.82s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline spring in
 *   Phase 2 (15–60): Recap bento card with tool calling diagram
 *   Phase 3 (50–end): Floating micro-anims
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene02_ToolCallingRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headlineEnt = useSpringEntrance(frame, 6);
  const subEnt = useSpringEntrance(frame, 12);

  // ── Phase 2: Tool calling diagram ──────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 30);
  const card3 = useSpringEntrance(frame, 42);

  // Diagram nodes
  const modelNode = useSpringEntrance(frame, 20);
  const specNode = useSpringEntrance(frame, 32);
  const execNode = useSpringEntrance(frame, 44);

  // Arrows
  const arrow1Len = 140;
  const arrow1Dash = usePathDraw(frame, 28, arrow1Len, 20);
  const arrow2Len = 140;
  const arrow2Dash = usePathDraw(frame, 40, arrow2Len, 20);

  // ── Phase 3: Micro ─────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Border draw on main card
  const mainPerim = 2 * (960 + 700);
  const mainDash = usePathDraw(frame, 18, mainPerim, 35);

  // ── Floating particles ─────────────────────────────────────────────────────
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + frame * 0.015;
    const r = 60 + Math.sin(frame * 0.04 + i * 0.8) * 15;
    return {
      x: 540 + Math.cos(angle) * (380 + r),
      y: 1000 + Math.sin(angle) * (200 + r * 0.5),
      op: 0.15 + Math.sin(frame * 0.05 + i) * 0.1,
      size: 2 + (i % 3),
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · TOOL USE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEnt.translateY})`} opacity={headlineEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Last Day
          </text>
        </g>
        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            Tool Calling
          </text>
        </g>

        {/* ── ZONE C — Main diagram card ────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={700} accent />
          <rect x={60} y={480} width={960} height={700} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={mainPerim} strokeDashoffset={mainDash} />

          {/* Model Node */}
          <g opacity={modelNode.opacity} transform={`translate(0, ${modelNode.translateY})`}>
            <rect x={140} y={560} width={280} height={120} rx={20}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
            <text x={280} y={632} textAnchor="middle"
              fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
              MODEL
            </text>
          </g>

          {/* Arrow 1: Model → Spec */}
          <line x1={420} y1={620} x2={560} y2={620}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
            markerEnd="url(#arrow)" />

          {/* Spec Node */}
          <g opacity={specNode.opacity} transform={`translate(0, ${specNode.translateY})`}>
            <rect x={560} y={560} width={280} height={120} rx={20}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
            <text x={700} y={620} textAnchor="middle"
              fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
              TOOL SPEC
            </text>
            <text x={700} y={658} textAnchor="middle"
              fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
              (JSON)
            </text>
          </g>

          {/* Arrow 2: Spec → Execute */}
          <line x1={700} y1={680} x2={700} y2={800}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
            markerEnd="url(#arrow)" />

          {/* Execute Node */}
          <g opacity={execNode.opacity} transform={`translate(0, ${execNode.translateY})`}>
            <rect x={540} y={800} width={320} height={120} rx={20}
              fill={COLORS.bg_primary} stroke={COLORS.vibrant_red} strokeWidth={2} />
            <text x={700} y={872} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
              EXECUTE
            </text>
          </g>

          {/* Question mark — "Something else?" */}
          <g opacity={execNode.opacity * shimmer}>
            <text x={700} y={990} textAnchor="middle"
              fontFamily={FONT} fontSize={64} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic">
              What executes it?
            </text>
          </g>

          {/* Dashed box around execute area */}
          <rect x={480} y={770} width={440} height={390} rx={16}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray="8,8" opacity={execNode.opacity * 0.3} />
        </g>

        {/* ── Bottom recap cards ─────────────────────────────────────────── */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1220} w={460} h={160} />
          <text x={100} y={1308} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Model decides
          </text>
        </g>
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1220} w={460} h={160} accent />
          <text x={600} y={1308} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            ??? executes
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={COLORS.accent} opacity={p.op} />
        ))}

        {/* ── Gear illustration ──────────────────────────────────────────── */}
        <g transform={`translate(280, ${1560 + breathe})`} opacity={card1.opacity * 0.6}>
          <circle cx={0} cy={0} r={50} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} opacity={0.2} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <rect key={i} x={-6} y={-60} width={12} height={20} rx={3}
                fill={COLORS.accent} opacity={0.5}
                transform={`rotate(${(a * 180) / Math.PI})`}
                style={{ transformOrigin: '0px 0px' }} />
            );
          })}
        </g>

        {/* Second gear */}
        <g transform={`translate(800, ${1580 + breathe * 0.7})`} opacity={card1.opacity * 0.4}>
          <circle cx={0} cy={0} r={35} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={0} cy={0} r={14} fill={COLORS.accent} opacity={0.15} />
        </g>

        {/* ── CAPTION ───────────────────────────────────────────────────── */}
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
