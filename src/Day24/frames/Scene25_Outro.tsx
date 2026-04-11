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

/* ─── Dissolving particle ─── */
const DissolveParticle: React.FC<{
  originX: number;
  originY: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  frame: number;
  startFrame: number;
}> = ({ originX, originY, angle, distance, size, color, frame, startFrame }) => {
  const progress = interpolate(frame, [startFrame, startFrame + 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const rad = (angle * Math.PI) / 180;
  const x = originX + Math.cos(rad) * distance * progress;
  const y = originY + Math.sin(rad) * distance * progress;
  const opacity = interpolate(progress, [0, 0.2, 0.7, 1], [0, 0.9, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const r = interpolate(progress, [0, 0.3, 1], [0, size, size * 0.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <circle cx={x} cy={y} r={r} fill={color} opacity={opacity} />;
};

/* ─── Social CTA button ─── */
const SocialButton: React.FC<{
  x: number;
  y: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  frame: number;
  delay: number;
}> = ({ x, y, label, icon, color, frame, delay }) => {
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const scale = interpolate(frame, [delay, delay + 12], [0.7, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      opacity={opacity * fadeOut}
    >
      <rect
        x={-110}
        y={-25}
        width={220}
        height={50}
        rx={25}
        fill={COLORS.deep_black}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.7}
      />
      <g transform="translate(-80, 0)">{icon}</g>
      <text
        x={10}
        y={6}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize={18}
        fontWeight={600}
        fill={color}
        letterSpacing={2}
      >
        {label}
      </text>
    </g>
  );
};

/* ─── Expanding ring ─── */
const ExpandRing: React.FC<{
  cx: number;
  cy: number;
  delay: number;
  maxR: number;
  color: string;
  frame: number;
  duration: number;
}> = ({ cx, cy, delay, maxR, color, frame, duration }) => {
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const r = interpolate(progress, [0, 1], [0, maxR]);
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.4, 0], {
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
      strokeWidth={1.5}
      opacity={opacity}
    />
  );
};

/* ─── Subtle grid background ─── */
const SubtleGrid: React.FC<{ opacity: number }> = ({ opacity: gridOpacity }) => (
  <g opacity={gridOpacity}>
    {Array.from({ length: 20 }).map((_, i) => (
      <line
        key={`hg-${i}`}
        x1={0}
        y1={i * 96}
        x2={1080}
        y2={i * 96}
        stroke={COLORS.cool_silver}
        strokeWidth={0.3}
      />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <line
        key={`vg-${i}`}
        x1={i * 90}
        y1={0}
        x2={i * 90}
        y2={1920}
        stroke={COLORS.cool_silver}
        strokeWidth={0.3}
      />
    ))}
  </g>
);

/* ─── Social icon SVGs ─── */
const FollowIcon: React.FC = () => (
  <g>
    <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5} />
    <line x1={0} y1={-4} x2={0} y2={4} stroke={COLORS.electric_cyan} strokeWidth={1.5} />
    <line x1={-4} y1={0} x2={4} y2={0} stroke={COLORS.electric_cyan} strokeWidth={1.5} />
  </g>
);

const ShareIcon: React.FC = () => (
  <g>
    <circle cx={-6} cy={0} r={4} fill="none" stroke={COLORS.vibrant_green} strokeWidth={1.5} />
    <circle cx={6} cy={-6} r={3} fill="none" stroke={COLORS.vibrant_green} strokeWidth={1.5} />
    <circle cx={6} cy={6} r={3} fill="none" stroke={COLORS.vibrant_green} strokeWidth={1.5} />
    <line x1={-3} y1={-2} x2={4} y2={-5} stroke={COLORS.vibrant_green} strokeWidth={1} />
    <line x1={-3} y1={2} x2={4} y2={5} stroke={COLORS.vibrant_green} strokeWidth={1} />
  </g>
);

const CommentIcon: React.FC = () => (
  <g>
    <rect x={-8} y={-6} width={16} height={12} rx={3} fill="none" stroke={COLORS.amber} strokeWidth={1.5} />
    <polygon points="-2,6 2,6 0,10" fill={COLORS.amber} />
  </g>
);

/* ─── Main component ─── */
export const Scene25_Outro: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── "DAY 24" text animations ── */
  const dayOpacity = interpolate(frame, [0, 12, 55, 75], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const dayScale = interpolate(frame, [0, 12], [0.6, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const dayY = interpolate(frame, [55, 75], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── series title ── */
  const seriesOpacity = interpolate(frame, [8, 18, 60, 80], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── subtitle ── */
  const subOpacity = interpolate(frame, [14, 24, 60, 80], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });
  const subY = interpolate(frame, [14, 24], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── underline ── */
  const lineW = interpolate(frame, [10, 25], [0, 500], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── grid fade ── */
  const gridOpacity = interpolate(frame, [0, 15, 65, 85], [0, 0.06, 0.06, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* ── global fade out ── */
  const globalFade = interpolate(frame, [75, 94], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  /* ── dissolving particles data ── */
  const dissolveParticles = Array.from({ length: 40 }).map((_, i) => {
    const angle = (i / 40) * 360 + (i * 37);
    const distance = 150 + (i * 23) % 250;
    const size = 2 + (i * 7) % 5;
    const startFrame = 50 + (i * 0.6);
    const colors = [COLORS.electric_cyan, COLORS.warm_blue, COLORS.purple, COLORS.amber, COLORS.cool_silver];
    return {
      originX: 540,
      originY: 700,
      angle,
      distance,
      size,
      color: colors[i % 5],
      startFrame,
    };
  });

  /* ── expanding rings ── */
  const rings = [
    { cx: 540, cy: 700, delay: 55, maxR: 300, color: COLORS.electric_cyan, duration: 30 },
    { cx: 540, cy: 700, delay: 60, maxR: 250, color: COLORS.warm_blue, duration: 25 },
    { cx: 540, cy: 700, delay: 65, maxR: 350, color: COLORS.purple, duration: 28 },
    { cx: 540, cy: 700, delay: 58, maxR: 200, color: COLORS.cool_silver, duration: 22 },
  ];

  /* ── branding pulse ── */
  const brandingPulse = interpolate(
    frame % 20,
    [0, 10, 20],
    [0.6, 1, 0.6],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  /* ── "The Agent Loop" label ── */
  const topicOpacity = interpolate(frame, [5, 15, 55, 70], [0, 0.8, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  const bracketScale = scaleAnim(frame, 0, 12);
  const captionOpacity = interpolate(frame, [6, 14, 65, 80], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smoothBezier,
  });

  return (
    <AbsoluteFill>
      <BlackBackground />
      <GlobalDefs />

      <svg
        viewBox="0 0 1080 1920"
        width="1080"
        height="1920"
        opacity={globalFade}
      >
        <defs>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="centerVignette" cx="50%" cy="37%" r="50%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity={0.06} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* ── subtle grid ── */}
        <SubtleGrid opacity={gridOpacity} />

        {/* ── center vignette ── */}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#centerVignette)" />

        {/* ── expanding rings (dissolution) ── */}
        {rings.map((ring, i) => (
          <ExpandRing key={`ring-${i}`} {...ring} frame={frame} />
        ))}

        {/* ── dissolving particles ── */}
        {dissolveParticles.map((p, i) => (
          <DissolveParticle key={`dissolve-${i}`} {...p} frame={frame} />
        ))}

        {/* ── topic label ── */}
        <g opacity={topicOpacity}>
          <text
            x={540}
            y={520}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={24}
            fontWeight={500}
            fill={COLORS.cool_silver}
            letterSpacing={6}
          >
            THE AGENT LOOP
          </text>
        </g>

        {/* ── "DAY 24" main text ── */}
        <g
          opacity={dayOpacity}
          transform={`translate(540, ${700 + dayY}) scale(${dayScale})`}
        >
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={110}
            fontWeight={900}
            fill={COLORS.soft_white}
            letterSpacing={8}
          >
            DAY 24
          </text>
          {/* glow version behind */}
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={110}
            fontWeight={900}
            fill={COLORS.electric_cyan}
            letterSpacing={8}
            opacity={0.08}
            filter="url(#softGlow)"
          >
            DAY 24
          </text>
        </g>

        {/* ── underline ── */}
        <line
          x1={540 - lineW / 2}
          y1={740}
          x2={540 + lineW / 2}
          y2={740}
          stroke={COLORS.electric_cyan}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={dayOpacity * 0.6}
        />

        {/* ── series branding ── */}
        <g opacity={seriesOpacity}>
          <text
            x={540}
            y={830}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={36}
            fontWeight={700}
            fill={COLORS.electric_cyan}
            letterSpacing={4}
            opacity={brandingPulse}
          >
            AGENTIC AI — 30 DAYS
          </text>
        </g>

        {/* ── subtitle ── */}
        <g opacity={subOpacity} transform={`translate(0, ${subY})`}>
          <text
            x={540}
            y={890}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={22}
            fontWeight={400}
            fill={COLORS.cool_silver}
            letterSpacing={3}
          >
            Building intelligence, one day at a time
          </text>
        </g>

        {/* ── decorative dots at center ── */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const dotR = 100;
          const dotOpacity = interpolate(frame, [10 + i * 2, 20 + i * 2, 65, 80], [0, 0.5, 0.5, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <circle
              key={`decor-${i}`}
              cx={540 + Math.cos(rad) * dotR}
              cy={700 + Math.sin(rad) * dotR}
              r={3}
              fill={COLORS.electric_cyan}
              opacity={dotOpacity}
            />
          );
        })}

        {/* ── social CTA buttons ── */}
        <SocialButton
          x={540}
          y={1100}
          label="FOLLOW"
          icon={<FollowIcon />}
          color={COLORS.electric_cyan}
          frame={frame}
          delay={20}
        />
        <SocialButton
          x={540}
          y={1180}
          label="SHARE"
          icon={<ShareIcon />}
          color={COLORS.vibrant_green}
          frame={frame}
          delay={24}
        />
        <SocialButton
          x={540}
          y={1260}
          label="COMMENT"
          icon={<CommentIcon />}
          color={COLORS.amber}
          frame={frame}
          delay={28}
        />

        {/* ── "See you tomorrow" ── */}
        <g opacity={interpolate(frame, [30, 40, 65, 82], [0, 0.7, 0.7, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: smoothBezier,
        })}>
          <text
            x={540}
            y={1420}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={20}
            fontWeight={500}
            fill={COLORS.cool_silver}
            letterSpacing={5}
          >
            SEE YOU TOMORROW
          </text>
        </g>

        {/* ── bottom decorative line ── */}
        <line
          x1={340}
          y1={1480}
          x2={740}
          y2={1480}
          stroke={COLORS.electric_cyan}
          strokeWidth={0.8}
          opacity={interpolate(frame, [25, 35, 70, 88], [0, 0.3, 0.3, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
      </svg>

      <CornerBrackets scale={bracketScale} />
      <SectionLabel text="OUTRO" opacity={interpolate(frame, [0, 10, 70, 90], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })} />
      <CaptionBar
        text="Day 24 — The Agent Loop — complete"
        opacity={captionOpacity}
        highlightWords={['Day 24', 'Agent Loop', 'complete']}
      />
    </AbsoluteFill>
  );
};

export default Scene25_Outro;
