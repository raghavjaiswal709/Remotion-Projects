/**
 * Scene 22 — Depends On Input
 * "Depending on what you pass into it."
 * CSV: 100.180s → 102.380s
 * Duration: 66 frames (2.2s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–14): Label + headline spring
 *   Phase 2 (frames 10–40): Input → Method → Output flow
 *   Phase 3 (frames 35–end): Pulse, shimmer
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 24) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene22_DependsOnInput: React.FC = () => {
  const frame = useCurrentFrame();
  const fps  = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 3);

  // ── Phase 2 — Three input rows ─────────────────────────────────────────────
  const rows = [
    { input: 'Train obj',   output: '"Express 42"' },
    { input: 'Station obj', output: '"New Delhi"' },
    { input: 'Ticket obj',  output: '"42A S4"' },
  ];
  const rowEnts = rows.map((_, i) => useSpringEntrance(frame, 10 + i * 8));
  const arrowLen = 160;
  const arrowDashes = rows.map((_, i) => usePathDraw(frame, 14 + i * 8, arrowLen, 18));

  // Method box
  const methEnt = useSpringEntrance(frame, 8);

  // Bottom card
  const btmEnt = useSpringEntrance(frame, 34);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="POLYMORPHISM · INPUT" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            What You
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Pass In
          </text>
        </g>

        {/* ── Central method box ───────────────────────────────────────── */}
        <g opacity={methEnt.opacity} transform={`translate(0, ${methEnt.translateY})`}>
          <rect x={360} y={500} width={360} height={80} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={540} y={550} textAnchor="middle"
            fontFamily={MONO} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            .toString()
          </text>
        </g>

        {/* ── Three input → output rows ────────────────────────────────── */}
        {rows.map((r, i) => {
          const rowY = 660 + i * 220;
          return (
            <g key={i} opacity={rowEnts[i].opacity}
              transform={`translate(0, ${rowEnts[i].translateY})`}>
              {/* Input card */}
              <BentoCard x={60} y={rowY} w={300} h={140} />
              <rect x={60} y={rowY} width={6} height={140} rx={3} fill={COLORS.accent} />
              <text x={100} y={rowY + 52} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>INPUT</text>
              <text x={100} y={rowY + 100} fontFamily={MONO} fontSize={26} fontWeight={800}
                fill={COLORS.white}>{r.input}</text>

              {/* Arrow */}
              <line x1={380} y1={rowY + 70} x2={540} y2={rowY + 70}
                stroke={COLORS.accent} strokeWidth={2.5}
                strokeDasharray={arrowLen} strokeDashoffset={arrowDashes[i]}
                markerEnd="url(#arrow)" strokeLinecap="round" />

              {/* Output card */}
              <BentoCard x={580} y={rowY} w={440} h={140} accent />
              <text x={620} y={rowY + 52} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.accent}>OUTPUT</text>
              <text x={620} y={rowY + 100} fontFamily={MONO} fontSize={26} fontWeight={800}
                fill={COLORS.white}>{r.output}</text>
            </g>
          );
        })}

        {/* ── Bottom insight card ──────────────────────────────────────── */}
        <g opacity={btmEnt.opacity} transform={`translate(0, ${btmEnt.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={120} accent />
          <text x={100} y={1412} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Same call — result depends on the object type
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={36} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.18} />
        </g>
        <circle cx={120} cy={1620 + breathe} r={2.5} fill={COLORS.accent} fillOpacity={0.1} />
        <circle cx={960} cy={1580 - breathe} r={3} fill={COLORS.accent} fillOpacity={0.08} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
