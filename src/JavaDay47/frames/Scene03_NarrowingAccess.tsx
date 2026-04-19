/**
 * Scene 03 — Narrowing Access
 * "narrowing what is accessible through it."
 * CSV: 13.440s → 16.240s
 * Duration: ~84 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 20–60):  Funnel/narrowing illustration — wide → narrow
 *   Phase 3 (frames 50–end): Breathing, shimmer
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene03_NarrowingAccess: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  const funnelCard = useSpringEntrance(frame, 18);
  const methodCards = [
    useSpringEntrance(frame, 24),
    useSpringEntrance(frame, 36),
    useSpringEntrance(frame, 48),
  ];

  // Funnel path draw
  const funnelLen = 600;
  const funnelDash = usePathDraw(frame, 20, funnelLen, 30);

  // Narrowing animation — wide rect shrinks to narrow
  const narrowProgress = interpolate(frame, [25, 55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const wideW = interpolate(narrowProgress, [0, 1], [900, 400]);
  const wideX = interpolate(narrowProgress, [0, 1], [90, 340]);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Left funnel line
  const leftLineLen = 400;
  const leftLineDash = usePathDraw(frame, 30, leftLineLen, 25);
  // Right funnel line
  const rightLineDash = usePathDraw(frame, 32, leftLineLen, 25);

  const caption = CAPTIONS[2];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UPCASTING EFFECT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Narrowing
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            What Is Accessible
          </text>
        </g>

        {/* ── ZONE C — Funnel illustration ────────────────────────────────── */}
        <g opacity={funnelCard.opacity} transform={`translate(0, ${funnelCard.translateY})`}>
          {/* Wide top bar — all methods */}
          <rect x={90} y={520} width={900} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={575} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain — ALL METHODS
          </text>

          {/* Method labels in wide bar */}
          <text x={130} y={640} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            depart()
          </text>
          <text x={340} y={640} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            name
          </text>
          <text x={520} y={640} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            speed
          </text>
          <text x={700} y={640} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            serveLunch()
          </text>
          <text x={900} y={640} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            reserveSeat()
          </text>

          {/* Funnel lines — converging */}
          <path d={`M 90,680 L 340,900`}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={leftLineLen} strokeDashoffset={leftLineDash}
            strokeLinecap="round" opacity={0.6} />
          <path d={`M 990,680 L 740,900`}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={leftLineLen} strokeDashoffset={rightLineDash}
            strokeLinecap="round" opacity={0.6} />

          {/* Narrow bottom bar — only Train methods */}
          <rect x={wideX} y={900} width={wideW} height={80} rx={16}
            fill={COLORS.bg_secondary}
            stroke={COLORS.white} strokeWidth={2} opacity={0.9} />
          <text x={540} y={955} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Train ref — ONLY PARENT METHODS
          </text>
        </g>

        {/* Method access cards — staggered */}
        {/* Card 1: Accessible */}
        <g opacity={methodCards[0].opacity} transform={`translate(0, ${methodCards[0].translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={140} />
          <circle cx={120} cy={1110} r={16} fill={COLORS.accent} fillOpacity={0.3} />
          <text x={120} y={1116} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            ✓
          </text>
          <text x={160} y={1120} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            depart(), name, speed
          </text>
          <text x={780} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            VISIBLE
          </text>
        </g>

        {/* Card 2: Hidden */}
        <g opacity={methodCards[1].opacity} transform={`translate(0, ${methodCards[1].translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={140} />
          <circle cx={120} cy={1270} r={16} fill={COLORS.vibrant_red} fillOpacity={0.3} />
          <text x={120} y={1276} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.vibrant_red}>
            ✗
          </text>
          <text x={160} y={1280} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.8}>
            serveLunch(), reserveSeat()
          </text>
          <text x={780} y={1280} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            HIDDEN
          </text>
        </g>

        {/* Card 3: Summary */}
        <g opacity={methodCards[2].opacity} transform={`translate(0, ${methodCards[2].translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={180} accent />
          <rect x={60} y={1360} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1430} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Upcasting narrows the view —
          </text>
          <text x={100} y={1490} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            child features become invisible
          </text>
        </g>

        {/* Floating accents */}
        <circle cx={160} cy={800 + breathe} r={5} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={920} cy={780 + breathe * 0.8} r={7} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={540} cy={1050 + breathe * 1.1} r={4} fill={COLORS.accent} opacity={0.18 * shimmer} />

        {/* Narrowing animation indicator */}
        <rect x={wideX - 4} y={896} width={wideW + 8} height={88} rx={20}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={0.12 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 940px' }} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

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
