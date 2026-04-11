/**
 * Scene 16 — Key Takeaway
 * Day 25: Actions
 * Paper background, large bold ink typography.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene16_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();

  const headerEnter = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const dividerW = interpolate(frame, [8, 22], [0, 760], { extrapolateRight: 'clamp', easing: ease });
  const lineAnim = [interpolate(frame, [4, 14], [0, 1], { extrapolateRight: "clamp", easing: ease }), interpolate(frame, [12, 22], [0, 1], { extrapolateRight: "clamp", easing: ease }), interpolate(frame, [20, 30], [0, 1], { extrapolateRight: "clamp", easing: ease })];
  const dotEnter = interpolate(frame, [6, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* ── Decorative corner dots ── */}
        <circle cx={100} cy={100} r={8} fill={COLORS.vibrant_red} opacity={dotEnter * 0.4} />
        <circle cx={980} cy={100} r={8} fill={COLORS.vibrant_red} opacity={dotEnter * 0.4} />
        <circle cx={100} cy={1820} r={8} fill={COLORS.vibrant_red} opacity={dotEnter * 0.4} />
        <circle cx={980} cy={1820} r={8} fill={COLORS.vibrant_red} opacity={dotEnter * 0.4} />

        {/* ── Section label ── */}
        <text x={540} y={220} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500}
          fill={COLORS.vibrant_red} letterSpacing="0.25em"
          opacity={headerEnter * 0.7}>
          KEY TAKEAWAY
        </text>

        {/* ── Divider line ── */}
        <line x1={540 - dividerW / 2} y1={270} x2={540 + dividerW / 2} y2={270}
          stroke={COLORS.vibrant_red} strokeWidth={2} strokeLinecap="round"
          opacity={0.5} />

        {/* ── Day label ── */}
        <text x={540} y={320} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400}
          fill={COLORS.deep_black} letterSpacing="0.15em"
          opacity={headerEnter * 0.5}>
          DAY 25 · ACTIONS
        </text>

        {/* ── Takeaway lines ── */}
          <text x={540} y={380} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={700}
            fill={COLORS.deep_black} opacity={lineAnim[0]}>
            Actions connect the loop to the world.
          </text>
          <text x={540} y={500} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={700}
            fill={COLORS.deep_black} opacity={lineAnim[1]}>
            Without actions, it is just thinking.
          </text>
          <text x={540} y={620} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={700}
            fill={COLORS.deep_black} opacity={lineAnim[2]}>
            The action set defines the agent's reach.
          </text>

        {/* ── Bottom accent bar ── */}
        <rect x={160} y={1700} width={760} height={6} rx={3}
          fill={COLORS.vibrant_red} opacity={dotEnter * 0.25} />
      </svg>

      <CaptionBar
        text="Key takeaway: actions connect the loop to the world."
        opacity={interpolate(frame, [4, 12], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['Actions']}
      />
    </AbsoluteFill>
  );
};

export default Scene16_KeyTakeaway;
