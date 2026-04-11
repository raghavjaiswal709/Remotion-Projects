/**
 * Scene03 — Static Blocks Recall
 * "Last day, we learned how static blocks run once when a class is first loaded into memory."
 * CSV: 4.42s → 9.70s
 * Duration: 177 frames (5.9s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — label slides, headline springs up
 *   Phase 2 (frames 20–90):  Content build — class box loads, static block executes, memory icon
 *   Phase 3 (frames 80–end): Steady-state — pulsing memory indicator, floating particles
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

export const Scene03_StaticBlockRecall: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const classBox = useSpringEntrance(frame, 20);
  const staticBlock = useSpringEntrance(frame, 32);
  const arrowDown = usePathDraw(frame, 38, 180, 20);
  const memoryCard = useSpringEntrance(frame, 44);
  const checkMark = useSpringEntrance(frame, 56);
  const noteCard = useSpringEntrance(frame, 64);

  // ── Path draw for class box border ─────────────────────────────────────────
  const classBoxPerimeter = 2 * (400 + 300);
  const classBoxBorder = usePathDraw(frame, 20, classBoxPerimeter, 30);

  // ── Path draw for memory card border ───────────────────────────────────────
  const memoryPerimeter = 2 * (400 + 160);
  const memoryBorder = usePathDraw(frame, 44, memoryPerimeter, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Memory activity dots
  const memoryDots = Array.from({ length: 6 }, (_, i) => {
    const dotX = 380 + i * 60;
    const dotY = 1280 + Math.sin((frame + i * 10) * 0.08) * 6;
    const dotOp = interpolate(frame, [60 + i * 4, 72 + i * 4], [0, 0.5], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return { x: dotX, y: dotY, opacity: dotOp * shimmer };
  });

  // ── Execution flash for static block ───────────────────────────────────────
  const flashOpacity = interpolate(frame, [36, 42, 50], [0, 0.2, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="DAY 31 RECAP" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headlines ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Static Blocks
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={320}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Run once when a class loads
          </text>
        </g>

        {/* ── ZONE C — Class box with static block ────────────────────────── */}
        {/* Class box outline (border-draw) */}
        <rect
          x={100} y={400} width={400} height={300} rx={16}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={classBoxPerimeter}
          strokeDashoffset={classBoxBorder}
        />
        {/* Class box fill */}
        <rect
          x={100} y={400} width={400} height={300} rx={16}
          fill={COLORS.orange}
          fillOpacity={classBox.opacity * 0.06}
        />

        {/* Class name header */}
        <g opacity={classBox.opacity} transform={`translate(0, ${classBox.translateY * 0.5})`}>
          <rect x={100} y={400} width={400} height={56} rx={16} ry={0} fill={COLORS.orange} fillOpacity={0.12} />
          <text
            x={300} y={436}
            textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={32} fontWeight={700}
            fill={COLORS.orange}
          >
            TrainConfig.class
          </text>
        </g>

        {/* Static block inside class */}
        <g opacity={staticBlock.opacity} transform={`translate(0, ${staticBlock.translateY * 0.5})`}>
          <rect
            x={130} y={490} width={340} height={80} rx={8}
            fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={1.5}
          />
          <text
            x={300} y={522}
            textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={600}
            fill={COLORS.sky_blue}
          >
            {'static { ... }'}
          </text>
          <text
            x={300} y={556}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            initialization code
          </text>
        </g>

        {/* Execution flash overlay */}
        <rect
          x={130} y={490} width={340} height={80} rx={8}
          fill={COLORS.sky_blue}
          opacity={flashOpacity}
        />

        {/* "RUNS ONCE" badge */}
        <g opacity={staticBlock.opacity}>
          <rect x={540} y={510} width={180} height={44} rx={22} fill={COLORS.green} fillOpacity={0.1} stroke={COLORS.green} strokeWidth={1.5} />
          <text
            x={630} y={540}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={700}
            fill={COLORS.green}
          >
            RUNS ONCE
          </text>
        </g>

        {/* ── Arrow down to memory ────────────────────────────────────────── */}
        <path
          d="M 300,710 L 300,890"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={3}
          strokeDasharray={180}
          strokeDashoffset={arrowDown}
          strokeLinecap="round"
          markerEnd="url(#arrowOrange)"
        />

        {/* "CLASS LOADING" label on arrow */}
        <g opacity={memoryCard.opacity * 0.7}>
          <text
            x={340} y={810}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600}
            fill={COLORS.orange}
            letterSpacing="0.12em"
          >
            CLASS LOADING
          </text>
        </g>

        {/* ── Memory card ─────────────────────────────────────────────────── */}
        <rect
          x={100} y={910} width={400} height={160} rx={16}
          fill="none"
          stroke={COLORS.amber}
          strokeWidth={2}
          strokeDasharray={memoryPerimeter}
          strokeDashoffset={memoryBorder}
        />
        <rect
          x={100} y={910} width={400} height={160} rx={16}
          fill={COLORS.amber}
          fillOpacity={memoryCard.opacity * 0.05}
        />
        <g opacity={memoryCard.opacity} transform={`translate(0, ${memoryCard.translateY * 0.3})`}>
          <text
            x={300} y={970}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.amber}
          >
            JVM MEMORY
          </text>
          <text
            x={300} y={1018}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Class loaded and initialized
          </text>
        </g>

        {/* ── Check mark ──────────────────────────────────────────────────── */}
        <g opacity={checkMark.opacity} transform={`translate(540, ${940 + checkMark.translateY})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.green} fillOpacity={0.12} />
          <path
            d="M -12,0 L -4,8 L 12,-8"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ── Memory activity dots ────────────────────────────────────────── */}
        {memoryDots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={5} fill={COLORS.amber} opacity={dot.opacity} />
        ))}

        {/* ── Note card — "Today we move on" ──────────────────────────────── */}
        <g opacity={noteCard.opacity} transform={`translate(0, ${noteCard.translateY + breathe})`}>
          <rect
            x={60} y={1360} width={960} height={120} rx={16}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={1.5}
          />
          <rect x={60} y={1360} width={6} height={120} rx={3} fill={COLORS.orange} />
          <text
            x={100} y={1408}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Today we move forward...
          </text>
          <text
            x={100} y={1452}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            From class loading to method behavior
          </text>
        </g>

        {/* ── Pulsing indicator on memory card ────────────────────────────── */}
        <circle
          cx={490} cy={990} r={8}
          fill={COLORS.green}
          opacity={0.4 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '490px 990px' }}
        />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
