/**
 * Scene 11 — Dozens of Steps
 * "Complex tasks require dozens of steps."
 * CSV: 35.040s → 37.860s
 * Duration: 85 frames (2.8s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline
 *   Phase 2 (frames 16–60): Grid of step tiles filling screen, staggered
 *   Phase 3 (frames 50–end): Shimmer across tiles
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

// 6 columns x 6 rows = 36 step tiles
const COLS = 6;
const ROWS = 6;
const TILE_W = 140;
const TILE_H = 140;
const GAP = 16;
const GRID_W = COLS * TILE_W + (COLS - 1) * GAP;
const GRID_X = Math.round((1080 - GRID_W) / 2);
const GRID_Y = 520;

export const Scene11_DozensOfSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 10);

  // Phase 2 — tiles staggered
  const tiles = Array.from({ length: COLS * ROWS }, (_, idx) => {
    const col = idx % COLS;
    const row = Math.floor(idx / COLS);
    const delay = 16 + Math.floor((row * COLS + col) * 0.8);
    const f = Math.max(0, frame - delay);
    const p = spring({ frame: f, fps, config: SPRING_CONFIG });
    const op = interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
    const ty = interpolate(p, [0, 1], [20, 0]);
    const x = GRID_X + col * (TILE_W + GAP);
    const y = GRID_Y + row * (TILE_H + GAP);
    return { idx, x, y, opacity: op, translateY: ty, num: idx + 1 };
  });

  // Phase 3
  const shimmerWave = (x: number, y: number) => {
    const phase = (x + y) * 0.005 + frame * 0.04;
    return interpolate(Math.sin(phase), [-1, 1], [0.7, 1]);
  };

  // Counter
  const counterVal = Math.round(interpolate(frame, [20, 65], [0, 36], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SCALE · COMPLEXITY" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Complex Tasks
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            Require <tspan fontStyle="italic">Dozens</tspan> of Steps
          </text>
        </g>

        {/* ZONE C — Grid of step tiles */}
        {tiles.map(t => (
          <g key={t.idx} opacity={t.opacity} transform={`translate(0, ${t.translateY})`}>
            <rect
              x={t.x} y={t.y} width={TILE_W} height={TILE_H} rx={14}
              fill={COLORS.bg_secondary}
              stroke={t.num <= counterVal ? COLORS.accent : 'rgba(255,255,255,0.08)'}
              strokeWidth={t.num <= counterVal ? 2 : 1}
              opacity={shimmerWave(t.x, t.y)}
            />
            <text
              x={t.x + TILE_W / 2}
              y={t.y + TILE_H / 2 + 14}
              textAnchor="middle"
              fontFamily={FONT}
              fontSize={40} fontWeight={800}
              fill={t.num <= counterVal ? COLORS.accent : COLORS.text_muted}
              opacity={t.num <= counterVal ? 1 : 0.3}
            >
              {t.num}
            </text>
          </g>
        ))}

        {/* Counter display */}
        <g opacity={headA.opacity}>
          <text x={540} y={1500} textAnchor="middle" fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent} opacity={0.12}>
            {counterVal}
          </text>
          <text x={540} y={1490} textAnchor="middle" fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent}>
            {counterVal}
          </text>
          <text x={540} y={1560} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            STEPS
          </text>
        </g>

        {/* Bottom summary card */}
        <g opacity={headB.opacity * 0.85}>
          <BentoCard x={60} y={1610} w={960} h={100} />
          <text x={540} y={1672} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            One task → many atomic operations
          </text>
        </g>

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
