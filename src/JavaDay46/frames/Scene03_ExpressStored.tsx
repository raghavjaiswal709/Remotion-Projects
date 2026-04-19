/**
 * Scene 03 — Express Stored In Train Reference
 * "When an express train object is stored in a train type reference,"
 * CSV: 13.340s → 16.800s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Express train illustration + train reference box + arrow
 *   Phase 3 (80–end): Breathe, pulse, shimmer
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

export const Scene03_ExpressStored: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // Phase 2
  const trainCard = useSpringEntrance(frame, 22);
  const refCard = useSpringEntrance(frame, 34);
  const arrowCard = useSpringEntrance(frame, 46);
  const detailCard = useSpringEntrance(frame, 58);
  const bottomCard = useSpringEntrance(frame, 70);

  // Path draws
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 44, arrowLen, 20);
  const trackLen = 960;
  const trackDash = usePathDraw(frame, 30, trackLen, 35);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Border draws
  const perimTrain = 2 * (420 + 500);
  const borderTrain = interpolate(frame, [22, 55], [perimTrain, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UPCASTING · CONCEPT" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Express Object
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Stored in Train Reference
          </text>
        </g>

        {/* ZONE C — Express Train locomotive illustration */}
        <g opacity={trainCard.opacity} transform={`translate(0, ${trainCard.translateY})`}>
          {/* Bento card background */}
          <rect x={60} y={480} width={420} height={500} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={perimTrain} strokeDashoffset={borderTrain} />
          <BentoCard x={60} y={480} w={420} h={500} accent />

          {/* Label */}
          <text x={270} y={530} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>

          {/* Locomotive body */}
          <rect x={120} y={600} width={300} height={120} rx={12} fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Cab */}
          <rect x={340} y={560} width={80} height={160} rx={8} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Smokestack */}
          <rect x={160} y={570} width={30} height={30} rx={4} fill={COLORS.accent} fillOpacity={0.25} />
          {/* Wheels */}
          <circle cx={180} cy={740} r={24} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={180} cy={740} r={8} fill={COLORS.accent} fillOpacity={0.4} />
          <circle cx={280} cy={740} r={24} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={280} cy={740} r={8} fill={COLORS.accent} fillOpacity={0.4} />
          <circle cx={380} cy={740} r={24} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={380} cy={740} r={8} fill={COLORS.accent} fillOpacity={0.4} />

          {/* Tracks under wheels */}
          <line x1={100} y1={768} x2={440} y2={768} stroke={COLORS.text_muted} strokeWidth={3} />
          <line x1={100} y1={780} x2={440} y2={780} stroke={COLORS.text_muted} strokeWidth={3} />
          {/* Cross ties */}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={110 + i * 42} y={768} width={8} height={12} rx={1}
              fill={COLORS.text_muted} fillOpacity={0.5} />
          ))}

          {/* Express badge */}
          <rect x={140} y={830} width={200} height={50} rx={12}
            fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={240} y={863} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            EXPRESS
          </text>

          {/* Methods list */}
          <text x={130} y={920} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            + depart()
          </text>
          <text x={130} y={955} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            + expressLounge()
          </text>
        </g>

        {/* Train Reference box */}
        <g opacity={refCard.opacity} transform={`translate(0, ${refCard.translateY})`}>
          <BentoCard x={540} y={480} w={480} h={260} />
          <text x={780} y={530} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Train Reference
          </text>
          <line x1={560} y1={550} x2={1000} y2={550} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Reference variable icon */}
          <rect x={620} y={580} width={280} height={60} rx={10}
            fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={1} />
          <text x={760} y={620} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Train t
          </text>

          {/* Visible methods */}
          <text x={600} y={690} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Sees only:
          </text>
          <text x={600} y={725} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            + depart() + schedule()
          </text>
        </g>

        {/* Arrow from Express → Train reference */}
        <path d={`M 480,630 L ${480 + 60},630`} fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <text x={510} y={615} fontFamily={FONT} fontSize={24} fontWeight={800}
          fill={COLORS.text_muted} opacity={arrowCard.opacity}>
          stored as
        </text>

        {/* "Object in heap" card */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={540} y={790} w={480} h={190} accent />
          <rect x={540} y={790} width={6} height={190} rx={3} fill={COLORS.accent} />
          <text x={580} y={850} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            In Memory (Heap)
          </text>
          <text x={580} y={900} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Still an ExpressTrain
          </text>
          <text x={580} y={945} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Full object preserved
          </text>
        </g>

        {/* Full‑width track */}
        <line x1={60} y1={1060} x2={1020} y2={1060} stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={trackLen} strokeDashoffset={trackDash} strokeLinecap="round" />
        <line x1={60} y1={1072} x2={1020} y2={1072} stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={trackLen} strokeDashoffset={trackDash * 0.8} strokeLinecap="round" opacity={0.5} />

        {/* Bottom explanation */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={240} />
          <text x={100} y={1195} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The reference type narrows the view
          </text>
          <text x={100} y={1250} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Object still has all its original capabilities
          </text>
          <text x={100} y={1305} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            but only Train methods are accessible through t
          </text>
        </g>

        {/* Floating accents */}
        <g transform={`translate(900, ${1480 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(120, ${1550 + breathe * -0.7})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.04} />
        </g>

        {/* Additional visual: key insight badge */}
        <g opacity={bottomCard.opacity}>
          <BentoCard x={60} y={1420} w={960} h={120} accent />
          <text x={540} y={1495} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            This is the foundation of upcasting
          </text>
        </g>

        {/* Decorative rail ties at bottom */}
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={80 + i * 80} y={1580} width={10} height={20} rx={2}
            fill={COLORS.accent} fillOpacity={0.1 * shimmer} opacity={bottomCard.opacity} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
