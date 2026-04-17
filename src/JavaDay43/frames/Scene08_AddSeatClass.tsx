/**
 * Scene 08 — Add Seat Class
 * "Sometimes they add a seat class."
 * CSV: 31.440s → 33.180s
 * Duration: ~70 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–80): Form with 3 fields, seat class highlighted
 *   Phase 3 (70–end): Micro-animations
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

export const Scene08_AddSeatClass: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const formEnt = useSpringEntrance(frame, 18);
  const f1 = useSpringEntrance(frame, 26);
  const f2 = useSpringEntrance(frame, 34);
  const f3 = useSpringEntrance(frame, 42);
  const seatCard = useSpringEntrance(frame, 50);
  const badge = useSpringEntrance(frame, 58);

  const borderLen = 2 * (380 + 70);
  const borderDash = usePathDraw(frame, 42, borderLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  const seatClasses = [
    { label: 'Economy', color: COLORS.text_muted },
    { label: 'Business', color: COLORS.accent },
    { label: 'First Class', color: COLORS.white },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SCENARIO 2 · EXTENDED" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Add a
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Seat Class
          </text>
        </g>

        {/* Form card */}
        <g opacity={formEnt.opacity} transform={`translate(0, ${formEnt.translateY})`}>
          <BentoCard x={60} y={440} w={960} h={420} accent />
          <text x={100} y={500} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Booking Form — 3 Fields
          </text>

          {/* passengerId */}
          <g opacity={f1.opacity} transform={`translate(0, ${f1.translateY})`}>
            <rect x={100} y={530} width={860} height={65} rx={12}
              fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
            <text x={130} y={572}
              fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
              passengerId
            </text>
            <text x={920} y={572} textAnchor="end"
              fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500} fill={COLORS.text_muted} opacity={0.4}>
              int
            </text>
          </g>

          {/* routeId */}
          <g opacity={f2.opacity} transform={`translate(0, ${f2.translateY})`}>
            <rect x={100} y={610} width={860} height={65} rx={12}
              fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
            <text x={130} y={652}
              fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
              routeId
            </text>
            <text x={920} y={652} textAnchor="end"
              fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500} fill={COLORS.text_muted} opacity={0.4}>
              int
            </text>
          </g>

          {/* seatClass — highlighted */}
          <g opacity={f3.opacity} transform={`translate(0, ${f3.translateY})`}>
            <rect x={100} y={690} width={860} height={65} rx={12}
              fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={borderLen} strokeDashoffset={borderDash} />
            <text x={130} y={732}
              fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700} fill={COLORS.accent}>
              seatClass
            </text>
            <text x={920} y={732} textAnchor="end"
              fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500} fill={COLORS.accent} opacity={0.6}>
              String
            </text>
            {/* NEW badge */}
            <rect x={800} y={695} width={70} height={28} rx={8} fill={COLORS.accent} opacity={0.9} />
            <text x={835} y={715} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.bg_primary}>
              NEW
            </text>
          </g>
        </g>

        {/* Seat class options */}
        <g opacity={seatCard.opacity} transform={`translate(0, ${seatCard.translateY})`}>
          <BentoCard x={60} y={900} w={960} h={360} />
          <text x={100} y={960} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Available Classes
          </text>
          {/* Seat illustration */}
          {seatClasses.map((sc, i) => {
            const cx = 230 + i * 280;
            const cy = 1100;
            return (
              <g key={i}>
                {/* Seat back */}
                <rect x={cx - 60} y={cy - 80} width={120} height={100} rx={16}
                  fill={COLORS.bg_primary} stroke={sc.color} strokeWidth={2} />
                {/* Seat base */}
                <rect x={cx - 70} y={cy + 20} width={140} height={30} rx={8}
                  fill={COLORS.bg_primary} stroke={sc.color} strokeWidth={2} />
                {/* Armrests */}
                <rect x={cx - 80} y={cy - 30} width={10} height={60} rx={4}
                  fill={sc.color} opacity={0.3} />
                <rect x={cx + 70} y={cy - 30} width={10} height={60} rx={4}
                  fill={sc.color} opacity={0.3} />
                <text x={cx} y={cy + 90} textAnchor="middle"
                  fontFamily={FONT} fontSize={28} fontWeight={800} fill={sc.color}>
                  {sc.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Badge */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={120} accent />
          <text x={540} y={1374} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            3 parameters → more detail
          </text>
        </g>

        {/* Micro floats */}
        {[
          { x: 150, y: 1520 }, { x: 540, y: 1560 }, { x: 900, y: 1500 },
          { x: 300, y: 1620 }, { x: 780, y: 1640 },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y + breathe * (1 + i * 0.15)}
            r={8 + i * 3} fill={COLORS.accent} fillOpacity={0.05}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
