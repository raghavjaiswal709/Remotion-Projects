/**
 * Scene 22 — AgentHandlesAlone
 * "How much of this the agent handles alone,"
 * CSV: 71.620s → 74.380s
 * Duration: ~83 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline springs
 *   Phase 2 (frames 18–60):  Autonomy spectrum slider — human icon ↔ agent icon with fill bar
 *   Phase 3 (frames 55+):    Slider knob oscillation, pulse on agent, orbit dots
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

export const Scene22_AgentHandlesAlone: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 5);
  const headB  = useSpringEntrance(frame, 10);

  // ── Phase 2 — Spectrum slider + icons ──────────────────────────────────────
  const spectrumCard = useSpringEntrance(frame, 18);
  const humanIcon    = useSpringEntrance(frame, 24);
  const agentIcon    = useSpringEntrance(frame, 30);
  const sliderKnob   = useSpringEntrance(frame, 36);
  const card1        = useSpringEntrance(frame, 44);
  const card2        = useSpringEntrance(frame, 52);
  const bottomCard   = useSpringEntrance(frame, 60);

  // Slider fill animation
  const sliderFill = interpolate(frame, [36, 56], [0, 0.68], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Border draw on spectrum card
  const specPerim = 2 * (960 + 200);
  const specBorderDash = usePathDraw(frame, 18, specPerim, 22);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Knob oscillation
  const knobOscillate = frame > 50 ? Math.sin(frame * 0.04) * 0.04 : 0;
  const finalSliderPos = sliderFill + knobOscillate;

  // Spectrum layout
  const TRACK_X = 120;
  const TRACK_Y = 740;
  const TRACK_W = 840;
  const TRACK_H = 12;
  const KNOB_R  = 22;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="AUTONOMY · PREVIEW" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            How much alone?
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            The agent's independence
          </text>
        </g>

        {/* ── Spectrum card ───────────────────────────────────────────────── */}
        <g opacity={spectrumCard.opacity} transform={`translate(0, ${spectrumCard.translateY})`}>
          {/* Animated border */}
          <rect x={60} y={520} width={960} height={340} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={specPerim} strokeDashoffset={specBorderDash} />
          <BentoCard x={60} y={520} w={960} h={340} />

          {/* HUMAN icon — left side */}
          <g opacity={humanIcon.opacity} transform={`translate(${TRACK_X}, 610)`}>
            {/* Head */}
            <circle cx={0} cy={-30} r={18} fill="none"
              stroke={COLORS.text_muted} strokeWidth={2.5} />
            {/* Body */}
            <line x1={0} y1={-12} x2={0} y2={24}
              stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" />
            {/* Arms */}
            <line x1={-18} y1={4} x2={18} y2={4}
              stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" />
            {/* Legs */}
            <line x1={0} y1={24} x2={-12} y2={48}
              stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" />
            <line x1={0} y1={24} x2={12} y2={48}
              stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" />
            <text textAnchor="middle" y={78}
              fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
              HUMAN
            </text>
          </g>

          {/* AGENT icon — right side */}
          <g opacity={agentIcon.opacity}
            transform={`translate(${TRACK_X + TRACK_W}, 610) scale(${pulse})`}
            style={{ transformOrigin: `${TRACK_X + TRACK_W}px 610px` }}>
            {/* Robot head */}
            <rect x={-22} y={-44} width={44} height={36} rx={8}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Eyes */}
            <circle cx={-8} cy={-26} r={4} fill={COLORS.accent} />
            <circle cx={8} cy={-26} r={4} fill={COLORS.accent} />
            {/* Antenna */}
            <line x1={0} y1={-44} x2={0} y2={-58}
              stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
            <circle cx={0} cy={-60} r={4} fill={COLORS.accent} />
            {/* Body */}
            <rect x={-26} y={-6} width={52} height={42} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Arm lines */}
            <line x1={-26} y1={10} x2={-40} y2={20}
              stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
            <line x1={26} y1={10} x2={40} y2={20}
              stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
            <text textAnchor="middle" y={78}
              fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
              AGENT
            </text>
          </g>

          {/* Track background */}
          <rect x={TRACK_X} y={TRACK_Y} width={TRACK_W} height={TRACK_H} rx={6}
            fill="rgba(255,255,255,0.08)" />

          {/* Track fill (accent) */}
          <rect x={TRACK_X} y={TRACK_Y} width={TRACK_W * finalSliderPos} height={TRACK_H} rx={6}
            fill={COLORS.accent} opacity={0.7} />

          {/* Tick marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <g key={i}>
              <line x1={TRACK_X + TRACK_W * pct} y1={TRACK_Y + TRACK_H + 4}
                x2={TRACK_X + TRACK_W * pct} y2={TRACK_Y + TRACK_H + 16}
                stroke={COLORS.text_muted} strokeWidth={1} opacity={0.5} />
            </g>
          ))}

          {/* Labels */}
          <text x={TRACK_X} y={TRACK_Y + TRACK_H + 38}
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            0%
          </text>
          <text x={TRACK_X + TRACK_W} y={TRACK_Y + TRACK_H + 38} textAnchor="end"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            100%
          </text>
          <text x={TRACK_X + TRACK_W * 0.5} y={TRACK_Y + TRACK_H + 38} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
            AUTONOMY
          </text>

          {/* Knob */}
          <g opacity={sliderKnob.opacity}>
            <circle cx={TRACK_X + TRACK_W * finalSliderPos} cy={TRACK_Y + TRACK_H / 2}
              r={KNOB_R + 6} fill={COLORS.accent} fillOpacity={0.1} />
            <circle cx={TRACK_X + TRACK_W * finalSliderPos} cy={TRACK_Y + TRACK_H / 2}
              r={KNOB_R} fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={TRACK_X + TRACK_W * finalSliderPos} cy={TRACK_Y + TRACK_H / 2}
              r={8} fill={COLORS.accent} />
          </g>
        </g>

        {/* ── Two comparison cards ─────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={900} w={460} h={300} />
          <rect x={60} y={900} width={6} height={300} rx={3} fill={COLORS.text_muted} />

          <text x={100} y={950} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">LOW AUTONOMY</text>

          {/* Human approval check flow */}
          <g transform="translate(100, 980)">
            <rect width={140} height={40} rx={10}
              fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1} />
            <text x={70} y={26} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
              ACTION
            </text>
          </g>
          <g transform="translate(260, 985)">
            <text fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
              →
            </text>
          </g>
          <g transform="translate(290, 980)">
            <rect width={140} height={40} rx={10}
              fill="rgba(255,255,255,0.05)" stroke={COLORS.text_muted} strokeWidth={1} />
            <text x={70} y={26} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
              APPROVE?
            </text>
          </g>

          <text x={100} y={1070} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>Every step needs human OK</text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>Slow but safe</text>

          {/* Shield icon */}
          <g transform="translate(380, 1120)">
            <path d="M0,-20 L16,-10 L16,10 C16,24 0,32 0,32 C0,32 -16,24 -16,10 L-16,-10 Z"
              fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
            <path d="M-6,2 l4,6 l10,-12" fill="none"
              stroke={COLORS.text_muted} strokeWidth={2} strokeLinecap="round" />
          </g>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={900} w={460} h={300} accent />
          <rect x={560} y={900} width={6} height={300} rx={3} fill={COLORS.accent} />

          <text x={600} y={950} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">HIGH AUTONOMY</text>

          {/* Auto-execute flow */}
          <g transform="translate(600, 980)">
            <rect width={140} height={40} rx={10}
              fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={70} y={26} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
              ACTION
            </text>
          </g>
          <g transform="translate(760, 985)">
            <text fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
              →
            </text>
          </g>
          <g transform="translate(790, 980)">
            <rect width={140} height={40} rx={10}
              fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={70} y={26} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
              EXECUTE
            </text>
          </g>

          <text x={600} y={1070} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>Agent decides and acts</text>
          <text x={600} y={1100} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>Fast but risky</text>

          {/* Lightning icon */}
          <g transform="translate(880, 1120)">
            <path d="M4,-20 L-8,4 L2,4 L-4,20 L8,-4 L-2,-4 Z"
              fill={COLORS.accent} />
          </g>
        </g>

        {/* ── Bottom insight card ─────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={240} />
          <rect x={60} y={1240} width={960} height={6} rx={3} fill={COLORS.accent} />

          {/* Question mark icon */}
          <g transform="translate(140, 1370)">
            <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={2} />
            <text textAnchor="middle" y={10}
              fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>?</text>
          </g>

          <text x={200} y={1320} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The right amount of autonomy
          </text>
          <text x={200} y={1365} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            depends on action reversibility
          </text>
          <text x={200} y={1400} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Can it be undone? → More autonomy
          </text>
          <text x={200} y={1435} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Permanent action? → Ask the human
          </text>
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.25}>
          <circle cx={120} cy={1560 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={960} cy={1620 + breathe * 0.7} r={2} fill={COLORS.accent} />
          <circle cx={540} cy={1700 + breathe * 1.1} r={2.5} fill={COLORS.accent} opacity={0.4} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s22.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
