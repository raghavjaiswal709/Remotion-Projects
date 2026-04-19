/**
 * Scene 14 — MethodOverloading
 * "This is method overloading."
 * CSV: 46.200s → 47.920s
 * Duration: 65 frames (2.17s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + hero definition spring
 *   Phase 2 (frames 14–48): Definition card, three method badges, definition checkmark
 *   Phase 3 (frames 40–end): Pulse, breathing, shimmer
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
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

export const Scene14_MethodOverloading: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label   = useSpringEntrance(frame, 0);
  const heroA   = useSpringEntrance(frame, 4);
  const heroB   = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const defCard  = useSpringEntrance(frame, 12);
  const method1  = useSpringEntrance(frame, 18);
  const method2  = useSpringEntrance(frame, 24);
  const method3  = useSpringEntrance(frame, 30);
  const checkBadge = useSpringEntrance(frame, 36);
  const summaryCard = useSpringEntrance(frame, 42);

  // ── Underline draw ─────────────────────────────────────────────────────────
  const lineLen = 680;
  const lineDash = usePathDraw(frame, 16, lineLen, 20);

  // ── Border draw on def card ────────────────────────────────────────────────
  const defPerim = 2 * (960 + 220);
  const defBorder = usePathDraw(frame, 14, defPerim, 25);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const rotateGear = frame * 1.2;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            DEFINITION · KEY CONCEPT
          </text>
        </g>

        {/* ── ZONE B — Hero text ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.text_muted}>
            This is
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={430} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Method Overloading
          </text>
          {/* Underline */}
          <line x1={200} y1={450} x2={880} y2={450}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={lineLen} strokeDashoffset={lineDash}
            strokeLinecap="round" opacity={0.4} />
        </g>

        {/* ── Definition card ────────────────────────────────────────────── */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          {/* Animated border */}
          <rect x={60} y={530} width={960} height={220} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={defPerim} strokeDashoffset={defBorder} />
          <rect x={60} y={530} width={6} height={220} rx={3} fill={COLORS.accent} />

          <text x={100} y={600}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Multiple methods with the <tspan fill={COLORS.accent}>same name</tspan>
          </text>
          <text x={100} y={660}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            but <tspan fill={COLORS.accent} fontStyle="italic">different parameter lists</tspan>
          </text>
          <text x={100} y={718}
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>
            Resolved by the compiler at <tspan fill={COLORS.accent}>compile time</tspan>
          </text>
        </g>

        {/* ── Three method badges ────────────────────────────────────────── */}
        {[
          { label: 'calculateFare(route)', idx: 1, y: 800, ent: method1 },
          { label: 'calculateFare(route, seatClass)', idx: 2, y: 940, ent: method2 },
          { label: 'calculateFare(route, seatClass, isPeak)', idx: 3, y: 1080, ent: method3 },
        ].map((item) => (
          <g key={item.idx} opacity={item.ent.opacity} transform={`translate(0, ${item.ent.translateY})`}>
            <BentoCard x={60} y={item.y} w={960} h={110} />
            {/* Number badge */}
            <circle cx={130} cy={item.y + 55} r={24}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={130} y={item.y + 63} textAnchor="middle"
              fontFamily={FONT} fontSize={26} fontWeight={800}
              fill={COLORS.accent}>{item.idx}</text>
            {/* Method text */}
            <text x={180} y={item.y + 65}
              fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.white}>
              {item.label}
            </text>
          </g>
        ))}

        {/* ── Checkmark badge ────────────────────────────────────────────── */}
        <g opacity={checkBadge.opacity} transform={`translate(0, ${checkBadge.translateY})`}>
          <g transform="translate(540, 1300)">
            <circle cx={0} cy={0} r={48}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={2.5}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '0px 0px' }} />
            {/* Checkmark */}
            <path d="M -20,2 L -6,18 L 22,-14"
              fill="none" stroke={COLORS.accent} strokeWidth={4}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={540} y={1380} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            OVERLOADING
          </text>
        </g>

        {/* ── Summary row ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1440} w={460} h={160} accent />
          <text x={100} y={1510}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Same name
          </text>
          <text x={100} y={1558}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            One interface
          </text>
        </g>
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1440} w={460} h={160} />
          <text x={600} y={1510}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Different params
          </text>
          <text x={600} y={1558}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Multiple implementations
          </text>
        </g>

        {/* ── Gear micro ─────────────────────────────────────────────────── */}
        <g transform={`translate(980, ${140 + breathe})`} opacity={shimmer * 0.15}>
          <g transform={`rotate(${rotateGear})`} style={{ transformOrigin: '0px 0px' }}>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * 45 * Math.PI) / 180;
              return (
                <rect key={i}
                  x={-4} y={-20}
                  width={8} height={12} rx={2}
                  fill={COLORS.accent}
                  transform={`rotate(${i * 45}) translate(0, -16)`}
                  style={{ transformOrigin: '0px 0px' }} />
              );
            })}
            <circle cx={0} cy={0} r={10} fill={COLORS.bg_primary}
              stroke={COLORS.accent} strokeWidth={1.5} />
          </g>
        </g>

        {/* ── Decorative dots ────────────────────────────────────────────── */}
        {[180, 540, 900].map((dx, i) => (
          <g key={i} transform={`translate(${dx}, ${1700 + breathe * 0.5})`} opacity={0.12}>
            <circle cx={0} cy={0} r={6}
              fill={COLORS.accent}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '0px 0px' }} />
          </g>
        ))}

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
