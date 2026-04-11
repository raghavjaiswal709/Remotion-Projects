/**
 * Scene 13 — Search Tool
 * "A search tool connects the agent to current information."
 * Paper background. Magnifying glass → information cards visualization.
 * Duration: 89 frames (~3s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene13_SearchTool: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn    = interpolate(frame, [0, 12], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const iconOp    = interpolate(frame, [5, 22], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const iconScale = interpolate(frame, [5, 22], [0.5, 1], { easing: ease, extrapolateRight: 'clamp' });
  const rayOp     = interpolate(frame, [20, 38], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const cardOps   = Array.from({ length: 3 }, (_, i) => (
    interpolate(frame, [35 + i * 10, 50 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  ));
  const labelOp   = interpolate(frame, [50, 65], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const connectLine = interpolate(frame, [25, 50], [0, 400], { easing: ease, extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Header */}
        <text x={540} y={180} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.2em" opacity={fadeIn * 0.7}>
          SEARCH TOOL
        </text>

        {/* Large magnifying glass */}
        <g opacity={iconOp} transform={`translate(300, 540) scale(${iconScale})`}>
          <circle cx={0} cy={-20} r={100} fill="none" stroke={COLORS.warm_blue} strokeWidth={5} />
          <circle cx={0} cy={-20} r={70} fill="none" stroke={COLORS.warm_blue} strokeWidth={2} opacity={0.3} />
          <line x1={70} y1={50} x2={130} y2={110} stroke={COLORS.warm_blue} strokeWidth={8} strokeLinecap="round" />
          {/* Lens glare */}
          <ellipse cx={-25} cy={-45} rx={20} ry={12} fill="white" opacity={0.15} transform="rotate(-30, -25, -45)" />
        </g>

        {/* Connection line */}
        <line x1={420} y1={520} x2={420 + connectLine} y2={520}
          stroke={COLORS.warm_blue} strokeWidth={2} strokeDasharray="8,4" opacity={rayOp * 0.5} />

        {/* Information cards */}
        {['Latest News', 'Real-time Data', 'Current Facts'].map((card, i) => (
          <g key={card} opacity={cardOps[i]} transform={`translate(760, ${400 + i * 130})`}>
            <rect x={-130} y={-40} width={260} height={80} rx={12}
              fill="none" stroke={COLORS.vibrant_green} strokeWidth={2.5} />
            <rect x={-130} y={-40} width={260} height={80} rx={12}
              fill={COLORS.vibrant_green} opacity={0.05} />
            <circle cx={-95} cy={0} r={16} fill={COLORS.vibrant_green} opacity={0.3} />
            <text x={-95} y={6} textAnchor="middle" fontSize={18}>📰</text>
            <text x={10} y={8} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
              fill={COLORS.deep_black}>{card}</text>
          </g>
        ))}

        {/* Agent label */}
        <g opacity={fadeIn} transform="translate(300, 760)">
          <rect x={-60} y={-25} width={120} height={50} rx={10}
            fill="none" stroke={COLORS.deep_black} strokeWidth={2} />
          <text x={0} y={8} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={COLORS.deep_black}>AGENT</text>
        </g>

        {/* Bottom label */}
        <text x={540} y={920} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={700}
          fill={COLORS.deep_black} opacity={labelOp}>
          Connects to current information
        </text>

        {/* Decorative signal waves */}
        {Array.from({ length: 3 }, (_, i) => (
          <circle key={i} cx={300} cy={520} r={180 + i * 50}
            fill="none" stroke={COLORS.warm_blue} strokeWidth={1}
            opacity={rayOp * (0.2 - i * 0.05)} strokeDasharray="6,8" />
        ))}

        <rect x={160} y={1700} width={760} height={6} rx={3} fill={COLORS.warm_blue} opacity={fadeIn * 0.2} />
      </svg>

      <CaptionBar text="A search tool connects the agent to current information."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['search', 'tool', 'current', 'information']} />
    </AbsoluteFill>
  );
};
