/**
 * Scene 16 — Key Takeaway
 * "Tools are the agent's hands."
 * Paper background. Large bold typography + hand/tool visual.
 * Duration: 120 frames (~4s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene16_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn    = interpolate(frame, [0, 14], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const divW      = interpolate(frame, [8, 22], [0, 760], { easing: ease, extrapolateRight: 'clamp' });
  const line1Op   = interpolate(frame, [10, 24], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const line2Op   = interpolate(frame, [18, 32], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const line3Op   = interpolate(frame, [26, 40], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const handsOp   = interpolate(frame, [35, 55], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const handsScale = interpolate(frame, [35, 55], [0.7, 1], { easing: ease, extrapolateRight: 'clamp' });
  const dotEnter  = interpolate(frame, [6, 16], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const toolIcons = [
    { emoji: '🔍', x: 240, color: COLORS.warm_blue },
    { emoji: '📄', x: 400, color: COLORS.vibrant_green },
    { emoji: '✉️', x: 540, color: COLORS.amber },
    { emoji: '🗄️', x: 680, color: COLORS.purple },
    { emoji: '🌐', x: 840, color: COLORS.electric_cyan },
  ];

  const iconAnims = toolIcons.map((_, i) => (
    interpolate(frame, [55 + i * 8, 70 + i * 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  ));

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Corner dots */}
        <circle cx={100} cy={100} r={8} fill={COLORS.warm_blue} opacity={dotEnter * 0.4} />
        <circle cx={980} cy={100} r={8} fill={COLORS.warm_blue} opacity={dotEnter * 0.4} />
        <circle cx={100} cy={1820} r={8} fill={COLORS.warm_blue} opacity={dotEnter * 0.4} />
        <circle cx={980} cy={1820} r={8} fill={COLORS.warm_blue} opacity={dotEnter * 0.4} />

        {/* Section label */}
        <text x={540} y={220} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.25em" opacity={fadeIn * 0.7}>
          KEY TAKEAWAY
        </text>
        <line x1={540 - divW / 2} y1={260} x2={540 + divW / 2} y2={260}
          stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
        <text x={540} y={310} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400}
          fill={COLORS.deep_black} letterSpacing="0.15em" opacity={fadeIn * 0.5}>
          DAY 27 · TOOLS
        </text>

        {/* Takeaway lines */}
        <text x={540} y={500} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={800}
          fill={COLORS.deep_black} opacity={line1Op}>
          Tools are
        </text>
        <text x={540} y={590} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={800}
          fill={COLORS.warm_blue} opacity={line2Op}>
          the agent's hands.
        </text>
        <text x={540} y={700} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={500}
          fill={COLORS.deep_black} opacity={line3Op * 0.7}>
          They let the agent act in the real world.
        </text>

        {/* Hand + wrench visual */}
        <g opacity={handsOp} transform={`translate(540, 900) scale(${handsScale})`}>
          {/* Open hand outline */}
          <path d="M -60,40 L -40,-20 L -20,-50 L 0,-60 L 20,-50 L 40,-30 L 60,0 L 70,40 L 50,80 L -50,80 Z"
            fill="none" stroke={COLORS.deep_black} strokeWidth={3} strokeLinejoin="round" />
          {/* Wrench in hand */}
          <line x1={-10} y1={-20} x2={30} y2={-60} stroke={COLORS.warm_blue} strokeWidth={5} strokeLinecap="round" />
          <circle cx={35} cy={-65} r={14} fill="none" stroke={COLORS.warm_blue} strokeWidth={3} />
          {/* Glowing effect */}
          <circle cx={0} cy={10} r={50} fill="none" stroke={COLORS.warm_blue} strokeWidth={1.5} opacity={0.2}
            strokeDasharray="6,4" />
        </g>

        {/* Tool icons row */}
        {toolIcons.map((tool, i) => (
          <g key={i} opacity={iconAnims[i]}>
            <circle cx={tool.x} cy={1100} r={35} fill="none" stroke={tool.color} strokeWidth={2} opacity={0.5} />
            <text x={tool.x} y={1110} textAnchor="middle" fontSize={32}>{tool.emoji}</text>
          </g>
        ))}

        {/* Bottom accent bar */}
        <rect x={160} y={1700} width={760} height={6} rx={3} fill={COLORS.warm_blue} opacity={dotEnter * 0.25} />
      </svg>

      <CaptionBar text="Tools are the agent's hands. They let the agent act in the real world."
        opacity={interpolate(frame, [4, 12], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['Tools', 'hands', 'real', 'world']} />
    </AbsoluteFill>
  );
};
