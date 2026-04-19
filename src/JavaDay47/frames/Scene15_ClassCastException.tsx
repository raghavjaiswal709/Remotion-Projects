/**
 * Scene 15 — ClassCastException
 * "Java throws a class cast exception at runtime,"
 * CSV: 56.620s → 60.080s
 * Duration: ~104 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + hero error text
 *   Phase 2 (frames 20–60): Stack trace card + explosion illustration
 *   Phase 3 (frames 50–end): Pulsing error, shaking
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

export const Scene15_ClassCastException: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const heroEnt = useSpringEntrance(frame, 6);
  const errorCard = useSpringEntrance(frame, 14);
  const stackCard = useSpringEntrance(frame, 26);
  const explainCard = useSpringEntrance(frame, 38);
  const runtimeCard = useSpringEntrance(frame, 50);

  // Lightning bolt path draw
  const boltLen = 300;
  const boltDash = usePathDraw(frame, 20, boltLen, 20);

  const breathe = Math.sin(frame * 0.06) * 4;
  const errorPulse = 0.5 + Math.sin(frame * 0.15) * 0.5;
  const shake = frame > 20 && frame < 40 ? Math.sin(frame * 2.5) * 3 : 0;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[14];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="EXCEPTION · RUNTIME" y={160} opacity={0.8} />
        </g>

        {/* Hero: ClassCastException */}
        <g transform={`translate(${shake}, ${heroEnt.translateY})`} opacity={heroEnt.opacity}>
          <text x={540} y={320} textAnchor="middle"
            fontFamily={MONO} fontSize={52} fontWeight={700} fill={COLORS.vibrant_red}>
            ClassCastException
          </text>
          {/* Ghost */}
          <text x={540} y={320} textAnchor="middle"
            fontFamily={MONO} fontSize={72} fontWeight={700}
            fill={COLORS.vibrant_red} opacity={0.05 * errorPulse}>
            ClassCastException
          </text>
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            Java throws this at
          </text>
          <text x={540} y={460} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.vibrant_red}
            fontStyle="italic">
            runtime
          </text>
        </g>

        {/* Lightning bolt */}
        <path d="M 540,480 L 520,540 L 560,540 L 530,620"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
          strokeDasharray={boltLen} strokeDashoffset={boltDash}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Error message card — stack trace style */}
        <g opacity={errorCard.opacity} transform={`translate(${shake}, ${errorCard.translateY})`}>
          <BentoCard x={60} y={650} w={960} h={260} accent />
          <rect x={60} y={650} width={960} height={50} rx={0}
            fill={COLORS.vibrant_red} fillOpacity={0.12} />
          <text x={100} y={685} fontFamily={MONO} fontSize={24} fontWeight={500}
            fill={COLORS.vibrant_red}>
            Exception in thread "main"
          </text>
          <text x={100} y={740} fontFamily={MONO} fontSize={28} fontWeight={700}
            fill={COLORS.vibrant_red}>
            java.lang.ClassCastException:
          </text>
          <text x={100} y={785} fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>
            FreightTrain cannot be cast to
          </text>
          <text x={100} y={825} fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.accent}>
            ExpressTrain
          </text>
          <text x={100} y={875} fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.5}>
            at TicketingEngine.main(TicketingEngine.java:12)
          </text>
        </g>

        {/* Explanation */}
        <g opacity={stackCard.opacity} transform={`translate(0, ${stackCard.translateY})`}>
          <BentoCard x={60} y={950} w={960} h={160} />
          <rect x={60} y={950} width={8} height={160} rx={4} fill={COLORS.vibrant_red} />
          <text x={110} y={1020} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The JVM checked the actual object type
          </text>
          <text x={110} y={1075} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            FreightTrain IS-NOT-A ExpressTrain — cast rejected
          </text>
        </g>

        {/* Runtime vs Compile */}
        <g opacity={explainCard.opacity} transform={`translate(0, ${explainCard.translateY})`}>
          <BentoCard x={60} y={1150} w={460} h={160} />
          <text x={290} y={1210} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} letterSpacing="0.1em">
            COMPILE TIME
          </text>
          <text x={290} y={1270} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            No error
          </text>
        </g>

        <g opacity={explainCard.opacity} transform={`translate(0, ${explainCard.translateY})`}>
          <BentoCard x={560} y={1150} w={460} h={160} accent />
          <rect x={560} y={1150} width={8} height={160} rx={4} fill={COLORS.vibrant_red} />
          <text x={790} y={1210} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red} letterSpacing="0.1em">
            RUNTIME
          </text>
          <text x={790} y={1270} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            CRASH
          </text>
        </g>

        {/* Bottom runtime emphasis */}
        <g opacity={runtimeCard.opacity} transform={`translate(0, ${runtimeCard.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={120} />
          <text x={540} y={1435} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            This error only appears when the
            <tspan fill={COLORS.vibrant_red} fontStyle="italic"> program runs</tspan>
          </text>
        </g>

        {/* Pulsing danger circles */}
        <circle cx={100} cy={1550 + breathe} r={5} fill={COLORS.vibrant_red} opacity={0.12 * shimmer} />
        <circle cx={980} cy={1600 - breathe} r={4} fill={COLORS.vibrant_red} opacity={0.1 * shimmer} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
