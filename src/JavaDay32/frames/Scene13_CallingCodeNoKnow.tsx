/**
 * Scene13 — Calling Code Doesn't Need To Know
 * "The calling code does not need to know which train type it is dealing with.
 *  It calls calculateFare. The right version runs automatically."
 * CSV: 56.14s → 64.34s
 * Duration: 276 frames (9.2s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring entrance
 *   Phase 2 (frames 20–100): Abstraction wall diagram: caller side vs hidden object side
 *   Phase 3 (frames 90–end): Floating, glow on "calculateFare()" call, shimmer on resolved types
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

// ── Hidden train types revealed on right side ───────────────────────────────
const TRAIN_TYPES = [
  { name: 'ExpressTrain', fare: 'Premium', color: COLORS.orange },
  { name: 'MetroTrain', fare: 'Slab', color: COLORS.sky_blue },
  { name: 'FreightTrain', fare: 'Weight', color: COLORS.green },
];

export const Scene13_CallingCodeNoKnow: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ────────────────────────────────────────────────
  const callerBox = useSpringEntrance(frame, 22);
  const callMethodLabel = useSpringEntrance(frame, 28);
  const wallDraw = usePathDraw(frame, 30, 1200, 35);
  const wallLabel = useSpringEntrance(frame, 50);

  const type0 = useSpringEntrance(frame, 56);
  const type1 = useSpringEntrance(frame, 68);
  const type2 = useSpringEntrance(frame, 80);

  const arrowLeft = usePathDraw(frame, 36, 160, 20);
  const arrowRight0 = usePathDraw(frame, 60, 140, 18);
  const arrowRight1 = usePathDraw(frame, 72, 140, 18);
  const arrowRight2 = usePathDraw(frame, 84, 140, 18);

  const autoLabel = useSpringEntrance(frame, 90);
  const benefitCard = useSpringEntrance(frame, 100);
  const checkmark0 = useSpringEntrance(frame, 108);
  const checkmark1 = useSpringEntrance(frame, 116);
  const checkmark2 = useSpringEntrance(frame, 124);

  // ── Border-draw animations ────────────────────────────────────────────────
  const CALLER_PERIM = 2 * (400 + 200);
  const callerBorderDash = interpolate(frame, [22, 50], [CALLER_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const TYPE_PERIM = 2 * (320 + 100);
  const typeBorder0 = interpolate(frame, [56, 78], [TYPE_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const typeBorder1 = interpolate(frame, [68, 90], [TYPE_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const typeBorder2 = interpolate(frame, [80, 102], [TYPE_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const typeBorders = [typeBorder0, typeBorder1, typeBorder2];

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Cycle highlight across the 3 types
  const cyclePhase = frame > 100
    ? Math.floor(interpolate(frame % 90, [0, 90], [0, 3], {
        extrapolateRight: 'clamp',
      })) % 3
    : -1;

  const typeSprings = [type0, type1, type2];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="METHOD OVERRIDING · ABSTRACTION" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={230}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={800} fill={COLORS.deep_black}>
            Calling Code Doesn't
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={900} fill={COLORS.orange}>
            Need To Know
          </text>
        </g>

        {/* ── ZONE C — Main visual ───────────────────────────────────────── */}

        {/* Left side: Caller box */}
        <g opacity={callerBox.opacity} transform={`translate(60, ${420 + callerBox.translateY})`}>
          <rect x={0} y={0} width={400} height={200} rx={16}
            fill="none" stroke={COLORS.deep_black} strokeWidth={2}
            strokeDasharray={CALLER_PERIM} strokeDashoffset={callerBorderDash} />
          <rect x={0} y={0} width={400} height={200} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.04} />
          <text x={200} y={55} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600}
            fill={COLORS.cool_silver} letterSpacing="0.12em">
            CALLER CODE
          </text>
          <rect x={40} y={80} width={320} height={50} rx={8}
            fill={COLORS.deep_black} fillOpacity={0.06} />
          <text x={200} y={113} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.deep_black}>
            train.calculateFare()
          </text>
          {/* Question mark */}
          <text x={200} y={180} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800}
            fill={COLORS.cool_silver} opacity={0.4}>
            ? which type ?
          </text>
        </g>

        {/* Method call label */}
        <g opacity={callMethodLabel.opacity} transform={`translate(0, ${callMethodLabel.translateY})`}>
          <text x={260} y={395}
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600}
            fill={COLORS.orange} textAnchor="middle">
            Calls one method
          </text>
        </g>

        {/* Arrow from caller to wall */}
        <path d="M 460,520 L 540,520"
          fill="none" stroke={COLORS.orange} strokeWidth={2.5}
          strokeDasharray={160} strokeDashoffset={arrowLeft}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Abstraction wall — vertical dashed line */}
        <path d={`M 560,370 L 560,1080`}
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
          strokeDasharray={1200} strokeDashoffset={wallDraw}
          strokeLinecap="round"
          opacity={0.6} />

        {/* Wall label */}
        <g opacity={wallLabel.opacity}>
          <text x={570} y={385}
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
            fill={COLORS.cool_silver} letterSpacing="0.15em">
            ABSTRACTION
          </text>
        </g>

        {/* Right side: Three hidden train types */}
        {TRAIN_TYPES.map((t, i) => {
          const y = 430 + i * 220;
          const isActive = i === cyclePhase;
          const float = isActive ? breathe * 1.2 : 0;

          return (
            <g key={i}>
              {/* Arrow from wall to type */}
              <path d={`M 570,${y + 50} L 640,${y + 50}`}
                fill="none" stroke={t.color} strokeWidth={2}
                strokeDasharray={140}
                strokeDashoffset={i === 0 ? arrowRight0 : i === 1 ? arrowRight1 : arrowRight2}
                strokeLinecap="round" markerEnd="url(#arrow)" />

              {/* Type box */}
              <g opacity={typeSprings[i].opacity}
                transform={`translate(650, ${y + typeSprings[i].translateY + float})`}>
                <rect x={0} y={0} width={360} height={100} rx={14}
                  fill="none" stroke={t.color} strokeWidth={2}
                  strokeDasharray={TYPE_PERIM} strokeDashoffset={typeBorders[i]} />
                <rect x={0} y={0} width={360} height={100} rx={14}
                  fill={t.color} fillOpacity={isActive ? 0.14 : 0.06} />

                {/* Type name */}
                <text x={20} y={42}
                  fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
                  fill={t.color}>
                  {t.name}
                </text>
                {/* Fare label */}
                <text x={20} y={78}
                  fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
                  fill={COLORS.cool_silver}>
                  .calculateFare() → {t.fare}
                </text>

                {/* Active glow */}
                {isActive && (
                  <rect x={-3} y={-3} width={366} height={106} rx={17}
                    fill="none" stroke={t.color} strokeWidth={1.5}
                    opacity={shimmer * 0.6}
                    transform={`scale(${pulse})`}
                    style={{ transformOrigin: '180px 50px' }} />
                )}
              </g>
            </g>
          );
        })}

        {/* ── Automatic dispatch label ──────────────────────────────────── */}
        <g opacity={autoLabel.opacity} transform={`translate(0, ${autoLabel.translateY})`}>
          <rect x={280} y={1100} width={520} height={54} rx={27}
            fill={COLORS.orange} fillOpacity={0.1}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <text x={540} y={1134} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={800}
            fill={COLORS.orange} letterSpacing="0.08em">
            AUTOMATIC DISPATCH
          </text>
        </g>

        {/* ── Benefit card ───────────────────────────────────────────────── */}
        <g opacity={benefitCard.opacity} transform={`translate(0, ${benefitCard.translateY})`}>
          <rect x={80} y={1190} width={920} height={240} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={80} y={1190} width={6} height={240} rx={3} fill={COLORS.orange} />

          <text x={120} y={1240}
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={800}
            fill={COLORS.deep_black}>
            Benefits of Polymorphism:
          </text>
        </g>

        {/* ── Checkmark items ────────────────────────────────────────────── */}
        <g opacity={checkmark0.opacity} transform={`translate(120, ${1270 + checkmark0.translateY})`}>
          <circle cx={12} cy={18} r={12} fill={COLORS.green} fillOpacity={0.15} />
          <text x={12} y={24} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={800} fill={COLORS.green}>
            ✓
          </text>
          <text x={34} y={26}
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600} fill={COLORS.deep_black}>
            No type checking needed in caller
          </text>
        </g>

        <g opacity={checkmark1.opacity} transform={`translate(120, ${1320 + checkmark1.translateY})`}>
          <circle cx={12} cy={18} r={12} fill={COLORS.green} fillOpacity={0.15} />
          <text x={12} y={24} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={800} fill={COLORS.green}>
            ✓
          </text>
          <text x={34} y={26}
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600} fill={COLORS.deep_black}>
            Add new train types without changing caller
          </text>
        </g>

        <g opacity={checkmark2.opacity} transform={`translate(120, ${1370 + checkmark2.translateY})`}>
          <circle cx={12} cy={18} r={12} fill={COLORS.green} fillOpacity={0.15} />
          <text x={12} y={24} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={800} fill={COLORS.green}>
            ✓
          </text>
          <text x={34} y={26}
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600} fill={COLORS.deep_black}>
            Right version runs automatically
          </text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
