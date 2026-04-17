/**
 * Scene 13 — Different Parameter List
 * "each with a different parameter list."
 * CSV: 45.580s → 47.840s
 * Duration: ~68 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–60): Three param-list side by side comparison
 *   Phase 3 (55–end): Micro pulse
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene13_DifferentParamList: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);

  const cols = [
    useSpringEntrance(frame, 18),
    useSpringEntrance(frame, 28),
    useSpringEntrance(frame, 38),
  ];

  const bracketLen = 600;
  const bracketDash = usePathDraw(frame, 50, bracketLen, 25);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  const paramLists = [
    { label: 'Version 1', params: ['passengerId', 'routeId'], count: 2 },
    { label: 'Version 2', params: ['passengerId', 'routeId', 'seatClass'], count: 3 },
    { label: 'Version 3', params: ['passengerId', 'routeId', 'seatClass', 'concession'], count: 4 },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="PARAMETER SIGNATURE" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Different
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}>
            Parameter Lists
          </text>
        </g>

        {/* Three columns side by side */}
        {paramLists.map((pl, i) => {
          const ent = cols[i];
          const colX = 60 + i * 330;
          const colW = 300;
          const cardH = 620;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <rect x={colX} y={480} width={colW} height={cardH} rx={20}
                fill={COLORS.bg_secondary}
                stroke={i === 2 ? COLORS.accent : 'rgba(255,255,255,0.1)'}
                strokeWidth={i === 2 ? 2 : 1} />

              {/* Header */}
              <rect x={colX} y={480} width={colW} height={60} rx={20}
                fill={COLORS.accent_dim} />
              <rect x={colX} y={520} width={colW} height={20}
                fill={COLORS.accent_dim} />
              <text x={colX + colW / 2} y={520} textAnchor="middle"
                fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
                {pl.label}
              </text>

              {/* Count badge */}
              <circle cx={colX + colW / 2} cy={600} r={30}
                fill={COLORS.accent} fillOpacity={0.15}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={colX + colW / 2} y={610} textAnchor="middle"
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
                {pl.count}
              </text>

              {/* Param pills */}
              {pl.params.map((p, j) => {
                const pillY = 660 + j * 60;
                const isNew = j >= (i === 0 ? 99 : paramLists[i - 1].params.length);
                return (
                  <g key={j}>
                    <rect x={colX + 20} y={pillY} width={colW - 40} height={44} rx={10}
                      fill={isNew ? COLORS.accent_dim : COLORS.bg_primary}
                      stroke={isNew ? COLORS.accent : 'rgba(255,255,255,0.08)'}
                      strokeWidth={isNew ? 1.5 : 1} />
                    <text x={colX + colW / 2} y={pillY + 30} textAnchor="middle"
                      fontFamily="'Fira Code', monospace" fontSize={16} fontWeight={600}
                      fill={isNew ? COLORS.accent : COLORS.text_muted}>
                      {p}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Curly brace below columns */}
        <g opacity={cols[2].opacity}>
          <path d={`M 100,1130 Q 540,1180 980,1130`}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={bracketLen} strokeDashoffset={bracketDash}
            strokeLinecap="round" />
          <text x={540} y={1230} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Same name — <tspan fill={COLORS.accent} fontStyle="italic">bookTicket</tspan>
          </text>
        </g>

        {/* Insight */}
        <g opacity={cols[2].opacity} transform={`translate(0, ${cols[2].translateY})`}>
          <BentoCard x={60} y={1290} w={960} h={140} accent />
          <rect x={60} y={1290} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1375}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The <tspan fill={COLORS.accent}>parameter list</tspan> is what differs
          </text>
        </g>

        {/* Track lines */}
        <line x1={60} y1={1560} x2={1020} y2={1560}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1576} x2={1020} y2={1576}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {/* Floating dots breathe */}
        {[180, 540, 900].map((cx, i) => (
          <circle key={i} cx={cx} cy={1650 + breathe * (1 + i * 0.15)}
            r={10} fill={COLORS.accent} fillOpacity={0.06}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px 1650px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
