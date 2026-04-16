/**
 * Scene 21 — ActingOnWorld
 * "Acting on the world, receiving what the world says back, acting again."
 * CSV: 58.380s → 62.620s
 * Duration: 127 frames (4.2s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline reveal
 *   Phase 2 (14–80): AGENT ↔ WORLD bidirectional flow diagram
 *   Phase 3 (70–end): micro — traveling signals, pulse
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

export const Scene21_ActingOnWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1Ent = useSpringEntrance(frame, 4);
  const h2Ent = useSpringEntrance(frame, 10);

  // Agent box (left)
  const agentEnt = useSpringEntrance(frame, 16);
  // World box (right)
  const worldEnt = useSpringEntrance(frame, 22);

  // Arrows
  const actArrowLen = 300;
  const actDash = usePathDraw(frame, 28, actArrowLen, 20);
  const receiveArrowLen = 300;
  const receiveDash = usePathDraw(frame, 34, receiveArrowLen, 20);
  const actAgainLen = 300;
  const actAgainDash = usePathDraw(frame, 42, actAgainLen, 20);

  // Labels for arrows
  const arrowLabels = [
    { text: 'ACT', y: 760, delay: 32 },
    { text: 'RECEIVE', y: 880, delay: 38 },
    { text: 'ACT AGAIN', y: 1000, delay: 46 },
  ];
  const arrowLabelEnts = arrowLabels.map(a => useSpringEntrance(frame, a.delay));

  // Cards
  const card1 = useSpringEntrance(frame, 54);
  const card2 = useSpringEntrance(frame, 62);
  const card3 = useSpringEntrance(frame, 70);

  // Traveling signals
  const signal1T = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const signal2T = interpolate(frame, [60, 80], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const signal3T = interpolate(frame, [74, 94], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Agent box coords
  const AX = 120, AY = 680, AW = 300, AH = 380;
  // World box coords
  const WX = 660, WY = 680, WW = 300, WH = 380;
  // Arrow x coords
  const aRight = AX + AW;
  const wLeft = WX;
  const mid = (aRight + wLeft) / 2;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        {/* Headline */}
        {['Acting on', 'the World'].map((w, i) => {
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

        <g opacity={h2Ent.opacity} transform={`translate(0, ${h2Ent.translateY})`}>
          <text x={60} y={490} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>Bidirectional interaction</text>
        </g>

        {/* AGENT box */}
        <g opacity={agentEnt.opacity} transform={`translate(0, ${agentEnt.translateY})`}>
          <rect x={AX} y={AY} width={AW} height={AH} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Robot head */}
          <rect x={AX + 100} y={AY + 40} width={100} height={80} rx={12}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={AX + 130} cy={AY + 75} r={8} fill={COLORS.accent} />
          <circle cx={AX + 170} cy={AY + 75} r={8} fill={COLORS.accent} />
          <line x1={AX + 120} y1={AY + 95} x2={AX + 180} y2={AY + 95}
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Antenna */}
          <line x1={AX + 150} y1={AY + 40} x2={AX + 150} y2={AY + 20}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={AX + 150} cy={AY + 16} r={4} fill={COLORS.accent} />
          {/* Body */}
          <rect x={AX + 110} y={AY + 130} width={80} height={100} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Circuitry */}
          <line x1={AX + 130} y1={AY + 150} x2={AX + 130} y2={AY + 210}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
          <line x1={AX + 170} y1={AY + 160} x2={AX + 170} y2={AY + 200}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
          <text x={AX + AW / 2} y={AY + 280} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>AGENT</text>
          <text x={AX + AW / 2} y={AY + 320} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>Acts & Adapts</text>
          {/* Pulsing outline */}
          <rect x={AX} y={AY} width={AW} height={AH} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.08 * pulse} transform={`scale(${pulse})`}
            style={{ transformOrigin: `${AX + AW / 2}px ${AY + AH / 2}px` }} />
        </g>

        {/* WORLD box */}
        <g opacity={worldEnt.opacity} transform={`translate(0, ${worldEnt.translateY})`}>
          <rect x={WX} y={WY} width={WW} height={WH} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          {/* Globe */}
          <circle cx={WX + WW / 2} cy={WY + 90} r={50} fill="none"
            stroke={COLORS.white} strokeWidth={1.5} opacity={0.5} />
          <ellipse cx={WX + WW / 2} cy={WY + 90} rx={50} ry={20}
            fill="none" stroke={COLORS.white} strokeWidth={1} opacity={0.3} />
          <ellipse cx={WX + WW / 2} cy={WY + 90} rx={20} ry={50}
            fill="none" stroke={COLORS.white} strokeWidth={1} opacity={0.3} />
          {/* API, DB, Files labels */}
          {['API', 'DB', 'Files'].map((t, i) => (
            <text key={i} x={WX + 30 + i * 100} y={WY + 200}
              fontFamily={FONT} fontSize={20} fontWeight={800}
              fill={COLORS.text_muted}>{t}</text>
          ))}
          <text x={WX + WW / 2} y={WY + 280} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>WORLD</text>
          <text x={WX + WW / 2} y={WY + 320} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>Responds</text>
        </g>

        {/* Arrow 1: ACT → (top) */}
        <path d={`M ${aRight + 10},${AY + 80} L ${wLeft - 10},${WY + 80}`}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={actArrowLen} strokeDashoffset={actDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Arrow 2: ← RECEIVE (middle) */}
        <path d={`M ${wLeft - 10},${WY + 190} L ${aRight + 10},${AY + 190}`}
          fill="none" stroke={COLORS.white} strokeWidth={2} opacity={0.6}
          strokeDasharray={receiveArrowLen} strokeDashoffset={receiveDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Arrow 3: ACT AGAIN → (bottom) */}
        <path d={`M ${aRight + 10},${AY + 300} L ${wLeft - 10},${WY + 300}`}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={actAgainLen} strokeDashoffset={actAgainDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Arrow labels */}
        {arrowLabels.map((a, i) => (
          <text key={i} x={mid} y={AY + 70 + i * 110} textAnchor="middle" opacity={arrowLabelEnts[i].opacity}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={i === 1 ? COLORS.white : COLORS.accent}>{a.text}</text>
        ))}

        {/* Traveling signal dots */}
        {[{ t: signal1T, y: AY + 80, c: COLORS.accent }, { t: signal2T, y: WY + 190, c: COLORS.white }, { t: signal3T, y: AY + 300, c: COLORS.accent }]
          .map((s, i) => {
            const sx = aRight + 10 + s.t * (wLeft - aRight - 20);
            const signalOp = Math.min(1, Math.min(s.t, 1 - s.t) * 5);
            return (
              <g key={i} opacity={signalOp * 0.8}>
                <circle cx={sx} cy={s.y} r={5} fill={s.c} />
                <circle cx={sx} cy={s.y} r={12} fill={s.c} opacity={0.15} />
              </g>
            );
          })}

        {/* Summary cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1160} w={300} h={120} accent />
          <rect x={60} y={1160} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1210} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>ACT</text>
          <text x={100} y={1244} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>Send action</text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={390} y={1160} w={300} h={120} />
          <rect x={390} y={1160} width={6} height={120} rx={3} fill={COLORS.white} />
          <text x={430} y={1210} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.white}>RECEIVE</text>
          <text x={430} y={1244} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>World responds</text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={720} y={1160} w={300} h={120} accent />
          <rect x={720} y={1160} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={760} y={1210} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>ACT AGAIN</text>
          <text x={760} y={1244} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>Iterate</text>
        </g>

        {/* Bottom summary */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={100} />
          <text x={540} y={1383} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The agent is <tspan fill={COLORS.accent} fontStyle="italic">interactive</tspan> — not passive
          </text>
        </g>

        {/* Floating particles */}
        {Array.from({ length: 6 }, (_, i) => {
          const px = 100 + i * 160;
          const py = 1540 + breathe * (i % 2 === 0 ? 1 : -1);
          return <circle key={i} cx={px} cy={py} r={2} fill={COLORS.accent} opacity={0.06 * shimmer} />;
        })}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
