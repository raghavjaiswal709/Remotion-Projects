/**
 * Scene06 — The Typo Question
 * "But what if there's a typo?"
 * CSV: 23.78s -> 25.28s
 * Duration: 63 frames (2.1s) — short dramatic scene
 *
 * Animation phases:
 *   Phase 1 (frames 0-15):  Label + headline spring
 *   Phase 2 (frames 12-40): Giant question mark + "typo" word with glitch effect
 *   Phase 3 (frames 35-end): Pulse, shimmer, floating ? marks
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene06_TypoQuestion: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 4);

  // ── Phase 2: Giant question mark ───────────────────────────────────────────
  const questionSnap = spring({ frame: Math.max(0, frame - 8), fps: 30, config: SPRING_SNAP });
  const questionScale = interpolate(questionSnap, [0, 1], [0.4, 1]);
  const questionOpacity = interpolate(questionSnap, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Typo word entrance
  const typoEntrance = useSpringEntrance(frame, 14);

  // Warning bars
  const bar1 = useSpringEntrance(frame, 18);
  const bar2 = useSpringEntrance(frame, 22);
  const bar3 = useSpringEntrance(frame, 26);

  // Strike-through animation on code
  const strikeWidth = interpolate(frame, [20, 35], [0, 500], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Code reveal
  const codeBlock = useSpringEntrance(frame, 16);

  // ── Path draw for underlines ───────────────────────────────────────────────
  const underlineLen = 400;
  const underlineDash = usePathDraw(frame, 20, underlineLen, 15);

  // Alert card
  const alertCard = useSpringEntrance(frame, 30);
  const alertPerim = 2 * (960 + 120);
  const alertBorderDash = interpolate(frame, [32, 50], [alertPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Explanation card
  const explainCard = useSpringEntrance(frame, 36);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.08) * 4;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.8, 1]);

  // Floating question marks
  const float1 = Math.sin(frame * 0.09 + 0.5) * 8;
  const float2 = Math.sin(frame * 0.07 + 1.2) * 6;
  const float3 = Math.sin(frame * 0.11 + 2.0) * 10;
  const float4 = Math.sin(frame * 0.08 + 3.0) * 7;

  // Red warning pulse
  const warnPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.5, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · RISK" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={540} y={260}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={800}
            fill={COLORS.deep_black}
          >
            But what if...
          </text>
        </g>

        {/* ── ZONE C — Giant question mark + typo ─────────────────────────── */}

        {/* Ghost question mark background */}
        <text
          x={540} y={720}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={480} fontWeight={900}
          fill={COLORS.vibrant_red}
          opacity={questionOpacity * 0.04}
          transform={`scale(${questionScale * 1.15})`}
          style={{ transformOrigin: '540px 600px' }}
        >
          ?
        </text>

        {/* Main question mark */}
        <text
          x={540} y={700}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={360} fontWeight={900}
          fill={COLORS.vibrant_red}
          opacity={questionOpacity * 0.8}
          transform={`scale(${questionScale * pulse})`}
          style={{ transformOrigin: '540px 600px' }}
        >
          ?
        </text>

        {/* "TYPO" label */}
        <g opacity={typoEntrance.opacity} transform={`translate(540, ${840 + typoEntrance.translateY})`}>
          <text
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={96} fontWeight={900}
            fill={COLORS.vibrant_red}
            letterSpacing="0.2em"
            opacity={warnPulse}
          >
            TYPO
          </text>
        </g>

        {/* Warning underline */}
        <path
          d={`M 340,860 L 740,860`}
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
          strokeDasharray={underlineLen} strokeDashoffset={underlineDash}
          strokeLinecap="round"
          opacity={0.6}
        />

        {/* ── Code example showing the problem ────────────────────────────── */}
        <g opacity={codeBlock.opacity} transform={`translate(0, ${codeBlock.translateY})`}>
          <rect x={60} y={920} width={960} height={180} rx={10}
            fill={COLORS.deep_black} fillOpacity={0.04} />
          <rect x={60} y={920} width={6} height={180} rx={3} fill={COLORS.vibrant_red} />

          {/* The typo line */}
          <text x={100} y={980} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver}>
            calculate
          </text>
          <text x={328} y={980} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={700} fill={COLORS.vibrant_red}>
            f
          </text>
          <text x={348} y={980} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver}>
            are(int distance)
          </text>

          {/* Arrow pointing to the lowercase f */}
          <g opacity={bar1.opacity}>
            <line x1={335} y1={995} x2={335} y2={1030} stroke={COLORS.vibrant_red} strokeWidth={2.5} />
            <text x={335} y={1060} textAnchor="middle" fontFamily="'Inter', sans-serif"
              fontSize={24} fontWeight={700} fill={COLORS.vibrant_red}>
              lowercase f!
            </text>
          </g>

          {/* vs correct */}
          <text x={100} y={1070} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver} opacity={0.4}>
            calculate
          </text>
          <text x={328} y={1070} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={700} fill={COLORS.green} opacity={0.4}>
            F
          </text>
          <text x={348} y={1070} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver} opacity={0.4}>
            are(int distance)
          </text>

          {/* Strike-through on wrong line */}
          <line x1={90} y1={974} x2={90 + strikeWidth} y2={974}
            stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.4}
          />
        </g>

        {/* ── Warning bars ────────────────────────────────────────────────── */}
        <g opacity={bar1.opacity} transform={`translate(0, ${bar1.translateY * 0.3})`}>
          <rect x={100} y={1160} width={880} height={4} rx={2} fill={COLORS.vibrant_red} opacity={0.15 * warnPulse} />
        </g>
        <g opacity={bar2.opacity} transform={`translate(0, ${bar2.translateY * 0.3})`}>
          <rect x={200} y={1175} width={680} height={3} rx={2} fill={COLORS.vibrant_red} opacity={0.1 * warnPulse} />
        </g>
        <g opacity={bar3.opacity} transform={`translate(0, ${bar3.translateY * 0.3})`}>
          <rect x={300} y={1188} width={480} height={2} rx={1} fill={COLORS.vibrant_red} opacity={0.07 * warnPulse} />
        </g>

        {/* ── Alert card ──────────────────────────────────────────────────── */}
        <g opacity={alertCard.opacity} transform={`translate(60, ${1230 + alertCard.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.05} />
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray={alertPerim} strokeDashoffset={alertBorderDash} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.vibrant_red} />
          <text x={36} y={50} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.vibrant_red}>
            A single character changes everything
          </text>
          <text x={36} y={92} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            The 'F' vs 'f' — different method entirely
          </text>
        </g>

        {/* ── Explain card ────────────────────────────────────────────────── */}
        <g opacity={explainCard.opacity} transform={`translate(60, ${1390 + explainCard.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.05} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.orange} />
          <text x={36} y={60} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={600} fill={COLORS.deep_black}>
            Java won't warn you — it silently creates a new method
          </text>
        </g>

        {/* ── Phase 3: Floating question marks ────────────────────────────── */}
        <g opacity={0.08 * shimmer}>
          <text x={120} y={400 + float1} fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={900}
            fill={COLORS.vibrant_red}>
            ?
          </text>
        </g>
        <g opacity={0.06 * shimmer}>
          <text x={900} y={500 + float2} fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={900}
            fill={COLORS.vibrant_red}>
            ?
          </text>
        </g>
        <g opacity={0.05 * shimmer}>
          <text x={200} y={1600 + float3} fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
            fill={COLORS.vibrant_red}>
            ?
          </text>
        </g>
        <g opacity={0.07 * shimmer}>
          <text x={850} y={1550 + float4} fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={900}
            fill={COLORS.vibrant_red}>
            ?
          </text>
        </g>

        {/* Breathing circle accent */}
        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.vibrant_red} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.vibrant_red} strokeWidth={1}
            opacity={0.08} transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
