/**
 * Scene04 — Recap of Day 4
 * "Last day, we learned what happens when a crew member hits the abort button
 *  and why every millisecond of that sequence was engineered years before launch."
 * CSV: 12.860s → 22.500s
 *
 * Animation phases:
 *   Phase 1 (0–30): Corner accents, label, headline spring entrance
 *   Phase 2 (20–90): Large abort console with safety cover, detailed button, 3 pulse rings,
 *                     status LEDs, horizontal timeline with 4 phase nodes & connector draw,
 *                     3 icon-enriched recap cards
 *   Phase 3 (80–end): Button glow pulse, ring expansion, LED blink, card breathing
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
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

export const Scene04_AbortRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (0–30) ──────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Console + timeline + cards (20–90) ───────────────
  const consoleEnt = useSpringEntrance(frame, 20);
  const buttonEnt = useSpringEntrance(frame, 26);
  const coverEnt = useSpringEntrance(frame, 22);
  const timelineEnt = useSpringEntrance(frame, 38);
  const node1 = useSpringEntrance(frame, 42);
  const node2 = useSpringEntrance(frame, 48);
  const node3 = useSpringEntrance(frame, 54);
  const node4 = useSpringEntrance(frame, 60);
  const card1 = useSpringEntrance(frame, 66);
  const card2 = useSpringEntrance(frame, 76);
  const card3 = useSpringEntrance(frame, 86);
  const connectorDraw = usePathDraw(frame, 44, 720, 30);
  const consoleBorderDraw = usePathDraw(frame, 22, 1200, 30);
  const bottomEnt = useSpringEntrance(frame, 92);

  // ── Phase 3: Micro-animations (80–end) ────────────────────────
  const buttonPulse = 1 + Math.sin(frame * 0.1) * 0.03;
  const breathe = Math.sin(frame * 0.05) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.82, 1]);
  const ring1Scale = 1 + Math.sin(frame * 0.08) * 0.06;
  const ring2Scale = 1 + Math.sin(frame * 0.08 + 1) * 0.08;
  const ring3Scale = 1 + Math.sin(frame * 0.08 + 2) * 0.1;
  const ledBlink = Math.sin(frame * 0.15) > 0 ? 0.8 : 0.2;
  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.15, 0.35]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  const CX = 540;
  const CY = 640;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.3} color={COLORS.vibrant_red} />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="YESTERDAY · RECAP" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={378} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={900} fill={COLORS.deep_black}>
            Day 4 Recap
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={448} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={600} fill={COLORS.vibrant_red}>
            The Abort Sequence
          </text>
        </g>

        {/* ── Zone C — Large abort console illustration ─────────── */}
        <g opacity={consoleEnt.opacity}
          transform={`translate(${CX}, ${CY + consoleEnt.translateY})`}>

          {/* Console panel — large housing */}
          <rect x={-200} y={-140} width={400} height={280} rx={20}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.vibrant_red} strokeWidth={2.5}
            strokeDasharray={1200} strokeDashoffset={consoleBorderDraw} />

          {/* Console panel lines — tech detail */}
          <line x1={-180} y1={-100} x2={-180} y2={120}
            stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.06} />
          <line x1={180} y1={-100} x2={180} y2={120}
            stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.06} />
          {/* Horizontal panel separator */}
          <line x1={-170} y1={-90} x2={170} y2={-90}
            stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.06} />

          {/* 6 rivet dots on console corners */}
          {[[-175, -125], [175, -125], [-175, 125], [175, 125], [-175, 0], [175, 0]].map(([rx, ry], i) => (
            <circle key={`rivet-${i}`} cx={rx} cy={ry} r={3}
              fill={COLORS.deep_black} fillOpacity={0.1} />
          ))}

          {/* Safety cover — flipped open (above the button) */}
          <g opacity={coverEnt.opacity}>
            <rect x={-55} y={-130} width={110} height={35} rx={6}
              fill={COLORS.vibrant_red} fillOpacity={0.12}
              stroke={COLORS.vibrant_red} strokeWidth={1.5} />
            <text x={0} y={-107} textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={14} fontWeight={700} fill={COLORS.vibrant_red} opacity={0.5}>
              SAFETY COVER
            </text>
            {/* Hinge line */}
            <line x1={-55} y1={-95} x2={55} y2={-95}
              stroke={COLORS.vibrant_red} strokeWidth={1.5} opacity={0.3} />
          </g>

          {/* Button glow halo */}
          <circle cx={0} cy={0} r={80}
            fill={COLORS.vibrant_red} fillOpacity={glowPulse * 0.15} />

          {/* 3 concentric pulse rings */}
          <circle cx={0} cy={0} r={70} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={1}
            opacity={0.12 * shimmer}
            style={{ transform: `scale(${ring3Scale})`, transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={58} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={1.2}
            opacity={0.18 * shimmer}
            style={{ transform: `scale(${ring2Scale})`, transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={48} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={1.5}
            opacity={0.25 * shimmer}
            style={{ transform: `scale(${ring1Scale})`, transformOrigin: '0px 0px' }} />

          {/* Main abort button */}
          <circle cx={0} cy={0} r={40}
            fill={COLORS.vibrant_red} fillOpacity={0.22}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            style={{ transform: `scale(${buttonPulse})`, transformOrigin: '0px 0px' }} />
          {/* Button inner highlight */}
          <circle cx={-10} cy={-10} r={14}
            fill={COLORS.vibrant_red} fillOpacity={0.08} />
          {/* ABORT text on button */}
          <text x={0} y={7} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={900} fill={COLORS.vibrant_red}>
            ABORT
          </text>

          {/* Status LEDs — left column */}
          <circle cx={-150} cy={-60} r={6}
            fill={COLORS.green} fillOpacity={ledBlink} />
          <text x={-136} y={-55} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={12} fontWeight={500} fill={COLORS.cool_silver}>SYS RDY</text>

          <circle cx={-150} cy={-30} r={6}
            fill={COLORS.amber} fillOpacity={0.5 * shimmer} />
          <text x={-136} y={-25} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={12} fontWeight={500} fill={COLORS.cool_silver}>ARM</text>

          {/* Status LEDs — right column */}
          <circle cx={150} cy={-60} r={6}
            fill={COLORS.green} fillOpacity={ledBlink * 0.8} />
          <text x={102} y={-55} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={12} fontWeight={500} fill={COLORS.cool_silver}>PWR</text>

          <circle cx={150} cy={-30} r={6}
            fill={COLORS.vibrant_red} fillOpacity={0.15} />
          <text x={102} y={-25} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={12} fontWeight={500} fill={COLORS.cool_silver}>FAULT</text>

          {/* Console label plate */}
          <rect x={-80} y={70} width={160} height={40} rx={6}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.15} />
          <text x={0} y={96} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={16} fontWeight={700} fill={COLORS.deep_black} opacity={0.3}
            letterSpacing="0.2em">
            MASTER ABORT
          </text>
        </g>

        {/* ── Horizontal abort timeline ─────────────────────────── */}
        <path d={`M 120,${CY + 210} L 960,${CY + 210}`}
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2.5}
          strokeDasharray={720} strokeDashoffset={connectorDraw}
          strokeLinecap="round" opacity={0.25} />

        {/* Phase nodes on timeline */}
        {[
          { x: 180, label: 'DETECT', sub: '<10ms', color: COLORS.vibrant_red, ent: node1 },
          { x: 390, label: 'FIRE LAS', sub: '300ms', color: COLORS.orange, ent: node2 },
          { x: 620, label: 'SEPARATE', sub: '2s', color: COLORS.amber, ent: node3 },
          { x: 870, label: 'SAFE', sub: '~15min', color: COLORS.green, ent: node4 },
        ].map((n, i) => (
          <g key={i} opacity={n.ent.opacity}
            transform={`translate(${n.x}, ${CY + 210 + n.ent.translateY})`}>
            <circle cx={0} cy={0} r={18}
              fill={n.color} fillOpacity={0.18}
              stroke={n.color} strokeWidth={2.5} />
            <text x={0} y={5} textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={14} fontWeight={800} fill={n.color}>
              {i + 1}
            </text>
            <text x={0} y={-32} textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={20} fontWeight={700} fill={COLORS.deep_black}>
              {n.label}
            </text>
            <text x={0} y={42} textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={18} fontWeight={600} fill={n.color}>
              {n.sub}
            </text>
          </g>
        ))}

        {/* ── 3 Recap cards with unique SVG icons ──────────────── */}
        {/* Card 1 — LAS (rocket icon) */}
        <g opacity={card1.opacity}
          transform={`translate(60, ${1030 + card1.translateY + breathe * 0.3})`}>
          <rect x={0} y={0} width={960} height={110} rx={14}
            fill={COLORS.vibrant_red} fillOpacity={0.05}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Rocket icon */}
          <g transform="translate(35, 18)">
            <polygon points="24,0 8,30 40,30"
              fill={COLORS.vibrant_red} fillOpacity={0.25}
              stroke={COLORS.vibrant_red} strokeWidth={1.5} />
            <rect x={14} y={30} width={20} height={22} rx={4}
              fill={COLORS.vibrant_red} fillOpacity={0.2}
              stroke={COLORS.vibrant_red} strokeWidth={1} />
            {/* Fins */}
            <polygon points="8,30 0,44 14,44"
              fill={COLORS.vibrant_red} fillOpacity={0.15} />
            <polygon points="40,30 48,44 34,44"
              fill={COLORS.vibrant_red} fillOpacity={0.15} />
            {/* Exhaust flame */}
            <path d="M 18,52 L 24,68 L 30,52"
              fill={COLORS.orange} fillOpacity={0.35}
              stroke={COLORS.orange} strokeWidth={1} />
          </g>
          <text x={110} y={42}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800} fill={COLORS.deep_black}>
            Launch Abort System (LAS)
          </text>
          <text x={110} y={78}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            Fires within milliseconds of abort trigger
          </text>
        </g>

        {/* Card 2 — Deep Space Abort (orbital path icon) */}
        <g opacity={card2.opacity}
          transform={`translate(60, ${1160 + card2.translateY + breathe * 0.5})`}>
          <rect x={0} y={0} width={960} height={110} rx={14}
            fill={COLORS.orange} fillOpacity={0.05}
            stroke={COLORS.orange} strokeWidth={2} />
          {/* Orbit/redirect icon */}
          <g transform="translate(35, 20)">
            <circle cx={24} cy={32} r={8}
              fill={COLORS.orange} fillOpacity={0.3}
              stroke={COLORS.orange} strokeWidth={1.5} />
            {/* Orbit path */}
            <ellipse cx={24} cy={32} rx={26} ry={14} fill="none"
              stroke={COLORS.orange} strokeWidth={1.5} opacity={0.4}
              strokeDasharray="6 3" />
            {/* Return arrow */}
            <path d="M 2,22 L 12,14 L 12,30 Z"
              fill={COLORS.orange} fillOpacity={0.4} />
          </g>
          <text x={110} y={42}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800} fill={COLORS.deep_black}>
            Deep Space Abort
          </text>
          <text x={110} y={78}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            Service module redirects capsule home
          </text>
        </g>

        {/* Card 3 — Zero Improvisation (gear/precision icon) */}
        <g opacity={card3.opacity}
          transform={`translate(60, ${1290 + card3.translateY + breathe * 0.7})`}>
          <rect x={0} y={0} width={960} height={110} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.05}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Gear icon */}
          <g transform="translate(35, 18)">
            <circle cx={24} cy={32} r={16}
              fill={COLORS.sky_blue} fillOpacity={0.15}
              stroke={COLORS.sky_blue} strokeWidth={1.5} />
            <circle cx={24} cy={32} r={7} fill="none"
              stroke={COLORS.sky_blue} strokeWidth={1.5} />
            {/* 8 gear teeth */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 24 + Math.cos(rad) * 15;
              const y1 = 32 + Math.sin(rad) * 15;
              const x2 = 24 + Math.cos(rad) * 22;
              const y2 = 32 + Math.sin(rad) * 22;
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={COLORS.sky_blue} strokeWidth={3}
                  strokeLinecap="round" opacity={0.4} />
              );
            })}
          </g>
          <text x={110} y={42}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800} fill={COLORS.deep_black}>
            Zero Improvisation
          </text>
          <text x={110} y={78}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            Every scenario pre-engineered years ahead
          </text>
        </g>

        {/* ── Transition label + arrow ──────────────────────────── */}
        <line x1={60} y1={1470} x2={1020} y2={1470}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.06} />
        <g opacity={bottomEnt.opacity * 0.6}>
          <text x={540} y={1520} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.sky_blue}>
            Today: What happens after re-entry?
          </text>
          <path d="M 540,1538 L 540,1574"
            stroke={COLORS.sky_blue} strokeWidth={2.5} opacity={0.4}
            markerEnd="url(#arrow)" />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
