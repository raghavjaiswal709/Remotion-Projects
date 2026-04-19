/**
 * Scene 21 — VagueInVagueOut
 * "Vague task in, vague agent behavior out."
 * CSV: 68.420s → 71.620s
 * Duration: ~96 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline springs
 *   Phase 2 (frames 18–70):  Input-output machine diagram: left card (vague) → arrow → box → arrow → right card (vague)
 *   Phase 3 (frames 60+):    Pulse on machine, static noise particles, orbiting warning dots
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene21_VagueInVagueOut: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 5);
  const headB  = useSpringEntrance(frame, 10);

  // ── Phase 2 — Input → Machine → Output ─────────────────────────────────────
  const inputCard   = useSpringEntrance(frame, 18);
  const machineCard = useSpringEntrance(frame, 28);
  const outputCard  = useSpringEntrance(frame, 38);
  const bottomCard  = useSpringEntrance(frame, 50);

  // Arrows
  const arrow1Len = 120;
  const arrow1Dash = usePathDraw(frame, 30, arrow1Len, 15);
  const arrow2Len = 120;
  const arrow2Dash = usePathDraw(frame, 40, arrow2Len, 15);

  // Machine border draw
  const machPerim = 2 * (360 + 280);
  const machBorderDash = usePathDraw(frame, 28, machPerim, 22);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Static noise for vague text
  const noiseY1 = Math.sin(frame * 0.15) * 3;
  const noiseY2 = Math.cos(frame * 0.12) * 4;
  const noiseX1 = Math.sin(frame * 0.09) * 2;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  // Layout
  const INPUT_X = 60;
  const INPUT_Y = 520;
  const INPUT_W = 260;
  const INPUT_H = 320;
  const MACH_X  = 360;
  const MACH_Y  = 540;
  const MACH_W  = 360;
  const MACH_H  = 280;
  const OUT_X   = 760;
  const OUT_Y   = 520;
  const OUT_W   = 260;
  const OUT_H   = 320;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="GARBAGE IN · GARBAGE OUT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Vague task in,
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.vibrant_red}>
            vague behavior out.
          </text>
        </g>

        {/* ── INPUT card (vague task) ─────────────────────────────────────── */}
        <g opacity={inputCard.opacity} transform={`translate(0, ${inputCard.translateY})`}>
          <rect x={INPUT_X} y={INPUT_Y} width={INPUT_W} height={INPUT_H} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={2} strokeDasharray="8 4" />

          <text x={INPUT_X + INPUT_W / 2} y={INPUT_Y + 40} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}
            letterSpacing="0.1em">
            INPUT
          </text>

          {/* Vague scribbled lines (shaking) */}
          <g transform={`translate(${INPUT_X + 30}, ${INPUT_Y + 70 + noiseY1})`}>
            <rect width={200} height={10} rx={5} fill="rgba(255,255,255,0.08)" />
          </g>
          <g transform={`translate(${INPUT_X + 30 + noiseX1}, ${INPUT_Y + 100})`}>
            <rect width={160} height={10} rx={5} fill="rgba(255,255,255,0.06)" />
          </g>
          <g transform={`translate(${INPUT_X + 30}, ${INPUT_Y + 130 + noiseY2})`}>
            <rect width={180} height={10} rx={5} fill="rgba(255,255,255,0.07)" />
          </g>

          <text x={INPUT_X + INPUT_W / 2} y={INPUT_Y + 200} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            ???
          </text>

          <text x={INPUT_X + INPUT_W / 2} y={INPUT_Y + 260} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            "Help me with flights"
          </text>

          {/* Warning icon */}
          <g transform={`translate(${INPUT_X + INPUT_W / 2}, ${INPUT_Y + 300})`}>
            <polygon points="0,-14 12,10 -12,10" fill="none"
              stroke={COLORS.vibrant_red} strokeWidth={2} />
            <text textAnchor="middle" y={7} fontFamily={FONT}
              fontSize={14} fontWeight={800} fill={COLORS.vibrant_red}>!</text>
          </g>
        </g>

        {/* ── Arrow IN → MACHINE ──────────────────────────────────────────── */}
        <line x1={INPUT_X + INPUT_W + 5} y1={MACH_Y + MACH_H / 2}
          x2={MACH_X - 5} y2={MACH_Y + MACH_H / 2}
          stroke={COLORS.vibrant_red} strokeWidth={2.5}
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── MACHINE box (agent) ─────────────────────────────────────────── */}
        <g opacity={machineCard.opacity} transform={`translate(0, ${machineCard.translateY})`}>
          {/* Animated border */}
          <rect x={MACH_X} y={MACH_Y} width={MACH_W} height={MACH_H} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={machPerim} strokeDashoffset={machBorderDash} />

          <rect x={MACH_X} y={MACH_Y} width={MACH_W} height={MACH_H} rx={20}
            fill={COLORS.bg_secondary} opacity={0.95} />

          {/* Gear icon */}
          <g transform={`translate(${MACH_X + MACH_W / 2}, ${MACH_Y + 80})`}>
            <circle cx={0} cy={0} r={30}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={2}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '0px 0px' }} />
            {/* Teeth */}
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * 45 * Math.PI) / 180;
              return (
                <line key={i}
                  x1={Math.cos(a) * 24} y1={Math.sin(a) * 24}
                  x2={Math.cos(a) * 36} y2={Math.sin(a) * 36}
                  stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
              );
            })}
            <circle cx={0} cy={0} r={10} fill={COLORS.accent} />
          </g>

          <text x={MACH_X + MACH_W / 2} y={MACH_Y + 150} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            AGENT
          </text>
          <text x={MACH_X + MACH_W / 2} y={MACH_Y + 195} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            processing...
          </text>

          {/* Confusion lines */}
          <g opacity={shimmer * 0.5}>
            <text x={MACH_X + MACH_W / 2} y={MACH_Y + 240} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
              ?!?
            </text>
          </g>
        </g>

        {/* ── Arrow MACHINE → OUT ─────────────────────────────────────────── */}
        <line x1={MACH_X + MACH_W + 5} y1={MACH_Y + MACH_H / 2}
          x2={OUT_X - 5} y2={MACH_Y + MACH_H / 2}
          stroke={COLORS.vibrant_red} strokeWidth={2.5}
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── OUTPUT card (vague behavior) ────────────────────────────────── */}
        <g opacity={outputCard.opacity} transform={`translate(0, ${outputCard.translateY})`}>
          <rect x={OUT_X} y={OUT_Y} width={OUT_W} height={OUT_H} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={2} strokeDasharray="8 4" />

          <text x={OUT_X + OUT_W / 2} y={OUT_Y + 40} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}
            letterSpacing="0.1em">
            OUTPUT
          </text>

          {/* Noisy / broken output lines */}
          <g transform={`translate(${OUT_X + 30}, ${OUT_Y + 70 + noiseY2})`}>
            <rect width={200} height={10} rx={5} fill="rgba(255,255,255,0.08)" />
          </g>
          <g transform={`translate(${OUT_X + 30 + noiseX1}, ${OUT_Y + 100})`}>
            <rect width={120} height={10} rx={5} fill="rgba(255,255,255,0.06)" />
          </g>

          <text x={OUT_X + OUT_W / 2} y={OUT_Y + 180} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            ???
          </text>

          <text x={OUT_X + OUT_W / 2} y={OUT_Y + 230} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            Random actions
          </text>
          <text x={OUT_X + OUT_W / 2} y={OUT_Y + 260} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            No stopping point
          </text>
          <text x={OUT_X + OUT_W / 2} y={OUT_Y + 290} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            Unclear results
          </text>
        </g>

        {/* ── Equals sign between ─────────────────────────────────────────── */}
        <g opacity={outputCard.opacity * 0.6}>
          <text x={540} y={900} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            =
          </text>
        </g>

        {/* ── Contrast "Precise vs Vague" strip ──────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          {/* Vague side */}
          <BentoCard x={60} y={960} w={460} h={320} />
          <rect x={60} y={960} width={6} height={320} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={1010} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">VAGUE</text>

          {/* X marks */}
          {['No end state', 'No criterion', 'No plan'].map((t, i) => (
            <g key={i}>
              <text x={100} y={1070 + i * 55} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>
                {t}
              </text>
              {/* X mark */}
              <g transform={`translate(350, ${1062 + i * 55})`}>
                <line x1={-8} y1={-8} x2={8} y2={8}
                  stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
                <line x1={8} y1={-8} x2={-8} y2={8}
                  stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
              </g>
            </g>
          ))}

          {/* Precise side */}
          <BentoCard x={560} y={960} w={460} h={320} accent />
          <rect x={560} y={960} width={6} height={320} rx={3} fill={COLORS.accent} />
          <text x={600} y={1010} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">PRECISE</text>

          {/* Check marks */}
          {['Clear end state', 'Measurable criterion', 'Actionable plan'].map((t, i) => (
            <g key={i}>
              <text x={600} y={1070 + i * 55} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>
                {t}
              </text>
              {/* Check */}
              <path d={`M${850},${1058 + i * 55} l5,8 l12,-16`}
                fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
            </g>
          ))}
        </g>

        {/* ── Bottom rule card ────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={160} />
          <rect x={60} y={1320} width={960} height={6} rx={3} fill={COLORS.accent} />

          <text x={540} y={1380} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Quality of output = Quality of input
          </text>
          <text x={540} y={1430} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Define the task precisely
          </text>
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.3}>
          <circle cx={100} cy={1560 + breathe} r={3} fill={COLORS.vibrant_red} />
          <circle cx={980} cy={1600 + breathe * 0.7} r={2} fill={COLORS.accent} />
          <circle cx={540} cy={1680 + breathe * 1.2} r={2.5} fill={COLORS.accent} opacity={0.4} />
          <circle cx={300} cy={1640 + breathe * 0.5} r={2} fill={COLORS.vibrant_red} opacity={0.3} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s21.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
