/**
 * Scene 09 — Cast Syntax
 * "Express train ET equals Express train T."
 * CSV: 35.940s → 40.380s
 * Duration: ~133 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline
 *   Phase 2 (frames 20–70):  Full code line breakdown
 *   Phase 3 (frames 60–end): Micro-animations
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

export const Scene09_CastSyntax: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);

  const codeCard = useSpringEntrance(frame, 18);
  const part1 = useSpringEntrance(frame, 26);
  const part2 = useSpringEntrance(frame, 34);
  const part3 = useSpringEntrance(frame, 42);
  const part4 = useSpringEntrance(frame, 50);
  const summaryCard = useSpringEntrance(frame, 60);

  // Underline path draws
  const underlineLen = 300;
  const underline1 = usePathDraw(frame, 30, underlineLen, 20);
  const underline2 = usePathDraw(frame, 38, underlineLen, 20);

  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[8];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="CAST SYNTAX" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            The Cast Line
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            Broken Down
          </text>
        </g>

        {/* Full code line card */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={140} accent />
          <text x={100} y={590} fontFamily={MONO} fontSize={38} fontWeight={700} fill={COLORS.white}>
            <tspan fill={COLORS.accent}>ExpressTrain</tspan>
            <tspan> et = </tspan>
            <tspan fill={COLORS.accent}>(ExpressTrain)</tspan>
            <tspan> t;</tspan>
          </text>
        </g>

        {/* Part breakdown cards */}
        <g opacity={part1.opacity} transform={`translate(0, ${part1.translateY})`}>
          <BentoCard x={60} y={680} w={460} h={200} />
          <text x={100} y={730} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            PART 1 — RESULT TYPE
          </text>
          <text x={100} y={790} fontFamily={MONO} fontSize={36} fontWeight={700} fill={COLORS.accent}>
            ExpressTrain et
          </text>
          <line x1={100} y1={800} x2={400} y2={800}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.3}
            strokeDasharray={underlineLen} strokeDashoffset={underline1} />
          <text x={100} y={840} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Variable of child type
          </text>
        </g>

        <g opacity={part2.opacity} transform={`translate(0, ${part2.translateY})`}>
          <BentoCard x={560} y={680} w={460} h={200} />
          <text x={600} y={730} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            PART 2 — THE CAST
          </text>
          <text x={600} y={790} fontFamily={MONO} fontSize={36} fontWeight={700} fill={COLORS.accent}>
            (ExpressTrain)
          </text>
          <line x1={600} y1={800} x2={900} y2={800}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.3}
            strokeDasharray={underlineLen} strokeDashoffset={underline2} />
          <text x={600} y={840} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Explicit type instruction
          </text>
        </g>

        <g opacity={part3.opacity} transform={`translate(0, ${part3.translateY})`}>
          <BentoCard x={60} y={920} w={460} h={200} />
          <text x={100} y={970} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            PART 3 — SOURCE
          </text>
          <text x={100} y={1030} fontFamily={MONO} fontSize={42} fontWeight={700} fill={COLORS.white}>
            t
          </text>
          <text x={100} y={1080} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Parent-type reference
          </text>
        </g>

        <g opacity={part4.opacity} transform={`translate(0, ${part4.translateY})`}>
          <BentoCard x={560} y={920} w={460} h={200} />
          <text x={600} y={970} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            FLOW
          </text>
          {/* Arrow flow diagram */}
          <text x={620} y={1030} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Train t
          </text>
          <path d="M 760,1028 L 830,1028" fill="none" stroke={COLORS.accent} strokeWidth={3}
            markerEnd="url(#arrow)" />
          <text x={850} y={1030} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            et
          </text>
          <text x={600} y={1080} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Narrowed to ExpressTrain
          </text>
        </g>

        {/* Summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={140} />
          <rect x={60} y={1180} width={8} height={140} rx={4} fill={COLORS.accent} />
          <text x={110} y={1260} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Result = child type | Cast = type narrowing | Source = parent ref
          </text>
        </g>

        {/* Train illustration at bottom */}
        <g opacity={summaryCard.opacity * 0.6} transform={`translate(160, ${1400 + breathe})`}>
          {/* Simple train */}
          <rect x={0} y={20} width={260} height={80} rx={8} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={260} y={0} width={100} height={100} rx={8} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={60} cy={120} r={22} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={180} cy={120} r={22} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={310} cy={120} r={22} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Smokestack */}
          <rect x={290} y={-20} width={30} height={25} rx={4} fill={COLORS.accent} fillOpacity={0.3} />
          {/* Label */}
          <text x={130} y={70} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            EXPRESS
          </text>
          {/* Tracks */}
          <line x1={-40} y1={144} x2={400} y2={144} stroke={COLORS.text_muted} strokeWidth={3} />
          <line x1={-40} y1={150} x2={400} y2={150} stroke={COLORS.text_muted} strokeWidth={3} />
          {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => (
            <rect key={x} x={x - 20} y={143} width={16} height={8} fill={COLORS.text_muted} opacity={0.4} />
          ))}
        </g>

        <circle cx={960} cy={460 + breathe} r={5} fill={COLORS.accent} opacity={0.15 * shimmer} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
