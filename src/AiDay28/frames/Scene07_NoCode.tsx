/**
 * Scene 07 — NoCode
 * "It does not run code."
 * CSV: 21.400s → 22.740s
 * Duration: 53 frames (1.77s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–15):   Label + "NO CODE" hero text slam-in
 *   Phase 2 (frames 12–35):  Large code terminal with strike-through, forbidden icon
 *   Phase 3 (frames 30–end): Glitch shimmer, particle drift
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene07_NoCode: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ─────────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const heroNo = (() => {
    const f = Math.max(0, frame - 3);
    const p = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(p, [0, 1], [60, 0]);
    const op = interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  })();
  const heroCode = (() => {
    const f = Math.max(0, frame - 8);
    const p = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(p, [0, 1], [60, 0]);
    const op = interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  })();

  // ── Phase 2 ─────────────────────────────────────────────────────────────────
  const terminalEnter = useSpringEntrance(frame, 12);
  const strikeLen = 800;
  const strikeDash = usePathDraw(frame, 18, strikeLen, 15);
  const forbiddenEnter = useSpringEntrance(frame, 20);
  const card1 = useSpringEntrance(frame, 26);
  const card2 = useSpringEntrance(frame, 34);

  // Forbidden circle draw
  const circLen = 500;
  const circDash = usePathDraw(frame, 20, circLen, 18);
  const slashLen = 200;
  const slashDash = usePathDraw(frame, 24, slashLen, 12);

  // ── Phase 3 ─────────────────────────────────────────────────────────────────
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;
  const glitch = Math.sin(frame * 0.3) > 0.7 ? 2 : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · CONSTRAINT" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero "NO CODE" ───────────────────────────────────── */}
        {/* Ghost */}
        <text x={540} y={380} textAnchor="middle"
          fontFamily={FONT} fontSize={180} fontWeight={800}
          fill={COLORS.vibrant_red} opacity={heroNo.op * 0.05}>
          NO
        </text>
        <g transform={`translate(0, ${heroNo.ty})`} opacity={heroNo.op}>
          <text x={540} y={370} textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.vibrant_red}>
            NO
          </text>
        </g>
        <g transform={`translate(0, ${heroCode.ty})`} opacity={heroCode.op}>
          <text x={540} y={520} textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.white}>
            CODE
          </text>
        </g>

        {/* ── ZONE C — Terminal illustration ─────────────────────────────── */}

        {/* Terminal window */}
        <g opacity={terminalEnter.opacity}
           transform={`translate(540, ${820 + terminalEnter.translateY})`}>
          {/* Terminal body */}
          <rect x={-400} y={-140} width={800} height={420} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          {/* Title bar */}
          <rect x={-400} y={-140} width={800} height={50} rx={20}
            fill="rgba(255,255,255,0.05)" />
          <rect x={-400} y={-90} width={800} height={2} fill="rgba(255,255,255,0.08)" />
          {/* Window dots */}
          <circle cx={-360} cy={-115} r={8} fill={COLORS.vibrant_red} opacity={0.6} />
          <circle cx={-330} cy={-115} r={8} fill="rgba(255,255,255,0.15)" />
          <circle cx={-300} cy={-115} r={8} fill="rgba(255,255,255,0.15)" />

          {/* Code lines with glitch offset */}
          <text x={-360} y={-50 + glitch}
            fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.5}>
            {'> python main.py'}
          </text>
          <text x={-360} y={0 + glitch}
            fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.5}>
            {'> npm run build'}
          </text>
          <text x={-360} y={50 + glitch}
            fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.5}>
            {'> curl api.example.com'}
          </text>
          <text x={-360} y={100 + glitch}
            fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.5}>
            {'> SELECT * FROM users'}
          </text>
          <text x={-360} y={150}
            fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={500}
            fill={COLORS.vibrant_red} opacity={0.5}>
            {'  [ACCESS DENIED]'}
          </text>

          {/* Strike-through across code */}
          <line x1={-380} y1={20} x2={380} y2={20}
            stroke={COLORS.vibrant_red} strokeWidth={4} opacity={0.5}
            strokeDasharray={strikeLen} strokeDashoffset={strikeDash}
            strokeLinecap="round"
          />
        </g>

        {/* Forbidden sign overlay */}
        <g opacity={forbiddenEnter.opacity}
           transform={`translate(800, ${660 + forbiddenEnter.translateY})`}>
          <circle cx={0} cy={0} r={60} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={5}
            strokeDasharray={circLen} strokeDashoffset={circDash}
          />
          <line x1={-40} y1={40} x2={40} y2={-40}
            stroke={COLORS.vibrant_red} strokeWidth={5}
            strokeDasharray={slashLen} strokeDashoffset={slashDash}
            strokeLinecap="round"
          />
        </g>

        {/* ── Detail cards ─────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={200} accent />
          <text x={100} y={1230}
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            No runtime
          </text>
          <text x={100} y={1290}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Cannot run programs
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={200} />
          <text x={600} y={1230}
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            No I/O access
          </text>
          <text x={600} y={1290}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Cannot read databases
          </text>
        </g>

        {/* Bottom summary card */}
        <g opacity={card2.opacity * shimmer} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={140} />
          <text x={540} y={1470} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Text generation is the only capability
          </text>
        </g>

        {/* Floating particles */}
        {[
          { x: 80, y: 580, r: 3 }, { x: 1000, y: 560, r: 4 },
          { x: 120, y: 1620, r: 3 }, { x: 950, y: 1650, r: 4 },
          { x: 540, y: 1700, r: 3 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 1.2) * 6}
            r={pt.r} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
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
