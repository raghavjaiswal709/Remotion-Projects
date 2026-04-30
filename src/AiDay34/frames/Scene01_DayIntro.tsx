/**
 * Scene 01 — Day Intro
 * "This is day 34 of learning agent AI from first principles."
 * CSV: 0.000s → 5.400s | Duration: 162 frames (5.4s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — corner accents spring in, day badge slides down
 *   Phase 2 (frames 15–80):  Series title builds, headline springs up word by word
 *   Phase 3 (frames 70–end): Robot illustration animates, subtle pulse on accent ring
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
import { DarkBackground, GlobalDefs, Caption, CornerAccents } from '../helpers/components';

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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const cornerReveal = spring({ frame, fps, config: SPRING_SOFT });
  const badgeEnter   = useSpringEntrance(frame, 0);
  const seriesEnter  = useSpringEntrance(frame, 8);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const h1Enter   = useSpringEntrance(frame, 18);
  const h2Enter   = useSpringEntrance(frame, 26);
  const dayBadge  = useSpringEntrance(frame, 4);
  const robotEnter = useSpringEntrance(frame, 32);

  // Robot head path-draw
  const headOutlineLen = 280;
  const headDash = usePathDraw(frame, 35, headOutlineLen, 28);
  const bodyLen  = 320;
  const bodyDash = usePathDraw(frame, 48, bodyLen, 28);
  const armLen   = 160;
  const armDash  = usePathDraw(frame, 58, armLen, 22);
  const circuitLen = 200;
  const circuitDash = usePathDraw(frame, 68, circuitLen, 24);
  const eyeLen = 60;
  const eyeDash = usePathDraw(frame, 44, eyeLen, 18);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 3;
  const pulse   = 1 + Math.sin(frame * 0.09) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.7, 1]);
  const floatY  = Math.sin(frame * 0.06) * 5;

  const cornerOp = interpolate(cornerReveal, [0, 1], [0, 1]);
  const caption  = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={cornerOp * 0.6} />

        {/* ── ZONE A — Series badge ──────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEnter.translateY})`} opacity={badgeEnter.opacity}>
          <rect x={60} y={80} width={320} height={50} rx={12}
            fill={COLORS.accent_dim} stroke={COLORS.accent_mid} strokeWidth={1} />
          <text x={220} y={114} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            AGENTIC AI · FIRST PRINCIPLES
          </text>
        </g>

        {/* ── Day number badge ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${dayBadge.translateY})`} opacity={dayBadge.opacity}>
          <text x={60} y={200}
            fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent} opacity={0.12}>
            34
          </text>
          <text x={60} y={196}
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.white}>
            DAY 34
          </text>
        </g>

        {/* ── ZONE B — Series title headline ─────────────────────────────── */}
        <g transform={`translate(0, ${h1Enter.translateY})`} opacity={h1Enter.opacity}>
          <text x={60} y={320}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.text_muted}>
            LEARNING AGENT AI
          </text>
        </g>
        <g transform={`translate(0, ${h2Enter.translateY})`} opacity={h2Enter.opacity}>
          <text x={60} y={386}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            FROM FIRST PRINCIPLES
          </text>
        </g>

        {/* ── ZONE C — Robot illustration ────────────────────────────────── */}
        <g transform={`translate(540, ${900 + floatY})`} opacity={robotEnter.opacity}>

          {/* Robot body — large bento card base */}
          <rect x={-200} y={-260} width={400} height={520} rx={30}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.95} />

          {/* Robot body inner panel */}
          <rect x={-160} y={-220} width={320} height={380} rx={20}
            fill="rgba(118,171,174,0.05)" stroke={COLORS.accent_mid} strokeWidth={1} />

          {/* Animated body outline */}
          <rect x={-200} y={-260} width={400} height={520} rx={30}
            fill="none"
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={bodyLen} strokeDashoffset={bodyDash} />

          {/* Robot head */}
          <rect x={-100} y={-360} width={200} height={180} rx={24}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />

          {/* Head outline draw */}
          <rect x={-100} y={-360} width={200} height={180} rx={24}
            fill="none"
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={headOutlineLen} strokeDashoffset={headDash} />

          {/* Eyes */}
          <circle cx={-36} cy={-290} r={22}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={36} cy={-290} r={22}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eye glow */}
          <circle cx={-36} cy={-290} r={14}
            fill={COLORS.accent} opacity={0.9 * shimmer}
            strokeDasharray={eyeLen} strokeDashoffset={eyeDash}>
          </circle>
          <circle cx={36} cy={-290} r={14}
            fill={COLORS.accent} opacity={0.9 * shimmer} />

          {/* Mouth line */}
          <rect x={-32} y={-246} width={64} height={8} rx={4}
            fill={COLORS.accent} opacity={0.6} />

          {/* Neck connector */}
          <rect x={-20} y={-180} width={40} height={28} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1} />

          {/* Chest panel — AI chip */}
          <rect x={-80} y={-160} width={160} height={120} rx={14}
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={0} y={-108} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>AI</text>
          <text x={0} y={-76} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted}>MODULE 4</text>

          {/* Circuit lines on body */}
          <path d="M -60,-20 L -60,40 L -20,40 L -20,80"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={circuitLen} strokeDashoffset={circuitDash}
            strokeLinecap="round" opacity={0.6} />
          <path d="M 60,-20 L 60,40 L 20,40 L 20,80"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={circuitLen} strokeDashoffset={circuitDash}
            strokeLinecap="round" opacity={0.6} />

          {/* Circuit nodes */}
          <circle cx={-20} cy={40} r={5} fill={COLORS.accent} opacity={0.8} />
          <circle cx={20} cy={40} r={5} fill={COLORS.accent} opacity={0.8} />
          <circle cx={-60} cy={40} r={5} fill={COLORS.text_muted} opacity={0.6} />
          <circle cx={60} cy={40} r={5} fill={COLORS.text_muted} opacity={0.6} />

          {/* Arms */}
          <rect x={-250} y={-200} width={60} height={200} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
          <path d="M -220,-200 L -220,0"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={armLen} strokeDashoffset={armDash}
            strokeLinecap="round" />

          <rect x={190} y={-200} width={60} height={200} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
          <path d="M 220,-200 L 220,0"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={armLen} strokeDashoffset={armDash}
            strokeLinecap="round" />

          {/* Legs */}
          <rect x={-130} y={260} width={80} height={140} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
          <rect x={50} y={260} width={80} height={140} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />

          {/* Pulse ring */}
          <circle cx={0} cy={-280} r={140}
            fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} opacity={0.12 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px -280px' }} />
        </g>

        {/* ── Accent ring beneath robot ─────────────────────────────────── */}
        <g transform={`translate(540, ${1060 + breathe})`}>
          <ellipse cx={0} cy={0} rx={200} ry={20}
            fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} opacity={0.25 * shimmer} />
        </g>

        {/* ── Topic label ───────────────────────────────────────────────── */}
        <g transform={`translate(0, ${seriesEnter.translateY})`} opacity={seriesEnter.opacity}>
          <text x={60} y={1560}
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Task Decomposition
          </text>
          <text x={60} y={1620}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            Today's topic — Day 34
          </text>
        </g>

        {/* ── Progress dots ─────────────────────────────────────────────── */}
        <g opacity={seriesEnter.opacity}>
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i}
              cx={60 + i * 36} cy={1680} r={i < 4 ? 8 : 5}
              fill={i < 4 ? COLORS.accent : COLORS.text_muted}
              opacity={i < 4 ? 0.9 : 0.3} />
          ))}
        </g>

        {/* Caption */}
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
