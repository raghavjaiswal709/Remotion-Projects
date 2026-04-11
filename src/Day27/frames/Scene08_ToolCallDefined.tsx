/**
 * Scene 08 — Tool Call Defined
 * "A tool call is a structured piece of text that says: call this function with these arguments."
 * Paper background. JSON-style structured text visualization.
 * Duration: 187 frames (~6.2s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const jsonLines = [
  { text: '{', indent: 0, color: COLORS.deep_black },
  { text: '"tool": "search",', indent: 1, color: COLORS.warm_blue },
  { text: '"arguments": {', indent: 1, color: COLORS.deep_black },
  { text: '"query": "AI agents"', indent: 2, color: COLORS.vibrant_green },
  { text: '}', indent: 1, color: COLORS.deep_black },
  { text: '}', indent: 0, color: COLORS.deep_black },
];

export const Scene08_ToolCallDefined: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn   = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const headerOp = interpolate(frame, [5, 20], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const divW     = interpolate(frame, [8, 25], [0, 700], { easing: ease, extrapolateRight: 'clamp' });
  const defOp    = interpolate(frame, [15, 30], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const jsonAnims = jsonLines.map((_, i) => ({
    opacity: interpolate(frame, [40 + i * 12, 55 + i * 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    slideX:  interpolate(frame, [40 + i * 12, 55 + i * 12], [-20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  }));

  const arrowOps = [
    interpolate(frame, [110, 130], [0, 1], { easing: ease, extrapolateRight: 'clamp' }),
    interpolate(frame, [125, 145], [0, 1], { easing: ease, extrapolateRight: 'clamp' }),
  ];
  const labelOp = interpolate(frame, [140, 160], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const cursorBlink = Math.sin(frame * 0.18) > 0 ? 1 : 0;

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Header */}
        <text x={540} y={190} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.2em" opacity={headerOp * 0.7}>
          TOOL CALL
        </text>
        <line x1={540 - divW / 2} y1={220} x2={540 + divW / 2} y2={220}
          stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round" opacity={headerOp * 0.4} />

        {/* Definition */}
        <text x={540} y={310} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700}
          fill={COLORS.deep_black} opacity={defOp}>
          A structured piece of text:
        </text>
        <text x={540} y={370} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500}
          fill={COLORS.warm_blue} opacity={defOp * 0.8}>
          "Call this function with these arguments"
        </text>

        {/* JSON code block */}
        <rect x={140} y={440} width={800} height={420} rx={16}
          fill={COLORS.deep_black} opacity={fadeIn * 0.92} />
        <rect x={140} y={440} width={800} height={420} rx={16}
          fill="none" stroke={COLORS.warm_blue} strokeWidth={2} opacity={fadeIn * 0.3} />

        {/* Code header bar */}
        <rect x={140} y={440} width={800} height={40} rx={16}
          fill={COLORS.deep_black} opacity={0.95} />
        <circle cx={175} cy={460} r={7} fill="#EF4444" opacity={fadeIn * 0.7} />
        <circle cx={200} cy={460} r={7} fill="#F59E0B" opacity={fadeIn * 0.7} />
        <circle cx={225} cy={460} r={7} fill="#22C55E" opacity={fadeIn * 0.7} />
        <text x={540} y={466} textAnchor="middle" fontFamily="monospace" fontSize={16} fontWeight={500}
          fill={COLORS.cool_silver} opacity={fadeIn * 0.5}>tool_call.json</text>

        {/* JSON lines */}
        {jsonLines.map((line, i) => (
          <text key={i} x={200 + line.indent * 30 + jsonAnims[i].slideX}
            y={530 + i * 52}
            fontFamily="monospace" fontSize={30} fontWeight={600}
            fill={line.color === COLORS.deep_black ? COLORS.cool_silver : line.color}
            opacity={jsonAnims[i].opacity}>
            {line.text}
          </text>
        ))}

        {/* Cursor */}
        <rect x={200} y={530 + jsonLines.length * 52} width={14} height={28} rx={2}
          fill={COLORS.electric_cyan} opacity={fadeIn * cursorBlink * 0.6} />

        {/* Annotation arrows */}
        <g opacity={arrowOps[0]}>
          <line x1={740} y1={582} x2={850} y2={582} stroke={COLORS.warm_blue} strokeWidth={2} />
          <line x1={850} y1={582} x2={850} y2={540} stroke={COLORS.warm_blue} strokeWidth={2} />
          <text x={870} y={545} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={600}
            fill={COLORS.warm_blue}>← function name</text>
        </g>
        <g opacity={arrowOps[1]}>
          <line x1={680} y1={686} x2={850} y2={686} stroke={COLORS.vibrant_green} strokeWidth={2} />
          <line x1={850} y1={686} x2={850} y2={720} stroke={COLORS.vibrant_green} strokeWidth={2} />
          <text x={870} y={725} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={600}
            fill={COLORS.vibrant_green}>← arguments</text>
        </g>

        {/* Visual flow: Model → Text → Runtime */}
        <g opacity={labelOp} transform="translate(540, 1080)">
          {/* Model */}
          <rect x={-420} y={-40} width={180} height={80} rx={12} fill="none" stroke={COLORS.warm_blue} strokeWidth={2.5} />
          <text x={-330} y={10} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700}
            fill={COLORS.warm_blue}>MODEL</text>
          {/* Arrow 1 */}
          <line x1={-230} y1={0} x2={-110} y2={0} stroke={COLORS.warm_blue} strokeWidth={2} strokeDasharray="6,4" />
          <polygon points="-115,-8 -95,0 -115,8" fill={COLORS.warm_blue} />
          {/* Text */}
          <rect x={-90} y={-40} width={180} height={80} rx={12} fill="none" stroke={COLORS.amber} strokeWidth={2.5} />
          <text x={0} y={10} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700}
            fill={COLORS.amber}>TEXT</text>
          {/* Arrow 2 */}
          <line x1={100} y1={0} x2={220} y2={0} stroke={COLORS.amber} strokeWidth={2} strokeDasharray="6,4" />
          <polygon points="215,-8 235,0 215,8" fill={COLORS.amber} />
          {/* Runtime */}
          <rect x={240} y={-40} width={180} height={80} rx={12} fill="none" stroke={COLORS.vibrant_green} strokeWidth={2.5} />
          <text x={330} y={10} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700}
            fill={COLORS.vibrant_green}>RUNTIME</text>
        </g>

        {/* Bottom accent */}
        <rect x={160} y={1700} width={760} height={6} rx={3} fill={COLORS.warm_blue} opacity={fadeIn * 0.2} />
      </svg>

      <CaptionBar text="A tool call is a structured piece of text that says: call this function with these arguments."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['tool', 'call', 'structured', 'function', 'arguments']} />
    </AbsoluteFill>
  );
};
