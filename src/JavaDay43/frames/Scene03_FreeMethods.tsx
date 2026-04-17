/**
 * Scene 03 — Free Methods
 * "giving every object toString, equals, and hashCode for free."
 * CSV: 12.420s → 17.240s
 * Duration: ~166 frames
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring in
 *   Phase 2 (frames 20–90):  Three method cards stagger in with path-draw borders
 *   Phase 3 (frames 70–end): Gift box illustration pulse, floating particles
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene03_FreeMethods: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2 — three method cards ───────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 24);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);
  const giftCard = useSpringEntrance(frame, 60);
  const summaryCard = useSpringEntrance(frame, 72);

  const perim1 = 2 * (960 + 200);
  const border1 = interpolate(frame, [24, 54], [perim1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const perim2 = 2 * (960 + 200);
  const border2 = interpolate(frame, [36, 66], [perim2, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const perim3 = 2 * (960 + 200);
  const border3 = interpolate(frame, [48, 78], [perim3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Arrow connectors ───────────────────────────────────────────────────────
  const arrowLen = 80;
  const arrow1Dash = usePathDraw(frame, 30, arrowLen, 20);
  const arrow2Dash = usePathDraw(frame, 42, arrowLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Gift bow animation
  const bowScale = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const ribbonLen = 300;
  const ribbonDash = usePathDraw(frame, 55, ribbonLen, 30);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OBJECT CLASS · INHERITED" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            For Free
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Three inherited methods
          </text>
        </g>

        {/* ── ZONE C — Three method cards ───────────────────────────────── */}

        {/* Method 1: toString() */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={440} w={960} h={180} accent />
          <rect x={60} y={440} width={960} height={180} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={perim1} strokeDashoffset={border1} />
          <rect x={60} y={440} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={510} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            01
          </text>
          <text x={160} y={510}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={40} fontWeight={500} fill={COLORS.white}>
            toString()
          </text>
          <text x={160} y={565} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Returns string representation of the object
          </text>
        </g>

        {/* Arrow 1→2 */}
        <line x1={540} y1={620} x2={540} y2={680}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow1Dash}
          markerEnd="url(#arrow)" />

        {/* Method 2: equals() */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={680} w={960} h={180} />
          <rect x={60} y={680} width={960} height={180} rx={20}
            fill="none" stroke={COLORS.accent_mid} strokeWidth={2}
            strokeDasharray={perim2} strokeDashoffset={border2} />
          <rect x={60} y={680} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={750} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            02
          </text>
          <text x={160} y={750}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={40} fontWeight={500} fill={COLORS.white}>
            equals()
          </text>
          <text x={160} y={805} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Compares two objects for equality
          </text>
        </g>

        {/* Arrow 2→3 */}
        <line x1={540} y1={860} x2={540} y2={920}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow2Dash}
          markerEnd="url(#arrow)" />

        {/* Method 3: hashCode() */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={920} w={960} h={180} />
          <rect x={60} y={920} width={960} height={180} rx={20}
            fill="none" stroke={COLORS.accent_mid} strokeWidth={2}
            strokeDasharray={perim3} strokeDashoffset={border3} />
          <rect x={60} y={920} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={990} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            03
          </text>
          <text x={160} y={990}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={40} fontWeight={500} fill={COLORS.white}>
            hashCode()
          </text>
          <text x={160} y={1045} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Returns integer hash for data structures
          </text>
        </g>

        {/* Gift box illustration */}
        <g opacity={giftCard.opacity} transform={`translate(0, ${giftCard.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={380} accent />
          {/* Gift box body */}
          <rect x={160} y={1280} width={260} height={200} rx={12}
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={3} />
          {/* Gift box lid */}
          <rect x={140} y={1250} width={300} height={40} rx={8}
            fill={COLORS.accent} opacity={0.3} stroke={COLORS.accent} strokeWidth={2} />
          {/* Vertical ribbon */}
          <path d={`M 290,1250 L 290,1480`}
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={ribbonLen} strokeDashoffset={ribbonDash} />
          {/* Horizontal ribbon */}
          <path d={`M 160,1380 L 420,1380`}
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={ribbonLen} strokeDashoffset={ribbonDash} />
          {/* Bow */}
          <g transform={`translate(290, 1248) scale(${bowScale})`} style={{ transformOrigin: '0px 0px' }}>
            <ellipse cx={-30} cy={-20} rx={28} ry={18} fill={COLORS.accent} opacity={0.6}
              transform="rotate(-30)" />
            <ellipse cx={30} cy={-20} rx={28} ry={18} fill={COLORS.accent} opacity={0.6}
              transform="rotate(30)" />
            <circle cx={0} cy={-8} r={10} fill={COLORS.accent} />
          </g>
          {/* Label */}
          <text x={290} y={1520} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            FREE
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1160} w={460} h={380} />
          <text x={600} y={1240} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Every Class
          </text>
          <text x={600} y={1290} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Gets These
          </text>
          <text x={600} y={1360} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            No need to write them.
          </text>
          <text x={600} y={1410} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Object provides defaults
          </text>
          <text x={600} y={1460} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            that you can override.
          </text>
        </g>

        {/* Floating particles */}
        {[
          { x: 900, y: 1600, r: 28, delay: 0 },
          { x: 140, y: 1640, r: 20, delay: 0.3 },
          { x: 820, y: 1680, r: 16, delay: 0.6 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y + breathe * (1 + p.delay)})`}>
            <circle cx={0} cy={0} r={p.r} fill={COLORS.accent}
              fillOpacity={0.06 * shimmer} />
            <circle cx={0} cy={0} r={p.r} fill="none"
              stroke={COLORS.accent_mid} strokeWidth={1.5}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          </g>
        ))}

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
