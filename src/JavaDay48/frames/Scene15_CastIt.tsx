/**
 * Scene 15 — Cast It
 * "Cast it."
 * CSV: 46.020s → 47.280s | Duration: 38 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–25): Cast arrow + code
 *   Phase 3 (20–end): Pulse
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

export const Scene15_CastIt: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const parentE = useSpringEntrance(frame, 8);
  const arrowE = useSpringEntrance(frame, 12);
  const childE = useSpringEntrance(frame, 14);
  const codeE = useSpringEntrance(frame, 16);
  const noteE = useSpringEntrance(frame, 20);
  const safeE = useSpringEntrance(frame, 22);

  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 12, arrowLen, 14);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="DOWNCAST · SAFE" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.white}>Cast It</text>
          <text x={540} y={430} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent}>instanceof verified — safe to proceed</text>
        </g>

        {/* Parent type box */}
        <g opacity={parentE.opacity} transform={`translate(0, ${parentE.translateY})`}>
          <BentoCard x={140} y={540} w={340} h={140} />
          <text x={310} y={620} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>Train t</text>
          <text x={310} y={660} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Parent ref</text>
        </g>

        {/* Arrow */}
        <line x1={490} y1={610} x2={600} y2={610}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={arrowE.opacity} />
        <text x={545} y={595} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
          fill={COLORS.accent} opacity={arrowE.opacity}>(cast)</text>

        {/* Child type box */}
        <g opacity={childE.opacity} transform={`translate(0, ${childE.translateY})`}>
          <BentoCard x={610} y={540} w={340} h={140} accent />
          <text x={780} y={620} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent}>ExpressTrain e</text>
          <text x={780} y={660} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>Child ref</text>
        </g>

        {/* Code */}
        <g opacity={codeE.opacity} transform={`translate(0, ${codeE.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={220} accent />
          <rect x={60} y={740} width={6} height={220} rx={3} fill={COLORS.accent} />
          <text x={100} y={810} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.accent}>
            {'// Safe — instanceof returned true'}
          </text>
          <text x={100} y={860} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.white}>
            {'ExpressTrain e ='}
          </text>
          <text x={100} y={910} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.white}>
            {'    (ExpressTrain) t;'}
          </text>
        </g>

        {/* Safe shield */}
        <g opacity={safeE.opacity} transform={`translate(540, ${1100 + safeE.translateY})`}>
          <g transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>
            <path d="M 0,-60 L 50,-35 L 50,20 Q 50,60 0,80 Q -50,60 -50,20 L -50,-35 Z"
              fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -15,10 L -5,22 L 20,-8" fill="none" stroke={COLORS.accent}
              strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* Note */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={140} />
          <text x={540} y={1310} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Now</text>
          <text x={540} y={1355} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>e</text>
          <text x={570} y={1355} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}> holds the exact same object as</text>
          <text x={930} y={1355} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}> t</text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={300 + i * 240} cy={1500 + Math.sin(frame * 0.05 + i) * breathe}
            r={4} fill={COLORS.accent} fillOpacity={0.1} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
