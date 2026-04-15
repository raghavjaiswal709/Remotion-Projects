/**
 * Scene 11 — One Copy Shared
 * "No matter how many train instances exist, there is only one copy of this variable, shared across all of them."
 * CSV: 55.780s → 63.580s
 * Duration: 234 frames (7.8s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline spring
 *   Phase 2 (20–80): Central hub + train nodes radiate out
 *   Phase 3 (75–end): Pulse on hub, node breathing
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

const TRAINS = [
  { label: 'Train 1', angle: 0 },
  { label: 'Train 2', angle: 60 },
  { label: 'Train 3', angle: 120 },
  { label: 'Train 4', angle: 180 },
  { label: 'Train 5', angle: 240 },
  { label: 'Train 6', angle: 300 },
];

export const Scene11_OneCopyShared: React.FC = () => {
  const frame = useCurrentFrame();

  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 6);
  const hubCard  = useSpringEntrance(frame, 18);
  const summary  = useSpringEntrance(frame, 65);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const breathe = Math.sin(frame * 0.05) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const HUB_X = 540, HUB_Y = 880;
  const RADIUS = 320;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0,${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="SHARED VARIABLE · ONE COPY" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0,${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            One Copy
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Shared Across All
          </text>
        </g>

        {/* Big "1" ghost number */}
        <text x={HUB_X} y={HUB_Y + 30} textAnchor="middle"
          fontFamily={FONT} fontSize={360} fontWeight={800}
          fill={COLORS.accent} opacity={hubCard.opacity * 0.06}>
          1
        </text>

        {/* Central hub */}
        <g opacity={hubCard.opacity} transform={`translate(0,${hubCard.translateY})`}>
          <circle cx={HUB_X} cy={HUB_Y} r={100}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={3} />
          <text x={HUB_X} y={HUB_Y - 10} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            static int
          </text>
          <text x={HUB_X} y={HUB_Y + 35} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            style={{ transform: `scale(${pulse})`, transformOrigin: `${HUB_X}px ${HUB_Y + 20}px` }}>
            totalTrains
          </text>
        </g>

        {/* Spokes + train nodes */}
        {TRAINS.map((t, i) => {
          const nodeDelay = 25 + i * 8;
          const nodeSpring = useSpringEntrance(frame, nodeDelay);
          const rad = (t.angle * Math.PI) / 180;
          const nx = HUB_X + RADIUS * Math.cos(rad);
          const ny = HUB_Y + RADIUS * Math.sin(rad);
          const lineLen = RADIUS - 100 - 35;
          const dash = usePathDraw(frame, nodeDelay, lineLen, 20);
          const nodeBreathe = Math.sin((frame + i * 10) * 0.05) * 3;

          return (
            <g key={i}>
              {/* Spoke line */}
              <line x1={HUB_X + 100 * Math.cos(rad)} y1={HUB_Y + 100 * Math.sin(rad)}
                x2={nx - 35 * Math.cos(rad)} y2={ny - 35 * Math.sin(rad)}
                stroke={COLORS.accent} strokeWidth={1.5} opacity={nodeSpring.opacity * 0.5}
                strokeDasharray={lineLen} strokeDashoffset={dash} />
              {/* Train node */}
              <g opacity={nodeSpring.opacity}
                transform={`translate(${nx},${ny + nodeBreathe})`}>
                <circle cx={0} cy={0} r={35}
                  fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
                {/* Mini train rect */}
                <rect x={-14} y={-12} width={28} height={14} rx={3}
                  fill={COLORS.accent} opacity={0.3} />
                <circle cx={-7} cy={8} r={4} fill="none"
                  stroke={COLORS.accent} strokeWidth={1} />
                <circle cx={7} cy={8} r={4} fill="none"
                  stroke={COLORS.accent} strokeWidth={1} />
                <text x={0} y={55} textAnchor="middle"
                  fontFamily={FONT} fontSize={22} fontWeight={800}
                  fill={COLORS.text_muted}>
                  {t.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* "ONE" badge */}
        <g opacity={hubCard.opacity} transform={`translate(0,${hubCard.translateY})`}>
          <circle cx={HUB_X + 80} cy={HUB_Y - 80} r={26}
            fill={COLORS.accent} opacity={shimmer} />
          <text x={HUB_X + 80} y={HUB_Y - 72} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.bg_primary}>
            ONE
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summary.opacity} transform={`translate(0,${summary.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={140} accent />
          <text x={540} y={1400} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Many instances. <tspan fill={COLORS.accent} fontStyle="italic">One</tspan> shared variable.
          </text>
          <text x={540} y={1445} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Every Train reads and writes the same copy.
          </text>
        </g>

        {/* Decorative dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={340 + i * 100} cy={1560} r={4}
            fill={COLORS.accent} opacity={0.15 + 0.05 * i} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
