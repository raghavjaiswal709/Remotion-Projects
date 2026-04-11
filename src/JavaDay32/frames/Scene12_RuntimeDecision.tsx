/**
 * Scene12 — Runtime Object Type Decision
 * "The actual object type at runtime decides which implementation executes."
 * CSV: 50.78s → 55.34s
 * Duration: 157 frames (5.2s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 20–90):  Three runtime objects with type badges, path-draw arrows to methods
 *   Phase 3 (frames 80–end): Floating objects, pulse on active, shimmer on type badges
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

// ── Runtime object data ──────────────────────────────────────────────────────
const RUNTIME_OBJECTS = [
  {
    refType: 'Train t1',
    actualType: 'ExpressTrain',
    method: 'Premium Fare',
    color: COLORS.orange,
  },
  {
    refType: 'Train t2',
    actualType: 'MetroTrain',
    method: 'Slab Fare',
    color: COLORS.sky_blue,
  },
  {
    refType: 'Train t3',
    actualType: 'FreightTrain',
    method: 'Weight Fare',
    color: COLORS.green,
  },
];

export const Scene12_RuntimeDecision: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ────────────────────────────────────────────────
  const runtimeLabel = useSpringEntrance(frame, 22);
  const obj0 = useSpringEntrance(frame, 28);
  const obj1 = useSpringEntrance(frame, 40);
  const obj2 = useSpringEntrance(frame, 52);
  const arrow0 = usePathDraw(frame, 38, 200, 20);
  const arrow1 = usePathDraw(frame, 50, 200, 20);
  const arrow2 = usePathDraw(frame, 62, 200, 20);
  const method0 = useSpringEntrance(frame, 46);
  const method1 = useSpringEntrance(frame, 58);
  const method2 = useSpringEntrance(frame, 70);
  const runtimeBadge = useSpringEntrance(frame, 76);
  const summaryCard = useSpringEntrance(frame, 84);
  const insightBar1 = useSpringEntrance(frame, 92);
  const insightBar2 = useSpringEntrance(frame, 100);

  // ── Border draw ───────────────────────────────────────────────────────────
  const OBJ_PERIM = 2 * (400 + 130);
  const objBorder0 = interpolate(frame, [28, 55], [OBJ_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const objBorder1 = interpolate(frame, [40, 67], [OBJ_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const objBorder2 = interpolate(frame, [52, 79], [OBJ_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const objBorders = [objBorder0, objBorder1, objBorder2];

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const activeIdx = Math.floor(interpolate(frame, [80, 150], [0, 3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })) % 3;

  // ── Counter for "Runtime" tick ────────────────────────────────────────────
  const runtimeCounter = useCounter(frame, 76, 100, 30);

  const objSprings = [obj0, obj1, obj2];
  const methodSprings = [method0, method1, method2];
  const arrowDashes = [arrow0, arrow1, arrow2];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="METHOD OVERRIDING · RUNTIME" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={230}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={800} fill={COLORS.deep_black}>
            Object Type at
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={900} fill={COLORS.orange}>
            Runtime Decides
          </text>
        </g>

        {/* ── Runtime decision label ─────────────────────────────────────── */}
        <g opacity={runtimeLabel.opacity} transform={`translate(0, ${runtimeLabel.translateY})`}>
          <text x={540} y={400} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
            fill={COLORS.cool_silver} letterSpacing="0.15em">
            HEAP MEMORY — ACTUAL OBJECT TYPES
          </text>
        </g>

        {/* ── Three runtime objects with arrows to their methods ──────── */}
        {RUNTIME_OBJECTS.map((obj, i) => {
          const y = 460 + i * 200;
          const isActive = i === activeIdx && frame > 80;
          const float = i === activeIdx ? breathe : breathe * 0.3;

          return (
            <g key={i}>
              {/* Object box (left) */}
              <g opacity={objSprings[i].opacity}
                transform={`translate(60, ${y + objSprings[i].translateY + float})`}>
                {/* Border draw */}
                <rect x={0} y={0} width={400} height={130} rx={16}
                  fill="none" stroke={obj.color} strokeWidth={2}
                  strokeDasharray={OBJ_PERIM} strokeDashoffset={objBorders[i]} />
                <rect x={0} y={0} width={400} height={130} rx={16}
                  fill={obj.color} fillOpacity={isActive ? 0.12 : 0.06} />

                {/* Ref type label */}
                <text x={20} y={40}
                  fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400}
                  fill={COLORS.cool_silver}>
                  {obj.refType}
                </text>
                {/* Actual type (large) */}
                <text x={20} y={85}
                  fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={800}
                  fill={obj.color}>
                  {obj.actualType}
                </text>
                {/* Active glow ring */}
                {isActive && (
                  <rect x={-4} y={-4} width={408} height={138} rx={20}
                    fill="none" stroke={obj.color} strokeWidth={1.5}
                    opacity={shimmer * 0.5}
                    transform={`scale(${pulse})`}
                    style={{ transformOrigin: '200px 65px' }} />
                )}
              </g>

              {/* Arrow from object to method */}
              <path
                d={`M 460,${y + 65} L 600,${y + 65}`}
                fill="none" stroke={obj.color} strokeWidth={2.5}
                strokeDasharray={200} strokeDashoffset={arrowDashes[i]}
                strokeLinecap="round" markerEnd="url(#arrow)" />

              {/* Method result box (right) */}
              <g opacity={methodSprings[i].opacity}
                transform={`translate(620, ${y + methodSprings[i].translateY + float * 0.5})`}>
                <rect x={0} y={0} width={380} height={130} rx={16}
                  fill={obj.color} fillOpacity={0.05}
                  stroke={obj.color} strokeWidth={1.5} />
                <rect x={0} y={0} width={5} height={130} rx={3} fill={obj.color} />

                <text x={28} y={42}
                  fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
                  fill={COLORS.cool_silver}>
                  Executes:
                </text>
                <text x={28} y={82}
                  fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700}
                  fill={obj.color}>
                  {obj.method}
                </text>
                <text x={28} y={115}
                  fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400}
                  fill={COLORS.cool_silver}>
                  calculateFare()
                </text>
              </g>
            </g>
          );
        })}

        {/* ── Runtime badge ──────────────────────────────────────────────── */}
        <g opacity={runtimeBadge.opacity} transform={`translate(0, ${runtimeBadge.translateY})`}>
          <rect x={340} y={1100} width={400} height={56} rx={28}
            fill={COLORS.amber} fillOpacity={0.12}
            stroke={COLORS.amber} strokeWidth={2} />
          <text x={540} y={1136} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={800}
            fill={COLORS.amber} letterSpacing="0.1em">
            RUNTIME {runtimeCounter}%
          </text>
        </g>

        {/* ── Summary card ───────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <rect x={80} y={1190} width={920} height={180} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={80} y={1190} width={6} height={180} rx={3} fill={COLORS.orange} />

          <text x={120} y={1240}
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={800} fill={COLORS.deep_black}>
            JVM checks the actual object in heap
          </text>
          <text x={120} y={1286}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            Not the reference type. The real object type
          </text>
          <text x={120} y={1326}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            determines method execution at runtime.
          </text>
        </g>

        {/* ── Insight bars ───────────────────────────────────────────────── */}
        <g opacity={insightBar1.opacity} transform={`translate(80, ${1410 + insightBar1.translateY})`}>
          <rect x={0} y={0} width={440} height={90} rx={12}
            fill={COLORS.amber} fillOpacity={0.08}
            stroke={COLORS.amber} strokeWidth={1.5} />
          <rect x={0} y={0} width={5} height={90} rx={3} fill={COLORS.amber} />
          <text x={28} y={38}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.amber}>
            Compile Time
          </text>
          <text x={28} y={70}
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            Reference type checked
          </text>
        </g>

        <g opacity={insightBar2.opacity} transform={`translate(560, ${1410 + insightBar2.translateY})`}>
          <rect x={0} y={0} width={440} height={90} rx={12}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={5} height={90} rx={3} fill={COLORS.orange} />
          <text x={28} y={38}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            Runtime
          </text>
          <text x={28} y={70}
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            Actual object type decides
          </text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
