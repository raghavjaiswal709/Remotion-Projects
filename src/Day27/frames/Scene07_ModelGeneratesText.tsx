/**
 * Scene 07 — Model Generates Text
 * "The language model never directly executes anything. It generates text."
 * Black background. Model box generating text streams. "NEVER EXECUTES" in red crossed out.
 * Duration: 167 frames (~5.6s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const textLines = [
  '{ "action": "search",',
  '  "query": "latest news" }',
  '{ "action": "read_file",',
  '  "path": "/data.csv" }',
];

export const Scene07_ModelGeneratesText: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn     = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const modelOp    = interpolate(frame, [5, 22], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const modelScale = interpolate(frame, [5, 22], [0.8, 1], { easing: ease, extrapolateRight: 'clamp' });
  const neverOp    = interpolate(frame, [20, 38], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const crossOp    = interpolate(frame, [35, 50], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const textStream = interpolate(frame, [45, 120], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const genLabel   = interpolate(frame, [60, 80], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const cursorBlink = Math.sin(frame * 0.2) > 0 ? 1 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="redGlowS07" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor="#EF4444" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
            <feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="cyanGlowS07" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor="#00E5FF" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
            <feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="bgGlowS07" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgGlowS07)" opacity={fadeIn} />

        {/* Grid lines */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={i * 108 + 54} y1="0" x2={i * 108 + 54} y2="1920"
            stroke={COLORS.electric_cyan} strokeWidth="0.3" opacity={fadeIn * 0.08} />
        ))}

        {/* MODEL box */}
        <g opacity={modelOp} transform={`translate(540, 380) scale(${modelScale})`}
          style={{ transformOrigin: '540px 380px' } as React.CSSProperties}>
          <rect x={-180} y={-100} width={360} height={200} rx={20}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={3} />
          <rect x={-180} y={-100} width={360} height={200} rx={20}
            fill={COLORS.electric_cyan} opacity={0.05} />
          <text x={0} y={-20} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={COLORS.electric_cyan} letterSpacing="0.15em" opacity={0.6}>LANGUAGE</text>
          <text x={0} y={30} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
            fill={COLORS.soft_white}>MODEL</text>
          {/* Brain icon */}
          <circle cx={0} cy={-60} r={18} fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5} opacity={0.4} />
          <path d="M -8,-68 Q 0,-76 8,-68 M -12,-60 Q 0,-52 12,-60" fill="none"
            stroke={COLORS.electric_cyan} strokeWidth={1.5} opacity={0.5} />
        </g>

        {/* NEVER EXECUTES label with red X */}
        <g opacity={neverOp}>
          <text x={540} y={580} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={42} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            NEVER DIRECTLY EXECUTES
          </text>
          {/* Red X cross */}
          <g opacity={crossOp}>
            <line x1={200} y1={550} x2={880} y2={600} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
            <line x1={200} y1={600} x2={880} y2={550} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          </g>
        </g>

        {/* Arrow down to text output */}
        <g opacity={genLabel}>
          <line x1={540} y1={640} x2={540} y2={740} stroke={COLORS.electric_cyan} strokeWidth={2} strokeDasharray="6,4" />
          <polygon points="528,730 540,755 552,730" fill={COLORS.electric_cyan} />
          <text x={540} y={700} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={COLORS.electric_cyan} opacity={0.7}>generates</text>
        </g>

        {/* GENERATES TEXT label */}
        <text x={540} y={810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={800}
          fill={COLORS.electric_cyan} opacity={genLabel} filter="url(#cyanGlowS07)">
          IT GENERATES TEXT
        </text>

        {/* Text output stream */}
        <g transform="translate(200, 900)">
          {textLines.map((line, i) => {
            const lineOp = interpolate(frame, [55 + i * 14, 70 + i * 14], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const lineSlide = interpolate(frame, [55 + i * 14, 70 + i * 14], [15, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            return (
              <text key={i} x={0} y={i * 50 + lineSlide} fontFamily="monospace" fontSize={28} fontWeight={500}
                fill={COLORS.vibrant_green} opacity={lineOp * textStream}>
                {line}
              </text>
            );
          })}
          {/* Cursor */}
          <rect x={0} y={textLines.length * 50} width={16} height={30} rx={2}
            fill={COLORS.electric_cyan} opacity={textStream * cursorBlink * 0.8} />
        </g>

        {/* Decorative brackets around output */}
        <rect x={160} y={870} width={760} height={260} rx={12}
          fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5} opacity={textStream * 0.25}
          strokeDasharray="8,5" />
        <text x={170} y={870} fontFamily="monospace" fontSize={24} fill={COLORS.electric_cyan} opacity={textStream * 0.4}>
          OUTPUT
        </text>

        {/* Corner marks */}
        {[
          { x: 40, y: 40, sx: 1, sy: 1 },
          { x: 1040, y: 40, sx: -1, sy: 1 },
          { x: 40, y: 1880, sx: 1, sy: -1 },
          { x: 1040, y: 1880, sx: -1, sy: -1 },
        ].map((c, i) => (
          <g key={`cm-${i}`} transform={`translate(${c.x},${c.y}) scale(${c.sx},${c.sy})`} opacity={fadeIn * 0.4}>
            <line x1="0" y1="0" x2="30" y2="0" stroke={COLORS.cool_silver} strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="30" stroke={COLORS.cool_silver} strokeWidth="1.5" />
          </g>
        ))}
      </svg>

      <CaptionBar text="The language model never directly executes anything. It generates text."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['never', 'executes', 'generates', 'text']} />
    </AbsoluteFill>
  );
};
