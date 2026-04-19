/**
 * Scene 20 — Each Branch Handles Its Own Type Safely
 * "Each branch handles its own type safely."
 * CSV: 55.960s → 58.320s | Duration: 99 frames
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline
 *   Phase 2 (12–60): Branch diagram with path draws
 *   Phase 3 (50–end): Pulse, breathe
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

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

const BRANCHES = [
  { type: 'ExpressTrain', method: 'activateExpressMode()', color: COLORS.accent },
  { type: 'MetroTrain', method: 'activateMetroMode()', color: COLORS.accent },
  { type: 'FreightTrain', method: 'loadCargo()', color: COLORS.text_muted },
];

export const Scene20_BranchSafety: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const rootE = useSpringEntrance(frame, 10);
  const branches = BRANCHES.map((_, i) => useSpringEntrance(frame, 16 + i * 10));
  const shieldE = useSpringEntrance(frame, 50);
  const summaryE = useSpringEntrance(frame, 55);

  const branchPaths = BRANCHES.map((_, i) => usePathDraw(frame, 18 + i * 10, 200, 18));
  const checkLen = 35;
  const checkDashes = BRANCHES.map((_, i) => usePathDraw(frame, 28 + i * 10, checkLen, 12));

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TYPE SAFETY · BRANCHING" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>Each Branch</text>
          <text x={60} y={395} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}>Handles Safely</text>
        </g>

        {/* Root node: Train t */}
        <g opacity={rootE.opacity} transform={`translate(0, ${rootE.translateY})`}>
          <BentoCard x={340} y={470} w={400} h={100} accent />
          <text x={540} y={530} textAnchor="middle" fontFamily={MONO} fontSize={32} fontWeight={500}
            fill={COLORS.accent}>Train t</text>
        </g>

        {/* Branch connectors and cards */}
        {BRANCHES.map((b, i) => {
          const cardX = 60 + i * 340;
          const cardY = 720;
          const startX = 540;
          const startY = 570;
          const endX = cardX + 160;
          const endY = cardY;
          const midY = (startY + endY) / 2;
          const pathD = `M ${startX},${startY} C ${startX},${midY} ${endX},${midY} ${endX},${endY}`;

          return (
            <g key={i}>
              {/* Connector path */}
              <path d={pathD} fill="none" stroke={b.color} strokeWidth={2}
                strokeDasharray={200} strokeDashoffset={branchPaths[i]}
                strokeLinecap="round" opacity={branches[i].opacity * 0.6} />

              {/* Branch card */}
              <g opacity={branches[i].opacity} transform={`translate(0, ${branches[i].translateY})`}>
                <BentoCard x={cardX} y={cardY} w={300} h={260} accent={i < 2} />
                <rect x={cardX} y={cardY} width={6} height={260} rx={3} fill={b.color} opacity={0.6} />

                {/* instanceof label */}
                <text x={cardX + 20} y={cardY + 45} fontFamily={FONT} fontSize={22} fontWeight={800}
                  fill={COLORS.text_muted}>instanceof</text>

                {/* Type */}
                <text x={cardX + 20} y={cardY + 90} fontFamily={FONT} fontSize={32} fontWeight={800}
                  fill={i < 2 ? COLORS.accent : COLORS.text_muted}>{b.type}</text>

                {/* Divider */}
                <line x1={cardX + 20} y1={cardY + 110} x2={cardX + 280} y2={cardY + 110}
                  stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

                {/* Method */}
                <text x={cardX + 20} y={cardY + 155} fontFamily={MONO} fontSize={22} fontWeight={500}
                  fill={COLORS.white}>{b.method}</text>

                {/* Checkmark */}
                <g transform={`translate(${cardX + 245}, ${cardY + 210})`}>
                  <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.1}
                    transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
                  <path d="M -8,2 L -3,8 L 8,-5" fill="none" stroke={b.color}
                    strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={checkLen} strokeDashoffset={checkDashes[i]} />
                </g>
              </g>
            </g>
          );
        })}

        {/* Shield */}
        <g opacity={shieldE.opacity} transform={`translate(540, ${1090 + shieldE.translateY})`}>
          <path d="M 0,-45 L 38,-26 L 38,14 Q 38,45 0,58 Q -38,45 -38,14 L -38,-26 Z"
            fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={2} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>SAFE</text>
        </g>

        {/* Summary */}
        <g opacity={summaryE.opacity} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={140} />
          <text x={540} y={1260} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>No branch runs without</text>
          <text x={540} y={1310} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>a confirmed type match</text>
        </g>

        {/* Flow dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={200 + i * 170} cy={1430 + Math.sin(frame * 0.04 + i) * breathe}
            r={3} fill={COLORS.accent} fillOpacity={0.08 + i * 0.02} />
        ))}

        {/* Corner accents */}
        <g opacity={0.3}>
          <path d="M 60,1560 L 60,1620 M 60,1560 L 120,1560" fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <path d="M 1020,1560 L 1020,1620 M 1020,1560 L 960,1560" fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
