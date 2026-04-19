/**
 * Scene 13 — Calibrate To One Thing
 * "Real production systems calibrate autonomy to one thing,"
 * CSV: 46.260s → 49.980s | Duration: 112 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): Funnel + focus illustration
 *   Phase 3 (70–end): Micro animations
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene13_CalibrateToOneThing: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 46);
  const card4 = useSpringEntrance(frame, 58);
  const card5 = useSpringEntrance(frame, 70);

  // Funnel path draw
  const funnelLen = 600;
  const funnelDash = usePathDraw(frame, 22, funnelLen, 35);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Target ring animation
  const ringScale = spring({ frame: Math.max(0, frame - 50), fps, config: SPRING_SNAP });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  // Input items that funnel down
  const inputs = ['Speed', 'Cost', 'Risk', 'Complexity', 'UX'];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · CALIBRATION" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            One Thing
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Real systems calibrate to
          </text>
        </g>

        {/* Zone C — Funnel illustration */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={680} accent />

          {/* Multiple factors coming in at top — scatter */}
          {inputs.map((inp, i) => {
            const ix = 160 + i * 160;
            const iy = 540 + Math.sin(frame * 0.03 + i * 1.5) * 6;
            const iOp = interpolate(frame, [22 + i * 6, 30 + i * 6], [0, 1], {
              extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={iOp}>
                <circle cx={ix} cy={iy} r={24} fill={COLORS.accent}
                  fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={ix} y={iy + 5} textAnchor="middle" fontFamily={FONT}
                  fontSize={16} fontWeight={800} fill={COLORS.accent}>
                  {inp}
                </text>
              </g>
            );
          })}

          {/* Funnel shape — trapezoid → narrow bottom */}
          <path
            d="M 160,600 L 920,600 L 640,900 L 440,900 Z"
            fill={COLORS.accent} fillOpacity={0.04}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={funnelLen}
            strokeDashoffset={funnelDash}
          />

          {/* Down arrows inside funnel */}
          {[0, 1, 2].map(i => {
            const ay = 660 + i * 70;
            const aOp = interpolate(frame, [30 + i * 8, 40 + i * 8], [0, 0.4], {
              extrapolateRight: 'clamp',
            });
            return (
              <g key={`a${i}`} opacity={aOp}>
                <path d={`M 540,${ay} L 540,${ay + 40}`}
                  fill="none" stroke={COLORS.accent} strokeWidth={2}
                  strokeLinecap="round" markerEnd="url(#arrow)" />
              </g>
            );
          })}

          {/* Output — single circle: REVERSIBILITY */}
          <g transform={`translate(540, 960)`} opacity={card2.opacity}>
            <circle cx={0} cy={0} r={50 * ringScale}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={0} cy={0} r={34 * ringScale}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={0} y={6} textAnchor="middle" fontFamily={FONT}
              fontSize={14} fontWeight={800} fill={COLORS.accent}
              opacity={ringScale}>
              ONE
            </text>
          </g>

          {/* Arrow to label */}
          <g opacity={card3.opacity}>
            <path d="M 540,1020 L 540,1060" fill="none" stroke={COLORS.accent}
              strokeWidth={2} strokeLinecap="round" markerEnd="url(#arrow)" />
            <text x={540} y={1100} textAnchor="middle" fontFamily={FONT}
              fontSize={36} fontWeight={800} fill={COLORS.white}>
              REVERSIBILITY
            </text>
          </g>
        </g>

        {/* Bottom summary cards */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={60} y={1200} w={460} h={200} />
          <text x={100} y={1290} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Many factors
          </text>
          <text x={100} y={1340} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Speed, cost, risk, UX...
          </text>
        </g>
        <g opacity={card5.opacity} transform={`translate(0, ${card5.translateY})`}>
          <BentoCard x={560} y={1200} w={460} h={200} accent />
          <text x={600} y={1290} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            One winner
          </text>
          <text x={600} y={1340} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Reversibility decides all
          </text>
        </g>

        {/* Micro-animation decorations */}
        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={36} fill={COLORS.accent}
            fillOpacity={0.03 * shimmer} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.accent}
            strokeWidth={1} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.15} />
        </g>

        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={200 + i * 220}
            cy={1600 + Math.sin(frame * 0.04 + i * 1.2) * 4}
            r={2.5} fill={COLORS.accent} opacity={0.08} />
        ))}

        {/* Bottom note */}
        <g opacity={interpolate(frame, [70, 85], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1700} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Production systems focus on what matters most
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
