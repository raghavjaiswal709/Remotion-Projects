/**
 * Scene 01 — Day Intro
 * "This is day 44 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 5.460s
 * Duration: 175 frames (5.83s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30): Scene reveal — day counter springs in, module label slides
 *   Phase 2 (frames 20–90): Locomotive illustration builds, progress bar fills
 *   Phase 3 (frames 80–end): Micro-animations — wheel rotation, steam puff, track pulse
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance   = useSpringEntrance(frame, 0);
  const dayCounter      = useSpringEntrance(frame, 4);
  const headlineA       = useSpringEntrance(frame, 8);
  const headlineB       = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const locoEntrance    = useSpringEntrance(frame, 20);
  const progressCard    = useSpringEntrance(frame, 28);
  const moduleCard      = useSpringEntrance(frame, 36);
  const trackDraw       = usePathDraw(frame, 25, 960, 35);

  // ── Progress bar ──────────────────────────────────────────────────────────
  const progressWidth = interpolate(frame, [30, 70], [0, (44 / 105) * 880], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const dayNum = useCounter(frame, 8, 44, 30);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const wheelRotation = frame * 3;
  const steamFloat    = Math.sin(frame * 0.08) * 6;
  const breathe       = Math.sin(frame * 0.06) * 3;
  const pulse         = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label ──────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <text
            x={60} y={120}
            fontFamily={FONT}
            fontSize={28} fontWeight={800}
            fill={COLORS.accent}
            letterSpacing="0.15em"
            opacity={0.8}
          >
            NATIONAL RAILWAY · JAVA
          </text>
        </g>

        {/* ── Day counter badge ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${dayCounter.translateY})`} opacity={dayCounter.opacity}>
          <text
            x={60} y={195}
            fontFamily={FONT}
            fontSize={56} fontWeight={800}
            fill={COLORS.accent}
          >
            DAY {dayNum}
          </text>
          <text
            x={280} y={195}
            fontFamily={FONT}
            fontSize={56} fontWeight={800}
            fill={COLORS.text_muted}
          >
            / 105
          </text>
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={320}
            fontFamily={FONT}
            fontSize={88} fontWeight={800}
            fill={COLORS.white}
          >
            Method
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={420}
            fontFamily={FONT}
            fontSize={88} fontWeight={800}
            fill={COLORS.accent}
            fontStyle="italic"
          >
            Overloading
          </text>
        </g>

        {/* ── ZONE C — Locomotive illustration ───────────────────────────── */}
        <g opacity={locoEntrance.opacity} transform={`translate(0, ${locoEntrance.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={480} accent />

          {/* Track rails */}
          <line x1={80} y1={940} x2={1000} y2={940}
            stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={960} strokeDashoffset={trackDraw} />
          <line x1={80} y1={960} x2={1000} y2={960}
            stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={960} strokeDashoffset={trackDraw} />

          {/* Cross ties */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={120 + i * 72} y={935} width={8} height={30} rx={2}
              fill={COLORS.text_muted} opacity={locoEntrance.opacity * 0.5} />
          ))}

          {/* Locomotive body */}
          <rect x={200} y={720} width={500} height={180} rx={12}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2.5} />

          {/* Cab section */}
          <rect x={580} y={680} width={180} height={220} rx={10}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={2} />

          {/* Cab window */}
          <rect x={610} y={710} width={120} height={60} rx={8}
            fill={COLORS.accent} fillOpacity={0.25}
            stroke={COLORS.accent} strokeWidth={1.5} />

          {/* Smokestack */}
          <rect x={250} y={680} width={50} height={50} rx={6}
            fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={2} />

          {/* Steam puffs */}
          <circle cx={275} cy={655 + steamFloat} r={18}
            fill={COLORS.white} fillOpacity={0.08} />
          <circle cx={260} cy={630 + steamFloat * 1.3} r={24}
            fill={COLORS.white} fillOpacity={0.05} />
          <circle cx={290} cy={610 + steamFloat * 1.6} r={14}
            fill={COLORS.white} fillOpacity={0.06} />

          {/* Headlight */}
          <circle cx={210} cy={800} r={16}
            fill={COLORS.accent} fillOpacity={0.4}
            stroke={COLORS.accent} strokeWidth={2} />

          {/* Wheels */}
          {[320, 480, 640].map((wx, i) => (
            <g key={i} transform={`translate(${wx}, 920)`}>
              <circle cx={0} cy={0} r={28}
                fill="none" stroke={COLORS.accent} strokeWidth={3} />
              <circle cx={0} cy={0} r={8}
                fill={COLORS.accent} fillOpacity={0.6} />
              {/* Spokes with rotation */}
              {[0, 60, 120].map((angle, j) => (
                <line key={j}
                  x1={0} y1={0}
                  x2={20 * Math.cos((angle + wheelRotation) * Math.PI / 180)}
                  y2={20 * Math.sin((angle + wheelRotation) * Math.PI / 180)}
                  stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
              ))}
            </g>
          ))}

          {/* Coupling */}
          <rect x={760} y={860} width={60} height={12} rx={4}
            fill={COLORS.accent} fillOpacity={0.4} />

          {/* Day 44 label on locomotive */}
          <text x={400} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.white} opacity={0.9}>
            DAY 44
          </text>
        </g>

        {/* ── Progress card ──────────────────────────────────────────────── */}
        <g opacity={progressCard.opacity} transform={`translate(0, ${progressCard.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={160} />
          <text x={100} y={1100}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            SERIES PROGRESS
          </text>
          {/* Track background */}
          <rect x={100} y={1120} width={880} height={8} rx={4}
            fill="rgba(255,255,255,0.08)" />
          {/* Progress fill */}
          <rect x={100} y={1120} width={progressWidth} height={8} rx={4}
            fill={COLORS.accent} opacity={0.9} />
          <text x={100 + progressWidth + 12} y={1132}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            42%
          </text>
        </g>

        {/* ── Module card ────────────────────────────────────────────────── */}
        <g opacity={moduleCard.opacity} transform={`translate(0, ${moduleCard.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={200} accent />
          <rect x={60} y={1240} width={6} height={200} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1310}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            MODULE 3 · TICKETING ENGINE
          </text>
          <text x={100} y={1370}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Method Overloading — calculateFare()
          </text>
        </g>

        {/* ── Floating accents ───────────────────────────────────────────── */}
        <g transform={`translate(900, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={40}
            fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={40}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(160, ${1620 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={24}
            fill={COLORS.accent} fillOpacity={0.04} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={labelEntrance.opacity * 0.5}>
          <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,60 L 1020,140 M 1020,60 L 940,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s01.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
