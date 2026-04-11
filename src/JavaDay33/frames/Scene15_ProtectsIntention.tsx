/**
 * Scene15 — ProtectsIntention
 * "It protects your intention. It makes the compiler verify that your override is real."
 * CSV: 64.92s -> 68.14s
 * Duration: 167 frames (5.57s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-25):  Label + headline spring
 *   Phase 2 (frames 18-90): Shield diagram, intention → compiler → verified flow, detail cards
 *   Phase 3 (frames 85-end): Float, pulse, shimmer micro-anims
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

export const Scene15_ProtectsIntention: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2: Shield ────────────────────────────────────────────────────────
  const shieldF = Math.max(0, frame - 16);
  const shieldProg = spring({ frame: shieldF, fps: 30, config: SPRING_SNAP });
  const shieldOp = interpolate(shieldF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const shieldScale = interpolate(shieldProg, [0, 1], [0.5, 1]);

  // Shield outline path draw
  const shieldPathLen = 420;
  const shieldDash = usePathDraw(frame, 18, shieldPathLen, 22);

  // Flow nodes: INTENTION → COMPILER → VERIFIED
  const node1 = useSpringEntrance(frame, 28);
  const node2 = useSpringEntrance(frame, 40);
  const node3 = useSpringEntrance(frame, 52);

  // Node border draws
  const nodePerim1 = 2 * (280 + 90);
  const nodeBorder1 = usePathDraw(frame, 30, nodePerim1, 16);
  const nodePerim2 = 2 * (280 + 90);
  const nodeBorder2 = usePathDraw(frame, 42, nodePerim2, 16);
  const nodePerim3 = 2 * (280 + 90);
  const nodeBorder3 = usePathDraw(frame, 54, nodePerim3, 16);

  // Arrows between nodes
  const arrow1Len = 110;
  const arrow1Dash = usePathDraw(frame, 38, arrow1Len, 12);
  const arrow2Len = 110;
  const arrow2Dash = usePathDraw(frame, 50, arrow2Len, 12);

  // Detail cards
  const card1 = useSpringEntrance(frame, 60);
  const card2 = useSpringEntrance(frame, 68);
  const card3 = useSpringEntrance(frame, 76);

  // Card border draws
  const cardPerim = 2 * (960 + 90);
  const cardBorder1 = usePathDraw(frame, 62, cardPerim, 16);
  const cardBorder2 = usePathDraw(frame, 70, cardPerim, 16);
  const cardBorder3 = usePathDraw(frame, 78, cardPerim, 16);

  // Summary
  const summaryEntrance = useSpringEntrance(frame, 84);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glow = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.4, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · PURPOSE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={230} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800} fill={COLORS.deep_black}>
            Protects Your
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={320} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800} fill={COLORS.green}>
            Intention
          </text>
        </g>

        {/* ── Shield Icon (center) ────────────────────────────────────────── */}
        <g opacity={shieldOp} transform={`translate(540, 480) scale(${shieldScale})`}
          style={{ transformOrigin: '540px 480px' }}>
          {/* Shield glow ring */}
          <circle cx={0} cy={0} r={82} fill="none" stroke={COLORS.green} strokeWidth={2}
            opacity={glow * 0.3} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0 0' }} />
          {/* Shield outline */}
          <path
            d="M 0,-55 L 45,-35 L 45,15 C 45,40 25,55 0,68 C -25,55 -45,40 -45,15 L -45,-35 Z"
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={shieldPathLen} strokeDashoffset={shieldDash}
            strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Checkmark inside shield */}
          <path
            d="M -16,6 L -4,18 L 18,-8"
            fill="none" stroke={COLORS.green} strokeWidth={3.5}
            strokeLinecap="round" strokeLinejoin="round"
            opacity={interpolate(frame, [28, 36], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
            })}
          />
        </g>

        {/* ── Flow: INTENTION → COMPILER → VERIFIED ───────────────────────── */}
        {/* Node 1: YOUR INTENTION */}
        <g opacity={node1.opacity} transform={`translate(60, ${590 + node1.translateY})`}>
          <rect x={0} y={0} width={280} height={90} rx={12}
            fill="none" stroke={COLORS.orange} strokeWidth={1.5}
            strokeDasharray={nodePerim1} strokeDashoffset={nodeBorder1} />
          <rect x={0} y={0} width={280} height={90} rx={12}
            fill={COLORS.orange} fillOpacity={0.04} />
          <text x={140} y={38} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.orange}>
            YOUR INTENTION
          </text>
          <text x={140} y={68} textAnchor="middle" fontFamily="'Fira Code', monospace"
            fontSize={18} fontWeight={400} fill={COLORS.deep_black}>
            "Override calculateFare"
          </text>
        </g>

        {/* Arrow 1 */}
        <line x1={340} y1={635} x2={400} y2={635}
          stroke={COLORS.sky_blue} strokeWidth={2.5}
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Node 2: COMPILER */}
        <g opacity={node2.opacity} transform={`translate(400, ${590 + node2.translateY})`}>
          <rect x={0} y={0} width={280} height={90} rx={12}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5}
            strokeDasharray={nodePerim2} strokeDashoffset={nodeBorder2} />
          <rect x={0} y={0} width={280} height={90} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.04} />
          <text x={140} y={38} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.sky_blue}>
            JAVA COMPILER
          </text>
          <text x={140} y={68} textAnchor="middle" fontFamily="'Fira Code', monospace"
            fontSize={18} fontWeight={400} fill={COLORS.deep_black}>
            javac verifies
          </text>
        </g>

        {/* Arrow 2 */}
        <line x1={680} y1={635} x2={740} y2={635}
          stroke={COLORS.green} strokeWidth={2.5}
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Node 3: VERIFIED */}
        <g opacity={node3.opacity} transform={`translate(740, ${590 + node3.translateY})`}>
          <rect x={0} y={0} width={280} height={90} rx={12}
            fill="none" stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={nodePerim3} strokeDashoffset={nodeBorder3} />
          <rect x={0} y={0} width={280} height={90} rx={12}
            fill={COLORS.green} fillOpacity={0.04} />
          <text x={140} y={38} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.green}>
            VERIFIED
          </text>
          <text x={140} y={68} textAnchor="middle" fontFamily="'Fira Code', monospace"
            fontSize={18} fontWeight={400} fill={COLORS.deep_black}>
            Override is real
          </text>
        </g>

        {/* ── Detail cards ────────────────────────────────────────────────── */}
        {/* Card 1 */}
        <g opacity={card1.opacity} transform={`translate(60, ${740 + card1.translateY})`}>
          <rect x={0} y={0} width={960} height={90} rx={10}
            fill="none" stroke={COLORS.orange} strokeWidth={1}
            strokeDasharray={cardPerim} strokeDashoffset={cardBorder1} opacity={0.3} />
          <rect x={0} y={0} width={960} height={90} rx={10}
            fill={COLORS.orange} fillOpacity={0.03} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.orange} />
          <text x={28} y={36} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.orange}>
            Your Intent
          </text>
          <text x={28} y={70} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={400} fill={COLORS.deep_black}>
            "I want this method to replace the parent version"
          </text>
        </g>

        {/* Card 2 */}
        <g opacity={card2.opacity} transform={`translate(60, ${852 + card2.translateY})`}>
          <rect x={0} y={0} width={960} height={90} rx={10}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1}
            strokeDasharray={cardPerim} strokeDashoffset={cardBorder2} opacity={0.3} />
          <rect x={0} y={0} width={960} height={90} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.03} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.sky_blue} />
          <text x={28} y={36} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.sky_blue}>
            Compiler Verifies
          </text>
          <text x={28} y={70} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={400} fill={COLORS.deep_black}>
            "Does the parent actually have this exact method signature?"
          </text>
        </g>

        {/* Card 3 */}
        <g opacity={card3.opacity} transform={`translate(60, ${964 + card3.translateY})`}>
          <rect x={0} y={0} width={960} height={90} rx={10}
            fill="none" stroke={COLORS.green} strokeWidth={1}
            strokeDasharray={cardPerim} strokeDashoffset={cardBorder3} opacity={0.3} />
          <rect x={0} y={0} width={960} height={90} rx={10}
            fill={COLORS.green} fillOpacity={0.03} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.green} />
          <text x={28} y={36} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.green}>
            Guaranteed Real
          </text>
          <text x={28} y={70} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={400} fill={COLORS.deep_black}>
            If it passes, the override is genuine — no silent mismatch possible
          </text>
        </g>

        {/* ── Two-column summary ──────────────────────────────────────────── */}
        <g opacity={summaryEntrance.opacity} transform={`translate(0, ${summaryEntrance.translateY})`}>
          {/* Divider */}
          <line x1={540} y1={1100} x2={540} y2={1310}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />

          {/* Left: Without */}
          <rect x={60} y={1100} width={460} height={210} rx={10}
            fill={COLORS.vibrant_red} fillOpacity={0.02}
            stroke={COLORS.vibrant_red} strokeWidth={1} opacity={0.15} />
          <text x={290} y={1140} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={26} fontWeight={700} fill={COLORS.vibrant_red}>
            Without @Override
          </text>
          <text x={290} y={1180} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            Typo creates new method
          </text>
          <text x={290} y={1216} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            No compiler error
          </text>
          <text x={290} y={1252} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            Bug hides until runtime
          </text>
          <text x={290} y={1290} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            RISKY
          </text>

          {/* Right: With */}
          <rect x={560} y={1100} width={460} height={210} rx={10}
            fill={COLORS.green} fillOpacity={0.02}
            stroke={COLORS.green} strokeWidth={1} opacity={0.15} />
          <text x={790} y={1140} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={26} fontWeight={700} fill={COLORS.green}>
            With @Override
          </text>
          <text x={790} y={1180} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            Typo caught immediately
          </text>
          <text x={790} y={1216} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            Compiler refuses to build
          </text>
          <text x={790} y={1252} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            Bug caught before deployment
          </text>
          <text x={790} y={1290} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={800} fill={COLORS.green}>
            SAFE
          </text>
        </g>

        {/* ── Phase 3 accents ─────────────────────────────────────────────── */}
        <g transform={`translate(120, ${480 + breathe})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={6} fill="none" stroke={COLORS.green} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(960, ${480 + breathe * -1})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.orange} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
