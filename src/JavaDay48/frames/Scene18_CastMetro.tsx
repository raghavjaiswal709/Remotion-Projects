/**
 * Scene 18 — Cast It (Metro)
 * "Cast it."
 * CSV: 52.020s → 53.280s | Duration: 38 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–25): Cast visual
 *   Phase 3 (20–end): Pulse
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

export const Scene18_CastMetro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const parentE = useSpringEntrance(frame, 8);
  const arrowE = useSpringEntrance(frame, 11);
  const childE = useSpringEntrance(frame, 13);
  const codeE = useSpringEntrance(frame, 15);
  const shieldE = useSpringEntrance(frame, 18);
  const noteE = useSpringEntrance(frame, 20);

  const arrowLen = 180;
  const arrowDash = usePathDraw(frame, 11, arrowLen, 12);
  const checkLen = 40;
  const checkDash = usePathDraw(frame, 18, checkLen, 12);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="DOWNCAST · METRO" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontSize={110} fontWeight={800}
            fill={COLORS.white}>Cast It</text>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>Metro branch — safe downcast</text>
        </g>

        {/* Parent ref */}
        <g opacity={parentE.opacity} transform={`translate(0, ${parentE.translateY})`}>
          <BentoCard x={140} y={510} w={340} h={130} />
          <text x={310} y={585} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>Train t</text>
          <text x={310} y={620} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>Parent ref</text>
        </g>

        {/* Arrow */}
        <line x1={490} y1={575} x2={600} y2={575}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={arrowE.opacity} />
        <text x={545} y={560} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.accent} opacity={arrowE.opacity}>(cast)</text>

        {/* Child ref */}
        <g opacity={childE.opacity} transform={`translate(0, ${childE.translateY})`}>
          <BentoCard x={610} y={510} w={340} h={130} accent />
          <text x={780} y={585} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>MetroTrain m</text>
          <text x={780} y={620} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>Child ref</text>
        </g>

        {/* Code */}
        <g opacity={codeE.opacity} transform={`translate(0, ${codeE.translateY})`}>
          <BentoCard x={60} y={700} w={960} h={180} accent />
          <rect x={60} y={700} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={770} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.accent}>
            {'// instanceof confirmed — safe'}
          </text>
          <text x={100} y={820} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.white}>
            {'MetroTrain m = (MetroTrain) t;'}
          </text>
          <text x={100} y={860} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            {'m.activateMetroMode();'}
          </text>
        </g>

        {/* Shield */}
        <g opacity={shieldE.opacity} transform={`translate(540, ${1020 + shieldE.translateY})`}>
          <g transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>
            <path d="M 0,-55 L 45,-32 L 45,18 Q 45,55 0,72 Q -45,55 -45,18 L -45,-32 Z"
              fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -12,8 L -4,20 L 14,-8" fill="none" stroke={COLORS.accent}
              strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          </g>
        </g>

        {/* Comparison */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={140} />
          <text x={290} y={1200} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Branch 1</text>
          <text x={290} y={1240} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>ExpressTrain e</text>

          <BentoCard x={560} y={1140} w={460} h={140} accent />
          <text x={790} y={1200} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Branch 2</text>
          <text x={790} y={1240} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.accent}>MetroTrain m</text>
        </g>

        {/* Summary */}
        <g opacity={noteE.opacity}>
          <BentoCard x={60} y={1330} w={960} h={100} />
          <text x={540} y={1390} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Same pattern — different types —</text>
          <text x={540} y={1420} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>always safe</text>
        </g>

        {[0, 1, 2].map(i => (
          <circle key={i} cx={300 + i * 240} cy={1530 + Math.sin(frame * 0.05 + i) * breathe}
            r={3} fill={COLORS.accent} fillOpacity={0.1} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
