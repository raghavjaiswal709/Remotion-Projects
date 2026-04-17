/**
 * Scene 07 — Just ID And Route
 * "Sometimes the passenger provides just an ID and a route."
 * CSV: 27.020s → 30.920s
 * Duration: ~117 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–80): Passenger silhouette + minimal form with 2 fields
 *   Phase 3 (70–end): Pulse, breathe
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

export const Scene07_JustIdRoute: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  const passengerCard = useSpringEntrance(frame, 20);
  const field1Ent     = useSpringEntrance(frame, 32);
  const field2Ent     = useSpringEntrance(frame, 42);
  const arrowEnt      = useSpringEntrance(frame, 50);
  const formCard      = useSpringEntrance(frame, 28);
  const mapCard       = useSpringEntrance(frame, 58);

  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 50, arrowLen, 25);
  const routeLen = 400;
  const routeDash = usePathDraw(frame, 58, routeLen, 30);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="SCENARIO 1 · MINIMAL" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Just Two
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            ID and Route
          </text>
        </g>

        {/* Passenger silhouette card */}
        <g opacity={passengerCard.opacity} transform={`translate(0, ${passengerCard.translateY})`}>
          <BentoCard x={60} y={440} w={460} h={460} accent />
          {/* Head */}
          <circle cx={290} cy={580} r={60} fill={COLORS.accent_dim}
            stroke={COLORS.accent} strokeWidth={3} />
          {/* Body */}
          <path d="M 230,640 Q 230,700 250,740 L 330,740 Q 350,700 350,640"
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={3} />
          {/* Shoulders */}
          <path d="M 200,740 L 380,740 L 380,780 Q 290,800 200,780 Z"
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={2} />
          <text x={290} y={840} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Passenger
          </text>
          {/* ID badge */}
          <rect x={240} y={860} width={100} height={40} rx={8}
            fill={COLORS.accent} opacity={0.2} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={290} y={888} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500} fill={COLORS.accent}>
            ID: 4821
          </text>
        </g>

        {/* Arrow from passenger to form */}
        <line x1={520} y1={670} x2={560} y2={670}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={arrowEnt.opacity} />

        {/* Booking form card — minimal */}
        <g opacity={formCard.opacity} transform={`translate(0, ${formCard.translateY})`}>
          <BentoCard x={560} y={440} w={460} h={460} />
          <text x={600} y={500} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Booking Form
          </text>
          {/* Field 1: passengerId */}
          <g opacity={field1Ent.opacity} transform={`translate(0, ${field1Ent.translateY})`}>
            <rect x={600} y={530} width={380} height={70} rx={12}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
            <text x={620} y={575}
              fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.accent}>
              passengerId
            </text>
          </g>
          {/* Field 2: routeId */}
          <g opacity={field2Ent.opacity} transform={`translate(0, ${field2Ent.translateY})`}>
            <rect x={600} y={620} width={380} height={70} rx={12}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
            <text x={620} y={665}
              fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.accent}>
              routeId
            </text>
          </g>
          {/* Empty fields grayed out */}
          <rect x={600} y={710} width={380} height={70} rx={12}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.08)" strokeWidth={1}
            strokeDasharray="8 4" opacity={0.4} />
          <text x={790} y={755} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} opacity={0.3}>
            — empty —
          </text>
          <rect x={600} y={800} width={380} height={70} rx={12}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.08)" strokeWidth={1}
            strokeDasharray="8 4" opacity={0.4} />
          <text x={790} y={845} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} opacity={0.3}>
            — empty —
          </text>
        </g>

        {/* Route map illustration */}
        <g opacity={mapCard.opacity} transform={`translate(0, ${mapCard.translateY})`}>
          <BentoCard x={60} y={940} w={960} h={420} />
          <text x={100} y={1000} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Route Map
          </text>
          {/* Track */}
          <path d="M 140,1100 C 300,1060 500,1160 700,1080 L 940,1100"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={routeLen} strokeDashoffset={routeDash}
            strokeLinecap="round" />
          {/* Stations */}
          {[
            { x: 140, y: 1100, label: 'A' },
            { x: 400, y: 1120, label: 'B' },
            { x: 700, y: 1080, label: 'C' },
            { x: 940, y: 1100, label: 'D' },
          ].map((s, i) => (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={16} fill={COLORS.bg_primary}
                stroke={COLORS.accent} strokeWidth={3} />
              <text x={s.x} y={s.y + 6} textAnchor="middle"
                fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
                {s.label}
              </text>
              <text x={s.x} y={s.y + 46} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                Station {s.label}
              </text>
            </g>
          ))}
          {/* Cross ties */}
          {Array.from({ length: 18 }, (_, i) => {
            const t = i / 17;
            const tx = 140 + t * 800;
            return (
              <rect key={i} x={tx - 3} y={1110} width={6} height={20} rx={1}
                fill={COLORS.text_muted} opacity={0.2} />
            );
          })}
        </g>

        {/* Floating circles */}
        {[{ x: 200, y: 1500 }, { x: 880, y: 1540 }, { x: 540, y: 1600 }].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y + breathe * (1 + i * 0.2)}
            r={14 + i * 4} fill={COLORS.accent} fillOpacity={0.05 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
