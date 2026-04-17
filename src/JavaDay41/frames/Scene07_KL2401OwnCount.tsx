/**
 * Scene 07 — KL2401 Own Count
 * "train KL2401 carries its own count."
 * CSV: 24.340s → 29.480s
 * Duration: 175 frames (5.83s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Shows train KL2401 as a massive locomotive SVG
 * with its own currentPassengerCount highlighted.
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Section label + headline spring
 *   Phase 2 (frames 20–100): Locomotive path-draw, counter tick-up,
 *                             memory card spring entrance
 *   Phase 3 (frames 90–end): Wheel spin, smoke float, pulse badge
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

export const Scene07_KL2401OwnCount: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headlineEntry = useSpringEntrance(frame, 6);
  const sublineEntry = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Locomotive body
  const locoEntry = useSpringEntrance(frame, 18);

  // Locomotive body path-draw
  const locoBodyLen = 1200;
  const locoBodyDash = usePathDraw(frame, 20, locoBodyLen, 30);

  // Cab window
  const cabEntry = useSpringEntrance(frame, 28);

  // Smokestack
  const stackEntry = useSpringEntrance(frame, 32);

  // Cowcatcher
  const cowEntry = useSpringEntrance(frame, 26);

  // Wheels (4 wheels)
  const wheelEntries = [0, 1, 2, 3].map(i => useSpringEntrance(frame, 24 + i * 4));

  // Track
  const trackLen = 900;
  const trackDash = usePathDraw(frame, 22, trackLen, 20);

  // KL2401 label badge
  const badgeEntry = useSpringEntrance(frame, 36);
  const badgePerim = 2 * (320 + 80);
  const badgeBorderDash = interpolate(frame, [36, 56], [badgePerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Memory card
  const memCardEntry = useSpringEntrance(frame, 44);
  const memCardPerim = 2 * (520 + 260);
  const memBorderDash = interpolate(frame, [44, 70], [memCardPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Counter
  const counterVal = useCounter(frame, 50, 142, 40);

  // Field rows
  const field1Entry = useSpringEntrance(frame, 52);
  const field2Entry = useSpringEntrance(frame, 58);

  // "ITS OWN" emphasis
  const ownEntry = useSpringEntrance(frame, 64);

  // Connector lines
  const connLen = 120;
  const connDash = usePathDraw(frame, 48, connLen, 16);

  // Bottom info card
  const infoEntry = useSpringEntrance(frame, 60);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const wheelSpin = frame * 2.5;

  // Smoke particles
  const smokeParticles = [0, 1, 2].map(i => {
    const offset = (frame * 0.8 + i * 30) % 80;
    const smokeOp = interpolate(offset, [0, 40, 80], [0, 0.15, 0], { extrapolateRight: 'clamp' });
    return { x: -offset * 1.2, y: -offset * 0.6, r: 12 + offset * 0.3, op: smokeOp };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INSTANCE DATA · PER OBJECT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEntry.translateY})`} opacity={headlineEntry.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent}>
            KL2401
          </text>
        </g>
        <g transform={`translate(0, ${sublineEntry.translateY})`} opacity={sublineEntry.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>
            Carries its own count
          </text>
        </g>

        {/* ── ZONE C — Locomotive illustration ─────────────────────────── */}
        <g opacity={locoEntry.opacity} transform={`translate(120, ${540 + breathe * 0.3})`}>

          {/* Locomotive body outline */}
          <rect x={0} y={100} width={700} height={200} rx={12}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={locoBodyLen} strokeDashoffset={locoBodyDash}
          />

          {/* Body inner detail — horizontal stripe */}
          <line x1={20} y1={180} x2={680} y2={180}
            stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.2}
            strokeDasharray={700} strokeDashoffset={locoBodyDash * 0.6}
          />

          {/* Cab section (rear) */}
          <g opacity={cabEntry.opacity} transform={`translate(0, ${cabEntry.translateY * 0.3})`}>
            <rect x={520} y={40} width={180} height={260} rx={10}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={2}
            />
            {/* Window */}
            <rect x={545} y={65} width={130} height={80} rx={8}
              fill={COLORS.accent} fillOpacity={0.08}
              stroke={COLORS.accent} strokeWidth={1.5}
            />
            {/* Window cross */}
            <line x1={610} y1={65} x2={610} y2={145}
              stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.3} />
            <line x1={545} y1={105} x2={675} y2={105}
              stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.3} />
          </g>

          {/* Smokestack */}
          <g opacity={stackEntry.opacity} transform={`translate(0, ${stackEntry.translateY * 0.4})`}>
            <rect x={60} y={60} width={50} height={40} rx={4}
              fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={1.5}
            />
            <rect x={70} y={40} width={30} height={20} rx={6}
              fill={COLORS.accent} fillOpacity={0.3}
            />
          </g>

          {/* Smoke particles */}
          {smokeParticles.map((sp, i) => (
            <circle key={i} cx={85 + sp.x} cy={40 + sp.y} r={sp.r}
              fill={COLORS.white} fillOpacity={sp.op} />
          ))}

          {/* Front cowcatcher */}
          <g opacity={cowEntry.opacity}>
            <polygon points="0,300 -40,300 0,240"
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5}
            />
            <line x1={-40} y1={300} x2={0} y2={300}
              stroke={COLORS.accent} strokeWidth={2} />
          </g>

          {/* Wheels */}
          {[100, 260, 420, 580].map((wx, i) => (
            <g key={i} opacity={wheelEntries[i].opacity}>
              <circle cx={wx} cy={330} r={40}
                fill="none" stroke={COLORS.accent} strokeWidth={3}
              />
              <circle cx={wx} cy={330} r={22}
                fill="none" stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.4}
              />
              <circle cx={wx} cy={330} r={8}
                fill={COLORS.accent} fillOpacity={0.5} />
              {/* Spokes */}
              {[0, 45, 90, 135].map(angle => (
                <line key={angle}
                  x1={wx} y1={330 - 8} x2={wx} y2={330 - 38}
                  stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.25}
                  transform={`rotate(${angle + wheelSpin}, ${wx}, 330)`}
                />
              ))}
            </g>
          ))}

          {/* Track under locomotive */}
          <line x1={-60} y1={372} x2={780} y2={372}
            stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={trackLen} strokeDashoffset={trackDash}
            strokeOpacity={0.35}
          />
          <line x1={-60} y1={382} x2={780} y2={382}
            stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={trackLen} strokeDashoffset={trackDash}
            strokeOpacity={0.35}
          />
          {/* Cross-ties */}
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={-40 + i * 62} y={368} width={20} height={18} rx={2}
              fill={COLORS.text_muted} fillOpacity={0.12}
              opacity={locoEntry.opacity}
            />
          ))}

          {/* KL2401 name on body */}
          <text x={350} y={175} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} opacity={locoEntry.opacity * shimmer}>
            KL2401
          </text>
        </g>

        {/* ── KL2401 badge ─────────────────────────────────────────────── */}
        <g opacity={badgeEntry.opacity} transform={`translate(0, ${badgeEntry.translateY})`}>
          <rect x={60} y={990} width={320} height={80} rx={20}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={badgePerim} strokeDashoffset={badgeBorderDash}
          />
          <text x={220} y={1042} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '220px 1035px' }}>
            TRAIN KL2401
          </text>
        </g>

        {/* Connector arrow badge → memory card */}
        <line x1={380} y1={1030} x2={460} y2={1030}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDash}
          markerEnd="url(#arrow)" strokeLinecap="round" strokeOpacity={0.5}
        />

        {/* ── Memory card ──────────────────────────────────────────────── */}
        <g opacity={memCardEntry.opacity} transform={`translate(0, ${memCardEntry.translateY})`}>
          <rect x={480} y={920} width={520} height={260} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={memCardPerim} strokeDashoffset={memBorderDash}
          />

          {/* Header */}
          <rect x={480} y={920} width={520} height={56} rx={20}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={740} y={958} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            INSTANCE MEMORY
          </text>

          {/* Field 1 */}
          <g opacity={field1Entry.opacity} transform={`translate(0, ${field1Entry.translateY * 0.3})`}>
            <text x={510} y={1020} fontFamily={FONT} fontSize={30} fontWeight={800}
              fill={COLORS.text_muted}>
              currentPassengerCount:
            </text>
            <text x={910} y={1020} fontFamily={FONT} fontSize={44} fontWeight={800}
              fill={COLORS.white} textAnchor="end">
              {counterVal}
            </text>
          </g>

          {/* Field 2 */}
          <g opacity={field2Entry.opacity} transform={`translate(0, ${field2Entry.translateY * 0.3})`}>
            <text x={510} y={1080} fontFamily={FONT} fontSize={30} fontWeight={800}
              fill={COLORS.text_muted}>
              trainId:
            </text>
            <text x={910} y={1080} fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.accent} textAnchor="end">
              "KL2401"
            </text>
          </g>

          {/* OWN COPY label */}
          <g opacity={ownEntry.opacity}>
            <rect x={620} y={1110} width={240} height={48} rx={12}
              fill={COLORS.accent} fillOpacity={0.1} />
            <text x={740} y={1142} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic">
              ITS OWN COPY
            </text>
          </g>
        </g>

        {/* ── Info card ─────────────────────────────────────────────────── */}
        <g opacity={infoEntry.opacity} transform={`translate(0, ${infoEntry.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={120} />
          <rect x={60} y={1240} width={6} height={120} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1310} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            This count belongs only to KL2401 — no other train sees it
          </text>
        </g>

        {/* Floating accents */}
        <g transform={`translate(160, ${1440 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>
        <g transform={`translate(920, ${1500 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
