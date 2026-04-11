/**
 * Scene 14 — Code Tool
 * "A code tool gives it precise calculation."
 * Paper background. Calculator / code execution icon.
 * Duration: 74 frames (~2.5s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene14_CodeTool: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn    = interpolate(frame, [0, 10], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const iconOp    = interpolate(frame, [3, 18], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const iconScale = interpolate(frame, [3, 18], [0.5, 1], { easing: ease, extrapolateRight: 'clamp' });
  const codeOp    = interpolate(frame, [15, 30], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const resultOp  = interpolate(frame, [30, 45], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const labelOp   = interpolate(frame, [40, 55], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Header */}
        <text x={540} y={180} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.vibrant_green} letterSpacing="0.2em" opacity={fadeIn * 0.7}>
          CODE TOOL
        </text>

        {/* Code brackets icon */}
        <g opacity={iconOp} transform={`translate(540, 480) scale(${iconScale})`}>
          {/* Terminal / code window */}
          <rect x={-140} y={-100} width={280} height={200} rx={16}
            fill={COLORS.deep_black} opacity={0.9} />
          <rect x={-140} y={-100} width={280} height={200} rx={16}
            fill="none" stroke={COLORS.vibrant_green} strokeWidth={3} />
          {/* Title bar dots */}
          <circle cx={-110} cy={-80} r={6} fill="#EF4444" opacity={0.7} />
          <circle cx={-90} cy={-80} r={6} fill="#F59E0B" opacity={0.7} />
          <circle cx={-70} cy={-80} r={6} fill="#22C55E" opacity={0.7} />
          {/* Code lines */}
          <text x={-110} y={-30} fontFamily="monospace" fontSize={22} fontWeight={600}
            fill={COLORS.vibrant_green} opacity={0.8}>{'> 2 + 2'}</text>
          <text x={-110} y={10} fontFamily="monospace" fontSize={22} fontWeight={700}
            fill={COLORS.electric_cyan}>{'  4'}</text>
          <text x={-110} y={50} fontFamily="monospace" fontSize={22} fontWeight={600}
            fill={COLORS.vibrant_green} opacity={0.8}>{'> Math.sqrt(144)'}</text>
          <text x={-110} y={80} fontFamily="monospace" fontSize={22} fontWeight={700}
            fill={COLORS.electric_cyan}>{'  12'}</text>
        </g>

        {/* Arrow to result */}
        <g opacity={codeOp}>
          <line x1={540} y1={600} x2={540} y2={680} stroke={COLORS.vibrant_green} strokeWidth={3} />
          <polygon points="528,670 540,695 552,670" fill={COLORS.vibrant_green} />
        </g>

        {/* Result card */}
        <g opacity={resultOp} transform="translate(540, 770)">
          <rect x={-200} y={-45} width={400} height={90} rx={14}
            fill="none" stroke={COLORS.vibrant_green} strokeWidth={3} />
          <text x={0} y={15} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={800}
            fill={COLORS.deep_black}>PRECISE CALCULATION</text>
        </g>

        {/* Bottom label */}
        <text x={540} y={940} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={38} fontWeight={700}
          fill={COLORS.vibrant_green} opacity={labelOp}>
          No hallucination. Exact answers.
        </text>

        {/* Decorative math symbols */}
        {['∑', 'π', '∫', '√', '∞'].map((sym, i) => {
          const symOp = interpolate(frame, [20 + i * 6, 35 + i * 6], [0, 0.15],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <text key={sym} x={120 + i * 210} y={1200} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={300}
              fill={COLORS.vibrant_green} opacity={symOp}>
              {sym}
            </text>
          );
        })}

        <rect x={160} y={1700} width={760} height={6} rx={3} fill={COLORS.vibrant_green} opacity={fadeIn * 0.2} />
      </svg>

      <CaptionBar text="A code tool gives it precise calculation."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['code', 'tool', 'precise', 'calculation']} />
    </AbsoluteFill>
  );
};
