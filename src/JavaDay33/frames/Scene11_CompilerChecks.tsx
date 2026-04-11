/**
 * Scene11 — CompilerChecks
 * "The compiler now checks one thing. Does this method actually override a method in the parent?"
 * CSV: 41.58s -> 47.26s
 * Duration: 189 frames (6.30s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-25):  Label + headline spring in
 *   Phase 2 (frames 20-110): Compiler diagram: @Override -> check -> parent lookup, checkmark
 *   Phase 3 (frames 100-end): Steady-state pulse, breathe, connector shimmer
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene11_CompilerChecks: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2: Compiler flow diagram ─────────────────────────────────────────
  const codeNode = useSpringEntrance(frame, 16);
  const compilerNode = useSpringEntrance(frame, 28);
  const parentNode = useSpringEntrance(frame, 40);
  const checkNode = useSpringEntrance(frame, 52);
  const resultNode = useSpringEntrance(frame, 64);

  const arrow1 = useSpringEntrance(frame, 24);
  const arrow2 = useSpringEntrance(frame, 36);
  const arrow3 = useSpringEntrance(frame, 48);
  const arrow4 = useSpringEntrance(frame, 60);

  const questionCard = useSpringEntrance(frame, 72);
  const answerCard = useSpringEntrance(frame, 82);
  const summaryCard = useSpringEntrance(frame, 92);

  // Path draws for arrows
  const a1Len = 140;
  const a1Dash = usePathDraw(frame, 24, a1Len, 16);
  const a2Len = 140;
  const a2Dash = usePathDraw(frame, 36, a2Len, 16);
  const a3Len = 140;
  const a3Dash = usePathDraw(frame, 48, a3Len, 16);
  const a4Len = 140;
  const a4Dash = usePathDraw(frame, 60, a4Len, 16);

  // Node border draws
  const nodePerim1 = 2 * (280 + 100);
  const nodeBorder1 = usePathDraw(frame, 18, nodePerim1, 18);
  const nodePerim2 = 2 * (320 + 100);
  const nodeBorder2 = usePathDraw(frame, 30, nodePerim2, 18);
  const nodePerim3 = 2 * (280 + 100);
  const nodeBorder3 = usePathDraw(frame, 42, nodePerim3, 18);
  const nodePerim4 = 2 * (280 + 100);
  const nodeBorder4 = usePathDraw(frame, 54, nodePerim4, 18);
  const nodePerim5 = 2 * (280 + 100);
  const nodeBorder5 = usePathDraw(frame, 66, nodePerim5, 18);

  // Checkmark animation
  const checkLen = 60;
  const checkDash = usePathDraw(frame, 68, checkLen, 14);

  // Question mark counter
  const questionStep = useCounter(frame, 72, 1, 20);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const checkPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.7, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  // Flow diagram layout
  const nodeW = 280;
  const nodeH = 100;
  const flowX = 540; // center
  const flowStartY = 460;
  const flowGap = 180;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · COMPILER CHECK" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={240} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={800} fill={COLORS.deep_black}>
            The Compiler Checks
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={330} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={800} fill={COLORS.orange}>
            One Thing
          </text>
        </g>

        {/* ── ZONE C — Vertical flow diagram ──────────────────────────────── */}

        {/* Node 1: @Override code */}
        <g opacity={codeNode.opacity} transform={`translate(${flowX - nodeW / 2}, ${flowStartY + codeNode.translateY * 0.5})`}>
          <rect x={0} y={0} width={nodeW} height={nodeH} rx={14}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={2}
            strokeDasharray={nodePerim1} strokeDashoffset={nodeBorder1} />
          <text x={nodeW / 2} y={42} textAnchor="middle" fontFamily="'Fira Code', monospace"
            fontSize={30} fontWeight={700} fill={COLORS.green}>
            @Override
          </text>
          <text x={nodeW / 2} y={76} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            annotation found
          </text>
        </g>

        {/* Arrow 1 → Compiler */}
        <g opacity={arrow1.opacity}>
          <path d={`M ${flowX},${flowStartY + nodeH} L ${flowX},${flowStartY + nodeH + 80}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={a1Len} strokeDashoffset={a1Dash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Node 2: Compiler */}
        <g opacity={compilerNode.opacity} transform={`translate(${flowX - 160}, ${flowStartY + flowGap + compilerNode.translateY * 0.5})`}>
          <rect x={0} y={0} width={320} height={nodeH} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2}
            strokeDasharray={nodePerim2} strokeDashoffset={nodeBorder2} />
          <text x={160} y={42} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.sky_blue}>
            Java Compiler
          </text>
          <text x={160} y={76} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            javac verification
          </text>
        </g>

        {/* Arrow 2 → Parent Lookup */}
        <g opacity={arrow2.opacity}>
          <path d={`M ${flowX},${flowStartY + flowGap + nodeH} L ${flowX},${flowStartY + flowGap + nodeH + 80}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={a2Len} strokeDashoffset={a2Dash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Node 3: Parent Lookup */}
        <g opacity={parentNode.opacity} transform={`translate(${flowX - nodeW / 2}, ${flowStartY + flowGap * 2 + parentNode.translateY * 0.5})`}>
          <rect x={0} y={0} width={nodeW} height={nodeH} rx={14}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2}
            strokeDasharray={nodePerim3} strokeDashoffset={nodeBorder3} />
          <text x={nodeW / 2} y={42} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.orange}>
            Check Parent
          </text>
          <text x={nodeW / 2} y={76} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            Train.calculateFare()?
          </text>
        </g>

        {/* Arrow 3 → Comparison */}
        <g opacity={arrow3.opacity}>
          <path d={`M ${flowX},${flowStartY + flowGap * 2 + nodeH} L ${flowX},${flowStartY + flowGap * 2 + nodeH + 80}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={a3Len} strokeDashoffset={a3Dash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Node 4: Signature Match */}
        <g opacity={checkNode.opacity} transform={`translate(${flowX - nodeW / 2}, ${flowStartY + flowGap * 3 + checkNode.translateY * 0.5})`}>
          <rect x={0} y={0} width={nodeW} height={nodeH} rx={14}
            fill={COLORS.amber} fillOpacity={0.06}
            stroke={COLORS.amber} strokeWidth={2}
            strokeDasharray={nodePerim4} strokeDashoffset={nodeBorder4} />
          <text x={nodeW / 2} y={42} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.amber}>
            Signature Match?
          </text>
          <text x={nodeW / 2} y={76} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
            Name + params + return type
          </text>
        </g>

        {/* Arrow 4 → Result */}
        <g opacity={arrow4.opacity}>
          <path d={`M ${flowX},${flowStartY + flowGap * 3 + nodeH} L ${flowX},${flowStartY + flowGap * 3 + nodeH + 80}`}
            fill="none" stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={a4Len} strokeDashoffset={a4Dash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Node 5: Result — checkmark or X */}
        <g opacity={resultNode.opacity} transform={`translate(${flowX - nodeW / 2}, ${flowStartY + flowGap * 4 + resultNode.translateY * 0.5})`}>
          <rect x={0} y={0} width={nodeW} height={nodeH} rx={14}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={2}
            strokeDasharray={nodePerim5} strokeDashoffset={nodeBorder5} />
          {/* Animated checkmark */}
          <path d={`M ${nodeW / 2 - 20},${50} L ${nodeW / 2 - 5},${66} L ${nodeW / 2 + 22},${38}`}
            fill="none" stroke={COLORS.green} strokeWidth={4}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={checkLen} strokeDashoffset={checkDash}
            opacity={checkPulse} />
          <text x={nodeW / 2 + 40} y={58} fontFamily="'Inter', sans-serif"
            fontSize={26} fontWeight={700} fill={COLORS.green}>
            Verified
          </text>
        </g>

        {/* ── Question highlight card ─────────────────────────────────────── */}
        <g opacity={questionCard.opacity} transform={`translate(60, ${1430 + questionCard.translateY})`}>
          <rect x={0} y={0} width={960} height={90} rx={10}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.orange} />
          <text x={32} y={38} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            {questionStep >= 1 ? 'The one question the compiler asks:' : ''}
          </text>
          <text x={32} y={72} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            "Does this method actually override a parent method?"
          </text>
        </g>

        {/* ── Answer card ─────────────────────────────────────────────────── */}
        <g opacity={answerCard.opacity} transform={`translate(60, ${1550 + answerCard.translateY})`}>
          <rect x={0} y={0} width={440} height={80} rx={10}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={1} opacity={0.3} />
          <rect x={0} y={0} width={6} height={80} rx={3} fill={COLORS.green} />
          <text x={28} y={50} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.green}>
            YES → Compiles
          </text>
        </g>

        <g opacity={answerCard.opacity} transform={`translate(540, ${1550 + answerCard.translateY})`}>
          <rect x={0} y={0} width={440} height={80} rx={10}
            fill={COLORS.vibrant_red} fillOpacity={0.04}
            stroke={COLORS.vibrant_red} strokeWidth={1} opacity={0.3} />
          <rect x={0} y={0} width={6} height={80} rx={3} fill={COLORS.vibrant_red} />
          <text x={28} y={50} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.vibrant_red}>
            NO → Error
          </text>
        </g>

        {/* ── Summary ─────────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${1660 + summaryCard.translateY})`}>
          <rect x={0} y={0} width={960} height={60} rx={8}
            fill={COLORS.sky_blue} fillOpacity={0.03} />
          <text x={480} y={40} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={26} fontWeight={500} fill={COLORS.sky_blue}>
            Formal verification at compile time — not runtime
          </text>
        </g>

        {/* ── Phase 3: Breathing decoration ───────────────────────────────── */}
        <g transform={`translate(100, ${460 + breathe})`} opacity={0.05 * shimmer}>
          <circle cx={0} cy={0} r={12} fill="none" stroke={COLORS.sky_blue} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(980, ${840 + breathe * -1})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={10} fill="none" stroke={COLORS.green} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
