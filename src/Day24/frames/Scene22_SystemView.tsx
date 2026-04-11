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
  AIRobot,
  ProcessorUnit,
  WorldGlobe,
  SectionLabel,
} from '../helpers/components';

const smoothBezier = Easing.bezier(0.22, 1, 0.36, 1);

/* ─── Data flow particle ─── */
const DataParticle: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  frame: number;
  color: string;
  size: number;
}> = ({ startX, startY, endX, endY, delay, frame, color, size }) => {
  const progress = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const x = interpolate(progress, [0, 1], [startX, endX]);
  const y = interpolate(progress, [0, 1], [startY, endY]);
  const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 1, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <circle cx={x} cy={y} r={size} fill={color} opacity={opacity} />;
};

/* ─── Connection line between agents ─── */
const ConnectionLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  frame: number;
  delay: number;
  color: string;
}> = ({ x1, y1, x2, y2, frame, delay, color }) => {
  const opacity = interpolate(frame, [delay, delay + 10], [0, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const dashOffset = interpolate(frame, [delay, delay + 36], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={1.5}
      strokeDasharray="8 6"
      strokeDashoffset={dashOffset}
      opacity={opacity}
    />
  );
};

/* ─── Single agent loop visualization ─── */
const AgentInstance: React.FC<{
  cx: number;
  cy: number;
  label: string;
  color: string;
  accentColor: string;
  frame: number;
  delay: number;
  loopPhase: number;
}> = ({ cx, cy, label, color, accentColor, frame, delay, loopPhase }) => {
  const entryScale = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const entryOpacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* rotating loop indicator */
  const rotation = interpolate(frame, [delay + 5, delay + 36], [0, 360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* pulsing ring */
  const pulseR = interpolate(
    (frame + loopPhase) % 18,
    [0, 9, 18],
    [60, 72, 60],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const pulseOpacity = interpolate(
    (frame + loopPhase) % 18,
    [0, 9, 18],
    [0.15, 0.35, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  /* status indicator blink */
  const statusOpacity = interpolate(
    (frame + loopPhase) % 12,
    [0, 6, 12],
    [0.4, 1, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const stepLabels = ['THINK', 'ACT', 'OBSERVE', 'ADAPT'];
  const activeStep = Math.floor(((frame + loopPhase) % 24) / 6);

  return (
    <g
      transform={`translate(${cx}, ${cy}) scale(${entryScale})`}
      opacity={entryOpacity}
    >
      {/* outer pulse ring */}
      <circle
        cx={0}
        cy={0}
        r={pulseR}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.5}
        opacity={pulseOpacity}
      />

      {/* main agent circle */}
      <circle
        cx={0}
        cy={0}
        r={55}
        fill={COLORS.deep_black}
        stroke={color}
        strokeWidth={2.5}
      />

      {/* inner rotating arc */}
      <g transform={`rotate(${rotation})`}>
        <path
          d="M -40,0 A 40,40 0 0,1 40,0"
          fill="none"
          stroke={accentColor}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.7}
        />
        <circle cx={40} cy={0} r={4} fill={accentColor} />
      </g>

      {/* agent icon */}
      <g transform="translate(0, -8)">
        <circle cx={0} cy={-8} r={10} fill={color} opacity={0.9} />
        <rect x={-14} y={6} width={28} height={16} rx={5} fill={color} opacity={0.7} />
      </g>

      {/* label */}
      <text
        x={0}
        y={85}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize={22}
        fontWeight={700}
        fill={color}
        letterSpacing={1}
      >
        {label}
      </text>

      {/* status dot */}
      <circle cx={40} cy={-40} r={5} fill={COLORS.vibrant_green} opacity={statusOpacity} />

      {/* active step label */}
      <text
        x={0}
        y={112}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={14}
        fontWeight={600}
        fill={accentColor}
        opacity={0.8}
      >
        {stepLabels[activeStep]}
      </text>
    </g>
  );
};

/* ─── System status panel ─── */
const StatusPanel: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  frame: number;
  delay: number;
}> = ({ x, y, width, height, frame, delay }) => {
  const opacity = interpolate(frame, [delay, delay + 10], [0, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const barWidths = [0.7, 0.5, 0.9, 0.6, 0.8];
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={COLORS.deep_black}
        stroke={COLORS.electric_cyan}
        strokeWidth={1}
        opacity={0.6}
      />
      <text
        x={x + 12}
        y={y + 20}
        fontFamily="monospace"
        fontSize={12}
        fill={COLORS.electric_cyan}
        opacity={0.7}
      >
        SYSTEM STATUS
      </text>
      {barWidths.map((w, i) => {
        const barProgress = interpolate(frame, [delay + 4 + i * 2, delay + 12 + i * 2], [0, w], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: smoothBezier,
        });
        return (
          <g key={`status-bar-${i}`}>
            <rect
              x={x + 12}
              y={y + 32 + i * 18}
              width={(width - 24) * barProgress}
              height={8}
              rx={4}
              fill={i === 2 ? COLORS.vibrant_green : COLORS.warm_blue}
              opacity={0.6}
            />
            <rect
              x={x + 12}
              y={y + 32 + i * 18}
              width={width - 24}
              height={8}
              rx={4}
              fill="none"
              stroke={COLORS.cool_silver}
              strokeWidth={0.5}
              opacity={0.3}
            />
          </g>
        );
      })}
    </g>
  );
};

/* ─── Main component ─── */
export const Scene22_SystemView: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── master entrance ── */
  const masterIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── title animations ── */
  const titleOpacity = interpolate(frame, [2, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const titleY = interpolate(frame, [2, 10], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── subtitle ── */
  const subOpacity = interpolate(frame, [8, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── grid lines ── */
  const gridOpacity = interpolate(frame, [0, 12], [0, 0.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── data particles ── */
  const dataParticles = [
    { startX: 270, startY: 700, endX: 540, endY: 700, delay: 10, color: COLORS.electric_cyan, size: 3 },
    { startX: 540, startY: 700, endX: 810, endY: 700, delay: 14, color: COLORS.warm_blue, size: 3 },
    { startX: 270, startY: 700, endX: 270, endY: 1050, delay: 16, color: COLORS.purple, size: 2.5 },
    { startX: 810, startY: 700, endX: 810, endY: 1050, delay: 18, color: COLORS.amber, size: 2.5 },
    { startX: 540, startY: 700, endX: 540, endY: 1050, delay: 12, color: COLORS.vibrant_green, size: 3 },
    { startX: 270, startY: 1050, endX: 540, endY: 1050, delay: 20, color: COLORS.electric_cyan, size: 2 },
    { startX: 540, startY: 1050, endX: 810, endY: 1050, delay: 22, color: COLORS.warm_blue, size: 2 },
  ];

  const bracketScale = scaleAnim(frame, 0, 12);

  const captionOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

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

        {/* ── background grid ── */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={`hgrid-${i}`}
            x1={0}
            y1={i * 96}
            x2={1080}
            y2={i * 96}
            stroke={COLORS.cool_silver}
            strokeWidth={0.5}
            opacity={gridOpacity}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`vgrid-${i}`}
            x1={i * 90}
            y1={0}
            x2={i * 90}
            y2={1920}
            stroke={COLORS.cool_silver}
            strokeWidth={0.5}
            opacity={gridOpacity}
          />
        ))}

        {/* ── title ── */}
        <g opacity={titleOpacity} transform={`translate(0, ${titleY})`}>
          <text
            x={540}
            y={340}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={52}
            fontWeight={800}
            fill={COLORS.soft_white}
            letterSpacing={3}
          >
            PRODUCTION SYSTEM
          </text>
          <line x1={340} y1={365} x2={740} y2={365} stroke={COLORS.electric_cyan} strokeWidth={2} opacity={0.5} />
        </g>

        {/* ── subtitle ── */}
        <g opacity={subOpacity}>
          <text
            x={540}
            y={420}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={26}
            fontWeight={400}
            fill={COLORS.cool_silver}
            letterSpacing={5}
          >
            MULTI-AGENT ORCHESTRATION
          </text>
        </g>

        {/* ── connection lines ── */}
        <ConnectionLine x1={270} y1={700} x2={540} y2={700} frame={frame} delay={6} color={COLORS.electric_cyan} />
        <ConnectionLine x1={540} y1={700} x2={810} y2={700} frame={frame} delay={8} color={COLORS.warm_blue} />
        <ConnectionLine x1={270} y1={700} x2={270} y2={1050} frame={frame} delay={10} color={COLORS.purple} />
        <ConnectionLine x1={540} y1={700} x2={540} y2={1050} frame={frame} delay={10} color={COLORS.electric_cyan} />
        <ConnectionLine x1={810} y1={700} x2={810} y2={1050} frame={frame} delay={10} color={COLORS.amber} />

        {/* ── three agent instances ── */}
        <AgentInstance cx={270} cy={700} label="AGENT α" color={COLORS.electric_cyan} accentColor={COLORS.vibrant_green} frame={frame} delay={3} loopPhase={0} />
        <AgentInstance cx={540} cy={700} label="AGENT β" color={COLORS.warm_blue} accentColor={COLORS.amber} frame={frame} delay={6} loopPhase={8} />
        <AgentInstance cx={810} cy={700} label="AGENT γ" color={COLORS.purple} accentColor={COLORS.electric_cyan} frame={frame} delay={9} loopPhase={16} />

        {/* ── shared world / environment ── */}
        <g transform="translate(540, 1050)">
          <WorldGlobe />
        </g>

        {/* ── data particles ── */}
        {dataParticles.map((p, i) => (
          <DataParticle key={`dp-${i}`} {...p} frame={frame} />
        ))}

        {/* ── status panels ── */}
        <StatusPanel x={80} y={1300} width={200} height={140} frame={frame} delay={12} />
        <StatusPanel x={440} y={1300} width={200} height={140} frame={frame} delay={15} />
        <StatusPanel x={800} y={1300} width={200} height={140} frame={frame} delay={18} />

        {/* ── "all running simultaneously" label ── */}
        <g opacity={subOpacity}>
          <text
            x={540}
            y={1520}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={22}
            fontWeight={600}
            fill={COLORS.vibrant_green}
            letterSpacing={3}
          >
            ALL LOOPS RUNNING SIMULTANEOUSLY
          </text>
        </g>
      </svg>

      <CornerBrackets scale={bracketScale} />
      <SectionLabel text="SYSTEM VIEW" opacity={masterIn} />
      <CaptionBar
        text="In production — multiple agents loop at once"
        opacity={captionOpacity}
        highlightWords={['multiple', 'agents', 'loop']}
      />
    </AbsoluteFill>
  );
};

export default Scene22_SystemView;
