/**
 * Scene11 — Runtime Method Dispatch
 * "When you call calculateFare on an express train object, Java does not run
 *  the train version. It runs the express train version."
 * CSV: 41.80s → 50.20s
 * Duration: 282 frames (9.4s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring entrance
 *   Phase 2 (frames 25–140): Method dispatch flow diagram — caller → JVM → correct impl
 *   Phase 3 (frames 130–end): Micro — pulse on selected path, shimmer, breathe
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

export const Scene11_CallCalcFareExpress: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);
  const headlineC = useSpringEntrance(frame, 18);

  // ── Phase 2: Content build ────────────────────────────────────────────────
  const callerBox = useSpringEntrance(frame, 28);
  const callArrow = usePathDraw(frame, 36, 160, 20);
  const jvmNode = useSpringEntrance(frame, 40);
  const jvmLabel = useSpringEntrance(frame, 48);
  const branchLeft = usePathDraw(frame, 56, 200, 25);
  const branchRight = usePathDraw(frame, 56, 200, 25);
  const trainBox = useSpringEntrance(frame, 65);
  const expressBox = useSpringEntrance(frame, 65);
  const crossMark = useSpringEntrance(frame, 80);
  const checkMark = useSpringEntrance(frame, 80);
  const strikeThru = usePathDraw(frame, 85, 440, 20);
  const glowBox = useSpringEntrance(frame, 90);
  const resultCard = useSpringEntrance(frame, 100);
  const detail1 = useSpringEntrance(frame, 110);
  const detail2 = useSpringEntrance(frame, 120);
  const detail3 = useSpringEntrance(frame, 130);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const checkPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.7, 1]);
  const glowOpacity = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.06, 0.14]);

  // ── Border draw for boxes ─────────────────────────────────────────────────
  const CALLER_PERIM = 2 * (400 + 70);
  const callerBorderDash = interpolate(frame, [28, 55], [CALLER_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const JVM_PERIM = 2 * (280 + 70);
  const jvmBorderDash = interpolate(frame, [40, 65], [JVM_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="METHOD OVERRIDING · DISPATCH" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={220}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={800} fill={COLORS.deep_black}>
            Call calculateFare()
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={290}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={600} fill={COLORS.orange}>
            on ExpressTrain object
          </text>
        </g>
        <g transform={`translate(0, ${headlineC.translateY})`} opacity={headlineC.opacity}>
          <text x={60} y={350}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={500} fill={COLORS.cool_silver}>
            Which version runs?
          </text>
        </g>

        {/* ── ZONE C — Dispatch flow diagram ─────────────────────────────── */}

        {/* Step 1: Caller code box */}
        <g opacity={callerBox.opacity} transform={`translate(0, ${callerBox.translateY})`}>
          <rect x={340} y={420} width={400} height={70} rx={12}
            fill="none" stroke={COLORS.deep_black} strokeWidth={2}
            strokeDasharray={CALLER_PERIM} strokeDashoffset={callerBorderDash} />
          <rect x={340} y={420} width={400} height={70} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.04} />
          <text x={540} y={464} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            t.calculateFare()
          </text>
        </g>

        {/* Arrow: caller → JVM */}
        <path d="M 540,490 L 540,580"
          fill="none" stroke={COLORS.amber} strokeWidth={2.5}
          strokeDasharray={160} strokeDashoffset={callArrow}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Step 2: JVM Runtime Decision node */}
        <g opacity={jvmNode.opacity} transform={`translate(0, ${jvmNode.translateY})`}>
          <rect x={400} y={600} width={280} height={70} rx={35}
            fill="none" stroke={COLORS.amber} strokeWidth={2.5}
            strokeDasharray={JVM_PERIM} strokeDashoffset={jvmBorderDash} />
          <rect x={400} y={600} width={280} height={70} rx={35}
            fill={COLORS.amber} fillOpacity={0.1} />
        </g>
        <g opacity={jvmLabel.opacity}>
          <text x={540} y={644} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800} fill={COLORS.amber}>
            JVM RUNTIME
          </text>
        </g>

        {/* Branch arrows: JVM → Train (left) and JVM → ExpressTrain (right) */}
        <path d="M 440,670 L 260,770"
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
          strokeDasharray={200} strokeDashoffset={branchLeft}
          strokeLinecap="round" />
        <path d="M 640,670 L 820,770"
          fill="none" stroke={COLORS.orange} strokeWidth={2.5}
          strokeDasharray={200} strokeDashoffset={branchRight}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Left option: Train.calculateFare() — REJECTED */}
        <g opacity={trainBox.opacity} transform={`translate(0, ${trainBox.translateY})`}>
          <rect x={60} y={780} width={420} height={180} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.cool_silver} strokeWidth={1.5} />

          <text x={270} y={820} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700}
            fill={COLORS.cool_silver}>
            Train
          </text>
          <text x={270} y={862} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400}
            fill={COLORS.cool_silver}>
            calculateFare()
          </text>
          <text x={270} y={902} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400}
            fill={COLORS.cool_silver}>
            Base fare logic
          </text>
        </g>

        {/* Strike-through line over Train box */}
        <g opacity={crossMark.opacity}>
          <line x1={80} y1={860} x2={460} y2={860}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={440} strokeDashoffset={strikeThru}
            strokeLinecap="round" opacity={0.6} />
        </g>

        {/* Cross icon */}
        <g opacity={crossMark.opacity} transform={`translate(270, 940)`}>
          <circle cx={0} cy={0} r={20}
            fill={COLORS.vibrant_red} fillOpacity={0.15}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <line x1={-8} y1={-8} x2={8} y2={8} stroke={COLORS.vibrant_red} strokeWidth={2.5} />
          <line x1={8} y1={-8} x2={-8} y2={8} stroke={COLORS.vibrant_red} strokeWidth={2.5} />
        </g>

        {/* Right option: ExpressTrain.calculateFare() — SELECTED */}
        <g opacity={expressBox.opacity} transform={`translate(0, ${expressBox.translateY})`}>
          <rect x={600} y={780} width={420} height={180} rx={16}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={2.5} />

          {/* Glow behind selected box */}
          <rect x={596} y={776} width={428} height={188} rx={20}
            fill={COLORS.orange} fillOpacity={glowOpacity}
            stroke="none" />

          <text x={810} y={820} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={800}
            fill={COLORS.orange}>
            ExpressTrain
          </text>
          <text x={810} y={862} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={600}
            fill={COLORS.deep_black}>
            calculateFare()
          </text>
          <text x={810} y={902} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={COLORS.deep_black}>
            Premium pricing logic
          </text>
        </g>

        {/* Check mark icon */}
        <g opacity={checkMark.opacity * checkPulse} transform={`translate(810, 940)`}>
          <circle cx={0} cy={0} r={20}
            fill={COLORS.green} fillOpacity={0.15}
            stroke={COLORS.green} strokeWidth={2} />
          <path d="M -8,0 L -2,8 L 10,-6"
            fill="none" stroke={COLORS.green} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* Glow ring around selected box (phase 3) */}
        <g opacity={glowBox.opacity}>
          <rect x={592} y={772} width={436} height={196} rx={22}
            fill="none" stroke={COLORS.orange} strokeWidth={1}
            opacity={glowOpacity}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '810px 870px' }} />
        </g>

        {/* Result explanation card */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <rect x={80} y={1040} width={920} height={200} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={80} y={1040} width={6} height={200} rx={3} fill={COLORS.orange} />

          <text x={120} y={1088}
            fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={800} fill={COLORS.deep_black}>
            Java runs the ExpressTrain version
          </text>
          <text x={120} y={1136}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            Not the base Train version. The object's actual
          </text>
          <text x={120} y={1176}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            type determines which method body executes.
          </text>
        </g>

        {/* Detail cards at bottom */}
        <g opacity={detail1.opacity} transform={`translate(80, ${1280 + detail1.translateY + breathe})`}>
          <rect x={0} y={0} width={280} height={110} rx={12}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={5} height={110} rx={3} fill={COLORS.orange} />
          <text x={24} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            Object Type
          </text>
          <text x={24} y={76} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            ExpressTrain
          </text>
        </g>

        <g opacity={detail2.opacity * shimmer} transform={`translate(400, ${1280 + detail2.translateY + breathe * 0.7})`}>
          <rect x={0} y={0} width={280} height={110} rx={12}
            fill={COLORS.amber} fillOpacity={0.08}
            stroke={COLORS.amber} strokeWidth={1.5} />
          <rect x={0} y={0} width={5} height={110} rx={3} fill={COLORS.amber} />
          <text x={24} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.amber}>
            Decision
          </text>
          <text x={24} y={76} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            JVM at runtime
          </text>
        </g>

        <g opacity={detail3.opacity} transform={`translate(720, ${1280 + detail3.translateY + breathe * 0.5})`}>
          <rect x={0} y={0} width={280} height={110} rx={12}
            fill={COLORS.green} fillOpacity={0.08}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={0} y={0} width={5} height={110} rx={3} fill={COLORS.green} />
          <text x={24} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.green}>
            Result
          </text>
          <text x={24} y={76} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            Premium fare
          </text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s11.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
