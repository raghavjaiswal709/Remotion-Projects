/**
 * Scene 01 — Day Intro
 * "This is day 43 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 5.580s
 * Duration: ~186 frames
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Day badge + series label spring entrance
 *   Phase 2 (frames 15–80):  Large "DAY 43" counter tick-up, headline words spring in
 *   Phase 3 (frames 60–end): Locomotive illustration path-draw, micro-animations
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

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
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const badgeEntrance = useSpringEntrance(frame, 6);
  const headlineA     = useSpringEntrance(frame, 12);
  const headlineB     = useSpringEntrance(frame, 18);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const dayCounter = useCounter(frame, 10, 43, 40);
  const card1 = useSpringEntrance(frame, 24);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);
  const card4 = useSpringEntrance(frame, 60);

  // ── Path draw for locomotive ───────────────────────────────────────────────
  const locoBodyLen = 600;
  const locoBodyDash = usePathDraw(frame, 30, locoBodyLen, 35);
  const trackLen = 900;
  const trackDash = usePathDraw(frame, 25, trackLen, 40);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const wheelRotation = frame * 3;

  // ── Progress bar animation ─────────────────────────────────────────────────
  const progressWidth = interpolate(frame, [15, 60], [0, (43 / 105) * 960], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Border draw for accent card ────────────────────────────────────────────
  const perimeterMain = 2 * (960 + 200);
  const borderDashMain = interpolate(frame, [24, 54], [perimeterMain, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="NATIONAL RAILWAY · JAVA" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — DAY 43 counter + headline ────────────────────────── */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          <text
            x={60} y={280}
            fontFamily={FONT}
            fontSize={48} fontWeight={800}
            fill={COLORS.accent}
            letterSpacing="0.05em"
          >
            DAY {dayCounter}
          </text>
          <text
            x={260} y={280}
            fontFamily={FONT}
            fontSize={48} fontWeight={800}
            fill={COLORS.text_muted}
          >
            / 105
          </text>
        </g>

        {/* Progress bar track */}
        <g opacity={badgeEntrance.opacity}>
          <rect x={60} y={300} width={960} height={6} rx={3} fill="rgba(255,255,255,0.08)" />
          <rect x={60} y={300} width={progressWidth} height={6} rx={3} fill={COLORS.accent} opacity={0.9} />
        </g>

        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={400}
            fontFamily={FONT}
            fontSize={88} fontWeight={800}
            fill={COLORS.white}
          >
            First Principles
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={480}
            fontFamily={FONT}
            fontSize={52} fontWeight={800}
            fill={COLORS.accent}
            fontStyle="italic"
          >
            Java Railway System
          </text>
        </g>

        {/* ── ZONE C — Locomotive illustration + info cards ──────────────── */}

        {/* Full-width bento card with border draw */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={540} w={960} h={200} accent />
          <rect
            x={60} y={540} width={960} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={perimeterMain}
            strokeDashoffset={borderDashMain}
          />
          <text x={100} y={620} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Module 3 — Ticketing Engine
          </text>
          <text x={100} y={680} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Compile-time Polymorphism
          </text>
        </g>

        {/* Locomotive SVG illustration in large bento card */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={780} w={960} h={520} />

          {/* Track rails */}
          <line
            x1={100} y1={1220} x2={980} y2={1220}
            stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={trackLen} strokeDashoffset={trackDash}
            strokeLinecap="round"
          />
          <line
            x1={100} y1={1240} x2={980} y2={1240}
            stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={trackLen} strokeDashoffset={trackDash}
            strokeLinecap="round"
          />

          {/* Cross-ties */}
          {Array.from({ length: 12 }, (_, i) => {
            const tieX = 120 + i * 72;
            const tieOp = interpolate(frame, [30 + i * 2, 40 + i * 2], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <rect key={i} x={tieX} y={1215} width={40} height={30} rx={3}
                fill={COLORS.text_muted} opacity={tieOp} />
            );
          })}

          {/* Locomotive body */}
          <g transform={`translate(200, 940)`}>
            {/* Main body rect */}
            <rect
              x={0} y={60} width={500} height={200} rx={12}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={locoBodyLen * 2}
              strokeDashoffset={locoBodyDash}
            />
            {/* Cab */}
            <rect x={400} y={20} width={120} height={240} rx={8}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={2}
              opacity={card2.opacity}
            />
            {/* Cab window */}
            <rect x={420} y={40} width={80} height={60} rx={6}
              fill={COLORS.accent_dim}
              stroke={COLORS.accent_mid} strokeWidth={1.5}
            />
            {/* Smokestack */}
            <rect x={60} y={20} width={50} height={60} rx={6}
              fill={COLORS.accent} opacity={0.7} />
            <rect x={55} y={10} width={60} height={16} rx={4}
              fill={COLORS.accent} opacity={0.5} />
            {/* Smoke puffs */}
            <circle cx={85} cy={-10 + breathe} r={18} fill={COLORS.text_muted} opacity={0.15 * shimmer} />
            <circle cx={65} cy={-30 + breathe * 1.2} r={14} fill={COLORS.text_muted} opacity={0.1 * shimmer} />
            <circle cx={100} cy={-50 + breathe * 0.8} r={22} fill={COLORS.text_muted} opacity={0.08} />

            {/* Boiler pipe */}
            <rect x={30} y={100} width={370} height={80} rx={40}
              fill="none" stroke={COLORS.accent_mid} strokeWidth={2} />

            {/* Wheels */}
            {[80, 220, 360].map((wx, i) => (
              <g key={i} transform={`translate(${wx}, 270)`}>
                <circle cx={0} cy={0} r={38} fill={COLORS.bg_primary}
                  stroke={COLORS.accent} strokeWidth={3} />
                <circle cx={0} cy={0} r={8} fill={COLORS.accent} />
                {/* Spokes */}
                {[0, 45, 90, 135].map((angle) => (
                  <line key={angle}
                    x1={0} y1={0}
                    x2={Math.cos((angle + wheelRotation) * Math.PI / 180) * 30}
                    y2={Math.sin((angle + wheelRotation) * Math.PI / 180) * 30}
                    stroke={COLORS.accent_mid} strokeWidth={2}
                  />
                ))}
              </g>
            ))}

            {/* Coupling at back */}
            <rect x={-30} y={200} width={40} height={20} rx={4}
              fill={COLORS.accent_mid} />

            {/* Headlight */}
            <circle cx={520} cy={130} r={16} fill={COLORS.accent} opacity={pulse} />
            <circle cx={520} cy={130} r={24} fill={COLORS.accent} opacity={0.1 * pulse} />
          </g>

          {/* JAVA label on locomotive */}
          <text x={380} y={1060} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.2em"
            opacity={card2.opacity * shimmer}
          >
            JAVA 43
          </text>
        </g>

        {/* Two info tiles at bottom */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={180} />
          <text x={100} y={1420} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Learning Java
          </text>
          <text x={100} y={1466} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            From First Principles
          </text>
        </g>

        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={1340} w={460} h={180} accent />
          <text x={600} y={1420} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Day 43
          </text>
          <text x={600} y={1466} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Polymorphism Intro
          </text>
        </g>

        {/* Floating accent decoration */}
        <g transform={`translate(900, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(160, ${1640 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent_mid} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
