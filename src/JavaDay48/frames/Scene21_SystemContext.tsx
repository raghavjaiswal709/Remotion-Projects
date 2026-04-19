/**
 * Scene 21 — System Context
 * "In any system where apparent reference might hold different child types,"
 * CSV: 58.920s → 62.820s | Duration: 106 frames
 *
 * Animation phases:
 *   Phase 1 (0–18): Label + headline
 *   Phase 2 (14–65): System diagram
 *   Phase 3 (55–end): Pulse, breathe
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

const CHILD_TYPES = [
  'ExpressTrain', 'MetroTrain', 'FreightTrain', 'CargoTrain', 'BulletTrain'
];

export const Scene21_SystemContext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const parentE = useSpringEntrance(frame, 12);
  const children = CHILD_TYPES.map((_, i) => useSpringEntrance(frame, 18 + i * 8));
  const questionE = useSpringEntrance(frame, 60);
  const noteE = useSpringEntrance(frame, 68);

  const fanPaths = CHILD_TYPES.map((_, i) => usePathDraw(frame, 20 + i * 8, 160, 14));

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="POLYMORPHISM · REAL SYSTEMS" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Any System Where
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            References Hold
          </text>
          <text x={60} y={460} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Different Types
          </text>
        </g>

        {/* Parent node */}
        <g opacity={parentE.opacity} transform={`translate(0, ${parentE.translateY})`}>
          <BentoCard x={340} y={520} w={400} h={90} accent />
          <text x={540} y={575} textAnchor="middle" fontFamily={MONO} fontSize={32} fontWeight={500}
            fill={COLORS.accent}>Train t</text>
        </g>

        {/* Fan-out lines + child types */}
        {CHILD_TYPES.map((type, i) => {
          const endX = 120 + i * 210;
          const endY = 740;
          return (
            <g key={i}>
              <path d={`M 540,610 Q ${endX + 40},${660} ${endX + 40},${endY}`}
                fill="none" stroke={COLORS.accent} strokeWidth={1.5}
                strokeDasharray={160} strokeDashoffset={fanPaths[i]}
                strokeLinecap="round" opacity={children[i].opacity * 0.4} />
              <g opacity={children[i].opacity} transform={`translate(0, ${children[i].translateY})`}>
                <rect x={endX - 20} y={endY} width={120} height={80} rx={12}
                  fill={COLORS.bg_secondary} stroke={i < 2 ? COLORS.accent : 'rgba(255,255,255,0.1)'}
                  strokeWidth={i < 2 ? 2 : 1} />
                <text x={endX + 40} y={endY + 48} textAnchor="middle"
                  fontFamily={FONT} fontSize={18} fontWeight={800}
                  fill={i < 2 ? COLORS.accent : COLORS.text_muted}>{type.replace('Train', '')}</text>
                <text x={endX + 40} y={endY + 68} textAnchor="middle"
                  fontFamily={FONT} fontSize={14} fontWeight={800}
                  fill={COLORS.text_muted}>Train</text>
              </g>
            </g>
          );
        })}

        {/* Question mark */}
        <g opacity={questionE.opacity} transform={`translate(540, ${920 + questionE.translateY})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.15}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>?</text>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.white}>?</text>
        </g>

        {/* Question text */}
        <g opacity={questionE.opacity} transform={`translate(0, ${questionE.translateY})`}>
          <BentoCard x={60} y={1000} w={960} h={140} accent />
          <text x={540} y={1060} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>Which child type does</text>
          <text x={540} y={1108} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>this reference actually hold?</text>
        </g>

        {/* Answer */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={260} />
          <rect x={60} y={1200} width={6} height={260} rx={3} fill={COLORS.accent} />
          <text x={100} y={1260} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            You can never be sure at compile time.
          </text>
          <text x={100} y={1310} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            The parent reference hides the runtime type.
          </text>
          <text x={100} y={1370} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            instanceof reveals it before you cast.
          </text>
          <text x={100} y={1420} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Without this check, every cast is a gamble.
          </text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={250 + i * 280} cy={1560 + Math.sin(frame * 0.05 + i) * breathe}
            r={3} fill={COLORS.accent} fillOpacity={0.1} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
