/**
 * Scene 02 — Instance Recap
 * "Last day, instance variables describe one object,"
 * CSV: 6.840s → 11.500s
 * Duration: 145 frames (4.83s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring in
 *   Phase 2 (frames 20–80):  Single train object card with fields, SVG train
 *   Phase 3 (frames 70–end): Pulse on instance indicator, breathing circles
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
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

export const Scene02_InstanceRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Reveal ───────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2: Content ──────────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 46);
  const trainSvg = useSpringEntrance(frame, 28);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 40, arrowLen, 20);

  // ── Border draw on main card ───────────────────────────────────────────────
  const cardPerimeter = 2 * (960 + 500);
  const borderDash = interpolate(frame, [22, 52], [cardPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 3;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · INSTANCE VARIABLES" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Instance
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Variables
          </text>
          <text x={60} y={450} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Describe one object
          </text>
        </g>

        {/* ── ZONE C — Main illustration card ─────────────────────────────── */}
        {/* Animated border */}
        <rect x={60} y={520} width={960} height={500} rx={20}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={cardPerimeter} strokeDashoffset={borderDash} />
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={500} />

          {/* Train illustration inside card */}
          <g opacity={trainSvg.opacity} transform={`translate(${trainSvg.translateY}, 0)`}>
            {/* Simple train body */}
            <rect x={120} y={580} width={360} height={140} rx={12}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Cab */}
            <rect x={380} y={550} width={100} height={170} rx={10}
              fill={COLORS.accent} fillOpacity={0.08}
              stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Window */}
            <rect x={395} y={565} width={70} height={50} rx={6}
              fill={COLORS.accent} fillOpacity={0.2} />
            {/* Wheels */}
            <circle cx={200} cy={730} r={24} fill={COLORS.bg_primary}
              stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={340} cy={730} r={24} fill={COLORS.bg_primary}
              stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={430} cy={730} r={24} fill={COLORS.bg_primary}
              stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Label */}
            <text x={260} y={665} textAnchor="middle"
              fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic">
              Train #7
            </text>
          </g>

          {/* Arrow pointing to fields */}
          <path d="M 520,660 L 580,660" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />

          {/* Instance fields list */}
          <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
            <text x={620} y={610} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
              Instance Fields:
            </text>
            {['name = "Express 7"', 'speed = 180', 'carriages = 12', 'isRunning = true'].map((field, i) => (
              <text key={i} x={620} y={660 + i * 44}
                fontFamily="'Fira Code', 'Courier New', monospace"
                fontSize={28} fontWeight={500}
                fill={i === 0 ? COLORS.accent : COLORS.white}
                opacity={interpolate(frame, [34 + i * 6, 44 + i * 6], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                })}>
                {field}
              </text>
            ))}
          </g>

          {/* "ONE object" emphasis */}
          <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
            <rect x={620} y={850} width={340} height={56} rx={12}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={790} y={888} textAnchor="middle"
              fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic">
              ONE object
            </text>
          </g>
        </g>

        {/* ── Key concept cards below ─────────────────────────────────────── */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1060} w={460} h={200} />
          <text x={100} y={1130} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Each Train
          </text>
          <text x={100} y={1175} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            has its own name,
          </text>
          <text x={100} y={1215} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            speed, carriages
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1060} w={460} h={200} accent />
          <text x={600} y={1130} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Per Instance
          </text>
          <text x={600} y={1175} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Not shared across
          </text>
          <text x={600} y={1215} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            all trains
          </text>
        </g>

        {/* ── Decorative pulse ring ──────────────────────────────────────── */}
        <g transform={`translate(540, ${1420 + breathe})`} opacity={0.25}>
          <circle cx={0} cy={0} r={50} fill="none"
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={80} fill="none"
            stroke={COLORS.accent} strokeWidth={1} opacity={0.3 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* Summary bento */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={120} />
          <rect x={60} y={1300} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1370} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Instance variables belong to
          </text>
          <text x={690} y={1370} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            one object
          </text>
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s02.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
