/**
 * Scene 10 — Step Complete
 * "One step complete. Move to the next."
 * CSV: 32.000s → 35.020s
 * Duration: 91 frames (3.0s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–22): Label + headline
 *   Phase 2 (frames 18–65): Checkmark reveals, step 1 → step 2 transition
 *   Phase 3 (frames 55–end): Arrow pulse, breathing
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

export const Scene10_StepComplete: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);

  // Phase 2
  const step1Card = useSpringEntrance(frame, 14);
  const checkDash = usePathDraw(frame, 28, 45, 18);
  const arrowFwd = usePathDraw(frame, 38, 180, 22);
  const step2Card = useSpringEntrance(frame, 45);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  // Step number pop
  const numPop = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_SNAP });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="STEP LIFECYCLE · COMPLETION" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Step Complete
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Move to the next
          </text>
        </g>

        {/* ZONE C — Step 1 card (completed) */}
        <g opacity={step1Card.opacity} transform={`translate(0, ${step1Card.translateY})`}>
          <BentoCard x={60} y={480} w={440} h={500} accent />

          {/* Big "1" */}
          <text x={280} y={660} textAnchor="middle" fontFamily={FONT}
            fontSize={200} fontWeight={800} fill={COLORS.accent}
            opacity={0.15}
            transform={`scale(${interpolate(numPop, [0, 1], [0.8, 1])})`}
            style={{ transformOrigin: '280px 600px' }}>
            1
          </text>
          <text x={280} y={650} textAnchor="middle" fontFamily={FONT}
            fontSize={120} fontWeight={800} fill={COLORS.accent}>
            1
          </text>

          <text x={280} y={760} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            STEP ONE
          </text>

          {/* Checkmark circle */}
          <circle cx={280} cy={870} r={36} fill="none" stroke={COLORS.accent} strokeWidth={3} opacity={step1Card.opacity} />
          <path d="M 260,870 L 275,885 L 300,855"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={45} strokeDashoffset={checkDash}
            strokeLinecap="round" strokeLinejoin="round"
          />

          <text x={280} y={940} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            COMPLETE
          </text>
        </g>

        {/* Arrow from step 1 → step 2 */}
        <path d="M 520,730 C 560,730 580,730 620,730"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={180} strokeDashoffset={arrowFwd}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />
        <text x={570} y={710} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
          fill={COLORS.text_muted} opacity={step2Card.opacity * 0.7}>
          NEXT
        </text>

        {/* Step 2 card (upcoming) */}
        <g opacity={step2Card.opacity} transform={`translate(0, ${step2Card.translateY})`}>
          <BentoCard x={620} y={480} w={400} h={500} />

          {/* Big "2" */}
          <text x={820} y={660} textAnchor="middle" fontFamily={FONT}
            fontSize={200} fontWeight={800} fill={COLORS.text_muted} opacity={0.08}>
            2
          </text>
          <text x={820} y={650} textAnchor="middle" fontFamily={FONT}
            fontSize={120} fontWeight={800} fill={COLORS.text_muted}>
            2
          </text>

          <text x={820} y={760} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            STEP TWO
          </text>

          {/* Empty circle (pending) */}
          <circle cx={820} cy={870} r={36} fill="none" stroke={COLORS.text_muted} strokeWidth={2} strokeDasharray="8 8" opacity={0.5} />

          <text x={820} y={940} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            PENDING
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={step2Card.opacity * 0.85}>
          <BentoCard x={60} y={1040} w={960} h={120} accent />
          <rect x={60} y={1040} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1112} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Each step ends. The next begins.
          </text>
        </g>

        {/* Micro-animations */}
        <circle cx={540} cy={1300 + breathe} r={5} fill={COLORS.accent} opacity={0.15}
          transform={`scale(${pulse})`} style={{ transformOrigin: '540px 1300px' }} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
