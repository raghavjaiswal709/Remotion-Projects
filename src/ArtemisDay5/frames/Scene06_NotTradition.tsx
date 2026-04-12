/**
 * Scene06 — Not Tradition, Physics
 * "Not tradition, physics."
 * CSV: 33.860s → 35.440s
 *
 * Animation phases:
 *   Phase 1 (0–25): Section label, "NOT" + "TRADITION" spring in, double strikethrough draws
 *   Phase 2 (15–70): Giant "PHYSICS" with ghost+pulse+double underline, F=m·a formula with
 *                     highlighted letters, 3 large physics icon circles (r=80) with detailed
 *                     internal SVG artwork, 2 comparison cards with skull/checkmark icons
 *   Phase 3 (60–end): PHYSICS text pulse/float, icon circles shimmer+breathe, card float
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene06_NotTradition: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Tradition enters + strikethrough (0–25) ──────────
  const labelEnt = useSpringEntrance(frame, 0);
  const tradEnt = useSpringEntrance(frame, 4);
  const strikeDraw1 = usePathDraw(frame, 12, 620, 12);
  const strikeDraw2 = usePathDraw(frame, 16, 620, 12);

  // ── Phase 2: PHYSICS + formula + icons + cards (15–70) ────────
  const physicsDelay = Math.max(0, frame - 18);
  const physicsProg = spring({ frame: physicsDelay, fps, config: SPRING_SNAP });
  const physicsY = interpolate(physicsProg, [0, 1], [60, 0]);
  const physicsOp = interpolate(physicsDelay, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const underlineDraw1 = usePathDraw(frame, 24, 500, 18);
  const underlineDraw2 = usePathDraw(frame, 28, 440, 16);

  const formulaEnt = useSpringEntrance(frame, 30);
  const icon1 = useSpringEntrance(frame, 36);
  const icon2 = useSpringEntrance(frame, 44);
  const icon3 = useSpringEntrance(frame, 52);
  const card1 = useSpringEntrance(frame, 58);
  const card2 = useSpringEntrance(frame, 66);
  const bottomEnt = useSpringEntrance(frame, 72);

  // icon circle border draws
  const icon1Border = usePathDraw(frame, 38, 500, 22);
  const icon2Border = usePathDraw(frame, 46, 500, 22);
  const icon3Border = usePathDraw(frame, 54, 500, 22);

  // ── Phase 3: Micro-animations (60–end) ────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.025;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.82, 1]);
  const float1 = Math.sin(frame * 0.07) * 3;
  const float2 = Math.sin(frame * 0.07 + 1.5) * 3;
  const float3 = Math.sin(frame * 0.07 + 3) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.3} color={COLORS.sky_blue} />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="THE REASON" y={260} opacity={0.55} />
        </g>

        {/* ── "NOT" label ────────────────────────────────────────── */}
        <g opacity={tradEnt.opacity} transform={`translate(0, ${tradEnt.translateY})`}>
          <text x={540} y={380} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={600} fill={COLORS.cool_silver}>
            NOT
          </text>
        </g>

        {/* ── "TRADITION" — struck through with double line ──────── */}
        <g opacity={tradEnt.opacity} transform={`translate(0, ${tradEnt.translateY})`}>
          <text x={540} y={510} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={110} fontWeight={900} fill={COLORS.cool_silver} opacity={0.3}>
            TRADITION
          </text>
          {/* Primary strikethrough */}
          <line x1={155} y1={492} x2={925} y2={492}
            stroke={COLORS.vibrant_red} strokeWidth={5}
            strokeDasharray={620} strokeDashoffset={strikeDraw1}
            strokeLinecap="round" />
          {/* Secondary slash (angled) */}
          <line x1={175} y1={510} x2={905} y2={480}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={620} strokeDashoffset={strikeDraw2}
            strokeLinecap="round" opacity={0.5} />
        </g>

        {/* ── "PHYSICS" — hero text ──────────────────────────────── */}
        <g opacity={physicsOp} transform={`translate(0, ${physicsY + breathe})`}>
          {/* Ghost layer — big faded */}
          <text x={540} y={710} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={180} fontWeight={900}
            fill={COLORS.sky_blue} opacity={0.05 * shimmer}>
            PHYSICS
          </text>
          {/* Main text */}
          <text x={540} y={710} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={140} fontWeight={900}
            fill={COLORS.sky_blue}
            style={{ transform: `scale(${pulse})`, transformOrigin: '540px 710px' }}>
            PHYSICS
          </text>
          {/* Double underline */}
          <line x1={260} y1={735} x2={820} y2={735}
            stroke={COLORS.sky_blue} strokeWidth={4.5}
            strokeDasharray={500} strokeDashoffset={underlineDraw1}
            strokeLinecap="round" />
          <line x1={290} y1={750} x2={790} y2={750}
            stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={440} strokeDashoffset={underlineDraw2}
            strokeLinecap="round" opacity={0.45} />
        </g>

        {/* ── Formula: F = m · a ─────────────────────────────────── */}
        <g opacity={formulaEnt.opacity}
          transform={`translate(540, ${840 + formulaEnt.translateY})`}>
          {/* Formula background pill */}
          <rect x={-200} y={-30} width={400} height={60} rx={30}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />
          {/* F highlighted in blue */}
          <text x={-100} y={8} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={44} fontWeight={700} fill={COLORS.sky_blue}>
            F
          </text>
          <text x={-50} y={8} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={44} fontWeight={400} fill={COLORS.deep_black} opacity={0.5}>
            =
          </text>
          {/* m highlighted in orange */}
          <text x={0} y={8} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={44} fontWeight={700} fill={COLORS.orange}>
            m
          </text>
          <text x={44} y={8} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={44} fontWeight={400} fill={COLORS.deep_black} opacity={0.5}>
            ·
          </text>
          {/* a highlighted in green */}
          <text x={90} y={8} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={44} fontWeight={700} fill={COLORS.green}>
            a
          </text>
          {/* Subtext */}
          <text x={0} y={58} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={500} fill={COLORS.cool_silver}>
            Less deceleration = crew survival
          </text>
        </g>

        {/* ── 3 Large physics icons (r=80) ───────────────────────── */}

        {/* Icon 1: Gravity — downward arrow + gravity well curves */}
        <g opacity={icon1.opacity}
          transform={`translate(190, ${1050 + icon1.translateY + float1})`}>
          <circle cx={0} cy={0} r={80} fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={500} strokeDashoffset={icon1Border} />
          {/* Gravity well — concentric curves */}
          <path d="M -40,-10 Q 0,35 40,-10" fill="none"
            stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.3} />
          <path d="M -30,5 Q 0,35 30,5" fill="none"
            stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.4} />
          <path d="M -20,18 Q 0,35 20,18" fill="none"
            stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.5} />
          {/* Central mass dot */}
          <circle cx={0} cy={30} r={6} fill={COLORS.sky_blue} fillOpacity={0.5} />
          {/* Gravity arrow */}
          <line x1={0} y1={-45} x2={0} y2={-12}
            stroke={COLORS.sky_blue} strokeWidth={3} markerEnd="url(#arrow)" />
          <text x={0} y={-55} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.sky_blue} opacity={0.6}>
            9.8 m/s²
          </text>
          <text x={0} y={112} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            GRAVITY
          </text>
        </g>

        {/* Icon 2: Damping — water wave ripples */}
        <g opacity={icon2.opacity}
          transform={`translate(540, ${1050 + icon2.translateY + float2})`}>
          <circle cx={0} cy={0} r={80} fill={COLORS.green} fillOpacity={0.08}
            stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={500} strokeDashoffset={icon2Border} />
          {/* Water ripple waves (3 concentric) */}
          <path d="M -50,-15 Q -25,10 0,-15 Q 25,10 50,-15" fill="none"
            stroke={COLORS.green} strokeWidth={2.5} opacity={0.5 * shimmer} />
          <path d="M -40,5 Q -20,22 0,5 Q 20,22 40,5" fill="none"
            stroke={COLORS.green} strokeWidth={2} opacity={0.4 * shimmer} />
          <path d="M -30,22 Q -15,35 0,22 Q 15,35 30,22" fill="none"
            stroke={COLORS.green} strokeWidth={1.5} opacity={0.3 * shimmer} />
          {/* Impact drop */}
          <circle cx={0} cy={-30} r={5} fill={COLORS.green} fillOpacity={0.45} />
          {/* Splash lines */}
          <line x1={-8} y1={-38} x2={-16} y2={-50}
            stroke={COLORS.green} strokeWidth={1.5} opacity={0.3} />
          <line x1={8} y1={-38} x2={16} y2={-50}
            stroke={COLORS.green} strokeWidth={1.5} opacity={0.3} />
          <text x={0} y={112} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.green}>
            DAMPING
          </text>
        </g>

        {/* Icon 3: Impact — explosion burst lines */}
        <g opacity={icon3.opacity}
          transform={`translate(890, ${1050 + icon3.translateY + float3})`}>
          <circle cx={0} cy={0} r={80} fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={500} strokeDashoffset={icon3Border} />
          {/* Explosion burst — 8 radiating lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = Math.cos(rad) * 12;
            const y1 = Math.sin(rad) * 12;
            const x2 = Math.cos(rad) * 38;
            const y2 = Math.sin(rad) * 38;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.orange} strokeWidth={2.5}
                strokeLinecap="round" opacity={0.5} />
            );
          })}
          {/* Central impact circle */}
          <circle cx={0} cy={0} r={10}
            fill={COLORS.orange} fillOpacity={0.3}
            stroke={COLORS.orange} strokeWidth={2} />
          {/* Lightning bolt */}
          <path d="M -4,-24 L 4,-6 L -4,-6 L 4,16"
            fill="none" stroke={COLORS.orange} strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
          <text x={0} y={112} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.orange}>
            IMPACT
          </text>
        </g>

        {/* ── Comparison cards (with icons) ──────────────────────── */}
        {/* Ground landing — FATAL */}
        <g opacity={card1.opacity}
          transform={`translate(60, ${1230 + card1.translateY})`}>
          <rect x={0} y={0} width={460} height={110} rx={14}
            fill={COLORS.vibrant_red} fillOpacity={0.04}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* X mark icon */}
          <g transform="translate(40, 28)">
            <circle cx={24} cy={24} r={22}
              fill={COLORS.vibrant_red} fillOpacity={0.12}
              stroke={COLORS.vibrant_red} strokeWidth={2} />
            <line x1={14} y1={14} x2={34} y2={34}
              stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
            <line x1={34} y1={14} x2={14} y2={34}
              stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          </g>
          <text x={110} y={40}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            GROUND LANDING
          </text>
          <text x={110} y={78}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={800} fill={COLORS.vibrant_red}>
            Fatal G-Forces
          </text>
        </g>

        {/* Water landing — SURVIVABLE */}
        <g opacity={card2.opacity}
          transform={`translate(560, ${1230 + card2.translateY})`}>
          <rect x={0} y={0} width={460} height={110} rx={14}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={2} />
          {/* Checkmark icon */}
          <g transform="translate(40, 28)">
            <circle cx={24} cy={24} r={22}
              fill={COLORS.green} fillOpacity={0.12}
              stroke={COLORS.green} strokeWidth={2} />
            <path d="M 12,24 L 20,32 L 36,16"
              fill="none" stroke={COLORS.green} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={110} y={40}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            WATER LANDING
          </text>
          <text x={110} y={78}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={800} fill={COLORS.green}>
            Survivable
          </text>
        </g>

        {/* ── Bottom divider + note ──────────────────────────────── */}
        <line x1={60} y1={1410} x2={1020} y2={1410}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.06} />
        <g opacity={bottomEnt.opacity * 0.5}>
          <text x={540} y={1460} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={600} fill={COLORS.cool_silver}>
            Water absorbs energy over a longer distance
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
