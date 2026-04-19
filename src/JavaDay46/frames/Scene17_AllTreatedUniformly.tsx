/**
 * Scene 17 — Freight Trains All Treated Uniformly
 * "and freight trains, all stored and treated uniformly."
 * CSV: 57.180s → 60.980s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–80): Uniform processing pipeline, 3 trains through same gate
 *   Phase 3 (70–end): Pulse, float
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

export const Scene17_AllTreatedUniformly: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // Pipeline visual — 3 trains pass through a uniform gate
  const trains = [
    { name: 'Express', color: COLORS.accent, letter: 'E' },
    { name: 'Metro', color: '#22C55E', letter: 'M' },
    { name: 'Freight', color: '#A855F7', letter: 'F' },
  ];
  const trainEnts = trains.map((_, i) => useSpringEntrance(frame, 16 + i * 10));

  // Gate/processor
  const gateEnt = useSpringEntrance(frame, 20);
  const gatePerim = 2 * (200 + 500);
  const gateDash = usePathDraw(frame, 22, gatePerim, 30);

  // Through-arrows
  const arrowLen = 120;
  const arrowDashes = trains.map((_, i) => usePathDraw(frame, 30 + i * 10, arrowLen, 18));

  // Output — all "processed" uniformly
  const outputEnts = trains.map((_, i) => useSpringEntrance(frame, 48 + i * 10));

  // Equal sign between
  const equalEnt = useSpringEntrance(frame, 60);

  // Insight
  const insightEnt = useSpringEntrance(frame, 70);

  // Bottom summary cards
  const summaryCard = useSpringEntrance(frame, 74);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UNIFORM TREATMENT" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            All Treated
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Uniformly
          </text>
        </g>

        {/* Input trains — left column */}
        {trains.map((t, i) => {
          const ent = trainEnts[i];
          const y = 490 + i * 120;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              {/* Mini locomotive */}
              <rect x={60} y={y} width={160} height={70} rx={12}
                fill={COLORS.bg_secondary} stroke={t.color} strokeWidth={2} />
              <circle cx={100} cy={y + 35} r={16} fill={t.color} fillOpacity={0.15} />
              <text x={100} y={y + 42} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={t.color}>
                {t.letter}
              </text>
              <text x={130} y={y + 42} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.white}>
                {t.name}
              </text>

              {/* Arrow to gate */}
              <line x1={220} y1={y + 35} x2={340} y2={680}
                stroke={t.color} strokeWidth={2} opacity={0.4}
                strokeDasharray={arrowLen} strokeDashoffset={arrowDashes[i]}
                markerEnd="url(#arrow)" />
            </g>
          );
        })}

        {/* Central gate / processor */}
        <g opacity={gateEnt.opacity} transform={`translate(0, ${gateEnt.translateY})`}>
          <rect x={340} y={580} width={200} height={200} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={gatePerim} strokeDashoffset={gateDash} />

          {/* Gate internals */}
          <text x={440} y={640} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            PROCESSOR
          </text>
          <line x1={360} y1={660} x2={520} y2={660} stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />

          {/* Code inside */}
          <text x={360} y={695} fontFamily="'Fira Code', monospace" fontSize={16} fontWeight={500} fill={COLORS.text_muted}>
            t.depart();
          </text>
          <text x={360} y={720} fontFamily="'Fira Code', monospace" fontSize={16} fontWeight={500} fill={COLORS.text_muted}>
            t.arrive();
          </text>
          <text x={360} y={745} fontFamily="'Fira Code', monospace" fontSize={16} fontWeight={500} fill={COLORS.text_muted}>
            t.getPassengers();
          </text>
        </g>

        {/* Output arrows */}
        {trains.map((t, i) => {
          const oEnt = outputEnts[i];
          const y = 490 + i * 120;
          return (
            <g key={`out-${i}`} opacity={oEnt.opacity} transform={`translate(0, ${oEnt.translateY})`}>
              <line x1={540} y1={680} x2={660} y2={y + 35}
                stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3}
                markerEnd="url(#arrow)" />
              {/* Processed badge */}
              <rect x={670} y={y + 5} width={140} height={55} rx={12}
                fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={1} />
              <text x={740} y={y + 40} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
                Processed
              </text>
            </g>
          );
        })}

        {/* Equal treatment emphasis */}
        <g opacity={equalEnt.opacity} transform={`translate(0, ${equalEnt.translateY})`}>
          <BentoCard x={60} y={830} w={960} h={120} accent />
          <text x={540} y={885} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Same methods called on
          </text>
          <text x={540} y={925} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            every single train subtype
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1000} w={460} h={200} />
          <text x={100} y={1060} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent} letterSpacing="0.08em">
            STORED
          </text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.white}>
            In one List{'<Train>'} collection
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            No separate lists per type
          </text>
          <text x={100} y={1175} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            All unified under Train
          </text>
        </g>

        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1000} w={460} h={200} accent />
          <text x={600} y={1060} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent} letterSpacing="0.08em">
            TREATED
          </text>
          <text x={600} y={1100} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.white}>
            Through parent-type interface
          </text>
          <text x={600} y={1140} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Polymorphism handles dispatch
          </text>
          <text x={600} y={1175} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Correct override runs at runtime
          </text>
        </g>

        {/* Insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={100} />
          <rect x={60} y={1260} width={6} height={100} rx={3} fill={COLORS.accent} />
          <text x={100} y={1318} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Store as Train, behave as subtype — uniformity
          </text>
        </g>

        {/* Rail */}
        <g opacity={0.12}>
          <line x1={60} y1={1440} x2={1020} y2={1440} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={60} y1={1450} x2={1020} y2={1450} stroke={COLORS.text_muted} strokeWidth={1} />
        </g>

        {/* Float */}
        <g transform={`translate(540, ${1570 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.15} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
