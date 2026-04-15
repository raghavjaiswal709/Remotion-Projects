/**
 * Scene 02 — Static Variable Recap
 * "Last day, we learned how a static variable belongs to the class, one shared value across every object."
 * CSV: 6.460s → 14.060s | Duration: 228 frames
 * Animation: Phase 1 label+headline → Phase 2 class box + shared var diagram → Phase 3 pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return len * (1 - p);
}

export const Scene02_StaticVarRecap: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 48);

  // connections
  const connLen = 180;
  const conn1 = usePathDraw(frame, 55, connLen, 25);
  const conn2 = usePathDraw(frame, 60, connLen, 25);
  const conn3 = usePathDraw(frame, 65, connLen, 25);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="RECAP · DAY 38" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>Static Variable</text>
        </g>
        <g opacity={headB.opacity} transform={`translate(0,${headB.translateY})`}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>Belongs to the Class</text>
        </g>

        {/* Class box — central */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={260} y={460} w={560} h={260} accent />
          <rect x={260} y={460} width={560} height={60} rx={20} fill={COLORS.accent} opacity={0.15} />
          <text x={540} y={505} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>Train (Class)</text>
          <text x={300} y={580} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>static int totalActiveTrains</text>
          <text x={300} y={630} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>= 1 shared value</text>
          <circle cx={540} cy={680} r={18} fill={COLORS.accent} opacity={0.3 + 0.15 * Math.sin(frame * 0.1)} />
        </g>

        {/* Instance objects */}
        {[{ lbl: 'train1', ox: 100, oy: 840 }, { lbl: 'train2', ox: 400, oy: 840 }, { lbl: 'train3', ox: 700, oy: 840 }].map((obj, i) => {
          const ent = useSpringEntrance(frame, 40 + i * 10);
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0,${ent.translateY})`}>
              <BentoCard x={obj.ox} y={obj.oy} w={260} h={160} />
              <text x={obj.ox + 130} y={obj.oy + 60} textAnchor="middle" fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>{obj.lbl}</text>
              <text x={obj.ox + 130} y={obj.oy + 110} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Instance</text>
            </g>
          );
        })}

        {/* Connector lines from class to instances */}
        <line x1={380} y1={720} x2={230} y2={840} stroke={COLORS.accent} strokeWidth={2} strokeDasharray={connLen} strokeDashoffset={conn1} />
        <line x1={540} y1={720} x2={540} y2={840} stroke={COLORS.accent} strokeWidth={2} strokeDasharray={connLen} strokeDashoffset={conn2} />
        <line x1={700} y1={720} x2={830} y2={840} stroke={COLORS.accent} strokeWidth={2} strokeDasharray={connLen} strokeDashoffset={conn3} />

        {/* "SHARED" label */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={140} accent />
          <text x={540} y={1170} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            ONE SHARED VALUE
          </text>
        </g>

        {/* Visual recap — static keyword */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1250} w={460} h={200} />
          <text x={80} y={1320} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>Keyword</text>
          <text x={80} y={1380} fontFamily={MONO} fontSize={40} fontWeight={500} fill={COLORS.accent} fontStyle="italic">static</text>
        </g>
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={560} y={1250} w={460} h={200} />
          <text x={580} y={1320} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>Scope</text>
          <text x={580} y={1380} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>Class-level</text>
        </g>

        {/* Floating element */}
        <g transform={`translate(540, ${1570 + breathe})`}>
          <circle cx={0} cy={0} r={36} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.accent} strokeWidth={1.5} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s02.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
