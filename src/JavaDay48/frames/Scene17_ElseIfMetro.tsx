/**
 * Scene 17 — Else If T instanceof MetroTrain
 * "Else if T instance of Metro Train."
 * CSV: 49.720s → 52.020s | Duration: 69 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (15–45): Code + metro illustration
 *   Phase 3 (40–end): Pulse, float
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

export const Scene17_ElseIfMetro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const codeE = useSpringEntrance(frame, 10);
  const metroE = useSpringEntrance(frame, 18);
  const branchE = useSpringEntrance(frame, 26);
  const noteE = useSpringEntrance(frame, 34);
  const trainE = useSpringEntrance(frame, 22);

  const underLen = 260;
  const underDash = usePathDraw(frame, 14, underLen, 18);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="INSTANCEOF · SECOND BRANCH" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Else If
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            MetroTrain branch
          </text>
        </g>

        {/* Code block */}
        <g opacity={codeE.opacity} transform={`translate(0, ${codeE.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={200} accent />
          <rect x={60} y={460} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={530} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            {'} '}
          </text>
          <text x={130} y={530} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.accent}>
            {'else if'}
          </text>
          <text x={300} y={530} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.white}>
            {'(t'}
          </text>
          <text x={345} y={530} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.accent}
            fontStyle="italic">
            {' instanceof'}
          </text>
          <text x={565} y={530} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.white}>
            {' MetroTrain) {'}
          </text>
          {/* Underline on instanceof MetroTrain */}
          <line x1={345} y1={540} x2={750} y2={540}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
            strokeDasharray={underLen} strokeDashoffset={underDash} />
          <text x={140} y={590} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            {'MetroTrain m = (MetroTrain) t;'}
          </text>
          <text x={140} y={630} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            {'m.activateMetroMode();'}
          </text>
        </g>

        {/* Metro train illustration */}
        <g opacity={trainE.opacity} transform={`translate(0, ${trainE.translateY})`}>
          <BentoCard x={60} y={710} w={960} h={300} />
          <g transform={`translate(${280 + breathe * 2}, 770)`}>
            {/* Metro body — sleek, rounded */}
            <rect x={0} y={30} width={440} height={90} rx={30} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Windows */}
            {[0, 1, 2, 3, 4].map(i => (
              <rect key={i} x={40 + i * 82} y={48} width={52} height={36} rx={6}
                fill={COLORS.accent} fillOpacity={0.08}
                stroke={COLORS.accent} strokeWidth={1} />
            ))}
            {/* Doors */}
            <rect x={120} y={44} width={30} height={60} rx={3}
              fill={COLORS.accent} fillOpacity={0.2} stroke={COLORS.accent} strokeWidth={1.5} />
            <rect x={300} y={44} width={30} height={60} rx={3}
              fill={COLORS.accent} fillOpacity={0.2} stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Wheels */}
            <circle cx={80} cy={128} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={180} cy={128} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={280} cy={128} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={380} cy={128} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            {/* Track */}
            <line x1={-60} y1={144} x2={520} y2={144} stroke={COLORS.text_muted} strokeWidth={2} />
            <line x1={-60} y1={150} x2={520} y2={150} stroke={COLORS.text_muted} strokeWidth={2} />
            {/* Cross-ties */}
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x={-40 + i * 48} y={144} width={18} height={8} rx={1}
                fill={COLORS.text_muted} fillOpacity={0.3} />
            ))}
            {/* Label */}
            <text x={220} y={85} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.accent}>METRO</text>
          </g>
        </g>

        {/* Branch comparison */}
        <g opacity={branchE.opacity} transform={`translate(0, ${branchE.translateY})`}>
          <BentoCard x={60} y={1060} w={460} h={160} />
          <text x={290} y={1120} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Branch 1</text>
          <text x={290} y={1165} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>ExpressTrain</text>

          <BentoCard x={560} y={1060} w={460} h={160} accent />
          <text x={790} y={1120} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Branch 2</text>
          <text x={790} y={1165} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>MetroTrain</text>
          <g transform={`translate(790, 1190) scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>
            <text textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent}>← current</text>
          </g>
        </g>

        {/* Note */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1270} w={960} h={120} />
          <text x={540} y={1340} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>Each type gets its own
          </text>
          <text x={540} y={1378} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">safe, checked branch</text>
        </g>

        {/* Floating accents */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={120 + i * 210} cy={1500 + Math.sin(frame * 0.04 + i * 0.9) * breathe}
            r={3} fill={COLORS.accent} fillOpacity={0.12} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
