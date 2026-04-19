/**
 * Scene 05 — The Reference Is Train T
 * "The reference is Train T."
 * CSV: 22.000s → 24.280s
 * Duration: ~68 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline
 *   Phase 2 (frames 18–50):  Code card showing Train t declaration, type badge
 *   Phase 3 (frames 45–end): Micro pulse, shimmer
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
const MONO = "'Fira Code', 'Courier New', monospace";

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

export const Scene05_ReferenceTrainT: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  const codeCard = useSpringEntrance(frame, 18);
  const typeLabel = useSpringEntrance(frame, 28);
  const pointerCard = useSpringEntrance(frame, 36);
  const diagramCard = useSpringEntrance(frame, 44);

  // Border draw on code card
  const borderPerim = 2 * (960 + 240);
  const borderDash = interpolate(frame, [18, 48], [borderPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Arrow from ref to obj
  const arrowLen = 250;
  const arrowDash = usePathDraw(frame, 38, arrowLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[4];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="REFERENCE TYPE" y={160} opacity={0.8} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            The Reference
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            Is Train t
          </text>
        </g>

        {/* Zone C — Code card */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <rect x={60} y={520} width={960} height={240} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={borderPerim} strokeDashoffset={borderDash} />
          <rect x={60} y={520} width={8} height={240} rx={4} fill={COLORS.accent} />
          {/* Code line */}
          <text x={120} y={620} fontFamily={MONO} fontSize={44} fontWeight={500} fill={COLORS.accent}>
            Train
          </text>
          <text x={280} y={620} fontFamily={MONO} fontSize={44} fontWeight={500} fill={COLORS.white}>
            {' t = '}
          </text>
          <text x={430} y={620} fontFamily={MONO} fontSize={44} fontWeight={500} fill={COLORS.accent}>
            new
          </text>
          <text x={520} y={620} fontFamily={MONO} fontSize={44} fontWeight={500} fill={COLORS.white}>
            {' ExpressTrain();'}
          </text>
          {/* Type annotation */}
          <text x={120} y={700} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Reference type: Train (parent)
          </text>
        </g>

        {/* Type badge */}
        <g opacity={typeLabel.opacity} transform={`translate(0, ${typeLabel.translateY})`}>
          <rect x={60} y={800} width={440} height={140} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={100} y={855} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            DECLARED TYPE
          </text>
          <text x={100} y={910} fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.accent}>
            Train
          </text>
        </g>

        {/* Pointer diagram — variable pointing to object */}
        <g opacity={pointerCard.opacity} transform={`translate(0, ${pointerCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={340} />

          {/* Variable box */}
          <rect x={120} y={1040} width={200} height={100} rx={16}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={220} y={1100} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            t
          </text>
          <text x={220} y={1170} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Train ref
          </text>

          {/* Arrow */}
          <path d="M 320,1090 L 580,1090"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <text x={450} y={1075} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}
            opacity={pointerCard.opacity}>
            POINTS TO
          </text>

          {/* Object in memory */}
          <rect x={600} y={1020} width={350} height={140} rx={16}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.white} strokeWidth={2} />
          <text x={775} y={1075} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            ExpressTrain
          </text>
          <text x={775} y={1120} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            object in heap
          </text>

          {/* Heap label */}
          <text x={775} y={1250} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            HEAP MEMORY
          </text>
        </g>

        {/* Key insight card */}
        <g opacity={diagramCard.opacity} transform={`translate(0, ${diagramCard.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={160} accent />
          <rect x={60} y={1360} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1430} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The variable
          </text>
          <text x={370} y={1430} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            {' t '}
          </text>
          <text x={410} y={1430} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            has type Train — the parent
          </text>
          <text x={100} y={1480} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            It only sees Train-level methods
          </text>
        </g>

        {/* Floating accents */}
        <circle cx={900} cy={550 + breathe} r={6} fill={COLORS.accent} opacity={0.18 * shimmer} />
        <circle cx={160} cy={1080 + breathe * 0.8} r={5} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <g transform={`translate(220, ${1100})`}>
          <circle r={24} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.1 * shimmer} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
