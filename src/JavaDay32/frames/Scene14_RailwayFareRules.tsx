/**
 * Scene14 — Railway System Applies Different Fare Rules
 * "This is how the railway system applies different fare rules to different
 *  train types without rewriting any of the code that calls them."
 * CSV: 65.16s → 72.62s
 * Duration: 254 frames (8.5s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring entrance
 *   Phase 2 (frames 20–100): Railway system diagram — single API, four train types fanning out
 *   Phase 3 (frames 90–end): Pulse on central API, floating trains, counter tick
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

// ── Train type data ─────────────────────────────────────────────────────────
const TRAINS = [
  { name: 'Express', fare: '₹ 2,400', rule: 'Premium + surcharge', color: COLORS.orange, y: 540 },
  { name: 'Metro', fare: '₹ 40', rule: 'Distance-based slabs', color: COLORS.sky_blue, y: 730 },
  { name: 'Freight', fare: '₹ 12,000', rule: 'Weight × distance', color: COLORS.green, y: 920 },
  { name: 'Suburban', fare: '₹ 15', rule: 'Flat zone fare', color: COLORS.amber, y: 1110 },
];

export const Scene14_RailwayFareRules: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ────────────────────────────────────────────────
  const apiNode = useSpringEntrance(frame, 22);

  const train0 = useSpringEntrance(frame, 34);
  const train1 = useSpringEntrance(frame, 46);
  const train2 = useSpringEntrance(frame, 58);
  const train3 = useSpringEntrance(frame, 70);

  const arrow0 = usePathDraw(frame, 38, 260, 22);
  const arrow1 = usePathDraw(frame, 50, 260, 22);
  const arrow2 = usePathDraw(frame, 62, 260, 22);
  const arrow3 = usePathDraw(frame, 74, 260, 22);
  const arrowDashes = [arrow0, arrow1, arrow2, arrow3];

  const noRewriteBadge = useSpringEntrance(frame, 82);
  const resultCard = useSpringEntrance(frame, 92);
  const statLeft = useSpringEntrance(frame, 100);
  const statRight = useSpringEntrance(frame, 108);

  // ── API node border draw ──────────────────────────────────────────────────
  const API_PERIM = 2 * (320 + 180);
  const apiBorderDash = interpolate(frame, [22, 52], [API_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Train card border draws ───────────────────────────────────────────────
  const CARD_PERIM = 2 * (440 + 150);
  const cardBorder0 = interpolate(frame, [34, 60], [CARD_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const cardBorder1 = interpolate(frame, [46, 72], [CARD_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const cardBorder2 = interpolate(frame, [58, 84], [CARD_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const cardBorder3 = interpolate(frame, [70, 96], [CARD_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const cardBorders = [cardBorder0, cardBorder1, cardBorder2, cardBorder3];

  // ── Counters ──────────────────────────────────────────────────────────────
  const trainCount = useCounter(frame, 100, 4, 30);
  const codeChanges = useCounter(frame, 108, 0, 30);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const apiGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.6]);

  const trainSprings = [train0, train1, train2, train3];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RAILWAY SYSTEM · POLYMORPHISM" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={230}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={800} fill={COLORS.deep_black}>
            Different Fare Rules
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={54} fontWeight={900} fill={COLORS.orange}>
            Zero Code Rewrite
          </text>
        </g>

        {/* ── ZONE C — Main visual ───────────────────────────────────────── */}

        {/* Subheading */}
        <g opacity={apiNode.opacity}>
          <text x={60} y={395}
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500}
            fill={COLORS.cool_silver}>
            One API call — four different fare calculations
          </text>
        </g>

        {/* Central API node (left side) */}
        <g opacity={apiNode.opacity} transform={`translate(60, ${440 + apiNode.translateY})`}>
          <rect x={0} y={0} width={320} height={180} rx={16}
            fill="none" stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={API_PERIM} strokeDashoffset={apiBorderDash} />
          <rect x={0} y={0} width={320} height={180} rx={16}
            fill={COLORS.orange} fillOpacity={apiGlow * 0.15} />

          <text x={160} y={52} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600}
            fill={COLORS.cool_silver} letterSpacing="0.12em">
            SINGLE API
          </text>
          <rect x={30} y={70} width={260} height={48} rx={8}
            fill={COLORS.deep_black} fillOpacity={0.06} />
          <text x={160} y={102} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500}
            fill={COLORS.orange}>
            .calculateFare()
          </text>
          <text x={160} y={152} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
            fill={COLORS.cool_silver}>
            Called on Train ref
          </text>

          {/* Pulse ring */}
          {frame > 80 && (
            <rect x={-4} y={-4} width={328} height={188} rx={20}
              fill="none" stroke={COLORS.orange} strokeWidth={1.5}
              opacity={shimmer * 0.4}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '160px 90px' }} />
          )}
        </g>

        {/* Fan-out arrows from API to each train type */}
        {TRAINS.map((t, i) => {
          const startX = 380;
          const startY = 530;
          const endX = 560;
          const endY = t.y + 75;

          return (
            <path key={`arrow-${i}`}
              d={`M ${startX},${startY} C ${startX + 60},${startY} ${endX - 60},${endY} ${endX},${endY}`}
              fill="none" stroke={t.color} strokeWidth={2}
              strokeDasharray={260} strokeDashoffset={arrowDashes[i]}
              strokeLinecap="round" markerEnd="url(#arrow)" />
          );
        })}

        {/* Four train type cards (right side) */}
        {TRAINS.map((t, i) => {
          const float = frame > 90 ? breathe * (i % 2 === 0 ? 1 : -1) * 0.5 : 0;

          return (
            <g key={i} opacity={trainSprings[i].opacity}
              transform={`translate(570, ${t.y + trainSprings[i].translateY + float})`}>
              <rect x={0} y={0} width={440} height={150} rx={14}
                fill="none" stroke={t.color} strokeWidth={1.5}
                strokeDasharray={CARD_PERIM} strokeDashoffset={cardBorders[i]} />
              <rect x={0} y={0} width={440} height={150} rx={14}
                fill={t.color} fillOpacity={0.06} />
              <rect x={0} y={0} width={5} height={150} rx={3} fill={t.color} />

              {/* Train name */}
              <text x={24} y={42}
                fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={800}
                fill={t.color}>
                {t.name}
              </text>

              {/* Fare rule */}
              <text x={24} y={78}
                fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
                fill={COLORS.cool_silver}>
                Rule: {t.rule}
              </text>

              {/* Fare amount */}
              <text x={24} y={118}
                fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
                fill={COLORS.deep_black}>
                Fare: {t.fare}
              </text>

              {/* Right arrow indicator */}
              <path d={`M 400,70 L 418,75 L 400,80`}
                fill="none" stroke={t.color} strokeWidth={2} strokeLinecap="round"
                opacity={0.5} />
            </g>
          );
        })}

        {/* ── No rewrite badge ───────────────────────────────────────────── */}
        <g opacity={noRewriteBadge.opacity} transform={`translate(0, ${noRewriteBadge.translateY})`}>
          <rect x={300} y={1300} width={480} height={54} rx={27}
            fill={COLORS.green} fillOpacity={0.1}
            stroke={COLORS.green} strokeWidth={1.5} />
          <text x={540} y={1334} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={800}
            fill={COLORS.green} letterSpacing="0.08em">
            NO CODE REWRITE NEEDED
          </text>
        </g>

        {/* ── Result summary ─────────────────────────────────────────────── */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <rect x={80} y={1390} width={920} height={120} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={80} y={1390} width={6} height={120} rx={3} fill={COLORS.orange} />
          <text x={120} y={1438}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
            fill={COLORS.deep_black}>
            Add any new train type — caller stays untouched.
          </text>
          <text x={120} y={1478}
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500}
            fill={COLORS.cool_silver}>
            Open for extension, closed for modification.
          </text>
        </g>

        {/* ── Stat counters ──────────────────────────────────────────────── */}
        <g opacity={statLeft.opacity} transform={`translate(80, ${1540 + statLeft.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={12}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <text x={220} y={48} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
            fill={COLORS.orange}>
            {trainCount}
          </text>
          <text x={220} y={90} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
            fill={COLORS.cool_silver}>
            Train Types Supported
          </text>
        </g>

        <g opacity={statRight.opacity} transform={`translate(560, ${1540 + statRight.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={12}
            fill={COLORS.green} fillOpacity={0.08}
            stroke={COLORS.green} strokeWidth={1.5} />
          <text x={220} y={48} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
            fill={COLORS.green}>
            {codeChanges}
          </text>
          <text x={220} y={90} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
            fill={COLORS.cool_silver}>
            Code Changes in Caller
          </text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
