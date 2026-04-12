/**
 * Scene15 — A Completely Different World
 * "The engineering underneath it is from a completely different world."
 * CSV: 83.960s → 87.580s
 * Duration: ~127 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring entrance
 *   Phase 2 (15–80): Ghost text, large cutaway capsule with internal systems,
 *     callout leader lines, tech nodes, comparison columns with unique icons
 *   Phase 3 (70–end): Breathe, shimmer, circuit glow, pulse rings
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

export const Scene15_DifferentWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 10);

  // ── Phase 2: Content build ─────────────────────────────────────────────
  const capsuleEnt = useSpringEntrance(frame, 14);
  const innerEnt = useSpringEntrance(frame, 20);
  const callout1 = useSpringEntrance(frame, 24);
  const callout2 = useSpringEntrance(frame, 30);
  const callout3 = useSpringEntrance(frame, 36);
  const callout4 = useSpringEntrance(frame, 42);
  const dividerDraw = usePathDraw(frame, 26, 600, 25);
  const outerShellDraw = usePathDraw(frame, 14, 500, 30);
  const innerShellDraw = usePathDraw(frame, 20, 400, 25);
  const colLeft = useSpringEntrance(frame, 50);
  const colRight = useSpringEntrance(frame, 56);
  const bottomBadge = useSpringEntrance(frame, 64);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.02;
  const shimmer = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.82, 1],
  );
  const circuitGlow = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.3, 0.7],
  );
  const nodeFlicker = interpolate(
    Math.sin(frame * 0.09),
    [-1, 1],
    [0.5, 1.0],
  );

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={1080}
        height={1920}
      >
        <PaperBackground />
        <GlobalDefs />

        {/* ── Ghost background text ── */}
        <text
          x={540}
          y={700}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={260}
          fontWeight={900}
          fill={COLORS.purple}
          opacity={0.03}
        >
          NEW
        </text>

        {/* ── Zone A — Section label ── */}
        <g
          transform={`translate(0, ${labelEnt.translateY})`}
          opacity={labelEnt.opacity}
        >
          <SectionLabel
            text="ENGINEERING · MODERN"
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
            fontSize={56}
            fontWeight={900}
            fill={COLORS.deep_black}
          >
            A Completely
          </text>
        </g>
        <g
          transform={`translate(0, ${headB.translateY})`}
          opacity={headB.opacity}
        >
          <text
            x={540}
            y={460}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={76}
            fontWeight={900}
            fill={COLORS.purple}
          >
            Different World
          </text>
          <rect
            x={280}
            y={474}
            width={480}
            height={4}
            rx={2}
            fill={COLORS.purple}
            opacity={0.35}
          />
        </g>

        {/* ═══ LARGE CUTAWAY CAPSULE ═══ */}
        <g
          opacity={capsuleEnt.opacity}
          transform={`translate(540, ${680 + capsuleEnt.translateY + breathe})`}
        >
          {/* Outer shell — dashed, represents old exterior */}
          <path
            d="M 0,-120 L -100,60 L -110,100 L 110,100 L 100,60 Z"
            fill="none"
            stroke={COLORS.cool_silver}
            strokeWidth={2.5}
            strokeDasharray={500}
            strokeDashoffset={outerShellDraw}
            opacity={0.4}
          />
          {/* Panel lines on outer shell */}
          <line
            x1={0}
            y1={-115}
            x2={0}
            y2={98}
            stroke={COLORS.cool_silver}
            strokeWidth={1}
            opacity={0.1}
            strokeDasharray="6 3"
          />
          <line
            x1={-50}
            y1={-70}
            x2={-56}
            y2={98}
            stroke={COLORS.cool_silver}
            strokeWidth={1}
            opacity={0.08}
            strokeDasharray="6 3"
          />
          <line
            x1={50}
            y1={-70}
            x2={56}
            y2={98}
            stroke={COLORS.cool_silver}
            strokeWidth={1}
            opacity={0.08}
            strokeDasharray="6 3"
          />

          {/* Inner tech hull — solid purple, modern interior */}
          <path
            d="M 0,-95 L -80,50 L -85,82 L 85,82 L 80,50 Z"
            fill={COLORS.purple}
            fillOpacity={0.06}
            stroke={COLORS.purple}
            strokeWidth={2.5}
            strokeDasharray={400}
            strokeDashoffset={innerShellDraw}
          />

          {/* Internal circuit bus lines */}
          {[-50, -25, 0, 25, 50].map((lx, i) => (
            <line
              key={`cir-${i}`}
              x1={lx}
              y1={-80 + Math.abs(lx) * 0.4}
              x2={lx * 1.05}
              y2={75}
              stroke={COLORS.sky_blue}
              strokeWidth={1}
              opacity={circuitGlow * 0.5}
            />
          ))}
          {/* Horizontal bus bars */}
          <line
            x1={-70}
            y1={0}
            x2={70}
            y2={0}
            stroke={COLORS.sky_blue}
            strokeWidth={1}
            opacity={circuitGlow * 0.4}
          />
          <line
            x1={-60}
            y1={40}
            x2={60}
            y2={40}
            stroke={COLORS.sky_blue}
            strokeWidth={1}
            opacity={circuitGlow * 0.3}
          />
          <line
            x1={-50}
            y1={-40}
            x2={50}
            y2={-40}
            stroke={COLORS.sky_blue}
            strokeWidth={1}
            opacity={circuitGlow * 0.35}
          />

          {/* Tech nodes — pulsing, color-coded */}
          {/* Avionics computer */}
          <circle
            cx={0}
            cy={-60}
            r={10}
            fill={COLORS.sky_blue}
            fillOpacity={nodeFlicker * 0.4}
            stroke={COLORS.sky_blue}
            strokeWidth={2}
          />
          <circle
            cx={0}
            cy={-60}
            r={4}
            fill={COLORS.sky_blue}
            fillOpacity={nodeFlicker}
          />
          {/* Abort system */}
          <circle
            cx={-40}
            cy={-20}
            r={8}
            fill={COLORS.vibrant_red}
            fillOpacity={nodeFlicker * 0.35}
            stroke={COLORS.vibrant_red}
            strokeWidth={1.5}
          />
          <circle
            cx={-40}
            cy={-20}
            r={3}
            fill={COLORS.vibrant_red}
            fillOpacity={nodeFlicker}
          />
          {/* Life support */}
          <circle
            cx={40}
            cy={-20}
            r={8}
            fill={COLORS.green}
            fillOpacity={nodeFlicker * 0.35}
            stroke={COLORS.green}
            strokeWidth={1.5}
          />
          <circle
            cx={40}
            cy={-20}
            r={3}
            fill={COLORS.green}
            fillOpacity={nodeFlicker}
          />
          {/* Solar power */}
          <circle
            cx={0}
            cy={20}
            r={8}
            fill={COLORS.amber}
            fillOpacity={nodeFlicker * 0.35}
            stroke={COLORS.amber}
            strokeWidth={1.5}
          />
          <circle
            cx={0}
            cy={20}
            r={3}
            fill={COLORS.amber}
            fillOpacity={nodeFlicker}
          />
          {/* Central processor — larger */}
          <circle
            cx={0}
            cy={55}
            r={12}
            fill={COLORS.purple}
            fillOpacity={nodeFlicker * 0.3}
            stroke={COLORS.purple}
            strokeWidth={2}
          />
          <rect
            x={-5}
            y={50}
            width={10}
            height={10}
            fill={COLORS.purple}
            fillOpacity={nodeFlicker}
          />

          {/* Heat shield */}
          <rect
            x={-110}
            y={100}
            width={220}
            height={18}
            rx={9}
            fill={COLORS.brown}
            fillOpacity={0.25}
            stroke={COLORS.brown}
            strokeWidth={1.5}
          />
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <line
              key={`hs-${i}`}
              x1={-90 + i * 28}
              y1={104}
              x2={-86 + i * 28}
              y2={114}
              stroke={COLORS.brown}
              strokeWidth={1}
              opacity={0.12}
            />
          ))}
        </g>

        {/* ═══ CALLOUT LEADER LINES + LABELS ═══ */}
        {/* Avionics — top center → right */}
        <g opacity={callout1.opacity}>
          <line
            x1={550}
            y1={620}
            x2={780}
            y2={580}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
            opacity={0.4}
          />
          <circle
            cx={780}
            cy={580}
            r={5}
            fill={COLORS.sky_blue}
            fillOpacity={0.4}
          />
          <text
            x={796}
            y={575}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22}
            fontWeight={700}
            fill={COLORS.sky_blue}
          >
            GLASS COCKPIT
          </text>
          <text
            x={796}
            y={598}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18}
            fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Digital avionics
          </text>
        </g>

        {/* Abort system — left node → label */}
        <g opacity={callout2.opacity}>
          <line
            x1={500}
            y1={660}
            x2={170}
            y2={620}
            stroke={COLORS.vibrant_red}
            strokeWidth={1.5}
            opacity={0.4}
          />
          <circle
            cx={170}
            cy={620}
            r={5}
            fill={COLORS.vibrant_red}
            fillOpacity={0.4}
          />
          <text
            x={60}
            y={614}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22}
            fontWeight={700}
            fill={COLORS.vibrant_red}
          >
            AUTO ABORT
          </text>
          <text
            x={60}
            y={637}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18}
            fontWeight={400}
            fill={COLORS.cool_silver}
          >
            AI-driven safety
          </text>
        </g>

        {/* Life support — right node → label */}
        <g opacity={callout3.opacity}>
          <line
            x1={580}
            y1={660}
            x2={810}
            y2={660}
            stroke={COLORS.green}
            strokeWidth={1.5}
            opacity={0.4}
          />
          <circle
            cx={810}
            cy={660}
            r={5}
            fill={COLORS.green}
            fillOpacity={0.4}
          />
          <text
            x={826}
            y={655}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22}
            fontWeight={700}
            fill={COLORS.green}
          >
            LIFE SUPPORT
          </text>
          <text
            x={826}
            y={678}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18}
            fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Closed-loop recycling
          </text>
        </g>

        {/* Solar array — bottom → label */}
        <g opacity={callout4.opacity}>
          <line
            x1={540}
            y1={700}
            x2={200}
            y2={720}
            stroke={COLORS.amber}
            strokeWidth={1.5}
            opacity={0.4}
          />
          <circle
            cx={200}
            cy={720}
            r={5}
            fill={COLORS.amber}
            fillOpacity={0.4}
          />
          <text
            x={60}
            y={716}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22}
            fontWeight={700}
            fill={COLORS.amber}
          >
            SOLAR ARRAYS
          </text>
          <text
            x={60}
            y={739}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18}
            fontWeight={400}
            fill={COLORS.cool_silver}
          >
            11 kW power generation
          </text>
        </g>

        {/* ═══ COMPARISON COLUMNS ═══ */}
        {/* Center divider */}
        <line
          x1={540}
          y1={870}
          x2={540}
          y2={1470}
          stroke={COLORS.deep_black}
          strokeWidth={1.5}
          opacity={0.1}
          strokeDasharray={600}
          strokeDashoffset={dividerDraw}
        />

        {/* Left column — 1969 / Apollo */}
        <g
          opacity={colLeft.opacity}
          transform={`translate(0, ${colLeft.translateY})`}
        >
          <text
            x={280}
            y={910}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36}
            fontWeight={800}
            fill={COLORS.cool_silver}
          >
            1969
          </text>
          {[
            { text: 'Analog instruments', icon: 'dial' },
            { text: 'No abort computer', icon: 'x' },
            { text: 'Open-loop life support', icon: 'arrow' },
            { text: 'Film cameras', icon: 'film' },
          ].map((item, i) => (
            <g key={`col-l-${i}`}>
              <rect
                x={80}
                y={940 + i * 75}
                width={6}
                height={44}
                rx={3}
                fill={COLORS.cool_silver}
                opacity={0.35}
              />
              {/* Unique icon per row */}
              {item.icon === 'dial' && (
                <g transform={`translate(106, ${952 + i * 75})`}>
                  <circle
                    cx={0}
                    cy={10}
                    r={10}
                    fill="none"
                    stroke={COLORS.cool_silver}
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                  <line
                    x1={0}
                    y1={10}
                    x2={5}
                    y2={4}
                    stroke={COLORS.cool_silver}
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                </g>
              )}
              {item.icon === 'x' && (
                <g transform={`translate(106, ${952 + i * 75})`}>
                  <line
                    x1={-6}
                    y1={4}
                    x2={6}
                    y2={16}
                    stroke={COLORS.vibrant_red}
                    strokeWidth={2}
                    opacity={0.6}
                  />
                  <line
                    x1={6}
                    y1={4}
                    x2={-6}
                    y2={16}
                    stroke={COLORS.vibrant_red}
                    strokeWidth={2}
                    opacity={0.6}
                  />
                </g>
              )}
              {item.icon === 'arrow' && (
                <path
                  d={`M ${96},${960 + i * 75} L ${116},${960 + i * 75}`}
                  stroke={COLORS.cool_silver}
                  strokeWidth={1.5}
                  markerEnd="url(#arrow)"
                  opacity={0.4}
                />
              )}
              {item.icon === 'film' && (
                <g transform={`translate(100, ${950 + i * 75})`}>
                  <rect
                    x={0}
                    y={0}
                    width={16}
                    height={22}
                    rx={2}
                    fill="none"
                    stroke={COLORS.cool_silver}
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                  <rect
                    x={2}
                    y={3}
                    width={4}
                    height={4}
                    fill={COLORS.cool_silver}
                    opacity={0.3}
                  />
                  <rect
                    x={10}
                    y={3}
                    width={4}
                    height={4}
                    fill={COLORS.cool_silver}
                    opacity={0.3}
                  />
                </g>
              )}
              <text
                x={130}
                y={972 + i * 75}
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={26}
                fontWeight={500}
                fill={COLORS.cool_silver}
              >
                {item.text}
              </text>
            </g>
          ))}
        </g>

        {/* Right column — 2025 / Orion */}
        <g
          opacity={colRight.opacity}
          transform={`translate(0, ${colRight.translateY})`}
        >
          <text
            x={800}
            y={910}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36}
            fontWeight={800}
            fill={COLORS.purple}
          >
            2025
          </text>
          {[
            { text: 'Glass cockpit displays', icon: 'screen' },
            { text: 'Autonomous abort AI', icon: 'check' },
            { text: 'Closed-loop recycling', icon: 'cycle' },
            { text: 'HD + 4K cameras', icon: 'lens' },
          ].map((item, i) => (
            <g key={`col-r-${i}`}>
              <rect
                x={580}
                y={940 + i * 75}
                width={6}
                height={44}
                rx={3}
                fill={COLORS.purple}
              />
              {item.icon === 'screen' && (
                <g transform={`translate(604, ${950 + i * 75})`}>
                  <rect
                    x={0}
                    y={0}
                    width={18}
                    height={14}
                    rx={2}
                    fill="none"
                    stroke={COLORS.sky_blue}
                    strokeWidth={1.5}
                  />
                  <line
                    x1={9}
                    y1={14}
                    x2={9}
                    y2={20}
                    stroke={COLORS.sky_blue}
                    strokeWidth={1.5}
                  />
                  <line
                    x1={3}
                    y1={20}
                    x2={15}
                    y2={20}
                    stroke={COLORS.sky_blue}
                    strokeWidth={1.5}
                  />
                </g>
              )}
              {item.icon === 'check' && (
                <path
                  d={`M ${600},${962 + i * 75} L ${608},${970 + i * 75} L ${620},${954 + i * 75}`}
                  fill="none"
                  stroke={COLORS.green}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              )}
              {item.icon === 'cycle' && (
                <g transform={`translate(610, ${960 + i * 75})`}>
                  <circle
                    cx={0}
                    cy={0}
                    r={9}
                    fill="none"
                    stroke={COLORS.green}
                    strokeWidth={1.5}
                  />
                  <path
                    d="M 5,-7 L 9,-4 L 5,-1"
                    fill="none"
                    stroke={COLORS.green}
                    strokeWidth={1.5}
                  />
                </g>
              )}
              {item.icon === 'lens' && (
                <g transform={`translate(610, ${960 + i * 75})`}>
                  <circle
                    cx={0}
                    cy={0}
                    r={9}
                    fill="none"
                    stroke={COLORS.purple}
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={4}
                    fill={COLORS.purple}
                    fillOpacity={0.3}
                  />
                </g>
              )}
              <text
                x={632}
                y={972 + i * 75}
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={26}
                fontWeight={600}
                fill={COLORS.deep_black}
              >
                {item.text}
              </text>
            </g>
          ))}
        </g>

        {/* ── Bottom badge — ENGINEERING REVOLUTION ── */}
        <g
          opacity={bottomBadge.opacity}
          transform={`translate(540, ${1520 + bottomBadge.translateY + breathe})`}
        >
          <rect
            x={-220}
            y={-32}
            width={440}
            height={64}
            rx={32}
            fill={COLORS.purple}
            fillOpacity={0.06}
            stroke={COLORS.purple}
            strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}
          />
          {/* Gear icon inside badge */}
          <g transform="translate(-190, -4)">
            <circle
              cx={0}
              cy={0}
              r={10}
              fill="none"
              stroke={COLORS.purple}
              strokeWidth={2}
            />
            <circle cx={0} cy={0} r={4} fill={COLORS.purple} fillOpacity={0.3} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={`gear-${deg}`}
                  x1={Math.cos(rad) * 10}
                  y1={Math.sin(rad) * 10}
                  x2={Math.cos(rad) * 14}
                  y2={Math.sin(rad) * 14}
                  stroke={COLORS.purple}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
          <text
            x={10}
            y={10}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30}
            fontWeight={800}
            fill={COLORS.purple}
          >
            ENGINEERING REVOLUTION
          </text>
        </g>

        {/* ── Corner accents ── */}
        <CornerAccents color={COLORS.purple} opacity={0.4} />

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
          Same shape outside, completely new engineering inside
        </text>

        {/* ── Caption ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
