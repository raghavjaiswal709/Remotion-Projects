/**
 * Scene 18 — Default Useless
 * "but the default implementations are rarely useful."
 * CSV: 78.480s → 82.200s
 * Duration: 112 frames (3.73s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):   Label + headline
 *   Phase 2 (frames 12–60):  Three default outputs side by side — ugly/useless
 *   Phase 3 (frames 50–end): Warning pulse, floaters
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
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene18_DefaultUseless: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const defaults = [
    { method: 'toString()', output: 'Train@4a3b2c', problem: 'Memory address, not readable' },
    { method: 'equals()',   output: 'false (same data)', problem: 'Compares reference, not fields' },
    { method: 'hashCode()', output: '1283847291', problem: 'Random per run' },
  ];
  const cardEnts = defaults.map((_, i) => useSpringEntrance(frame, 12 + i * 10));

  // Warning banner
  const warnEnt = useSpringEntrance(frame, 46);

  // Bottom card
  const bottomEnt = useSpringEntrance(frame, 54);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="DEFAULTS · PROBLEM" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Rarely Useful
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Default implementations fall short
          </text>
        </g>

        {/* ── Three default-output cards ───────────────────────────────── */}
        {defaults.map((d, i) => {
          const cardY = 460 + i * 240;
          return (
            <g key={i} opacity={cardEnts[i].opacity}
              transform={`translate(0, ${cardEnts[i].translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={210} />
              {/* Red left bar — problem indicator */}
              <rect x={60} y={cardY} width={6} height={210} rx={3} fill={COLORS.vibrant_red} />
              {/* Method name */}
              <text x={100} y={cardY + 44} fontFamily={MONO} fontSize={28} fontWeight={800}
                fill={COLORS.accent}>{d.method}</text>
              {/* Default output — ugly */}
              <rect x={100} y={cardY + 60} width={820} height={50} rx={10}
                fill="rgba(247,55,79,0.06)" />
              <text x={120} y={cardY + 94} fontFamily={MONO} fontSize={24} fontWeight={500}
                fill={COLORS.vibrant_red}>{d.output}</text>
              {/* Problem text */}
              <text x={100} y={cardY + 150} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>{d.problem}</text>
              {/* X mark */}
              <g transform={`translate(960, ${cardY + 40})`}>
                <circle cx={0} cy={0} r={18} fill={COLORS.vibrant_red} fillOpacity={0.12} />
                <line x1={-7} y1={-7} x2={7} y2={7}
                  stroke={COLORS.vibrant_red} strokeWidth={2.5} strokeLinecap="round" />
                <line x1={7} y1={-7} x2={-7} y2={7}
                  stroke={COLORS.vibrant_red} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            </g>
          );
        })}

        {/* ── Warning banner ───────────────────────────────────────────── */}
        <g opacity={warnEnt.opacity} transform={`translate(0, ${warnEnt.translateY})`}>
          <rect x={200} y={1190} width={680} height={60} rx={30}
            fill={COLORS.vibrant_red} fillOpacity={0.1}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 1220px' }} />
          <text x={540} y={1228} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            Must override for meaningful behavior
          </text>
        </g>

        {/* ── Bottom card ─────────────────────────────────────────────── */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={120} />
          <text x={100} y={1375} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Override = replace the default with your logic
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={80} cy={1550 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.14 * shimmer} />
        <circle cx={1000} cy={1600 - breathe} r={2.5} fill={COLORS.accent} fillOpacity={0.1} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
