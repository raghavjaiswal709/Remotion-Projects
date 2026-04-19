/**
 * Scene 22 — Trajectory Exposes Full Picture
 * "The trajectory exposes the full picture."
 * CSV: 53.800s → 56.600s
 * Duration: 84 frames (2.8s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline
 *   Phase 2 (10–55): Full trajectory chain revealed, magnifying glass
 *   Phase 3 (45–end): Shimmer, pulse
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

function usePathDraw(frame: number, start: number, len: number, dur = 25) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene22_FullPicture: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const h2 = useSpringEntrance(frame, 7);

  const chainNodes = ['s₀', 'a₁', 'o₁', 's₁', 'a₂', 'o₂', 's₂', 'a₃', 'o₃'];
  const nodeEntrances = chainNodes.map((_, i) => useSpringEntrance(frame, 14 + i * 3));

  const arcLen = 800;
  const arcDash = usePathDraw(frame, 14, arcLen, 30);

  const magCard = useSpringEntrance(frame, 36);
  const revealCards = [0, 1, 2].map(i => useSpringEntrance(frame, 44 + i * 8));

  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const travelX = interpolate(frame, [14, 50], [0, 8], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const highlightIdx = Math.min(8, Math.floor(travelX));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="TRAJECTORY · VALUE" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            The trajectory
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            exposes the full picture
          </text>
        </g>

        {/* Large trajectory arc */}
        <path d="M 100,620 Q 540,480 980,620"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arcLen} strokeDashoffset={arcDash}
          opacity={0.3} strokeLinecap="round" />

        {/* Chain nodes */}
        {chainNodes.map((label, i) => {
          const e = nodeEntrances[i];
          const cx = 100 + i * 110;
          const cy = 620;
          const isHighlight = i === highlightIdx;
          const nodeColor = label.startsWith('s') ? COLORS.accent
            : label.startsWith('a') ? COLORS.white : COLORS.text_muted;
          return (
            <g key={i} opacity={e.opacity} transform={`translate(0, ${e.translateY})`}>
              <circle cx={cx} cy={cy} r={isHighlight ? 26 : 22}
                fill={isHighlight ? COLORS.accent : COLORS.bg_secondary}
                fillOpacity={isHighlight ? 0.2 : 1}
                stroke={isHighlight ? COLORS.accent : nodeColor}
                strokeWidth={isHighlight ? 2.5 : 1.5} />
              <text x={cx} y={cy + 6} textAnchor="middle"
                fontFamily={FONT} fontSize={16} fontWeight={800}
                fill={isHighlight ? COLORS.accent : nodeColor}>
                {label}
              </text>
              {i < chainNodes.length - 1 && (
                <line x1={cx + 24} y1={cy} x2={cx + 86} y2={cy}
                  stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
              )}
            </g>
          );
        })}

        {/* Magnifying glass illustration */}
        <g opacity={magCard.opacity} transform={`translate(540, ${800 + magCard.translateY})`}>
          <circle cx={0} cy={0} r={80}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={3} />
          <line x1={56} y1={56} x2={110} y2={110}
            stroke={COLORS.accent} strokeWidth={6} strokeLinecap="round" />
          <text x={0} y={8} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            FULL
          </text>
        </g>

        {/* 3 reveal cards */}
        {['Every state change', 'Every tool invocation', 'Every observation received'].map((txt, i) => (
          <g key={i} opacity={revealCards[i].opacity}
            transform={`translate(0, ${revealCards[i].translateY})`}>
            <BentoCard x={60} y={960 + i * 160} w={960} h={140} accent={i === 0} />
            <rect x={60} y={960 + i * 160} width={6} height={140} rx={3} fill={COLORS.accent} />
            <text x={100} y={960 + i * 160 + 82}
              fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
              {txt}
            </text>
            <text x={960} y={960 + i * 160 + 82}
              fontFamily={FONT} fontSize={20} fontWeight={800}
              fill={COLORS.accent} opacity={0.5} textAnchor="end">
              VISIBLE
            </text>
          </g>
        ))}

        {/* Bottom summary */}
        <g opacity={revealCards[2]?.opacity ?? 0}
          transform={`translate(0, ${(revealCards[2]?.translateY ?? 0) + 10})`}>
          <BentoCard x={60} y={1460} w={960} h={120} accent />
          <text x={540} y={1534} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Nothing hidden — <tspan fill={COLORS.accent}>complete transparency</tspan>
          </text>
        </g>

        {[100, 540, 980].map((x, i) => (
          <circle key={i} cx={x} cy={1680 + breathe + i * 20}
            r={4} fill={COLORS.accent} opacity={0.05 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
