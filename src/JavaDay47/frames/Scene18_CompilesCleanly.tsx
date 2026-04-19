/**
 * Scene 18 — Cast Compiles Cleanly
 * "The cast itself compiles cleanly."
 * CSV: 65.740s → 68.540s
 * Duration: ~84 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–55): Compiler output terminal + checkmark
 *   Phase 3 (frames 45–end): Subtlety emphasis
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

export const Scene18_CompilesCleanly: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const codeEnt = useSpringEntrance(frame, 16);
  const termEnt = useSpringEntrance(frame, 28);
  const checkEnt = useSpringEntrance(frame, 40);
  const warnEnt = useSpringEntrance(frame, 52);

  // Checkmark draw
  const checkLen = 60;
  const checkDash = usePathDraw(frame, 42, checkLen, 15);

  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[17];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="COMPILER · BLIND SPOT" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            The cast compiles
          </text>
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            cleanly
          </text>
        </g>

        {/* Code card */}
        <g opacity={codeEnt.opacity} transform={`translate(0, ${codeEnt.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={180} accent />
          <rect x={60} y={500} width={8} height={180} rx={4} fill={COLORS.accent} />
          <text x={100} y={570} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            <tspan fill={COLORS.accent}>ExpressTrain</tspan>
            <tspan fill={COLORS.text_muted}>{' et = ('}</tspan>
            <tspan fill={COLORS.accent}>ExpressTrain</tspan>
            <tspan fill={COLORS.text_muted}>{') t;'}</tspan>
          </text>
          <text x={100} y={650}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            This line has no syntax errors
          </text>
        </g>

        {/* Terminal output */}
        <g opacity={termEnt.opacity} transform={`translate(0, ${termEnt.translateY})`}>
          <BentoCard x={60} y={720} w={960} h={340} />

          {/* Terminal header */}
          <rect x={60} y={720} width={960} height={50} rx={20}
            fill="rgba(255,255,255,0.04)" />
          <circle cx={100} cy={745} r={8} fill={COLORS.vibrant_red} opacity={0.5} />
          <circle cx={125} cy={745} r={8} fill={COLORS.accent} opacity={0.3} />
          <circle cx={150} cy={745} r={8} fill="rgba(255,255,255,0.2)" />
          <text x={540} y={752} textAnchor="middle"
            fontFamily={MONO} fontSize={20} fontWeight={500} fill={COLORS.text_muted}>
            javac TicketingEngine.java
          </text>

          {/* Output lines */}
          <text x={100} y={810} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            $ javac TicketingEngine.java
          </text>
          <text x={100} y={850} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>
            Compiling...
          </text>
          <text x={100} y={890} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>
            BUILD SUCCESSFUL
          </text>
          <text x={100} y={930} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            0 errors, 0 warnings
          </text>
          <text x={100} y={970} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            $
          </text>

          {/* Blinking cursor */}
          <rect x={120} y={955} width={14} height={22}
            fill={COLORS.accent} opacity={Math.sin(frame * 0.2) > 0 ? 0.7 : 0} />
        </g>

        {/* Big checkmark */}
        <g opacity={checkEnt.opacity}>
          <circle cx={540} cy={1160} r={60}
            fill={COLORS.accent} fillOpacity={0.08} />
          <circle cx={540} cy={1160} r={60}
            fill="none" stroke={COLORS.accent} strokeWidth={3} opacity={0.5} />
          <path d="M 510,1160 L 530,1185 L 575,1135"
            fill="none" stroke={COLORS.accent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={checkLen} strokeDashoffset={checkDash} />
        </g>

        {/* Warning emphasis */}
        <g opacity={warnEnt.opacity} transform={`translate(0, ${warnEnt.translateY})`}>
          <BentoCard x={60} y={1270} w={960} h={200} />
          <rect x={60} y={1270} width={8} height={200} rx={4} fill={COLORS.accent} />

          <text x={540} y={1340} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The compiler sees a parent-child relationship
          </text>
          <text x={540} y={1395} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            and assumes the cast could be valid
          </text>
          <text x={540} y={1440} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            It does not check the actual object type
          </text>
        </g>

        <circle cx={160} cy={1560 + breathe} r={3} fill={COLORS.accent} opacity={0.1 * shimmer} />
        <circle cx={920} cy={1600 - breathe} r={4} fill={COLORS.accent} opacity={0.08} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s18.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
