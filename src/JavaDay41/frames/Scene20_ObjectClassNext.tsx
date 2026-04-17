/**
 * Scene 20 — Object Class Next
 * "That is the Object class, and that is exactly what we cover next."
 * CSV: 86.460s → 90.580s
 * Duration: 124 frames (4.13s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Dramatic reveal of "Object" class name — large hero text.
 * Then teaser for Day 42: "COMING NEXT" banner.
 * Three method icons orbit the Object class node.
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 16–80): Object class reveal, method icons orbit, next-day teaser
 *   Phase 3 (frames 60–end): Pulse on Object badge, orbit spin, glow
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

export const Scene20_ObjectClassNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headEntry1 = useSpringEntrance(frame, 4);
  const headEntry2 = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Ghost text behind hero
  const ghostOpacity = interpolate(frame, [14, 30], [0, 0.05], {
    extrapolateRight: 'clamp',
  });

  // Hero "Object" text
  const heroSpring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: SPRING_SNAP,
  });
  const heroScale = interpolate(heroSpring, [0, 1], [0.5, 1]);
  const heroOpacity = interpolate(Math.max(0, frame - 14), [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Glow ring around Object class box
  const glowRingPerim = 2 * (460 + 140);
  const glowRingDash = usePathDraw(frame, 18, glowRingPerim, 30);

  // Orbit: three method icons rotate around the hero
  const orbitAngle = interpolate(frame, [0, 124], [0, Math.PI * 2 * 1.2], {
    extrapolateRight: 'clamp',
  });
  const orbitFade = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' });
  const ORBIT_R = 220;
  const methodIcons = [
    { label: 'T', name: 'toString', offset: 0 },
    { label: '=', name: 'equals', offset: (2 * Math.PI) / 3 },
    { label: '#', name: 'hashCode', offset: (4 * Math.PI) / 3 },
  ];

  // Connector lines from center to each method icon
  const connLine1 = usePathDraw(frame, 32, ORBIT_R, 20);
  const connLine2 = usePathDraw(frame, 36, ORBIT_R, 20);
  const connLine3 = usePathDraw(frame, 40, ORBIT_R, 20);

  // "COMING NEXT" / Day 42 teaser
  const nextBadge = useSpringEntrance(frame, 55);
  const nextCard = useSpringEntrance(frame, 65);

  // Bottom info cards
  const infoCard1 = useSpringEntrance(frame, 72);
  const infoCard2 = useSpringEntrance(frame, 80);

  // Summary strip
  const summaryEntry = useSpringEntrance(frame, 88);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const heroGlow = 0.08 + Math.sin(frame * 0.12) * 0.04;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  // Center for orbit system
  const CX = 540;
  const CY = 780;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INHERITANCE · ROOT CLASS" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────── */}
        <g opacity={headEntry1.opacity} transform={`translate(0, ${headEntry1.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            The Object Class
          </text>
        </g>
        <g opacity={headEntry2.opacity} transform={`translate(0, ${headEntry2.translateY})`}>
          <text x={60} y={390} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>
            What We Cover Next
          </text>
        </g>

        {/* ── Ghost hero text ─────────────────────────────────────────── */}
        <text x={CX} y={CY + 30} textAnchor="middle"
          fontFamily={FONT} fontSize={180} fontWeight={800}
          fill={COLORS.accent} opacity={ghostOpacity}>
          Object
        </text>

        {/* ── Glow ring ───────────────────────────────────────────────── */}
        <rect x={CX - 230} y={CY - 70} width={460} height={140} rx={24}
          fill="none"
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={glowRingPerim} strokeDashoffset={glowRingDash}
          opacity={0.4} />

        {/* ── Object class hero box ───────────────────────────────────── */}
        <g
          opacity={heroOpacity}
          transform={`translate(${CX}, ${CY}) scale(${heroScale})`}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          {/* Subtle glow circle */}
          <circle cx={0} cy={0} r={90}
            fill={COLORS.accent} fillOpacity={heroGlow} />
          {/* Box */}
          <rect x={-200} y={-50} width={400} height={100} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3} />
          {/* Text */}
          <text x={0} y={15} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Object
          </text>
        </g>

        {/* ── Orbiting method icons ───────────────────────────────────── */}
        {methodIcons.map((m, i) => {
          const angle = orbitAngle + m.offset;
          const mx = CX + Math.cos(angle) * ORBIT_R;
          const my = CY + Math.sin(angle) * ORBIT_R;

          return (
            <g key={i} opacity={orbitFade} transform={`scale(${pulse})`}
              style={{ transformOrigin: `${mx}px ${my}px` }}>
              {/* Subtle connector line */}
              <line x1={CX} y1={CY} x2={mx} y2={my}
                stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.12}
                strokeDasharray={ORBIT_R}
                strokeDashoffset={i === 0 ? connLine1 : i === 1 ? connLine2 : connLine3} />
              {/* Icon circle */}
              <circle cx={mx} cy={my} r={36}
                fill={COLORS.bg_secondary}
                stroke={COLORS.accent} strokeWidth={2} />
              <text x={mx} y={my + 10} textAnchor="middle"
                fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.accent}>
                {m.label}
              </text>
              {/* Label below */}
              <text x={mx} y={my + 56} textAnchor="middle"
                fontFamily={FONT} fontSize={16} fontWeight={800}
                fill={COLORS.text_muted}>
                {m.name}
              </text>
            </g>
          );
        })}

        {/* ── "COMING NEXT" badge ──────────────────────────────────────── */}
        <g opacity={nextBadge.opacity} transform={`translate(0, ${nextBadge.translateY})`}>
          <rect x={340} y={1060} width={400} height={52} rx={26}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={1094} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.18em">
            COMING NEXT
          </text>
        </g>

        {/* ── Day 42 teaser card ───────────────────────────────────────── */}
        <g opacity={nextCard.opacity} transform={`translate(0, ${nextCard.translateY})`}>
          <BentoCard x={160} y={1130} w={760} h={120} accent />
          <text x={200} y={1175} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            DAY 42
          </text>
          <text x={200} y={1218} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Deep Dive into toString, equals, hashCode
          </text>
        </g>

        {/* ── Bottom info cards ────────────────────────────────────────── */}
        <g opacity={infoCard1.opacity} transform={`translate(0, ${infoCard1.translateY})`}>
          <BentoCard x={60} y={1280} w={460} h={140} />
          <text x={100} y={1325} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.06em">
            TODAY
          </text>
          <text x={100} y={1365} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Instance vs Static variables
          </text>
          <text x={100} y={1400} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted}>
            Scope, lifetime, purpose
          </text>
        </g>

        <g opacity={infoCard2.opacity} transform={`translate(0, ${infoCard2.translateY})`}>
          <BentoCard x={560} y={1280} w={460} h={140} />
          <text x={600} y={1325} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.06em">
            NEXT
          </text>
          <text x={600} y={1365} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Object class deep dive
          </text>
          <text x={600} y={1400} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted}>
            Override, customize, master
          </text>
        </g>

        {/* ── Summary strip ────────────────────────────────────────────── */}
        <g opacity={summaryEntry.opacity} transform={`translate(0, ${summaryEntry.translateY})`}>
          <BentoCard x={60} y={1460} w={960} h={90} />
          <rect x={60} y={1460} width={6} height={90} rx={3} fill={COLORS.accent} />
          <text x={100} y={1515} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Every object inherits from Object — the root of all Java classes
          </text>
        </g>

        {/* ── Floating accent particles ────────────────────────────────── */}
        {[
          { x: 140, y: 1580, r: 5 },
          { x: 940, y: 1600, r: 4 },
          { x: 360, y: 1620, r: 3 },
          { x: 720, y: 1640, r: 5 },
          { x: 500, y: 1670, r: 6 },
          { x: 200, y: 1700, r: 4 },
          { x: 860, y: 1720, r: 3 },
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
            sceneDuration={SCENE_TIMING.s20.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
