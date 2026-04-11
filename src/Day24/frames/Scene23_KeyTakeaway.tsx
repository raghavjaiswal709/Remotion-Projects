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
  LoopArrow,
  SectionLabel,
} from '../helpers/components';

const smoothBezier = Easing.bezier(0.22, 1, 0.36, 1);

/* ─── Bullet point component with icon and text ─── */
const BulletPoint: React.FC<{
  x: number;
  y: number;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  frame: number;
  delay: number;
}> = ({ x, y, number, title, subtitle, icon, accentColor, frame, delay }) => {
  const entryProgress = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const slideX = interpolate(entryProgress, [0, 1], [-60, 0]);
  const opacity = interpolate(entryProgress, [0, 0.3, 1], [0, 0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* line reveal */
  const lineWidth = interpolate(frame, [delay + 4, delay + 14], [0, 680], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* number pulse */
  const numScale = interpolate(frame, [delay, delay + 6, delay + 12], [0, 1.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* icon glow */
  const glowOpacity = interpolate(
    (frame - delay) % 18,
    [0, 9, 18],
    [0.3, 0.7, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <g transform={`translate(${x + slideX}, ${y})`} opacity={opacity}>
      {/* ── background card ── */}
      <rect
        x={0}
        y={-40}
        width={780}
        height={150}
        rx={12}
        fill={COLORS.deep_black}
        stroke={accentColor}
        strokeWidth={1.2}
        opacity={0.4}
      />

      {/* ── number badge ── */}
      <g transform={`translate(50, 35) scale(${numScale})`}>
        <circle cx={0} cy={0} r={28} fill={accentColor} opacity={0.15} />
        <circle cx={0} cy={0} r={22} fill="none" stroke={accentColor} strokeWidth={2} />
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Inter, sans-serif"
          fontSize={24}
          fontWeight={800}
          fill={accentColor}
        >
          {number}
        </text>
      </g>

      {/* ── icon area ── */}
      <g transform="translate(110, 10)" opacity={glowOpacity + 0.3}>
        {icon}
      </g>

      {/* ── title ── */}
      <text
        x={170}
        y={20}
        fontFamily="Inter, sans-serif"
        fontSize={32}
        fontWeight={700}
        fill={COLORS.soft_white}
        letterSpacing={0.5}
      >
        {title}
      </text>

      {/* ── subtitle ── */}
      <text
        x={170}
        y={60}
        fontFamily="Inter, sans-serif"
        fontSize={21}
        fontWeight={400}
        fill={COLORS.cool_silver}
        letterSpacing={0.5}
      >
        {subtitle}
      </text>

      {/* ── bottom divider line ── */}
      <line
        x1={50}
        y1={105}
        x2={50 + lineWidth}
        y2={105}
        stroke={accentColor}
        strokeWidth={0.8}
        opacity={0.25}
      />
    </g>
  );
};

/* ─── Decorative orbit ring ─── */
const OrbitRing: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  opacity: number;
  color: string;
}> = ({ cx, cy, rx, ry, rotation, opacity, color }) => (
  <ellipse
    cx={cx}
    cy={cy}
    rx={rx}
    ry={ry}
    fill="none"
    stroke={color}
    strokeWidth={1}
    strokeDasharray="6 8"
    opacity={opacity}
    transform={`rotate(${rotation}, ${cx}, ${cy})`}
  />
);

/* ─── Floating dot decoration ─── */
const FloatingDot: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
  frame: number;
  delay: number;
}> = ({ x, y, r, color, frame, delay }) => {
  const yOffset = interpolate(
    (frame + delay) % 24,
    [0, 12, 24],
    [0, -15, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const opacity = interpolate(frame, [delay, delay + 8], [0, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  return <circle cx={x} cy={y + yOffset} r={r} fill={color} opacity={opacity} />;
};

/* ─── Icon components for each bullet ─── */
const StepsIcon: React.FC = () => (
  <g>
    <rect x={-8} y={-12} width={16} height={4} rx={2} fill={COLORS.electric_cyan} />
    <rect x={-8} y={-4} width={16} height={4} rx={2} fill={COLORS.electric_cyan} opacity={0.7} />
    <rect x={-8} y={4} width={16} height={4} rx={2} fill={COLORS.electric_cyan} opacity={0.5} />
    <rect x={-8} y={12} width={16} height={4} rx={2} fill={COLORS.electric_cyan} opacity={0.3} />
  </g>
);

const RealIcon: React.FC = () => (
  <g>
    <circle cx={0} cy={0} r={12} fill="none" stroke={COLORS.vibrant_green} strokeWidth={2} />
    <path d="M -5,0 L -1,5 L 7,-5" fill="none" stroke={COLORS.vibrant_green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const CircleIcon: React.FC = () => (
  <g>
    <circle cx={0} cy={0} r={11} fill="none" stroke={COLORS.amber} strokeWidth={2} />
    <path d="M 8,-6 A 11,11 0 1,1 -8,-6" fill="none" stroke={COLORS.amber} strokeWidth={2.5} strokeLinecap="round" />
    <polygon points="9,-3 6,-9 12,-8" fill={COLORS.amber} />
  </g>
);

const EverythingIcon: React.FC = () => (
  <g>
    <circle cx={0} cy={0} r={10} fill={COLORS.purple} opacity={0.3} />
    <circle cx={0} cy={0} r={6} fill={COLORS.purple} opacity={0.5} />
    <circle cx={0} cy={0} r={3} fill={COLORS.purple} />
  </g>
);

/* ─── Main component ─── */
export const Scene23_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── master entrance ── */
  const masterIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── header animations ── */
  const headerOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const headerY = interpolate(frame, [0, 8], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── underline animation ── */
  const underlineWidth = interpolate(frame, [4, 14], [0, 400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── orbit rotation ── */
  const orbitRotation = interpolate(frame, [0, 36], [0, 45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* ── orbit opacity ── */
  const orbitOpacity = interpolate(frame, [2, 12], [0, 0.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── checkmark at bottom ── */
  const checkOpacity = interpolate(frame, [24, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const checkScale = interpolate(frame, [24, 32], [0.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── decorative dots ── */
  const dots = [
    { x: 80, y: 500, r: 3, color: COLORS.electric_cyan, delay: 2 },
    { x: 1000, y: 600, r: 4, color: COLORS.warm_blue, delay: 5 },
    { x: 120, y: 1100, r: 3.5, color: COLORS.purple, delay: 8 },
    { x: 960, y: 1200, r: 3, color: COLORS.amber, delay: 4 },
    { x: 90, y: 850, r: 4, color: COLORS.vibrant_green, delay: 10 },
    { x: 990, y: 900, r: 3, color: COLORS.electric_cyan, delay: 7 },
    { x: 150, y: 1400, r: 3.5, color: COLORS.warm_blue, delay: 12 },
    { x: 930, y: 1350, r: 4, color: COLORS.purple, delay: 6 },
  ];

  const bracketScale = scaleAnim(frame, 0, 12);
  const captionOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── bullet point data ── */
  const bullets = [
    {
      number: '1',
      title: 'The loop has 4 steps',
      subtitle: 'Think → Act → Observe → Adapt — then repeat',
      icon: <StepsIcon />,
      accentColor: COLORS.electric_cyan,
      delay: 5,
    },
    {
      number: '2',
      title: 'It is NOT a metaphor',
      subtitle: 'This is actual architecture — real running code',
      icon: <RealIcon />,
      accentColor: COLORS.vibrant_green,
      delay: 10,
    },
    {
      number: '3',
      title: 'Circle beats the line',
      subtitle: 'Linear fails — the loop adapts to the unknown',
      icon: <CircleIcon />,
      accentColor: COLORS.amber,
      delay: 15,
    },
    {
      number: '4',
      title: 'The loop IS the agent',
      subtitle: 'Without the loop, it is just a language model',
      icon: <EverythingIcon />,
      accentColor: COLORS.purple,
      delay: 20,
    },
  ];

  return (
    <AbsoluteFill>
      <BlackBackground />
      <GlobalDefs />

      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── decorative orbit rings ── */}
        <OrbitRing cx={540} cy={960} rx={450} ry={200} rotation={orbitRotation} opacity={orbitOpacity} color={COLORS.electric_cyan} />
        <OrbitRing cx={540} cy={960} rx={380} ry={170} rotation={-orbitRotation * 0.7} opacity={orbitOpacity * 0.7} color={COLORS.warm_blue} />
        <OrbitRing cx={540} cy={960} rx={500} ry={220} rotation={orbitRotation * 0.5} opacity={orbitOpacity * 0.5} color={COLORS.purple} />

        {/* ── header ── */}
        <g opacity={headerOpacity} transform={`translate(0, ${headerY})`}>
          <text
            x={540}
            y={360}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={58}
            fontWeight={800}
            fill={COLORS.soft_white}
            letterSpacing={2}
          >
            KEY TAKEAWAYS
          </text>
          <line
            x1={540 - underlineWidth / 2}
            y1={390}
            x2={540 + underlineWidth / 2}
            y2={390}
            stroke={COLORS.electric_cyan}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* ── bullet points ── */}
        {bullets.map((bullet, i) => (
          <BulletPoint
            key={`bullet-${i}`}
            x={100}
            y={520 + i * 210}
            number={bullet.number}
            title={bullet.title}
            subtitle={bullet.subtitle}
            icon={bullet.icon}
            accentColor={bullet.accentColor}
            frame={frame}
            delay={bullet.delay}
          />
        ))}

        {/* ── decorative floating dots ── */}
        {dots.map((dot, i) => (
          <FloatingDot key={`dot-${i}`} {...dot} frame={frame} />
        ))}

        {/* ── summary check mark at bottom ── */}
        <g
          transform={`translate(540, 1500) scale(${checkScale})`}
          opacity={checkOpacity}
        >
          <circle cx={0} cy={0} r={35} fill={COLORS.vibrant_green} opacity={0.15} />
          <circle cx={0} cy={0} r={25} fill="none" stroke={COLORS.vibrant_green} strokeWidth={2.5} />
          <path
            d="M -10,0 L -3,8 L 12,-8"
            fill="none"
            stroke={COLORS.vibrant_green}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ── "remember this" label ── */}
        <g opacity={checkOpacity}>
          <text
            x={540}
            y={1570}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={20}
            fontWeight={600}
            fill={COLORS.cool_silver}
            letterSpacing={4}
          >
            REMEMBER THIS
          </text>
        </g>
      </svg>

      <CornerBrackets scale={bracketScale} />
      <SectionLabel text="TAKEAWAYS" opacity={masterIn} />
      <CaptionBar
        text="Four takeaways — the loop is everything"
        opacity={captionOpacity}
        highlightWords={['Four', 'takeaways', 'everything']}
      />
    </AbsoluteFill>
  );
};

export default Scene23_KeyTakeaway;
