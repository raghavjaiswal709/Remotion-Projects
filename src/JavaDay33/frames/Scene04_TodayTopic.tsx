/**
 * Scene04 — Today's Topic
 * "Today, we are looking at the @Override annotation."
 * CSV: 10.42s -> 13.56s
 * Duration: 112 frames (3.73s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-25):  Label slides in, headline springs up
 *   Phase 2 (frames 20-75): @Override annotation hero reveal with code block + explanation cards
 *   Phase 3 (frames 70-end): Pulse on annotation symbol, shimmer on cards
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene04_TodayTopic: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const heroAnnotation = useSpringEntrance(frame, 16);
  const annotationSnap = spring({ frame: Math.max(0, frame - 18), fps, config: SPRING_SNAP });
  const codeBlock = useSpringEntrance(frame, 28);
  const explanationCard1 = useSpringEntrance(frame, 40);
  const explanationCard2 = useSpringEntrance(frame, 52);
  const arrowEntry = useSpringEntrance(frame, 36);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 38, arrowLen, 20);
  const codeBorderLen = 2 * (960 + 480);
  const codeBorderDash = interpolate(frame, [30, 60], [codeBorderLen, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Hero annotation underline ──────────────────────────────────────────────
  const underlineLen = 520;
  const underlineDash = usePathDraw(frame, 22, underlineLen, 20);

  // ── Card border draws ──────────────────────────────────────────────────────
  const cardPerimeter1 = 2 * (440 + 160);
  const cardBorderDash1 = interpolate(frame, [42, 68], [cardPerimeter1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const cardPerimeter2 = 2 * (440 + 160);
  const cardBorderDash2 = interpolate(frame, [54, 78], [cardPerimeter2, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const annotationPulse = 1 + Math.sin(frame * 0.12) * 0.025;
  const glowOpacity = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.04, 0.12]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="@OVERRIDE ANNOTATION · TODAY" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Today's Focus
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.orange}
          >
            The @Override Annotation
          </text>
        </g>

        {/* ── ZONE C — Hero @Override ─────────────────────────────────────── */}

        {/* Background glow behind annotation */}
        <circle
          cx={540} cy={520}
          r={120}
          fill={COLORS.orange}
          opacity={glowOpacity * heroAnnotation.opacity}
        />

        {/* Hero annotation text */}
        <g
          opacity={heroAnnotation.opacity}
          transform={`translate(0, ${heroAnnotation.translateY})`}
        >
          <text
            x={540} y={540}
            textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={96} fontWeight={700}
            fill={COLORS.orange}
            transform={`scale(${annotationSnap * annotationPulse})`}
            style={{ transformOrigin: '540px 540px' }}
          >
            @Override
          </text>
        </g>

        {/* Underline beneath @Override */}
        <line
          x1={280} y1={570}
          x2={800} y2={570}
          stroke={COLORS.orange}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={underlineLen}
          strokeDashoffset={underlineDash}
          opacity={0.6}
        />

        {/* ── Code block showing annotation usage ─────────────────────────── */}
        <g
          opacity={codeBlock.opacity}
          transform={`translate(60, ${640 + codeBlock.translateY})`}
        >
          <rect
            x={0} y={0} width={960} height={480} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.04}
          />
          <rect
            x={0} y={0} width={960} height={480} rx={12}
            fill="none"
            stroke={COLORS.sky_blue} strokeWidth={1.5}
            strokeDasharray={codeBorderLen}
            strokeDashoffset={codeBorderDash}
          />
          <rect x={0} y={0} width={6} height={480} rx={3} fill={COLORS.sky_blue} />

          {/* Code lines */}
          <text x={30} y={52} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            class ExpressTrain extends Train {'{'}
          </text>
          <text x={30} y={120} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            {'  '}
          </text>
          <text x={60} y={180} fontFamily="'Fira Code', monospace" fontSize={32} fontWeight={700} fill={COLORS.orange}>
            @Override
          </text>
          <text x={60} y={240} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            public int calculateFare() {'{'}
          </text>
          <text x={60} y={300} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            {'    '}return 250;
          </text>
          <text x={60} y={360} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            {'}'}
          </text>
          <text x={30} y={430} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            {'}'}
          </text>
        </g>

        {/* ── Arrow from code to explanation ───────────────────────────────── */}
        <g opacity={arrowEntry.opacity}>
          <path
            d="M 540,1140 L 540,1220"
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={2.5}
            strokeDasharray={arrowLen}
            strokeDashoffset={arrowDash}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />
        </g>

        {/* ── Explanation cards — side by side ─────────────────────────────── */}
        {/* Card 1: What it does */}
        <g
          opacity={explanationCard1.opacity}
          transform={`translate(60, ${1240 + explanationCard1.translateY})`}
        >
          <rect
            x={0} y={0} width={440} height={160} rx={12}
            fill={COLORS.green} fillOpacity={0.06}
          />
          <rect
            x={0} y={0} width={440} height={160} rx={12}
            fill="none"
            stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={cardPerimeter1}
            strokeDashoffset={cardBorderDash1}
          />
          <rect x={0} y={0} width={6} height={160} rx={3} fill={COLORS.green} />
          <text x={28} y={44} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            WHAT IT DOES
          </text>
          <text x={28} y={88} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Tells the compiler:
          </text>
          <text x={28} y={130} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500} fill={COLORS.green}>
            "Verify this override"
          </text>
        </g>

        {/* Card 2: Why it matters */}
        <g
          opacity={explanationCard2.opacity}
          transform={`translate(540, ${1240 + explanationCard2.translateY})`}
        >
          <rect
            x={0} y={0} width={440} height={160} rx={12}
            fill={COLORS.amber} fillOpacity={0.06}
          />
          <rect
            x={0} y={0} width={440} height={160} rx={12}
            fill="none"
            stroke={COLORS.amber} strokeWidth={1.5}
            strokeDasharray={cardPerimeter2}
            strokeDashoffset={cardBorderDash2}
          />
          <rect x={0} y={0} width={6} height={160} rx={3} fill={COLORS.amber} />
          <text x={28} y={44} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            WHY IT MATTERS
          </text>
          <text x={28} y={88} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Catches typos
          </text>
          <text x={28} y={130} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500} fill={COLORS.amber}>
            at compile time
          </text>
        </g>

        {/* ── Phase 3: floating decorations ───────────────────────────────── */}
        <g transform={`translate(${950 + breathe * 0.5}, ${400 + breathe})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.orange} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.orange} strokeWidth={1}
            opacity={0.15 * shimmer} transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(${120 + breathe * -0.3}, ${1540 + breathe * 0.8})`}>
          <circle cx={0} cy={0} r={10} fill={COLORS.sky_blue} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={10} fill="none" stroke={COLORS.sky_blue} strokeWidth={1}
            opacity={0.1 * shimmer} transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── Small at-symbol decorative accents ──────────────────────────── */}
        <text
          x={160} y={500}
          fontFamily="'Fira Code', monospace"
          fontSize={48} fontWeight={300}
          fill={COLORS.orange}
          opacity={0.06 * shimmer}
          transform={`translate(${breathe * 0.4}, ${breathe * 0.6})`}
        >
          @
        </text>
        <text
          x={880} y={680}
          fontFamily="'Fira Code', monospace"
          fontSize={36} fontWeight={300}
          fill={COLORS.orange}
          opacity={0.04 * shimmer}
          transform={`translate(${breathe * -0.3}, ${breathe * 0.4})`}
        >
          @
        </text>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
