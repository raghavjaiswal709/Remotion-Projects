/**
 * Scene 16 — NotATask
 * "Now here is not a task."
 * CSV: 49.620s → 51.180s
 * Duration: ~72 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 18–70):  Large "X" cross-out over invalid task, warning signs
 *   Phase 3 (frames 50+):    Shake on invalid card, pulse on X
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

export const Scene16_NotATask: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const cardEntrance   = useSpringEntrance(frame, 18);
  const xStrikeEntrance = useSpringEntrance(frame, 30);
  const warningCard1   = useSpringEntrance(frame, 38);
  const warningCard2   = useSpringEntrance(frame, 48);
  const contrastCard   = useSpringEntrance(frame, 56);

  // X cross paths
  const xLen = 500;
  const x1Dash = usePathDraw(frame, 30, xLen, 14);
  const x2Dash = usePathDraw(frame, 34, xLen, 14);

  // Warning triangle draw
  const triLen = 200;
  const triDash = usePathDraw(frame, 40, triLen, 16);

  // Border draw on invalid card
  const borderPerim = 2 * (860 + 340);
  const borderDash = usePathDraw(frame, 20, borderPerim, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const shake = frame > 35 ? Math.sin(frame * 0.5) * interpolate(frame, [35, 70], [6, 0], {
    extrapolateRight: 'clamp',
  }) : 0;
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TASK DEFINITION · COUNTER-EXAMPLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Not a Task
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.vibrant_red}>
            Missing required components
          </text>
        </g>

        {/* ── "NOT A TASK" badge ──────────────────────────────────────────── */}
        <g opacity={headlineB.opacity} transform={`translate(0, ${headlineB.translateY})`}>
          <rect x={60} y={430} width={200} height={44} rx={22}
            fill={COLORS.vibrant_red} fillOpacity={0.12}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={160} y={460} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}>
            INVALID
          </text>
        </g>

        {/* ── Invalid task card (with shake + strike-through) ─────────────── */}
        <g transform={`translate(${shake}, 0)`}>
          <g opacity={cardEntrance.opacity} transform={`translate(0, ${cardEntrance.translateY})`}>
            {/* Card with animated border */}
            <rect x={110} y={510} width={860} height={340} rx={20}
              fill={COLORS.bg_secondary}
              stroke={COLORS.vibrant_red} strokeWidth={2.5}
              strokeDasharray={borderPerim} strokeDashoffset={borderDash} />

            {/* Content inside invalid card */}
            <text x={165} y={580} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
              "Help me with flights"
            </text>

            {/* Missing items list */}
            <g>
              {/* Missing start state */}
              <text x={165} y={650} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
                ? Start state — undefined
              </text>
              {/* Missing end state */}
              <text x={165} y={694} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
                ? End state — undefined
              </text>
              {/* Missing criterion */}
              <text x={165} y={738} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
                ? Criterion — undefined
              </text>
            </g>

            {/* Dashed placeholder lines (skeleton of missing data) */}
            {Array.from({ length: 3 }, (_, i) => (
              <line key={i}
                x1={420} y1={640 + i * 44} x2={900} y2={640 + i * 44}
                stroke="rgba(255,255,255,0.08)" strokeWidth={2}
                strokeDasharray="12,8" />
            ))}
          </g>

          {/* ── X strike-through lines ────────────────────────────────────── */}
          <g opacity={xStrikeEntrance.opacity}>
            <line x1={140} y1={530} x2={940} y2={830}
              stroke={COLORS.vibrant_red} strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={xLen} strokeDashoffset={x1Dash} />
            <line x1={940} y1={530} x2={140} y2={830}
              stroke={COLORS.vibrant_red} strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={xLen} strokeDashoffset={x2Dash} />
          </g>
        </g>

        {/* ── Warning card 1 ─────────────────────────────────────────────── */}
        <g opacity={warningCard1.opacity} transform={`translate(0, ${warningCard1.translateY})`}>
          <BentoCard x={60} y={890} w={460} h={240} />

          {/* Warning triangle */}
          <g transform="translate(180, 990)">
            <path d="M 0,-40 L 36,28 L -36,28 Z"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
              strokeLinejoin="round"
              strokeDasharray={triLen} strokeDashoffset={triDash} />
            <text x={0} y={16} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
              !
            </text>
          </g>

          <text x={100} y={1065} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Where to?
          </text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            No destination specified
          </text>
        </g>

        {/* ── Warning card 2 ─────────────────────────────────────────────── */}
        <g opacity={warningCard2.opacity} transform={`translate(0, ${warningCard2.translateY})`}>
          <BentoCard x={560} y={890} w={460} h={240} />

          {/* Confused icon */}
          <g transform={`translate(680, 990) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={36} fill="none"
              stroke={COLORS.vibrant_red} strokeWidth={2.5} />
            {/* Confused face */}
            <circle cx={-12} cy={-8} r={4} fill={COLORS.vibrant_red} />
            <circle cx={12} cy={-8} r={4} fill={COLORS.vibrant_red} />
            <path d="M -14,12 C -8,8 8,16 14,10"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
              strokeLinecap="round" />
          </g>

          <text x={600} y={1065} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            When done?
          </text>
          <text x={600} y={1100} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            No completion criterion
          </text>
        </g>

        {/* ── Contrast card — what's missing ─────────────────────────────── */}
        <g opacity={contrastCard.opacity} transform={`translate(0, ${contrastCard.translateY})`}>
          <BentoCard x={60} y={1170} w={960} h={200} />
          <rect x={60} y={1170} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />

          {/* Robot with question mark */}
          <g transform="translate(120, 1270)">
            {/* Robot head */}
            <rect x={-22} y={-24} width={44} height={36} rx={6}
              fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
            {/* Eyes */}
            <circle cx={-8} cy={-8} r={4} fill={COLORS.text_muted} />
            <circle cx={8} cy={-8} r={4} fill={COLORS.text_muted} />
            {/* Question mark speech bubble */}
            <rect x={28} y={-42} width={32} height={28} rx={6}
              fill={COLORS.vibrant_red} fillOpacity={0.15}
              stroke={COLORS.vibrant_red} strokeWidth={1.5} />
            <text x={44} y={-22} textAnchor="middle"
              fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}>
              ?
            </text>
          </g>

          <text x={180} y={1250} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Agent cannot plan without structure
          </text>
          <text x={180} y={1290} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            "Help me with flights" gives zero actionable direction
          </text>
          <text x={180} y={1325} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.vibrant_red}>
            Result: endless loop or arbitrary output
          </text>
        </g>

        {/* ── Bottom comparison strip ─────────────────────────────────────── */}
        <g opacity={contrastCard.opacity * 0.8}>
          {/* Valid vs Invalid mini labels */}
          <BentoCard x={60} y={1410} w={460} h={100} />
          <circle cx={120} cy={1460} r={16}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <path d="M 112,1460 L 118,1468 L 130,1452"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round"
            strokeLinejoin="round" />
          <text x={148} y={1468} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Valid: start + end + criterion
          </text>

          <BentoCard x={560} y={1410} w={460} h={100} />
          <circle cx={620} cy={1460} r={16}
            fill={COLORS.vibrant_red} fillOpacity={0.15}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <line x1={610} y1={1450} x2={630} y2={1470}
            stroke={COLORS.vibrant_red} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={630} y1={1450} x2={610} y2={1470}
            stroke={COLORS.vibrant_red} strokeWidth={2.5} strokeLinecap="round" />
          <text x={648} y={1468} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            Invalid: "help me"
          </text>
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.2}>
          <circle cx={120} cy={1580 + breathe} r={2.5} fill={COLORS.vibrant_red} />
          <circle cx={900} cy={1650 + breathe * 0.7} r={2} fill={COLORS.vibrant_red} />
          <circle cx={540} cy={1710 + breathe * 1.2} r={3} fill={COLORS.accent} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
