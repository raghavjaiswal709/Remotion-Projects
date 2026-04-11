/**
 * Scene 04 — Tool Defined
 * "A tool is a named callable function that the agent can invoke."
 * Paper background. Central wrench/function icon. Big definition text.
 * Duration: 134 frames (~4.5s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene04_ToolDefined: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn     = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const iconScale  = interpolate(frame, [5, 28], [0.3, 1], { easing: ease, extrapolateRight: 'clamp' });
  const labelOp    = interpolate(frame, [14, 28], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const defLine1   = interpolate(frame, [20, 34], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const defLine2   = interpolate(frame, [28, 42], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const defLine3   = interpolate(frame, [36, 50], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const bracketOp  = interpolate(frame, [10, 22], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const gearSpin   = frame * 0.8;
  const divW       = interpolate(frame, [12, 30], [0, 700], { easing: ease, extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Corner brackets */}
        <path d="M 80,80 L 80,180 M 80,80 L 180,80" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={bracketOp * 0.4} />
        <path d="M 1000,80 L 1000,180 M 1000,80 L 900,80" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={bracketOp * 0.4} />

        {/* Section header */}
        <text x={540} y={200} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.25em" opacity={fadeIn * 0.7}>
          DEFINITION
        </text>
        <line x1={540 - divW / 2} y1={230} x2={540 + divW / 2} y2={230}
          stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round" opacity={0.4} />

        {/* Large gear/tool icon */}
        <g transform={`translate(540, 520) scale(${iconScale})`} opacity={fadeIn}>
          {/* Outer gear teeth */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2 + (gearSpin * Math.PI / 180);
            const inner = 80;
            const outer = 110;
            return (
              <line key={i} x1={Math.cos(angle) * inner} y1={Math.sin(angle) * inner}
                x2={Math.cos(angle) * outer} y2={Math.sin(angle) * outer}
                stroke={COLORS.warm_blue} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
            );
          })}
          {/* Gear body */}
          <circle cx={0} cy={0} r={80} fill="none" stroke={COLORS.warm_blue} strokeWidth={4} />
          <circle cx={0} cy={0} r={55} fill="none" stroke={COLORS.warm_blue} strokeWidth={2} opacity={0.4} />
          {/* Function symbol f(x) */}
          <text x={0} y={18} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={900}
            fill={COLORS.deep_black} letterSpacing="-0.02em">
            f(x)
          </text>
        </g>

        {/* Definition lines */}
        <text x={540} y={730} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={800}
          fill={COLORS.deep_black} opacity={labelOp}>
          A TOOL is a
        </text>
        <text x={540} y={810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={800}
          fill={COLORS.warm_blue} opacity={defLine1}>
          named callable function
        </text>
        <text x={540} y={890} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={42} fontWeight={600}
          fill={COLORS.deep_black} opacity={defLine2}>
          that the agent
        </text>
        <text x={540} y={960} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={800}
          fill={COLORS.warm_blue} opacity={defLine3}>
          can invoke.
        </text>

        {/* Visual: Agent → Tool arrow */}
        <g opacity={defLine3} transform="translate(540, 1180)">
          {/* Agent box */}
          <rect x={-300} y={-50} width={180} height={100} rx={14} fill="none" stroke={COLORS.deep_black} strokeWidth={3} />
          <text x={-210} y={12} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
            fill={COLORS.deep_black}>AGENT</text>

          {/* Arrow */}
          <line x1={-110} y1={0} x2={100} y2={0} stroke={COLORS.warm_blue} strokeWidth={3} strokeDasharray="8,4" />
          <polygon points="95,-10 115,0 95,10" fill={COLORS.warm_blue} />
          <text x={-5} y={-20} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={COLORS.warm_blue} opacity={0.7}>invokes</text>

          {/* Tool box */}
          <rect x={120} y={-50} width={180} height={100} rx={14} fill="none" stroke={COLORS.warm_blue} strokeWidth={3} />
          <text x={210} y={12} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
            fill={COLORS.warm_blue}>TOOL</text>
        </g>

        {/* Decorative code bracket */}
        <g opacity={bracketOp * 0.3}>
          <text x={120} y={1440} fontFamily="monospace" fontSize={200} fontWeight={300} fill={COLORS.warm_blue} opacity={0.15}>{'{'}</text>
          <text x={880} y={1440} fontFamily="monospace" fontSize={200} fontWeight={300} fill={COLORS.warm_blue} opacity={0.15}>{'}'}</text>
        </g>

        {/* Bottom accent */}
        <rect x={160} y={1700} width={760} height={6} rx={3} fill={COLORS.warm_blue} opacity={fadeIn * 0.2} />
      </svg>

      <CaptionBar text="A tool is a named callable function that the agent can invoke."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['tool', 'function', 'invoke']} />
    </AbsoluteFill>
  );
};
