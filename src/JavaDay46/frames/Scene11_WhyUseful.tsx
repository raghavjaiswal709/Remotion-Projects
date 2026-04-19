/**
 * Scene 11 — Why Is This Useful?
 * "Why is this useful?"
 * CSV: 39.260s → 40.900s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + giant question mark spring
 *   Phase 2 (20–60): Benefit cards staggered, use-case icons
 *   Phase 3 (50–end): Question mark pulse, breathe
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

export const Scene11_WhyUseful: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 4);

  // Giant question mark
  const qF = Math.max(0, frame - 2);
  const qProg = spring({ frame: qF, fps, config: SPRING_SNAP });
  const qScale = interpolate(qProg, [0, 1], [0.5, 1]);
  const qOp = interpolate(qF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const qGhost = interpolate(qF, [0, 15], [0, 0.06], { extrapolateRight: 'clamp' });

  // Benefit cards
  const benefits = [
    { title: 'Generic Processing', desc: 'Handle all train types uniformly', icon: 'G' },
    { title: 'Flexible Collections', desc: 'List<Train> holds any subtype', icon: 'F' },
    { title: 'Loose Coupling', desc: 'Code depends on abstraction not details', icon: 'L' },
    { title: 'Simpler APIs', desc: 'Methods accept Train, work for all', icon: 'S' },
  ];
  const cardEnts = benefits.map((_, i) => useSpringEntrance(frame, 18 + i * 10));

  // Connector paths
  const connLen = 80;
  const connDashes = benefits.map((_, i) => usePathDraw(frame, 30 + i * 10, connLen, 18));

  const bottomCard = useSpringEntrance(frame, 56);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MOTIVATION" y={130} />
        </g>

        {/* Giant ghost ? */}
        <text x={540} y={620} textAnchor="middle" fontFamily={FONT} fontSize={420} fontWeight={800}
          fill={COLORS.accent} opacity={qGhost}>
          ?
        </text>

        {/* Hero question */}
        <g opacity={headEnt.opacity} transform={`translate(0, ${headEnt.translateY})`}>
          <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Why Is This
          </text>
          <text x={540} y={460} textAnchor="middle" fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Useful?
          </text>
        </g>

        {/* Animated ? */}
        <g opacity={qOp} transform={`scale(${qScale})`} style={{ transformOrigin: '540px 700px' }}>
          <text x={540} y={720} textAnchor="middle" fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={0.15 * shimmer}>
            ?
          </text>
        </g>

        {/* Benefit cards — 2×2 grid */}
        {benefits.map((b, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const cardX = 60 + col * 500;
          const cardY = 780 + row * 220;
          const ent = cardEnts[i];
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={cardX} y={cardY} w={460} h={200} accent={i === 0} />
              {/* Icon circle */}
              <circle cx={cardX + 50} cy={cardY + 60} r={28} fill={COLORS.accent} fillOpacity={0.12}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={cardX + 50} y={cardY + 68} textAnchor="middle" fontFamily={FONT}
                fontSize={28} fontWeight={800} fill={COLORS.accent}>
                {b.icon}
              </text>
              {/* Title */}
              <text x={cardX + 100} y={cardY + 68} fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.white}>
                {b.title}
              </text>
              {/* Divider */}
              <line x1={cardX + 20} y1={cardY + 100} x2={cardX + 440} y2={cardY + 100}
                stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              {/* Description */}
              <text x={cardX + 40} y={cardY + 145} fontFamily={FONT} fontSize={26} fontWeight={800}
                fill={COLORS.text_muted}>
                {b.desc}
              </text>
              {/* Small connector dot at bottom */}
              <circle cx={cardX + 230} cy={cardY + 200} r={4} fill={COLORS.accent} opacity={0.4} />
            </g>
          );
        })}

        {/* Vertical connectors between rows */}
        {[0, 1].map(col => {
          const x = 60 + col * 500 + 230;
          return (
            <path key={col} d={`M ${x},980 L ${x},1000`}
              fill="none" stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={connLen} strokeDashoffset={connDashes[col]}
              opacity={0.3} strokeLinecap="round" />
          );
        })}

        {/* Bottom insight card */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={160} accent />
          <rect x={60} y={1280} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1340} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Upcasting enables polymorphic design
          </text>
          <text x={100} y={1390} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            Write once, run for every subtype
          </text>
        </g>

        {/* Train silhouette at bottom */}
        <g opacity={bottomCard.opacity * 0.3} transform={`translate(0, ${breathe * 0.5})`}>
          {/* Rails */}
          <line x1={60} y1={1600} x2={1020} y2={1600} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={60} y1={1610} x2={1020} y2={1610} stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
          {/* Simple locomotive silhouette */}
          <rect x={350} y={1530} width={300} height={60} rx={8} fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1} />
          <rect x={580} y={1500} width={80} height={90} rx={6} fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={400} cy={1600} r={18} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={520} cy={1600} r={18} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={620} cy={1600} r={18} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
        </g>

        {/* Floating pulse */}
        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.2} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
