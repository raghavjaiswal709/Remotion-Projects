/**
 * Scene 28 — No Separate Cast
 * "No separate cast required."
 * CSV: 83.120s → 84.480s | Duration: 69 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–35): Crossed-out cast
 *   Phase 3 (30–end): Pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene28_NoSeparateCast: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const strikeE = useSpringEntrance(frame, 10);
  const checkE = useSpringEntrance(frame, 18);
  const cardE = useSpringEntrance(frame, 26);
  const bottomE = useSpringEntrance(frame, 34);

  const strikeLen = 750;
  const strikeDash = usePathDraw(frame, 14, strikeLen, 16);

  const checkLen = 80;
  const checkDash = usePathDraw(frame, 22, checkLen, 12);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s28.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="ELIMINATED · CAST" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>No Separate</text>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent}>Cast Required</text>
        </g>

        {/* Struck-through old cast line */}
        <g opacity={strikeE.opacity} transform={`translate(0, ${strikeE.translateY})`}>
          <BentoCard x={60} y={540} w={960} h={140} />
          <text x={540} y={628} textAnchor="middle" fontFamily={MONO} fontSize={30} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.5}>
            {'ExpressTrain e = (ExpressTrain) t;'}
          </text>
          {/* Strikethrough line */}
          <line x1={140} y1={620} x2={940} y2={620}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={strikeLen} strokeDashoffset={strikeDash}
            strokeLinecap="round" />
        </g>

        {/* New clean way with checkmark */}
        <g opacity={checkE.opacity} transform={`translate(0, ${checkE.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={180} accent />
          <rect x={60} y={740} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={810} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.white}>
            {'if (t instanceof ExpressTrain e)'}
          </text>
          <text x={100} y={858} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>Check + Bind — done in one line</text>
          {/* Checkmark */}
          <g transform="translate(960, 820)">
            <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.15}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            <path d="M -12,0 L -4,8 L 12,-8" fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          </g>
        </g>

        {/* Benefit cards */}
        <g opacity={cardE.opacity} transform={`translate(0, ${cardE.translateY})`}>
          {['Less code', 'Fewer bugs', 'Cleaner logic'].map((t, i) => (
            <g key={i}>
              <BentoCard x={60 + i * 320} y={1000} w={300} h={140} />
              <text x={210 + i * 320} y={1082} textAnchor="middle" fontFamily={FONT}
                fontSize={34} fontWeight={800} fill={i === 0 ? COLORS.accent : COLORS.white}>
                {t}
              </text>
            </g>
          ))}
        </g>

        {/* Bottom summary */}
        <g opacity={bottomE.opacity} transform={`translate(0, ${bottomE.translateY})`}>
          <BentoCard x={120} y={1220} w={840} h={120} />
          <text x={540} y={1292} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Java eliminates the manual cast step</text>
        </g>

        {/* Floating circle */}
        <circle cx={540} cy={1440 + breathe} r={5} fill={COLORS.accent} fillOpacity={0.08} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s28.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
