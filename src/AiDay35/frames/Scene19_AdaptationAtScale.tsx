/**
 * Scene 19 — Adaptation at Scale
 * "An adaptation at scale requires something the pipeline never needs."
 * CSV: 72.820s → 77.020s | Duration: 126 frames (4.20s)
 *
 * Theme: Dark #0D0D0D + teal accent
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–26):  "AT SCALE" big badge + headline
 *   Phase 2 (frames 24–80): Two-line chart — pipeline flat, agent curve grows
 *   Phase 3 (frames 74–end): "requires something" badge + never needs contrast
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

function useSpringSnap(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_SNAP });
  const opacity  = interpolate(f, [0, 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const scale    = interpolate(progress, [0, 1], [0.65, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene19_AdaptationAtScale: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE    = useSpringEntrance(frame, 0);
  const atScaleE  = useSpringSnap(frame, 4);
  const headE     = useSpringEntrance(frame, 12);

  // Phase 2 — chart draws
  const axisLine    = usePathDraw(frame, 22, 680, 20);
  const pipeFlatLine = usePathDraw(frame, 28, 680, 30);
  const agentCurve  = usePathDraw(frame, 34, 800, 38);
  const chartLabels = useSpringEntrance(frame, 60);

  // Phase 3
  const requiresBadge = useSpringSnap(frame, 74);
  const neverNeedsE   = useSpringEntrance(frame, 82);
  const insightE      = useSpringEntrance(frame, 94);

  const breathe = Math.sin(frame * 0.07) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  // Chart coords
  const CHART_X = 80, CHART_Y = 1020, CHART_W = 680, CHART_H = 280;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · SCALE" y={120} opacity={0.8} />
        </g>

        {/* AT SCALE badge */}
        <g transform={`scale(${atScaleE.scale})`}
          style={{ transformOrigin: '540px 204px' }}
          opacity={atScaleE.opacity}>
          <rect x={220} y={160} width={640} height={88} rx={16}
            fill={COLORS.accent} fillOpacity={0.16}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={540} y={218} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">AT SCALE</text>
        </g>

        {/* Headline */}
        <g opacity={headE.opacity} transform={`translate(0,${headE.translateY})`}>
          <text x={60} y={322} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>An adaptation requires something</text>
          <text x={60} y={378} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.text_muted}>the pipeline never needs.</text>
        </g>

        {/* "requires something" badge */}
        <g transform={`scale(${requiresBadge.scale})`}
          style={{ transformOrigin: '540px 458px' }}
          opacity={requiresBadge.opacity}>
          <rect x={290} y={420} width={500} height={70} rx={12}
            fill='rgba(118,171,174,0.18)'
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={465} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>requires MEMORY + CONTEXT</text>
        </g>

        {/* Never needs contrast */}
        <g opacity={neverNeedsE.opacity} transform={`translate(0,${neverNeedsE.translateY})`}>
          <rect x={60} y={516} width={960} height={66} rx={14}
            fill="rgba(247,55,79,0.1)"
            stroke="rgba(247,55,79,0.35)" strokeWidth={1.5} />
          <text x={540} y={556} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill="rgba(255,255,255,0.55)">Pipeline never needs these — it never adapts.</text>
        </g>

        {/* Chart area */}
        {/* Y-axis label */}
        <text x={CHART_X - 10} y={CHART_Y - 14}
          fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.text_muted} textAnchor="middle"
          opacity={chartLabels.opacity}>Complexity</text>

        {/* X-axis */}
        <line x1={CHART_X} y1={CHART_Y + CHART_H}
          x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H}
          stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
          strokeDasharray={680} strokeDashoffset={axisLine} />
        {/* Y-axis */}
        <line x1={CHART_X} y1={CHART_Y}
          x2={CHART_X} y2={CHART_Y + CHART_H}
          stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
          strokeDasharray={280} strokeDashoffset={usePathDraw(frame, 22, 280, 20)} />

        {/* Pipeline — flat line */}
        <path
          d={`M ${CHART_X},${CHART_Y + CHART_H - 30}
              L ${CHART_X + CHART_W},${CHART_Y + CHART_H - 30}`}
          fill="none" stroke="rgba(247,55,79,0.7)" strokeWidth={3}
          strokeDasharray={680} strokeDashoffset={pipeFlatLine}
          strokeLinecap="round" />

        {/* Agent — rising curve */}
        <path
          d={`M ${CHART_X},${CHART_Y + CHART_H - 30}
              C ${CHART_X + 200},${CHART_Y + CHART_H - 60}
                ${CHART_X + 400},${CHART_Y + CHART_H - 160}
                ${CHART_X + CHART_W},${CHART_Y + 24}`}
          fill="none" stroke={COLORS.accent} strokeWidth={3.5}
          strokeDasharray={800} strokeDashoffset={agentCurve}
          strokeLinecap="round" />

        {/* Chart legend */}
        <g opacity={chartLabels.opacity} transform={`translate(0,${breathe * 0.3})`}>
          <circle cx={CHART_X + CHART_W - 160} cy={CHART_Y + CHART_H - 34}
            r={5} fill="rgba(247,55,79,0.8)" />
          <text x={CHART_X + CHART_W - 150} y={CHART_Y + CHART_H - 28}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill="rgba(247,55,79,0.8)">Pipeline</text>

          <circle cx={CHART_X + CHART_W - 140} cy={CHART_Y + 36}
            r={5} fill={COLORS.accent} />
          <text x={CHART_X + CHART_W - 130} y={CHART_Y + 42}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>Agent</text>

          {/* X-axis label */}
          <text x={CHART_X + CHART_W / 2} y={CHART_Y + CHART_H + 40}
            textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Task size →</text>
        </g>

        {/* Bottom insight */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={98} />
          <rect x={60} y={1340} width={6} height={98} rx={3} fill={COLORS.accent} />
          <text x={100} y={1385} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>Scale reveals what's missing in the pipeline.</text>
          <text x={100} y={1422} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>Memory and context are the agent's advantage.</text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
