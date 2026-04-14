/**
 * Scene 19 — Key Takeaway
 * Summary of Day 27: "What Is a Tool?"
 * Duration: 120 frames (4s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label springs in, giant "TOOL" keyword reveal
 *   Phase 2 (frames 20–70):  Definition cards build with stagger, connecting arrows draw
 *   Phase 3 (frames 60–end): Subtle pulse, shimmer on key term, accent ring breathe
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, SectionLabel, BentoCard } from '../helpers/components';

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

export const Scene19_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const heroEnt = useSpringEntrance(frame, 6);
  const defEnt = useSpringEntrance(frame, 14);

  // ── Phase 2: Key insight cards ──────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 46);

  // Connecting arrows
  const arrowLen = 80;
  const arrow1Off = usePathDraw(frame, 30, arrowLen, 14);
  const arrow2Off = usePathDraw(frame, 42, arrowLen, 14);

  // Bottom summary card
  const summaryCard = useSpringEntrance(frame, 56);

  // Ring around hero word
  const ringCircum = 2 * Math.PI * 120;
  const ringOffset = usePathDraw(frame, 8, ringCircum, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="KEY TAKEAWAY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero keyword ───────────────────────────────────────── */}
        <g transform={`translate(0, ${heroEnt.translateY})`} opacity={heroEnt.opacity}>
          {/* Ghost behind */}
          <text x={540} y={380} textAnchor="middle"
            fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}>
            TOOL
          </text>
          {/* Main word */}
          <text x={540} y={380} textAnchor="middle"
            fontFamily={FONT} fontSize={180} fontWeight={800}
            fill={COLORS.accent}>
            TOOL
          </text>
          {/* Decorative ring */}
          <circle cx={540} cy={340} r={120}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={ringCircum} strokeDashoffset={ringOffset}
            opacity={0.2} />
        </g>

        <g transform={`translate(0, ${defEnt.translateY})`} opacity={defEnt.opacity}>
          <text x={540} y={460} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>
            A named, callable function
          </text>
          <text x={540} y={516} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            that the agent can invoke
          </text>
        </g>

        {/* ── ZONE C — Three key points ───────────────────────────────────── */}

        {/* Card 1: Model decides */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={580} w={960} h={160} accent />
          <rect x={60} y={580} width={6} height={160} rx={3} fill={COLORS.accent} />
          {/* Brain icon */}
          <g transform="translate(110, 660)">
            <ellipse cx={0} cy={0} rx={20} ry={18} fill="none"
              stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -10,-8 Q -2,-18 6,-8" fill="none"
              stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
            <path d="M -8,4 Q 0,-4 8,4" fill="none"
              stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          </g>
          <text x={160} y={650} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Model
          </text>
          <text x={290} y={650} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            decides
          </text>
          <text x={160} y={700} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Reasoning: which tool, what arguments, when
          </text>
        </g>

        {/* Arrow 1→2 */}
        <line x1={540} y1={750} x2={540} y2={800}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrow1Off}
          markerEnd="url(#arrow)" />

        {/* Card 2: Tool executes */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={810} w={960} h={160} accent />
          <rect x={60} y={810} width={6} height={160} rx={3} fill={COLORS.accent} />
          {/* Gear icon */}
          <g transform="translate(110, 890)">
            <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={6} fill={COLORS.accent} fillOpacity={0.2} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
              const r = (a * Math.PI) / 180;
              return (
                <line key={i}
                  x1={Math.cos(r) * 14} y1={Math.sin(r) * 14}
                  x2={Math.cos(r) * 20} y2={Math.sin(r) * 20}
                  stroke={COLORS.accent} strokeWidth={2.5}
                  strokeLinecap="round" />
              );
            })}
          </g>
          <text x={160} y={880} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Tool
          </text>
          <text x={260} y={880} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            executes
          </text>
          <text x={160} y={930} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Execution: doing the actual work in the real world
          </text>
        </g>

        {/* Arrow 2→3 */}
        <line x1={540} y1={980} x2={540} y2={1030}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrow2Off}
          markerEnd="url(#arrow)" />

        {/* Card 3: Clean separation */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={160} accent />
          <rect x={60} y={1040} width={6} height={160} rx={3} fill={COLORS.accent} />
          {/* Separation icon — two halves */}
          <g transform="translate(110, 1120)">
            <rect x={-18} y={-12} width={14} height={24} rx={4}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <rect x={4} y={-12} width={14} height={24} rx={4}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <line x1={-1} y1={-14} x2={-1} y2={14}
              stroke={COLORS.accent} strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
          </g>
          <text x={160} y={1110} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Clean
          </text>
          <text x={310} y={1110} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            separation
          </text>
          <text x={160} y={1160} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The model never executes. The tool never decides.
          </text>
        </g>

        {/* ── Summary card ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={120} />
          <text x={540} y={1328} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Tools are the
          </text>
          <text x={540} y={1328} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            dx={145}>
            agent's hands
          </text>
        </g>

        {/* Tool examples row */}
        <g opacity={summaryCard.opacity * 0.7}>
          {['search()', 'code()', 'browse()', 'email()', 'file()'].map((tool, i) => {
            const tx = 100 + i * 190;
            return (
              <g key={i}>
                <rect x={tx} y={1420} width={160} height={50} rx={10}
                  fill={COLORS.bg_secondary} stroke={COLORS.accent}
                  strokeWidth={1} opacity={0.5} />
                <text x={tx + 80} y={1452} textAnchor="middle"
                  fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500}
                  fill={COLORS.accent} opacity={shimmer}>
                  {tool}
                </text>
              </g>
            );
          })}
        </g>

        {/* Floating particles */}
        <circle cx={300} cy={1560 + breathe} r={3} fill={COLORS.accent} opacity={0.05} />
        <circle cx={780} cy={1580 + breathe * 0.7} r={2} fill={COLORS.accent} opacity={0.04} />
      </svg>
    </AbsoluteFill>
  );
};
