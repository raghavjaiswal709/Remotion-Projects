/**
 * Scene15 — Same Name, Different Class, Different Behavior
 * "Same name, different class, different behavior. That is method overriding."
 * CSV: 73.38s → 79.08s
 * Duration: 172 frames (5.7s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + per-word headline spring
 *   Phase 2 (frames 20–90):  Three-row comparison: Same/Different/Different with visual emphasis
 *   Phase 3 (frames 80–end): Pulse on METHOD OVERRIDING conclusion, breathing elements
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

// ── Row data for the three-part statement ───────────────────────────────────
const ROWS = [
  {
    label: 'SAME',
    value: 'Method Name',
    detail: 'calculateFare()',
    color: COLORS.sky_blue,
    icon: '=',
  },
  {
    label: 'DIFFERENT',
    value: 'Class',
    detail: 'Express / Metro / Freight',
    color: COLORS.orange,
    icon: '≠',
  },
  {
    label: 'DIFFERENT',
    value: 'Behavior',
    detail: 'Premium / Slab / Weight fare',
    color: COLORS.green,
    icon: '≠',
  },
];

export const Scene15_SameDiffOverriding: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);

  // Per-word headline
  const HEADLINE_WORDS = ['Same', 'Name,', 'Different', 'Class,', 'Different', 'Behavior.'];
  const word0 = useSpringEntrance(frame, 4);
  const word1 = useSpringEntrance(frame, 10);
  const word2 = useSpringEntrance(frame, 16);
  const word3 = useSpringEntrance(frame, 22);
  const word4 = useSpringEntrance(frame, 28);
  const word5 = useSpringEntrance(frame, 34);
  const wordSprings = [word0, word1, word2, word3, word4, word5];

  // ── Phase 2: Content build ────────────────────────────────────────────────
  const row0 = useSpringEntrance(frame, 30);
  const row1 = useSpringEntrance(frame, 42);
  const row2 = useSpringEntrance(frame, 54);
  const rowSprings = [row0, row1, row2];

  const connector01 = usePathDraw(frame, 45, 140, 20);
  const connector12 = usePathDraw(frame, 57, 140, 20);
  const connectors = [connector01, connector12];

  // ── Row border draws ──────────────────────────────────────────────────────
  const ROW_PERIM = 2 * (920 + 200);
  const rowBorder0 = interpolate(frame, [30, 58], [ROW_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rowBorder1 = interpolate(frame, [42, 70], [ROW_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rowBorder2 = interpolate(frame, [54, 82], [ROW_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rowBorders = [rowBorder0, rowBorder1, rowBorder2];

  const conclusionBadge = useSpringEntrance(frame, 68);
  const conclusionText = useSpringEntrance(frame, 76);
  const definitionCard = useSpringEntrance(frame, 84);
  const arrowDown = usePathDraw(frame, 82, 120, 20);

  // ── Conclusion border draw ────────────────────────────────────────────────
  const BADGE_PERIM = 2 * (600 + 70);
  const badgeBorderDash = interpolate(frame, [68, 92], [BADGE_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="METHOD OVERRIDING · SUMMARY" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Per-word headline ─────────────────────────────────── */}
        {HEADLINE_WORDS.map((w, i) => {
          const isAccent = w.startsWith('Different') || w.startsWith('Behavior');
          const xPos = 60;
          const yBase = 210;
          // Layout: 2 words per line × 3 lines
          const row = Math.floor(i / 2);
          const col = i % 2;
          const x = xPos + col * 340;
          const y = yBase + row * 72;

          return (
            <g key={i} opacity={wordSprings[i].opacity}
              transform={`translate(0, ${wordSprings[i].translateY})`}>
              <text x={x} y={y}
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={56} fontWeight={900}
                fill={isAccent ? COLORS.orange : COLORS.deep_black}>
                {w}
              </text>
            </g>
          );
        })}

        {/* ── ZONE C — Three comparison rows ─────────────────────────────── */}
        {ROWS.map((r, i) => {
          const y = 500 + i * 240;
          const float = frame > 90 ? breathe * (i === 0 ? 0 : i === 1 ? 0.8 : -0.6) : 0;

          return (
            <g key={i}>
              {/* Row card */}
              <g opacity={rowSprings[i].opacity}
                transform={`translate(80, ${y + rowSprings[i].translateY + float})`}>
                <rect x={0} y={0} width={920} height={200} rx={16}
                  fill="none" stroke={r.color} strokeWidth={2}
                  strokeDasharray={ROW_PERIM} strokeDashoffset={rowBorders[i]} />
                <rect x={0} y={0} width={920} height={200} rx={16}
                  fill={r.color} fillOpacity={0.05} />
                <rect x={0} y={0} width={6} height={200} rx={3} fill={r.color} />

                {/* Icon badge */}
                <circle cx={60} cy={100} r={36} fill={r.color} fillOpacity={0.12}
                  stroke={r.color} strokeWidth={1.5} />
                <text x={60} y={112} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={900}
                  fill={r.color}>
                  {r.icon}
                </text>

                {/* Label */}
                <text x={120} y={50}
                  fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700}
                  fill={r.color} letterSpacing="0.12em">
                  {r.label}
                </text>

                {/* Value (large) */}
                <text x={120} y={105}
                  fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={800}
                  fill={COLORS.deep_black}>
                  {r.value}
                </text>

                {/* Detail */}
                <text x={120} y={155}
                  fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400}
                  fill={COLORS.cool_silver}>
                  {r.detail}
                </text>

                {/* Right accent bar for emphasis */}
                <rect x={880} y={40} width={4} height={120} rx={2} fill={r.color} opacity={0.4} />
              </g>

              {/* Connector between rows */}
              {i < 2 && (
                <path d={`M 540,${y + 200} L 540,${y + 240}`}
                  fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
                  strokeDasharray={140} strokeDashoffset={connectors[i]}
                  strokeLinecap="round" />
              )}
            </g>
          );
        })}

        {/* ── Downward arrow to conclusion ────────────────────────────────── */}
        <path d="M 540,1180 L 540,1260"
          fill="none" stroke={COLORS.orange} strokeWidth={2.5}
          strokeDasharray={120} strokeDashoffset={arrowDown}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Conclusion badge: METHOD OVERRIDING ────────────────────────── */}
        <g opacity={conclusionBadge.opacity} transform={`translate(0, ${conclusionBadge.translateY})`}>
          <rect x={240} y={1270} width={600} height={70} rx={35}
            fill="none" stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={BADGE_PERIM} strokeDashoffset={badgeBorderDash} />
          <rect x={240} y={1270} width={600} height={70} rx={35}
            fill={COLORS.orange} fillOpacity={0.1} />

          {/* Pulse ring */}
          {frame > 90 && (
            <rect x={236} y={1266} width={608} height={78} rx={39}
              fill="none" stroke={COLORS.orange} strokeWidth={1.5}
              opacity={shimmer * 0.4}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '540px 1305px' }} />
          )}

          <text x={540} y={1315} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={900}
            fill={COLORS.orange} letterSpacing="0.1em">
            METHOD OVERRIDING
          </text>
        </g>

        {/* ── Conclusion explanatory text ─────────────────────────────────── */}
        <g opacity={conclusionText.opacity} transform={`translate(0, ${conclusionText.translateY})`}>
          <text x={540} y={1400} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
            fill={COLORS.cool_silver}>
            Child classes redefine inherited behavior
          </text>
        </g>

        {/* ── Definition card ────────────────────────────────────────────── */}
        <g opacity={definitionCard.opacity} transform={`translate(0, ${definitionCard.translateY})`}>
          <rect x={80} y={1440} width={920} height={220} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.deep_black} strokeWidth={1} />
          <rect x={80} y={1440} width={6} height={220} rx={3} fill={COLORS.orange} />

          <text x={120} y={1490}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
            fill={COLORS.deep_black}>
            Key Principle:
          </text>
          <text x={120} y={1536}
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500}
            fill={COLORS.cool_silver}>
            The method signature is the contract.
          </text>
          <text x={120} y={1576}
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500}
            fill={COLORS.cool_silver}>
            The implementation is the freedom.
          </text>
          <text x={120} y={1622}
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
            fill={COLORS.orange}>
            Each child delivers its own version.
          </text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
