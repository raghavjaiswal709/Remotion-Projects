/**
 * Scene 10 — Three Different Scenarios
 * "Three different scenarios."
 * CSV: 36.880s → 38.180s
 * Duration: ~71 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–80): Three scenario cards side by side
 *   Phase 3 (70–end): Pulse arrows
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene10_ThreeScenarios: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);

  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 30);
  const card3 = useSpringEntrance(frame, 42);

  const num1Spr = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_SNAP });
  const num2Spr = spring({ frame: Math.max(0, frame - 32), fps, config: SPRING_SNAP });
  const num3Spr = spring({ frame: Math.max(0, frame - 44), fps, config: SPRING_SNAP });

  const connLen = 160;
  const conn1 = usePathDraw(frame, 52, connLen, 20);
  const conn2 = usePathDraw(frame, 56, connLen, 20);

  const summaryEnt = useSpringEntrance(frame, 60);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  const scenarios = [
    { num: 1, fields: 2, params: 'id, route', color: COLORS.text_muted },
    { num: 2, fields: 3, params: 'id, route, seat', color: COLORS.accent },
    { num: 3, fields: 4, params: 'id, route, seat, conc.', color: COLORS.white },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OVERLOADING · OVERVIEW" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Three Scenarios
          </text>
        </g>

        {/* Three cards */}
        {scenarios.map((sc, i) => {
          const ent = [card1, card2, card3][i];
          const numSpr = [num1Spr, num2Spr, num3Spr][i];
          const cardX = 60 + i * 320 + i * 20;
          const cardW = 300;
          const numScale = interpolate(numSpr, [0, 1], [0.5, 1]);
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={cardX} y={440} w={cardW} h={700} accent={i === 1} />
              {/* Big number */}
              <text x={cardX + cardW / 2} y={620} textAnchor="middle"
                fontFamily={FONT} fontSize={160} fontWeight={800} fill={COLORS.accent}
                opacity={0.15}
                transform={`scale(${numScale})`}
                style={{ transformOrigin: `${cardX + cardW / 2}px 620px` }}>
                {sc.num}
              </text>
              <text x={cardX + cardW / 2} y={620} textAnchor="middle"
                fontFamily={FONT} fontSize={120} fontWeight={800} fill={sc.color}
                transform={`scale(${numScale})`}
                style={{ transformOrigin: `${cardX + cardW / 2}px 620px` }}>
                {sc.num}
              </text>
              {/* Scenario label */}
              <text x={cardX + cardW / 2} y={720} textAnchor="middle"
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
                Scenario {sc.num}
              </text>
              {/* Fields count */}
              <rect x={cardX + 40} y={760} width={cardW - 80} height={50} rx={12}
                fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={cardX + cardW / 2} y={793} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
                {sc.fields} fields
              </text>
              {/* Param list */}
              <text x={cardX + cardW / 2} y={870} textAnchor="middle"
                fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500} fill={COLORS.text_muted}>
                {sc.params}
              </text>
              {/* Field blocks */}
              {Array.from({ length: sc.fields }, (_, fi) => (
                <rect key={fi} x={cardX + 40 + fi * 58} y={920} width={50} height={50} rx={8}
                  fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
              ))}
              <text x={cardX + cardW / 2} y={1020} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                {sc.fields === 2 ? 'Minimal' : sc.fields === 3 ? 'Extended' : 'Full'}
              </text>
            </g>
          );
        })}

        {/* Connectors between cards */}
        <path d="M 380,780 L 400,780"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connLen} strokeDashoffset={conn1}
          markerEnd="url(#arrow)" />
        <path d="M 700,780 L 720,780"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connLen} strokeDashoffset={conn2}
          markerEnd="url(#arrow)" />

        {/* Summary card */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={160} accent />
          <rect x={60} y={1200} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1270} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Same action, different
          </text>
          <text x={100} y={1320} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            levels of detail
          </text>
        </g>

        {/* Floating dots */}
        {[180, 540, 900].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${1500 + breathe * (1 + i * 0.2)})`}>
            <circle cx={0} cy={0} r={12} fill={COLORS.accent} fillOpacity={0.06}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          </g>
        ))}

        {/* Train track at bottom */}
        <line x1={60} y1={1600} x2={1020} y2={1600}
          stroke={COLORS.text_muted} strokeWidth={3} opacity={0.15} />
        <line x1={60} y1={1620} x2={1020} y2={1620}
          stroke={COLORS.text_muted} strokeWidth={3} opacity={0.15} />
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={80 + i * 48} y={1600} width={8} height={20} rx={1}
            fill={COLORS.text_muted} opacity={0.1} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
