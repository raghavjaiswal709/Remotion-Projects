/**
 * Scene 06 — Not On Or Off
 * "Autonomy is not on or off. It is a spectrum."
 * CSV: 16.140s → 19.940s | Duration: 118 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): Spectrum gradient bar, binary vs spectrum comparison
 *   Phase 3 (70–end): Pulse, shimmer
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

export const Scene06_NotOnOrOff: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const binaryCard = useSpringEntrance(frame, 20);
  const spectrumCard = useSpringEntrance(frame, 32);
  const crossCard = useSpringEntrance(frame, 44);
  const bottomCard = useSpringEntrance(frame, 56);
  const detailRow = useSpringEntrance(frame, 66);

  // Spectrum bar fill
  const specBarWidth = interpolate(frame, [35, 70], [0, 800], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Cross strike-through line
  const crossLen = 200;
  const crossDash = usePathDraw(frame, 25, crossLen, 20);

  // Slider position
  const sliderX = interpolate(frame, [50, 90], [0, 700], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · DEFINITION" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={82} fontWeight={800} fill={COLORS.white}>
            Not On or Off
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={72} fontWeight={800}
            fontStyle="italic" fill={COLORS.accent}>
            It Is a Spectrum
          </text>
        </g>

        {/* ── ZONE C ──────────────────────────────────────────────────────── */}

        {/* Binary toggle (crossed out) */}
        <g opacity={binaryCard.opacity} transform={`translate(0, ${binaryCard.translateY})`}>
          <BentoCard x={60} y={500} w={460} h={280} />

          {/* Toggle switch — OFF position */}
          <rect x={160} y={580} width={160} height={70} rx={35}
            fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          <circle cx={200} cy={615} r={28} fill="rgba(255,255,255,0.3)" />
          <text x={240} y={700} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            BINARY
          </text>

          {/* X strike */}
          <line x1={120} y1={560} x2={400} y2={740}
            stroke={COLORS.vibrant_red} strokeWidth={5}
            strokeDasharray={crossLen} strokeDashoffset={crossDash}
            strokeLinecap="round" opacity={0.8} />
          <line x1={400} y1={560} x2={120} y2={740}
            stroke={COLORS.vibrant_red} strokeWidth={5}
            strokeDasharray={crossLen} strokeDashoffset={crossDash}
            strokeLinecap="round" opacity={0.8} />
        </g>

        {/* Spectrum visualization */}
        <g opacity={spectrumCard.opacity} transform={`translate(0, ${spectrumCard.translateY})`}>
          <BentoCard x={560} y={500} w={460} h={280} accent />

          {/* Spectrum bar background */}
          <rect x={600} y={590} width={380} height={40} rx={20}
            fill="rgba(255,255,255,0.06)" />
          {/* Fill */}
          <rect x={600} y={590}
            width={Math.min(specBarWidth * 380 / 800, 380)} height={40} rx={20}
            fill={COLORS.accent} opacity={0.5} />
          {/* Labels */}
          <text x={600} y={665} fontFamily={FONT}
            fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            0%
          </text>
          <text x={980} y={665} textAnchor="end" fontFamily={FONT}
            fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            100%
          </text>
          <text x={790} y={720} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.accent}>
            SPECTRUM
          </text>
        </g>

        {/* Full width slider card */}
        <g opacity={crossCard.opacity} transform={`translate(0, ${crossCard.translateY})`}>
          <BentoCard x={60} y={820} w={960} h={300} accent />

          {/* Slider track */}
          <rect x={140} y={920} width={800} height={8} rx={4}
            fill="rgba(255,255,255,0.1)" />
          {/* Active portion */}
          <rect x={140} y={920} width={sliderX} height={8} rx={4}
            fill={COLORS.accent} />

          {/* Slider handle */}
          <g transform={`translate(${140 + sliderX}, 924)`}>
            <circle cx={0} cy={0} r={20} fill={COLORS.accent}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            <circle cx={0} cy={0} r={8} fill={COLORS.bg_primary} />
          </g>

          {/* Scale labels */}
          <text x={140} y={980} fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            ZERO
          </text>
          <text x={540} y={980} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.white}>
            MODERATE
          </text>
          <text x={940} y={980} textAnchor="end" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.accent}>
            FULL
          </text>

          {/* Tick marks */}
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={140 + i * 80} y1={940} x2={140 + i * 80} y2={955}
              stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          ))}

          {/* Label above slider */}
          <text x={540} y={880} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.white}>
            Agent Autonomy Level
          </text>
        </g>

        {/* Bottom cards */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={200} />
          <text x={100} y={1245} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Every task
          </text>
          <text x={100} y={1300} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            gets its own level
          </text>
        </g>

        <g opacity={detailRow.opacity} transform={`translate(0, ${detailRow.translateY})`}>
          <BentoCard x={560} y={1160} w={460} h={200} accent />
          <text x={600} y={1245} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Context-dependent
          </text>
          <text x={600} y={1300} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Not one-size-fits-all
          </text>
        </g>

        {/* Floating particles */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <circle key={i}
            cx={80 + i * 190}
            cy={1440 + Math.sin(frame * 0.05 + i * 1.1) * 10}
            r={3} fill={COLORS.accent}
            opacity={interpolate(frame, [70 + i * 4, 85 + i * 4], [0, 0.2], { extrapolateRight: 'clamp' }) * shimmer} />
        ))}

        {/* Decorative dashes */}
        <g opacity={interpolate(frame, [80, 100], [0, 0.2], { extrapolateRight: 'clamp' })}>
          {[0, 1, 2].map(i => (
            <line key={i} x1={360 + i * 120} y1={1500}
              x2={400 + i * 120} y2={1500}
              stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          ))}
        </g>

        {/* Bottom emphasis text */}
        <g opacity={interpolate(frame, [85, 105], [0, 0.4], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1580} textAnchor="middle" fontFamily={FONT}
            fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Calibrated per action, per context
          </text>
        </g>

        {/* Floating ring */}
        <g transform={`translate(540, ${1680 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.25} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
