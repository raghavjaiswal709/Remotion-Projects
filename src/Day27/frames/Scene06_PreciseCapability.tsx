/**
 * Scene 06 — Precise Capability
 * "Each of these is a tool, a precise bounded capability the agent can choose to use."
 * Paper background, bounded box diagram with agent choosing from toolbox.
 * Duration: 187 frames (~6.2s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const toolSlots = [
  { label: 'search()', x: 160, color: COLORS.warm_blue },
  { label: 'readFile()', x: 370, color: COLORS.vibrant_green },
  { label: 'sendEmail()', x: 600, color: COLORS.amber },
  { label: 'sqlQuery()', x: 840, color: COLORS.purple },
];

export const Scene06_PreciseCapability: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn   = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const headerOp = interpolate(frame, [5, 20], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const divW     = interpolate(frame, [8, 25], [0, 700], { easing: ease, extrapolateRight: 'clamp' });
  const agentOp  = interpolate(frame, [15, 30], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const slotAnims = toolSlots.map((_, i) => ({
    opacity: interpolate(frame, [30 + i * 15, 48 + i * 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    slideY:  interpolate(frame, [30 + i * 15, 48 + i * 15], [25, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  }));

  const boundaryOp = interpolate(frame, [85, 105], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const choiceArrow = interpolate(frame, [110, 140], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const chooseLabel = interpolate(frame, [130, 150], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const pulseIdx = Math.floor((frame - 110) / 20) % 4;
  const pulseOp  = frame > 110 ? 0.6 + Math.sin(frame * 0.15) * 0.3 : 0;

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Header */}
        <text x={540} y={190} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.2em" opacity={headerOp * 0.7}>
          PRECISE · BOUNDED · CAPABILITY
        </text>
        <line x1={540 - divW / 2} y1={220} x2={540 + divW / 2} y2={220}
          stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round" opacity={headerOp * 0.4} />

        {/* Agent figure */}
        <g opacity={agentOp} transform="translate(540, 450)">
          <rect x={-70} y={-80} width={140} height={110} rx={16} fill="none" stroke={COLORS.deep_black} strokeWidth={3} />
          <circle cx={-22} cy={-40} r={12} fill="none" stroke={COLORS.electric_cyan} strokeWidth={2} />
          <circle cx={-22} cy={-40} r={5} fill={COLORS.electric_cyan} />
          <circle cx={22} cy={-40} r={12} fill="none" stroke={COLORS.electric_cyan} strokeWidth={2} />
          <circle cx={22} cy={-40} r={5} fill={COLORS.electric_cyan} />
          <line x1={-15} y1={-10} x2={15} y2={-10} stroke={COLORS.deep_black} strokeWidth={2} strokeLinecap="round" />
          <rect x={-50} y={38} width={100} height={60} rx={10} fill="none" stroke={COLORS.deep_black} strokeWidth={2} />
          <text x={0} y={130} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
            fill={COLORS.deep_black}>AGENT</text>
        </g>

        {/* Choice arrow */}
        <g opacity={choiceArrow}>
          <line x1={540} y1={620} x2={540} y2={720} stroke={COLORS.warm_blue} strokeWidth={3} />
          <polygon points="525,710 540,740 555,710" fill={COLORS.warm_blue} />
          <text x={540} y={680} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={600}
            fill={COLORS.warm_blue} opacity={0.6}>chooses</text>
        </g>

        {/* Toolbox boundary */}
        <rect x={80} y={760} width={920} height={360} rx={24} fill="none"
          stroke={COLORS.warm_blue} strokeWidth={3} strokeDasharray="12,6" opacity={boundaryOp * 0.5} />
        <text x={540} y={800} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.15em" opacity={boundaryOp * 0.6}>
          TOOLBOX — BOUNDED CAPABILITIES
        </text>

        {/* Tool slots */}
        {toolSlots.map((slot, i) => (
          <g key={slot.label} opacity={slotAnims[i].opacity}
            transform={`translate(0, ${slotAnims[i].slideY})`}>
            {/* Card */}
            <rect x={slot.x - 100} y={850} width={200} height={220} rx={14}
              fill="none" stroke={slot.color} strokeWidth={2.5}
              opacity={pulseIdx === i && frame > 110 ? pulseOp + 0.4 : 0.8} />
            <rect x={slot.x - 100} y={850} width={200} height={220} rx={14}
              fill={slot.color} opacity={0.06} />
            {/* Function icon */}
            <circle cx={slot.x} cy={920} r={30} fill="none" stroke={slot.color} strokeWidth={2} />
            <text x={slot.x} y={930} textAnchor="middle" fontFamily="monospace" fontSize={24} fontWeight={700}
              fill={slot.color}>f</text>
            {/* Label */}
            <text x={slot.x} y={1010} textAnchor="middle" fontFamily="monospace" fontSize={20} fontWeight={600}
              fill={COLORS.deep_black}>{slot.label}</text>
            {/* Boundary indicator */}
            <rect x={slot.x - 80} y={1030} width={160} height={24} rx={4}
              fill="none" stroke={slot.color} strokeWidth={1} opacity={0.4} />
            <text x={slot.x} y={1047} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={12} fontWeight={500}
              fill={slot.color} opacity={0.6}>BOUNDED</text>
          </g>
        ))}

        {/* Choose label */}
        <text x={540} y={1240} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={38} fontWeight={700}
          fill={COLORS.deep_black} opacity={chooseLabel}>
          The agent can choose to use any tool.
        </text>

        {/* Bottom accent dots */}
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={180 + i * 80} cy={1700} r={3} fill={COLORS.warm_blue} opacity={fadeIn * 0.25} />
        ))}
      </svg>

      <CaptionBar text="Each of these is a tool, a precise bounded capability the agent can choose to use."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['tool', 'precise', 'bounded', 'capability']} />
    </AbsoluteFill>
  );
};
