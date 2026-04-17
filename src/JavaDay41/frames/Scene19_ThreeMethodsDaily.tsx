/**
 * Scene 19 — Three Methods Daily
 * "and that parent gives every object three methods they use every single day."
 * CSV: 81.220s → 86.460s
 * Duration: 157 frames (5.23s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Three gift boxes / cards revealing toString, equals, hashCode.
 * Show the silent parent "giving" these methods to every object.
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 16–100): Parent node giving → 3 method cards staggered
 *   Phase 3 (frames 80–end): Gift glow, daily pulse, shimmer
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

export const Scene19_ThreeMethodsDaily: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headWord1 = useSpringEntrance(frame, 4);
  const headWord2 = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Top: parent node
  const parentNode = useSpringEntrance(frame, 16);

  // "GIVES" arrow paths down to three methods
  const giftArrow1Len = 140;
  const giftArrow1Dash = usePathDraw(frame, 24, giftArrow1Len, 20);
  const giftArrow2Len = 100;
  const giftArrow2Dash = usePathDraw(frame, 28, giftArrow2Len, 20);
  const giftArrow3Len = 140;
  const giftArrow3Dash = usePathDraw(frame, 32, giftArrow3Len, 20);

  // Three method cards (staggered entrance)
  const method1 = useSpringEntrance(frame, 36);
  const method2 = useSpringEntrance(frame, 48);
  const method3 = useSpringEntrance(frame, 60);

  // Border draw on method cards
  const m1Perim = 2 * (280 + 320);
  const m1Border = interpolate(frame, [36, 62], [m1Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const m2Perim = 2 * (280 + 320);
  const m2Border = interpolate(frame, [48, 74], [m2Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const m3Perim = 2 * (280 + 320);
  const m3Border = interpolate(frame, [60, 86], [m3Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // "EVERY SINGLE DAY" badge
  const dailyBadge = useSpringEntrance(frame, 70);

  // Bottom summary cards
  const sumCard1 = useSpringEntrance(frame, 76);
  const sumCard2 = useSpringEntrance(frame, 84);

  // Summary strip
  const summaryEntry = useSpringEntrance(frame, 90);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const giftGlow = 0.12 + Math.sin(frame * 0.1) * 0.06;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  // Method data
  const methods = [
    { name: 'toString()', desc: 'Text\nRepresentation', icon: 'T', color: COLORS.accent },
    { name: 'equals()', desc: 'Identity\nComparison', icon: '=', color: COLORS.accent },
    { name: 'hashCode()', desc: 'Hash\nFingerprint', icon: '#', color: COLORS.accent },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="OBJECT CLASS · INHERITED METHODS" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────── */}
        <g opacity={headWord1.opacity} transform={`translate(0, ${headWord1.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Three Methods
          </text>
        </g>
        <g opacity={headWord2.opacity} transform={`translate(0, ${headWord2.translateY})`}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}>
            Used Every Single Day
          </text>
        </g>

        {/* ── Parent Node — The Silent Parent ─────────────────────────── */}
        <g opacity={parentNode.opacity} transform={`translate(0, ${parentNode.translateY})`}>
          {/* Glow behind */}
          <circle cx={540} cy={530} r={60}
            fill={COLORS.accent} fillOpacity={giftGlow * parentNode.opacity} />
          {/* Box */}
          <rect x={440} y={490} width={200} height={80} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={540} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Object class
          </text>
        </g>

        {/* ── "GIVES" label ───────────────────────────────────────────── */}
        <g opacity={parentNode.opacity * 0.5}>
          <text x={540} y={598} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.15em">
            GIVES
          </text>
        </g>

        {/* ── Gift arrows (parent → method cards) ─────────────────────── */}
        {/* Arrow 1: left */}
        <path d="M 480,570 C 480,630 240,630 240,680"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeOpacity={0.3}
          strokeDasharray={giftArrow1Len} strokeDashoffset={giftArrow1Dash}
          strokeLinecap="round" />
        {/* Arrow 2: center */}
        <line x1={540} y1={570} x2={540} y2={680}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.3}
          strokeDasharray={giftArrow2Len} strokeDashoffset={giftArrow2Dash}
          strokeLinecap="round" />
        {/* Arrow 3: right */}
        <path d="M 600,570 C 600,630 840,630 840,680"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeOpacity={0.3}
          strokeDasharray={giftArrow3Len} strokeDashoffset={giftArrow3Dash}
          strokeLinecap="round" />

        {/* ── Three Method Cards ───────────────────────────────────────── */}
        {/* Method 1: toString() */}
        <g opacity={method1.opacity} transform={`translate(0, ${method1.translateY})`}>
          {/* Border draw */}
          <rect x={80} y={690} width={280} height={320} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={m1Perim} strokeDashoffset={m1Border} />
          {/* Fill */}
          <rect x={80} y={690} width={280} height={320} rx={20}
            fill={COLORS.bg_secondary} />
          {/* Large icon */}
          <circle cx={220} cy={790} r={46}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={220} y={805} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.accent}>
            T
          </text>
          {/* Method name */}
          <text x={220} y={880} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.white}>
            toString()
          </text>
          {/* Description */}
          <text x={220} y={920} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted}>
            Text Representation
          </text>
          {/* Separator */}
          <line x1={120} y1={946} x2={320} y2={946}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          {/* Usage note */}
          <text x={220} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}>
            print(train)
          </text>
        </g>

        {/* Method 2: equals() */}
        <g opacity={method2.opacity} transform={`translate(0, ${method2.translateY})`}>
          <rect x={400} y={690} width={280} height={320} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={m2Perim} strokeDashoffset={m2Border} />
          <rect x={400} y={690} width={280} height={320} rx={20}
            fill={COLORS.bg_secondary} />
          <circle cx={540} cy={790} r={46}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={805} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.accent}>
            =
          </text>
          <text x={540} y={880} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.white}>
            equals()
          </text>
          <text x={540} y={920} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted}>
            Identity Comparison
          </text>
          <line x1={440} y1={946} x2={640} y2={946}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          <text x={540} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}>
            a.equals(b)
          </text>
        </g>

        {/* Method 3: hashCode() */}
        <g opacity={method3.opacity} transform={`translate(0, ${method3.translateY})`}>
          <rect x={720} y={690} width={280} height={320} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={m3Perim} strokeDashoffset={m3Border} />
          <rect x={720} y={690} width={280} height={320} rx={20}
            fill={COLORS.bg_secondary} />
          <circle cx={860} cy={790} r={46}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={860} y={805} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.accent}>
            #
          </text>
          <text x={860} y={880} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.white}>
            hashCode()
          </text>
          <text x={860} y={920} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted}>
            Hash Fingerprint
          </text>
          <line x1={760} y1={946} x2={960} y2={946}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          <text x={860} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}>
            map.get(key)
          </text>
        </g>

        {/* ── "EVERY SINGLE DAY" badge ────────────────────────────────── */}
        <g opacity={dailyBadge.opacity} transform={`translate(0, ${dailyBadge.translateY})`}>
          <rect x={300} y={1050} width={480} height={56} rx={28}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={1086} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            EVERY SINGLE DAY
          </text>
        </g>

        {/* ── Bottom cards: inheritance detail ─────────────────────────── */}
        <g opacity={sumCard1.opacity} transform={`translate(0, ${sumCard1.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={160} accent />
          <text x={100} y={1188} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            INHERITED
          </text>
          <text x={100} y={1228} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            No need to write them
          </text>
          <text x={100} y={1268} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            They come from Object class
          </text>
        </g>

        <g opacity={sumCard2.opacity} transform={`translate(0, ${sumCard2.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={160} />
          <text x={600} y={1188} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            UNIVERSAL
          </text>
          <text x={600} y={1228} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Every Java object has them
          </text>
          <text x={600} y={1268} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            String, Train, ArrayList, ...
          </text>
        </g>

        {/* ── Summary strip ────────────────────────────────────────────── */}
        <g opacity={summaryEntry.opacity} transform={`translate(0, ${summaryEntry.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={100} />
          <rect x={60} y={1340} width={6} height={100} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1400} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            The silent parent: toString, equals, hashCode — always present
          </text>
        </g>

        {/* ── Floating gift particles ──────────────────────────────────── */}
        {[
          { x: 120, y: 1500, r: 5 },
          { x: 960, y: 1520, r: 4 },
          { x: 300, y: 1560, r: 3 },
          { x: 780, y: 1540, r: 5 },
          { x: 540, y: 1590, r: 6 },
          { x: 200, y: 1630, r: 4 },
          { x: 880, y: 1660, r: 3 },
          { x: 440, y: 1680, r: 5 },
        ].map((dot, i) => (
          <circle key={i}
            cx={dot.x}
            cy={dot.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={dot.r}
            fill={COLORS.accent}
            fillOpacity={0.02 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s19.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
