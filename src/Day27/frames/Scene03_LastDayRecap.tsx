/**
 * Scene 03 — Last Day Recap
 * "Last day, we learned what an observation is."
 * Paper background, recap card with observation icon.
 * Duration: 90 frames (~3s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene03_LastDayRecap: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn   = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const cardSlide = interpolate(frame, [5, 25], [40, 0], { easing: ease, extrapolateRight: 'clamp' });
  const iconScale = interpolate(frame, [10, 28], [0.5, 1], { easing: ease, extrapolateRight: 'clamp' });
  const lineW     = interpolate(frame, [15, 35], [0, 600], { easing: ease, extrapolateRight: 'clamp' });
  const textOp    = interpolate(frame, [18, 30], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const arrowOp   = interpolate(frame, [25, 40], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const loopDash  = frame * 0.8;

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Header */}
        <text x={540} y={200} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.25em" opacity={fadeIn * 0.6}>
          PREVIOUSLY · DAY 26
        </text>
        <line x1={540 - lineW / 2} y1={230} x2={540 + lineW / 2} y2={230}
          stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round" opacity={fadeIn * 0.4} />

        {/* Eye / observation icon */}
        <g transform={`translate(540, 520) scale(${iconScale})`} opacity={fadeIn}>
          <ellipse cx={0} cy={0} rx={120} ry={70} fill="none" stroke={COLORS.warm_blue} strokeWidth={4} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.warm_blue} strokeWidth={3} />
          <circle cx={0} cy={0} r={18} fill={COLORS.warm_blue} opacity={0.6} />
          <circle cx={8} cy={-8} r={6} fill="white" opacity={0.7} />
          {/* Rays */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <line key={i} x1={Math.cos(angle) * 85} y1={Math.sin(angle) * 55}
                x2={Math.cos(angle) * 105} y2={Math.sin(angle) * 68}
                stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
            );
          })}
        </g>

        {/* Label */}
        <text x={540} y={680} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={800}
          fill={COLORS.deep_black} opacity={textOp} transform={`translate(0, ${cardSlide})`}>
          OBSERVATIONS
        </text>
        <text x={540} y={740} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={400}
          fill={COLORS.deep_black} opacity={textOp * 0.6} transform={`translate(0, ${cardSlide})`}>
          The world's reply to the agent's action
        </text>

        {/* Loop diagram recap */}
        <g opacity={arrowOp} transform="translate(540, 1000)">
          <circle cx={0} cy={0} r={160} fill="none" stroke={COLORS.warm_blue} strokeWidth={2}
            strokeDasharray="12,6" strokeDashoffset={loopDash} opacity={0.3} />
          {['PERCEIVE', 'THINK', 'ACT', 'OBSERVE'].map((label, i) => {
            const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
            const lx = Math.cos(angle) * 160;
            const ly = Math.sin(angle) * 160;
            const colors = ['#22C55E', '#3B82F6', '#F59E0B', '#A78BFA'];
            return (
              <g key={label}>
                <circle cx={lx} cy={ly} r={28} fill="none" stroke={colors[i]} strokeWidth={2.5} />
                <circle cx={lx} cy={ly} r={10} fill={colors[i]} opacity={0.7} />
                <text x={lx} y={ly + 50} textAnchor="middle" fontFamily="'Inter', sans-serif"
                  fontSize={20} fontWeight={700} fill={colors[i]} letterSpacing="0.04em">
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Arrow pointing to "Today" */}
        <g opacity={arrowOp}>
          <line x1={540} y1={1250} x2={540} y2={1350} stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" />
          <polygon points="525,1340 540,1370 555,1340" fill={COLORS.warm_blue} />
        </g>

        {/* Today label */}
        <text x={540} y={1440} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={700}
          fill={COLORS.warm_blue} opacity={arrowOp} letterSpacing="0.15em">
          TODAY → TOOLS
        </text>

        {/* Decorative dots */}
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={180 + i * 144} cy={1560} r={4} fill={COLORS.warm_blue} opacity={arrowOp * 0.3} />
        ))}
      </svg>

      <CaptionBar text="Last day, we learned what an observation is."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['observation']} />
    </AbsoluteFill>
  );
};
