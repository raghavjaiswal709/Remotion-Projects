/**
 * Scene 20 — ContinuousLoop
 * "With the runtime, it becomes a continuous loop."
 * CSV: 54.600s → 58.380s
 * Duration: 114 frames (3.8s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline
 *   Phase 2 (14–70): continuous loop diagram, runtime wrapping model
 *   Phase 3 (60–end): micro — rotating orbit, pulsing
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

export const Scene20_ContinuousLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 10);

  // Outer runtime ring
  const CX = 540;
  const CY = 880;
  const outerR = 260;
  const outerCirc = 2 * Math.PI * outerR;
  const outerDash = usePathDraw(frame, 14, outerCirc, 35);

  // Inner model circle
  const innerR = 100;
  const innerEnt = useSpringEntrance(frame, 20);

  // Circular arrows (3 around the ring)
  const arrowLen = 180;
  const arrowDashes = [0, 1, 2].map(i => usePathDraw(frame, 24 + i * 6, arrowLen, 20));

  // Labels on the ring
  const ringLabels = [
    { text: 'ACT', angle: -60 },
    { text: 'OBSERVE', angle: 60 },
    { text: 'DECIDE', angle: 180 },
  ];
  const ringLabelEnts = ringLabels.map((_, i) => useSpringEntrance(frame, 30 + i * 8));

  // Rotating orbit dot
  const orbitAngle = interpolate(frame, [40, 114], [0, 720], { extrapolateRight: 'clamp' });

  // Cards
  const card1 = useSpringEntrance(frame, 50);
  const card2 = useSpringEntrance(frame, 58);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 + frame * 0.014;
    const r = outerR + 40 + Math.sin(frame * 0.018 + i * 1.2) * 20;
    return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        {/* Per-word headline */}
        {['Continuous', 'Loop'].map((w, i) => {
          const f2 = Math.max(0, frame - 4 - i * 6);
          const sp = spring({ frame: f2, fps, config: SPRING_SNAP });
          const ty = interpolate(sp, [0, 1], [24, 0]);
          const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <text key={i} x={60} y={300 + i * 100} opacity={op}
              transform={`translate(0, ${ty})`}
              fontFamily={FONT} fontSize={96} fontWeight={800}
              fill={i === 1 ? COLORS.accent : COLORS.white}>{w}</text>
          );
        })}

        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={480} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>With the runtime</text>
        </g>

        {/* Outer runtime ring */}
        <circle cx={CX} cy={CY} r={outerR}
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={outerCirc} strokeDashoffset={outerDash} />
        {/* Faint fill */}
        <circle cx={CX} cy={CY} r={outerR}
          fill={COLORS.accent} opacity={0.02 * shimmer} />

        {/* Inner model circle */}
        <g opacity={innerEnt.opacity} transform={`translate(0, ${innerEnt.translateY * 0.3})`}>
          <circle cx={CX} cy={CY} r={innerR}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          <text x={CX} y={CY + 8} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>MODEL</text>
        </g>

        {/* RUNTIME label */}
        <text x={CX} y={CY - outerR - 20} textAnchor="middle"
          fontFamily={FONT} fontSize={28} fontWeight={800}
          fill={COLORS.accent} letterSpacing="0.15em"
          opacity={interpolate(frame, [20, 30], [0, 0.8], { extrapolateRight: 'clamp' })}>
          RUNTIME
        </text>

        {/* Ring labels (ACT, OBSERVE, DECIDE) */}
        {ringLabels.map((lbl, i) => {
          const rad = (lbl.angle * Math.PI) / 180;
          const lx = CX + Math.cos(rad) * (outerR + 50);
          const ly = CY + Math.sin(rad) * (outerR + 50);
          const ent = ringLabelEnts[i];
          return (
            <g key={i} opacity={ent.opacity}>
              {/* Node circle */}
              <circle cx={CX + Math.cos(rad) * outerR} cy={CY + Math.sin(rad) * outerR}
                r={8} fill={COLORS.accent} />
              <circle cx={CX + Math.cos(rad) * outerR} cy={CY + Math.sin(rad) * outerR}
                r={16} fill={COLORS.accent} opacity={0.15} />
              {/* Label */}
              <text x={lx} y={ly + 6} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
                {lbl.text}
              </text>
            </g>
          );
        })}

        {/* Curved arrows between labels */}
        {[0, 1, 2].map(i => {
          const a1 = (ringLabels[i].angle * Math.PI) / 180;
          const a2 = (ringLabels[(i + 1) % 3].angle * Math.PI) / 180;
          const x1 = CX + Math.cos(a1) * (outerR + 10);
          const y1 = CY + Math.sin(a1) * (outerR + 10);
          const x2 = CX + Math.cos(a2) * (outerR + 10);
          const y2 = CY + Math.sin(a2) * (outerR + 10);
          const mx = CX + Math.cos((a1 + a2) / 2) * (outerR + 60);
          const my = CY + Math.sin((a1 + a2) / 2) * (outerR + 60);
          return (
            <path key={i}
              d={`M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5}
              strokeDasharray={arrowLen} strokeDashoffset={arrowDashes[i]}
              strokeLinecap="round" markerEnd="url(#arrow)" opacity={0.4} />
          );
        })}

        {/* Orbiting dot */}
        {(() => {
          const rad = (orbitAngle * Math.PI) / 180;
          const ox = CX + Math.cos(rad) * outerR;
          const oy = CY + Math.sin(rad) * outerR;
          const orbitOp = interpolate(frame, [40, 48], [0, 0.9], { extrapolateRight: 'clamp' });
          return (
            <g opacity={orbitOp}>
              <circle cx={ox} cy={oy} r={6} fill={COLORS.accent} />
              <circle cx={ox} cy={oy} r={14} fill={COLORS.accent} opacity={0.15} />
            </g>
          );
        })()}

        {/* Cards below */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1220} w={460} h={160} accent />
          <text x={100} y={1280} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>RUNTIME ENABLES</text>
          <text x={100} y={1316} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>Tools, memory, iteration</text>
          <text x={100} y={1352} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>Everything the model lacks</text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1220} w={460} h={160} />
          <text x={600} y={1280} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>CONTINUOUS</text>
          <text x={600} y={1316} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>Loops until goal is met</text>
          <text x={600} y={1352} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>No human intervention</text>
        </g>

        {/* Bottom */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1420} w={960} h={100} />
          <text x={540} y={1483} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The loop is now <tspan fill={COLORS.accent} fontStyle="italic">alive</tspan>
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.04 * shimmer} />
        ))}

        <g transform={`translate(540, ${1640 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} opacity={0.03} />
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.1} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
