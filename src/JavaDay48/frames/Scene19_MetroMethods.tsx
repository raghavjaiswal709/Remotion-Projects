/**
 * Scene 19 — Access Metro Specific Methods
 * "Access Metro specific methods."
 * CSV: 53.800s → 55.260s | Duration: 65 frames
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline spring
 *   Phase 2 (10–40): Method cards stagger
 *   Phase 3 (35–end): Micro-animations
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

const METHODS = [
  { name: 'activateMetroMode()', desc: 'Switches to metro scheduling' },
  { name: 'getStopSequence()', desc: 'Returns ordered station list' },
  { name: 'enableAutoAnnounce()', desc: 'Enables automated PA system' },
  { name: 'getFrequencyMins()', desc: 'Returns headway interval' },
];

export const Scene19_MetroMethods: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const refE = useSpringEntrance(frame, 8);
  const cards = METHODS.map((_, i) => useSpringEntrance(frame, 12 + i * 6));
  const noteE = useSpringEntrance(frame, 38);

  const connLen = 80;
  const connDashes = METHODS.map((_, i) => usePathDraw(frame, 14 + i * 6, connLen, 12));

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="METRO · METHODS" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>Metro</text>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>Methods</text>
        </g>

        {/* Object ref */}
        <g opacity={refE.opacity} transform={`translate(0, ${refE.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={100} accent />
          <text x={540} y={545} textAnchor="middle" fontFamily={MONO} fontSize={30} fontWeight={500}
            fill={COLORS.accent}>MetroTrain m = (MetroTrain) t;</text>
        </g>

        {/* Method cards */}
        {METHODS.map((m, i) => {
          const y = 640 + i * 170;
          return (
            <g key={i} opacity={cards[i].opacity} transform={`translate(0, ${cards[i].translateY})`}>
              {/* Connector from ref card */}
              <line x1={540} y1={580} x2={540} y2={y}
                stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray={connLen}
                strokeDashoffset={connDashes[i]} opacity={0.3} />

              <BentoCard x={100} y={y} w={880} h={140} accent={i === 0} />
              <rect x={100} y={y} width={6} height={140} rx={3} fill={COLORS.accent} opacity={i === 0 ? 1 : 0.4} />
              <text x={145} y={y + 55} fontFamily={MONO} fontSize={28} fontWeight={500}
                fill={i === 0 ? COLORS.accent : COLORS.white}>m.{m.name}</text>
              <text x={145} y={y + 100} fontFamily={FONT} fontSize={26} fontWeight={800}
                fill={COLORS.text_muted}>{m.desc}</text>
              {/* Dot */}
              <circle cx={930} cy={y + 70} r={5} fill={COLORS.accent} fillOpacity={0.3}
                transform={`scale(${i === 0 ? pulse : 1})`} style={{ transformOrigin: '930px ' + (y + 70) + 'px' }} />
            </g>
          );
        })}

        {/* Note */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={100} />
          <text x={540} y={1400} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>Only available on</text>
          <text x={540} y={1430} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent}>MetroTrain — not on Train</text>
        </g>

        {/* Metro train icon */}
        <g opacity={noteE.opacity} transform={`translate(540, ${1580 + breathe})`}>
          <rect x={-80} y={-30} width={160} height={50} rx={10} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <rect x={-65} y={-20} width={30} height={20} rx={4} fill={COLORS.accent} fillOpacity={0.2} />
          <rect x={-25} y={-20} width={30} height={20} rx={4} fill={COLORS.accent} fillOpacity={0.2} />
          <rect x={15} y={-20} width={30} height={20} rx={4} fill={COLORS.accent} fillOpacity={0.2} />
          <circle cx={-40} cy={28} r={8} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={40} cy={28} r={8} fill={COLORS.accent} fillOpacity={0.3} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
