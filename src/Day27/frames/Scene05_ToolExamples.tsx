/**
 * Scene 05 — Tool Examples
 * "Search, read file, send email, run an SQL query."
 * Four tool cards appearing one by one with icons.
 * Duration: 144 frames (~4.8s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const tools = [
  { label: 'SEARCH', icon: '🔍', color: COLORS.warm_blue, desc: 'Query the web' },
  { label: 'READ FILE', icon: '📄', color: COLORS.vibrant_green, desc: 'Access file contents' },
  { label: 'SEND EMAIL', icon: '✉️', color: COLORS.amber, desc: 'Deliver a message' },
  { label: 'SQL QUERY', icon: '🗄️', color: COLORS.purple, desc: 'Query a database' },
];

export const Scene05_ToolExamples: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const headerOp = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const cardAnims = tools.map((_, i) => ({
    opacity: interpolate(frame, [15 + i * 22, 30 + i * 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    slideY:  interpolate(frame, [15 + i * 22, 30 + i * 22], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
    scale:   interpolate(frame, [15 + i * 22, 30 + i * 22], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  }));

  const connectOp = interpolate(frame, [100, 120], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Header */}
        <text x={540} y={180} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.2em" opacity={headerOp * 0.7}>
          TOOL EXAMPLES
        </text>
        <line x1={260} y1={210} x2={820} y2={210} stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round" opacity={headerOp * 0.4} />

        {/* Tool cards — 2x2 grid */}
        {tools.map((tool, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const cx = 280 + col * 520;
          const cy = 480 + row * 480;

          return (
            <g key={tool.label} opacity={cardAnims[i].opacity}
              transform={`translate(0, ${cardAnims[i].slideY}) scale(${cardAnims[i].scale})`}
              style={{ transformOrigin: `${cx}px ${cy}px` } as React.CSSProperties}>
              {/* Card background */}
              <rect x={cx - 210} y={cy - 150} width={420} height={300} rx={20}
                fill="none" stroke={tool.color} strokeWidth={3} opacity={0.8} />
              <rect x={cx - 210} y={cy - 150} width={420} height={300} rx={20}
                fill={tool.color} opacity={0.05} />

              {/* Icon circle */}
              <circle cx={cx} cy={cy - 50} r={50} fill="none" stroke={tool.color} strokeWidth={2.5} opacity={0.6} />
              <text x={cx} y={cy - 30} textAnchor="middle" fontSize={44}>
                {tool.icon}
              </text>

              {/* Label */}
              <text x={cx} y={cy + 50} textAnchor="middle" fontFamily="'Inter', sans-serif"
                fontSize={32} fontWeight={800} fill={COLORS.deep_black} letterSpacing="0.06em">
                {tool.label}
              </text>

              {/* Description */}
              <text x={cx} y={cy + 90} textAnchor="middle" fontFamily="'Inter', sans-serif"
                fontSize={22} fontWeight={400} fill={COLORS.deep_black} opacity={0.5}>
                {tool.desc}
              </text>

              {/* Decorative corner dots */}
              <circle cx={cx - 195} cy={cy - 135} r={4} fill={tool.color} opacity={0.4} />
              <circle cx={cx + 195} cy={cy - 135} r={4} fill={tool.color} opacity={0.4} />
              <circle cx={cx - 195} cy={cy + 135} r={4} fill={tool.color} opacity={0.4} />
              <circle cx={cx + 195} cy={cy + 135} r={4} fill={tool.color} opacity={0.4} />
            </g>
          );
        })}

        {/* Connecting lines between cards */}
        <g opacity={connectOp * 0.3}>
          <line x1={490} y1={480} x2={590} y2={480} stroke={COLORS.warm_blue} strokeWidth={2} strokeDasharray="6,4" />
          <line x1={490} y1={960} x2={590} y2={960} stroke={COLORS.warm_blue} strokeWidth={2} strokeDasharray="6,4" />
          <line x1={280} y1={630} x2={280} y2={780} stroke={COLORS.warm_blue} strokeWidth={2} strokeDasharray="6,4" />
          <line x1={800} y1={630} x2={800} y2={780} stroke={COLORS.warm_blue} strokeWidth={2} strokeDasharray="6,4" />
        </g>

        {/* Bottom label */}
        <text x={540} y={1350} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
          fill={COLORS.warm_blue} opacity={connectOp} letterSpacing="0.1em">
          EACH ONE IS A DISCRETE CAPABILITY
        </text>

        {/* Accent bar */}
        <rect x={160} y={1700} width={760} height={6} rx={3} fill={COLORS.warm_blue} opacity={fadeIn * 0.2} />
      </svg>

      <CaptionBar text="Search, read file, send email, run an SQL query."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['Search', 'file', 'email', 'SQL']} />
    </AbsoluteFill>
  );
};
