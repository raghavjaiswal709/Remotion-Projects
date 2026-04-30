/**
 * Scene 11 — Pipeline Same Steps
 * "the pipeline executes the same steps in the same order."
 * CSV: 39.150s → 43.150s | Duration: 120 frames (4.00s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–28):   "SAME · STEPS · SAME · ORDER" marches in word by word
 *   Phase 2 (frames 24–80):  Heavy chain diagram (3 locked step nodes) builds
 *   Phase 3 (frames 75–end): Chain clinks — scale pulse on links, repeating arrow blink
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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
  const scale    = interpolate(progress, [0, 1], [0.7, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene11_PipelineSameSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1 — word by word
  const labelE = useSpringEntrance(frame, 0);
  const word1 = useSpringSnap(frame, 6);
  const word2 = useSpringSnap(frame, 13);
  const word3 = useSpringSnap(frame, 20);

  // Phase 2 — chain
  const node1 = useSpringEntrance(frame, 28);
  const node2 = useSpringEntrance(frame, 40);
  const node3 = useSpringEntrance(frame, 52);
  const link1 = usePathDraw(frame, 34, 100, 16);
  const link2 = usePathDraw(frame, 46, 100, 16);

  // Phase 3
  const pulse   = 1 + Math.sin(frame * 0.10) * 0.022;
  const breathe = Math.sin(frame * 0.07) * 3;
  const insightE = useSpringEntrance(frame, 68);
  const blinkOp = interpolate(Math.sin(frame * 0.14), [-1, 1], [0.5, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  const NODE_Y = 780;
  const NODE_W = 240;
  const NODE_H = 220;
  const NODE_X = [80, 420, 760];
  const nodeLabels = ['Search', 'Read', 'Summarize'];
  const nodeEnters = [node1, node2, node3];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · PIPELINE" y={120} opacity={0.8} />
        </g>

        {/* Word-by-word headline */}
        <g transform={`translate(60, 220) scale(${word1.scale})`}
          style={{ transformOrigin: '60px 220px' }}
          opacity={word1.opacity}>
          <text fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.white}>
            Same
          </text>
        </g>
        <g transform={`translate(60, 340) scale(${word2.scale})`}
          style={{ transformOrigin: '60px 340px' }}
          opacity={word2.opacity}>
          <text fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.accent}>
            Steps.
          </text>
        </g>
        <g transform={`translate(60, 460) scale(${word3.scale})`}
          style={{ transformOrigin: '60px 460px' }}
          opacity={word3.opacity}>
          <text fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.text_muted}>
            Same Order.
          </text>
        </g>

        {/* Divider */}
        <line x1={60} y1={510} x2={1020} y2={510}
          stroke={COLORS.accent_mid} strokeWidth={1} opacity={word3.opacity * 0.4}
          strokeDasharray={960} strokeDashoffset={usePathDraw(frame, 24, 960, 26)} />

        {/* Chain nodes */}
        {nodeLabels.map((label, i) => {
          const ne  = nodeEnters[i];
          const nx  = NODE_X[i];
          return (
            <g key={i}
              opacity={ne.opacity}
              transform={`translate(0, ${ne.translateY + breathe * (i % 2 === 0 ? 1 : -1)})`}>

              {/* Node card */}
              <rect x={nx} y={NODE_Y} width={NODE_W} height={NODE_H} rx={20}
                fill={COLORS.bg_secondary}
                stroke={i === 0 ? COLORS.accent : 'rgba(255,255,255,0.18)'}
                strokeWidth={i === 0 ? 2 : 1.5} />

              {/* Lock icon */}
              <rect x={nx + NODE_W - 54} y={NODE_Y + 16} width={30} height={24} rx={5}
                fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
              <rect x={nx + NODE_W - 54} y={NODE_Y + 28} width={30} height={20} rx={3}
                fill={COLORS.text_muted} fillOpacity={0.3} />
              <path d={`M ${nx + NODE_W - 50},${NODE_Y + 28} Q ${nx + NODE_W - 39},${NODE_Y + 10} ${nx + NODE_W - 28},${NODE_Y + 28}`}
                fill="none" stroke={COLORS.text_muted} strokeWidth={2} />

              <text x={nx + NODE_W / 2} y={NODE_Y + 90} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
                {`Step ${i + 1}`}
              </text>
              <text x={nx + NODE_W / 2} y={NODE_Y + 148} textAnchor="middle"
                fontFamily={FONT} fontSize={40} fontWeight={800}
                fill={i === 0 ? COLORS.accent : COLORS.white}>{label}</text>
              
              {/* "ALWAYS" stamp at bottom */}
              <text x={nx + NODE_W / 2} y={NODE_Y + NODE_H - 22} textAnchor="middle"
                fontFamily={FONT} fontSize={22} fontWeight={800}
                fill={COLORS.vibrant_red} fillOpacity={0.7}>ALWAYS</text>
            </g>
          );
        })}

        {/* Chain links (arrows) */}
        <g opacity={node1.opacity * blinkOp}>
          <line x1={NODE_X[0] + NODE_W} y1={NODE_Y + NODE_H / 2}
            x2={NODE_X[1]} y2={NODE_Y + NODE_H / 2}
            stroke={COLORS.text_muted} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={100} strokeDashoffset={link1}
            markerEnd="url(#arrow)" />
        </g>
        <g opacity={node2.opacity * blinkOp}>
          <line x1={NODE_X[1] + NODE_W} y1={NODE_Y + NODE_H / 2}
            x2={NODE_X[2]} y2={NODE_Y + NODE_H / 2}
            stroke={COLORS.text_muted} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={100} strokeDashoffset={link2}
            markerEnd="url(#arrow)" />
        </g>

        {/* Insight card */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={1060} w={960} h={130} accent />
          <rect x={60} y={1060} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={1114} fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.white}>No runtime decisions</text>
          <text x={100} y={1160} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>output does not change the path</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
