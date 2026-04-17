/**
 * Scene 12 — Count Becomes 300
 * "currentPassengerCount for that train becomes 300,"
 * CSV: 53.440s → 56.730s
 * Duration: 99 frames (3.3s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Shows the instance variable updating from 0 → 300 in a single
 * object memory card for KL2401. Emphasizes PER-OBJECT storage.
 * Large animated counter + code representation.
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring
 *   Phase 2 (frames 18–70): Object card, counter tick, code card
 *   Phase 3 (frames 60–end): Pulse, shimmer, float
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene12_CountBecomes300: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headlineEntry = useSpringEntrance(frame, 5);
  const subEntry = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Object memory card (large, centered)
  const objCard = useSpringEntrance(frame, 16);
  const objPerim = 2 * (560 + 440);
  const objBorderDash = interpolate(frame, [16, 46], [objPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Counter: 0 → 300
  const counter = useCounter(frame, 20, 300, 36);

  // Code card
  const codeCard = useSpringEntrance(frame, 32);
  const codePerim = 2 * (960 + 160);
  const codeBorderDash = interpolate(frame, [32, 56], [codePerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Arrow connector (code → object)
  const arrowLen = 140;
  const arrowDash = usePathDraw(frame, 28, arrowLen, 18);

  // "INSTANCE" badge
  const badgeEntry = useSpringEntrance(frame, 22);

  // KL2401 ID badge
  const idBadge = useSpringEntrance(frame, 12);

  // Summary card
  const summaryCard = useSpringEntrance(frame, 48);

  // Comparison ghost (old value fade)
  const oldValueFade = interpolate(frame, [20, 40], [0.5, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const counterGlow = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.04, 0.12]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INSTANCE VARIABLE · UPDATE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ────────────────────────────────────────── */}
        <g opacity={headlineEntry.opacity} transform={`translate(0, ${headlineEntry.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Count Becomes
          </text>
        </g>
        <g opacity={subEntry.opacity} transform={`translate(0, ${subEntry.translateY})`}>
          <text x={60} y={390} fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent}>
            300
          </text>
          <text x={300} y={390} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            passengers
          </text>
        </g>

        {/* ── KL2401 Badge ─────────────────────────────────────────────── */}
        <g opacity={idBadge.opacity} transform={`translate(0, ${idBadge.translateY})`}>
          <rect x={60} y={420} width={180} height={40} rx={10}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1} />
          <text x={150} y={446} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent}>
            TRAIN KL2401
          </text>
        </g>

        {/* ── ZONE C — Object memory card ─────────────────────────────── */}
        <g opacity={objCard.opacity} transform={`translate(0, ${objCard.translateY})`}>
          <rect x={260} y={500} width={560} height={440} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={objPerim} strokeDashoffset={objBorderDash} />

          {/* Header band */}
          <rect x={260} y={500} width={560} height={56} rx={20}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={540} y={538} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            KL2401 · INSTANCE MEMORY
          </text>

          {/* Field label */}
          <text x={300} y={600} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            currentPassengerCount
          </text>

          {/* Old value (fading out) */}
          <text x={540} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.text_muted} opacity={oldValueFade}>
            0
          </text>

          {/* Arrow from old → new */}
          <path d="M 540,660 L 540,640" fill="none"
            stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.3} />

          {/* Ghost glow */}
          <text x={540} y={760} textAnchor="middle"
            fontFamily={FONT} fontSize={180} fontWeight={800}
            fill={COLORS.accent} opacity={counterGlow}>
            {counter}
          </text>

          {/* Main counter */}
          <text x={540} y={755} textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.white}>
            {counter}
          </text>

          {/* Unit */}
          <text x={540} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            PASSENGERS
          </text>

          {/* INSTANCE badge */}
          <g opacity={badgeEntry.opacity}>
            <rect x={400} y={860} width={280} height={40} rx={10}
              fill={COLORS.accent} fillOpacity={0.08} />
            <text x={540} y={887} textAnchor="middle"
              fontFamily={FONT} fontSize={20} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic"
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '540px 882px' }}>
              INSTANCE VARIABLE
            </text>
          </g>
        </g>

        {/* Outer glow ring */}
        <g opacity={objCard.opacity * shimmer * 0.15}>
          <rect x={250} y={490} width={580} height={460} rx={24}
            fill="none" stroke={COLORS.accent} strokeWidth={1} />
        </g>

        {/* ── Arrow from code to object ───────────────────────────────── */}
        <path d="M 500,980 L 500,1050"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Code representation card ─────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <rect x={60} y={1080} width={960} height={160} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={codePerim} strokeDashoffset={codeBorderDash} />
          <rect x={60} y={1080} width={6} height={160} rx={3}
            fill={COLORS.accent} />

          {/* Line number */}
          <text x={90} y={1172} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={22} fontWeight={500} fill={COLORS.text_muted} opacity={0.4}>
            22
          </text>

          {/* Code: this.currentPassengerCount = 300; */}
          <text x={130} y={1172}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500}>
            <tspan fill={COLORS.accent}>this</tspan>
            <tspan fill={COLORS.text_muted}>.currentPassengerCount = </tspan>
            <tspan fill={COLORS.white}>300</tspan>
            <tspan fill={COLORS.text_muted}>;</tspan>
          </text>
        </g>

        {/* ── Two info cards below ─────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          {/* Left card */}
          <BentoCard x={60} y={1280} w={460} h={160} />
          <text x={100} y={1334} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.06em">
            SCOPE
          </text>
          <text x={100} y={1386} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            This object only
          </text>

          {/* Right card */}
          <BentoCard x={560} y={1280} w={460} h={160} accent />
          <text x={600} y={1334} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.06em">
            LIFETIME
          </text>
          <text x={600} y={1386} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            Lives with KL2401
          </text>
        </g>

        {/* ── Summary strip ────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity * 0.8}>
          <BentoCard x={60} y={1480} w={960} h={100} />
          <rect x={60} y={1480} width={6} height={100} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1540} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>
            Other trains are unaffected — their count stays separate
          </text>
        </g>

        {/* ── Floating accents ─────────────────────────────────────────── */}
        <g transform={`translate(940, ${1620 + breathe})`}>
          <circle cx={0} cy={0} r={12} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>
        <g transform={`translate(80, ${1660 + breathe * 0.6})`}>
          <circle cx={0} cy={0} r={8} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>
        <g transform={`translate(540, ${1700 + breathe * 0.4})`}>
          <circle cx={0} cy={0} r={6} fill={COLORS.accent} fillOpacity={0.02 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
