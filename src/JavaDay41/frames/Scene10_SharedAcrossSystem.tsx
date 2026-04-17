/**
 * Scene 10 — Shared Across System
 * "one copy shared across every train object in the entire system."
 * CSV: 42.580s → 47.280s
 * Duration: 161 frames (5.37s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Shows ONE class-level memory box at center-top, with arrows
 * radiating down to multiple train objects (KL2401, MH1102, AP0503).
 * Each object reads from the same shared variable.
 * Giant "ONE COPY" hero text.
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Label + headline spring
 *   Phase 2 (frames 20–100): Shared box, objects cascade,
 *                             connector path-draws
 *   Phase 3 (frames 90–end): Pulse shared box, arrow shimmer, float
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

export const Scene10_SharedAcrossSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const heroWords = ['ONE', 'COPY'];
  const heroSprings = heroWords.map((_, i) => {
    const f = Math.max(0, frame - 6 - i * 8);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [28, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });
  const subEntry = useSpringEntrance(frame, 16);

  // ── Phase 2 — Shared box at top center ─────────────────────────────────────
  const sharedBox = useSpringEntrance(frame, 22);
  const sharedPerim = 2 * (520 + 200);
  const sharedBorderDash = interpolate(frame, [22, 52], [sharedPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Counter for shared value
  const sharedCounter = useCounter(frame, 36, 429, 45);

  // Glow ring on shared box
  const sharedGlow = useSpringEntrance(frame, 50);

  // ── Train objects (3 objects side by side) ─────────────────────────────────
  const trains = [
    { id: 'KL2401', count: 142, x: 60 },
    { id: 'MH1102', count: 87, x: 390 },
    { id: 'AP0503', count: 200, x: 720 },
  ];
  const trainEntries = trains.map((_, i) => useSpringEntrance(frame, 40 + i * 10));
  const trainCounters = trains.map((t, i) => useCounter(frame, 50 + i * 10, t.count, 35));
  const trainPerim = 2 * (280 + 260);
  const trainBorderDashes = trains.map((_, i) =>
    interpolate(frame, [40 + i * 10, 65 + i * 10], [trainPerim, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );

  // ── Connector arrows (shared box → each train) ───────────────────────────
  const arrowLens = [220, 220, 220];
  const arrowDashes = arrowLens.map((len, i) =>
    usePathDraw(frame, 36 + i * 10, len, 20)
  );

  // ── Bottom summary card ───────────────────────────────────────────────────
  const summaryCard = useSpringEntrance(frame, 74);

  // ── Badge "SHARED" ────────────────────────────────────────────────────────
  const sharedBadge = useSpringEntrance(frame, 30);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const arrowPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.3, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="STATIC VARIABLE · CLASS LEVEL" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero text ───────────────────────────────────────── */}
        {heroWords.map((word, i) => (
          <text key={i}
            x={i === 0 ? 60 : 340}
            y={310}
            opacity={heroSprings[i].op}
            transform={`translate(0, ${heroSprings[i].ty})`}
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={i === 0 ? COLORS.white : COLORS.accent}
          >
            {word}
          </text>
        ))}
        <g opacity={subEntry.opacity} transform={`translate(0, ${subEntry.translateY})`}>
          <text x={60} y={390} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            Shared across every train in the system
          </text>
        </g>

        {/* ── ZONE C — Shared class memory box (center top) ───────────── */}
        <g opacity={sharedBox.opacity} transform={`translate(0, ${sharedBox.translateY})`}>
          <rect x={280} y={460} width={520} height={200} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={sharedPerim} strokeDashoffset={sharedBorderDash}
          />

          {/* Header bar */}
          <rect x={280} y={460} width={520} height={52} rx={20}
            fill={COLORS.accent} fillOpacity={0.12} />
          <text x={540} y={496} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TRAIN CLASS MEMORY
          </text>

          {/* Field label */}
          <text x={310} y={560} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            totalPassengersInSystem
          </text>

          {/* Value */}
          <text x={760} y={570} textAnchor="end"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.white}>
            {sharedCounter}
          </text>

          {/* SHARED badge */}
          <g opacity={sharedBadge.opacity}>
            <rect x={400} y={600} width={280} height={44} rx={12}
              fill={COLORS.accent} fillOpacity={0.1} />
            <text x={540} y={630} textAnchor="middle"
              fontFamily={FONT} fontSize={22} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic"
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '540px 624px' }}>
              SHARED — ONE COPY
            </text>
          </g>
        </g>

        {/* Glow ring */}
        <g opacity={sharedGlow.opacity * shimmer * 0.3}>
          <rect x={270} y={450} width={540} height={220} rx={24}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 560px' }}
          />
        </g>

        {/* ── Connector arrows (fan out from shared box) ──────────────── */}
        {trains.map((t, i) => {
          const startX = 540;
          const startY = 660;
          const endX = t.x + 140;
          const endY = 780;
          return (
            <path key={i}
              d={`M ${startX},${startY} Q ${startX},${(startY + endY) / 2} ${endX},${endY}`}
              fill="none"
              stroke={COLORS.accent}
              strokeWidth={2}
              strokeOpacity={arrowPulse}
              strokeDasharray={arrowLens[i]}
              strokeDashoffset={arrowDashes[i]}
              strokeLinecap="round"
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* ── Three train objects ──────────────────────────────────────── */}
        {trains.map((train, i) => (
          <g key={i} opacity={trainEntries[i].opacity}
            transform={`translate(0, ${trainEntries[i].translateY})`}>

            {/* Object card */}
            <rect x={train.x} y={790} width={280} height={260} rx={16}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={1.5}
              strokeDasharray={trainPerim} strokeDashoffset={trainBorderDashes[i]}
            />

            {/* Object header */}
            <rect x={train.x} y={790} width={280} height={44} rx={16}
              fill={COLORS.accent} fillOpacity={0.06} />
            <text x={train.x + 140} y={820} textAnchor="middle"
              fontFamily={FONT} fontSize={20} fontWeight={800}
              fill={COLORS.text_muted} letterSpacing="0.08em">
              OBJECT
            </text>

            {/* Train mini icon */}
            <rect x={train.x + 30} y={850} width={140} height={36} rx={6}
              fill={COLORS.accent} fillOpacity={0.06}
              stroke={COLORS.accent} strokeWidth={1} />
            <circle cx={train.x + 65} cy={894} r={10}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={train.x + 135} cy={894} r={10}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
            <line x1={train.x + 20} y1={906} x2={train.x + 180} y2={906}
              stroke={COLORS.text_muted} strokeWidth={1.5} strokeOpacity={0.2} />

            {/* Train ID */}
            <text x={train.x + 140} y={950} textAnchor="middle"
              fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.accent}>
              {train.id}
            </text>

            {/* Instance field */}
            <text x={train.x + 140} y={990} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.text_muted}>
              currentPassenger
            </text>
            <text x={train.x + 140} y={1030} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>
              {trainCounters[i]}
            </text>
          </g>
        ))}

        {/* ── "READS FROM SAME" indicator ─────────────────────────────── */}
        {trains.map((t, i) => (
          <g key={`ind-${i}`} opacity={trainEntries[i].opacity * 0.5}>
            <text x={t.x + 140} y={1070} textAnchor="middle"
              fontFamily={FONT} fontSize={14} fontWeight={800}
              fill={COLORS.accent} letterSpacing="0.08em">
              READS SHARED
            </text>
          </g>
        ))}

        {/* ── Summary card ─────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={160} accent />
          <rect x={60} y={1120} width={6} height={160} rx={3}
            fill={COLORS.accent} />

          <text x={100} y={1180} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            All three trains see the same value: {sharedCounter}
          </text>
          <text x={100} y={1224} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            One storage location, shared across the entire system
          </text>
        </g>

        {/* ── Network diagram at bottom ────────────────────────────────── */}
        <g opacity={summaryCard.opacity * 0.4} transform={`translate(540, ${1400 + breathe})`}>
          {/* Central node */}
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={0} y={5} textAnchor="middle"
            fontFamily={FONT} fontSize={14} fontWeight={800}
            fill={COLORS.accent}>
            CLASS
          </text>
          {/* Radiating nodes */}
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const nx = Math.cos(rad) * 100;
            const ny = Math.sin(rad) * 60;
            return (
              <g key={i}>
                <line x1={0} y1={0} x2={nx} y2={ny}
                  stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.15} />
                <circle cx={nx} cy={ny} r={12}
                  fill={COLORS.accent} fillOpacity={0.04}
                  stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.2} />
              </g>
            );
          })}
        </g>

        {/* Floating accents */}
        <g transform={`translate(100, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={10} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>
        <g transform={`translate(980, ${1620 + breathe * 0.6})`}>
          <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
