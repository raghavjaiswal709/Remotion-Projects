/**
 * Scene05 — Override Mechanics
 * "When ExpressTrain overrides calculateFare, the developer writes the
 *  method with the exact same name and parameters as in the parent Train class."
 * CSV: 14.30s -> 23.26s
 * Duration: 287 frames (9.57s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-30):   Label + headline spring
 *   Phase 2 (frames 20-120): Side-by-side code comparison with path-draw connectors
 *   Phase 3 (frames 100-end): Highlight matching, pulse, shimmer
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

export const Scene05_OverrideMechanics: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Two-column code comparison ────────────────────────────────────
  const divider = useSpringEntrance(frame, 18);
  const parentHeader = useSpringEntrance(frame, 22);
  const childHeader = useSpringEntrance(frame, 28);
  const parentCode1 = useSpringEntrance(frame, 34);
  const parentCode2 = useSpringEntrance(frame, 40);
  const parentCode3 = useSpringEntrance(frame, 46);
  const childCode1 = useSpringEntrance(frame, 38);
  const childCode2 = useSpringEntrance(frame, 44);
  const childCode3 = useSpringEntrance(frame, 50);

  // ── Matching highlight ─────────────────────────────────────────────────────
  const matchHighlight = useSpringEntrance(frame, 60);
  const matchLine1 = useSpringEntrance(frame, 64);
  const matchLine2 = useSpringEntrance(frame, 72);
  const matchLine3 = useSpringEntrance(frame, 80);

  // ── Explanation cards at bottom ────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 88);
  const card2 = useSpringEntrance(frame, 100);
  const summaryCard = useSpringEntrance(frame, 112);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const dividerLineLen = 1200;
  const dividerLineDash = usePathDraw(frame, 20, dividerLineLen, 30);
  const matchArrowLen1 = 100;
  const matchArrowDash1 = usePathDraw(frame, 66, matchArrowLen1, 18);
  const matchArrowLen2 = 100;
  const matchArrowDash2 = usePathDraw(frame, 74, matchArrowLen2, 18);
  const matchArrowLen3 = 100;
  const matchArrowDash3 = usePathDraw(frame, 82, matchArrowLen3, 18);

  // ── Border draws ───────────────────────────────────────────────────────────
  const card1Perim = 2 * (440 + 140);
  const card1BorderDash = interpolate(frame, [90, 116], [card1Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const card2Perim = 2 * (440 + 140);
  const card2BorderDash = interpolate(frame, [102, 128], [card2Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const summaryPerim = 2 * (960 + 100);
  const summaryBorderDash = interpolate(frame, [114, 140], [summaryPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const matchGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · MECHANICS" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={230}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Exact Same Signature
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={296}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={500}
            fill={COLORS.orange}
          >
            Name + Parameters must match perfectly
          </text>
        </g>

        {/* ── ZONE C — Two-column comparison ──────────────────────────────── */}

        {/* Vertical divider */}
        <line
          x1={540} y1={360} x2={540} y2={1100}
          stroke={COLORS.deep_black}
          strokeWidth={1.5}
          strokeDasharray={dividerLineLen}
          strokeDashoffset={dividerLineDash}
          opacity={0.15 * divider.opacity}
        />

        {/* LEFT column header: PARENT */}
        <g opacity={parentHeader.opacity} transform={`translate(0, ${parentHeader.translateY})`}>
          <text
            x={280} y={390}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.sky_blue}
          >
            PARENT: Train
          </text>
          <line x1={100} y1={408} x2={460} y2={408} stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.3} />
        </g>

        {/* RIGHT column header: CHILD */}
        <g opacity={childHeader.opacity} transform={`translate(0, ${childHeader.translateY})`}>
          <text
            x={800} y={390}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.orange}
          >
            CHILD: ExpressTrain
          </text>
          <line x1={620} y1={408} x2={980} y2={408} stroke={COLORS.orange} strokeWidth={2} opacity={0.3} />
        </g>

        {/* LEFT: parent code lines */}
        <g opacity={parentCode1.opacity} transform={`translate(0, ${parentCode1.translateY * 0.5})`}>
          <rect
            x={80} y={440} width={420} height={60} rx={8}
            fill={COLORS.sky_blue} fillOpacity={matchHighlight.opacity * matchGlow * 0.08}
          />
          <text x={100} y={480} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            calculateFare
          </text>
        </g>
        <g opacity={parentCode2.opacity} transform={`translate(0, ${parentCode2.translateY * 0.5})`}>
          <rect
            x={80} y={520} width={420} height={60} rx={8}
            fill={COLORS.sky_blue} fillOpacity={matchHighlight.opacity * matchGlow * 0.08}
          />
          <text x={100} y={560} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            (int distance)
          </text>
        </g>
        <g opacity={parentCode3.opacity} transform={`translate(0, ${parentCode3.translateY * 0.5})`}>
          <rect
            x={80} y={600} width={420} height={60} rx={8}
            fill={COLORS.sky_blue} fillOpacity={matchHighlight.opacity * matchGlow * 0.06}
          />
          <text x={100} y={640} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            return int
          </text>
        </g>

        {/* RIGHT: child code lines */}
        <g opacity={childCode1.opacity} transform={`translate(0, ${childCode1.translateY * 0.5})`}>
          <rect
            x={580} y={440} width={420} height={60} rx={8}
            fill={COLORS.orange} fillOpacity={matchHighlight.opacity * matchGlow * 0.08}
          />
          <text x={600} y={480} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            calculateFare
          </text>
        </g>
        <g opacity={childCode2.opacity} transform={`translate(0, ${childCode2.translateY * 0.5})`}>
          <rect
            x={580} y={520} width={420} height={60} rx={8}
            fill={COLORS.orange} fillOpacity={matchHighlight.opacity * matchGlow * 0.08}
          />
          <text x={600} y={560} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            (int distance)
          </text>
        </g>
        <g opacity={childCode3.opacity} transform={`translate(0, ${childCode3.translateY * 0.5})`}>
          <rect
            x={580} y={600} width={420} height={60} rx={8}
            fill={COLORS.orange} fillOpacity={matchHighlight.opacity * matchGlow * 0.06}
          />
          <text x={600} y={640} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            return int
          </text>
        </g>

        {/* ── Match arrows (horizontal connecting lines) ──────────────────── */}
        <g opacity={matchLine1.opacity}>
          <path d="M 500,470 L 580,470" fill="none" stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={matchArrowLen1} strokeDashoffset={matchArrowDash1}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <text x={536} y={462} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.green} opacity={matchLine1.opacity * shimmer}>
            MATCH
          </text>
        </g>
        <g opacity={matchLine2.opacity}>
          <path d="M 500,550 L 580,550" fill="none" stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={matchArrowLen2} strokeDashoffset={matchArrowDash2}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <text x={536} y={542} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.green} opacity={matchLine2.opacity * shimmer}>
            MATCH
          </text>
        </g>
        <g opacity={matchLine3.opacity}>
          <path d="M 500,630 L 580,630" fill="none" stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={matchArrowLen3} strokeDashoffset={matchArrowDash3}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <text x={536} y={622} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.green} opacity={matchLine3.opacity * shimmer}>
            MATCH
          </text>
        </g>

        {/* ── Labels for each row ─────────────────────────────────────────── */}
        <g opacity={matchLine1.opacity * 0.6}>
          <text x={60} y={478} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            Name
          </text>
        </g>
        <g opacity={matchLine2.opacity * 0.6}>
          <text x={60} y={558} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            Params
          </text>
        </g>
        <g opacity={matchLine3.opacity * 0.6}>
          <text x={60} y={638} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            Return
          </text>
        </g>

        {/* ── Large checkmark at center ────────────────────────────────────── */}
        <g opacity={matchHighlight.opacity} transform={`translate(540, ${760 + matchHighlight.translateY})`}>
          <circle cx={0} cy={0} r={48} fill={COLORS.green} fillOpacity={0.1} />
          <path
            d="M -20,0 L -6,16 L 22,-14"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0 0' }}
          />
        </g>

        {/* ── Explanation cards ────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(60, ${860 + card1.translateY})`}>
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06} />
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5}
            strokeDasharray={card1Perim} strokeDashoffset={card1BorderDash} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.sky_blue} />
          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            METHOD NAME
          </text>
          <text x={28} y={82} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={700} fill={COLORS.deep_black}>
            Must be identical
          </text>
          <text x={28} y={118} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.sky_blue}>
            calculateFare = calculateFare
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(540, ${860 + card2.translateY})`}>
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill={COLORS.amber} fillOpacity={0.06} />
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill="none" stroke={COLORS.amber} strokeWidth={1.5}
            strokeDasharray={card2Perim} strokeDashoffset={card2BorderDash} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.amber} />
          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            PARAMETERS
          </text>
          <text x={28} y={82} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={700} fill={COLORS.deep_black}>
            Must match exactly
          </text>
          <text x={28} y={118} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.amber}>
            (int distance) = (int distance)
          </text>
        </g>

        {/* ── Summary card ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${1060 + summaryCard.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.green} fillOpacity={0.06} />
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill="none" stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={summaryPerim} strokeDashoffset={summaryBorderDash} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.green} />
          <text x={32} y={62} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            The method signature must be a perfect match
          </text>
        </g>

        {/* ── Phase 3: floating decorations ───────────────────────────────── */}
        <g transform={`translate(${960 + breathe * 0.5}, ${340 + breathe})`}>
          <circle cx={0} cy={0} r={12} fill={COLORS.orange} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={12} fill="none" stroke={COLORS.orange} strokeWidth={1}
            opacity={0.12 * shimmer} transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
