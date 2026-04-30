/**
 * Scene 05 — Agent vs Pipeline Difference
 * "The difference between an agent and a pipeline."
 * CSV: 19.950s → 23.117s | Duration: 95 frames (3.17s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–24):   "THE DIFFERENCE" badge pops in, headline springs up
 *   Phase 2 (frames 18–72):  Two cards reveal side by side — AGENT (teal) | PIPELINE (muted)
 *   Phase 3 (frames 60–end): VS badge pulses, subtle breathing on cards
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

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

export const Scene05_AgentPipelineDiff: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE   = useSpringEntrance(frame, 0);
  const badgeE   = useSpringEntrance(frame, 4);
  const headE    = useSpringEntrance(frame, 10);

  // Phase 2 — two cards
  const agentE    = useSpringEntrance(frame, 18);
  const pipelineE = useSpringEntrance(frame, 28);
  const vsE       = useSpringEntrance(frame, 36);

  // Insight card
  const insightE = useSpringEntrance(frame, 52);

  // Phase 3
  const pulse  = 1 + Math.sin(frame * 0.10) * 0.018;
  const breathe= Math.sin(frame * 0.08) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · CORE CONCEPTS" y={120} opacity={0.8} />
        </g>

        {/* THE DIFFERENCE badge */}
        <g opacity={badgeE.opacity} transform={`translate(0,${badgeE.translateY})`}>
          <rect x={60} y={138} width={280} height={46} rx={10}
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={200} y={169} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>THE DIFFERENCE</text>
        </g>

        {/* ZONE B — Headline */}
        <g opacity={headE.opacity} transform={`translate(0,${headE.translateY})`}>
          <text x={60} y={310} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Agent
          </text>
          <text x={60} y={408} fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.text_muted}>vs.</text>
          <text x={60} y={498} fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent}>Pipeline</text>
        </g>

        {/* ZONE C — Two side-by-side cards */}
        {/* AGENT card */}
        <g opacity={agentE.opacity} transform={`translate(0, ${agentE.translateY + breathe})`}>
          <rect x={60} y={560} width={450} height={580} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Header stripe */}
          <rect x={60} y={560} width={450} height={72} rx={20}
            fill={COLORS.accent} fillOpacity={0.18} />
          <rect x={60} y={596} width={450} height={36} fill={COLORS.accent} fillOpacity={0.18} />
          <text x={285} y={608} textAnchor="middle" fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}>AGENT</text>
          {/* Icon — circular arrow (adaptive) */}
          <circle cx={285} cy={760} r={80} fill="none" stroke={COLORS.accent}
            strokeWidth={3} strokeDasharray="12 8" />
          <text x={285} y={775} textAnchor="middle" fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} transform={`scale(${pulse})`}
            style={{ transformOrigin: '285px 760px' }}>A</text>
          <text x={285} y={920} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>Adaptive</text>
          <text x={285} y={958} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>decides at runtime</text>
          <text x={285} y={1096} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>runtime</text>
        </g>

        {/* VS badge */}
        <g opacity={vsE.opacity} transform={`translate(540, ${840 + vsE.translateY})`}>
          <circle cx={0} cy={0} r={44}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>VS</text>
        </g>

        {/* PIPELINE card */}
        <g opacity={pipelineE.opacity} transform={`translate(0, ${pipelineE.translateY - breathe * 0.7})`}>
          <rect x={570} y={560} width={450} height={580} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          {/* Header stripe */}
          <rect x={570} y={560} width={450} height={72} rx={20}
            fill="rgba(255,255,255,0.06)" />
          <rect x={570} y={596} width={450} height={36} fill="rgba(255,255,255,0.06)" />
          <text x={795} y={608} textAnchor="middle" fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.white}>PIPELINE</text>
          {/* Icon — locked chain */}
          <rect x={735} y={710} width={120} height={50} rx={10}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2.5} />
          <line x1={755} y1={710} x2={755} y2={688} stroke={COLORS.text_muted} strokeWidth={2.5} />
          <line x1={815} y1={710} x2={815} y2={688} stroke={COLORS.text_muted} strokeWidth={2.5} />
          <path d="M 755,688 Q 785,660 815,688" fill="none" stroke={COLORS.text_muted} strokeWidth={2.5} />
          <text x={795} y={920} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>Rigid</text>
          <text x={795} y={958} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>fixed in advance</text>
        </g>

        {/* Insight card */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={1186} w={960} h={100} accent />
          <rect x={60} y={1186} width={6} height={100} rx={3} fill={COLORS.accent} />
          <text x={100} y={1246} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Core distinction: when decisions happen
          </text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
