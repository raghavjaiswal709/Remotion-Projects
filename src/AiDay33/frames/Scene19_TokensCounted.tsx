/**
 * Scene 19 — Tokens Counted
 * "One model call, one tool call, tokens counted."
 * CSV: 60.160s → 63.800s
 * Duration: 109 frames (3.63s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline
 *   Phase 2 (frames 16–70): Three metric cards staggered
 *   Phase 3 (frames 60–end): Counter ticks + shimmer
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
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function useCounter(frame: number, startFrame: number, endValue: number, dur = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + dur], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

const METRICS = [
  { label: 'MODEL CALL', value: '1', icon: 'brain', delay: 18 },
  { label: 'TOOL CALL', value: '1', icon: 'gear', delay: 30 },
  { label: 'TOKENS', value: '847', icon: 'count', delay: 42 },
];

export const Scene19_TokensCounted: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const summaryCard = useSpringEntrance(frame, 58);

  const entries = METRICS.map(m => ({
    ...m,
    ent: useSpringEntrance(frame, m.delay),
  }));

  const tokenCounter = useCounter(frame, 42, 847, 40);
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = (i: number) => interpolate(
    Math.sin(frame * 0.05 + i * 1.2), [-1, 1], [0.7, 1]
  );

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="COST · BREAKDOWN" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Tokens Counted
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            One call. One tool. Measured.
          </text>
        </g>

        {/* ZONE C — Three metric cards */}
        {entries.map((e, i) => {
          const cardY = 500 + i * 340;
          return (
            <g key={i} opacity={e.ent.opacity} transform={`translate(0, ${e.ent.translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={300} accent={i === 2} />

              {/* Left icon area */}
              <rect x={80} y={cardY + 20} width={260} height={260} rx={16}
                fill={COLORS.accent} fillOpacity={0.06} />

              {/* Icon */}
              {e.icon === 'brain' && (
                <g transform={`translate(210, ${cardY + 150})`}>
                  <ellipse cx={0} cy={0} rx={60} ry={50} fill="none"
                    stroke={COLORS.accent} strokeWidth={3} opacity={shimmer(i)} />
                  <path d="M -30,-20 Q 0,-50 30,-20" fill="none" stroke={COLORS.accent} strokeWidth={2} />
                  <path d="M -35,0 Q 0,30 35,0" fill="none" stroke={COLORS.accent} strokeWidth={2} />
                </g>
              )}
              {e.icon === 'gear' && (
                <g transform={`translate(210, ${cardY + 150})`}>
                  {Array.from({ length: 8 }, (_, t) => {
                    const a = (t * Math.PI * 2) / 8;
                    return <rect key={t} x={Math.cos(a) * 45 - 8} y={Math.sin(a) * 45 - 8}
                      width={16} height={16} rx={3}
                      fill={COLORS.accent} opacity={shimmer(i) * 0.7}
                      transform={`rotate(${t * 45}, ${Math.cos(a) * 45}, ${Math.sin(a) * 45})`} />;
                  })}
                  <circle cx={0} cy={0} r={25} fill="none" stroke={COLORS.accent} strokeWidth={3} />
                  <circle cx={0} cy={0} r={10} fill={COLORS.accent} />
                </g>
              )}
              {e.icon === 'count' && (
                <g transform={`translate(210, ${cardY + 150})`}>
                  <text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontSize={64} fontWeight={800}
                    fill={COLORS.accent}>
                    {tokenCounter}
                  </text>
                </g>
              )}

              {/* Label + Value */}
              <text x={380} y={cardY + 80} fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.text_muted} letterSpacing="0.12em">{e.label}</text>
              <text x={380} y={cardY + 180} fontFamily={FONT} fontSize={96} fontWeight={800}
                fill={i === 2 ? COLORS.accent : COLORS.white}>
                {i === 2 ? tokenCounter : e.value}
              </text>

              {/* Right accent bar */}
              <rect x={1014} y={cardY} width={6} height={300} rx={3}
                fill={COLORS.accent} opacity={0.3 * shimmer(i)} />
            </g>
          );
        })}

        {/* Summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY + breathe})`}>
          <BentoCard x={60} y={1540} w={960} h={120} accent />
          <text x={540} y={1615} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Precise cost per <tspan fill={COLORS.accent} fontStyle="italic">step</tspan>
          </text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
