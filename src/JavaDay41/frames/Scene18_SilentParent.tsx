/**
 * Scene 18 — Silent Parent
 * "Every train in the system has one silent parent it never declared,"
 * CSV: 76.820s → 81.220s
 * Duration: 132 frames (4.40s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Mysterious reveal: the Object class teaser. A large inheritance tree with
 * a shadowed parent node at the top that trains extend without declaring.
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline with mystery tone
 *   Phase 2 (frames 16–90): Inheritance tree with silent parent node + train children
 *   Phase 3 (frames 75–end): Parent glow, shadow pulse, connector breathe
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

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

export const Scene18_SilentParent: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headWord1 = useSpringEntrance(frame, 4);
  const headWord2 = useSpringEntrance(frame, 10);
  const headWord3 = useSpringEntrance(frame, 16);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Silent parent node
  const parentNode = useSpringEntrance(frame, 22);
  const parentGlow = spring({ frame: Math.max(0, frame - 22), fps, config: SPRING_SOFT });

  // Inheritance lines down
  const inheritLine1Len = 160;
  const inheritLine1Dash = usePathDraw(frame, 30, inheritLine1Len, 22);
  const inheritLine2Len = 160;
  const inheritLine2Dash = usePathDraw(frame, 34, inheritLine2Len, 22);
  const inheritLine3Len = 160;
  const inheritLine3Dash = usePathDraw(frame, 38, inheritLine3Len, 22);

  // Train child nodes
  const child1 = useSpringEntrance(frame, 42);
  const child2 = useSpringEntrance(frame, 48);
  const child3 = useSpringEntrance(frame, 54);

  // Question mark badge
  const questionEntry = useSpringEntrance(frame, 28);

  // "NEVER DECLARED" label
  const neverEntry = useSpringEntrance(frame, 60);

  // Bottom explanation cards
  const card1 = useSpringEntrance(frame, 64);
  const card2 = useSpringEntrance(frame, 72);

  // Summary strip
  const summaryEntry = useSpringEntrance(frame, 78);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const parentPulse = 0.3 + Math.sin(frame * 0.05) * 0.12;
  const shadowFloat = Math.sin(frame * 0.04) * 6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INHERITANCE · HIDDEN PARENT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────── */}
        <g opacity={headWord1.opacity} transform={`translate(0, ${headWord1.translateY})`}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            One Silent
          </text>
        </g>
        <g opacity={headWord2.opacity} transform={`translate(0, ${headWord2.translateY})`}>
          <text x={60} y={370} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Parent
          </text>
        </g>
        <g opacity={headWord3.opacity} transform={`translate(0, ${headWord3.translateY})`}>
          <text x={60} y={440} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            Never Declared — Always There
          </text>
        </g>

        {/* ── Silent Parent Node (top center) ─────────────────────────── */}
        {/* Ambient glow ring behind parent */}
        <circle cx={540} cy={580 + shadowFloat} r={80}
          fill="none" stroke={COLORS.accent}
          strokeWidth={2} strokeOpacity={parentPulse * parentNode.opacity * 0.3}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 580px' }} />
        <circle cx={540} cy={580 + shadowFloat} r={96}
          fill="none" stroke={COLORS.accent}
          strokeWidth={1} strokeOpacity={parentPulse * parentNode.opacity * 0.12} />

        {/* Parent box — slightly mysterious */}
        <g opacity={parentNode.opacity} transform={`translate(0, ${parentNode.translateY + shadowFloat})`}>
          <rect x={400} y={530} width={280} height={100} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeOpacity={0.6} />
          {/* Inner shadow lines to suggest hidden-ness */}
          <rect x={420} y={548} width={240} height={6} rx={3}
            fill={COLORS.accent} fillOpacity={0.06} />
          <rect x={420} y={562} width={140} height={6} rx={3}
            fill={COLORS.accent} fillOpacity={0.04} />
        </g>

        {/* Question mark over parent */}
        <g opacity={questionEntry.opacity}
          transform={`translate(540, ${520 + questionEntry.translateY + shadowFloat})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer}>
            ?
          </text>
        </g>

        {/* Parent label */}
        <g opacity={parentNode.opacity}>
          <text x={540} y={600 + shadowFloat} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic" opacity={0.7}>
            (silent parent)
          </text>
        </g>

        {/* ── Inheritance lines (parent → children) ───────────────────── */}
        {/* Line 1 → Train KL2401 */}
        <line x1={440} y1={630 + shadowFloat} x2={240} y2={790}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.3}
          strokeDasharray={inheritLine1Len} strokeDashoffset={inheritLine1Dash}
          strokeLinecap="round" />
        {/* Arrow head */}
        <polygon
          points="232,784 248,784 240,798"
          fill={COLORS.accent} fillOpacity={child1.opacity * 0.4} />

        {/* Line 2 → Train MH1102 */}
        <line x1={540} y1={630 + shadowFloat} x2={540} y2={790}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.3}
          strokeDasharray={inheritLine2Len} strokeDashoffset={inheritLine2Dash}
          strokeLinecap="round" />
        <polygon
          points="532,784 548,784 540,798"
          fill={COLORS.accent} fillOpacity={child2.opacity * 0.4} />

        {/* Line 3 → Train AP0503 */}
        <line x1={640} y1={630 + shadowFloat} x2={840} y2={790}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.3}
          strokeDasharray={inheritLine3Len} strokeDashoffset={inheritLine3Dash}
          strokeLinecap="round" />
        <polygon
          points="832,784 848,784 840,798"
          fill={COLORS.accent} fillOpacity={child3.opacity * 0.4} />

        {/* ── Child Train Nodes ───────────────────────────────────────── */}
        {/* Child 1: KL2401 */}
        <g opacity={child1.opacity} transform={`translate(0, ${child1.translateY})`}>
          <rect x={120} y={800} width={240} height={110} rx={16}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          {/* Mini locomotive icon */}
          <rect x={140} y={820} width={50} height={28} rx={4}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={150} cy={858} r={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={176} cy={858} r={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <text x={200} y={842} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            Train KL2401
          </text>
          <text x={140} y={892} fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.text_muted}>
            extends ???
          </text>
        </g>

        {/* Child 2: MH1102 */}
        <g opacity={child2.opacity} transform={`translate(0, ${child2.translateY})`}>
          <rect x={420} y={800} width={240} height={110} rx={16}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <rect x={440} y={820} width={50} height={28} rx={4}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={450} cy={858} r={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={476} cy={858} r={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <text x={500} y={842} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            Train MH1102
          </text>
          <text x={440} y={892} fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.text_muted}>
            extends ???
          </text>
        </g>

        {/* Child 3: AP0503 */}
        <g opacity={child3.opacity} transform={`translate(0, ${child3.translateY})`}>
          <rect x={720} y={800} width={240} height={110} rx={16}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <rect x={740} y={820} width={50} height={28} rx={4}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={750} cy={858} r={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={776} cy={858} r={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <text x={800} y={842} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            Train AP0503
          </text>
          <text x={740} y={892} fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.text_muted}>
            extends ???
          </text>
        </g>

        {/* ── "NEVER DECLARED" badge ──────────────────────────────────── */}
        <g opacity={neverEntry.opacity} transform={`translate(0, ${neverEntry.translateY})`}>
          <rect x={340} y={950} width={400} height={56} rx={28}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={986} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            NEVER DECLARED
          </text>
        </g>

        {/* ── Explanation cards ────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1040} w={460} h={200} accent />
          <text x={100} y={1090} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            IMPLICIT
          </text>
          <text x={100} y={1132} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Every class extends
          </text>
          <text x={100} y={1176} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            a hidden parent
          </text>
          <text x={100} y={1218} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Java does this automatically
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1040} w={460} h={200} />
          <text x={600} y={1090} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            INVISIBLE
          </text>
          <text x={600} y={1132} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            No extends keyword
          </text>
          <text x={600} y={1176} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            in your code needed
          </text>
          <text x={600} y={1218} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Always present behind the scenes
          </text>
        </g>

        {/* ── Code snippet — class Train (no explicit extends) ────────── */}
        <g opacity={summaryEntry.opacity} transform={`translate(0, ${summaryEntry.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={120} />
          <rect x={60} y={1280} width={6} height={120} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1328}
            fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.text_muted}>
            <tspan fill={COLORS.accent}>class</tspan>{' '}
            <tspan fill={COLORS.white}>Train</tspan>{' '}
            <tspan fill={COLORS.text_muted}>{'{'}</tspan>{' '}
            <tspan fill={COLORS.text_muted} fontSize={20}>
              {'// ← secretly extends ???'}
            </tspan>
          </text>
          <text x={100} y={1378}
            fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.text_muted}>
            <tspan fill={COLORS.text_muted}>{'}'}</tspan>
          </text>
        </g>

        {/* ── Floating mystery particles ──────────────────────────────── */}
        {[
          { x: 120, y: 1480, r: 5 },
          { x: 960, y: 1500, r: 4 },
          { x: 300, y: 1550, r: 3 },
          { x: 780, y: 1530, r: 5 },
          { x: 540, y: 1580, r: 6 },
          { x: 200, y: 1620, r: 4 },
          { x: 880, y: 1640, r: 3 },
        ].map((dot, i) => (
          <circle key={i}
            cx={dot.x}
            cy={dot.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={dot.r}
            fill={COLORS.accent}
            fillOpacity={0.02 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s18.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
