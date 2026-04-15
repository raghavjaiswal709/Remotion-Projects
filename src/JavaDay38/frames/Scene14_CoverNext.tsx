/**
 * Scene 14 — Cover Next
 * "That is exactly what we cover next."
 * CSV: 79.520s → 81.560s
 * Duration: 61 frames (2.0s)
 *
 * Animation phases:
 *   Phase 1 (0–15):  Quick fade-in of text
 *   Phase 2 (10–40): Forward arrow path-draw
 *   Phase 3 (35–end): Pulse shimmer
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_SNAP });
  const opacity  = interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [24, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 20) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene14_CoverNext: React.FC = () => {
  const frame = useCurrentFrame();

  const label   = useSpringEntrance(frame, 0);
  const heading = useSpringEntrance(frame, 4);
  const subtext = useSpringEntrance(frame, 10);
  const arrowEnt = useSpringEntrance(frame, 14);

  const pulse   = 1 + Math.sin(frame * 0.12) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.8, 1]);

  const arrowLen = 400;
  const arrowDash = usePathDraw(frame, 12, arrowLen, 20);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0,${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="COMING UP · DAY 39" y={160} opacity={0.7} />
        </g>

        {/* Centered big text */}
        <g transform={`translate(0,${heading.translateY})`} opacity={heading.opacity}>
          <text x={540} y={700} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Cover Next
          </text>
        </g>

        <g transform={`translate(0,${subtext.translateY})`} opacity={subtext.opacity}>
          <text x={540} y={820} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Static Method
          </text>
        </g>

        {/* Forward arrow */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 340,960 L 740,960"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Ghost accent circle */}
        <circle cx={540} cy={1200} r={180}
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          opacity={shimmer * 0.1}
          style={{ transform: `scale(${pulse})`, transformOrigin: '540px 1200px' }} />
        <circle cx={540} cy={1200} r={120}
          fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          opacity={shimmer * 0.07} />

        {/* Small summary card */}
        <g opacity={subtext.opacity} transform={`translate(0,${subtext.translateY})`}>
          <BentoCard x={200} y={1400} w={680} h={90} />
          <text x={540} y={1458} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Called on the <tspan fill={COLORS.accent}>class</tspan>, no object needed
          </text>
        </g>

        {/* Track decoration */}
        <line x1={120} y1={1580} x2={960} y2={1580}
          stroke={COLORS.text_muted} strokeWidth={2} opacity={0.06} />
        <line x1={120} y1={1594} x2={960} y2={1594}
          stroke={COLORS.text_muted} strokeWidth={2} opacity={0.06} />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={140 + i * 68} y={1582} width={20} height={10} rx={2}
            fill={COLORS.text_muted} opacity={0.04} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
