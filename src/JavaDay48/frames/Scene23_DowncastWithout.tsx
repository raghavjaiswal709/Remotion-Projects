/**
 * Scene 23 — Downcast Without It
 * "Downcast without it,"
 * CSV: 68.220s → 69.340s | Duration: 63 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–35): Warning visual
 *   Phase 3 (30–end): Pulse, danger
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

export const Scene23_DowncastWithout: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const crossE = useSpringEntrance(frame, 10);
  const codeE = useSpringEntrance(frame, 15);
  const warningE = useSpringEntrance(frame, 22);
  const noteE = useSpringEntrance(frame, 28);

  const crossLen = 120;
  const crossDash = usePathDraw(frame, 12, crossLen, 14);

  const dangPulse = 1 + Math.sin(frame * 0.12) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="WARNING · NO CHECK" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={320} textAnchor="middle" fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.white}>Downcast</text>
          <text x={540} y={430} textAnchor="middle" fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.vibrant_red}>Without It</text>
        </g>

        {/* Big X */}
        <g opacity={crossE.opacity} transform={`translate(540, 600)`}>
          <circle cx={0} cy={0} r={80} fill={COLORS.vibrant_red} fillOpacity={0.08}
            transform={`scale(${dangPulse})`} style={{ transformOrigin: '0px 0px' }} />
          <path d="M -35,-35 L 35,35" fill="none" stroke={COLORS.vibrant_red} strokeWidth={6}
            strokeLinecap="round" strokeDasharray={crossLen} strokeDashoffset={crossDash} />
          <path d="M 35,-35 L -35,35" fill="none" stroke={COLORS.vibrant_red} strokeWidth={6}
            strokeLinecap="round" strokeDasharray={crossLen} strokeDashoffset={crossDash} />
        </g>

        {/* Unsafe code */}
        <g opacity={codeE.opacity} transform={`translate(0, ${codeE.translateY})`}>
          <BentoCard x={60} y={730} w={960} h={180} />
          <rect x={60} y={730} width={6} height={180} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={800} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.vibrant_red}>
            {'// No instanceof check!'}
          </text>
          <text x={100} y={850} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.white}>
            {'ExpressTrain e = (ExpressTrain) t;'}
          </text>
          <text x={100} y={890} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.text_muted}>
            {'// What if t is actually a MetroTrain?'}
          </text>
        </g>

        {/* Warning card */}
        <g opacity={warningE.opacity} transform={`translate(0, ${warningE.translateY})`}>
          <BentoCard x={60} y={970} w={960} h={200} accent />
          <text x={540} y={1040} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.vibrant_red}>ClassCastException</text>
          <text x={540} y={1098} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>Runtime crash — system down</text>
          <text x={540} y={1145} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>No warning at compile time</text>
        </g>

        {/* Note */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1230} w={960} h={120} />
          <text x={540} y={1300} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>The compiler doesn't catch it.</text>
          <text x={540} y={1340} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.vibrant_red}>Only instanceof does.</text>
        </g>

        {/* Danger dots */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={300 + i * 240} cy={1470 + Math.sin(frame * 0.07 + i) * breathe}
            r={4} fill={COLORS.vibrant_red} fillOpacity={0.1} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s23.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
