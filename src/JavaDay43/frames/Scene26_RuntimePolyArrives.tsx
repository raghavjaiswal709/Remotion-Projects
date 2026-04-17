/**
 * Scene 26 — Run Time Polymorphism Arrives
 * "We will see exactly why when run time polymorphism arrives."
 * CSV: 97.540s → 100.920s
 * Duration: ~101 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–60): Coming-soon card with lock icon
 *   Phase 3 (50–end): Micro
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene26_RuntimePolyArrives: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  // Current topic card — compile time (done)
  const doneCard = useSpringEntrance(frame, 20);
  // Upcoming topic card — run time (locked)
  const lockedCard = useSpringEntrance(frame, 32);

  // Arrow from done to locked
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 40, arrowLen, 20);

  // Lock icon spring
  const lockSpring = spring({ frame: Math.max(0, frame - 38), fps, config: SPRING_SNAP });

  // Decorative track
  const trackEnt = useSpringEntrance(frame, 50);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s26.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="LOOKING AHEAD" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.white}>
            Coming Soon
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={540} y={385} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Run-Time Polymorphism
          </text>
        </g>

        {/* Done card: compile-time polymorphism */}
        <g opacity={doneCard.opacity} transform={`translate(0, ${doneCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={280} accent />
          <rect x={60} y={480} width={6} height={280} rx={3} fill={COLORS.accent} />

          {/* Checkmark */}
          <circle cx={140} cy={560} r={28} fill={COLORS.accent} opacity={0.15} />
          <path d="M 128,560 L 136,570 L 154,548"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round" />

          <text x={190} y={570}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Compile-Time Polymorphism
          </text>
          <text x={100} y={630}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Method overloading — resolved by javac
          </text>
          <text x={100} y={670}
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
            TODAY
          </text>

          {/* Status badge */}
          <rect x={830} y={660} width={140} height={40} rx={12}
            fill={COLORS.accent} opacity={0.12} />
          <text x={900} y={687} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
            COVERED
          </text>
        </g>

        {/* Arrow down */}
        <path d="M 540,760 L 540,860"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Locked card: run-time polymorphism */}
        <g opacity={lockedCard.opacity} transform={`translate(0, ${lockedCard.translateY})`}>
          <BentoCard x={60} y={880} w={960} h={280} accent={false} />

          {/* Lock icon */}
          <g transform={`translate(140, 960) scale(${lockSpring})`}
            style={{ transformOrigin: '0px 0px' }}>
            {/* Lock body */}
            <rect x={-18} y={0} width={36} height={28} rx={4}
              fill={COLORS.text_muted} opacity={0.3} />
            {/* Lock shackle */}
            <path d="M -10,0 L -10,-14 A 10,10 0 0 1 10,-14 L 10,0"
              fill="none" stroke={COLORS.text_muted} strokeWidth={3} opacity={0.3} />
          </g>

          <text x={190} y={975}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Run-Time Polymorphism
          </text>
          <text x={100} y={1040}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            Method overriding — resolved by JVM
          </text>
          <text x={100} y={1080}
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted} opacity={0.4}>
            UPCOMING
          </text>

          {/* Status badge */}
          <rect x={830} y={1070} width={140} height={40} rx={12}
            fill={COLORS.text_muted} opacity={0.08} />
          <text x={900} y={1097} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            LOCKED
          </text>
        </g>

        {/* Decorative track */}
        <g opacity={trackEnt.opacity * 0.08}>
          <line x1={60} y1={1380} x2={1020} y2={1380}
            stroke={COLORS.text_muted} strokeWidth={2.5} />
          <line x1={60} y1={1396} x2={1020} y2={1396}
            stroke={COLORS.text_muted} strokeWidth={2.5} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={80 + i * 60} y={1381} width={22} height={14} rx={2}
              fill={COLORS.text_muted} />
          ))}
        </g>

        {/* Train silhouette moving along track */}
        <g opacity={trackEnt.opacity * 0.06}
          transform={`translate(${interpolate(frame, [50, 100], [100, 800], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })}, 1340)`}>
          <rect x={0} y={10} width={120} height={30} rx={6} fill={COLORS.accent} />
          <rect x={90} y={0} width={40} height={40} rx={4} fill={COLORS.accent} />
          <circle cx={25} cy={50} r={12} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={75} cy={50} r={12} fill="none" stroke={COLORS.accent} strokeWidth={2} />
        </g>

        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.accent}
            strokeWidth={2} opacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s26.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
