/**
 * Scene 21 — The Compiler Does
 * "The compiler does."
 * CSV: 77.160s → 78.080s
 * Duration: ~60 frames (short phrase, enforced minimum)
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + dramatic headline
 *   Phase 2 (15–40): Giant compiler gear illustration
 *   Phase 3 (35–end): Gear rotates, pulse
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

export const Scene21_CompilerDoes: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const gearEnt = useSpringEntrance(frame, 12);
  const tagEnt = useSpringEntrance(frame, 20);
  const cardEnt = useSpringEntrance(frame, 28);

  const gearRotation = interpolate(frame, [0, 120], [0, 45], { extrapolateRight: 'clamp' });

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  const R = 200;
  const TEETH = 10;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="COMPILE TIME · POLYMORPHISM" y={160} opacity={0.8} />
        </g>

        {/* Dramatic single-word headline */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={360} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800} fill={COLORS.white}>
            The Compiler
          </text>
          <text x={540} y={480} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800} fill={COLORS.accent}>
            Does.
          </text>
        </g>

        {/* Giant gear */}
        <g opacity={gearEnt.opacity}
          transform={`translate(540, 900) rotate(${gearRotation})`}
          style={{ transformOrigin: '0px 0px' }}>

          {/* Outer ring */}
          <circle cx={0} cy={0} r={R} fill="none"
            stroke={COLORS.accent} strokeWidth={4} opacity={0.3} />

          {/* Teeth */}
          {Array.from({ length: TEETH }, (_, i) => {
            const angle = (i * 360) / TEETH;
            return (
              <rect key={i} x={-12} y={-R - 24} width={24} height={36} rx={4}
                fill={COLORS.accent} opacity={0.25}
                transform={`rotate(${angle})`}
                style={{ transformOrigin: '0px 0px' }} />
            );
          })}

          {/* Inner circle */}
          <circle cx={0} cy={0} r={R * 0.55}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />

          {/* Center hub */}
          <circle cx={0} cy={0} r={24}
            fill={COLORS.accent} opacity={0.12} />
          <circle cx={0} cy={0} r={8}
            fill={COLORS.accent} opacity={0.5} />

          {/* Inner spokes */}
          {Array.from({ length: 4 }, (_, i) => {
            const angle = (i * 90) * (Math.PI / 180);
            return (
              <line key={i}
                x1={Math.cos(angle) * 24} y1={Math.sin(angle) * 24}
                x2={Math.cos(angle) * R * 0.5} y2={Math.sin(angle) * R * 0.5}
                stroke={COLORS.accent} strokeWidth={2} opacity={0.2} />
            );
          })}

          {/* Label inside gear */}
          <text x={0} y={8} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}
            transform={`rotate(${-gearRotation})`}
            style={{ transformOrigin: '0px 0px' }}>
            javac
          </text>
        </g>

        {/* Tag */}
        <g opacity={tagEnt.opacity} transform={`translate(0, ${tagEnt.translateY})`}>
          <rect x={370} y={1160} width={340} height={50} rx={14}
            fill={COLORS.accent} opacity={0.15} />
          <text x={540} y={1193} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            OVERLOAD RESOLUTION
          </text>
        </g>

        {/* Bottom card */}
        <g opacity={cardEnt.opacity} transform={`translate(0, ${cardEnt.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={180} accent />
          <text x={540} y={1365} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Method selection happens in the
          </text>
          <text x={540} y={1415} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            compiler — not in the JVM
          </text>
        </g>

        {/* Track */}
        <line x1={60} y1={1580} x2={1020} y2={1580}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1596} x2={1020} y2={1596}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {/* Ties */}
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={100 + i * 80} y={1573} width={30} height={30}
            fill="rgba(255,255,255,0.02)" rx={2} />
        ))}

        {/* Floating pulse */}
        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={12} fill={COLORS.accent} fillOpacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
