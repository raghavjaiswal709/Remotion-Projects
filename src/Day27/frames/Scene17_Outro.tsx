/**
 * Scene 17 — Outro
 * Day 27: Tools
 * Paper background, large day number, social CTA, next day preview.
 * Duration: 362 frames (~12s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene17_Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const dayEnter  = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const dayScale  = interpolate(frame, [0, 18], [0.7, 1], { extrapolateRight: 'clamp', easing: ease });
  const lineW     = interpolate(frame, [10, 26], [0, 640], { extrapolateRight: 'clamp', easing: ease });
  const subEnter  = interpolate(frame, [14, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const ctaEnter  = interpolate(frame, [22, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bracketOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <CornerBrackets opacity={bracketOp} />

        {/* Large day number */}
        <g opacity={dayEnter} transform={`translate(540, 720) scale(${dayScale})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={220} fontWeight={900}
            fill={COLORS.warm_blue} opacity={0.12}>
            27
          </text>
          <text x={0} y={-10} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={130} fontWeight={900}
            fill={COLORS.deep_black} letterSpacing="0.04em">
            DAY 27
          </text>
        </g>

        {/* Divider */}
        <line x1={540 - lineW / 2} y1={780} x2={540 + lineW / 2} y2={780}
          stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={dayEnter * 0.6} />

        {/* Series title */}
        <g opacity={subEnter}>
          <text x={540} y={860} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={46} fontWeight={700}
            fill={COLORS.warm_blue} letterSpacing="0.08em">
            AGENTIC AI · 30 DAYS
          </text>
        </g>

        {/* Episode topic */}
        <g opacity={subEnter}>
          <text x={540} y={940} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={400}
            fill={COLORS.deep_black} letterSpacing="0.06em" opacity={0.7}>
            TOOLS
          </text>
        </g>

        {/* Next up */}
        <g opacity={ctaEnter}>
          <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={COLORS.deep_black} opacity={0.5} letterSpacing="0.2em">
            NEXT UP
          </text>
          <text x={540} y={1160} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={700}
            fill={COLORS.vibrant_red} letterSpacing="0.04em">
            DAY 28
          </text>
        </g>

        {/* CTA buttons */}
        <g opacity={ctaEnter}>
          <rect x={240} y={1320} width={600} height={80} rx={40}
            fill="none" stroke={COLORS.warm_blue} strokeWidth={2} />
          <text x={540} y={1370} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={600}
            fill={COLORS.warm_blue} letterSpacing="0.12em">
            FOLLOW FOR DAILY DROPS
          </text>
          <rect x={290} y={1430} width={500} height={70} rx={35}
            fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.4} />
          <text x={540} y={1476} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={COLORS.deep_black} letterSpacing="0.1em" opacity={0.6}>
            SHARE IF IT HELPED YOU
          </text>
        </g>

        {/* Loop steps at bottom */}
        {['PERCEIVE', 'THINK', 'ACT', 'OBSERVE'].map((step, i) => {
          const colors = ['#22C55E', '#3B82F6', '#F59E0B', '#A78BFA'];
          const stepOp = interpolate(frame, [30 + i * 4, 42 + i * 4], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <g key={step} opacity={stepOp}>
              <circle cx={200 + i * 227} cy={1640} r={18} fill="none" stroke={colors[i]} strokeWidth={2} opacity={0.5} />
              <circle cx={200 + i * 227} cy={1640} r={7} fill={colors[i]} opacity={0.7} />
              <text x={200 + i * 227} y={1680} textAnchor="middle" fontFamily="'Inter', sans-serif"
                fontSize={16} fontWeight={600} fill={colors[i]} letterSpacing="0.04em" opacity={0.7}>
                {step}
              </text>
            </g>
          );
        })}

        {/* Decorative dots */}
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx={200 + i * 100} cy={1780} r={3} fill={COLORS.warm_blue} opacity={dayEnter * 0.2} />
        ))}
      </svg>

      <CaptionBar text="Day 27 complete. Tools are the agent's hands."
        opacity={interpolate(frame, [10, 22], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['Tools', 'hands']} />
    </AbsoluteFill>
  );
};
