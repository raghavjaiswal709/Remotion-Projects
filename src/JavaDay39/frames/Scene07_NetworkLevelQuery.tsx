/**
 * Scene 07 — Network Level Query
 * "This is a network-level query. No specific station object is needed. No instance has to exist."
 * CSV: 34.040s → 42.080s | Duration: 241 frames
 * Animation: Phase 1 reveal → Phase 2 network vs instance → Phase 3 micro pulse
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

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return len * (1 - p);
}

export const Scene07_NetworkLevelQuery: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 46);

  // Network map lines
  const lineLen = 400;
  const lines = [0, 1, 2, 3, 4].map(i => usePathDraw(frame, 35 + i * 5, lineLen, 25));

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  // Station positions for network map
  const stations = [
    { cx: 540, cy: 760, lbl: 'HQ', main: true },
    { cx: 260, cy: 680, lbl: 'A', main: false },
    { cx: 820, cy: 680, lbl: 'B', main: false },
    { cx: 200, cy: 900, lbl: 'C', main: false },
    { cx: 540, cy: 980, lbl: 'D', main: false },
    { cx: 880, cy: 900, lbl: 'E', main: false },
  ];

  const edges = [[0, 1], [0, 2], [0, 4], [1, 3], [2, 5]];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="NETWORK-LEVEL · NO INSTANCE" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={310} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>Network-Level</text>
        </g>
        <g opacity={headB.opacity} transform={`translate(0,${headB.translateY})`}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>Query</text>
        </g>

        {/* Network Map */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={470} w={960} h={620} accent />

          {/* Edges with path draw */}
          {edges.map((e, i) => {
            const s = stations[e[0]], t = stations[e[1]];
            return (
              <line key={i} x1={s.cx} y1={s.cy} x2={t.cx} y2={t.cy}
                stroke={COLORS.accent} strokeWidth={2} strokeDasharray={lineLen} strokeDashoffset={lines[i]} opacity={0.6} />
            );
          })}

          {/* Station nodes */}
          {stations.map((s, i) => {
            const ent = useSpringEntrance(frame, 25 + i * 5);
            return (
              <g key={i} opacity={ent.opacity}>
                <circle cx={s.cx} cy={s.cy} r={s.main ? 42 : 30}
                  fill={s.main ? COLORS.accent : COLORS.bg_primary}
                  fillOpacity={s.main ? 0.2 : 1}
                  stroke={COLORS.accent} strokeWidth={s.main ? 3 : 2} />
                <text x={s.cx} y={s.cy + 10} textAnchor="middle"
                  fontFamily={FONT} fontSize={s.main ? 32 : 24} fontWeight={800}
                  fill={s.main ? COLORS.accent : COLORS.text_muted}>{s.lbl}</text>
              </g>
            );
          })}
        </g>

        {/* Two key cards */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={200} />
          <text x={80} y={1190} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>NO OBJECT</text>
          <text x={80} y={1250} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>No station needed</text>
        </g>
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={200} accent />
          <text x={580} y={1190} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>NO INSTANCE</text>
          <text x={580} y={1250} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>Class-level access</text>
        </g>

        {/* Bottom takeaway */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={120} accent />
          <text x={540} y={1436} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Query the entire network directly
          </text>
        </g>

        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent} strokeWidth={1.5} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
