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

/* ─── Heartbeat ECG path data ─── */
const ECG_PATH =
  'M 0,0 L 60,0 L 80,-15 L 100,0 L 140,0 L 155,-60 L 170,40 L 185,-10 L 200,0 L 260,0 L 280,-15 L 300,0 L 340,0 L 355,-60 L 370,40 L 385,-10 L 400,0 L 460,0 L 480,-15 L 500,0 L 540,0 L 555,-60 L 570,40 L 585,-10 L 600,0 L 700,0';

/* ─── Concentric pulse ring ─── */
const PulseRing: React.FC<{
  cx: number;
  cy: number;
  delay: number;
  maxR: number;
  color: string;
  frame: number;
}> = ({ cx, cy, delay, maxR, color, frame }) => {
  const progress = interpolate(frame, [delay, delay + 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const r = interpolate(progress, [0, 1], [0, maxR]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      opacity={opacity}
    />
  );
};

/* ─── Floating particle ─── */
const FloatingParticle: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  frame: number;
}> = ({ x, y, size, delay, color, frame }) => {
  const progress = interpolate(frame, [delay, delay + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const py = interpolate(progress, [0, 1], [y, y - 80]);
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.8, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(progress, [0, 0.5, 1], [0.4, 1, 0.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <circle
      cx={x}
      cy={py}
      r={size * scale}
      fill={color}
      opacity={opacity}
    />
  );
};

/* ─── Infinity symbol component ─── */
const InfinitySymbol: React.FC<{
  cx: number;
  cy: number;
  size: number;
  opacity: number;
  rotation: number;
  color: string;
  glowColor: string;
}> = ({ cx, cy, size, opacity, rotation, color, glowColor }) => {
  return (
    <g
      transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${size})`}
      opacity={opacity}
    >
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, serif"
        fontSize={120}
        fontWeight="bold"
        fill="none"
        stroke={glowColor}
        strokeWidth={6}
        opacity={0.3}
        filter="url(#softGlow)"
      >
        ∞
      </text>
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, serif"
        fontSize={120}
        fontWeight="bold"
        fill={color}
        stroke={color}
        strokeWidth={1.5}
      >
        ∞
      </text>
    </g>
  );
};

/* ─── Heartbeat line with animated dash ─── */
const HeartbeatLine: React.FC<{
  y: number;
  progress: number;
  color: string;
  glowColor: string;
}> = ({ y, progress, color, glowColor }) => {
  const dashOffset = interpolate(progress, [0, 1], [700, 0]);
  return (
    <g transform={`translate(190, ${y})`}>
      <path
        d={ECG_PATH}
        fill="none"
        stroke={glowColor}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.25}
        filter="url(#softGlow)"
        strokeDasharray={700}
        strokeDashoffset={dashOffset}
      />
      <path
        d={ECG_PATH}
        fill="none"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={700}
        strokeDashoffset={dashOffset}
      />
    </g>
  );
};

/* ─── Vertical pulse bar ─── */
const PulseBar: React.FC<{
  x: number;
  frame: number;
  delay: number;
  height: number;
  color: string;
}> = ({ x, frame, delay, height, color }) => {
  const barH = interpolate(frame, [delay, delay + 8, delay + 18], [0, height, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const opacity = interpolate(frame, [delay, delay + 4, delay + 18], [0, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <rect
      x={x - 3}
      y={960 - barH / 2}
      width={6}
      rx={3}
      height={barH}
      fill={color}
      opacity={opacity}
    />
  );
};

/* ─── Main component ─── */
export const Scene21_HeartbeatRepeat: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── master animations ── */
  const masterIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const ecgProgress = interpolate(frame, [3, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── infinity symbol ── */
  const infOpacity = interpolate(frame, [6, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const infScale = interpolate(frame, [6, 14], [0.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const infRotation = interpolate(frame, [6, 36], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── pulse glow factor ── */
  const pulseGlow = interpolate(
    frame % 12,
    [0, 6, 12],
    [0.4, 1, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  /* ── label animations ── */
  const labelOpacity = interpolate(frame, [8, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const labelY = interpolate(frame, [8, 15], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── sub-label ── */
  const subOpacity = interpolate(frame, [14, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const subY = interpolate(frame, [14, 22], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── loop arrow ── */
  const loopOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── corner brackets ── */
  const bracketScale = scaleAnim(frame, 0, 15);

  /* ── caption ── */
  const captionOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── particle data ── */
  const particles = [
    { x: 200, y: 750, size: 4, delay: 5, color: COLORS.electric_cyan },
    { x: 350, y: 820, size: 3, delay: 8, color: COLORS.warm_blue },
    { x: 540, y: 700, size: 5, delay: 3, color: COLORS.purple },
    { x: 700, y: 780, size: 3.5, delay: 10, color: COLORS.electric_cyan },
    { x: 880, y: 830, size: 4.5, delay: 7, color: COLORS.amber },
    { x: 150, y: 1100, size: 3, delay: 12, color: COLORS.vibrant_green },
    { x: 400, y: 1150, size: 4, delay: 6, color: COLORS.warm_blue },
    { x: 620, y: 1080, size: 5, delay: 9, color: COLORS.electric_cyan },
    { x: 800, y: 1120, size: 3.5, delay: 14, color: COLORS.purple },
    { x: 950, y: 1050, size: 4, delay: 11, color: COLORS.amber },
    { x: 280, y: 650, size: 3, delay: 16, color: COLORS.vibrant_green },
    { x: 760, y: 680, size: 4, delay: 4, color: COLORS.electric_cyan },
  ];

  /* ── pulse bar positions ── */
  const barPositions = [
    { x: 160, delay: 2, height: 120 },
    { x: 240, delay: 4, height: 180 },
    { x: 320, delay: 6, height: 90 },
    { x: 400, delay: 3, height: 200 },
    { x: 480, delay: 8, height: 140 },
    { x: 560, delay: 5, height: 170 },
    { x: 640, delay: 7, height: 110 },
    { x: 720, delay: 9, height: 190 },
    { x: 800, delay: 4, height: 130 },
    { x: 880, delay: 6, height: 160 },
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
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity={0.15 * pulseGlow} />
            <stop offset="60%" stopColor={COLORS.warm_blue} stopOpacity={0.05 * pulseGlow} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.electric_cyan} />
            <stop offset="50%" stopColor={COLORS.vibrant_green} />
            <stop offset="100%" stopColor={COLORS.electric_cyan} />
          </linearGradient>
        </defs>

        {/* ── ambient glow ── */}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#centerGlow)" opacity={masterIn} />

        {/* ── pulse bars ── */}
        {barPositions.map((bar, i) => (
          <PulseBar
            key={`bar-${i}`}
            x={bar.x}
            frame={frame}
            delay={bar.delay}
            height={bar.height}
            color={COLORS.electric_cyan}
          />
        ))}

        {/* ── ECG lines ── */}
        <HeartbeatLine y={620} progress={ecgProgress} color="url(#ecgGrad)" glowColor={COLORS.electric_cyan} />
        <HeartbeatLine y={1240} progress={ecgProgress} color="url(#ecgGrad)" glowColor={COLORS.vibrant_green} />

        {/* ── concentric pulse rings ── */}
        {[0, 5, 10, 15, 20].map((delay, i) => (
          <PulseRing
            key={`ring-${i}`}
            cx={540}
            cy={920}
            delay={delay}
            maxR={180 + i * 50}
            color={i % 2 === 0 ? COLORS.electric_cyan : COLORS.warm_blue}
            frame={frame}
          />
        ))}

        {/* ── infinity symbol ── */}
        <InfinitySymbol
          cx={540}
          cy={920}
          size={infScale}
          opacity={infOpacity}
          rotation={infRotation}
          color={COLORS.soft_white}
          glowColor={COLORS.electric_cyan}
        />

        {/* ── floating particles ── */}
        {particles.map((p, i) => (
          <FloatingParticle key={`p-${i}`} {...p} frame={frame} />
        ))}

        {/* ── section label ── */}
        <g opacity={labelOpacity} transform={`translate(0, ${labelY})`}>
          <text
            x={540}
            y={440}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={56}
            fontWeight={800}
            fill={COLORS.soft_white}
            letterSpacing={2}
          >
            THE LOOP REPEATS
          </text>
        </g>

        {/* ── sub-label ── */}
        <g opacity={subOpacity} transform={`translate(0, ${subY})`}>
          <text
            x={540}
            y={520}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={30}
            fontWeight={400}
            fill={COLORS.cool_silver}
            letterSpacing={4}
          >
            ENDLESSLY · TIRELESSLY · FOREVER
          </text>
        </g>

        {/* ── loop arrow at bottom ── */}
        <g opacity={loopOpacity} transform="translate(440, 1400)">
          <LoopArrow />
        </g>

        {/* ── decorative thin lines ── */}
        <line
          x1={100}
          y1={580}
          x2={980}
          y2={580}
          stroke={COLORS.electric_cyan}
          strokeWidth={0.5}
          opacity={0.2 * masterIn}
        />
        <line
          x1={100}
          y1={1300}
          x2={980}
          y2={1300}
          stroke={COLORS.vibrant_green}
          strokeWidth={0.5}
          opacity={0.2 * masterIn}
        />
      </svg>

      <CornerBrackets scale={bracketScale} />
      <SectionLabel text="HEARTBEAT" opacity={masterIn} />
      <CaptionBar
        text="The loop repeats — endlessly, tirelessly"
        opacity={captionOpacity}
        highlightWords={['repeats', 'endlessly']}
      />
    </AbsoluteFill>
  );
};

export default Scene21_HeartbeatRepeat;
