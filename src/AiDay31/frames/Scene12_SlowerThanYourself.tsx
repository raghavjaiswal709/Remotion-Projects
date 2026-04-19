/**
 * Scene 12 — Slower Than Yourself
 * "slower than doing it yourself."
 * CSV: 44.060s → 46.260s | Duration: 66 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (15–50): Speed comparison
 *   Phase 3 (40–end): Micro animations
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

export const Scene12_SlowerThanYourself: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);
  const card1 = useSpringEntrance(frame, 16);
  const card2 = useSpringEntrance(frame, 28);
  const card3 = useSpringEntrance(frame, 40);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Turtle progress bar (slow)
  const turtleBar = interpolate(frame, [18, 55], [0, 300], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.linear,
  });
  // Human bar (fast)
  const humanBar = interpolate(frame, [18, 35], [0, 700], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · COST" y={160} />
        </g>

        {/* Zone B — Hero text */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={540} y={330} textAnchor="middle" fontFamily={FONT}
            fontSize={96} fontWeight={800} fill={COLORS.vibrant_red}>
            Slower
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={540} y={450} textAnchor="middle" fontFamily={FONT}
            fontSize={64} fontWeight={800} fill={COLORS.text_muted}>
            than doing it yourself
          </text>
        </g>

        {/* Zone C — Speed comparison */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={540} w={960} h={440} accent />

          {/* Agent + approval track */}
          <text x={100} y={600} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            AGENT + CONSTANT APPROVAL
          </text>
          {/* Track bg */}
          <rect x={100} y={620} width={860} height={24} rx={12}
            fill="rgba(255,255,255,0.05)" />
          {/* Slow progress */}
          <rect x={100} y={620} width={turtleBar} height={24} rx={12}
            fill={COLORS.vibrant_red} opacity={0.6} />
          {/* Turtle icon */}
          <g transform={`translate(${100 + turtleBar}, 632)`}>
            <circle cx={0} cy={0} r={14} fill={COLORS.bg_secondary}
              stroke={COLORS.vibrant_red} strokeWidth={2} />
            <text x={0} y={5} textAnchor="middle" fontFamily={FONT}
              fontSize={14} fontWeight={800} fill={COLORS.vibrant_red}>S</text>
          </g>

          {/* Human doing it directly */}
          <text x={100} y={730} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            HUMAN DOES IT DIRECTLY
          </text>
          <rect x={100} y={750} width={860} height={24} rx={12}
            fill="rgba(255,255,255,0.05)" />
          <rect x={100} y={750} width={humanBar} height={24} rx={12}
            fill={COLORS.accent} opacity={0.7} />
          {/* Fast marker */}
          <g transform={`translate(${100 + humanBar}, 762)`}>
            <circle cx={0} cy={0} r={14} fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={0} y={5} textAnchor="middle" fontFamily={FONT}
              fontSize={14} fontWeight={800} fill={COLORS.accent}>F</text>
          </g>

          {/* Time labels */}
          <text x={100} y={840} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            0s
          </text>
          <text x={960} y={840} textAnchor="end" fontFamily={FONT} fontSize={22}
            fontWeight={800} fill={COLORS.text_muted}>
            Time
          </text>

          {/* Verdict */}
          <text x={540} y={920} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            Agent is slower when every step needs approval
          </text>
        </g>

        {/* Bottom cards */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1020} w={460} h={200} />
          <text x={100} y={1110} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            No value added
          </text>
          <text x={100} y={1160} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Agent becomes overhead
          </text>
        </g>
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1020} w={460} h={200} accent />
          <text x={600} y={1110} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            Solution
          </text>
          <text x={600} y={1160} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Let safe actions run free
          </text>
        </g>

        {/* Floating elements */}
        <g transform={`translate(540, ${1340 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.2} />
        </g>

        {[0, 1, 2].map(i => (
          <circle key={i} cx={300 + i * 220}
            cy={1440 + Math.sin(frame * 0.05 + i) * 5}
            r={3} fill={COLORS.accent} opacity={0.1} />
        ))}

        <g opacity={interpolate(frame, [40, 55], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1540} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Defeats the purpose of automation
          </text>
        </g>

        {/* Down arrow hint */}
        <g opacity={interpolate(frame, [50, 60], [0, 0.2], { extrapolateRight: 'clamp' })}>
          <path d="M 540,1620 L 540,1680 M 530,1670 L 540,1680 L 550,1670"
            fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
