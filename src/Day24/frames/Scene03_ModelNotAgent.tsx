/**
 * Scene 03 — Model Not Agent
 * "Last day, we learned that a model alone is not an agent."
 * Shows MODEL box with arrow → and AGENT box with loop ↻.
 * Animated X mark on equals sign between them. RECAP chip.
 * Rich SVG visuals with premium styling.
 * Duration: 102 frames (3.4s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  ProcessorUnit, AIRobot, LoopArrow,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Constants ──────────────────────────────────────────────────────────────
const MODEL_CX = 300;
const AGENT_CX = 780;
const MAIN_CY = 700;
const BOX_W = 320;
const BOX_H = 360;

// ── Feature list items ─────────────────────────────────────────────────────
const MODEL_FEATURES = [
  { text: 'Single call', icon: '→' },
  { text: 'Input → Output', icon: '⤳' },
  { text: 'No memory', icon: '∅' },
];

const AGENT_FEATURES = [
  { text: 'Continuous loop', icon: '↻' },
  { text: 'Perceive → Act', icon: '⟲' },
  { text: 'Adapts & learns', icon: '✦' },
];

// ── Background pattern dots ────────────────────────────────────────────────
const PATTERN_DOTS = Array.from({ length: 36 }, (_, i) => ({
  x: 80 + (i % 6) * 180,
  y: 200 + Math.floor(i / 6) * 260,
  delay: i * 2,
}));

export const Scene03_ModelNotAgent: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const modelEnter = interpolate(frame, [8, 38], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const agentEnter = interpolate(frame, [16, 46], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const equalsEnter = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xEnter = interpolate(frame, [48, 62], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const featuresEnter = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });
  const bottomEnter = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  const modelSlide = interpolate(frame, [8, 38], [-80, 0], { extrapolateRight: 'clamp', easing: ease });
  const agentSlide = interpolate(frame, [16, 46], [80, 0], { extrapolateRight: 'clamp', easing: ease });
  const xScale = scaleAnim(frame, 48, 62, 0.3, 1);
  const loopDash = interpolate(frame, [20, 80], [400, 0], { extrapolateRight: 'clamp' });
  const pulse = 0.85 + Math.sin(frame * 0.12) * 0.15;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* ── Additional SVG defs ── */}
          <defs>
            <linearGradient id="modelGradS03" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8D0D4"/>
              <stop offset="100%" stopColor="#A0A8AC"/>
            </linearGradient>
            <linearGradient id="agentGradS03" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#1D4ED8"/>
            </linearGradient>
            <filter id="boxShadowS03">
              <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#0D0D0D" floodOpacity="0.18"/>
            </filter>
            <filter id="redStrikeS03">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feFlood floodColor="#EF4444" floodOpacity="0.5" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Background dot pattern ── */}
          {PATTERN_DOTS.map((d, i) => {
            const dotOp = interpolate(frame, [d.delay, d.delay + 20], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <circle key={`pd${i}`}
                cx={d.x} cy={d.y} r={3}
                fill={COLORS.electric_cyan} opacity={dotOp * 0.04}/>
            );
          })}

          {/* ── RECAP chip ── */}
          <g opacity={enter}>
            <rect x={80} y={60} width={192} height={52} rx={12}
              fill={COLORS.warm_blue}/>
            <text x={176} y={94} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={900}
              fill="white" letterSpacing="0.10em">RECAP</text>
          </g>

          {/* ── Title ── */}
          <text x={540} y={220} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={68} fontWeight={900}
            fill={COLORS.deep_black} opacity={enter} letterSpacing="-0.03em">
            Model ≠ Agent
          </text>
          <text x={540} y={280} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={COLORS.light_gray} opacity={enter * 0.7}>
            A critical distinction
          </text>

          {/* ── Horizontal divider ── */}
          <line x1={200} y1={320} x2={880} y2={320}
            stroke={COLORS.electric_cyan} strokeWidth={1.2} opacity={enter * 0.15}/>

          {/* ─── MODEL BOX (left) ─── */}
          <g opacity={modelEnter}
            transform={`translate(${modelSlide}, 0)`}>
            {/* Box shadow */}
            <rect x={MODEL_CX - BOX_W / 2} y={MAIN_CY - BOX_H / 2}
              width={BOX_W} height={BOX_H} rx={20}
              fill="url(#modelGradS03)" opacity={0.08} filter="url(#boxShadowS03)"/>
            {/* Box */}
            <rect x={MODEL_CX - BOX_W / 2} y={MAIN_CY - BOX_H / 2}
              width={BOX_W} height={BOX_H} rx={20}
              fill="#F9FAFB" stroke="#C8D0D4" strokeWidth={3}
              filter="url(#boxShadowS03)"/>
            {/* Inner border */}
            <rect x={MODEL_CX - BOX_W / 2 + 8} y={MAIN_CY - BOX_H / 2 + 8}
              width={BOX_W - 16} height={BOX_H - 16} rx={14}
              fill="none" stroke="#C8D0D4" strokeWidth={1} opacity={0.3}/>

            {/* Processor icon inside model box */}
            <ProcessorUnit cx={MODEL_CX} cy={MAIN_CY - 80}
              size={80} opacity={modelEnter} scale={1}
              variant="dormant" label="" frame={frame}/>

            {/* MODEL label */}
            <text x={MODEL_CX} y={MAIN_CY + 20} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="0.06em">MODEL</text>

            {/* Arrow: input → output */}
            <line x1={MODEL_CX - 50} y1={MAIN_CY + 60} x2={MODEL_CX + 50} y2={MAIN_CY + 60}
              stroke={COLORS.cool_silver} strokeWidth={3} strokeLinecap="round"/>
            <polygon points={`${MODEL_CX + 50},${MAIN_CY + 60} ${MODEL_CX + 38},${MAIN_CY + 52} ${MODEL_CX + 38},${MAIN_CY + 68}`}
              fill={COLORS.cool_silver}/>

            <text x={MODEL_CX} y={MAIN_CY + 95} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
              fill={COLORS.light_gray}>
              One direction
            </text>
          </g>

          {/* ─── AGENT BOX (right) ─── */}
          <g opacity={agentEnter}
            transform={`translate(${agentSlide}, 0)`}>
            {/* Box shadow */}
            <rect x={AGENT_CX - BOX_W / 2} y={MAIN_CY - BOX_H / 2}
              width={BOX_W} height={BOX_H} rx={20}
              fill="url(#agentGradS03)" opacity={0.1} filter="url(#boxShadowS03)"/>
            {/* Box */}
            <rect x={AGENT_CX - BOX_W / 2} y={MAIN_CY - BOX_H / 2}
              width={BOX_W} height={BOX_H} rx={20}
              fill="#F9FAFB" stroke={COLORS.warm_blue} strokeWidth={3}
              filter="url(#boxShadowS03)"/>
            {/* Inner border */}
            <rect x={AGENT_CX - BOX_W / 2 + 8} y={MAIN_CY - BOX_H / 2 + 8}
              width={BOX_W - 16} height={BOX_H - 16} rx={14}
              fill="none" stroke={COLORS.warm_blue} strokeWidth={1} opacity={0.25}/>

            {/* Robot icon */}
            <AIRobot cx={AGENT_CX - 90} cy={MAIN_CY - 170}
              scale={0.16 * agentEnter} opacity={agentEnter}
              coreGlow={pulse} eyeColor="#00E5FF"
              frame={frame} variant="active"/>

            {/* AGENT label */}
            <text x={AGENT_CX} y={MAIN_CY + 20} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={900}
              fill={COLORS.warm_blue} letterSpacing="0.06em">AGENT</text>

            {/* Loop arrow icon */}
            <LoopArrow cx={AGENT_CX} cy={MAIN_CY + 65} r={22}
              color={COLORS.warm_blue} strokeWidth={3}
              dashOffset={loopDash} opacity={agentEnter}
              showArrow={true} label=""/>

            <text x={AGENT_CX} y={MAIN_CY + 110} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
              fill={COLORS.warm_blue} opacity={0.7}>
              Continuous loop
            </text>
          </g>

          {/* ─── EQUALS SIGN + X MARK (center) ─── */}
          <g opacity={equalsEnter}>
            {/* Equals sign */}
            <line x1={500} y1={MAIN_CY - 12} x2={580} y2={MAIN_CY - 12}
              stroke={COLORS.deep_black} strokeWidth={5} strokeLinecap="round"/>
            <line x1={500} y1={MAIN_CY + 12} x2={580} y2={MAIN_CY + 12}
              stroke={COLORS.deep_black} strokeWidth={5} strokeLinecap="round"/>
          </g>

          {/* Big red X over equals */}
          <g opacity={xEnter}
            transform={`translate(540, ${MAIN_CY}) scale(${xScale})`}>
            <line x1={-30} y1={-30} x2={30} y2={30}
              stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round"
              filter="url(#redStrikeS03)"/>
            <line x1={30} y1={-30} x2={-30} y2={30}
              stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round"
              filter="url(#redStrikeS03)"/>
          </g>

          {/* ── Feature comparison rows ── */}
          {/* Model features (left) */}
          {MODEL_FEATURES.map((f, i) => {
            const fEnter = interpolate(frame, [42 + i * 6, 58 + i * 6], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`mf${i}`} opacity={fEnter * featuresEnter}>
                <text x={MODEL_CX - 20} y={930 + i * 50} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600}
                  fill={COLORS.deep_black}>
                  {f.icon}
                </text>
                <text x={MODEL_CX + 10} y={930 + i * 50} textAnchor="start"
                  fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600}
                  fill={COLORS.light_gray}>
                  {f.text}
                </text>
              </g>
            );
          })}

          {/* Agent features (right) */}
          {AGENT_FEATURES.map((f, i) => {
            const fEnter = interpolate(frame, [44 + i * 6, 60 + i * 6], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`af${i}`} opacity={fEnter * featuresEnter}>
                <text x={AGENT_CX - 20} y={930 + i * 50} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600}
                  fill={COLORS.warm_blue}>
                  {f.icon}
                </text>
                <text x={AGENT_CX + 10} y={930 + i * 50} textAnchor="start"
                  fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600}
                  fill={COLORS.warm_blue} opacity={0.8}>
                  {f.text}
                </text>
              </g>
            );
          })}

          {/* ── Bottom insight card ── */}
          <g opacity={bottomEnter}>
            {/* Card bg */}
            <rect x={100} y={1140} width={880} height={220} rx={20}
              fill="#F9FAFB" stroke={COLORS.electric_cyan} strokeWidth={2}
              filter="url(#boxShadowS03)"/>
            {/* Left accent */}
            <rect x={100} y={1140} width={8} height={220} rx={4}
              fill={COLORS.electric_cyan}/>
            {/* Key insight label */}
            <text x={160} y={1195} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={800}
              fill={COLORS.electric_cyan} letterSpacing="0.12em">KEY INSIGHT</text>
            {/* Insight text */}
            <text x={160} y={1240} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700}
              fill={COLORS.deep_black}>
              A model processes.
            </text>
            <text x={160} y={1280} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700}
              fill={COLORS.warm_blue}>
              An agent loops.
            </text>
            {/* Decorative dots */}
            {[0, 1, 2].map(i => (
              <circle key={i} cx={880 + i * 24} cy={1320} r={4}
                fill={COLORS.electric_cyan} opacity={0.3 + i * 0.15}/>
            ))}
          </g>

          {/* ── Horizontal separator ── */}
          <line x1={140} y1={1100} x2={940} y2={1100}
            stroke={COLORS.warm_blue} strokeWidth={1} opacity={featuresEnter * 0.12}
            strokeDasharray="8 6"/>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="Last day, we learned that a model alone is not an agent."
          opacity={captionEnter}
          highlightWords={['model', 'not an agent']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
