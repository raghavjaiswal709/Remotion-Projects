/**
 * Scene 12 — Tool's Job: Execution
 * "The tool's job is execution, doing the actual work in the real world."
 * Paper background. Wrench icon + "real world" interaction visuals.
 * Duration: 162 frames (~5.4s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const worldItems = [
  { label: 'APIs', icon: '🌐', x: 200, y: 1000 },
  { label: 'Files', icon: '📁', x: 440, y: 1000 },
  { label: 'Databases', icon: '🗄️', x: 680, y: 1000 },
  { label: 'Services', icon: '⚙️', x: 920, y: 1000 },
];

export const Scene12_ToolExecution: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn   = interpolate(frame, [0, 12], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const headerOp = interpolate(frame, [5, 18], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const divW     = interpolate(frame, [8, 24], [0, 700], { easing: ease, extrapolateRight: 'clamp' });
  const toolOp   = interpolate(frame, [12, 30], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const toolScale = interpolate(frame, [12, 30], [0.6, 1], { easing: ease, extrapolateRight: 'clamp' });
  const execOp   = interpolate(frame, [28, 44], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const worldOp  = interpolate(frame, [50, 70], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const itemAnims = worldItems.map((_, i) => ({
    opacity: interpolate(frame, [60 + i * 14, 78 + i * 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    slideY: interpolate(frame, [60 + i * 14, 78 + i * 14], [25, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  }));

  const arrowAnims = worldItems.map((_, i) => (
    interpolate(frame, [80 + i * 10, 100 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  ));

  const gearSpin = frame * 0.6;

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Header */}
        <text x={540} y={190} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.2em" opacity={headerOp * 0.7}>
          THE TOOL'S JOB
        </text>
        <line x1={540 - divW / 2} y1={220} x2={540 + divW / 2} y2={220}
          stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round" opacity={headerOp * 0.4} />

        {/* Large tool icon */}
        <g opacity={toolOp} transform={`translate(540, 470) scale(${toolScale})`}>
          {/* Gear teeth */}
          {Array.from({ length: 10 }, (_, i) => {
            const angle = (i / 10) * Math.PI * 2 + (gearSpin * Math.PI / 180);
            return (
              <line key={i} x1={Math.cos(angle) * 90} y1={Math.sin(angle) * 90}
                x2={Math.cos(angle) * 120} y2={Math.sin(angle) * 120}
                stroke={COLORS.amber} strokeWidth={10} strokeLinecap="round" opacity={0.5} />
            );
          })}
          <circle cx={0} cy={0} r={90} fill="none" stroke={COLORS.amber} strokeWidth={4} />
          <circle cx={0} cy={0} r={60} fill="none" stroke={COLORS.amber} strokeWidth={2} opacity={0.4} />
          {/* Wrench inside */}
          <line x1={-20} y1={-25} x2={20} y2={25} stroke={COLORS.deep_black} strokeWidth={6} strokeLinecap="round" />
          <circle cx={24} cy={28} r={14} fill="none" stroke={COLORS.deep_black} strokeWidth={3} />
        </g>

        {/* EXECUTION label */}
        <text x={540} y={650} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={900}
          fill={COLORS.deep_black} opacity={execOp}>EXECUTION</text>
        <text x={540} y={710} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500}
          fill={COLORS.warm_blue} opacity={execOp * 0.7}>
          Doing the actual work in the real world
        </text>

        {/* Arrow down to real world */}
        <g opacity={worldOp}>
          <line x1={540} y1={750} x2={540} y2={850} stroke={COLORS.amber} strokeWidth={3} strokeDasharray="8,4" />
          <polygon points="525,840 540,870 555,840" fill={COLORS.amber} />
        </g>

        {/* "REAL WORLD" zone */}
        <rect x={80} y={900} width={920} height={300} rx={20}
          fill="none" stroke={COLORS.amber} strokeWidth={2.5} strokeDasharray="12,6" opacity={worldOp * 0.4} />
        <text x={540} y={940} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={COLORS.amber} letterSpacing="0.15em" opacity={worldOp * 0.5}>
          THE REAL WORLD
        </text>

        {/* World items */}
        {worldItems.map((item, i) => (
          <g key={item.label} opacity={itemAnims[i].opacity}
            transform={`translate(0, ${itemAnims[i].slideY})`}>
            <circle cx={item.x} cy={item.y} r={40} fill="none" stroke={COLORS.amber} strokeWidth={2} opacity={0.6} />
            <text x={item.x} y={item.y + 8} textAnchor="middle" fontSize={32}>{item.icon}</text>
            <text x={item.x} y={item.y + 65} textAnchor="middle" fontFamily="'Inter', sans-serif"
              fontSize={22} fontWeight={600} fill={COLORS.deep_black}>{item.label}</text>
          </g>
        ))}

        {/* Connection arrows from tool to items */}
        {worldItems.map((item, i) => (
          <line key={`arr-${i}`} x1={540} y1={870} x2={item.x} y2={item.y - 45}
            stroke={COLORS.amber} strokeWidth={1.5} strokeDasharray="4,4" opacity={arrowAnims[i] * 0.4} />
        ))}

        {/* Bottom decorative dots */}
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={140 + i * 72} cy={1700} r={3} fill={COLORS.warm_blue} opacity={fadeIn * 0.2} />
        ))}
      </svg>

      <CaptionBar text="The tool's job is execution, doing the actual work in the real world."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['execution', 'actual', 'real', 'world']} />
    </AbsoluteFill>
  );
};
