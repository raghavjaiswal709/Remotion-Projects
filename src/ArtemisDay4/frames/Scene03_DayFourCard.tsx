/**
 * Scene03 — Day Four Card
 * "This is day four of resolving hidden secrets around the world."
 * CSV: 4.460s → 8.040s
 * Duration: 125 frames (4.17s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Scene reveal — day number springs in, label slides
 *   Phase 2 (20–90): Content build — globe, orbit ring, location markers
 *   Phase 3 (80–end): Micro-animations — globe rotate, markers pulse
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene03_DayFourCard: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const dayNumber = useSpringEntrance(frame, 4);
  const subtitle = useSpringEntrance(frame, 10);

  // ── Phase 2: Content build ──
  const globeEntrance = useSpringEntrance(frame, 16);
  const orbitRingCirc = 2 * Math.PI * 200;
  const orbitDash = usePathDraw(frame, 20, orbitRingCirc, 40);

  // Location markers stagger
  const markers = [
    { cx: -120, cy: -60, label: 'KSC' },
    { cx: 80, cy: -100, label: 'ESA' },
    { cx: 140, cy: 40, label: 'JAXA' },
    { cx: -60, cy: 80, label: 'CSA' },
  ];

  const markerEntrances = markers.map((_, i) => useSpringEntrance(frame, 30 + i * 10));

  // Day cards for series
  const dayCards = [
    { day: 1, topic: 'Moon Drift', done: true },
    { day: 2, topic: 'Why Artemis II', done: true },
    { day: 3, topic: 'Apollo 8 Mirror', done: true },
    { day: 4, topic: 'The Abort Button', done: false },
    { day: 5, topic: 'Splashdown', done: false },
  ];
  const cardEntrances = dayCards.map((_, i) => useSpringEntrance(frame, 50 + i * 8));

  // Continental outlines (simplified SVG paths)
  const continentDash = usePathDraw(frame, 25, 600, 35);

  // ── Phase 3: Micro-animations ──
  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.012;
  const orbitRotation = frame * 0.3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={360} fontWeight={900} fill={COLORS.sky_blue} opacity={0.04}>
          4
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="HIDDEN WORLD SECRETS · ARTEMIS II" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Large day number */}
        <g opacity={dayNumber.opacity} transform={`translate(0, ${dayNumber.translateY})`}>
          {/* Ghost number */}
          <text x={540} y={480} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={280} fontWeight={900} fill={COLORS.sky_blue}
            opacity={0.06}>
            4
          </text>
          {/* Solid number */}
          <text x={540} y={470} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={200} fontWeight={900} fill={COLORS.vibrant_red}>
            DAY 4
          </text>
        </g>

        <g opacity={subtitle.opacity} transform={`translate(0, ${subtitle.translateY})`}>
          <text x={540} y={540} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={500} fill={COLORS.cool_silver}>
            Hidden Secrets Around the World
          </text>
        </g>

        {/* Zone C — Globe illustration */}
        <g opacity={globeEntrance.opacity}
          transform={`translate(540, ${760 + globeEntrance.translateY + breathe})`}>
          {/* Globe circle */}
          <circle cx={0} cy={0} r={160} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={2.5} />
          <circle cx={0} cy={0} r={160} fill={COLORS.sky_blue} fillOpacity={0.04} />

          {/* Globe grid lines — latitude */}
          <ellipse cx={0} cy={-60} rx={140} ry={30} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.2} />
          <ellipse cx={0} cy={0} rx={160} ry={40} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.3} />
          <ellipse cx={0} cy={60} rx={140} ry={30} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.2} />

          {/* Globe grid — longitude */}
          <ellipse cx={0} cy={0} rx={60} ry={160} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.2} />
          <line x1={0} y1={-160} x2={0} y2={160}
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.2} />

          {/* Simplified continent outlines */}
          <path d="M -80,-60 Q -60,-80 -30,-70 Q 0,-60 20,-40 Q 40,-20 30,10 Q 20,40 -10,50 Q -40,60 -60,40 Q -80,20 -80,-20 Z"
            fill="none" stroke={COLORS.green} strokeWidth={2} opacity={0.4}
            strokeDasharray={600} strokeDashoffset={continentDash} />

          {/* Orbit ring */}
          <g transform={`rotate(${orbitRotation})`}>
            <circle cx={0} cy={0} r={200} fill="none"
              stroke={COLORS.vibrant_red} strokeWidth={2}
              strokeDasharray={orbitRingCirc} strokeDashoffset={orbitDash}
              opacity={0.5} />
          </g>

          {/* Location markers */}
          {markers.map((m, i) => (
            <g key={i} opacity={markerEntrances[i].opacity}
              transform={`translate(${m.cx}, ${m.cy + markerEntrances[i].translateY * 0.5})`}>
              <circle cx={0} cy={0} r={8}
                fill={COLORS.vibrant_red} fillOpacity={0.8 * shimmer} />
              <circle cx={0} cy={0} r={14} fill="none"
                stroke={COLORS.vibrant_red} strokeWidth={1.5}
                opacity={0.4} transform={`scale(${pulse})`}
                style={{ transformOrigin: '0px 0px' }} />
              <text x={0} y={-20} textAnchor="middle"
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={18} fontWeight={700} fill={COLORS.deep_black}
                opacity={0.6}>
                {m.label}
              </text>
            </g>
          ))}
        </g>

        {/* Series progress cards */}
        {dayCards.map((card, i) => (
          <g key={i} opacity={cardEntrances[i].opacity}
            transform={`translate(${60 + i * 196}, ${1060 + cardEntrances[i].translateY})`}>
            <rect x={0} y={0} width={180} height={100} rx={12}
              fill={card.day === 4 ? COLORS.vibrant_red : (card.done ? COLORS.green : COLORS.deep_black)}
              fillOpacity={card.day === 4 ? 0.1 : (card.done ? 0.06 : 0.03)}
              stroke={card.day === 4 ? COLORS.vibrant_red : (card.done ? COLORS.green : COLORS.cool_silver)}
              strokeWidth={card.day === 4 ? 2 : 1}
              strokeOpacity={card.day === 4 ? 1 : 0.3} />
            <text x={90} y={45} textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={28} fontWeight={800}
              fill={card.day === 4 ? COLORS.vibrant_red : (card.done ? COLORS.green : COLORS.cool_silver)}>
              {card.day}
            </text>
            <text x={90} y={75} textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={16} fontWeight={500}
              fill={card.day === 4 ? COLORS.deep_black : COLORS.cool_silver}
              opacity={0.7}>
              {card.topic}
            </text>
            {/* Checkmark for completed days */}
            {card.done && (
              <path d={`M ${90 - 8},${88} L ${90 - 2},${95} L ${90 + 10},${82}`}
                fill="none" stroke={COLORS.green} strokeWidth={2} strokeLinecap="round" />
            )}
          </g>
        ))}

        {/* Connecting dots between cards */}
        {[0, 1, 2, 3].map(i => {
          const dotEntrance = useSpringEntrance(frame, 60 + i * 8);
          return (
            <circle key={i}
              cx={60 + i * 196 + 190}
              cy={1110}
              r={3}
              fill={COLORS.cool_silver}
              opacity={dotEntrance.opacity * 0.4}
            />
          );
        })}

        {/* Bottom decoration — wave pattern */}
        <g opacity={interpolate(frame, [60, 80], [0, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <path d={`M 60,1250 ${Array.from({ length: 20 }, (_, i) =>
            `Q ${60 + i * 48 + 24},${1250 + (i % 2 === 0 ? -12 : 12)} ${60 + (i + 1) * 48},1250`
          ).join(' ')}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} strokeLinecap="round" />
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">DAY 4 · THE ABORT BUTTON</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
