/**
 * Scene 08 — Explicit Cast Statement
 * "the code must explicitly tell Java, treat this reference as an Express train."
 * CSV: 30.600s → 35.940s
 * Duration: ~160 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline
 *   Phase 2 (frames 20–80):  Code cast illustration + speech bubble
 *   Phase 3 (frames 70–end): Micro-animations
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene08_ExplicitCast: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  const speechCard = useSpringEntrance(frame, 20);
  const codeCard = useSpringEntrance(frame, 32);
  const arrowEnt = useSpringEntrance(frame, 44);
  const explainCard = useSpringEntrance(frame, 54);
  const summaryCard = useSpringEntrance(frame, 64);

  // Arrow path draw
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 46, arrowLen, 25);

  // Highlight bracket animation
  const bracketPulse = spring({ frame: Math.max(0, frame - 40), fps, config: SPRING_SNAP });
  const bracketScale = interpolate(bracketPulse, [0, 1], [0.8, 1]);

  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[7];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="EXPLICIT INSTRUCTION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Tell Java
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            "Treat this as ExpressTrain"
          </text>
        </g>

        {/* Speech bubble — developer to Java */}
        <g opacity={speechCard.opacity} transform={`translate(0, ${speechCard.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={180} />
          {/* Speech bubble tail */}
          <polygon points="200,680 230,720 260,680" fill={COLORS.bg_secondary} />

          {/* Person icon */}
          <circle cx={140} cy={565} r={28} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={140} cy={555} r={10} fill={COLORS.accent} fillOpacity={0.3} />
          <path d="M 120,575 Q 140,595 160,575" fill="none" stroke={COLORS.accent} strokeWidth={2} />

          <text x={200} y={575} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            "This reference is actually
          </text>
          <text x={200} y={625} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            an ExpressTrain — unlock it!"
          </text>
        </g>

        {/* Code card — the cast */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={240} accent />
          <rect x={60} y={740} width={8} height={240} rx={4} fill={COLORS.accent} />

          <text x={100} y={810} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>
            // Downcasting — explicit cast
          </text>
          <text x={100} y={870} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.white}>
            <tspan fill={COLORS.accent}>ExpressTrain</tspan>
            <tspan> et = </tspan>
          </text>
          {/* Cast bracket highlight */}
          <g transform={`translate(100, 920) scale(${bracketScale})`}
            style={{ transformOrigin: '0px 0px' }}>
            <text fontFamily={MONO} fontSize={36} fontWeight={700} fill={COLORS.accent}>
              (ExpressTrain)
            </text>
          </g>
          <text x={440} y={930} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.white}>
            t;
          </text>
        </g>

        {/* Arrow from code to explanation */}
        <path d="M 540,980 L 540,1060"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Explanation cards */}
        <g opacity={explainCard.opacity} transform={`translate(0, ${explainCard.translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={260} />
          <text x={100} y={1150} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            PARENT TYPE
          </text>
          <text x={100} y={1200} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Train t
          </text>
          <text x={100} y={1260} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Broad reference
          </text>
          <text x={100} y={1300} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Limited access
          </text>
        </g>

        <g opacity={explainCard.opacity} transform={`translate(0, ${explainCard.translateY})`}>
          <BentoCard x={560} y={1080} w={460} h={260} accent />
          <text x={600} y={1150} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            CHILD TYPE
          </text>
          <text x={600} y={1200} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain et
          </text>
          <text x={600} y={1260} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Specific reference
          </text>
          <text x={600} y={1300} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Full access
          </text>
        </g>

        {/* Summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={160} />
          <rect x={60} y={1400} width={8} height={160} rx={4} fill={COLORS.accent} />
          <text x={110} y={1470} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The cast
          </text>
          <text x={275} y={1470} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            (ExpressTrain)
          </text>
          <text x={600} y={1470} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            is the key
          </text>
          <text x={110} y={1520} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Developer explicitly tells Java to narrow the type
          </text>
        </g>

        <circle cx={900} cy={500 + breathe} r={4} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={140} cy={1060 + breathe * 0.7} r={3} fill={COLORS.accent} opacity={0.15} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
