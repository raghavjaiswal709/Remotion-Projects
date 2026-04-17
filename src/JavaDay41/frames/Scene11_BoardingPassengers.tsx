/**
 * Scene 11 — Boarding Passengers
 * "When train KL2401 boards 300 passengers,"
 * CSV: 47.950s → 53.440s
 * Duration: 165 frames (5.5s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Shows a platform boarding scene: passengers flowing into Train KL2401.
 * Counter ticking up from 0 → 300. Boarding arrow animation.
 * Platform with queue, train door open.
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Label + headline spring, train shell
 *   Phase 2 (frames 20–100): Passenger dots, boarding arrows, counter
 *   Phase 3 (frames 90–end): Passenger pulse, door gleam, breathe
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene11_BoardingPassengers: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const trainLabel = useSpringEntrance(frame, 4);
  const headlineWords = ['BOARDING', '300'];
  const headlineSprings = headlineWords.map((_, i) => {
    const f = Math.max(0, frame - 6 - i * 8);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  // ── Phase 2 — Train body ──────────────────────────────────────────────────
  const trainBody = useSpringEntrance(frame, 18);
  const trainPerim = 2 * (700 + 260);
  const trainBorderDash = interpolate(frame, [18, 48], [trainPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Door opens (slides up)
  const doorOpen = interpolate(frame, [30, 55], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Wheels
  const wheelSpin = (frame * 0.05) % (2 * Math.PI);

  // ── Platform ──────────────────────────────────────────────────────────────
  const platformEntry = useSpringEntrance(frame, 24);
  const platformDrawLen = 960;
  const platformDash = usePathDraw(frame, 24, platformDrawLen, 30);

  // ── Boarding arrow ────────────────────────────────────────────────────────
  const arrowLen = 180;
  const arrowDash = usePathDraw(frame, 36, arrowLen, 22);
  const arrowPulse = interpolate(Math.sin(frame * 0.14), [-1, 1], [0.5, 1.0]);

  // ── Passenger dots staggered ──────────────────────────────────────────────
  const passengerCount = 12;
  const passengerEntries = Array.from({ length: passengerCount }, (_, i) =>
    useSpringEntrance(frame, 30 + i * 4)
  );

  // ── Counter ───────────────────────────────────────────────────────────────
  const counter = useCounter(frame, 28, 300, 60);
  const counterEntry = useSpringEntrance(frame, 28);

  // ── KL2401 Badge ──────────────────────────────────────────────────────────
  const badgeEntry = useSpringEntrance(frame, 14);
  const badgePerim = 2 * (180 + 42);
  const badgeDash = interpolate(frame, [14, 34], [badgePerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Summary card ──────────────────────────────────────────────────────────
  const summaryEntry = useSpringEntrance(frame, 76);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const doorGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.05, 0.15]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INSTANCE IN ACTION · BOARDING" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ────────────────────────────────────────── */}
        {headlineWords.map((word, i) => (
          <text key={i}
            x={i === 0 ? 60 : 540}
            y={310}
            opacity={headlineSprings[i].op}
            transform={`translate(0, ${headlineSprings[i].ty})`}
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={i === 1 ? COLORS.accent : COLORS.white}
          >
            {word}
          </text>
        ))}
        <g opacity={trainLabel.opacity} transform={`translate(0, ${trainLabel.translateY})`}>
          <text x={60} y={380} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            passengers boarding Train KL2401
          </text>
        </g>

        {/* ── KL2401 Badge ─────────────────────────────────────────────── */}
        <g opacity={badgeEntry.opacity} transform={`translate(0, ${badgeEntry.translateY})`}>
          <rect x={60} y={410} width={180} height={42} rx={10}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={badgePerim} strokeDashoffset={badgeDash} />
          <text x={150} y={438} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.05em">
            KL2401
          </text>
        </g>

        {/* ── ZONE C — Train body SVG ──────────────────────────────────── */}
        <g opacity={trainBody.opacity} transform={`translate(0, ${trainBody.translateY})`}>
          {/* Main body */}
          <rect x={180} y={520} width={700} height={260} rx={24}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={trainPerim} strokeDashoffset={trainBorderDash} />

          {/* Cab (front section) */}
          <rect x={180} y={520} width={160} height={260} rx={24}
            fill={COLORS.accent} fillOpacity={0.05} />
          <text x={260} y={668} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            CAB
          </text>

          {/* Roof line */}
          <line x1={200} y1={524} x2={860} y2={524}
            stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.3} />

          {/* Windows (3) */}
          {[420, 560, 700].map((wx, i) => (
            <rect key={i} x={wx} y={548} width={80} height={52} rx={8}
              fill={COLORS.accent} fillOpacity={0.03}
              stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.2} />
          ))}

          {/* Door — opening animation */}
          <g>
            <rect x={340} y={560} width={60} height={140} rx={4}
              fill={COLORS.accent} fillOpacity={doorGlow}
              stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Upper half slides up (door opens) */}
            <rect x={342} y={562 - doorOpen * 0.6} width={56} height={Math.max(1, 70 - doorOpen * 0.6)} rx={2}
              fill={COLORS.bg_secondary} />
            {/* OPEN text */}
            {doorOpen > 50 && (
              <text x={370} y={645} textAnchor="middle"
                fontFamily={FONT} fontSize={14} fontWeight={800}
                fill={COLORS.accent} opacity={0.6}>
                OPEN
              </text>
            )}
          </g>

          {/* Smokestack */}
          <rect x={220} y={494} width={30} height={28} rx={4}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1} />

          {/* Smoke particles */}
          {[0, 1, 2].map(i => {
            const smokeY = 490 - i * 22 - (frame * 0.5) % 40;
            const smokeOp = interpolate(smokeY, [430, 490], [0, 0.15], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <circle key={i}
                cx={235 + Math.sin(frame * 0.03 + i) * 10}
                cy={smokeY}
                r={6 + i * 3}
                fill={COLORS.accent} fillOpacity={smokeOp} />
            );
          })}

          {/* Wheels (4) */}
          {[240, 360, 660, 780].map((wx, i) => (
            <g key={i} transform={`translate(${wx}, 790)`}>
              <circle cx={0} cy={0} r={22} fill="none"
                stroke={COLORS.accent} strokeWidth={2} />
              <circle cx={0} cy={0} r={4} fill={COLORS.accent} />
              {/* Spoke */}
              <line x1={0} y1={-18} x2={0} y2={18}
                stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.3}
                transform={`rotate(${(wheelSpin * 180) / Math.PI + i * 45})`}
                style={{ transformOrigin: '0px 0px' }} />
            </g>
          ))}

          {/* Rails */}
          <line x1={140} y1={815} x2={920} y2={815}
            stroke={COLORS.text_muted} strokeWidth={3} strokeOpacity={0.2} />
          <line x1={140} y1={825} x2={920} y2={825}
            stroke={COLORS.text_muted} strokeWidth={3} strokeOpacity={0.2} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={160 + i * 64} y={814} width={24} height={12} rx={2}
              fill={COLORS.text_muted} fillOpacity={0.08} />
          ))}
        </g>

        {/* ── Platform ────────────────────────────────────────────────── */}
        <g opacity={platformEntry.opacity}>
          <line x1={60} y1={860} x2={1020} y2={860}
            stroke={COLORS.text_muted} strokeWidth={2} strokeOpacity={0.15}
            strokeDasharray={platformDrawLen} strokeDashoffset={platformDash} />
          <text x={80} y={885}
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.4} letterSpacing="0.1em">
            PLATFORM
          </text>
        </g>

        {/* ── Boarding arrow (platform → door) ────────────────────────── */}
        <path d="M 370,860 L 370,710"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeOpacity={arrowPulse}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Passenger dots queue ─────────────────────────────────────── */}
        {Array.from({ length: passengerCount }, (_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const px = 300 + col * 40;
          const py = 900 + row * 40;
          return (
            <g key={i} opacity={passengerEntries[i].opacity}
              transform={`translate(0, ${passengerEntries[i].translateY * 0.5})`}>
              {/* Head */}
              <circle cx={px} cy={py} r={8}
                fill={COLORS.accent} fillOpacity={0.25 + i * 0.04} />
              {/* Body */}
              <line x1={px} y1={py + 8} x2={px} y2={py + 20}
                stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.2} />
            </g>
          );
        })}

        {/* "PASSENGERS" label next to dots */}
        <g opacity={platformEntry.opacity * 0.6}>
          <text x={510} y={930} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.06em">
            PASSENGERS IN QUEUE
          </text>
        </g>

        {/* ── Counter display ─────────────────────────────────────────── */}
        <g opacity={counterEntry.opacity} transform={`translate(0, ${counterEntry.translateY})`}>
          <BentoCard x={60} y={1020} w={460} h={200} accent />
          <text x={100} y={1080} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.08em">
            PASSENGERS BOARDING
          </text>
          {/* Ghost number */}
          <text x={290} y={1195} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}>
            {counter}
          </text>
          {/* Main number */}
          <text x={290} y={1190} textAnchor="middle"
            fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.white}>
            {counter}
          </text>
        </g>

        {/* ── Train ID card ───────────────────────────────────────────── */}
        <g opacity={counterEntry.opacity} transform={`translate(0, ${counterEntry.translateY})`}>
          <BentoCard x={560} y={1020} w={460} h={200} />

          {/* Mini train icon */}
          <rect x={600} y={1070} width={100} height={40} rx={6}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={630} cy={1118} r={8} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={672} cy={1118} r={8} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} />

          <text x={720} y={1096} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>
            KL2401
          </text>
          <text x={600} y={1170} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Instance: boarding action
          </text>
        </g>

        {/* ── Summary card ─────────────────────────────────────────────── */}
        <g opacity={summaryEntry.opacity} transform={`translate(0, ${summaryEntry.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={120} />
          <rect x={60} y={1260} width={6} height={120} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1328} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            300 passengers board this specific train instance
          </text>
        </g>

        {/* ── Floating elements ────────────────────────────────────────── */}
        <g transform={`translate(900, ${1440 + breathe})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.accent}
            strokeWidth={1} strokeOpacity={0.1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(120, ${1500 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={8} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s11.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
