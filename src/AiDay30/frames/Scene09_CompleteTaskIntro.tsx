/**
 * Scene 09 — CompleteTaskIntro
 * "Here is a complete task."
 * CSV: 27.780s → 29.160s
 * Duration: ~89 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring in
 *   Phase 2 (frames 18–70):  Large clipboard illustration with checklist, task card
 *   Phase 3 (frames 55–end): Shine sweep, particle float, checkmark pulse
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

export const Scene09_CompleteTaskIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const clipboardCard = useSpringEntrance(frame, 16);
  const check1        = useSpringEntrance(frame, 26);
  const check2        = useSpringEntrance(frame, 34);
  const check3        = useSpringEntrance(frame, 42);
  const infoCard      = useSpringEntrance(frame, 50);

  // Clipboard border draw
  const clipPerimeter = 2 * (760 + 640);
  const clipDash = usePathDraw(frame, 18, clipPerimeter, 35);

  // Checkmark path draws
  const checkLen = 40;
  const chk1Dash = usePathDraw(frame, 28, checkLen, 12);
  const chk2Dash = usePathDraw(frame, 36, checkLen, 12);
  const chk3Dash = usePathDraw(frame, 44, checkLen, 12);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Shine sweep across clipboard
  const shineProg = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const shineX = interpolate(shineProg, [0, 1], [-100, 1200]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · COMPLETE EXAMPLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            A Complete
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Task
          </text>
        </g>

        {/* ── Clipboard illustration in bento card ───────────────────────── */}
        <g opacity={clipboardCard.opacity} transform={`translate(0, ${clipboardCard.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={640} accent />
          {/* Animated border */}
          <rect x={60} y={460} width={960} height={640} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={clipPerimeter} strokeDashoffset={clipDash} />

          {/* Clipboard shape — top clip */}
          <rect x={380} y={465} width={320} height={30} rx={15}
            fill={COLORS.accent} fillOpacity={0.2} />
          <rect x={440} y={458} width={200} height={20} rx={10}
            fill={COLORS.accent} fillOpacity={0.35} />
          <circle cx={540} cy={468} r={8} fill={COLORS.accent} fillOpacity={0.5} />

          {/* Title on clipboard */}
          <text x={540} y={550} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            FLIGHT BOOKING TASK
          </text>

          {/* Horizontal rule */}
          <line x1={120} y1={580} x2={960} y2={580}
            stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

          {/* Checklist items */}
          {/* Item 1: Start State */}
          <g opacity={check1.opacity} transform={`translate(0, ${check1.translateY})`}>
            <rect x={120} y={610} width={36} height={36} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <path d="M 127,628 L 134,637 L 148,618"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={chk1Dash} />
            <text x={175} y={640} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.accent}>
              Start State
            </text>
            <text x={380} y={640} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>
              — defined
            </text>
          </g>

          {/* Item 2: End State */}
          <g opacity={check2.opacity} transform={`translate(0, ${check2.translateY})`}>
            <rect x={120} y={680} width={36} height={36} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <path d="M 127,698 L 134,707 L 148,688"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={chk2Dash} />
            <text x={175} y={710} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.accent}>
              End State
            </text>
            <text x={370} y={710} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>
              — defined
            </text>
          </g>

          {/* Item 3: Criterion */}
          <g opacity={check3.opacity} transform={`translate(0, ${check3.translateY})`}>
            <rect x={120} y={750} width={36} height={36} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <path d="M 127,768 L 134,777 L 148,758"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={chk3Dash} />
            <text x={175} y={780} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.accent}>
              Criterion
            </text>
            <text x={380} y={780} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>
              — defined
            </text>
          </g>

          {/* Divider */}
          <line x1={120} y1={830} x2={960} y2={830}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Status badge */}
          <rect x={350} y={870} width={340} height={60} rx={30}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={520} y={910} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            TASK COMPLETE
          </text>

          {/* Large checkmark SVG illustration — right side */}
          <g transform={`translate(800, 700) scale(${pulse})`}
            style={{ transformOrigin: '800px 700px' }}>
            <circle cx={0} cy={0} r={80} fill={COLORS.accent} fillOpacity={0.08} />
            <circle cx={0} cy={0} r={60} fill={COLORS.accent} fillOpacity={0.12} />
            <path d="M -25,-5 L -8,18 L 30,-20" fill="none" stroke={COLORS.accent}
              strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Shine sweep overlay (optional) */}
          <rect x={shineX} y={460} width={60} height={640} rx={0}
            fill={COLORS.white} opacity={0.02}
            transform="skewX(-15)" />
        </g>

        {/* ── Info card ──────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1140} w={960} h={160} />
          <rect x={60} y={1140} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1220} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            All three components present = valid task
          </text>
          <text x={100} y={1265} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The agent can plan, execute, and verify
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        <g opacity={shimmer * 0.35}>
          <circle cx={160} cy={1420 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={920} cy={1500 + breathe * 0.8} r={4} fill={COLORS.accent} opacity={0.3} />
          <circle cx={540} cy={1580 + breathe * 1.2} r={2.5} fill={COLORS.accent} opacity={0.2} />
          <circle cx={300} cy={1650 + breathe * 0.5} r={3} fill={COLORS.accent} opacity={0.25} />
          <circle cx={800} cy={1380 + breathe * 1.1} r={2} fill={COLORS.accent} opacity={0.15} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={interpolate(frame, [0, 20], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent}
            strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,60 L 1020,140 M 1020,60 L 940,60" fill="none" stroke={COLORS.accent}
            strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
