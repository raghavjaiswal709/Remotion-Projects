/**
 * Scene 15 — Lifetimes & Purposes
 * "two different lifetimes, two different purposes."
 * CSV: 63.760s → 67.700s
 * Duration: 118 frames (3.93s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Two-column comparison: LIFETIME on top row, PURPOSE on bottom row.
 * Left=Instance (object-bound, track per-train data), Right=Static (class-bound, track system-wide).
 * Clock/hourglass style for lifetime, target/goal for purpose.
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 14–80): Four comparison tiles appear staggered
 *   Phase 3 (frames 70–end): Pulse, shimmer, connectors breathe
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

export const Scene15_LifetimesPurposes: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headWord1 = useSpringEntrance(frame, 4);
  const headWord2 = useSpringEntrance(frame, 8);
  const headWord3 = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Row divider headers
  const lifetimeLabel = useSpringEntrance(frame, 16);
  const purposeLabel = useSpringEntrance(frame, 40);

  // Top-left: Instance lifetime
  const tl = useSpringEntrance(frame, 20);
  const tlPerim = 2 * (440 + 280);
  const tlBorder = interpolate(frame, [20, 44], [tlPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Top-right: Static lifetime
  const tr = useSpringEntrance(frame, 26);
  const trPerim = 2 * (440 + 280);
  const trBorder = interpolate(frame, [26, 50], [trPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Bottom-left: Instance purpose
  const bl = useSpringEntrance(frame, 44);
  const blPerim = 2 * (440 + 260);
  const blBorder = interpolate(frame, [44, 68], [blPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Bottom-right: Static purpose
  const br = useSpringEntrance(frame, 50);
  const brPerim = 2 * (440 + 260);
  const brBorder = interpolate(frame, [50, 74], [brPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Connectors
  const connV = 300;
  const connVDash = usePathDraw(frame, 36, connV, 22);
  const connHTop = 40;
  const connHTopDash = usePathDraw(frame, 30, connHTop, 16);
  const connHBot = 40;
  const connHBotDash = usePathDraw(frame, 54, connHBot, 16);

  // Summary
  const summaryCard = useSpringEntrance(frame, 62);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Clock animation (instance: short-lived → hour hand rotates)
  const clockAngle = interpolate(frame, [22, 60], [0, 270], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  // Infinity loop for static
  const infT = (frame % 90) / 90;
  const infX = Math.sin(infT * Math.PI * 2) * 30;
  const infY = Math.sin(infT * Math.PI * 4) * 12;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="VARIABLE CONTRAST · COMPARISON" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word headline ──────────────────────────────── */}
        <g opacity={headWord1.opacity} transform={`translate(0, ${headWord1.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Two Different
          </text>
        </g>
        <g opacity={headWord2.opacity} transform={`translate(0, ${headWord2.translateY})`}>
          <text x={60} y={390} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Lifetimes
          </text>
        </g>
        <g opacity={headWord3.opacity} transform={`translate(0, ${headWord3.translateY})`}>
          <text x={440} y={390} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            , Purposes
          </text>
        </g>

        {/* ── Row header: LIFETIME ────────────────────────────────────── */}
        <g opacity={lifetimeLabel.opacity} transform={`translate(0, ${lifetimeLabel.translateY})`}>
          <text x={540} y={470} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.15em">
            LIFETIME
          </text>
          <line x1={60} y1={480} x2={1020} y2={480}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        </g>

        {/* ── Top-left: Instance Lifetime ─────────────────────────────── */}
        <g opacity={tl.opacity} transform={`translate(0, ${tl.translateY})`}>
          <rect x={60} y={500} width={440} height={280} rx={20}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1.5}
            strokeDasharray={tlPerim} strokeDashoffset={tlBorder} />

          {/* Clock icon */}
          <circle cx={170} cy={610} r={40} fill="none"
            stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={170} y1={610} x2={170} y2={580}
            stroke={COLORS.text_muted} strokeWidth={2} strokeLinecap="round" />
          <line x1={170} y1={610}
            x2={170 + Math.cos((clockAngle - 90) * Math.PI / 180) * 28}
            y2={610 + Math.sin((clockAngle - 90) * Math.PI / 180) * 28}
            stroke={COLORS.white} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={170} cy={610} r={3} fill={COLORS.white} />

          {/* Label */}
          <text x={240} y={600} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Object
          </text>
          <text x={240} y={640} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Lifetime
          </text>

          {/* Detail */}
          <text x={100} y={720} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.6}>
            Created with new Train()
          </text>
          <text x={100} y={752} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.6}>
            Dies when GC collects it
          </text>
        </g>

        {/* ── Top-right: Static Lifetime ──────────────────────────────── */}
        <g opacity={tr.opacity} transform={`translate(0, ${tr.translateY})`}>
          <rect x={560} y={500} width={460} height={280} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={trPerim} strokeDashoffset={trBorder} />

          {/* Infinity / long-running icon */}
          <g transform={`translate(670, 610)`}>
            <ellipse cx={-20} cy={0} rx={24} ry={16} fill="none"
              stroke={COLORS.accent} strokeWidth={2.5}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '-20px 0px' }} />
            <ellipse cx={20} cy={0} rx={24} ry={16} fill="none"
              stroke={COLORS.accent} strokeWidth={2.5}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '20px 0px' }} />
            {/* Orbiting dot */}
            <circle cx={infX} cy={infY} r={3} fill={COLORS.accent} />
          </g>

          <text x={730} y={600} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Class
          </text>
          <text x={730} y={640} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Lifetime
          </text>

          <text x={600} y={720} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}>
            Created when class loads
          </text>
          <text x={600} y={752} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}>
            Lives until JVM shuts down
          </text>
        </g>

        {/* ── VS connector between top cards ──────────────────────────── */}
        <line x1={510} y1={640} x2={550} y2={640}
          stroke="rgba(255,255,255,0.06)" strokeWidth={2}
          strokeDasharray={connHTop} strokeDashoffset={connHTopDash} />

        {/* ── Row header: PURPOSE ─────────────────────────────────────── */}
        <g opacity={purposeLabel.opacity} transform={`translate(0, ${purposeLabel.translateY})`}>
          <text x={540} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.15em">
            PURPOSE
          </text>
          <line x1={60} y1={840} x2={1020} y2={840}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        </g>

        {/* ── Bottom-left: Instance Purpose ───────────────────────────── */}
        <g opacity={bl.opacity} transform={`translate(0, ${bl.translateY})`}>
          <rect x={60} y={860} width={440} height={260} rx={20}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1.5}
            strokeDasharray={blPerim} strokeDashoffset={blBorder} />

          {/* Target icon */}
          <circle cx={170} cy={960} r={36} fill="none"
            stroke={COLORS.text_muted} strokeWidth={1.5} />
          <circle cx={170} cy={960} r={22} fill="none"
            stroke={COLORS.text_muted} strokeWidth={1.5} />
          <circle cx={170} cy={960} r={8} fill={COLORS.text_muted} fillOpacity={0.3} />

          <text x={230} y={950} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Track per-train
          </text>
          <text x={230} y={988} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            data
          </text>

          <text x={100} y={1060} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Passenger count, route, speed
          </text>
          <text x={100} y={1090} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Unique to each train object
          </text>
        </g>

        {/* ── Bottom-right: Static Purpose ────────────────────────────── */}
        <g opacity={br.opacity} transform={`translate(0, ${br.translateY})`}>
          <rect x={560} y={860} width={460} height={260} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={brPerim} strokeDashoffset={brBorder} />

          {/* Globe/system icon */}
          <circle cx={670} cy={960} r={36} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} />
          <ellipse cx={670} cy={960} rx={14} ry={36} fill="none"
            stroke={COLORS.accent} strokeWidth={1} />
          <line x1={634} y1={960} x2={706} y2={960}
            stroke={COLORS.accent} strokeWidth={1} />

          <text x={730} y={950} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            Track system-
          </text>
          <text x={730} y={988} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            wide data
          </text>

          <text x={600} y={1060} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent} opacity={0.5}>
            Total passengers, fleet size
          </text>
          <text x={600} y={1090} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent} opacity={0.5}>
            Shared across all instances
          </text>
        </g>

        {/* ── VS connector between bottom cards ───────────────────────── */}
        <line x1={510} y1={990} x2={550} y2={990}
          stroke="rgba(255,255,255,0.06)" strokeWidth={2}
          strokeDasharray={connHBot} strokeDashoffset={connHBotDash} />

        {/* ── Vertical connectors ─────────────────────────────────────── */}
        <line x1={280} y1={780} x2={280} y2={860}
          stroke="rgba(255,255,255,0.04)" strokeWidth={1.5}
          strokeDasharray={connV / 4} strokeDashoffset={connVDash / 4}
          strokeLinecap="round" />
        <line x1={790} y1={780} x2={790} y2={860}
          stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.1}
          strokeDasharray={connV / 4} strokeDashoffset={connVDash / 4}
          strokeLinecap="round" />

        {/* ── Summary strip ────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={120} />
          <rect x={60} y={1180} width={6} height={120} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1250} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>
            Different scope, lifetime, and purpose — keep them clear
          </text>
        </g>

        {/* ── Bottom decorative ────────────────────────────────────────── */}
        {/* Four concept circles at bottom */}
        {[
          { x: 180, label: 'SCOPE', c: COLORS.text_muted },
          { x: 400, label: 'LIFE', c: COLORS.text_muted },
          { x: 680, label: 'USE', c: COLORS.accent },
          { x: 900, label: 'TYPE', c: COLORS.accent },
        ].map((item, i) => (
          <g key={i} opacity={summaryCard.opacity * 0.3}
            transform={`translate(${item.x}, ${1400 + breathe * (i % 2 === 0 ? 1 : -1)})`}>
            <circle cx={0} cy={0} r={28} fill={COLORS.bg_secondary}
              stroke={item.c} strokeWidth={1} strokeOpacity={0.15} />
            <text x={0} y={5} textAnchor="middle"
              fontFamily={FONT} fontSize={12} fontWeight={800}
              fill={item.c} opacity={0.5 * shimmer}>
              {item.label}
            </text>
          </g>
        ))}

        {/* Connecting line through all four */}
        <line x1={210} y1={1400} x2={870} y2={1400}
          stroke="rgba(255,255,255,0.03)" strokeWidth={1}
          opacity={summaryCard.opacity * 0.3} />

        {/* Floating orbs */}
        <g transform={`translate(100, ${1550 + breathe * 0.6})`}>
          <circle cx={0} cy={0} r={8} fill={COLORS.text_muted} fillOpacity={0.02 * shimmer} />
        </g>
        <g transform={`translate(980, ${1580 + breathe * -0.4})`}>
          <circle cx={0} cy={0} r={6} fill={COLORS.accent} fillOpacity={0.02 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
