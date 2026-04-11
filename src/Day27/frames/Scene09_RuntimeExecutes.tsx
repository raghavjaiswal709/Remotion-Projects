/**
 * Scene 09 — Runtime Executes
 * "The runtime reads that output. It runs the actual function and returns the result as the next observation."
 * Black background. Flow: Text → Runtime → Function → Result → Observation.
 * Duration: 212 frames (~7.1s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene09_RuntimeExecutes: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn      = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const textBoxOp   = interpolate(frame, [5, 22], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const arrowRead   = interpolate(frame, [25, 50], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const runtimeOp   = interpolate(frame, [35, 55], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const runtimeScale = interpolate(frame, [35, 55], [0.8, 1], { easing: ease, extrapolateRight: 'clamp' });
  const arrowRun    = interpolate(frame, [60, 85], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const funcOp      = interpolate(frame, [70, 90], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const arrowResult = interpolate(frame, [100, 130], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const resultOp    = interpolate(frame, [110, 135], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const arrowObs    = interpolate(frame, [140, 165], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const obsOp       = interpolate(frame, [150, 175], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const loopArrow   = interpolate(frame, [170, 200], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const gearSpin = frame * 1.5;
  const pulseBg = 0.03 + Math.sin(frame * 0.05) * 0.02;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlowS09" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor="#00E5FF" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
            <feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="bgGlowS09" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity={pulseBg} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#bgGlowS09)" />

        {/* Step label */}
        <text x={540} y={130} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.electric_cyan} letterSpacing="0.2em" opacity={fadeIn * 0.6}>
          RUNTIME EXECUTION FLOW
        </text>

        {/* 1. TEXT OUTPUT box */}
        <g opacity={textBoxOp} transform="translate(540, 320)">
          <rect x={-160} y={-55} width={320} height={110} rx={14}
            fill="none" stroke={COLORS.amber} strokeWidth={2.5} />
          <rect x={-160} y={-55} width={320} height={110} rx={14}
            fill={COLORS.amber} opacity={0.06} />
          <text x={0} y={-15} textAnchor="middle" fontFamily="monospace" fontSize={18} fontWeight={500}
            fill={COLORS.amber} opacity={0.6}>STRUCTURED TEXT</text>
          <text x={0} y={25} textAnchor="middle" fontFamily="monospace" fontSize={24} fontWeight={700}
            fill={COLORS.amber}>{"{ tool: 'search' }"}</text>
        </g>

        {/* Arrow: Text → Runtime */}
        <g opacity={arrowRead}>
          <line x1={540} y1={380} x2={540} y2={480} stroke={COLORS.electric_cyan} strokeWidth={2} strokeDasharray="6,4" />
          <polygon points="528,470 540,495 552,470" fill={COLORS.electric_cyan} />
          <text x={565} y={440} fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={COLORS.electric_cyan} opacity={0.7}>reads</text>
        </g>

        {/* 2. RUNTIME box */}
        <g opacity={runtimeOp} transform={`translate(540, 560) scale(${runtimeScale})`}
          style={{ transformOrigin: '540px 560px' } as React.CSSProperties}>
          <rect x={-180} y={-55} width={360} height={110} rx={14}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={3} />
          <rect x={-180} y={-55} width={360} height={110} rx={14}
            fill={COLORS.electric_cyan} opacity={0.08} />
          {/* Gear icon */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2 + (gearSpin * Math.PI / 180);
            return (
              <line key={i} x1={-120 + Math.cos(angle) * 20} y1={Math.sin(angle) * 20}
                x2={-120 + Math.cos(angle) * 32} y2={Math.sin(angle) * 32}
                stroke={COLORS.electric_cyan} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
            );
          })}
          <circle cx={-120} cy={0} r={20} fill="none" stroke={COLORS.electric_cyan} strokeWidth={2} opacity={0.6} />
          <text x={10} y={12} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800}
            fill={COLORS.soft_white}>RUNTIME</text>
        </g>

        {/* Arrow: Runtime → Function */}
        <g opacity={arrowRun}>
          <line x1={540} y1={620} x2={540} y2={720} stroke={COLORS.vibrant_green} strokeWidth={2} strokeDasharray="6,4" />
          <polygon points="528,710 540,735 552,710" fill={COLORS.vibrant_green} />
          <text x={565} y={680} fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={COLORS.vibrant_green} opacity={0.7}>runs</text>
        </g>

        {/* 3. ACTUAL FUNCTION box */}
        <g opacity={funcOp} transform="translate(540, 800)">
          <rect x={-180} y={-55} width={360} height={110} rx={14}
            fill="none" stroke={COLORS.vibrant_green} strokeWidth={2.5} />
          <rect x={-180} y={-55} width={360} height={110} rx={14}
            fill={COLORS.vibrant_green} opacity={0.06} />
          <text x={0} y={-10} textAnchor="middle" fontFamily="monospace" fontSize={20} fontWeight={500}
            fill={COLORS.vibrant_green} opacity={0.6}>ACTUAL FUNCTION</text>
          <text x={0} y={30} textAnchor="middle" fontFamily="monospace" fontSize={28} fontWeight={700}
            fill={COLORS.vibrant_green}>search("AI agents")</text>
        </g>

        {/* Arrow: Function → Result */}
        <g opacity={arrowResult}>
          <line x1={540} y1={860} x2={540} y2={960} stroke={COLORS.purple} strokeWidth={2} strokeDasharray="6,4" />
          <polygon points="528,950 540,975 552,950" fill={COLORS.purple} />
          <text x={565} y={920} fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={COLORS.purple} opacity={0.7}>returns</text>
        </g>

        {/* 4. RESULT box */}
        <g opacity={resultOp} transform="translate(540, 1040)">
          <rect x={-180} y={-55} width={360} height={110} rx={14}
            fill="none" stroke={COLORS.purple} strokeWidth={2.5} />
          <rect x={-180} y={-55} width={360} height={110} rx={14}
            fill={COLORS.purple} opacity={0.06} />
          <text x={0} y={-10} textAnchor="middle" fontFamily="monospace" fontSize={20} fontWeight={500}
            fill={COLORS.purple} opacity={0.6}>RESULT</text>
          <text x={0} y={30} textAnchor="middle" fontFamily="monospace" fontSize={24} fontWeight={700}
            fill={COLORS.purple}>[articles, papers, ...]</text>
        </g>

        {/* Arrow: Result → Observation */}
        <g opacity={arrowObs}>
          <line x1={540} y1={1100} x2={540} y2={1200} stroke={COLORS.amber} strokeWidth={2} strokeDasharray="6,4" />
          <polygon points="528,1190 540,1215 552,1190" fill={COLORS.amber} />
        </g>

        {/* 5. NEXT OBSERVATION box */}
        <g opacity={obsOp} transform="translate(540, 1280)">
          <rect x={-200} y={-55} width={400} height={110} rx={14}
            fill="none" stroke={COLORS.amber} strokeWidth={3} />
          <rect x={-200} y={-55} width={400} height={110} rx={14}
            fill={COLORS.amber} opacity={0.08} />
          <text x={0} y={-10} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={COLORS.amber} opacity={0.6}>NEXT</text>
          <text x={0} y={30} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800}
            fill={COLORS.amber} filter="url(#cyanGlowS09)">OBSERVATION</text>
        </g>

        {/* Loop arrow back to top */}
        <g opacity={loopArrow}>
          <path d={`M 740,1280 Q 840,1280 840,1100 Q 840,400 740,320`}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={2} strokeDasharray="8,4" opacity={0.4} />
          <polygon points="745,330 735,305 755,315" fill={COLORS.electric_cyan} opacity={0.5} />
          <text x={860} y={700} fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={500}
            fill={COLORS.electric_cyan} opacity={0.5} transform="rotate(-90, 860, 700)">feeds back</text>
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

      <CaptionBar text="The runtime reads that output. It runs the actual function and returns the result as the next observation."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['runtime', 'function', 'result', 'observation']} />
    </AbsoluteFill>
  );
};
