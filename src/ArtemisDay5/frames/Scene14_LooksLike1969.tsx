/**
 * Scene14 — It Looks Like 1969
 * "It looks like 1969 from the outside."
 * CSV: 80.460s → 83.400s
 * Duration: ~106 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring entrance
 *   Phase 2 (15–70): Ghost 1969, retro badge, side-by-side capsules, film strip, comparison cards
 *   Phase 3 (60–end): Breathe, shimmer, film flicker, pulse rings
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import {
  PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents,
  Divider,
} from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(
  frame: number,
  startFrame: number,
  totalLength: number,
  durationFrames = 30,
) {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  );
  return totalLength * (1 - progress);
}

export const Scene14_LooksLike1969: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 10);

  // ── Phase 2: Content build ─────────────────────────────────────────────
  const yearBadge = useSpringEntrance(frame, 14);
  const apolloEnt = useSpringEntrance(frame, 20);
  const orionEnt = useSpringEntrance(frame, 26);
  const filmStripEnt = useSpringEntrance(frame, 18);
  const arrowDraw = usePathDraw(frame, 24, 200, 20);
  const compDividerDraw = usePathDraw(frame, 22, 500, 25);
  const card1 = useSpringEntrance(frame, 36);
  const card2 = useSpringEntrance(frame, 46);
  const eqSign = useSpringEntrance(frame, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.02;
  const shimmer = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.82, 1],
  );
  const filmFlicker = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [0.7, 1],
  );
  const ringPulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={1080}
        height={1920}
      >
        <PaperBackground />
        <GlobalDefs />

        {/* ── Ghost background year ── */}
        <text
          x={540}
          y={720}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={320}
          fontWeight={900}
          fill={COLORS.amber}
          opacity={0.035}
        >
          1969
        </text>

        {/* ── Zone A — Section label ── */}
        <g
          transform={`translate(0, ${labelEnt.translateY})`}
          opacity={labelEnt.opacity}
        >
          <SectionLabel
            text="HERITAGE · APPEARANCE"
            y={260}
            opacity={0.55}
          />
        </g>

        {/* ── Zone B — Headline ── */}
        <g
          transform={`translate(0, ${headA.translateY})`}
          opacity={headA.opacity}
        >
          <text
            x={540}
            y={370}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60}
            fontWeight={900}
            fill={COLORS.deep_black}
          >
            It Looks Like
          </text>
        </g>
        <g
          transform={`translate(0, ${headB.translateY})`}
          opacity={headB.opacity}
        >
          <text
            x={540}
            y={458}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={84}
            fontWeight={900}
            fill={COLORS.amber}
          >
            1969
          </text>
          {/* Double underline */}
          <rect
            x={340}
            y={470}
            width={400}
            height={4}
            rx={2}
            fill={COLORS.amber}
            opacity={0.45}
          />
          <rect
            x={360}
            y={480}
            width={360}
            height={3}
            rx={1.5}
            fill={COLORS.amber}
            opacity={0.25}
          />
        </g>

        {/* ═══ FILM STRIP — left side ═══ */}
        <g
          opacity={filmStripEnt.opacity * filmFlicker}
          transform={`translate(60, ${560 + filmStripEnt.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={90}
            height={580}
            rx={4}
            fill={COLORS.deep_black}
            fillOpacity={0.04}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
            opacity={0.2}
          />
          {/* Sprocket holes — left and right columns */}
          {Array.from({ length: 9 }, (_, i) => (
            <g key={`spr-${i}`}>
              <rect
                x={4}
                y={10 + i * 64}
                width={14}
                height={22}
                rx={3}
                fill={COLORS.bg_paper}
                stroke={COLORS.deep_black}
                strokeWidth={0.7}
                opacity={0.3}
              />
              <rect
                x={72}
                y={10 + i * 64}
                width={14}
                height={22}
                rx={3}
                fill={COLORS.bg_paper}
                stroke={COLORS.deep_black}
                strokeWidth={0.7}
                opacity={0.3}
              />
            </g>
          ))}
          {/* Frame previews (alternating amber tints) */}
          {Array.from({ length: 8 }, (_, i) => (
            <rect
              key={`fp-${i}`}
              x={22}
              y={12 + i * 64}
              width={46}
              height={36}
              rx={2}
              fill={COLORS.amber}
              fillOpacity={0.06 + (i % 3) * 0.03}
              stroke={COLORS.amber}
              strokeWidth={0.5}
              opacity={0.4}
            />
          ))}
          {/* "ARCHIVAL" label vertically */}
          <text
            x={45}
            y={560}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14}
            fontWeight={600}
            fill={COLORS.cool_silver}
            letterSpacing="0.2em"
            opacity={0.4}
          >
            FILM
          </text>
        </g>

        {/* ═══ SIDE-BY-SIDE CAPSULE COMPARISON ═══ */}
        {/* Center divider line */}
        <line
          x1={540}
          y1={560}
          x2={540}
          y2={1050}
          stroke={COLORS.deep_black}
          strokeWidth={1.5}
          opacity={0.12}
          strokeDasharray={500}
          strokeDashoffset={compDividerDraw}
        />

        {/* Left side: APOLLO 1969 capsule */}
        <g
          opacity={apolloEnt.opacity}
          transform={`translate(330, ${780 + apolloEnt.translateY + breathe})`}
        >
          {/* Label */}
          <text
            x={0}
            y={-130}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28}
            fontWeight={800}
            fill={COLORS.amber}
            letterSpacing="0.08em"
          >
            APOLLO
          </text>
          <text
            x={0}
            y={-106}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            1969
          </text>
          {/* Conical body */}
          <path
            d="M 0,-85 L -70,35 L -76,70 L 76,70 L 70,35 Z"
            fill={COLORS.cool_silver}
            fillOpacity={0.15}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
          />
          {/* Simple panel lines */}
          <line
            x1={0}
            y1={-80}
            x2={0}
            y2={68}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.08}
          />
          <line
            x1={-35}
            y1={-60}
            x2={-40}
            y2={68}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.06}
          />
          <line
            x1={35}
            y1={-60}
            x2={40}
            y2={68}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.06}
          />
          {/* 4 rivets */}
          {[-48, -16, 16, 48].map((rx, i) => (
            <circle
              key={`arv-${i}`}
              cx={rx}
              cy={0}
              r={2.5}
              fill={COLORS.deep_black}
              opacity={0.12}
            />
          ))}
          {/* Heat shield */}
          <rect
            x={-76}
            y={68}
            width={152}
            height={14}
            rx={6}
            fill={COLORS.brown}
            fillOpacity={0.25}
            stroke={COLORS.brown}
            strokeWidth={1.5}
          />
          {/* Window */}
          <ellipse
            cx={0}
            cy={-30}
            rx={14}
            ry={10}
            fill={COLORS.sky_blue}
            fillOpacity={0.12}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          {/* RCS nozzles */}
          <circle
            cx={-60}
            cy={18}
            r={5}
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.15}
          />
          <circle
            cx={60}
            cy={18}
            r={5}
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.15}
          />
        </g>

        {/* Center equals sign */}
        <g
          opacity={eqSign.opacity}
          transform={`translate(540, ${780 + eqSign.translateY})`}
        >
          <rect
            x={-24}
            y={-10}
            width={48}
            height={6}
            rx={3}
            fill={COLORS.amber}
            opacity={0.55}
          />
          <rect
            x={-24}
            y={4}
            width={48}
            height={6}
            rx={3}
            fill={COLORS.amber}
            opacity={0.55}
          />
        </g>

        {/* Right side — ORION 2024 capsule */}
        <g
          opacity={orionEnt.opacity}
          transform={`translate(750, ${780 + orionEnt.translateY + breathe})`}
        >
          <text
            x={0}
            y={-130}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28}
            fontWeight={800}
            fill={COLORS.sky_blue}
            letterSpacing="0.08em"
          >
            ORION
          </text>
          <text
            x={0}
            y={-106}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            2024
          </text>
          {/* Conical body */}
          <path
            d="M 0,-85 L -70,35 L -76,70 L 76,70 L 70,35 Z"
            fill={COLORS.cool_silver}
            fillOpacity={0.2}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
          />
          {/* Panel lines */}
          <line
            x1={0}
            y1={-80}
            x2={0}
            y2={68}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.1}
          />
          <line
            x1={-35}
            y1={-55}
            x2={-38}
            y2={68}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.07}
          />
          <line
            x1={35}
            y1={-55}
            x2={38}
            y2={68}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.07}
          />
          {/* 6 rivets */}
          {[-52, -26, 0, 26, 52].map((rx, i) => (
            <circle
              key={`orv-${i}`}
              cx={rx}
              cy={-5}
              r={2}
              fill={COLORS.deep_black}
              opacity={0.12}
            />
          ))}
          {/* Heat shield — larger */}
          <rect
            x={-76}
            y={68}
            width={152}
            height={16}
            rx={8}
            fill={COLORS.brown}
            fillOpacity={0.3}
            stroke={COLORS.brown}
            strokeWidth={1.5}
          />
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={`ohs-${i}`}
              x1={-58 + i * 26}
              y1={72}
              x2={-54 + i * 26}
              y2={80}
              stroke={COLORS.brown}
              strokeWidth={1}
              opacity={0.12}
            />
          ))}
          {/* Portholes */}
          <circle
            cx={-24}
            cy={-10}
            r={8}
            fill={COLORS.sky_blue}
            fillOpacity={0.15}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          <ellipse
            cx={-22}
            cy={-12}
            rx={3}
            ry={2}
            fill={COLORS.sky_blue}
            fillOpacity={0.15}
          />
          <circle
            cx={24}
            cy={-10}
            r={8}
            fill={COLORS.sky_blue}
            fillOpacity={0.15}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          <ellipse
            cx={22}
            cy={-12}
            rx={3}
            ry={2}
            fill={COLORS.sky_blue}
            fillOpacity={0.15}
          />
          {/* Docking ring */}
          <rect
            x={-22}
            y={-95}
            width={44}
            height={10}
            rx={5}
            fill={COLORS.cool_silver}
            fillOpacity={0.2}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
          />
          {/* ORION label */}
          <text
            x={0}
            y={58}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18}
            fontWeight={800}
            fill={COLORS.orange}
            letterSpacing="0.12em"
            opacity={0.6}
          >
            ORION
          </text>
        </g>

        {/* ── Year badge (centered) ── */}
        <g
          opacity={yearBadge.opacity}
          transform={`translate(540, ${1020 + yearBadge.translateY})`}
        >
          {/* Outer ring */}
          <circle
            cx={0}
            cy={0}
            r={70}
            fill={COLORS.amber}
            fillOpacity={0.05 * shimmer}
            stroke={COLORS.amber}
            strokeWidth={2.5}
            transform={`scale(${ringPulse})`}
            style={{ transformOrigin: '0px 0px' }}
          />
          <circle
            cx={0}
            cy={0}
            r={55}
            fill="none"
            stroke={COLORS.amber}
            strokeWidth={1}
            opacity={0.35}
          />
          <text
            x={0}
            y={-18}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={16}
            fontWeight={600}
            fill={COLORS.cool_silver}
            letterSpacing="0.2em"
          >
            APOLLO ERA
          </text>
          <text
            x={0}
            y={16}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40}
            fontWeight={900}
            fill={COLORS.amber}
          >
            56 YRS
          </text>
          <text
            x={0}
            y={38}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14}
            fontWeight={500}
            fill={COLORS.cool_silver}
            letterSpacing="0.15em"
          >
            SAME SHAPE
          </text>
        </g>

        {/* ── Arrow connector from badge to cards ── */}
        <path
          d="M 540,1100 L 540,1180"
          fill="none"
          stroke={COLORS.amber}
          strokeWidth={2.5}
          strokeDasharray={200}
          strokeDashoffset={arrowDraw}
          markerEnd="url(#arrow)"
        />

        {/* ═══ COMPARISON CARDS ═══ */}
        {/* Card 1 — Same shape */}
        <g
          opacity={card1.opacity}
          transform={`translate(60, ${1200 + card1.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={110}
            rx={12}
            fill={COLORS.amber}
            fillOpacity={0.05}
            stroke={COLORS.amber}
            strokeWidth={1.5}
          />
          <rect
            x={0}
            y={0}
            width={6}
            height={110}
            rx={3}
            fill={COLORS.amber}
          />
          {/* Cone silhouette icon */}
          <path
            d="M 40,25 L 28,70 L 52,70 Z"
            fill="none"
            stroke={COLORS.amber}
            strokeWidth={2}
          />
          <line
            x1={26}
            y1={72}
            x2={54}
            y2={72}
            stroke={COLORS.amber}
            strokeWidth={2}
          />
          <text
            x={80}
            y={42}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30}
            fontWeight={800}
            fill={COLORS.amber}
          >
            FROM THE OUTSIDE
          </text>
          <text
            x={80}
            y={76}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Same conical shape as Apollo command module
          </text>
        </g>

        {/* Card 2 — Proven physics */}
        <g
          opacity={card2.opacity}
          transform={`translate(60, ${1340 + card2.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={110}
            rx={12}
            fill={COLORS.deep_black}
            fillOpacity={0.02}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.15}
          />
          <rect
            x={0}
            y={0}
            width={6}
            height={110}
            rx={3}
            fill={COLORS.cool_silver}
          />
          {/* Shield/check icon */}
          <path
            d="M 40,20 L 26,32 L 26,52 C 26,66 40,76 40,76 C 40,76 54,66 54,52 L 54,32 Z"
            fill="none"
            stroke={COLORS.cool_silver}
            strokeWidth={2}
          />
          <path
            d="M 33,46 L 38,52 L 48,38"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <text
            x={80}
            y={42}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30}
            fontWeight={800}
            fill={COLORS.deep_black}
          >
            FAMILIAR SILHOUETTE
          </text>
          <text
            x={80}
            y={76}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Blunt-body design proven by 56 years of physics
          </text>
        </g>

        {/* ── Corner accents ── */}
        <CornerAccents color={COLORS.amber} opacity={0.4} />

        {/* ── Bottom divider + note ── */}
        <Divider y={1840} opacity={0.1} />
        <text
          x={540}
          y={1870}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={28}
          fontWeight={400}
          fill={COLORS.cool_silver}
          opacity={0.5}
        >
          But what is hidden underneath the familiar shape?
        </text>

        {/* ── Caption ── */}
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
