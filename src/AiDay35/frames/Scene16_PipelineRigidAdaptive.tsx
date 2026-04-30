/**
 * Scene 16 — Pipeline Rigid, Agent Adaptive
 * "The pipeline is rigid, the agent is adaptive."
 * CSV: 61.380s → 65.090s | Duration: 111 frames (3.70s)
 *
 * Theme: Dark #0D0D0D + teal accent
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–26):  "Rigid vs Adaptive" headline
 *   Phase 2 (frames 24–82): Left RIGID card, Right ADAPTIVE card
 *   Phase 3 (frames 78–end): VS divider draws, stamps pop in
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

export const Scene16_PipelineRigidAdaptive: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE  = useSpringEntrance(frame, 0);
  const headE   = useSpringEntrance(frame, 5);

  // Phase 2
  const rigidE   = useSpringEntrance(frame, 18);
  const adaptE   = useSpringEntrance(frame, 26);
  const rigidLns = usePathDraw(frame, 24, 340, 22);
  const adaptLns = usePathDraw(frame, 32, 340, 22);

  // Phase 3
  const vsDivider = usePathDraw(frame, 40, 800, 22);
  const rigidStamp = useSpringSnap(frame, 58);
  const adaptStamp = useSpringSnap(frame, 68);
  const insightE   = useSpringEntrance(frame, 78);

  const breathe = Math.sin(frame * 0.09) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · DESIGN PHILOSOPHY" y={120} opacity={0.8} />
        </g>

        {/* Headline */}
        <g opacity={headE.opacity} transform={`translate(0,${headE.translateY})`}>
          <text x={540} y={270} textAnchor="middle"
            fontFamily={FONT} fontSize={74} fontWeight={800}
            fill={COLORS.white}>Pipeline vs Agent</text>
        </g>

        {/* VS divider line */}
        <line x1={540} y1={340} x2={540} y2={1140}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.4}
          strokeDasharray={800} strokeDashoffset={vsDivider} />
        <text x={540} y={740} textAnchor="middle"
          fontFamily={FONT} fontSize={44} fontWeight={800}
          fill={COLORS.accent}
          opacity={interpolate(frame, [44, 60], [0, 1], { extrapolateRight: 'clamp' })}>VS</text>

        {/* LEFT — RIGID */}
        <g opacity={rigidE.opacity} transform={`translate(0,${rigidE.translateY})`}>
          <rect x={40} y={340} width={460} height={760} rx={20}
            fill={COLORS.bg_secondary}
            stroke="rgba(247,55,79,0.45)" strokeWidth={2} />

          <text x={270} y={402} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.vibrant_red}>PIPELINE</text>

          {/* locked bar */}
          <line x1={80} y1={430} x2={460} y2={430}
            stroke="rgba(247,55,79,0.3)" strokeWidth={1}
            strokeDasharray={340} strokeDashoffset={rigidLns} />

          {/* 3 locked step chips */}
          {['Step 1', 'Step 2', 'Step 3'].map((s, i) => (
            <g key={i}>
              <rect x={80} y={460 + i * 100} width={360} height={72} rx={12}
                fill="rgba(247,55,79,0.1)"
                stroke="rgba(247,55,79,0.4)" strokeWidth={1.5} />
              <text x={260} y={502 + i * 100} textAnchor="middle"
                fontFamily={FONT} fontSize={30} fontWeight={800}
                fill="rgba(255,255,255,0.6)">{s}</text>
              {/* lock icon */}
              <rect x={402} y={476 + i * 100} width={20} height={18} rx={4}
                fill="none" stroke="rgba(247,55,79,0.6)" strokeWidth={2} />
              <path d={`M410,476 A8,10 0 0,1 418,476`}
                fill="none" stroke="rgba(247,55,79,0.6)" strokeWidth={2} />
            </g>
          ))}

          {/* Traits below */}
          {['Fixed order', 'No branching', 'Pre-designed path'].map((t, i) => (
            <g key={i}>
              <circle cx={90} cy={788 + i * 48} r={5}
                fill="rgba(247,55,79,0.6)" />
              <text x={106} y={794 + i * 48}
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill="rgba(255,255,255,0.55)">{t}</text>
            </g>
          ))}
        </g>

        {/* RIGID stamp */}
        <g transform={`scale(${rigidStamp.scale})`}
          style={{ transformOrigin: '270px 1100px' }}
          opacity={rigidStamp.opacity}>
          <rect x={105} y={1080} width={330} height={52} rx={8}
            fill="rgba(247,55,79,0.2)"
            stroke="rgba(247,55,79,0.8)" strokeWidth={2} />
          <text x={270} y={1114} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.12em">RIGID</text>
        </g>

        {/* RIGHT — ADAPTIVE */}
        <g opacity={adaptE.opacity} transform={`translate(0,${adaptE.translateY + breathe * 0.4})`}>
          <rect x={580} y={340} width={460} height={760} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />

          <text x={810} y={402} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.accent}>AGENT</text>

          {/* flowing path */}
          <path d="M 620,440 Q 810,480 730,540 Q 640,600 810,660 Q 900,700 810,740"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeOpacity={0.7}
            strokeDasharray={340} strokeDashoffset={adaptLns}
            strokeLinecap="round" />

          {/* adaptive trait chips */}
          {['Reads output', 'Chooses next step', 'Dynamic branching'].map((t, i) => (
            <g key={i}>
              <rect x={620} y={460 + i * 100} width={380} height={72} rx={12}
                fill={COLORS.accent} fillOpacity={0.1}
                stroke={COLORS.accent} strokeOpacity={0.4} strokeWidth={1.5} />
              <text x={810} y={502 + i * 100} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.white}>{t}</text>
            </g>
          ))}

          {['Responsive', 'Self-directing', 'Runtime decisions'].map((t, i) => (
            <g key={i}>
              <circle cx={630} cy={788 + i * 48} r={5} fill={COLORS.accent} fillOpacity={0.7} />
              <text x={646} y={794 + i * 48}
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill="rgba(255,255,255,0.75)">{t}</text>
            </g>
          ))}
        </g>

        {/* ADAPTIVE stamp */}
        <g transform={`scale(${adaptStamp.scale})`}
          style={{ transformOrigin: '810px 1100px' }}
          opacity={adaptStamp.opacity}>
          <rect x={625} y={1080} width={370} height={52} rx={8}
            fill={COLORS.accent} fillOpacity={0.18}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={810} y={1114} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">ADAPTIVE</text>
        </g>

        {/* Bottom insight */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={1168} w={960} h={94} />
          <rect x={60} y={1168} width={6} height={94} rx={3} fill={COLORS.accent} />
          <text x={100} y={1210} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>Rigidity is a feature until requirements change.</text>
          <text x={100} y={1244} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>Adaptability is required when they do.</text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
