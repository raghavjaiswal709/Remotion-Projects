/**
 * Scene 07 — Market Research Example
 * "right, a market research report on electric vehicles, cannot happen in one action."
 * CSV: 23.100s → 27.760s | Duration: 140 frames (4.65s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label and headline spring in
 *   Phase 2 (frames 20–90): Research report visual, single action constraint
 *   Phase 3 (frames 85–end): Cannot complete path-draw, shimmer on report doc
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

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

export const Scene07_MarketResearchExample: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter  = useSpringEntrance(frame, 0);
  const headEnter   = useSpringEntrance(frame, 6);

  // ── Phase 2 ──────────────────────────────────────────────────────────────
  const reportDoc   = useSpringEntrance(frame, 20);
  const stepBox     = useSpringEntrance(frame, 35);
  const cantCard    = useSpringEntrance(frame, 50);
  const reasonCard  = useSpringEntrance(frame, 64);

  const docLinesLen = 400;
  const docDash     = usePathDraw(frame, 22, docLinesLen, 28);

  const crossLen    = 80;
  const crossDash   = usePathDraw(frame, 55, crossLen, 16);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · EXAMPLE" y={140} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={248}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.text_muted}>
            REAL-WORLD EXAMPLE:
          </text>
          <text x={60} y={344}
            fontFamily={FONT} fontSize={76} fontWeight={800}
            fill={COLORS.white}>
            Market Research
          </text>
          <text x={60} y={440}
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Electric Vehicles Report
          </text>
        </g>

        {/* ── ZONE C — Document + action constraint visual ─────────────── */}

        {/* Research report document illustration */}
        <g opacity={reportDoc.opacity} transform={`translate(0, ${reportDoc.translateY})`}>
          <BentoCard x={60} y={510} w={620} h={440} accent />
          <rect x={60} y={510} width={6} height={440} rx={3} fill={COLORS.accent} />

          {/* Document header */}
          <rect x={100} y={550} width={420} height={52} rx={8}
            fill={COLORS.accent} opacity={0.18} />
          <text x={120} y={584} textAnchor="start"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            ELECTRIC VEHICLES
          </text>

          {/* Document body — lines */}
          <path
            d="M 100,640 L 560,640 M 100,672 L 520,672 M 100,704 L 540,704
               M 100,736 L 500,736 M 100,768 L 530,768 M 100,800 L 480,800
               M 100,832 L 550,832 M 100,864 L 510,864"
            fill="none" stroke={COLORS.white}
            strokeWidth={2} strokeLinecap="round"
            strokeDasharray={docLinesLen} strokeDashoffset={docDash}
            opacity={0.3} />

          {/* Chart placeholder at bottom */}
          <rect x={100} y={888} width={540} height={40} rx={6}
            fill={COLORS.accent} opacity={0.08} />
          <text x={370} y={914} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted}>
            charts · analysis · recommendations
          </text>
        </g>

        {/* Single step box */}
        <g opacity={stepBox.opacity} transform={`translate(0, ${stepBox.translateY})`}>
          <BentoCard x={720} y={510} w={300} h={200} />
          <text x={870} y={594} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.06em">
            1 ACTION
          </text>
          <text x={870} y={642} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>
            obs→
          </text>
          <text x={870} y={692} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>
            act
          </text>
        </g>

        {/* CANNOT arrow with X */}
        <g opacity={cantCard.opacity}>
          <line x1={700} y1={730} x2={736} y2={730}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={crossLen} strokeDashoffset={crossDash}
            opacity={0.6} />

          <rect x={700} y={710} width={60} height={40} rx={8}
            fill={COLORS.bg_primary} opacity={cantCard.opacity} />
          <text x={730} y={736} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} opacity={cantCard.opacity}>
            ✗
          </text>
        </g>

        {/* "CANNOT HAPPEN IN ONE ACTION" card */}
        <g opacity={cantCard.opacity} transform={`translate(0, ${cantCard.translateY})`}>
          <BentoCard x={60} y={1010} w={960} h={120} />
          <rect x={60} y={1010} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={540} y={1056} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            A full report
          </text>
          <text x={540} y={1104} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            CANNOT happen in one action
          </text>
        </g>

        {/* Reason */}
        <g opacity={reasonCard.opacity} transform={`translate(0, ${reasonCard.translateY})`}>
          <BentoCard x={60} y={1180} w={460} h={160} />
          <text x={100} y={1246} textAnchor="start"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            search
          </text>
          <text x={100} y={1298} textAnchor="start"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            + read + analyze + write
          </text>

          <BentoCard x={560} y={1180} w={460} h={160} accent />
          <text x={600} y={1246} textAnchor="start"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Multiple steps
          </text>
          <text x={600} y={1298} textAnchor="start"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            required
          </text>
        </g>

        {/* Floating accent dots */}
        <g transform={`translate(960, ${breathe + 1560})`} opacity={reasonCard.opacity * shimmer}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.1} />
          <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.3} />
        </g>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
