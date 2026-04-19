/**
 * Scene 20 — Design Principle Trustworthy
 * "This is the design principle...trustworthy, rather than reckless."
 * CSV: 72.967s → 78.667s | Duration: 171 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–100): Shield/badge illustration, trustworthy vs reckless
 *   Phase 3 (90–end): Micro animations
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene20_DesignPrincipleTrustworthy: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 40);
  const card3 = useSpringEntrance(frame, 56);
  const card4 = useSpringEntrance(frame, 70);
  const card5 = useSpringEntrance(frame, 84);

  // Shield path draw
  const shieldLen = 400;
  const shieldDash = usePathDraw(frame, 26, shieldLen, 30);

  // Checkmark inside shield
  const checkLen = 60;
  const checkDash = usePathDraw(frame, 50, checkLen, 15);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · DESIGN PRINCIPLE" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Design Principle
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Trustworthy, not reckless
          </text>
        </g>

        {/* Card 1 — Shield illustration */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={360} accent />

          {/* Large shield */}
          <g transform="translate(540, 640)">
            <path
              d="M 0,-110 L 90,-70 L 90,30 Q 90,100 0,130 Q -90,100 -90,30 L -90,-70 Z"
              fill={COLORS.accent} fillOpacity={0.06}
              stroke={COLORS.accent} strokeWidth={4}
              strokeDasharray={shieldLen} strokeDashoffset={shieldDash}
              strokeLinejoin="round" />
            {/* Checkmark inside */}
            <path d="M -30,10 L -10,30 L 35,-20"
              fill="none" stroke={COLORS.accent} strokeWidth={6}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          </g>

          <text x={540} y={810} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.accent}>
            TRUSTWORTHY AGENT
          </text>
        </g>

        {/* Card 2 — Comparison: Trustworthy vs Reckless */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={880} w={460} h={280} accent />
          {/* Green check */}
          <circle cx={140} cy={960} r={24} fill="rgba(76,175,80,0.08)"
            stroke="rgba(76,175,80,0.5)" strokeWidth={2} />
          <path d="M 130,960 L 136,968 L 152,950" fill="none"
            stroke="rgba(76,175,80,1)" strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round" />
          <text x={180} y={968} fontFamily={FONT} fontSize={34}
            fontWeight={800} fill={COLORS.accent}>
            Trustworthy
          </text>
          <text x={100} y={1020} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Checks before acting
          </text>
          <text x={100} y={1054} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Asks when unsure
          </text>
          <text x={100} y={1088} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Respects boundaries
          </text>
          <text x={100} y={1122} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Predictable behavior
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={880} w={460} h={280} />
          {/* Red X */}
          <circle cx={640} cy={960} r={24} fill="rgba(247,55,79,0.08)"
            stroke="rgba(247,55,79,0.5)" strokeWidth={2} />
          <line x1={630} y1={950} x2={650} y2={970}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <line x1={650} y1={950} x2={630} y2={970}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <text x={680} y={968} fontFamily={FONT} fontSize={34}
            fontWeight={800} fill={COLORS.vibrant_red}>
            Reckless
          </text>
          <text x={600} y={1020} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Acts without thinking
          </text>
          <text x={600} y={1054} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Ignores consequences
          </text>
          <text x={600} y={1088} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Skips approval gates
          </text>
          <text x={600} y={1122} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Unpredictable output
          </text>
        </g>

        {/* Bottom principle card */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={140} accent />
          <rect x={100} y={1230} width={200} height={44} rx={22}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={200} y={1260} textAnchor="middle" fontFamily={FONT}
            fontSize={20} fontWeight={800} fill={COLORS.accent}>
            PRINCIPLE
          </text>
          <text x={340} y={1280} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Calibrate autonomy to reversibility
          </text>
        </g>

        {/* Summary */}
        <g opacity={card5.opacity} transform={`translate(0, ${card5.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={100} />
          <text x={540} y={1442} textAnchor="middle" fontFamily={FONT}
            fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Earn trust through consistent, safe behavior
          </text>
        </g>

        {/* Micro */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={22} fill={COLORS.accent}
            fillOpacity={0.03 * shimmer} />
          <circle cx={0} cy={0} r={22} fill="none" stroke={COLORS.accent}
            strokeWidth={1} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.1} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
