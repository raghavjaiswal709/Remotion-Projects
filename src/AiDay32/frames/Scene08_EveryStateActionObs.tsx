/**
 * Scene 08 — Every State, Action, Observation
 * "every state, every action, every observation, in order."
 * CSV: 23.900s → 28.520s
 * Duration: 139 frames (4.63s)
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline spring
 *   Phase 2 (15–80): Three massive columns reveal with staggered rows
 *   Phase 3 (70–end): Pulse on columns, breathing, ordering arrow
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene08_EveryStateActionObs: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);

  // ── Phase 2 — Three columns ──
  const colDelay = [16, 26, 36];
  const columns = colDelay.map(d => useSpringEntrance(frame, d));

  // Column data
  const colData = [
    {
      title: 'STATE', icon: 'S', color: COLORS.accent,
      rows: ['s₀ : initial', 's₁ : after search', 's₂ : after read', 's₃ : final'],
    },
    {
      title: 'ACTION', icon: 'A', color: COLORS.accent,
      rows: ['a₁ : search()', 'a₂ : read()', 'a₃ : summarize()'],
    },
    {
      title: 'OBSERVATION', icon: 'O', color: COLORS.accent,
      rows: ['o₁ : results list', 'o₂ : document text', 'o₃ : summary text'],
    },
  ];

  // Row stagger per column
  const rowSprings = colData.map((col, ci) =>
    col.rows.map((_, ri) => {
      const f = Math.max(0, frame - colDelay[ci] - 10 - ri * 8);
      const sp = spring({ frame: f, fps, config: SPRING_SNAP });
      const op = interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
      const ty = interpolate(sp, [0, 1], [20, 0]);
      return { op, ty };
    })
  );

  // Ordering arrow
  const arrowLen = 900;
  const arrowDash = usePathDraw(frame, 70, arrowLen, 40);

  // "In order" label
  const orderLabel = useSpringEntrance(frame, 80);

  // ── Phase 3 ──
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;

  // Highlight sweep
  const highlightCol = Math.floor(interpolate(frame, [50, 120], [0, 3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="MODULE 5 · TRAJECTORY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Every Element
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            In Order
          </text>
        </g>

        {/* ── ZONE C — Three columns ── */}
        {colData.map((col, ci) => {
          const cx = 60 + ci * 330;
          const cw = 310;
          const ch = 720;
          const cIn = columns[ci];
          const isHighlight = ci === highlightCol;

          return (
            <g key={ci} opacity={cIn.opacity} transform={`translate(0, ${cIn.translateY})`}>
              {/* Column card */}
              <BentoCard x={cx} y={480} w={cw} h={ch} accent={isHighlight} />

              {/* Column header */}
              <rect x={cx} y={480} width={cw} height={80} rx={20}
                fill={COLORS.accent} fillOpacity={isHighlight ? 0.15 : 0.06} />
              {/* Icon circle */}
              <circle cx={cx + 40} cy={520} r={20}
                fill={COLORS.accent} fillOpacity={0.2}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={cx + 40} y={527} textAnchor="middle"
                fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
                {col.icon}
              </text>
              <text x={cx + 75} y={530} fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.accent} letterSpacing="0.1em">
                {col.title}
              </text>

              {/* Rows */}
              {col.rows.map((row, ri) => {
                const rs = rowSprings[ci][ri];
                const ry = 590 + ri * 140;
                return (
                  <g key={ri} opacity={rs.op} transform={`translate(0, ${rs.ty})`}>
                    {/* Row separator */}
                    {ri > 0 && (
                      <line x1={cx + 20} y1={ry - 10} x2={cx + cw - 20} y2={ry - 10}
                        stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                    )}
                    {/* Index dot */}
                    <circle cx={cx + 30} cy={ry + 20} r={8}
                      fill={COLORS.accent} fillOpacity={0.12}
                      stroke={COLORS.accent} strokeWidth={1.5} />
                    <text x={cx + 30} y={ry + 25} textAnchor="middle"
                      fontFamily={FONT} fontSize={12} fontWeight={800} fill={COLORS.accent}>
                      {ri + 1}
                    </text>
                    {/* Row text */}
                    <text x={cx + 55} y={ry + 28}
                      fontFamily={FONT} fontSize={26} fontWeight={800}
                      fill={COLORS.white} opacity={0.85}>
                      {row}
                    </text>
                  </g>
                );
              })}

              {/* Pulse ring on highlighted column */}
              {isHighlight && (
                <rect x={cx - 2} y={478} width={cw + 4} height={ch + 4} rx={22}
                  fill="none" stroke={COLORS.accent} strokeWidth={1}
                  opacity={0.3 * shimmer}
                  transform={`scale(${pulse})`}
                  style={{ transformOrigin: `${cx + cw / 2}px ${480 + ch / 2}px` }} />
              )}
            </g>
          );
        })}

        {/* ── Ordering arrow at bottom ── */}
        <path
          d="M 120,1280 L 960,1280"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />
        {/* Track */}
        <line x1={120} y1={1280} x2={960} y2={1280}
          stroke="rgba(255,255,255,0.04)" strokeWidth={3} />

        {/* "IN ORDER" label */}
        <g opacity={orderLabel.opacity} transform={`translate(0, ${orderLabel.translateY})`}>
          <text x={540} y={1340} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.2em" fontStyle="italic">
            IN ORDER
          </text>
        </g>

        {/* Sequence formula card */}
        <g opacity={orderLabel.opacity} transform={`translate(0, ${orderLabel.translateY})`}>
          <BentoCard x={120} y={1400} w={840} h={160} accent />
          <text x={540} y={1470} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            {'τ = ( s₀, a₁, o₁, s₁, a₂, o₂, s₂, a₃, o₃, s₃ )'}
          </text>
          <text x={540} y={1520} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The complete ordered sequence
          </text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2, 3, 4].map(i => {
          const dx = 160 + i * 190;
          const dy = 1640 + breathe * (i % 2 === 0 ? 1 : -1);
          return (
            <circle key={i} cx={dx} cy={dy} r={4}
              fill={COLORS.accent} opacity={0.12 * shimmer} />
          );
        })}

        {/* ── CAPTION ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
