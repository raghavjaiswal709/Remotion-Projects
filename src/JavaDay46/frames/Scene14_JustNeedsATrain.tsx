/**
 * Scene 14 — Just Needs A Train
 * "It just needs a train."
 * CSV: 49.080s → 51.060s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + hero text spring
 *   Phase 2 (20–80): Central Train node, method slots, simplicity card
 *   Phase 3 (70–end): Pulse, ring animation
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

export const Scene14_JustNeedsATrain: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const heroEnt = useSpringEntrance(frame, 6);
  const subEnt = useSpringEntrance(frame, 12);

  // Central large Train node
  const trainNode = useSpringEntrance(frame, 16);
  const nodeRingLen = 2 * Math.PI * 120;
  const nodeRingDash = usePathDraw(frame, 18, nodeRingLen, 25);

  // Method slots
  const methods = ['depart()', 'arrive()', 'getPassengers()'];
  const methodEnts = methods.map((_, i) => useSpringEntrance(frame, 30 + i * 10));

  // Connector lines
  const connLen = 60;
  const connDashes = methods.map((_, i) => usePathDraw(frame, 35 + i * 10, connLen, 15));

  // Simplicity card
  const simpleCard = useSpringEntrance(frame, 55);

  // Arrow from subtypes converging
  const subtypes = ['Express', 'Metro', 'Freight'];
  const subtypeEnts = subtypes.map((_, i) => useSpringEntrance(frame, 40 + i * 8));
  const arrowLens = subtypes.map((_, i) => usePathDraw(frame, 44 + i * 8, 120, 20));

  // Insight
  const insightEnt = useSpringEntrance(frame, 65);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Glow ring animation
  const glowRadius = interpolate(frame, [20, 80], [120, 140], { extrapolateRight: 'clamp' });
  const glowOpacity = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.03, 0.08]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SIMPLICITY" y={130} />
        </g>

        {/* Ghost background text */}
        <text x={540} y={600} textAnchor="middle" fontFamily={FONT} fontSize={280} fontWeight={800}
          fill={COLORS.accent} opacity={heroEnt.opacity * 0.04}>
          TRAIN
        </text>

        {/* Hero text */}
        <g transform={`translate(0, ${heroEnt.translateY})`} opacity={heroEnt.opacity}>
          <text x={540} y={290} textAnchor="middle" fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Just Needs
          </text>
        </g>
        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={540} y={380} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            A Train
          </text>
        </g>

        {/* Central large Train node */}
        <g opacity={trainNode.opacity} transform={`translate(540, ${640 + trainNode.translateY})`}>
          {/* Glow ring */}
          <circle cx={0} cy={0} r={glowRadius} fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={glowOpacity} />
          {/* Main ring */}
          <circle cx={0} cy={0} r={100} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={nodeRingLen} strokeDashoffset={nodeRingDash} />
          {/* Label */}
          <text x={0} y={-12} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Train
          </text>
          <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Parent Type
          </text>
        </g>

        {/* Method slots — right of Train node */}
        {methods.map((m, i) => {
          const ent = methodEnts[i];
          const y = 580 + i * 70;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <line x1={640} y1={640} x2={720} y2={y + 16}
                stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4}
                strokeDasharray={connLen} strokeDashoffset={connDashes[i]} />
              <BentoCard x={720} y={y} w={280} h={44} />
              <text x={740} y={y + 30} fontFamily="'Fira Code', 'Courier New', monospace"
                fontSize={22} fontWeight={500} fill={COLORS.white}>
                {m}
              </text>
            </g>
          );
        })}

        {/* Subtypes converging to Train — left side */}
        {subtypes.map((s, i) => {
          const ent = subtypeEnts[i];
          const sy = 560 + i * 80;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <rect x={140} y={sy} width={180} height={50} rx={12}
                fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
              <text x={230} y={sy + 32} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={i === 0 ? COLORS.accent : COLORS.text_muted}>
                {s}
              </text>
              {/* Arrow to center */}
              <line x1={320} y1={sy + 25} x2={440} y2={640}
                stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3}
                strokeDasharray={120} strokeDashoffset={arrowLens[i]} markerEnd="url(#arrow)" />
            </g>
          );
        })}

        {/* Simplicity card */}
        <g opacity={simpleCard.opacity} transform={`translate(0, ${simpleCard.translateY})`}>
          <BentoCard x={60} y={830} w={960} h={200} accent />
          <text x={100} y={895} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The method signature only requires
          </text>
          <text x={100} y={945} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={500} fill={COLORS.accent}>
            {'void process(Train t)'}
          </text>
          <text x={100} y={1000} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Any subtype automatically fits — no branching, no casting
          </text>
        </g>

        {/* Visual: Train locomotive silhouette */}
        <g opacity={simpleCard.opacity * 0.25} transform={`translate(540, ${1140 + breathe})`}>
          <rect x={-200} y={-30} width={400} height={60} rx={12} fill={COLORS.accent} fillOpacity={0.08} />
          <rect x={-220} y={-50} width={80} height={80} rx={8} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={-160} cy={50} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.15} />
          <circle cx={-80} cy={50} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.15} />
          <circle cx={0} cy={50} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.15} />
          <circle cx={80} cy={50} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.15} />
          <circle cx={160} cy={50} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.15} />
        </g>

        {/* Insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={120} />
          <rect x={60} y={1280} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1335} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Train — the only type contract needed
          </text>
          <text x={100} y={1375} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            Subtypes bring their own implementation
          </text>
        </g>

        {/* Track decoration bottom */}
        <g opacity={insightEnt.opacity * 0.2}>
          <line x1={60} y1={1480} x2={1020} y2={1480} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={60} y1={1490} x2={1020} y2={1490} stroke={COLORS.text_muted} strokeWidth={1} opacity={0.4} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={80 + i * 60} y={1475} width={30} height={4} rx={1}
              fill={COLORS.text_muted} opacity={0.15} />
          ))}
        </g>

        {/* Floating accent */}
        <g transform={`translate(540, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={shimmer * 0.2} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
