/**
 * Scene 19 — TextInOut
 * "Text in, text out, done."
 * CSV: 53.220s → 54.600s
 * Duration: 41 frames (1.37s)
 *
 * Animation phases:
 *   Phase 1 (0–12): headline snap
 *   Phase 2 (8–28): text→model→text pipeline
 *   Phase 3 (25–end): micro
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene19_TextInOut: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);

  // Per-word snap for "Text in, text out, done."
  const words = ['Text in,', 'text out,', 'done.'];
  const wordSprings = words.map((_, i) => {
    const f2 = Math.max(0, frame - 2 - i * 4);
    const sp = spring({ frame: f2, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [28, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  // Pipeline: INPUT → MODEL → OUTPUT
  const inputBox = useSpringEntrance(frame, 8);
  const modelBox = useSpringEntrance(frame, 12);
  const outputBox = useSpringEntrance(frame, 16);

  const arrow1Len = 120;
  const arrow1Dash = usePathDraw(frame, 12, arrow1Len, 10);
  const arrow2Len = 120;
  const arrow2Dash = usePathDraw(frame, 16, arrow2Len, 10);

  // "DONE" stamp
  const doneStamp = useSpringEntrance(frame, 22);

  // Detail card
  const card1 = useSpringEntrance(frame, 20);

  const breathe = Math.sin(frame * 0.07) * 3;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.01;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 + frame * 0.015;
    const r = 200 + Math.sin(frame * 0.02 + i) * 15;
    return { x: 540 + Math.cos(a) * r, y: 800 + Math.sin(a) * r * 0.3 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        {/* Per-word headline */}
        {words.map((w, i) => (
          <text key={i} x={60 + i * 330} y={340} opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={i === 2 ? COLORS.vibrant_red : COLORS.white}>{w}</text>
        ))}

        {/* Pipeline: INPUT → MODEL → OUTPUT */}
        <g opacity={inputBox.opacity} transform={`translate(0, ${inputBox.translateY})`}>
          <rect x={80} y={520} width={260} height={120} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={210} y={588} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>TEXT IN</text>
        </g>

        <path d="M 340,580 L 410,580" fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        <g opacity={modelBox.opacity} transform={`translate(0, ${modelBox.translateY})`}>
          <rect x={410} y={520} width={260} height={120} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text x={540} y={588} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>MODEL</text>
        </g>

        <path d="M 670,580 L 740,580" fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        <g opacity={outputBox.opacity} transform={`translate(0, ${outputBox.translateY})`}>
          <rect x={740} y={520} width={260} height={120} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={870} y={588} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>TEXT OUT</text>
        </g>

        {/* DONE stamp */}
        <g opacity={doneStamp.opacity} transform={`translate(540, ${740 + doneStamp.translateY})`}>
          <rect x={-120} y={-40} width={240} height={80} rx={16}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} />
          <text x={0} y={18} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.vibrant_red}>DONE</text>
        </g>

        {/* Summary card */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={860} w={960} h={200} />
          <rect x={60} y={860} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={920} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>ONE-SHOT EXECUTION</text>
          <text x={100} y={960} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>No loop, no tools, no memory</text>
          <text x={100} y={1000} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Single pass — input in, output out, finished</text>
          <text x={100} y={1036} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>The model cannot act on its own</text>
        </g>

        {/* Second summary */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={100} accent />
          <text x={540} y={1163} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            This is why the <tspan fill={COLORS.accent} fontStyle="italic">runtime</tspan> matters
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.text_muted} opacity={0.04 * shimmer} />
        ))}

        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill={COLORS.text_muted} opacity={0.03} />
          <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.text_muted} strokeWidth={1}
            opacity={0.08} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
