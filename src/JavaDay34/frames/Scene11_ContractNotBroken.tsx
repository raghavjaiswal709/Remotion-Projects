/**
 * Scene 11 — ContractNotBroken
 * "The contract of the parent method is not broken."
 * CSV: 56.10s → 59.10s
 * Duration: 102 frames (3.4s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + headline spring up
 *   Phase 2 (frames 20–70):  Contract scroll with seal, parent method signature, shield icon
 *   Phase 3 (frames 60–end): Seal stamp pulse, shield breathing, intact badge shimmer
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

// ─── Spring configs ──────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene11_ContractNotBroken: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance    = useSpringEntrance(frame, 0);
  const headlineEntrance = useSpringEntrance(frame, 6);
  const subEntrance      = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const contractScroll   = useSpringEntrance(frame, 18);
  const sealStamp        = useSpringEntrance(frame, 28);
  const sigLine1         = useSpringEntrance(frame, 34);
  const sigLine2         = useSpringEntrance(frame, 42);
  const sigLine3         = useSpringEntrance(frame, 50);
  const shieldIcon       = useSpringEntrance(frame, 56);
  const intactBadge      = useSpringEntrance(frame, 62);
  const ruleCard1        = useSpringEntrance(frame, 48);
  const ruleCard2        = useSpringEntrance(frame, 58);

  // ── Detail cards ──────────────────────────────────────────────────────────
  const detailCard1      = useSpringEntrance(frame, 66);
  const detailCard2      = useSpringEntrance(frame, 74);

  // ── Path draws ────────────────────────────────────────────────────────────
  const shieldPathLen = 180;
  const shieldDash    = usePathDraw(frame, 56, shieldPathLen, 22);

  // ── Border draws ──────────────────────────────────────────────────────────
  const scrollPerimeter = 2 * (480 + 620);
  const scrollBorderDash = interpolate(frame, [18, 48], [scrollPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe      = Math.sin(frame * 0.06) * 3;
  const pulse        = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer      = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const sealPulse    = 1 + Math.sin(frame * 0.1) * 0.03;
  const shieldGlow   = interpolate(Math.sin(frame * 0.07), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OOP · CONTRACT SAFETY" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEntrance.translateY})`} opacity={headlineEntrance.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Contract Is
          </text>
          <text
            x={470} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.green}
          >
            {' '}Not Broken
          </text>
        </g>
        <g transform={`translate(0, ${subEntrance.translateY})`} opacity={subEntrance.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Parent method guarantee stays intact
          </text>
        </g>

        {/* ── ZONE C — Contract Scroll (left side) ───────────────────────── */}
        <g opacity={contractScroll.opacity} transform={`translate(60, ${380 + contractScroll.translateY})`}>
          <rect
            x={0} y={0} width={480} height={620} rx={12}
            fill={COLORS.bg_paper}
            stroke={COLORS.brown} strokeWidth={2}
            strokeDasharray={scrollPerimeter}
            strokeDashoffset={scrollBorderDash}
          />
          {/* Scroll top roll */}
          <rect x={-10} y={-8} width={500} height={22} rx={11} fill={COLORS.brown} fillOpacity={0.15} />
          <rect x={-10} y={600} width={500} height={22} rx={11} fill={COLORS.brown} fillOpacity={0.15} />

          {/* Contract title */}
          <text
            x={240} y={60}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={800}
            fill={COLORS.brown}
            letterSpacing="0.15em"
          >
            METHOD CONTRACT
          </text>

          {/* Divider */}
          <line x1={40} y1={80} x2={440} y2={80} stroke={COLORS.brown} strokeWidth={1} opacity={0.25} />

          {/* Contract signature lines */}
          <g opacity={sigLine1.opacity} transform={`translate(0, ${sigLine1.translateY})`}>
            <text x={40} y={130} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={600} fill={COLORS.sky_blue}>
              class Train
            </text>
            <text x={40} y={160} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
              {'  '}// Base class
            </text>
          </g>

          <g opacity={sigLine2.opacity} transform={`translate(0, ${sigLine2.translateY})`}>
            <text x={40} y={210} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={600} fill={COLORS.deep_black}>
              Engine getEngine()
            </text>
            <text x={40} y={240} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.cool_silver}>
              {'  '}// Returns Engine
            </text>
          </g>

          <g opacity={sigLine3.opacity} transform={`translate(0, ${sigLine3.translateY})`}>
            <text x={40} y={290} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={700} fill={COLORS.green}>
              GUARANTEE:
            </text>
            <text x={40} y={320} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.deep_black}>
              Caller always receives
            </text>
            <text x={40} y={348} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.deep_black}>
              an object of type Engine
            </text>
            <text x={40} y={376} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.deep_black}>
              or any of its subtypes
            </text>
          </g>

          {/* Seal stamp */}
          <g
            opacity={sealStamp.opacity}
            transform={`translate(340, 460) scale(${sealPulse})`}
            style={{ transformOrigin: '340px 460px' }}
          >
            <circle cx={0} cy={0} r={56} fill={COLORS.green} fillOpacity={0.1} />
            <circle cx={0} cy={0} r={56} fill="none" stroke={COLORS.green} strokeWidth={3} />
            <circle cx={0} cy={0} r={42} fill="none" stroke={COLORS.green} strokeWidth={1.5} opacity={0.5} />
            <text
              textAnchor="middle" y={-8}
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={900}
              fill={COLORS.green} letterSpacing="0.1em"
            >
              INTACT
            </text>
            <text
              textAnchor="middle" y={18}
              fontFamily="'Inter', sans-serif" fontSize={14} fontWeight={600}
              fill={COLORS.green}
            >
              VERIFIED
            </text>
          </g>
        </g>

        {/* ── Shield icon (right side, top) ──────────────────────────────── */}
        <g
          opacity={shieldIcon.opacity * shieldGlow}
          transform={`translate(780, ${500 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '780px 500px' }}
        >
          <path
            d="M 0,-50 L 40,-30 L 40,20 C 40,40 20,55 0,65 C -20,55 -40,40 -40,20 L -40,-30 Z"
            fill={COLORS.green} fillOpacity={0.08}
            stroke={COLORS.green} strokeWidth={3}
            strokeDasharray={shieldPathLen}
            strokeDashoffset={shieldDash}
            strokeLinejoin="round"
          />
          {/* Shield checkmark */}
          <path
            d="M -12,8 L -4,18 L 14,-2"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={shieldIcon.opacity}
          />
        </g>

        {/* ── Rule cards (right side) ────────────────────────────────────── */}
        <g opacity={ruleCard1.opacity} transform={`translate(580, ${620 + ruleCard1.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={16} y={20} width={6} height={80} rx={3} fill={COLORS.sky_blue} />
          <text x={38} y={52} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            Parent says:
          </text>
          <text x={38} y={88} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500} fill={COLORS.deep_black}>
            Returns Engine
          </text>
        </g>

        <g opacity={ruleCard2.opacity} transform={`translate(580, ${760 + ruleCard2.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={10}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={16} y={20} width={6} height={80} rx={3} fill={COLORS.green} />
          <text x={38} y={52} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.green}>
            Child returns:
          </text>
          <text x={38} y={88} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500} fill={COLORS.deep_black}>
            MaglevEngine (IS-A Engine)
          </text>
        </g>

        {/* ── INTACT badge ───────────────────────────────────────────────── */}
        <g
          opacity={intactBadge.opacity * shimmer}
          transform={`translate(800, ${920 + breathe})`}
        >
          <rect
            x={-80} y={-22}
            width={160} height={44} rx={22}
            fill={COLORS.green} fillOpacity={0.12}
            stroke={COLORS.green} strokeWidth={2}
          />
          <text
            textAnchor="middle"
            y={6}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={800}
            fill={COLORS.green}
          >
            NOT BROKEN
          </text>
        </g>

        {/* ── Detail cards ───────────────────────────────────────────────── */}
        <g opacity={detailCard1.opacity} transform={`translate(60, ${1060 + detailCard1.translateY})`}>
          <rect x={0} y={0} width={460} height={260} rx={12}
            fill={COLORS.amber} fillOpacity={0.04}
            stroke={COLORS.amber} strokeWidth={1.5} />
          <text x={24} y={42} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700} fill={COLORS.amber}>
            Why It Holds
          </text>
          <line x1={24} y1={56} x2={436} y2={56} stroke={COLORS.amber} strokeWidth={1} opacity={0.2} />
          <text x={24} y={90} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            MaglevEngine has everything
          </text>
          <text x={24} y={120} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            that Engine has — and more.
          </text>
          <text x={24} y={160} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            Any code expecting Engine
          </text>
          <text x={24} y={190} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            works with MaglevEngine.
          </text>
          <text x={24} y={230} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600} fill={COLORS.amber}>
            Substitution = Safe
          </text>
        </g>

        <g opacity={detailCard2.opacity} transform={`translate(560, ${1060 + detailCard2.translateY})`}>
          <rect x={0} y={0} width={460} height={260} rx={12}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={1.5} />
          <text x={24} y={42} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700} fill={COLORS.green}>
            Caller Perspective
          </text>
          <line x1={24} y1={56} x2={436} y2={56} stroke={COLORS.green} strokeWidth={1} opacity={0.2} />
          <text x={24} y={90} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            Caller asked for Engine —
          </text>
          <text x={24} y={120} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            got MaglevEngine instead.
          </text>
          <text x={24} y={160} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            That is perfectly fine
          </text>
          <text x={24} y={190} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            because MaglevEngine IS an
          </text>
          <text x={24} y={220} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            Engine. Promise kept.
          </text>
        </g>

        {/* ── Floating decorations ───────────────────────────────────────── */}
        <circle cx={140} cy={1420 + breathe * 1.2} r={4} fill={COLORS.green} opacity={0.1 * shimmer} />
        <circle cx={940} cy={1400 - breathe * 0.9} r={6} fill={COLORS.brown} opacity={0.08 * shimmer} />
        <circle cx={320} cy={1440 + breathe * 0.5} r={3} fill={COLORS.orange} opacity={0.1} />

        {/* ── Rail track accent ──────────────────────────────────────────── */}
        <g opacity={0.05}>
          <line x1={60} y1={1680} x2={1020} y2={1680} stroke={COLORS.deep_black} strokeWidth={2} />
          <line x1={60} y1={1688} x2={1020} y2={1688} stroke={COLORS.deep_black} strokeWidth={2} />
          {Array.from({ length: 20 }, (_, i) => (
            <line key={i} x1={80 + i * 48} y1={1676} x2={80 + i * 48} y2={1692}
              stroke={COLORS.deep_black} strokeWidth={3} />
          ))}
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
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
