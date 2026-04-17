/**
 * Scene 02 — Object Class Recap
 * "Last day, we learned how the object class silently sits at the top of every class hierarchy,"
 * CSV: 6.200s → 11.480s
 * Duration: ~187 frames
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring entrance
 *   Phase 2 (frames 20–80):  Class hierarchy tree diagram with path-draw
 *   Phase 3 (frames 60–end): Pulse on Object node, breathing connectors
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

export const Scene02_ObjectClassRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const objectNode = useSpringEntrance(frame, 20);
  const childNode1 = useSpringEntrance(frame, 32);
  const childNode2 = useSpringEntrance(frame, 44);
  const childNode3 = useSpringEntrance(frame, 56);
  const connector1Len = 200;
  const connector1Dash = usePathDraw(frame, 28, connector1Len, 25);
  const connector2Len = 250;
  const connector2Dash = usePathDraw(frame, 40, connector2Len, 25);
  const connector3Len = 200;
  const connector3Dash = usePathDraw(frame, 52, connector3Len, 25);

  const card1 = useSpringEntrance(frame, 68);
  const card2 = useSpringEntrance(frame, 80);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glowRadius = interpolate(Math.sin(frame * 0.07), [-1, 1], [60, 72]);

  // ── Border draw ────────────────────────────────────────────────────────────
  const objectPerimeter = 2 * (340 + 120);
  const objectBorderDash = interpolate(frame, [20, 50], [objectPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="YESTERDAY'S RECAP" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Object Class
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Top of every hierarchy
          </text>
        </g>

        {/* ── ZONE C — Class hierarchy tree ─────────────────────────────── */}

        {/* Object node — root of tree */}
        <g opacity={objectNode.opacity} transform={`translate(0, ${objectNode.translateY})`}>
          <rect x={370} y={480} width={340} height={120} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={objectPerimeter}
            strokeDashoffset={objectBorderDash}
          />
          {/* Glow behind object node */}
          <circle cx={540} cy={540} r={glowRadius} fill={COLORS.accent} opacity={0.04 * pulse} />
          <text x={540} y={530} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Object
          </text>
          <text x={540} y={575} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            java.lang
          </text>
        </g>

        {/* Connectors from Object to children */}
        <path d="M 440,600 L 240,740"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connector1Len} strokeDashoffset={connector1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />
        <path d="M 540,600 L 540,740"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connector2Len} strokeDashoffset={connector2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />
        <path d="M 640,600 L 840,740"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connector3Len} strokeDashoffset={connector3Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Child class 1 — Train */}
        <g opacity={childNode1.opacity} transform={`translate(0, ${childNode1.translateY})`}>
          <BentoCard x={100} y={740} w={280} h={160} />
          <text x={240} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Train
          </text>
          <text x={240} y={856} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            extends Object
          </text>
        </g>

        {/* Child class 2 — Route */}
        <g opacity={childNode2.opacity} transform={`translate(0, ${childNode2.translateY})`}>
          <BentoCard x={400} y={740} w={280} h={160} accent />
          <text x={540} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            Route
          </text>
          <text x={540} y={856} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            extends Object
          </text>
        </g>

        {/* Child class 3 — Ticket */}
        <g opacity={childNode3.opacity} transform={`translate(0, ${childNode3.translateY})`}>
          <BentoCard x={700} y={740} w={280} h={160} />
          <text x={840} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Ticket
          </text>
          <text x={840} y={856} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            extends Object
          </text>
        </g>

        {/* "Silently" label with emphasis */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={960} w={960} h={160} accent />
          <rect x={60} y={960} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1020} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Every class <tspan fontStyle="italic" fill={COLORS.accent}>silently</tspan> extends Object
          </text>
          <text x={100} y={1072} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Even without writing "extends Object" explicitly
          </text>
        </g>

        {/* Recap methods card */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={320} />
          <text x={100} y={1230} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Inherited Methods
          </text>
          {['toString()', 'equals()', 'hashCode()'].map((method, i) => {
            const mOp = interpolate(frame, [80 + i * 10, 92 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <g key={i} opacity={mOp}>
                <circle cx={120} cy={1290 + i * 56} r={8} fill={COLORS.accent} />
                <text x={148} y={1298 + i * 56}
                  fontFamily="'Fira Code', 'Courier New', monospace"
                  fontSize={34} fontWeight={500} fill={COLORS.white}>
                  {method}
                </text>
              </g>
            );
          })}
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1160} w={460} h={320} accent />
          <text x={600} y={1230} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Key Insight
          </text>
          <text x={600} y={1290} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Object sits at the
          </text>
          <text x={600} y={1338} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            very top, providing
          </text>
          <text x={600} y={1386} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            defaults that every
          </text>
          <text x={600} y={1434} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            class inherits for free.
          </text>
        </g>

        {/* Floating accents */}
        <g transform={`translate(100, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={32} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={32} fill="none" stroke={COLORS.accent_mid} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(980, ${1620 + breathe * 0.8})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.05} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
