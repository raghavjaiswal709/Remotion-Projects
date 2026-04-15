/**
 * Scene 02 — Final Class Recap
 * "Last day, we learned how a final class locks a blueprint shut. No subclass can ever inherit from it."
 * CSV: 6.760s → 14.720s
 * Duration: 239 frames (7.97s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — label + headline spring in
 *   Phase 2 (frames 20–90):  Locked blueprint illustration builds
 *   Phase 3 (frames 80–end): Lock pulse, chain shimmer
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
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

export const Scene02_FinalClassRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = FPS;

  // ── Phase 1: Scene reveal ─────────────────────────────────────────────────
  const labelEntrance  = useSpringEntrance(frame, 0);
  const headlineA      = useSpringEntrance(frame, 6);
  const headlineB      = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ────────────────────────────────────────────────
  const blueprintCard  = useSpringEntrance(frame, 20);
  const lockCard       = useSpringEntrance(frame, 32);
  const noInheritCard  = useSpringEntrance(frame, 44);
  const recapCard      = useSpringEntrance(frame, 56);

  // Lock chain path draw
  const chainLength = 600;
  const chainDash   = usePathDraw(frame, 35, chainLength, 30);

  // Lock border draw
  const lockPerimeter = 2 * (400 + 320);
  const lockBorderDash = usePathDraw(frame, 30, lockPerimeter, 35);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const lockPulse   = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe     = Math.sin(frame * 0.06) * 3;
  const shimmer     = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const chainGlow   = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.4, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · PREVIOUS DAY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Final Class
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Locks The Blueprint Shut
          </text>
        </g>

        {/* ── ZONE C — Locked Blueprint Illustration ─────────────────────── */}
        <g opacity={blueprintCard.opacity} transform={`translate(0, ${blueprintCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={420} accent />

          {/* Blueprint box with class header */}
          <rect x={160} y={520} width={400} height={320} rx={16}
            fill={COLORS.bg_primary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={lockPerimeter}
            strokeDashoffset={lockBorderDash} />

          {/* Class header stripe */}
          <rect x={160} y={520} width={400} height={60} rx={16}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={360} y={562} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            final class Train
          </text>

          {/* Class body lines */}
          <rect x={190} y={610} width={200} height={8} rx={4}
            fill="rgba(255,255,255,0.1)" />
          <rect x={190} y={640} width={280} height={8} rx={4}
            fill="rgba(255,255,255,0.1)" />
          <rect x={190} y={670} width={160} height={8} rx={4}
            fill="rgba(255,255,255,0.1)" />
          <line x1={190} y1={710} x2={530} y2={710}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <rect x={190} y={730} width={240} height={8} rx={4}
            fill="rgba(255,255,255,0.1)" />
          <rect x={190} y={760} width={300} height={8} rx={4}
            fill="rgba(255,255,255,0.1)" />

          {/* Lock icon — large, animated pulse */}
          <g transform={`translate(720, 680) scale(${lockPulse})`}
            style={{ transformOrigin: '720px 680px' }}>
            {/* Lock body */}
            <rect x={-50} y={-20} width={100} height={80} rx={12}
              fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Lock shackle */}
            <path d="M -30,-20 L -30,-50 A 30,30 0 0,1 30,-50 L 30,-20"
              fill="none" stroke={COLORS.accent} strokeWidth={4}
              strokeLinecap="round" />
            {/* Keyhole */}
            <circle cx={0} cy={15} r={10}
              fill={COLORS.accent} fillOpacity={0.5} />
            <rect x={-4} y={15} width={8} height={20} rx={2}
              fill={COLORS.accent} fillOpacity={0.5} />
          </g>

          {/* Label */}
          <text x={720} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            SEALED
          </text>
        </g>

        {/* ── Chain barrier — animated path draw ─────────────────────────── */}
        <g opacity={lockCard.opacity} transform={`translate(0, ${lockCard.translateY})`}>
          <BentoCard x={60} y={930} w={960} h={200} />

          {/* Chain links — path draw */}
          <path
            d="M 100,1030 Q 200,1000 300,1030 Q 400,1060 500,1030 Q 600,1000 700,1030 Q 800,1060 900,1030 Q 960,1010 1000,1030"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={3}
            strokeDasharray={chainLength}
            strokeDashoffset={chainDash}
            strokeLinecap="round"
            opacity={chainGlow}
          />

          {/* X marks for "no inheritance" */}
          <g opacity={shimmer}>
            <text x={300} y={1090} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
              X
            </text>
            <text x={540} y={1090} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
              X
            </text>
            <text x={780} y={1090} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
              X
            </text>
          </g>

          <text x={540} y={1100} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            NO SUBCLASS CAN INHERIT
          </text>
        </g>

        {/* ── No-inheritance diagram ─────────────────────────────────────── */}
        <g opacity={noInheritCard.opacity} transform={`translate(0, ${noInheritCard.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={280} />

          {/* Parent class box */}
          <rect x={120} y={1200} width={340} height={60} rx={10}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={290} y={1240} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            final Train
          </text>

          {/* Blocked arrow (dashed, red X) */}
          <line x1={290} y1={1270} x2={290} y2={1340}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray="8,6" opacity={0.6} />
          <circle cx={290} cy={1340} r={16}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
          <line x1={278} y1={1328} x2={302} y2={1352}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <line x1={302} y1={1328} x2={278} y2={1352}
            stroke={COLORS.vibrant_red} strokeWidth={2} />

          {/* Would-be child */}
          <rect x={120} y={1370} width={340} height={50} rx={10}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.1)" strokeWidth={1}
            strokeDasharray="6,4" />
          <text x={290} y={1402} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}
            opacity={0.4}>
            ExpressTrain?
          </text>
        </g>

        {/* ── Recap summary card ─────────────────────────────────────────── */}
        <g opacity={recapCard.opacity} transform={`translate(0, ${recapCard.translateY})`}>
          <BentoCard x={560} y={1160} w={460} h={280} />
          <rect x={560} y={1160} width={6} height={280} rx={3}
            fill={COLORS.accent} />
          <text x={600} y={1220}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Key Takeaway
          </text>
          <text x={600} y={1280}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            A final class is
          </text>
          <text x={600} y={1320}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            permanently sealed.
          </text>
          <text x={600} y={1380}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            No extensions.
          </text>
          <text x={600} y={1420}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            No overrides.
          </text>
        </g>

        {/* ── Floating accent — micro-animation ──────────────────────────── */}
        <g transform={`translate(100, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={12}
            fill={COLORS.accent} fillOpacity={0.1 * shimmer} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
