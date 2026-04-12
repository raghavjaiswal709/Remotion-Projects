/**
 * Scene02 — Advanced Spacecraft Hook
 * "The most advanced spacecraft NASA has ever built, and it still falls into the ocean like it is 1969."
 * CSV: 0.000s → 7.520s
 *
 * Animation phases:
 *   Phase 1 (0–30): Scene reveal — label slides in, headline springs up word-by-word
 *   Phase 2 (20–100): Detailed Orion capsule builds with panel lines, parachute, descent arrow path-draw
 *   Phase 3 (80–end): Ocean waves undulate, capsule breathes, year badge pulses, spray particles
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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

export const Scene02_AdvancedSpacecraft: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (frames 0–30) ──
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build (frames 20–100) ──
  const capsuleEnt = useSpringEntrance(frame, 22);
  const parachuteEnt = useSpringEntrance(frame, 30);
  const yearBadge = useSpringEntrance(frame, 40);
  const oceanEnt = useSpringEntrance(frame, 50);
  const card1Ent = useSpringEntrance(frame, 60);
  const card2Ent = useSpringEntrance(frame, 72);
  const arrowDraw = usePathDraw(frame, 36, 340, 30);
  const capsuleBorderDraw = usePathDraw(frame, 24, 600, 35);

  // ── Phase 3: Micro-animations (steady-state) ──
  const breathe = Math.sin(frame * 0.05) * 5;
  const wave1 = Math.sin(frame * 0.08) * 10;
  const wave2 = Math.sin(frame * 0.06 + 1.2) * 8;
  const wave3 = Math.sin(frame * 0.04 + 2.4) * 6;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const chuteFlap = Math.sin(frame * 0.09) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── Corner accents ── */}
        <g opacity={labelEnt.opacity * 0.4}>
          <path d="M 60,220 L 60,280 M 60,220 L 120,220" fill="none" stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,220 L 1020,280 M 1020,220 L 960,220" fill="none" stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" />
          <path d="M 60,1850 L 60,1790 M 60,1850 L 120,1850" fill="none" stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,1850 L 1020,1790 M 1020,1850 L 960,1850" fill="none" stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* ── Zone A ── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="ARTEMIS II · SPLASHDOWN" y={260} opacity={0.55} />
        </g>

        {/* ── Zone B — headline ── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={900} fill={COLORS.deep_black}>
            Most Advanced
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={470} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={900} fill={COLORS.sky_blue}>
            Spacecraft
          </text>
          <text x={530} y={470} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={400} fill={COLORS.cool_silver}>
            built by NASA
          </text>
        </g>

        {/* ── Zone C — Detailed Orion Capsule (240px wide) ── */}
        <g opacity={capsuleEnt.opacity}
          transform={`translate(540, ${700 + capsuleEnt.translateY + breathe})`}>
          {/* Outer capsule body — conical shape */}
          <path d="M -120,0 L -90,-180 L 90,-180 L 120,0 Z"
            fill={COLORS.cool_silver} fillOpacity={0.25}
            stroke={COLORS.deep_black} strokeWidth={2.5}
            strokeDasharray={600} strokeDashoffset={capsuleBorderDraw} />
          {/* Panel lines (3 horizontal structural lines) */}
          <line x1={-105} y1={-45} x2={105} y2={-45} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.2} />
          <line x1={-100} y1={-90} x2={100} y2={-90} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.2} />
          <line x1={-95} y1={-135} x2={95} y2={-135} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.15} />
          {/* Rivet row (9 dots along mid-panel) */}
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={`rivet-${i}`} cx={-96 + i * 24} cy={-45} r={2}
              fill={COLORS.deep_black} opacity={0.25} />
          ))}
          {/* Heat shield — thick base with texture */}
          <ellipse cx={0} cy={12} rx={130} ry={22}
            fill={COLORS.brown} fillOpacity={0.35}
            stroke={COLORS.brown} strokeWidth={2.5} />
          {/* Heat shield texture lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`hs-${i}`} x1={-100 + i * 50} y1={6} x2={-80 + i * 50} y2={18}
              stroke={COLORS.brown} strokeWidth={1} opacity={0.3} />
          ))}
          {/* Two portholes with window reflections */}
          <rect x={-50} y={-120} width={32} height={22} rx={5}
            fill={COLORS.sky_blue} fillOpacity={0.3}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <line x1={-45} y1={-118} x2={-38} y2={-112} stroke={COLORS.bg_paper} strokeWidth={1.5} opacity={0.5} />
          <rect x={18} y={-120} width={32} height={22} rx={5}
            fill={COLORS.sky_blue} fillOpacity={0.3}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <line x1={23} y1={-118} x2={30} y2={-112} stroke={COLORS.bg_paper} strokeWidth={1.5} opacity={0.5} />
          {/* Docking ring at top */}
          <ellipse cx={0} cy={-185} rx={40} ry={10}
            fill="none" stroke={COLORS.deep_black} strokeWidth={2} opacity={0.35} />
          <rect x={-6} y={-200} width={12} height={18} rx={3}
            fill={COLORS.cool_silver} fillOpacity={0.3}
            stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.3} />
          {/* RCS thruster pods (left and right) */}
          <rect x={-135} y={-30} width={18} height={28} rx={4}
            fill={COLORS.cool_silver} fillOpacity={0.3}
            stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.4} />
          <rect x={117} y={-30} width={18} height={28} rx={4}
            fill={COLORS.cool_silver} fillOpacity={0.3}
            stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.4} />
          {/* ORION text label */}
          <text x={0} y={-55} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={800} fill={COLORS.deep_black} opacity={0.6}
            letterSpacing="0.12em">
            ORION
          </text>
          {/* NASA flag stripe (red-white-blue bands) */}
          <rect x={40} y={-85} width={40} height={4} rx={2} fill={COLORS.vibrant_red} opacity={0.5} />
          <rect x={40} y={-79} width={40} height={4} rx={2} fill={COLORS.bg_paper} opacity={0.5} />
          <rect x={40} y={-73} width={40} height={4} rx={2} fill={COLORS.sky_blue} opacity={0.5} />
        </g>

        {/* ── Single parachute above capsule ── */}
        <g opacity={parachuteEnt.opacity}
          transform={`translate(540, ${440 + parachuteEnt.translateY})`}>
          {/* Canopy dome */}
          <path d={`M -80,${chuteFlap} C -80,-60 80,-60 80,${chuteFlap}`}
            fill={COLORS.orange} fillOpacity={0.25}
            stroke={COLORS.orange} strokeWidth={2.5} />
          {/* Inner canopy panels (3 vertical lines) */}
          <line x1={-26} y1={-35 + chuteFlap * 0.3} x2={-26} y2={chuteFlap}
            stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
          <line x1={0} y1={-40 + chuteFlap * 0.3} x2={0} y2={chuteFlap}
            stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
          <line x1={26} y1={-35 + chuteFlap * 0.3} x2={26} y2={chuteFlap}
            stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
          {/* Suspension lines (4 lines from canopy edge to capsule) */}
          <line x1={-70} y1={chuteFlap + 5} x2={0} y2={75} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.35} />
          <line x1={-30} y1={chuteFlap + 10} x2={0} y2={75} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.35} />
          <line x1={30} y1={chuteFlap + 10} x2={0} y2={75} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.35} />
          <line x1={70} y1={chuteFlap + 5} x2={0} y2={75} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.35} />
        </g>

        {/* ── Descent arrow (path-draw) ── */}
        <path d="M 540,920 L 540,1120"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={3}
          strokeDasharray={340} strokeDashoffset={arrowDraw}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Ocean — 3-layer waves + depth fill ── */}
        <g opacity={oceanEnt.opacity} transform={`translate(0, ${oceanEnt.translateY})`}>
          {/* Depth gradient layers */}
          <rect x={60} y={1200} width={960} height={60} rx={0}
            fill={COLORS.sky_blue} fillOpacity={0.08} />
          <rect x={60} y={1260} width={960} height={50} rx={0}
            fill={COLORS.sky_blue} fillOpacity={0.12} />
          <rect x={60} y={1310} width={960} height={40} rx={0}
            fill={COLORS.sky_blue} fillOpacity={0.16} />
          {/* Wave 1 — primary */}
          <path d={`M 40,${1160 + wave1} Q 200,${1130 + wave1} 380,${1160 + wave1} T 700,${1160 + wave1} T 1040,${1160 + wave1}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={3.5} opacity={0.35} />
          {/* Wave 2 — secondary */}
          <path d={`M 40,${1190 + wave2} Q 250,${1165 + wave2} 480,${1190 + wave2} T 780,${1190 + wave2} T 1040,${1190 + wave2}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5} opacity={0.25} />
          {/* Wave 3 — tertiary */}
          <path d={`M 40,${1215 + wave3} Q 300,${1195 + wave3} 540,${1215 + wave3} T 820,${1215 + wave3} T 1040,${1215 + wave3}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.18} />
          {/* Spray particles at impact zone */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI;
            const dist = 30 + Math.sin(frame * 0.1 + i) * 15;
            return (
              <circle key={`spray-${i}`}
                cx={540 + Math.cos(angle) * dist}
                cy={1160 + wave1 - Math.abs(Math.sin(angle) * dist * 0.5)}
                r={2.5 - i * 0.2} fill={COLORS.sky_blue} opacity={0.25 * shimmer} />
            );
          })}
          {/* PACIFIC OCEAN label */}
          <text x={540} y={1330} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={600} fill={COLORS.sky_blue} opacity={0.5}>
            PACIFIC OCEAN
          </text>
        </g>

        {/* ── 1969 Year badge (dramatic) ── */}
        <g opacity={yearBadge.opacity}
          transform={`translate(540, ${1460 + yearBadge.translateY})`}>
          {/* Ghost number background */}
          <text x={0} y={30} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={160} fontWeight={900} fill={COLORS.amber} opacity={0.06}>
            1969
          </text>
          {/* Subtitle */}
          <text x={0} y={-30} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            STILL LANDING LIKE
          </text>
          {/* Main year */}
          <text x={0} y={30} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={80} fontWeight={900} fill={COLORS.amber}
            style={{ transform: `scale(${pulse})`, transformOrigin: '0px 30px' }}>
            1969
          </text>
        </g>

        {/* ── Two comparison cards with icons ── */}
        <g opacity={card1Ent.opacity} transform={`translate(60, ${1590 + card1Ent.translateY})`}>
          <rect x={0} y={0} width={450} height={110} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Microchip icon */}
          <rect x={20} y={20} width={48} height={48} rx={6}
            fill={COLORS.sky_blue} fillOpacity={0.2}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={32} y={32} width={24} height={24} rx={2}
            fill={COLORS.sky_blue} fillOpacity={0.3} />
          {Array.from({ length: 3 }, (_, i) => (
            <React.Fragment key={`chip-${i}`}>
              <line x1={20} y1={30 + i * 12} x2={12} y2={30 + i * 12} stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.4} />
              <line x1={68} y1={30 + i * 12} x2={76} y2={30 + i * 12} stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.4} />
            </React.Fragment>
          ))}
          <text x={88} y={38} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            TECHNOLOGY
          </text>
          <text x={88} y={72} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.sky_blue}>
            2025 State-of-Art
          </text>
        </g>

        <g opacity={card2Ent.opacity} transform={`translate(530, ${1590 + card2Ent.translateY})`}>
          <rect x={0} y={0} width={450} height={110} rx={12}
            fill={COLORS.amber} fillOpacity={0.08}
            stroke={COLORS.amber} strokeWidth={2} />
          {/* Water drop icon */}
          <path d="M 44,18 C 44,18 30,40 30,50 C 30,58 36,64 44,64 C 52,64 58,58 58,50 C 58,40 44,18 44,18 Z"
            fill={COLORS.amber} fillOpacity={0.3}
            stroke={COLORS.amber} strokeWidth={1.5} />
          <text x={80} y={38} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            LANDING METHOD
          </text>
          <text x={80} y={72} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.amber}>
            Ocean Splashdown
          </text>
        </g>

        {/* ── Divider + bottom note ── */}
        <line x1={60} y1={1740} x2={1020} y2={1740}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />
        <text x={540} y={1780} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={28} fontWeight={400} fill={COLORS.cool_silver}
          opacity={card2Ent.opacity * 0.5}>
          Same ocean landing — completely different engineering
        </text>

        {/* ── Caption ── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s02.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
