import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  BlackBackground,
  CaptionBar,
  GlobalDefs,
  CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const smoothBezier = Easing.bezier(0.22, 1, 0.36, 1);

/* ─── Tool icon component ─── */
const ToolIcon: React.FC<{
  cx: number;
  cy: number;
  type: 'wrench' | 'terminal' | 'search' | 'database' | 'api';
  color: string;
  frame: number;
  delay: number;
  size: number;
}> = ({ cx, cy, type, color, frame, delay, size }) => {
  const entryScale = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const entryOpacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const floatY = interpolate(
    (frame + delay) % 24,
    [0, 12, 24],
    [0, -8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const glowPulse = interpolate(
    (frame + delay * 2) % 20,
    [0, 10, 20],
    [0.2, 0.6, 0.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const renderIcon = () => {
    switch (type) {
      case 'wrench':
        return (
          <g>
            <circle cx={0} cy={0} r={size * 0.7} fill={color} opacity={0.12} />
            <path
              d={`M ${-size * 0.3},${-size * 0.3} L ${size * 0.1},${size * 0.1} M ${size * 0.1},${-size * 0.1} L ${-size * 0.1},${size * 0.1}`}
              fill="none"
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={size * 0.2} cy={-size * 0.2} r={size * 0.15} fill="none" stroke={color} strokeWidth={2} />
          </g>
        );
      case 'terminal':
        return (
          <g>
            <rect x={-size * 0.4} y={-size * 0.3} width={size * 0.8} height={size * 0.6} rx={3} fill={color} opacity={0.12} stroke={color} strokeWidth={1.5} />
            <path d={`M ${-size * 0.25},${-size * 0.1} L ${-size * 0.1},${size * 0.05} L ${-size * 0.25},${size * 0.15}`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <line x1={0} y1={size * 0.15} x2={size * 0.2} y2={size * 0.15} stroke={color} strokeWidth={2} strokeLinecap="round" />
          </g>
        );
      case 'search':
        return (
          <g>
            <circle cx={-size * 0.05} cy={-size * 0.05} r={size * 0.25} fill="none" stroke={color} strokeWidth={2.5} />
            <line x1={size * 0.12} y1={size * 0.12} x2={size * 0.3} y2={size * 0.3} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
          </g>
        );
      case 'database':
        return (
          <g>
            <ellipse cx={0} cy={-size * 0.15} rx={size * 0.3} ry={size * 0.1} fill="none" stroke={color} strokeWidth={2} />
            <path d={`M ${-size * 0.3},${-size * 0.15} L ${-size * 0.3},${size * 0.15}`} fill="none" stroke={color} strokeWidth={2} />
            <path d={`M ${size * 0.3},${-size * 0.15} L ${size * 0.3},${size * 0.15}`} fill="none" stroke={color} strokeWidth={2} />
            <ellipse cx={0} cy={size * 0.15} rx={size * 0.3} ry={size * 0.1} fill="none" stroke={color} strokeWidth={2} />
          </g>
        );
      case 'api':
        return (
          <g>
            <circle cx={0} cy={0} r={size * 0.12} fill={color} />
            <line x1={0} y1={-size * 0.12} x2={0} y2={-size * 0.35} stroke={color} strokeWidth={2} />
            <line x1={0} y1={size * 0.12} x2={0} y2={size * 0.35} stroke={color} strokeWidth={2} />
            <line x1={-size * 0.12} y1={0} x2={-size * 0.35} y2={0} stroke={color} strokeWidth={2} />
            <line x1={size * 0.12} y1={0} x2={size * 0.35} y2={0} stroke={color} strokeWidth={2} />
            <circle cx={0} cy={-size * 0.35} r={size * 0.06} fill={color} />
            <circle cx={0} cy={size * 0.35} r={size * 0.06} fill={color} />
            <circle cx={-size * 0.35} cy={0} r={size * 0.06} fill={color} />
            <circle cx={size * 0.35} cy={0} r={size * 0.06} fill={color} />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <g
      transform={`translate(${cx}, ${cy + floatY}) scale(${entryScale})`}
      opacity={entryOpacity}
    >
      {/* background glow */}
      <circle cx={0} cy={0} r={size} fill={color} opacity={glowPulse * 0.08} filter="url(#softGlow)" />
      {/* outer ring */}
      <circle cx={0} cy={0} r={size * 0.8} fill="none" stroke={color} strokeWidth={1} opacity={0.3} />
      {renderIcon()}
    </g>
  );
};

/* ─── Forward arrow component ─── */
const ForwardArrow: React.FC<{
  x: number;
  y: number;
  frame: number;
  delay: number;
}> = ({ x, y, frame, delay }) => {
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const moveX = interpolate(
    frame % 30,
    [0, 15, 30],
    [0, 15, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const scale = interpolate(frame, [delay, delay + 12], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  return (
    <g transform={`translate(${x + moveX}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* glow */}
      <polygon
        points="-30,-25 20,0 -30,25"
        fill={COLORS.electric_cyan}
        opacity={0.1}
        filter="url(#softGlow)"
      />
      {/* arrow body */}
      <line x1={-50} y1={0} x2={10} y2={0} stroke={COLORS.electric_cyan} strokeWidth={3} strokeLinecap="round" />
      <polygon points="10,-12 30,0 10,12" fill={COLORS.electric_cyan} />
      {/* secondary arrows behind */}
      <line x1={-80} y1={0} x2={-55} y2={0} stroke={COLORS.electric_cyan} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
      <line x1={-100} y1={0} x2={-85} y2={0} stroke={COLORS.electric_cyan} strokeWidth={1.5} strokeLinecap="round" opacity={0.2} />
    </g>
  );
};

/* ─── Horizontal line reveal ─── */
const RevealLine: React.FC<{
  y: number;
  frame: number;
  delay: number;
  color: string;
}> = ({ y, frame, delay, color }) => {
  const width = interpolate(frame, [delay, delay + 20], [0, 800], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <line
      x1={540 - width / 2}
      y1={y}
      x2={540 + width / 2}
      y2={y}
      stroke={color}
      strokeWidth={1}
      opacity={opacity}
    />
  );
};

/* ─── Particle stream ─── */
const ParticleStream: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const particles = Array.from({ length: 15 }).map((_, i) => {
    const seed = i * 137.5;
    const baseX = 100 + (seed % 880);
    const baseY = 400 + (seed * 1.7) % 1100;
    const size = 1.5 + (seed % 3);
    const delay = (seed % 20);
    const offset = interpolate(
      (frame + delay) % 30,
      [0, 15, 30],
      [0, -20, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
    const opacity = interpolate(frame, [8, 18], [0, 0.25], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const colors = [COLORS.electric_cyan, COLORS.warm_blue, COLORS.purple, COLORS.amber];
    return (
      <circle
        key={`stream-${i}`}
        cx={baseX}
        cy={baseY + offset}
        r={size}
        fill={colors[i % 4]}
        opacity={opacity}
      />
    );
  });
  return <>{particles}</>;
};

/* ─── Main component ─── */
export const Scene24_TomorrowPreview: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── master entrance ── */
  const masterIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── "tomorrow" label ── */
  const tomorrowOpacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const tomorrowY = interpolate(frame, [5, 15], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── "ACTIONS" title ── */
  const actionsOpacity = interpolate(frame, [12, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const actionsScale = interpolate(frame, [12, 22], [0.7, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── description ── */
  const descOpacity = interpolate(frame, [18, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── underline ── */
  const underlineW = interpolate(frame, [15, 30], [0, 500], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── day number ── */
  const dayOpacity = interpolate(frame, [2, 10], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── background radial pulse ── */
  const pulseOpacity = interpolate(
    frame % 30,
    [0, 15, 30],
    [0.03, 0.08, 0.03],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  /* ── tool icon data ── */
  const tools: Array<{
    cx: number;
    cy: number;
    type: 'wrench' | 'terminal' | 'search' | 'database' | 'api';
    color: string;
    delay: number;
    size: number;
  }> = [
    { cx: 200, cy: 850, type: 'wrench', color: COLORS.electric_cyan, delay: 20, size: 45 },
    { cx: 400, cy: 780, type: 'terminal', color: COLORS.vibrant_green, delay: 24, size: 50 },
    { cx: 540, cy: 900, type: 'api', color: COLORS.amber, delay: 22, size: 55 },
    { cx: 680, cy: 780, type: 'search', color: COLORS.warm_blue, delay: 26, size: 50 },
    { cx: 880, cy: 850, type: 'database', color: COLORS.purple, delay: 28, size: 45 },
  ];

  const bracketScale = scaleAnim(frame, 0, 15);
  const captionOpacity = interpolate(frame, [8, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── teaser lines ── */
  const teaserItems = [
    { text: 'Function calling', delay: 30, color: COLORS.electric_cyan },
    { text: 'Tool use patterns', delay: 34, color: COLORS.warm_blue },
    { text: 'Real-world APIs', delay: 38, color: COLORS.amber },
  ];

  return (
    <AbsoluteFill>
      <BlackBackground />
      <GlobalDefs />

      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="centerPulse" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity={pulseOpacity} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* ── background pulse ── */}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#centerPulse)" />

        {/* ── particle stream ── */}
        <ParticleStream frame={frame} />

        {/* ── day number watermark ── */}
        <text
          x={540}
          y={280}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize={160}
          fontWeight={900}
          fill={COLORS.cool_silver}
          opacity={dayOpacity * 0.08}
          letterSpacing={10}
        >
          25
        </text>

        {/* ── "TOMORROW" label ── */}
        <g opacity={tomorrowOpacity} transform={`translate(0, ${tomorrowY})`}>
          <text
            x={540}
            y={440}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={28}
            fontWeight={600}
            fill={COLORS.cool_silver}
            letterSpacing={8}
          >
            COMING UP NEXT
          </text>
        </g>

        {/* ── "ACTIONS" main title ── */}
        <g opacity={actionsOpacity} transform={`translate(540, 560) scale(${actionsScale})`}>
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={80}
            fontWeight={900}
            fill={COLORS.soft_white}
            letterSpacing={6}
          >
            ACTIONS
          </text>
          <line
            x1={-underlineW / 2}
            y1={25}
            x2={underlineW / 2}
            y2={25}
            stroke={COLORS.electric_cyan}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* ── description ── */}
        <g opacity={descOpacity}>
          <text
            x={540}
            y={660}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={26}
            fontWeight={400}
            fill={COLORS.cool_silver}
            letterSpacing={2}
          >
            How agents interact with the world
          </text>
        </g>

        {/* ── tool icons ── */}
        {tools.map((tool, i) => (
          <ToolIcon key={`tool-${i}`} {...tool} frame={frame} />
        ))}

        {/* ── forward arrow ── */}
        <ForwardArrow x={480} y={1050} frame={frame} delay={15} />

        {/* ── reveal lines ── */}
        <RevealLine y={710} frame={frame} delay={16} color={COLORS.electric_cyan} />
        <RevealLine y={1120} frame={frame} delay={20} color={COLORS.warm_blue} />

        {/* ── teaser bullet items ── */}
        {teaserItems.map((item, i) => {
          const itemOpacity = interpolate(frame, [item.delay, item.delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: smoothBezier,
          });
          const itemX = interpolate(frame, [item.delay, item.delay + 10], [30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: smoothBezier,
          });
          return (
            <g key={`teaser-${i}`} opacity={itemOpacity} transform={`translate(${itemX}, 0)`}>
              <circle cx={280} cy={1220 + i * 65} r={5} fill={item.color} />
              <text
                x={310}
                y={1228 + i * 65}
                fontFamily="Inter, sans-serif"
                fontSize={26}
                fontWeight={500}
                fill={COLORS.soft_white}
                letterSpacing={1}
              >
                {item.text}
              </text>
            </g>
          );
        })}

        {/* ── "DAY 25" badge ── */}
        <g opacity={tomorrowOpacity}>
          <rect
            x={420}
            y={1440}
            width={240}
            height={60}
            rx={30}
            fill="none"
            stroke={COLORS.electric_cyan}
            strokeWidth={2}
            opacity={0.5}
          />
          <text
            x={540}
            y={1478}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={24}
            fontWeight={700}
            fill={COLORS.electric_cyan}
            letterSpacing={4}
          >
            DAY 25
          </text>
        </g>
      </svg>

      <CornerBrackets scale={bracketScale} />
      <SectionLabel text="PREVIEW" opacity={masterIn} />
      <CaptionBar
        text="Tomorrow — we explore Actions"
        opacity={captionOpacity}
        highlightWords={['Tomorrow', 'Actions']}
      />
    </AbsoluteFill>
  );
};

export default Scene24_TomorrowPreview;
