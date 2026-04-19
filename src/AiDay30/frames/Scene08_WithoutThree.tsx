/**
 * Scene 08 — WithoutThree
 * "Without all three, the agent cannot determine when it has succeeded."
 * CSV: 24.020s → 27.480s
 * Duration: ~88 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + warning headline
 *   Phase 2 (frames 20–80):  Three cards with one "missing" (X-mark), confused robot
 *   Phase 3 (frames 60–end): Shake micro-anim on broken card, particles
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

export const Scene08_WithoutThree: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Reveal ────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 11);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1     = useSpringEntrance(frame, 18);
  const card2     = useSpringEntrance(frame, 30);
  const card3     = useSpringEntrance(frame, 42);
  const robotCard = useSpringEntrance(frame, 52);
  const warnCard  = useSpringEntrance(frame, 60);

  // X cross-out path draw on missing card
  const xLen = 140;
  const xDash = usePathDraw(frame, 46, xLen, 18);

  // Chain break connector
  const chainLen = 300;
  const chainDash = usePathDraw(frame, 36, chainLen, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Shake on broken card
  const shake = frame > 48 ? Math.sin(frame * 0.8) * 2 : 0;

  // Question mark bob
  const qBob = Math.sin(frame * 0.12) * 6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · TASK FAILURE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Warning headline ─────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Without All Three
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.vibrant_red}>
            Cannot Succeed
          </text>
        </g>

        {/* ── Three component cards — one broken ─────────────────────────── */}
        {/* Card 1: Start State — OK */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={450} w={300} h={220} />
          <circle cx={120} cy={510} r={20} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <path d="M 110,510 L 117,520 L 133,502" fill="none" stroke={COLORS.accent}
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <text x={100} y={570} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Start
          </text>
          <text x={100} y={610} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            State
          </text>
          <text x={100} y={650} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Defined
          </text>
        </g>

        {/* Card 2: End State — OK */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={390} y={450} w={300} h={220} />
          <circle cx={450} cy={510} r={20} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <path d="M 440,510 L 447,520 L 463,502" fill="none" stroke={COLORS.accent}
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <text x={430} y={570} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            End
          </text>
          <text x={430} y={610} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            State
          </text>
          <text x={430} y={650} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Defined
          </text>
        </g>

        {/* Card 3: Success Criterion — MISSING (broken) */}
        <g opacity={card3.opacity}
          transform={`translate(${shake}, ${card3.translateY})`}>
          <BentoCard x={720} y={450} w={300} h={220} />
          {/* Red X overlay */}
          <circle cx={780} cy={510} r={20} fill={COLORS.vibrant_red} fillOpacity={0.12}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <path d="M 770,500 L 790,520 M 790,500 L 770,520"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={xLen} strokeDashoffset={xDash} />
          <text x={760} y={570} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Success
          </text>
          <text x={760} y={610} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.vibrant_red}>
            Criterion
          </text>
          <text x={760} y={650} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.vibrant_red}>
            MISSING
          </text>
          {/* Dashed border (broken look) */}
          <rect x={720} y={450} width={300} height={220} rx={20}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray="10,8" opacity={0.6} />
        </g>

        {/* ── Chain connector — broken at missing card ───────────────────── */}
        <g opacity={interpolate(frame, [30, 42], [0, 0.7], { extrapolateRight: 'clamp' })}>
          <path d="M 360,560 L 390,560" fill="none" stroke={COLORS.accent}
            strokeWidth={2} strokeDasharray={chainLen} strokeDashoffset={chainDash}
            strokeLinecap="round" />
          <path d="M 690,560 L 720,560" fill="none" stroke={COLORS.vibrant_red}
            strokeWidth={2} strokeDasharray="6,6" opacity={0.5} />
        </g>

        {/* ── Confused robot ─────────────────────────────────────────────── */}
        <g opacity={robotCard.opacity} transform={`translate(0, ${robotCard.translateY})`}>
          <BentoCard x={60} y={720} w={620} h={360} />
          {/* Robot */}
          <g transform="translate(220, 860)">
            {/* Head */}
            <rect x={-45} y={-50} width={90} height={65} rx={14}
              fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
            {/* Eyes — confused (asymmetric) */}
            <circle cx={-18} cy={-22} r={7} fill={COLORS.text_muted} opacity={shimmer} />
            <line x1={10} y1={-28} x2={26} y2={-16} stroke={COLORS.text_muted} strokeWidth={2}
              strokeLinecap="round" />
            {/* Frown */}
            <path d="M -12,2 Q 0,-6 12,2" fill="none" stroke={COLORS.text_muted}
              strokeWidth={2} strokeLinecap="round" />
            {/* Antenna with wobble */}
            <line x1={0} y1={-50} x2={shake * 0.5} y2={-72} stroke={COLORS.text_muted}
              strokeWidth={2} />
            <circle cx={shake * 0.5} cy={-77} r={5} fill={COLORS.text_muted} opacity={0.6} />
            {/* Body */}
            <rect x={-35} y={20} width={70} height={80} rx={10}
              fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
            {/* Question marks floating */}
            <text x={60} y={-30 + qBob} fontFamily={FONT} fontSize={48} fontWeight={800}
              fill={COLORS.vibrant_red} opacity={0.6}>
              ?
            </text>
            <text x={-75} y={-10 + qBob * 0.7} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.vibrant_red} opacity={0.4}>
              ?
            </text>
          </g>

          {/* Text explanation */}
          <text x={370} y={810} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Agent is lost
          </text>
          <text x={370} y={860} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            No way to determine
          </text>
          <text x={370} y={900} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            if the goal was reached
          </text>
          <text x={370} y={950} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            Loops forever or gives up
          </text>
        </g>

        {/* ── Warning call-out card ──────────────────────────────────────── */}
        <g opacity={warnCard.opacity} transform={`translate(0, ${warnCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={140} />
          <rect x={60} y={1120} width={6} height={140} rx={3} fill={COLORS.vibrant_red} />
          {/* Warning triangle */}
          <polygon points="100,1168 115,1240 85,1240"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            strokeLinejoin="round" />
          <text x={100} y={1218} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            !
          </text>
          <text x={140} y={1200} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Missing any component = undefined agent behavior
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        <g opacity={interpolate(frame, [50, 65], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <circle cx={150} cy={1400 + breathe * 0.7} r={3} fill={COLORS.vibrant_red} opacity={0.2} />
          <circle cx={920} cy={1450 + breathe * 1.2} r={4} fill={COLORS.accent} opacity={0.2} />
          <circle cx={400} cy={1500 + breathe * 0.5} r={2.5} fill={COLORS.vibrant_red} opacity={0.25} />
          <circle cx={750} cy={1550 + breathe * 0.9} r={3} fill={COLORS.accent} opacity={0.15} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
