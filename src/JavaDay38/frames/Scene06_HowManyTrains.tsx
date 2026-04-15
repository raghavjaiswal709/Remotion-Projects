/**
 * Scene 06 — How Many Trains
 * "How many trains are currently active across the entire network?"
 * CSV: 30.580s → 35.100s
 * Duration: 135 frames (4.5s)
 *
 * Animation phases:
 *   Phase 1 (0–20):  Question headline springs in
 *   Phase 2 (15–70): Network map with station nodes + train icons
 *   Phase 3 (60–end): Counter question pulse
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

const STATIONS = [
  { x: 200, y: 700, name: 'DEL' },
  { x: 540, y: 580, name: 'JAI' },
  { x: 860, y: 700, name: 'MUM' },
  { x: 300, y: 920, name: 'BLR' },
  { x: 700, y: 960, name: 'CHE' },
  { x: 540, y: 1120, name: 'KOL' },
];

const ROUTES = [
  [0, 1], [1, 2], [0, 3], [2, 4], [3, 5], [4, 5], [1, 4],
];

export const Scene06_HowManyTrains: React.FC = () => {
  const frame = useCurrentFrame();

  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 4);
  const mapCard  = useSpringEntrance(frame, 12);

  const stationEntrances = STATIONS.map((_, i) => useSpringEntrance(frame, 18 + i * 5));

  // Route path draws
  const routeDraws = ROUTES.map((_, i) => {
    const routeLen = 400;
    return usePathDraw(frame, 28 + i * 4, routeLen, 20);
  });

  // Phase 3
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const breathe = Math.sin(frame * 0.05) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.7, 1]);

  // Train blips moving along routes
  const trainPositions = [0, 2, 5].map((routeIdx, i) => {
    const route = ROUTES[routeIdx];
    const s1 = STATIONS[route[0]];
    const s2 = STATIONS[route[1]];
    const t = (Math.sin(frame * 0.03 + i * 2) + 1) / 2;
    return {
      x: s1.x + (s2.x - s1.x) * t,
      y: s1.y + (s2.y - s1.y) * t,
    };
  });

  const questionCard = useSpringEntrance(frame, 50);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="NETWORK OVERVIEW" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            How Many Trains?
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Active across the entire network
          </text>
        </g>

        {/* ZONE C — Network map */}
        <g opacity={mapCard.opacity} transform={`translate(0, ${mapCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={740} accent />

          {/* Routes */}
          {ROUTES.map(([a, b], i) => {
            const s1 = STATIONS[a];
            const s2 = STATIONS[b];
            const routeLen = 400;
            return (
              <line key={`r${i}`}
                x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
                stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.3}
                strokeDasharray={routeLen}
                strokeDashoffset={routeDraws[i]} />
            );
          })}

          {/* Station nodes */}
          {STATIONS.map((s, i) => {
            const e = stationEntrances[i];
            return (
              <g key={i} opacity={e.opacity} transform={`translate(0, ${e.translateY * 0.5})`}>
                <circle cx={s.x} cy={s.y} r={28} fill={COLORS.bg_primary}
                  stroke={COLORS.accent} strokeWidth={2.5} />
                <text x={s.x} y={s.y + 6} textAnchor="middle"
                  fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.white}>
                  {s.name}
                </text>
              </g>
            );
          })}

          {/* Train blips */}
          {trainPositions.map((pos, i) => (
            <g key={`t${i}`} opacity={mapCard.opacity * shimmer}>
              <circle cx={pos.x} cy={pos.y} r={10}
                fill={COLORS.accent} />
              <circle cx={pos.x} cy={pos.y} r={16}
                fill="none" stroke={COLORS.accent} strokeWidth={1.5}
                opacity={0.4 + Math.sin(frame * 0.1 + i) * 0.3} />
            </g>
          ))}
        </g>

        {/* Question card */}
        <g opacity={questionCard.opacity} transform={`translate(0, ${questionCard.translateY + breathe})`}>
          <BentoCard x={120} y={1290} w={840} h={180} accent />
          <text x={540} y={1370} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 1370px' }}>
            TOTAL = ?
          </text>
          <text x={540} y={1430} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            One number for the whole network
          </text>
        </g>

        {/* Bottom decorative dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={`d${i}`} cx={300 + i * 120} cy={1560}
            r={3} fill={COLORS.accent}
            opacity={0.2 + Math.sin(frame * 0.06 + i * 0.8) * 0.15} />
        ))}

        <g opacity={questionCard.opacity}>
          <BentoCard x={60} y={1600} w={960} h={100} />
          <text x={540} y={1664} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            This number belongs to no single train object
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
