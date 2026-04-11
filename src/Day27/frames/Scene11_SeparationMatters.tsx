/**
 * Scene 11 — Separation Matters
 * "This separation matters deeply. The model's job is reasoning, choosing which tool
 *  with what arguments at what point in the task."
 * Black background. Separation diagram: Model (reasoning) side vs Tool (execution) side.
 * Duration: 278 frames (~9.3s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const reasoningSteps = [
  { label: 'Which tool?', icon: '❓' },
  { label: 'What arguments?', icon: '📋' },
  { label: 'When in task?', icon: '⏱️' },
];

export const Scene11_SeparationMatters: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn    = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const headerOp  = interpolate(frame, [5, 22], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const separOp   = interpolate(frame, [15, 35], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const separScale = interpolate(frame, [15, 35], [0.8, 1], { easing: ease, extrapolateRight: 'clamp' });
  const deeplyOp  = interpolate(frame, [30, 48], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const modelBoxOp = interpolate(frame, [50, 70], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const modelSlide = interpolate(frame, [50, 70], [-40, 0], { easing: ease, extrapolateRight: 'clamp' });

  const stepAnims = reasoningSteps.map((_, i) => ({
    opacity: interpolate(frame, [80 + i * 25, 100 + i * 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    slideX: interpolate(frame, [80 + i * 25, 100 + i * 25], [-20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  }));

  const taskFlowOp = interpolate(frame, [180, 210], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const decisionPulse = 0.6 + Math.sin(frame * 0.08) * 0.2;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlowS11" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor="#00E5FF" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
            <feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="bgGlowS11" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#bgGlowS11)" opacity={fadeIn} />

        {/* Header */}
        <text x={540} y={150} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500}
          fill={COLORS.electric_cyan} letterSpacing="0.2em" opacity={headerOp * 0.6}>
          THE SEPARATION
        </text>

        {/* "This separation matters deeply" */}
        <g opacity={separOp} transform={`translate(540, 280) scale(${separScale})`}
          style={{ transformOrigin: '540px 280px' } as React.CSSProperties}>
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={800}
            fill={COLORS.soft_white}>This separation</text>
          <text x={0} y={65} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={800}
            fill={COLORS.electric_cyan} filter="url(#cyanGlowS11)">
            matters deeply.
          </text>
        </g>

        {/* Divider */}
        <line x1={200} y1={400} x2={880} y2={400} stroke={COLORS.electric_cyan} strokeWidth={1.5}
          opacity={deeplyOp * 0.3} strokeDasharray="8,6" />

        {/* MODEL'S JOB section */}
        <g opacity={modelBoxOp} transform={`translate(${modelSlide}, 0)`}>
          <rect x={100} y={450} width={880} height={500} rx={20}
            fill="none" stroke={COLORS.warm_blue} strokeWidth={2.5} opacity={0.6} />
          <rect x={100} y={450} width={880} height={500} rx={20}
            fill={COLORS.warm_blue} opacity={0.04} />

          <text x={540} y={510} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500}
            fill={COLORS.warm_blue} letterSpacing="0.15em" opacity={0.7}>THE MODEL'S JOB</text>
          <text x={540} y={580} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={900}
            fill={COLORS.soft_white}>REASONING</text>

          {/* Brain visual */}
          <g transform="translate(540, 660)" opacity={decisionPulse}>
            <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.electric_cyan} strokeWidth={2} />
            <path d="M -15,-15 Q 0,-28 15,-15 M -18,0 Q 0,12 18,0 M -15,15 Q 0,28 15,15"
              fill="none" stroke={COLORS.electric_cyan} strokeWidth={2} strokeLinecap="round" />
          </g>

          {/* Reasoning steps */}
          {reasoningSteps.map((step, i) => (
            <g key={step.label} opacity={stepAnims[i].opacity}
              transform={`translate(${stepAnims[i].slideX}, 0)`}>
              <rect x={180} y={730 + i * 68} width={720} height={55} rx={10}
                fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5} opacity={0.4} />
              <text x={220} y={765 + i * 68} fontSize={28}>{step.icon}</text>
              <text x={270} y={765 + i * 68} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
                fill={COLORS.soft_white}>{step.label}</text>
            </g>
          ))}
        </g>

        {/* Task flow visualization */}
        <g opacity={taskFlowOp} transform="translate(540, 1120)">
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500}
            fill={COLORS.electric_cyan} letterSpacing="0.15em" opacity={0.6}>DECISION FLOW</text>

          {/* Flow boxes */}
          {['Perceive', 'Reason', 'Choose Tool', 'Pass Args', 'Execute'].map((step, i) => {
            const stepOp = interpolate(frame, [190 + i * 12, 205 + i * 12], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const bx = -400 + i * 200;
            const isHighlight = step === 'Choose Tool' || step === 'Pass Args';
            return (
              <g key={step} opacity={stepOp}>
                <rect x={bx - 80} y={40} width={160} height={60} rx={8}
                  fill="none" stroke={isHighlight ? COLORS.electric_cyan : COLORS.cool_silver}
                  strokeWidth={isHighlight ? 2.5 : 1.5} />
                <text x={bx} y={78} textAnchor="middle" fontFamily="'Inter', sans-serif"
                  fontSize={18} fontWeight={isHighlight ? 700 : 500}
                  fill={isHighlight ? COLORS.electric_cyan : COLORS.cool_silver}>
                  {step}
                </text>
                {i < 4 && (
                  <line x1={bx + 80} y1={70} x2={bx + 120} y2={70}
                    stroke={COLORS.cool_silver} strokeWidth={1.5} opacity={0.4} />
                )}
              </g>
            );
          })}
        </g>

        {/* Corner marks */}
        {[
          { x: 40, y: 40, sx: 1, sy: 1 },
          { x: 1040, y: 40, sx: -1, sy: 1 },
          { x: 40, y: 1880, sx: 1, sy: -1 },
          { x: 1040, y: 1880, sx: -1, sy: -1 },
        ].map((c, i) => (
          <g key={`cm-${i}`} transform={`translate(${c.x},${c.y}) scale(${c.sx},${c.sy})`} opacity={fadeIn * 0.3}>
            <line x1="0" y1="0" x2="25" y2="0" stroke={COLORS.cool_silver} strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="25" stroke={COLORS.cool_silver} strokeWidth="1.5" />
          </g>
        ))}
      </svg>

      <CaptionBar text="This separation matters deeply. The model's job is reasoning."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['separation', 'reasoning']} />
    </AbsoluteFill>
  );
};
