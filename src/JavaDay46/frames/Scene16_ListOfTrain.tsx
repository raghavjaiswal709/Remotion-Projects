/**
 * Scene 16 — List Of Train Holds Express Metro
 * "A list of train can hold express, metro,"
 * CSV: 53.600s → 57.180s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–85): List<Train> container, train items stagger in
 *   Phase 3 (75–end): Pulse, float
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

export const Scene16_ListOfTrain: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // Code declaration
  const codeEnt = useSpringEntrance(frame, 14);

  // Container card
  const containerEnt = useSpringEntrance(frame, 18);
  const containerPerim = 2 * (960 + 600);
  const containerDash = usePathDraw(frame, 20, containerPerim, 35);

  // Train items in list
  const trains = [
    { name: 'ExpressTrain', color: COLORS.accent, icon: 'E', desc: 'speed: 300' },
    { name: 'MetroTrain', color: '#22C55E', icon: 'M', desc: 'stops: 24' },
    { name: 'FreightTrain', color: '#A855F7', icon: 'F', desc: 'cargo: 5000t' },
  ];
  const trainEnts = trains.map((_, i) => useSpringEntrance(frame, 28 + i * 12));

  // "All are Train" label
  const allTrainEnt = useSpringEntrance(frame, 60);

  // Bracket animation
  const bracketLen = 440;
  const bracketDash = usePathDraw(frame, 55, bracketLen, 25);

  // Insight
  const insightEnt = useSpringEntrance(frame, 68);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="COLLECTIONS · UPCASTING" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            {'List<Train>'}
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            Holds Express, Metro...
          </text>
        </g>

        {/* Code declaration */}
        <g opacity={codeEnt.opacity} transform={`translate(0, ${codeEnt.translateY})`}>
          <BentoCard x={60} y={430} w={960} h={70} accent />
          <text x={100} y={474} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500} fill={COLORS.accent}>
            {'List<Train> fleet = new ArrayList<>();'}
          </text>
        </g>

        {/* Container card — the list visual */}
        <g opacity={containerEnt.opacity} transform={`translate(0, ${containerEnt.translateY})`}>
          {/* Outer container rect with animated border */}
          <rect x={60} y={550} width={960} height={520} rx={20}
            fill={COLORS.bg_secondary} fillOpacity={0.3}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={containerPerim} strokeDashoffset={containerDash} />

          {/* Container label */}
          <text x={100} y={590} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent} letterSpacing="0.12em">
            {'LIST<TRAIN>'}
          </text>
          <line x1={80} y1={605} x2={1000} y2={605} stroke={COLORS.accent} strokeWidth={1} opacity={0.15} />

          {/* Index numbers */}
          <text x={80} y={690} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500} fill={COLORS.text_muted}>[0]</text>
          <text x={80} y={810} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500} fill={COLORS.text_muted}>[1]</text>
          <text x={80} y={930} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500} fill={COLORS.text_muted}>[2]</text>
        </g>

        {/* Train items in list */}
        {trains.map((t, i) => {
          const ent = trainEnts[i];
          const y = 640 + i * 120;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              {/* Train card */}
              <rect x={140} y={y} width={740} height={85} rx={14}
                fill={COLORS.bg_secondary} stroke={t.color} strokeWidth={2} />

              {/* Icon circle */}
              <circle cx={190} cy={y + 42} r={22} fill={t.color} fillOpacity={0.15} />
              <text x={190} y={y + 50} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800} fill={t.color}>
                {t.icon}
              </text>

              {/* Name */}
              <text x={230} y={y + 38} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
                {t.name}
              </text>
              <text x={230} y={y + 68} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
                {t.desc}
              </text>

              {/* "stored as Train" badge */}
              <rect x={660} y={y + 20} width={200} height={40} rx={20}
                fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1} />
              <text x={760} y={y + 47} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
                stored as Train
              </text>

              {/* Mini train icon at left */}
              <rect x={140} y={y} width={5} height={85} rx={2} fill={t.color} />
            </g>
          );
        })}

        {/* Right bracket with "All are Train" */}
        <g opacity={allTrainEnt.opacity}>
          <path d={`M 900,660 Q 940,660 940,780 Q 940,900 900,900`}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={bracketLen} strokeDashoffset={bracketDash} />
          <text x={960} y={785} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} transform="rotate(90 960 785)">
            All Train type
          </text>
        </g>

        {/* Insight card */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1140} w={960} h={200} />
          <rect x={60} y={1140} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1196} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            One collection, multiple subtypes
          </text>
          <text x={100} y={1240} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            Upcasting lets any child live in a parent-typed list
          </text>
          <text x={100} y={1290} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500} fill={COLORS.text_muted}>
            {'fleet.add(new ExpressTrain());  // auto-upcast'}
          </text>
          <text x={100} y={1320} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500} fill={COLORS.text_muted}>
            {'fleet.add(new MetroTrain());    // auto-upcast'}
          </text>
        </g>

        {/* Rail decoration */}
        <g opacity={insightEnt.opacity * 0.15}>
          <line x1={60} y1={1430} x2={1020} y2={1430} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={60} y1={1440} x2={1020} y2={1440} stroke={COLORS.text_muted} strokeWidth={1} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={80 + i * 60} y={1426} width={28} height={4} rx={1} fill={COLORS.text_muted} opacity={0.12} />
          ))}
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.15} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
