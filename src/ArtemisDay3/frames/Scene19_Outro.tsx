/**
 * Scene19_Outro — Day 3 Outro
 * Duration: 362 frames (12.07s)
 * Shows: Today recap, tomorrow preview (Day 4: The Abort Button), CTA
 *
 * Animation phases:
 *   Phase 1 (0–30): Series branding + today recap
 *   Phase 2 (30–120): Key concepts + tomorrow preview
 *   Phase 3 (120–end): CTA + breathing elements
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, SectionLabel, Divider, CornerAccents } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

interface OutroProps {
  currentDay: number;
  nextDay: number;
  nextTopic: string;
  seriesTitle: string;
}

export const Scene19_Outro: React.FC<OutroProps> = ({
  currentDay, nextDay, nextTopic, seriesTitle,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const brandEnt = useSpringEntrance(frame, 0);
  const todayLabel = useSpringEntrance(frame, 8);
  const todayTitle = useSpringEntrance(frame, 14);

  // Phase 2
  const concept1 = useSpringEntrance(frame, 30);
  const concept2 = useSpringEntrance(frame, 42);
  const concept3 = useSpringEntrance(frame, 54);
  const dividerEnt = useSpringEntrance(frame, 65);
  const tomorrowLabel = useSpringEntrance(frame, 72);
  const tomorrowTitle = useSpringEntrance(frame, 80);
  const tomorrowSub = useSpringEntrance(frame, 88);

  const arrowLen = 60;
  const arrowDash = usePathDraw(frame, 100, arrowLen, 20);

  // Phase 3
  const ctaEnt = useSpringEntrance(frame, 110);
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Fade out at end
  const fadeOut = interpolate(frame, [330, 362], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: fadeOut }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={0.3} />

        {/* Series branding */}
        <g opacity={brandEnt.opacity} transform={`translate(0, ${brandEnt.translateY})`}>
          <text x={540} y={260} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.22em">
            {seriesTitle}
          </text>
        </g>

        {/* Today section */}
        <g opacity={todayLabel.opacity} transform={`translate(0, ${todayLabel.translateY})`}>
          <text x={60} y={350} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
            fill={COLORS.sky_blue} letterSpacing="0.1em">
            TODAY — DAY {currentDay}
          </text>
        </g>
        <g opacity={todayTitle.opacity} transform={`translate(0, ${todayTitle.translateY})`}>
          <text x={60} y={410} fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
            fill={COLORS.deep_black}>
            Apollo vs Artemis
          </text>
          <text x={60} y={465} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={500}
            fill={COLORS.cool_silver}>
            Same orbit, technology from a different era
          </text>
        </g>

        {/* Key concepts */}
        {[
          { text: 'Apollo 8 and Artemis II — same free-return path', color: COLORS.sky_blue, ent: concept1 },
          { text: 'Computers, radiation, comms — 56 years of change', color: COLORS.green, ent: concept2 },
          { text: 'Same mission — a civilization apart', color: COLORS.orange, ent: concept3 },
        ].map((item, i) => (
          <g key={i} opacity={item.ent.opacity} transform={`translate(60, ${520 + i * 90 + item.ent.translateY})`}>
            <rect x={0} y={0} width={6} height={52} rx={3} fill={item.color} />
            <text x={30} y={36} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={600}
              fill={COLORS.deep_black}>
              {item.text}
            </text>
          </g>
        ))}

        {/* Divider */}
        <g opacity={dividerEnt.opacity}>
          <Divider y={820} opacity={0.12} />
        </g>

        {/* Tomorrow preview */}
        <g opacity={tomorrowLabel.opacity} transform={`translate(0, ${tomorrowLabel.translateY})`}>
          <text x={60} y={900} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            TOMORROW — DAY {nextDay}
          </text>
        </g>
        <g opacity={tomorrowTitle.opacity} transform={`translate(0, ${tomorrowTitle.translateY})`}>
          <text x={60} y={975} fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={900}
            fill={COLORS.deep_black}>
            {nextTopic}
          </text>
        </g>
        <g opacity={tomorrowSub.opacity} transform={`translate(0, ${tomorrowSub.translateY})`}>
          <text x={60} y={1030} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={500}
            fill={COLORS.cool_silver}>
            One button, four lives, zero second chances
          </text>
        </g>

        {/* Tomorrow preview box */}
        <g opacity={tomorrowSub.opacity} transform={`translate(110, ${1080 + tomorrowSub.translateY})`}>
          <rect x={0} y={0} width={860} height={180} rx={16}
            fill={COLORS.vibrant_red} fillOpacity={0.03} stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          {/* Abort button icon inside */}
          <circle cx={100} cy={90} r={40} fill={COLORS.vibrant_red} fillOpacity={0.05}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '100px 90px' }}
          />
          <text x={100} y={97} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={900}
            fill={COLORS.vibrant_red}>
            ABORT
          </text>
          <text x={200} y={60} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700}
            fill={COLORS.deep_black}>
            What happens when you press it?
          </text>
          <text x={200} y={100} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}>
            Launch abort vs deep space scenarios
          </text>
          <text x={200} y={135} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}>
            Every failure mode, pre-engineered
          </text>
        </g>

        {/* Arrow down to CTA */}
        <path d={`M 540,1310 L 540,1370`} fill="none" stroke={COLORS.sky_blue} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash} markerEnd="url(#arrow)" />

        {/* CTA */}
        <g opacity={ctaEnt.opacity} transform={`translate(0, ${ctaEnt.translateY + breathe})`}>
          <text x={540} y={1440} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={40} fontWeight={800} fill={COLORS.sky_blue} opacity={shimmer}>
            Follow to keep exploring
          </text>
          {/* Chevron arrows */}
          <path d="M 520,1470 L 540,1490 L 560,1470" fill="none" stroke={COLORS.sky_blue}
            strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
          <path d="M 520,1490 L 540,1510 L 560,1490" fill="none" stroke={COLORS.sky_blue}
            strokeWidth={2.5} strokeLinecap="round" opacity={0.2} />
        </g>

        {/* Bottom branding */}
        <text x={540} y={1820} textAnchor="middle" fontFamily="'Inter', sans-serif"
          fontSize={28} fontWeight={500} fill={COLORS.cool_silver}
          opacity={ctaEnt.opacity * 0.4} letterSpacing="0.15em">
          HIDDEN WORLD SECRETS
        </text>
      </svg>
    </AbsoluteFill>
  );
};
