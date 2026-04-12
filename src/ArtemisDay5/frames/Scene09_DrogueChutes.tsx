/**
 * Scene09 — Drogue Chutes Deploy
 * "The sequence begins at 7,600 meters altitude, two drogue chutes deploy and stabilize the capsule's attitude,"
 * CSV: 52.900s → 60.860s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring entrance
 *   Phase 2 (20–90): Altitude bar with gradient + detailed capsule + 2 large drogue canopies
 *   Phase 3 (80–end): Chute billowing, capsule sway, wave shimmer, micro-pulse
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents } from '../helpers/components';

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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene09_DrogueChutes: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (0–30) ──────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build (20–90) ────────────────────────────────────────
  const altScale = useSpringEntrance(frame, 20);
  const capsuleEnt = useSpringEntrance(frame, 28);
  const chute1Ent = useSpringEntrance(frame, 40);
  const chute2Ent = useSpringEntrance(frame, 48);
  const altBadge = useSpringEntrance(frame, 22);
  const deployMarker = useSpringEntrance(frame, 36);
  const stabCard = useSpringEntrance(frame, 60);
  const infoCard1 = useSpringEntrance(frame, 68);
  const infoCard2 = useSpringEntrance(frame, 76);
  const bottomNote = useSpringEntrance(frame, 82);

  // Altitude counter
  const altValue = useCounter(frame, 24, 7600, 50);

  // Path draws
  const altLineDraw = usePathDraw(frame, 22, 800, 30);
  const capsuleBorderDraw = usePathDraw(frame, 30, 500, 25);
  const chuteLine1Draw = usePathDraw(frame, 44, 300, 20);
  const chuteLine2Draw = usePathDraw(frame, 52, 300, 20);

  // ── Phase 3: Micro-animations (80–end) ────────────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 5;
  const sway = Math.sin(frame * 0.04) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.035), [-1, 1], [0.82, 1]);
  const chuteFlap1 = Math.sin(frame * 0.07) * 6;
  const chuteFlap2 = Math.sin(frame * 0.08 + 1.2) * 5;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const wave1 = Math.sin(frame * 0.06) * 6;
  const wave2 = Math.sin(frame * 0.07 + 1.5) * 4;
  const wave3 = Math.sin(frame * 0.05 + 0.8) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  // ── Altitude bar geometry ─────────────────────────────────────────────────
  const barX = 110;
  const barTop = 530;
  const barBot = 1280;
  const barH = barBot - barTop;
  const barW = 28;
  // Deploy altitude at 7600m = top of bar
  const deployY = barTop;
  // Capsule position (near deploy altitude)
  const capsuleX = 540;
  const capsuleY = 620;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.orange} />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="PARACHUTE SEQUENCE · PHASE 1" y={260} opacity={0.55} />
        </g>

        {/* Zone B — headline */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={900} fill={COLORS.deep_black}>
            Drogue Chutes
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={450} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={500} fill={COLORS.orange}>
            Attitude Stabilization at 7,600m
          </text>
        </g>

        {/* ── Ghost altitude number background ────────────────────────────── */}
        <text x={780} y={520} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={180} fontWeight={900}
          fill={COLORS.orange} opacity={0.04 * shimmer}>
          7600
        </text>

        {/* ── Altitude scale bar with filled gradient ─────────────────────── */}
        <g opacity={altScale.opacity}>
          {/* Background track */}
          <rect x={barX - barW / 2} y={barTop} width={barW} height={barH} rx={6}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.12} />
          {/* Filled altitude (sky fill from bottom up to deploy altitude) */}
          <rect x={barX - barW / 2 + 3} y={barTop + 3}
            width={barW - 6} height={barH - 6} rx={4}
            fill={COLORS.sky_blue} fillOpacity={0.06} />
          {/* Center line */}
          <line x1={barX} y1={barTop} x2={barX} y2={barBot}
            stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.1}
            strokeDasharray={800} strokeDashoffset={altLineDraw} />
          {/* Tick marks — 8 ticks from 0 to 7600 */}
          {[0, 1000, 2000, 3000, 4000, 5000, 6000, 7600].map((alt, i) => {
            const pct = alt / 7600;
            const ty = barTop + barH * (1 - pct);
            return (
              <g key={i}>
                <line x1={barX - barW / 2 - 6} y1={ty} x2={barX + barW / 2 + 6} y2={ty}
                  stroke={COLORS.deep_black} strokeWidth={1.5} opacity={alt === 7600 ? 0.4 : 0.15} />
                <text x={barX - barW / 2 - 12} y={ty + 5} textAnchor="end"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={alt === 7600 ? 20 : 16} fontWeight={alt === 7600 ? 700 : 400}
                  fill={alt === 7600 ? COLORS.orange : COLORS.cool_silver}>
                  {alt >= 1000 ? `${alt / 1000}km` : `${alt}m`}
                </text>
              </g>
            );
          })}
          {/* Ground label */}
          <text x={barX} y={barBot + 32} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.brown}>
            GROUND
          </text>
          {/* Ground hatch pattern */}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`gh-${i}`}
              x1={barX - 20 + i * 10} y1={barBot + 6}
              x2={barX - 30 + i * 10} y2={barBot + 16}
              stroke={COLORS.brown} strokeWidth={1.5} opacity={0.2} />
          ))}
        </g>

        {/* ── Deploy marker at 7600m — pulsing diamond ────────────────────── */}
        <g opacity={deployMarker.opacity}
          transform={`translate(${barX + barW / 2 + 20}, ${deployY + deployMarker.translateY})`}>
          <polygon points="0,-10 8,0 0,10 -8,0"
            fill={COLORS.orange} fillOpacity={0.3 * pulse}
            stroke={COLORS.orange} strokeWidth={2} />
          <line x1={12} y1={0} x2={60} y2={0}
            stroke={COLORS.orange} strokeWidth={1.5} opacity={0.4}
            strokeDasharray="4 3" />
          <text x={65} y={5}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.orange}>
            DEPLOY
          </text>
        </g>

        {/* ── Altitude badge ──────────────────────────────────────────────── */}
        <g opacity={altBadge.opacity} transform={`translate(200, ${490 + altBadge.translateY})`}>
          <rect x={0} y={0} width={260} height={80} rx={10}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={2} />
          <text x={130} y={30} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={500} fill={COLORS.cool_silver}>
            ALTITUDE
          </text>
          <text x={130} y={64} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={900} fill={COLORS.orange}>
            {altValue.toLocaleString()}m
          </text>
        </g>

        {/* ── Detailed capsule (200px wide) ───────────────────────────────── */}
        <g opacity={capsuleEnt.opacity}
          transform={`translate(${capsuleX + sway}, ${capsuleY + capsuleEnt.translateY + breathe})`}>
          {/* Main conical body — path-draw border */}
          <path d="M 0,-60 L -70,50 L -80,100 L -85,120 L 85,120 L 80,100 L 70,50 Z"
            fill={COLORS.cool_silver} fillOpacity={0.12}
            stroke={COLORS.deep_black} strokeWidth={2.5}
            strokeDasharray={500} strokeDashoffset={capsuleBorderDraw} />
          {/* Panel lines */}
          <line x1={-30} y1={-30} x2={-55} y2={80} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />
          <line x1={30} y1={-30} x2={55} y2={80} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />
          <line x1={0} y1={-50} x2={0} y2={100} stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.06} />
          {/* Rivets — 8 around top */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const rx = Math.cos(angle) * 40;
            const ry = Math.sin(angle) * 15 + 10;
            return <circle key={`rv-${i}`} cx={rx} cy={ry} r={2.5}
              fill={COLORS.deep_black} fillOpacity={0.12} />;
          })}
          {/* Heat shield */}
          <rect x={-85} y={120} width={170} height={18} rx={6}
            fill={COLORS.brown} fillOpacity={0.25}
            stroke={COLORS.brown} strokeWidth={2} />
          {/* Heat shield texture lines */}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`hs-${i}`} x1={-70 + i * 24} y1={123}
              x2={-70 + i * 24} y2={135}
              stroke={COLORS.brown} strokeWidth={1} opacity={0.15} />
          ))}
          {/* 2 portholes */}
          <ellipse cx={-24} cy={-10} rx={14} ry={10}
            fill={COLORS.sky_blue} fillOpacity={0.15}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <ellipse cx={24} cy={-10} rx={14} ry={10}
            fill={COLORS.sky_blue} fillOpacity={0.15}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          {/* Porthole reflections */}
          <ellipse cx={-20} cy={-13} rx={5} ry={3}
            fill={COLORS.sky_blue} fillOpacity={0.1} />
          <ellipse cx={28} cy={-13} rx={5} ry={3}
            fill={COLORS.sky_blue} fillOpacity={0.1} />
          {/* Docking ring at top */}
          <ellipse cx={0} cy={-60} rx={22} ry={6}
            fill="none" stroke={COLORS.deep_black} strokeWidth={2} opacity={0.2} />
          <rect x={-8} y={-68} width={16} height={8} rx={3}
            fill={COLORS.deep_black} fillOpacity={0.1} />
          {/* RCS pods */}
          <rect x={-82} y={70} width={12} height={20} rx={3}
            fill={COLORS.deep_black} fillOpacity={0.08}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.2} />
          <rect x={70} y={70} width={12} height={20} rx={3}
            fill={COLORS.deep_black} fillOpacity={0.08}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.2} />
          {/* ORION label */}
          <text x={0} y={90} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.deep_black} opacity={0.25}
            letterSpacing="0.15em">
            ORION
          </text>
        </g>

        {/* ── Drogue chute 1 (left) — large dome with panels ──────────────── */}
        <g opacity={chute1Ent.opacity}
          transform={`translate(${capsuleX - 100 + chuteFlap1}, ${capsuleY - 230 + chute1Ent.translateY})`}>
          {/* Large dome canopy ~120px wide */}
          <path d="M 0,-30 C -70,0 -80,50 -50,75 L 0,65 L 50,75 C 80,50 70,0 0,-30 Z"
            fill={COLORS.orange} fillOpacity={0.2}
            stroke={COLORS.orange} strokeWidth={2.5} />
          {/* Panel dividers */}
          <line x1={0} y1={-25} x2={0} y2={65} stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
          <line x1={-35} y1={-8} x2={-25} y2={72} stroke={COLORS.orange} strokeWidth={0.8} opacity={0.2} />
          <line x1={35} y1={-8} x2={25} y2={72} stroke={COLORS.orange} strokeWidth={0.8} opacity={0.2} />
          {/* Vent hole at apex */}
          <ellipse cx={0} cy={-22} rx={8} ry={5}
            fill={COLORS.bg_paper} stroke={COLORS.orange} strokeWidth={1.5} opacity={0.5} />
          {/* 4 suspension lines to capsule */}
          <line x1={-40} y1={70} x2={100 - chuteFlap1} y2={230}
            stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.25}
            strokeDasharray={300} strokeDashoffset={chuteLine1Draw} />
          <line x1={-15} y1={65} x2={100 - chuteFlap1} y2={230}
            stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.25}
            strokeDasharray={300} strokeDashoffset={chuteLine1Draw} />
          <line x1={15} y1={65} x2={100 - chuteFlap1} y2={230}
            stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.25}
            strokeDasharray={300} strokeDashoffset={chuteLine1Draw} />
          <line x1={40} y1={70} x2={100 - chuteFlap1} y2={230}
            stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.25}
            strokeDasharray={300} strokeDashoffset={chuteLine1Draw} />
          {/* Label */}
          <text x={0} y={-42} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={700} fill={COLORS.orange}>
            DROGUE 1
          </text>
        </g>

        {/* ── Drogue chute 2 (right) — large dome with panels ─────────────── */}
        <g opacity={chute2Ent.opacity}
          transform={`translate(${capsuleX + 100 + chuteFlap2}, ${capsuleY - 250 + chute2Ent.translateY})`}>
          <path d="M 0,-30 C -70,0 -80,50 -50,75 L 0,65 L 50,75 C 80,50 70,0 0,-30 Z"
            fill={COLORS.orange} fillOpacity={0.2}
            stroke={COLORS.orange} strokeWidth={2.5} />
          {/* Panel dividers */}
          <line x1={0} y1={-25} x2={0} y2={65} stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
          <line x1={-35} y1={-8} x2={-25} y2={72} stroke={COLORS.orange} strokeWidth={0.8} opacity={0.2} />
          <line x1={35} y1={-8} x2={25} y2={72} stroke={COLORS.orange} strokeWidth={0.8} opacity={0.2} />
          {/* Vent hole */}
          <ellipse cx={0} cy={-22} rx={8} ry={5}
            fill={COLORS.bg_paper} stroke={COLORS.orange} strokeWidth={1.5} opacity={0.5} />
          {/* 4 suspension lines */}
          <line x1={-40} y1={70} x2={-100 - chuteFlap2} y2={250}
            stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.25}
            strokeDasharray={300} strokeDashoffset={chuteLine2Draw} />
          <line x1={-15} y1={65} x2={-100 - chuteFlap2} y2={250}
            stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.25}
            strokeDasharray={300} strokeDashoffset={chuteLine2Draw} />
          <line x1={15} y1={65} x2={-100 - chuteFlap2} y2={250}
            stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.25}
            strokeDasharray={300} strokeDashoffset={chuteLine2Draw} />
          <line x1={40} y1={70} x2={-100 - chuteFlap2} y2={250}
            stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.25}
            strokeDasharray={300} strokeDashoffset={chuteLine2Draw} />
          <text x={0} y={-42} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={700} fill={COLORS.orange}>
            DROGUE 2
          </text>
        </g>

        {/* ── Multi-layer ocean at bottom ─────────────────────────────────── */}
        <g opacity={altScale.opacity * shimmer}>
          <path d={`M 60,${barBot + 2 + wave1} Q 200,${barBot - 6 + wave2} 400,${barBot + 2 + wave1} T 720,${barBot + 2 + wave1} T 1020,${barBot + 2 + wave1}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={3} opacity={0.3} />
          <path d={`M 80,${barBot + 14 + wave2} Q 260,${barBot + 6 + wave3} 460,${barBot + 14 + wave2} T 780,${barBot + 14 + wave2} T 1020,${barBot + 14 + wave2}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.2} />
          <path d={`M 100,${barBot + 24 + wave3} Q 320,${barBot + 18 + wave1} 520,${barBot + 24 + wave3} T 840,${barBot + 24 + wave3} T 1020,${barBot + 24 + wave3}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.12} />
          {/* Depth fill */}
          <rect x={60} y={barBot + 28} width={960} height={40}
            fill={COLORS.sky_blue} fillOpacity={0.03} />
        </g>

        {/* ── Stabilization purpose card ──────────────────────────────────── */}
        <g opacity={stabCard.opacity}
          transform={`translate(60, ${1380 + stabCard.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.05}
            stroke={COLORS.orange} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.orange} />
          {/* Parachute icon */}
          <g transform="translate(40, 50)">
            <path d="M -16,-14 C -24,-6 -20,8 0,14 C 20,8 24,-6 16,-14 C 8,-18 -8,-18 -16,-14 Z"
              fill={COLORS.orange} fillOpacity={0.25}
              stroke={COLORS.orange} strokeWidth={1.5} />
            <line x1={-8} y1={10} x2={0} y2={22} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.3} />
            <line x1={8} y1={10} x2={0} y2={22} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.3} />
          </g>
          <text x={80} y={38} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            PURPOSE
          </text>
          <text x={80} y={72} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Stabilize capsule attitude before mains
          </text>
        </g>

        {/* ── Info cards with SVG icons ───────────────────────────────────── */}
        <g opacity={infoCard1.opacity}
          transform={`translate(60, ${1510 + infoCard1.translateY + breathe})`}>
          <rect x={0} y={0} width={450} height={90} rx={12}
            fill={COLORS.orange} fillOpacity={0.05}
            stroke={COLORS.orange} strokeWidth={1.5} />
          {/* Dual-chute icon */}
          <g transform="translate(38, 45)">
            <path d="M -10,-12 C -16,-4 -12,6 -2,10" fill="none"
              stroke={COLORS.orange} strokeWidth={2} />
            <path d="M 10,-12 C 16,-4 12,6 2,10" fill="none"
              stroke={COLORS.orange} strokeWidth={2} />
            <rect x={-4} y={12} width={8} height={8} rx={2}
              fill={COLORS.orange} fillOpacity={0.3} />
          </g>
          <text x={72} y={38}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={500} fill={COLORS.cool_silver}>
            DEPLOYED
          </text>
          <text x={72} y={68}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={800} fill={COLORS.orange}>
            2 Drogue Chutes
          </text>
        </g>

        <g opacity={infoCard2.opacity}
          transform={`translate(530, ${1510 + infoCard2.translateY + breathe})`}>
          <rect x={0} y={0} width={450} height={90} rx={12}
            fill={COLORS.green} fillOpacity={0.05}
            stroke={COLORS.green} strokeWidth={1.5} />
          {/* Lock icon */}
          <g transform="translate(38, 45)">
            <rect x={-10} y={0} width={20} height={16} rx={3}
              fill={COLORS.green} fillOpacity={0.25}
              stroke={COLORS.green} strokeWidth={1.5} />
            <path d="M -6,0 L -6,-8 C -6,-14 6,-14 6,-8 L 6,0"
              fill="none" stroke={COLORS.green} strokeWidth={2} />
            <circle cx={0} cy={8} r={3} fill={COLORS.green} fillOpacity={0.4} />
          </g>
          <text x={72} y={38}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={500} fill={COLORS.cool_silver}>
            ACHIEVED
          </text>
          <text x={72} y={68}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={800} fill={COLORS.green}>
            Attitude Lock
          </text>
        </g>

        {/* ── Bottom divider + note ───────────────────────────────────────── */}
        <g opacity={bottomNote.opacity}>
          <line x1={200} y1={1640} x2={880} y2={1640}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />
          <text x={540} y={1680} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={0.6}>
            Drogues slow and orient capsule for main chute deployment
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
