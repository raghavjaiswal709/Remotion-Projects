/**
 * Scene 08 — Search Observation
 * "Search results arrive. That is the observation."
 * CSV: 26.120s → 28.470s
 * Duration: 71 frames (2.4s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline spring
 *   Phase 2 (frames 15–55): Search magnifier + result cards staggered
 *   Phase 3 (frames 50–end): Highlight pulse on results, shimmer
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene08_SearchObservation: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 5);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const searchCard = useSpringEntrance(frame, 12);

  // Magnifying glass path draw
  const magCirc = 2 * Math.PI * 70;
  const magDash = usePathDraw(frame, 16, magCirc, 20);
  const handleDash = usePathDraw(frame, 20, 60, 15);

  // Result cards staggered
  const results = [
    { text: 'Result 1 — API documentation', y: 900 },
    { text: 'Result 2 — Tutorial reference', y: 980 },
    { text: 'Result 3 — Code example', y: 1060 },
  ];
  const resultEnts = results.map((_, i) => useSpringEntrance(frame, 30 + i * 8));

  // Observation label entrance
  const obsLabel = useSpringEntrance(frame, 44);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);
  const highlightBlink = frame > 50 ? interpolate(Math.sin((frame - 50) * 0.15), [-1, 1], [0.3, 0.7]) : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="STEP EXAMPLE · OBSERVATION" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Search Results
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Arrive
          </text>
        </g>

        {/* ── ZONE C — Search illustration ────────────────────────────── */}
        <g opacity={searchCard.opacity} transform={`translate(0, ${searchCard.translateY})`}>
          <BentoCard x={60} y={450} w={960} h={320} accent />

          {/* Magnifying glass */}
          <g transform="translate(260, 610)">
            {/* Glass circle */}
            <circle cx={0} cy={0} r={70} fill="none" stroke={COLORS.accent} strokeWidth={4}
              strokeDasharray={magCirc} strokeDashoffset={magDash} strokeLinecap="round"
            />
            <circle cx={0} cy={0} r={70} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
            {/* Handle */}
            <line x1={48} y1={48} x2={95} y2={95}
              stroke={COLORS.accent} strokeWidth={6}
              strokeDasharray={60} strokeDashoffset={handleDash}
              strokeLinecap="round"
            />
            {/* Inner highlight lines */}
            <line x1={-30} y1={-20} x2={30} y2={-20} stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
            <line x1={-25} y1={-5} x2={25} y2={-5} stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
            <line x1={-20} y1={10} x2={20} y2={10} stroke={COLORS.accent} strokeWidth={2} opacity={0.2} />
          </g>

          {/* Search query text */}
          <text x={420} y={580} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            SEARCH QUERY
          </text>
          <rect x={420} y={600} width={540} height={50} rx={12} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={440} y={633} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white} opacity={0.7}>
            "agent loop pattern..."
          </text>

          {/* Data flowing down indicator */}
          <line x1={540} y1={670} x2={540} y2={720}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.5}
            markerEnd="url(#arrow)" strokeLinecap="round"
          />
        </g>

        {/* Result cards */}
        {results.map((r, i) => (
          <g key={i} opacity={resultEnts[i].opacity} transform={`translate(0, ${resultEnts[i].translateY})`}>
            <BentoCard x={120} y={r.y} w={840} h={60} />
            {/* Highlight bar on first result */}
            {i === 0 && (
              <rect x={120} y={r.y} width={4} height={60} rx={2} fill={COLORS.accent} opacity={highlightBlink > 0 ? highlightBlink : 0.5} />
            )}
            {/* Result dot */}
            <circle cx={155} cy={r.y + 30} r={6} fill={i === 0 ? COLORS.accent : COLORS.text_muted} opacity={0.7} />
            <text x={180} y={r.y + 38} fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={i === 0 ? COLORS.white : COLORS.text_muted}>
              {r.text}
            </text>
          </g>
        ))}

        {/* OBSERVATION badge */}
        <g opacity={obsLabel.opacity} transform={`translate(0, ${obsLabel.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={140} accent />
          <rect x={60} y={1180} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1236} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} letterSpacing="0.12em">
            OBSERVATION
          </text>
          <text x={100} y={1290} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Data arrives — the step's input half
          </text>
        </g>

        {/* Floating dots */}
        <circle cx={180} cy={1450 + breathe} r={4} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={860} cy={1500 + breathe * 1.2} r={3} fill={COLORS.accent} opacity={0.15} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
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
