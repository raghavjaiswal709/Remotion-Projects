/**
 * Scene 15 — Code Before Objects
 * "But what about the code that runs before any object is ever created, before any constructor even fires?"
 * CSV: 78.260s → 85.160s | Duration: 207 frames
 * Animation: Phase 1 headline → Phase 2 timeline → Phase 3 question pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 25) {
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return len * (1 - p);
}

export const Scene15_CodeBeforeObjects: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 40);
  const card3 = useSpringEntrance(frame, 54);

  // Timeline line draw
  const timelineLen = 900;
  const timelineDraw = usePathDraw(frame, 26, timelineLen, 35);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.03;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="QUESTION · BEFORE OBJECTS" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={310} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>What runs</text>
        </g>
        <g opacity={headB.opacity} transform={`translate(0,${headB.translateY})`}>
          <text x={60} y={410} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent} fontStyle="italic">before any object?</text>
        </g>

        {/* Timeline illustration */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={420} accent />

          {/* Horizontal timeline */}
          <line x1={120} y1={720} x2={1000} y2={720} stroke={COLORS.accent} strokeWidth={3} strokeDasharray={timelineLen} strokeDashoffset={timelineDraw} />

          {/* Mystery zone - left */}
          <rect x={120} y={560} width={280} height={120} rx={16} fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2} strokeDasharray="6,4" />
          <text x={260} y={618} textAnchor="middle" fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent} transform={`scale(${pulse})`} style={{ transformOrigin: '260px 610px' }}>???</text>
          <text x={260} y={660} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>BEFORE</text>

          {/* Timeline dot 1 */}
          <circle cx={260} cy={720} r={10} fill={COLORS.accent} />
          <text x={260} y={760} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>Class loaded</text>

          {/* Constructor zone - middle */}
          <rect x={460} y={560} width={220} height={120} rx={16} fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          <text x={570} y={620} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Constructor</text>
          <text x={570} y={655} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>fires</text>
          <circle cx={570} cy={720} r={8} fill={COLORS.text_muted} />

          {/* Objects zone - right */}
          <rect x={740} y={560} width={220} height={120} rx={16} fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          <text x={850} y={620} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Objects</text>
          <text x={850} y={655} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>created</text>
          <circle cx={850} cy={720} r={8} fill={COLORS.text_muted} />

          {/* Time arrow */}
          <text x={560} y={810} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>TIME {'>>'}</text>
        </g>

        {/* Key question cards */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={940} w={460} h={140} />
          <text x={290} y={1010} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>Before constructor</text>
          <text x={290} y={1052} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>No new keyword yet</text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={560} y={940} w={460} h={140} />
          <text x={790} y={1010} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>Before objects</text>
          <text x={790} y={1052} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>No instance exists</text>
        </g>

        {/* Bottom tease */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={120} accent />
          <text x={540} y={1196} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Something must run first...
          </text>
        </g>

        <g transform={`translate(540, ${1370 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
