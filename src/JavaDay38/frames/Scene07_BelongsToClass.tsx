/**
 * Scene 07 — Belongs To Class
 * "That number does not belong to any single train object. It belongs to the train class itself."
 * CSV: 35.100s → 42.880s
 * Duration: 234 frames (7.8s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Headline + label springs
 *   Phase 2 (18–80): Split diagram — objects vs class
 *   Phase 3 (70–end): Glow on class box, float on objects
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene07_BelongsToClass: React.FC = () => {
  const frame = useCurrentFrame();

  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 6);
  const subline  = useSpringEntrance(frame, 12);

  // Object cards (left side)
  const obj1 = useSpringEntrance(frame, 22);
  const obj2 = useSpringEntrance(frame, 34);
  const obj3 = useSpringEntrance(frame, 46);

  // Class card (right side)
  const classCard = useSpringEntrance(frame, 30);

  // Red X marks on objects
  const xMark = useSpringEntrance(frame, 55);

  // Arrow from objects to class
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 60, arrowLen, 25);

  // Phase 3
  const breathe = Math.sin(frame * 0.05) * 3;
  const classPulse = 1 + Math.sin(frame * 0.07) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.8, 1]);

  // Bottom summary
  const summary = useSpringEntrance(frame, 70);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="CLASS vs OBJECT" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Does Not Belong
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            to any single train object
          </text>
        </g>

        {/* ZONE C — Left: Train objects with X marks */}
        {[
          { y: 500, name: 'train1', e: obj1 },
          { y: 680, name: 'train2', e: obj2 },
          { y: 860, name: 'train3', e: obj3 },
        ].map(({ y, name, e }, i) => (
          <g key={i} opacity={e.opacity} transform={`translate(0, ${e.translateY + (i === 1 ? breathe : 0)})`}>
            <BentoCard x={60} y={y} w={440} h={140} />
            {/* Mini train icon */}
            <rect x={90} y={y + 40} width={80} height={40} rx={6}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={105} cy={y + 90} r={10} fill="none"
              stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={155} cy={y + 90} r={10} fill="none"
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={200} y={y + 68} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
              {name}
            </text>
            <text x={200} y={y + 108} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
              totalActive?
            </text>
            {/* Red X */}
            <g opacity={xMark.opacity}>
              <line x1={420} y1={y + 30} x2={470} y2={y + 110}
                stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
              <line x1={470} y1={y + 30} x2={420} y2={y + 110}
                stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
            </g>
          </g>
        ))}

        {/* Right: Class card — highlighted */}
        <g opacity={classCard.opacity} transform={`translate(0, ${classCard.translateY})`}>
          <BentoCard x={560} y={560} w={460} h={380} accent />
          {/* Class header */}
          <rect x={560} y={560} width={460} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={790} y={600} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Train CLASS
          </text>
          {/* Variable highlight */}
          <rect x={600} y={660} width={380} height={70} rx={12}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${classPulse})`}
            style={{ transformOrigin: '790px 695px' }} />
          <text x={790} y={706} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            totalActiveTrains
          </text>
          {/* Checkmark */}
          <circle cx={790} cy={810} r={30} fill={COLORS.accent} fillOpacity={0.15} />
          <path d="M 772,810 L 785,823 L 810,795"
            fill="none" stroke={COLORS.accent} strokeWidth={3.5} strokeLinecap="round" />
          <text x={790} y={890} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Belongs HERE
          </text>
        </g>

        {/* Arrow from objects → class */}
        <path d="M 500,740 C 530,710 540,700 560,690"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Divider label */}
        <g opacity={summary.opacity * shimmer}>
          <text x={540} y={1110} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            NOT per-object. Per-CLASS.
          </text>
        </g>

        {/* Bottom summary card */}
        <g opacity={summary.opacity} transform={`translate(0, ${summary.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={200} accent />
          <rect x={60} y={1180} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1260} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The variable lives in the class blueprint,
          </text>
          <text x={100} y={1320} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            not in any instance created from it.
          </text>
        </g>

        {/* Decorative line */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <circle key={i} cx={240 + i * 120} cy={1460} r={3}
            fill={COLORS.accent} opacity={0.2 + Math.sin(frame * 0.06 + i) * 0.1} />
        ))}

        {/* Extra card — class analogy */}
        <g opacity={summary.opacity}>
          <BentoCard x={60} y={1500} w={960} h={140} />
          <text x={540} y={1580} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Like a network-wide counter in the railway headquarters
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
