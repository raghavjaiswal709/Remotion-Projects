/**
 * Scene 20 — Getting It Back Requires Something Deliberate
 * "Getting it back requires something deliberate."
 * CSV: 70.960s → 73.760s
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (16–60): Deliberate action visual — key turning in lock
 *   Phase 3 (50–end): Pulse
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene20_RequiresDeliberate: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 8);

  // Giant lock illustration
  const lockEnt = useSpringEntrance(frame, 12);
  const lockPerim = 600;
  const lockDash = usePathDraw(frame, 14, lockPerim, 30);

  // Key turning animation
  const keyEnt = useSpringEntrance(frame, 22);
  const keyRotation = interpolate(
    spring({ frame: Math.max(0, frame - 30), fps, config: SPRING_SNAP }),
    [0, 1], [0, -45]
  );

  // Unlock effect
  const unlockProgress = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const unlockGlow = interpolate(unlockProgress, [0, 1], [0, 0.3]);

  // Word emphasis
  const wordEnt = useSpringEntrance(frame, 18);

  // Insight
  const insightEnt = useSpringEntrance(frame, 40);

  // Bottom cards
  const card1 = useSpringEntrance(frame, 48);
  const card2 = useSpringEntrance(frame, 56);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RECOVERY" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Requires Something
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Deliberate
          </text>
        </g>

        {/* Giant lock */}
        <g opacity={lockEnt.opacity} transform={`translate(540, ${680 + lockEnt.translateY})`}>
          {/* Lock body */}
          <rect x={-80} y={0} width={160} height={120} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={lockPerim} strokeDashoffset={lockDash} />
          {/* Shackle */}
          <path d={`M -40,-10 Q -40,-80 0,-80 Q 40,-80 40,-10`}
            fill="none" stroke={COLORS.accent} strokeWidth={8} strokeLinecap="round" />

          {/* Keyhole */}
          <circle cx={0} cy={45} r={14} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={-4} y={55} width={8} height={30} rx={2} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />

          {/* Glow on unlock */}
          <circle cx={0} cy={45} r={60} fill={COLORS.accent} fillOpacity={unlockGlow}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 45px' }} />
        </g>

        {/* Key */}
        <g opacity={keyEnt.opacity} transform={`translate(540, 725) rotate(${keyRotation})`}
          style={{ transformOrigin: '0px 0px' }}>
          {/* Key shaft */}
          <rect x={16} y={-4} width={120} height={8} rx={3} fill={COLORS.accent} />
          {/* Key head */}
          <circle cx={150} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={3} />
          {/* Key teeth */}
          <rect x={40} y={4} width={12} height={14} rx={2} fill={COLORS.accent} />
          <rect x={64} y={4} width={12} height={18} rx={2} fill={COLORS.accent} />
          <rect x={88} y={4} width={12} height={10} rx={2} fill={COLORS.accent} />
        </g>

        {/* Word emphasis */}
        <g opacity={wordEnt.opacity} transform={`translate(0, ${wordEnt.translateY})`}>
          <BentoCard x={60} y={860} w={960} h={100} accent />
          <text x={540} y={922} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Not automatic — a
            <tspan fill={COLORS.accent} fontStyle="italic"> conscious choice</tspan>
          </text>
        </g>

        {/* Insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1010} w={960} h={120} />
          <rect x={60} y={1010} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1060} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            Upcasting is implicit — Java does it for you
          </text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            Recovering specifics is explicit — you must ask
          </text>
        </g>

        {/* Bottom cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1190} w={460} h={160} />
          <text x={100} y={1250} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Implicit
          </text>
          <text x={100} y={1290} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Upcasting — widening
          </text>
          <text x={100} y={1325} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Always safe, compiler allows
          </text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1190} w={460} h={160} accent />
          <text x={600} y={1250} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            Explicit
          </text>
          <text x={600} y={1290} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Downcasting — narrowing
          </text>
          <text x={600} y={1325} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Risky, needs deliberate cast
          </text>
        </g>

        {/* Rail */}
        <g opacity={0.1}>
          <line x1={60} y1={1440} x2={1020} y2={1440} stroke={COLORS.text_muted} strokeWidth={2} />
        </g>

        {/* Float */}
        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.12} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
