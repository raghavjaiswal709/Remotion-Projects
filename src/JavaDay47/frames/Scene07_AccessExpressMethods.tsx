/**
 * Scene 07 — Access Express Methods
 * "To access Express-specific methods,"
 * CSV: 27.660s → 30.600s
 * Duration: ~88 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 20–60):  Locked methods illustration with key/unlock metaphor
 *   Phase 3 (frames 55–end): Micro-animations
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

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

export const Scene07_AccessExpressMethods: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  const lockCard = useSpringEntrance(frame, 18);
  const methodRow1 = useSpringEntrance(frame, 28);
  const methodRow2 = useSpringEntrance(frame, 38);
  const methodRow3 = useSpringEntrance(frame, 48);
  const questionCard = useSpringEntrance(frame, 56);

  // Lock icon path draw
  const lockPathLen = 200;
  const lockDash = usePathDraw(frame, 22, lockPathLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[6];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="ACCESS PROBLEM" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Express Methods
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            Need Special Access
          </text>
        </g>

        {/* Lock illustration card */}
        <g opacity={lockCard.opacity} transform={`translate(0, ${lockCard.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={320} accent />

          {/* Large lock icon */}
          <g transform="translate(200, 580)">
            {/* Lock body */}
            <rect x={0} y={60} width={120} height={100} rx={12}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={3} />
            {/* Lock shackle */}
            <path d="M 25,60 L 25,30 A 35 35 0 0 1 95,30 L 95,60"
              fill="none" stroke={COLORS.accent} strokeWidth={5}
              strokeDasharray={lockPathLen} strokeDashoffset={lockDash}
              strokeLinecap="round" />
            {/* Keyhole */}
            <circle cx={60} cy={105} r={12} fill={COLORS.accent} fillOpacity={0.4} />
            <rect x={56} y={110} width={8} height={24} rx={4} fill={COLORS.accent} fillOpacity={0.4} />
          </g>

          {/* Label */}
          <text x={400} y={640} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
            Express-Specific
          </text>
          <text x={400} y={700} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Methods Are Locked
          </text>
          <text x={400} y={760} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Behind the parent reference type
          </text>
        </g>

        {/* Method rows — locked */}
        <g opacity={methodRow1.opacity} transform={`translate(0, ${methodRow1.translateY})`}>
          <BentoCard x={60} y={880} w={460} h={120} />
          <circle cx={120} cy={940} r={16} fill={COLORS.accent} fillOpacity={0.2} />
          <text x={120} y={946} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            ✓
          </text>
          <text x={160} y={950} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            depart()
          </text>
          <text x={400} y={950} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Train
          </text>
        </g>

        <g opacity={methodRow2.opacity} transform={`translate(0, ${methodRow2.translateY})`}>
          <BentoCard x={560} y={880} w={460} h={120} />
          <circle cx={620} cy={940} r={16} fill={COLORS.vibrant_red} fillOpacity={0.2} />
          <text x={620} y={946} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}>
            ✗
          </text>
          <text x={660} y={950} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.vibrant_red} opacity={0.8}>
            serveLunch()
          </text>
        </g>

        <g opacity={methodRow3.opacity} transform={`translate(0, ${methodRow3.translateY})`}>
          <BentoCard x={60} y={1020} w={460} h={120} />
          <circle cx={120} cy={1080} r={16} fill={COLORS.vibrant_red} fillOpacity={0.2} />
          <text x={120} y={1086} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}>
            ✗
          </text>
          <text x={160} y={1090} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.vibrant_red} opacity={0.8}>
            reserveSeat()
          </text>
        </g>

        {/* Question card */}
        <g opacity={questionCard.opacity} transform={`translate(0, ${questionCard.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={300} accent />
          <rect x={60} y={1200} width={8} height={300} rx={4} fill={COLORS.accent} />

          {/* Question mark */}
          <text x={160} y={1370} fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.15}>
            ?
          </text>

          <text x={240} y={1330} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            How do you unlock
          </text>
          <text x={240} y={1395} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Express-specific features?
          </text>
          <text x={240} y={1450} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            You need to tell Java explicitly...
          </text>
        </g>

        {/* Floating accents */}
        <circle cx={950} cy={600 + breathe} r={5} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={540} cy={1160 + breathe * 0.8} r={4} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <g transform={`translate(260, ${680})`}>
          <circle r={30} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.08 * shimmer} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
