/**
 * Scene 16 — Not Compile Time, Runtime
 * "not at compile time, at runtime."
 * CSV: 60.080s → 62.680s
 * Duration: ~78 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–55): Timeline compile→runtime + strike-through
 *   Phase 3 (frames 45–end): Runtime pulse
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

export const Scene16_NotCompileRuntime: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const timelineEnt = useSpringEntrance(frame, 14);
  const compileCard = useSpringEntrance(frame, 22);
  const runtimeCard = useSpringEntrance(frame, 34);
  const emphasisCard = useSpringEntrance(frame, 46);

  // Timeline line
  const timelineLen = 860;
  const timelineDash = usePathDraw(frame, 16, timelineLen, 25);

  // Strike-through on "compile time"
  const strikeLen = 320;
  const strikeDash = usePathDraw(frame, 30, strikeLen, 15);

  const breathe = Math.sin(frame * 0.06) * 4;
  const runtimePulse = 0.6 + Math.sin(frame * 0.12) * 0.4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[15];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TIMING · DISTINCTION" y={160} opacity={0.8} />
        </g>

        {/* Headline */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Not at compile time
          </text>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.vibrant_red}
            fontStyle="italic">
            At runtime.
          </text>
        </g>

        {/* Timeline bar */}
        <g opacity={timelineEnt.opacity}>
          <line x1={110} y1={560} x2={970} y2={560}
            stroke={COLORS.text_muted} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={timelineLen} strokeDashoffset={timelineDash} />
          {/* Arrow at end */}
          <polygon points="970,550 990,560 970,570"
            fill={COLORS.text_muted} opacity={timelineEnt.progress} />
        </g>

        {/* Compile time node — struck through */}
        <g opacity={compileCard.opacity} transform={`translate(0, ${compileCard.translateY})`}>
          {/* Node dot */}
          <circle cx={280} cy={560} r={12} fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={3} />
          {/* Card */}
          <BentoCard x={120} y={600} w={320} h={200} />
          <text x={280} y={665} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted} letterSpacing="0.1em">
            COMPILE TIME
          </text>
          <text x={280} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            javac passes
          </text>
          <text x={280} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            No error detected
          </text>
          {/* Strike-through line */}
          <line x1={140} y1={700} x2={420} y2={700}
            stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={strikeLen} strokeDashoffset={strikeDash}
            opacity={0.7} />
        </g>

        {/* Runtime node — highlighted */}
        <g opacity={runtimeCard.opacity} transform={`translate(0, ${runtimeCard.translateY})`}>
          {/* Node dot — pulsing */}
          <circle cx={760} cy={560} r={12}
            fill={COLORS.vibrant_red} opacity={runtimePulse} />
          <circle cx={760} cy={560} r={20}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            opacity={0.2 * runtimePulse} />
          {/* Card */}
          <BentoCard x={600} y={600} w={360} h={200} accent />
          <rect x={600} y={600} width={8} height={200} rx={4} fill={COLORS.vibrant_red} />
          <text x={780} y={665} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red} letterSpacing="0.1em">
            RUNTIME
          </text>
          <text x={780} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.vibrant_red}>
            JVM crashes
          </text>
          <text x={780} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            ClassCastException
          </text>
        </g>

        {/* Visual metaphor — two phases of Java */}
        <g opacity={emphasisCard.opacity} transform={`translate(0, ${emphasisCard.translateY})`}>
          <BentoCard x={60} y={860} w={960} h={280} />

          {/* Compile phase */}
          <text x={290} y={935} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Phase 1: Compile
          </text>
          {/* Checkmark */}
          <g transform="translate(290, 1000)">
            <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.1} />
            <path d="M -12,0 L -3,10 L 14,-10"
              fill="none" stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
          </g>
          <text x={290} y={1065} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Syntax OK, types match
          </text>
          <text x={290} y={1105} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            on paper
          </text>

          {/* Divider */}
          <line x1={540} y1={890} x2={540} y2={1120}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Runtime phase */}
          <text x={780} y={935} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            Phase 2: Runtime
          </text>
          {/* X mark */}
          <g transform="translate(780, 1000)">
            <circle cx={0} cy={0} r={30} fill={COLORS.vibrant_red} fillOpacity={0.1} opacity={runtimePulse} />
            <path d="M -12,-12 L 12,12 M 12,-12 L -12,12"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          </g>
          <text x={780} y={1065} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Actual object checked
          </text>
          <text x={780} y={1105} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            MISMATCH → CRASH
          </text>
        </g>

        {/* Bottom key insight */}
        <g opacity={emphasisCard.opacity} transform={`translate(0, ${emphasisCard.translateY})`}>
          <BentoCard x={60} y={1190} w={960} h={120} />
          <text x={540} y={1268} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The compiler cannot catch this bug — only the JVM can
          </text>
        </g>

        <circle cx={150} cy={1400 + breathe} r={4} fill={COLORS.vibrant_red} opacity={0.12 * shimmer} />
        <circle cx={930} cy={1450 - breathe} r={3} fill={COLORS.accent} opacity={0.08 * shimmer} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s16.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
