/**
 * Scene 08 — NoReach
 * "It does not reach into a system and pull a result back."
 * CSV: 22.740s → 26.200s
 * Duration: 105 frames (3.50s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring reveal
 *   Phase 2 (frames 15–60):  Robot arm reaching toward database, blocked by wall
 *   Phase 3 (frames 50–end): Rejection bounce, wall glow, particle drift
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

export const Scene08_NoReach: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ─────────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headline1 = useSpringEntrance(frame, 5);
  const headline2 = useSpringEntrance(frame, 10);

  // ── Phase 2 ─────────────────────────────────────────────────────────────────
  const robotEnter = useSpringEntrance(frame, 14);
  const wallEnter = useSpringEntrance(frame, 20);
  const dbEnter = useSpringEntrance(frame, 26);
  const resultEnter = useSpringEntrance(frame, 34);

  // Arm reach animation — extends then bounces back
  const armExtend = interpolate(frame, [16, 32], [0, 60], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const armBounce = interpolate(frame, [32, 42], [60, 20], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.bounce),
  });
  const armX = frame < 32 ? armExtend : armBounce;

  // Wall path draw
  const wallLen = 600;
  const wallDash = usePathDraw(frame, 18, wallLen, 20);

  // Rejection flash
  const flashOp = interpolate(frame, [32, 36], [0.4, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Cards
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 50);
  const card3 = useSpringEntrance(frame, 58);

  // ── Phase 3 ─────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const wallGlow = 0.15 + Math.sin(frame * 0.1) * 0.08;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · ISOLATION" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline1.translateY})`} opacity={headline1.opacity}>
          <text x={60} y={280}
            fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Cannot Reach In
          </text>
        </g>
        <g transform={`translate(0, ${headline2.translateY})`} opacity={headline2.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.accent}>
            And Pull Back
          </text>
        </g>

        {/* ── ZONE C — Robot reaching → wall → database ────────────────── */}

        {/* Robot (left side) */}
        <g opacity={robotEnter.opacity}
           transform={`translate(200, ${730 + robotEnter.translateY + breathe})`}>
          {/* Head */}
          <rect x={-65} y={-85} width={130} height={110} rx={14}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eyes */}
          <circle cx={-22} cy={-40} r={10} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={-22} cy={-40} r={4} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={22} cy={-40} r={10} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={22} cy={-40} r={4} fill={COLORS.accent} opacity={shimmer} />
          {/* Antenna */}
          <line x1={0} y1={-85} x2={0} y2={-110} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={0} cy={-116} r={6} fill={COLORS.accent} opacity={0.4 * shimmer} />
          {/* Body */}
          <rect x={-80} y={45} width={160} height={140} rx={12}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Extended arm reaching right */}
          <rect x={80} y={60} width={120 + armX} height={28} rx={10}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Hand */}
          <circle cx={210 + armX} cy={74} r={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Model label */}
          <text x={0} y={230} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            MODEL
          </text>
        </g>

        {/* Wall / barrier */}
        <g opacity={wallEnter.opacity}>
          <rect x={475} y={560} width={16} height={500} rx={4}
            fill={COLORS.vibrant_red} opacity={wallGlow} />
          <line x1={483} y1={560} x2={483} y2={1060}
            stroke={COLORS.vibrant_red} strokeWidth={6}
            strokeDasharray={wallLen} strokeDashoffset={wallDash}
            strokeLinecap="round"
          />
          {/* Wall label */}
          <text x={483} y={1100} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.7}>
            BOUNDARY
          </text>
        </g>

        {/* Rejection flash */}
        <circle cx={483} cy={780} r={80}
          fill={COLORS.vibrant_red} opacity={flashOp} />

        {/* Database (right side) */}
        <g opacity={dbEnter.opacity}
           transform={`translate(760, ${730 + dbEnter.translateY})`}>
          {/* Database cylinder — top ellipse */}
          <ellipse cx={0} cy={-80} rx={120} ry={30}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          {/* Body */}
          <rect x={-120} y={-80} width={240} height={200} rx={0}
            fill={COLORS.bg_secondary} stroke="none" />
          <line x1={-120} y1={-80} x2={-120} y2={120}
            stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          <line x1={120} y1={-80} x2={120} y2={120}
            stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          {/* Bottom ellipse */}
          <ellipse cx={0} cy={120} rx={120} ry={30}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          {/* Middle ring */}
          <ellipse cx={0} cy={20} rx={120} ry={25}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
          {/* Row indicators */}
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={-80} y={-40 + i * 35} width={160} height={20} rx={4}
              fill={COLORS.accent} opacity={0.08} />
          ))}
          {/* Label */}
          <text x={0} y={190} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            SYSTEM
          </text>
        </g>

        {/* Result data icon (blocked, faded) */}
        <g opacity={resultEnter.opacity * 0.3}
           transform={`translate(620, ${660 + resultEnter.translateY})`}>
          <rect x={-40} y={-20} width={80} height={40} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={0} y={8} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent} opacity={0.5}>
            DATA
          </text>
        </g>

        {/* ── Explanation cards ─────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={150} accent />
          <rect x={60} y={1160} width={6} height={150} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={1250}
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            No system access at all
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={150} />
          <text x={100} y={1430}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            No database pulls
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1340} w={460} h={150} />
          <text x={600} y={1430}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            No API responses
          </text>
        </g>

        {/* ── Floating particles ────────────────────────────────────────── */}
        {[
          { x: 80, y: 530 }, { x: 1000, y: 540 },
          { x: 100, y: 1600 }, { x: 960, y: 1640 },
          { x: 540, y: 1700 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 1.3) * 6}
            r={3} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
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
