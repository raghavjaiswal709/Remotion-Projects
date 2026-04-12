/**
 * Scene10 — Main Parachutes
 * "three pilot chutes pull out three main parachutes."
 * CSV: 61.460s → 64.880s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring entrance
 *   Phase 2 (20–90): 3 detailed pilot chutes → 3 large main canopies with panels + rigging
 *   Phase 3 (80–end): Canopy billowing, capsule sway, wave shimmer, pulse
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

export const Scene10_MainParachutes: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (0–30) ──────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build (20–90) ────────────────────────────────────────
  const capsuleEnt = useSpringEntrance(frame, 20);
  const pilot1Ent = useSpringEntrance(frame, 24);
  const pilot2Ent = useSpringEntrance(frame, 30);
  const pilot3Ent = useSpringEntrance(frame, 36);
  const main1Ent = useSpringEntrance(frame, 40);
  const main2Ent = useSpringEntrance(frame, 48);
  const main3Ent = useSpringEntrance(frame, 56);
  const arrowDraw1 = usePathDraw(frame, 38, 150, 20);
  const arrowDraw2 = usePathDraw(frame, 46, 150, 20);
  const arrowDraw3 = usePathDraw(frame, 54, 150, 20);
  const seqCard = useSpringEntrance(frame, 62);
  const totalBadge = useSpringEntrance(frame, 72);
  const bottomNote = useSpringEntrance(frame, 80);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 5;
  const sway = Math.sin(frame * 0.04) * 4;
  const billow1 = Math.sin(frame * 0.06) * 7;
  const billow2 = Math.sin(frame * 0.07 + 1.0) * 6;
  const billow3 = Math.sin(frame * 0.065 + 2.2) * 7;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.82, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  // ── Geometry ──────────────────────────────────────────────────────────────
  const capsuleY = 1050;
  const capsuleX = 540;

  const chuteData = [
    { cx: 290, mainY: 530, pilotY: 620, color: COLORS.orange, pilotEnt: pilot1Ent, mainEnt: main1Ent, bill: billow1, arrDraw: arrowDraw1 },
    { cx: 540, mainY: 490, pilotY: 590, color: COLORS.sky_blue, pilotEnt: pilot2Ent, mainEnt: main2Ent, bill: billow2, arrDraw: arrowDraw2 },
    { cx: 790, mainY: 530, pilotY: 620, color: COLORS.green, pilotEnt: pilot3Ent, mainEnt: main3Ent, bill: billow3, arrDraw: arrowDraw3 },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.sky_blue} />

        {/* Ghost "6" background */}
        <text x={540} y={600} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={280} fontWeight={900}
          fill={COLORS.sky_blue} opacity={0.035 * shimmer}>
          6
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="PARACHUTE SEQUENCE · PHASE 2" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={900} fill={COLORS.deep_black}>
            Main Parachutes
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={450} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={500} fill={COLORS.sky_blue}>
            3 Pilot Chutes Pull 3 Main Canopies
          </text>
        </g>

        {/* ── Three chute systems ─────────────────────────────────────────── */}
        {chuteData.map((chute, idx) => (
          <g key={idx}>
            {/* ── Small pilot chute (40px canopy) ──────────────────────────── */}
            <g opacity={chute.pilotEnt.opacity}
              transform={`translate(${chute.cx + chute.bill * 0.4}, ${chute.pilotY + chute.pilotEnt.translateY})`}>
              <path d="M -20,-8 C -30,4 -24,22 0,28 C 24,22 30,4 20,-8 C 10,-14 -10,-14 -20,-8 Z"
                fill={chute.color} fillOpacity={0.15}
                stroke={chute.color} strokeWidth={1.5} />
              {/* Panel divider */}
              <line x1={0} y1={-10} x2={0} y2={26} stroke={chute.color} strokeWidth={0.8} opacity={0.25} />
              <text x={0} y={-18} textAnchor="middle"
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={18} fontWeight={700} fill={chute.color}>
                PILOT
              </text>
            </g>

            {/* ── Arrow from pilot to main (path-draw) ─────────────────────── */}
            <path d={`M ${chute.cx},${chute.pilotY - 28} L ${chute.cx},${chute.mainY + 105}`}
              fill="none" stroke={chute.color} strokeWidth={2}
              strokeDasharray={150} strokeDashoffset={chute.arrDraw}
              markerEnd="url(#arrow)" opacity={0.4} />

            {/* ── Large main canopy (~160px wide dome) ──────────────────────── */}
            <g opacity={chute.mainEnt.opacity}
              transform={`translate(${chute.cx + chute.bill}, ${chute.mainY + chute.mainEnt.translateY})`}>
              {/* Canopy dome */}
              <path d="M -80,-15 C -105,20 -85,75 -40,95 L 0,100 L 40,95 C 85,75 105,20 80,-15 C 55,-30 -55,-30 -80,-15 Z"
                fill={chute.color} fillOpacity={0.12}
                stroke={chute.color} strokeWidth={2.5} />
              {/* Panel dividers (5 lines) */}
              <line x1={0} y1={-25} x2={0} y2={98} stroke={chute.color} strokeWidth={1} opacity={0.2} />
              <line x1={-45} y1={-18} x2={-30} y2={96} stroke={chute.color} strokeWidth={0.8} opacity={0.15} />
              <line x1={45} y1={-18} x2={30} y2={96} stroke={chute.color} strokeWidth={0.8} opacity={0.15} />
              <line x1={-68} y1={-2} x2={-40} y2={94} stroke={chute.color} strokeWidth={0.6} opacity={0.1} />
              <line x1={68} y1={-2} x2={40} y2={94} stroke={chute.color} strokeWidth={0.6} opacity={0.1} />
              {/* Vent hole at apex */}
              <ellipse cx={0} cy={-20} rx={10} ry={6}
                fill={COLORS.bg_paper} stroke={chute.color} strokeWidth={1.5} opacity={0.5} />
              {/* Bottom edge reinforcement */}
              <path d="M -40,95 Q 0,105 40,95"
                fill="none" stroke={chute.color} strokeWidth={2} opacity={0.3} />
              {/* Number badge inside canopy */}
              <circle cx={0} cy={42} r={22}
                fill={chute.color} fillOpacity={0.12}
                stroke={chute.color} strokeWidth={1.5} />
              <text x={0} y={50} textAnchor="middle"
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={28} fontWeight={900} fill={chute.color}>
                {idx + 1}
              </text>

              {/* 4 rigging lines to capsule */}
              {[-55, -20, 20, 55].map((lx, li) => (
                <line key={`rig-${li}`}
                  x1={lx * 0.7} y1={95}
                  x2={capsuleX - chute.cx - chute.bill + sway} y2={capsuleY - chute.mainY - chute.mainEnt.translateY + breathe}
                  stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.18} />
              ))}
            </g>
          </g>
        ))}

        {/* ── Detailed capsule (200px wide) ───────────────────────────────── */}
        <g opacity={capsuleEnt.opacity}
          transform={`translate(${capsuleX + sway}, ${capsuleY + capsuleEnt.translateY + breathe})`}>
          {/* Main conical body */}
          <path d="M 0,-55 L -70,45 L -80,95 L -85,115 L 85,115 L 80,95 L 70,45 Z"
            fill={COLORS.cool_silver} fillOpacity={0.12}
            stroke={COLORS.deep_black} strokeWidth={2.5} />
          {/* Panel lines */}
          <line x1={-30} y1={-25} x2={-55} y2={75} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />
          <line x1={30} y1={-25} x2={55} y2={75} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />
          <line x1={0} y1={-45} x2={0} y2={95} stroke={COLORS.deep_black} strokeWidth={0.7} opacity={0.06} />
          {/* 8 rivets */}
          {Array.from({ length: 8 }, (_, i) => {
            const ang = (i / 8) * Math.PI * 2;
            const rx = Math.cos(ang) * 38;
            const ry = Math.sin(ang) * 12 + 15;
            return <circle key={`rv-${i}`} cx={rx} cy={ry} r={2.5}
              fill={COLORS.deep_black} fillOpacity={0.1} />;
          })}
          {/* Heat shield */}
          <rect x={-85} y={115} width={170} height={16} rx={6}
            fill={COLORS.brown} fillOpacity={0.25}
            stroke={COLORS.brown} strokeWidth={2} />
          {/* Heat shield texture */}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`hst-${i}`} x1={-68 + i * 24} y1={118}
              x2={-68 + i * 24} y2={128}
              stroke={COLORS.brown} strokeWidth={1} opacity={0.15} />
          ))}
          {/* 2 portholes */}
          <ellipse cx={-22} cy={-5} rx={13} ry={9}
            fill={COLORS.sky_blue} fillOpacity={0.15}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <ellipse cx={22} cy={-5} rx={13} ry={9}
            fill={COLORS.sky_blue} fillOpacity={0.15}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          {/* Docking ring */}
          <ellipse cx={0} cy={-55} rx={20} ry={5}
            fill="none" stroke={COLORS.deep_black} strokeWidth={2} opacity={0.2} />
          {/* ORION label */}
          <text x={0} y={85} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={16} fontWeight={700} fill={COLORS.deep_black} opacity={0.2}
            letterSpacing="0.15em">
            ORION
          </text>
        </g>

        {/* ── Sequence explanation card ────────────────────────────────────── */}
        <g opacity={seqCard.opacity}
          transform={`translate(60, ${1260 + seqCard.translateY})`}>
          <rect x={0} y={0} width={960} height={180} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={180} rx={3} fill={COLORS.sky_blue} />

          {/* Step 1 — pilot extract */}
          <g transform="translate(40, 44)">
            {/* Mini parachute icon */}
            <path d="M -12,-8 C -18,0 -14,12 0,16 C 14,12 18,0 12,-8 C 4,-12 -4,-12 -12,-8 Z"
              fill={COLORS.orange} fillOpacity={0.25}
              stroke={COLORS.orange} strokeWidth={1.5} />
            <line x1={0} y1={16} x2={0} y2={24}
              stroke={COLORS.deep_black} strokeWidth={1} opacity={0.3} />
          </g>
          <circle cx={40} cy={44} r={20} fill="none"
            stroke={COLORS.orange} strokeWidth={2} opacity={0.3} />
          <text x={40} y={49} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14} fontWeight={800} fill={COLORS.orange}>
            1
          </text>
          <text x={78} y={40}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            EXTRACT
          </text>
          <text x={78} y={66}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            3 Pilot chutes pull out mains
          </text>

          {/* Dashed connector */}
          <line x1={40} y1={72} x2={40} y2={108}
            stroke={COLORS.cool_silver} strokeWidth={1.5} opacity={0.25}
            strokeDasharray="4 4" />

          {/* Step 2 — main deploy */}
          <g transform="translate(40, 132)">
            {/* Larger parachute icon */}
            <path d="M -14,-10 C -22,2 -18,16 0,20 C 18,16 22,2 14,-10 C 6,-16 -6,-16 -14,-10 Z"
              fill={COLORS.green} fillOpacity={0.25}
              stroke={COLORS.green} strokeWidth={1.5} />
            <line x1={-6} y1={18} x2={0} y2={28}
              stroke={COLORS.deep_black} strokeWidth={1} opacity={0.3} />
            <line x1={6} y1={18} x2={0} y2={28}
              stroke={COLORS.deep_black} strokeWidth={1} opacity={0.3} />
          </g>
          <circle cx={40} cy={132} r={20} fill="none"
            stroke={COLORS.green} strokeWidth={2} opacity={0.3} />
          <text x={40} y={137} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14} fontWeight={800} fill={COLORS.green}>
            2
          </text>
          <text x={78} y={126}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            DEPLOY
          </text>
          <text x={78} y={152}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            3 Main canopies fully inflate
          </text>
        </g>

        {/* ── Total canopies badge ────────────────────────────────────────── */}
        <g opacity={totalBadge.opacity * shimmer}
          transform={`translate(60, ${1480 + totalBadge.translateY})`}>
          <rect x={0} y={0} width={960} height={90} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.12} />
          {/* 6 small canopy icons */}
          {Array.from({ length: 6 }, (_, i) => {
            const ix = 100 + i * 60;
            const isOrange = i < 3;
            const col = isOrange ? COLORS.orange : COLORS.green;
            return (
              <g key={`ic-${i}`} transform={`translate(${ix}, 45)`}>
                <path d="M -8,-5 C -12,2 -10,10 0,12 C 10,10 12,2 8,-5 C 4,-8 -4,-8 -8,-5 Z"
                  fill={col} fillOpacity={0.2}
                  stroke={col} strokeWidth={1.2} />
                <line x1={0} y1={12} x2={0} y2={18}
                  stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.2} />
              </g>
            );
          })}
          <text x={520} y={38}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            TOTAL CANOPIES
          </text>
          <text x={520} y={70}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={900} fill={COLORS.deep_black}>
            3 + 3 = 6
          </text>
        </g>

        {/* ── Bottom divider + note ───────────────────────────────────────── */}
        <g opacity={bottomNote.opacity}>
          <line x1={200} y1={1612} x2={880} y2={1612}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />
          <text x={540} y={1656} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={0.6}>
            Full canopy inflation slows descent to safe speed
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
