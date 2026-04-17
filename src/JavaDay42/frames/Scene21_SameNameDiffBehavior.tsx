/**
 * Scene 21 — Polymorphism Preview
 * "Same method name producing completely different behavior."
 * CSV: 94.940s → 100.180s
 * Duration: 157 frames (5.23s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):   Label + headline
 *   Phase 2 (frames 12–70):  Three class columns with same method, different output
 *   Phase 3 (frames 60–end): Micro-animations
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene21_SameNameDiffBehavior: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 9);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const classes = [
    { name: 'Train', method: 'toString()', output: '"Express 42"', color: COLORS.accent },
    { name: 'Station', method: 'toString()', output: '"New Delhi"', color: COLORS.white },
    { name: 'Ticket', method: 'toString()', output: '"42A S4"', color: COLORS.accent },
  ];
  const classEnts = classes.map((_, i) => useSpringEntrance(frame, 14 + i * 10));

  // "Same name" label
  const sameEnt = useSpringEntrance(frame, 46);

  // Arrows from shared root
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 50, arrowLen, 20);

  // Result card
  const resultEnt = useSpringEntrance(frame, 56);

  // Key insight card
  const insightEnt = useSpringEntrance(frame, 64);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="POLYMORPHISM · PREVIEW" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={270} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Same Name
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={360} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            Different Behavior
          </text>
        </g>

        {/* ── Shared method label ──────────────────────────────────────── */}
        <g opacity={sameEnt.opacity} transform={`translate(0, ${sameEnt.translateY})`}>
          <rect x={340} y={430} width={400} height={50} rx={25}
            fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={540} y={464} textAnchor="middle"
            fontFamily={MONO} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            .toString()
          </text>
        </g>

        {/* ── Arrows down to each class ───────────────────────────────── */}
        {[0, 1, 2].map(i => {
          const cx = 220 + i * 320;
          return (
            <line key={i} x1={540} y1={480} x2={cx} y2={540}
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
              strokeLinecap="round" opacity={0.5} />
          );
        })}

        {/* ── Three class columns ──────────────────────────────────────── */}
        {classes.map((cls, i) => {
          const cx = 60 + i * 340;
          const w = 300;
          return (
            <g key={i} opacity={classEnts[i].opacity}
              transform={`translate(0, ${classEnts[i].translateY})`}>
              {/* Class card */}
              <BentoCard x={cx} y={560} w={w} h={420} accent={i !== 1} />
              {/* Class name header */}
              <rect x={cx} y={560} width={w} height={60} rx={20}
                fill={COLORS.accent} fillOpacity={0.08} />
              <text x={cx + w / 2} y={600} textAnchor="middle"
                fontFamily={FONT} fontSize={30} fontWeight={800} fill={cls.color}>
                {cls.name}
              </text>
              {/* Method badge */}
              <text x={cx + w / 2} y={670} textAnchor="middle"
                fontFamily={MONO} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
                {cls.method}
              </text>
              {/* Arrow down */}
              <line x1={cx + w / 2} y1={690} x2={cx + w / 2} y2={740}
                stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
                markerEnd="url(#arrow)" opacity={0.5} />
              {/* Output box */}
              <rect x={cx + 20} y={760} width={w - 40} height={60} rx={12}
                fill={COLORS.accent} fillOpacity={0.08} />
              <text x={cx + w / 2} y={800} textAnchor="middle"
                fontFamily={MONO} fontSize={24} fontWeight={800} fill={COLORS.accent}>
                {cls.output}
              </text>
              {/* Unique check icon */}
              <g transform={`translate(${cx + w / 2}, 870)`}>
                <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.1}
                  transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
                <text textAnchor="middle" y={7}
                  fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
                  {i === 0 ? 'A' : i === 1 ? 'B' : 'C'}
                </text>
              </g>
              {/* "UNIQUE" label */}
              <text x={cx + w / 2} y={920} textAnchor="middle"
                fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
                UNIQUE
              </text>
            </g>
          );
        })}

        {/* ── Result card ──────────────────────────────────────────────── */}
        <g opacity={resultEnt.opacity} transform={`translate(0, ${resultEnt.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={120} accent />
          <text x={100} y={1112} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            One method — three different results
          </text>
        </g>

        {/* ── Key insight card ─────────────────────────────────────────── */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={200} />
          <rect x={60} y={1200} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1260} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">Polymorphism</text>
          <text x={100} y={1310} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            Same interface, different implementations
          </text>
          <text x={100} y={1360} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The JVM decides which version to call at runtime
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={100} cy={1540 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.1} />
        <circle cx={980} cy={1600 - breathe} r={2.5} fill={COLORS.accent} fillOpacity={0.08} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
