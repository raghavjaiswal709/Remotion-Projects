/**
 * Scene 12 — Agent Decides
 * "An agent decides its own sequence at runtime based on what it observes."
 * CSV: 43.150s → 48.350s | Duration: 156 frames (5.20s)
 *
 * Theme: Dark #0D0D0D + teal accent
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   "AGENT" hero text slams in, "decides" sub-line fades
 *   Phase 2 (frames 28–90):  Decision tree builds: centre → 3 paths, "RUNTIME" badge
 *   Phase 3 (frames 80–end): Branch pulse, eye-scan micro-anim
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

export const Scene12_AgentDecides: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE  = useSpringEntrance(frame, 0);
  const heroE   = useSpringSnap(frame, 4);
  const subE    = useSpringEntrance(frame, 14);
  const runtimeBadge = useSpringSnap(frame, 22);

  // Phase 2 — decision tree
  const rootE   = useSpringEntrance(frame, 30);
  const branch1 = useSpringEntrance(frame, 40);
  const branch2 = useSpringEntrance(frame, 50);
  const branch3 = useSpringEntrance(frame, 60);
  const arrow1  = usePathDraw(frame, 36, 120, 18);
  const arrow2  = usePathDraw(frame, 46, 140, 18);
  const arrow3  = usePathDraw(frame, 56, 160, 18);

  // Phase 3
  const breathe  = Math.sin(frame * 0.08) * 4;
  const eyeScan  = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.6, 1.0]);
  const glow     = 1 + Math.sin(frame * 0.10) * 0.030;
  const insightE = useSpringEntrance(frame, 80);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · AGENT" y={120} opacity={0.8} />
        </g>

        {/* Hero — AGENT */}
        <g transform={`scale(${heroE.scale})`}
          style={{ transformOrigin: '60px 280px' }}
          opacity={heroE.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={148} fontWeight={800}
            fill={COLORS.accent}>
            AGENT
          </text>
        </g>

        <g opacity={subE.opacity} transform={`translate(0,${subE.translateY})`}>
          <text x={60} y={390} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.white}>
            decides its own sequence
          </text>
        </g>

        {/* RUNTIME badge */}
        <g transform={`scale(${runtimeBadge.scale})`}
          style={{ transformOrigin: '540px 470px' }}
          opacity={runtimeBadge.opacity}>
          <rect x={200} y={445} width={680} height={58} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.15}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={540} y={486} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.18em">
            AT RUNTIME · BASED ON WHAT IT OBSERVES
          </text>
        </g>

        {/* Decision tree root — OBSERVE */}
        <g opacity={rootE.opacity} transform={`translate(0,${rootE.translateY + breathe})`}>
          <rect x={380} y={570} width={320} height={100} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5} />

          {/* Eye icon in root */}
          <ellipse cx={490} cy={622} rx={18} ry={12} fill="none"
            stroke={COLORS.accent} strokeWidth={2} opacity={eyeScan} />
          <circle cx={490} cy={622} r={6} fill={COLORS.accent} opacity={eyeScan} />

          <text x={526} y={628} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent}>OBSERVE</text>
        </g>

        {/* Branch paths */}
        {/* Arrow 1 — left */}
        <line x1={430} y1={670} x2={230} y2={800}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={120} strokeDashoffset={arrow1}
          markerEnd="url(#arrow)" opacity={rootE.opacity} />

        {/* Arrow 2 — centre */}
        <line x1={540} y1={670} x2={540} y2={800}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={140} strokeDashoffset={arrow2}
          markerEnd="url(#arrow)" opacity={rootE.opacity} />

        {/* Arrow 3 — right */}
        <line x1={650} y1={670} x2={840} y2={800}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={160} strokeDashoffset={arrow3}
          markerEnd="url(#arrow)" opacity={rootE.opacity} />

        {/* Branch 1 — Retry path */}
        <g opacity={branch1.opacity} transform={`translate(0,${branch1.translateY})`}>
          <rect x={100} y={800} width={270} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} />
          <text x={235} y={846} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.text_muted}>Retry</text>
          <text x={235} y={882} textAnchor="middle" fontFamily={FONT}
            fontSize={26} fontWeight={800} fill={COLORS.text_muted}>search query</text>
        </g>

        {/* Branch 2 — Proceed */}
        <g opacity={branch2.opacity} transform={`translate(0,${branch2.translateY})`}>
          <rect x={400} y={800} width={280} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={846} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.accent}>Proceed</text>
          <text x={540} y={882} textAnchor="middle" fontFamily={FONT}
            fontSize={26} fontWeight={800} fill={COLORS.text_muted}>to next step</text>
        </g>

        {/* Branch 3 — Pivot */}
        <g opacity={branch3.opacity} transform={`translate(0,${branch3.translateY})`}>
          <rect x={720} y={800} width={260} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} />
          <text x={850} y={846} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.text_muted}>Pivot</text>
          <text x={850} y={882} textAnchor="middle" fontFamily={FONT}
            fontSize={26} fontWeight={800} fill={COLORS.text_muted}>to new approach</text>
        </g>

        {/* "DECIDES" floating indicator */}
        <g transform={`translate(540, ${970 + breathe * -1})`}
          opacity={branch1.opacity}>
          <rect x={-160} y={-28} width={320} height={56} rx={12}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>
            Agent decides ← runtime
          </text>
        </g>

        {/* Big contrast card pair */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          {/* Left — pipeline */}
          <BentoCard x={60} y={1050} w={440} h={180} />
          <rect x={60} y={1050} width={6} height={180} rx={3}
            fill={COLORS.vibrant_red} />
          <text x={100} y={1106} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>Pipeline</text>
          <text x={100} y={1148} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.vibrant_red}>Designed</text>
          <text x={100} y={1186} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>before execution</text>

          {/* Right — agent */}
          <BentoCard x={540} y={1050} w={480} h={180} accent />
          <rect x={540} y={1050} width={6} height={180} rx={3}
            fill={COLORS.accent} />
          <text x={580} y={1106} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>Agent</text>
          <text x={580} y={1148} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>Decides</text>
          <text x={580} y={1186} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>during execution</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
