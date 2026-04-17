/**
 * Scene 11 — Three Different Sets
 * "Three different sets of information."
 * CSV: 38.800s → 40.540s
 * Duration: ~83 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–80): Data set cards with expanding fields
 *   Phase 3 (70–end): Breathe / pulse
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene11_ThreeSetsOfInfo: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const set1 = useSpringEntrance(frame, 20);
  const set2 = useSpringEntrance(frame, 32);
  const set3 = useSpringEntrance(frame, 44);
  const summaryEnt = useSpringEntrance(frame, 56);

  const connLen = 120;
  const conn1 = usePathDraw(frame, 36, connLen, 20);
  const conn2 = usePathDraw(frame, 48, connLen, 20);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  const dataSets = [
    { label: 'Set A', fields: ['passengerId', 'routeId'], w: 960, accent: false },
    { label: 'Set B', fields: ['passengerId', 'routeId', 'seatClass'], w: 960, accent: false },
    { label: 'Set C', fields: ['passengerId', 'routeId', 'seatClass', 'concessionType'], w: 960, accent: true },
  ];
  const setEnts = [set1, set2, set3];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="DATA SETS · COMPARISON" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Three Sets
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            of Information
          </text>
        </g>

        {/* Three data set rows */}
        {dataSets.map((ds, i) => {
          const ent = setEnts[i];
          const cardY = 440 + i * 280;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={240} accent={ds.accent} />
              {/* Set label */}
              <text x={100} y={cardY + 50}
                fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
                {ds.label}
              </text>
              {/* Field pills */}
              {ds.fields.map((fld, fi) => {
                const pillX = 100 + fi * 210;
                const pillY = cardY + 80;
                return (
                  <g key={fi}>
                    <rect x={pillX} y={pillY} width={190} height={55} rx={12}
                      fill={fi >= dataSets[0].fields.length && i > 0
                        ? COLORS.accent_dim : COLORS.bg_primary}
                      stroke={fi >= dataSets[0].fields.length && i > 0
                        ? COLORS.accent : 'rgba(255,255,255,0.15)'}
                      strokeWidth={fi >= dataSets[0].fields.length && i > 0 ? 2 : 1} />
                    <text x={pillX + 95} y={pillY + 36} textAnchor="middle"
                      fontFamily="'Fira Code', monospace" fontSize={18} fontWeight={500}
                      fill={fi >= dataSets[0].fields.length && i > 0 ? COLORS.accent : COLORS.text_muted}>
                      {fld}
                    </text>
                  </g>
                );
              })}
              {/* Field count badge */}
              <circle cx={960} cy={cardY + 120} r={30}
                fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={960} y={cardY + 130} textAnchor="middle"
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
                {ds.fields.length}
              </text>
              {/* Growing bar */}
              <rect x={100} y={cardY + 170} width={ds.fields.length * 200} height={12} rx={6}
                fill={COLORS.accent} opacity={0.25} />
              <rect x={100} y={cardY + 170}
                width={ds.fields.length * 200 * ent.progress} height={12} rx={6}
                fill={COLORS.accent} opacity={0.7} />
            </g>
          );
        })}

        {/* Vertical connectors */}
        <path d={`M 540,${440 + 240} L 540,${440 + 280}`}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connLen} strokeDashoffset={conn1}
          markerEnd="url(#arrow)" />
        <path d={`M 540,${720 + 240} L 540,${720 + 280}`}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connLen} strokeDashoffset={conn2}
          markerEnd="url(#arrow)" />

        {/* Summary */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={140} accent />
          <rect x={60} y={1320} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1400}
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Each set is a
            <tspan fill={COLORS.accent} fontStyle="italic"> different signature</tspan>
          </text>
        </g>

        {/* Floating circles */}
        {[160, 400, 680, 920].map((x, i) => (
          <circle key={i} cx={x} cy={1560 + breathe * (1 + i * 0.15)}
            r={10 + i * 3} fill={COLORS.accent} fillOpacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${x}px 1560px` }} />
        ))}

        {/* Bottom track lines */}
        <line x1={60} y1={1660} x2={1020} y2={1660}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.12} />
        <line x1={60} y1={1678} x2={1020} y2={1678}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.12} />
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={70 + i * 44} y={1660} width={6} height={18} rx={1}
            fill={COLORS.text_muted} opacity={0.08} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
