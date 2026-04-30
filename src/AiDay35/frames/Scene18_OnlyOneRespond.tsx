/**
 * Scene 18 — Only One Can Respond
 * "only one can respond to what it actually finds along the way."
 * CSV: 67.720s → 72.820s | Duration: 123 frames (4.10s ... rounded to cover)
 *
 * Theme: Dark #0D0D0D + teal accent
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–28):  "ONLY ONE" headline builds word by word
 *   Phase 2 (frames 26–82): Fork diagram — pipeline marches straight, agent pivots
 *   Phase 3 (frames 76–end): X badge on pipeline path, checkmark on agent path
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
  const scale    = interpolate(progress, [0, 1], [0.6, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene18_OnlyOneRespond: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1 — word by word
  const labelE = useSpringEntrance(frame, 0);
  const w1 = useSpringSnap(frame, 4);
  const w2 = useSpringSnap(frame, 10);
  const w3 = useSpringSnap(frame, 16);
  const subE = useSpringEntrance(frame, 20);

  // Fork node
  const forkE   = useSpringEntrance(frame, 26);
  const pipeLine = usePathDraw(frame, 30, 300, 22);
  const agentLine = usePathDraw(frame, 36, 300, 22);
  const pipeEndE  = useSpringEntrance(frame, 52);
  const agentEndE = useSpringEntrance(frame, 60);

  // Outcome badges
  const xBadge    = useSpringSnap(frame, 70);
  const checkBadge = useSpringSnap(frame, 78);
  const insightE   = useSpringEntrance(frame, 88);

  const breathe = Math.sin(frame * 0.08) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · KEY DIFFERENCE" y={120} opacity={0.8} />
        </g>

        {/* Word-by-word headline */}
        <g transform={`scale(${w1.scale})`} style={{ transformOrigin: '104px 232px' }}
          opacity={w1.opacity}>
          <text x={60} y={250} fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.white}>Only</text>
        </g>
        <g transform={`scale(${w2.scale})`} style={{ transformOrigin: '370px 232px' }}
          opacity={w2.opacity}>
          <text x={284} y={250} fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.accent}>one</text>
        </g>
        <g transform={`scale(${w3.scale})`} style={{ transformOrigin: '750px 232px' }}
          opacity={w3.opacity}>
          <text x={500} y={250} fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.white}>can</text>
        </g>

        <g opacity={subE.opacity} transform={`translate(0,${subE.translateY})`}>
          <text x={60} y={320} fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.text_muted}>respond to what it finds along the way</text>
        </g>

        {/* Fork STEP 1 box at top of diagram */}
        <g opacity={forkE.opacity} transform={`translate(0,${forkE.translateY})`}>
          <rect x={370} y={390} width={340} height={80} rx={14}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={436} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>Step 1 Result</text>
          <text x={540} y={460} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>↓ fork</text>
        </g>

        {/* Pipeline path — arrow goes straight onto Step 2 ignoring result */}
        <path d="M 540,470 L 220,700"
          fill="none" stroke="rgba(247,55,79,0.6)" strokeWidth={2.5}
          strokeDasharray={300} strokeDashoffset={pipeLine}
          markerEnd="url(#arrow)" />
        <g opacity={pipeEndE.opacity} transform={`translate(0,${pipeEndE.translateY})`}>
          <rect x={40} y={700} width={360} height={100} rx={14}
            fill="rgba(247,55,79,0.1)" stroke="rgba(247,55,79,0.5)" strokeWidth={1.5} />
          <text x={220} y={742} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill="rgba(255,255,255,0.7)">Pipeline: continues</text>
          <text x={220} y={776} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.vibrant_red}>ignores the finding</text>
        </g>

        {/* Agent path — arrow pivots based on finding */}
        <path d="M 540,470 L 860,700"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={300} strokeDashoffset={agentLine}
          markerEnd="url(#arrow)" />
        <g opacity={agentEndE.opacity}
          transform={`translate(0,${agentEndE.translateY + breathe * 0.5})`}>
          <rect x={680} y={700} width={360} height={100} rx={14}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.8} />
          <text x={860} y={742} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>Agent: reads result</text>
          <text x={860} y={776} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>adjusts next action</text>
        </g>

        {/* X badge on pipeline side */}
        <g transform={`scale(${xBadge.scale})`}
          style={{ transformOrigin: '220px 832px' }}
          opacity={xBadge.opacity}>
          <circle cx={220} cy={832} r={32}
            fill="rgba(247,55,79,0.2)" stroke={COLORS.vibrant_red} strokeWidth={2.5} />
          <line x1={208} y1={820} x2={232} y2={844}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <line x1={232} y1={820} x2={208} y2={844}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Check badge on agent side */}
        <g transform={`scale(${checkBadge.scale})`}
          style={{ transformOrigin: '860px 832px' }}
          opacity={checkBadge.opacity}>
          <circle cx={860} cy={832} r={32}
            fill={COLORS.accent} fillOpacity={0.18}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <path d="M 847,832 L 857,843 L 875,820"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Insight */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={910} w={960} h={118} />
          <rect x={60} y={910} width={6} height={118} rx={3} fill={COLORS.accent} />
          <text x={100} y={958} fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.white}>The agent responds to findings.</text>
          <text x={100} y={1004} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>The pipeline does not — it never reads its own output.</text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
