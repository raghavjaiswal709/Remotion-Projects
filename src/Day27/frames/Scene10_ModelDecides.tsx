/**
 * Scene 10 — Model Decides, Tool Does
 * "The model decides, the tool does."
 * Paper background. Split screen: MODEL (left) vs TOOL (right).
 * Duration: 77 frames (~2.6s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene10_ModelDecides: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn    = interpolate(frame, [0, 12], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const leftSlide = interpolate(frame, [5, 22], [-80, 0], { easing: ease, extrapolateRight: 'clamp' });
  const rightSlide = interpolate(frame, [10, 28], [80, 0], { easing: ease, extrapolateRight: 'clamp' });
  const vsOp      = interpolate(frame, [18, 32], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const vsScale   = interpolate(frame, [18, 32], [0.5, 1], { easing: ease, extrapolateRight: 'clamp' });
  const lineH     = interpolate(frame, [8, 28], [0, 900], { easing: ease, extrapolateRight: 'clamp' });
  const tagOp     = interpolate(frame, [25, 40], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Center divider */}
        <line x1={540} y1={960 - lineH / 2} x2={540} y2={960 + lineH / 2}
          stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={fadeIn * 0.3} />

        {/* VS badge */}
        <g opacity={vsOp} transform={`translate(540, 960) scale(${vsScale})`}>
          <circle cx={0} cy={0} r={45} fill={COLORS.bg_paper} stroke={COLORS.warm_blue} strokeWidth={3} />
          <text x={0} y={12} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900}
            fill={COLORS.warm_blue}>VS</text>
        </g>

        {/* LEFT — MODEL */}
        <g transform={`translate(${leftSlide}, 0)`} opacity={fadeIn}>
          {/* Brain icon */}
          <g transform="translate(270, 580)">
            <circle cx={0} cy={0} r={80} fill="none" stroke={COLORS.warm_blue} strokeWidth={3} />
            <circle cx={0} cy={0} r={60} fill="none" stroke={COLORS.warm_blue} strokeWidth={1.5} opacity={0.4} />
            <path d="M -25,-25 Q 0,-45 25,-25 M -30,0 Q 0,20 30,0 M -25,25 Q 0,45 25,25"
              fill="none" stroke={COLORS.warm_blue} strokeWidth={2.5} strokeLinecap="round" />
          </g>

          <text x={270} y={720} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
            fill={COLORS.deep_black}>MODEL</text>
          <text x={270} y={780} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700}
            fill={COLORS.warm_blue} opacity={tagOp}>DECIDES</text>

          {/* Attributes */}
          {['Reasoning', 'Choosing', 'Planning'].map((attr, i) => {
            const attrOp = interpolate(frame, [30 + i * 6, 42 + i * 6], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <g key={attr} opacity={attrOp}>
                <circle cx={140} cy={870 + i * 60} r={6} fill={COLORS.warm_blue} opacity={0.6} />
                <text x={165} y={878 + i * 60} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
                  fill={COLORS.deep_black}>{attr}</text>
              </g>
            );
          })}
        </g>

        {/* RIGHT — TOOL */}
        <g transform={`translate(${rightSlide}, 0)`} opacity={fadeIn}>
          {/* Wrench icon */}
          <g transform="translate(810, 580)">
            <circle cx={0} cy={0} r={80} fill="none" stroke={COLORS.amber} strokeWidth={3} />
            <line x1={-30} y1={-30} x2={30} y2={30} stroke={COLORS.amber} strokeWidth={5} strokeLinecap="round" />
            <circle cx={35} cy={35} r={18} fill="none" stroke={COLORS.amber} strokeWidth={3} />
            <circle cx={-35} cy={-35} r={12} fill={COLORS.amber} opacity={0.4} />
          </g>

          <text x={810} y={720} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
            fill={COLORS.deep_black}>TOOL</text>
          <text x={810} y={780} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700}
            fill={COLORS.amber} opacity={tagOp}>DOES</text>

          {/* Attributes */}
          {['Executing', 'Interacting', 'Returning'].map((attr, i) => {
            const attrOp = interpolate(frame, [33 + i * 6, 45 + i * 6], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <g key={attr} opacity={attrOp}>
                <circle cx={680} cy={870 + i * 60} r={6} fill={COLORS.amber} opacity={0.6} />
                <text x={705} y={878 + i * 60} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
                  fill={COLORS.deep_black}>{attr}</text>
              </g>
            );
          })}
        </g>

        {/* Bottom emphasis */}
        <text x={540} y={1200} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={800}
          fill={COLORS.deep_black} opacity={tagOp}>
          The model decides. The tool does.
        </text>

        <rect x={160} y={1700} width={760} height={6} rx={3} fill={COLORS.warm_blue} opacity={fadeIn * 0.2} />
      </svg>

      <CaptionBar text="The model decides, the tool does."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['model', 'decides', 'tool', 'does']} />
    </AbsoluteFill>
  );
};
