/**
 * Scene 03 — Static Block Intro
 * "Today, we learn the static block."
 * CSV: 13.720s → 16.460s | Duration: 82 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label spring
 *   Phase 2 (12–50): Hero text "STATIC BLOCK" with per-word spring
 *   Phase 3 (40–end): Glow pulse on title, floating particles
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene03_StaticBlockIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);

  // Phase 2 — hero words
  const words = ['STATIC', 'BLOCK'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - 10 - i * 10);
    const sp = spring({ frame: f, fps: FPS, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [48, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  // Subtitle
  const subE = useSpringEntrance(frame, 28);

  // Phase 2 — supporting cards
  const card1 = useSpringEntrance(frame, 32);
  const card2 = useSpringEntrance(frame, 44);

  // Phase 3
  const breathe = Math.sin(frame * 0.07) * 5;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.7, 1]);

  // Ghost text
  const ghostOp = interpolate(frame, [20, 40], [0, 0.06], { extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />
        <CornerAccents opacity={labelE.opacity * 0.4} />

        {/* Zone A */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="MODULE 2 · TODAY'S TOPIC" y={140} />
        </g>

        {/* Ghost text behind hero */}
        <text x={540} y={780} textAnchor="middle" fontFamily={FONT} fontSize={200} fontWeight={800}
          fill={COLORS.accent} opacity={ghostOp}>STATIC</text>

        {/* Zone B — Hero words */}
        {words.map((word, i) => (
          <g key={i} opacity={wordSprings[i].op} transform={`translate(0, ${wordSprings[i].ty})`}>
            <text x={540} y={680 + i * 160} textAnchor="middle"
              fontFamily={FONT} fontSize={140} fontWeight={800}
              fill={i === 0 ? COLORS.white : COLORS.accent}>
              {word}
            </text>
          </g>
        ))}

        {/* Subtitle */}
        <g opacity={subE.opacity} transform={`translate(0, ${subE.translateY})`}>
          <text x={540} y={1020} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted} fontStyle="italic">
            Class-level initialization that runs once
          </text>
        </g>

        {/* Supporting cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1100} w={460} h={200} accent />
          <text x={100} y={1170} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>Runs Once</text>
          <text x={100} y={1220} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            When JVM loads class
          </text>
          <text x={100} y={1260} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            into memory
          </text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1100} w={460} h={200} />
          <text x={600} y={1170} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>No Object</text>
          <text x={600} y={1220} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Executes before any
          </text>
          <text x={600} y={1260} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            constructor call
          </text>
        </g>

        {/* Floating accent */}
        <g transform={`translate(540, ${1460 + breathe})`} opacity={shimmer}>
          <circle r={48} fill={COLORS.accent} fillOpacity={0.06} />
          <circle r={48} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.4} />
        </g>

        {/* Small floating particles */}
        {[{ x: 200, y: 1550, d: 0 }, { x: 860, y: 1520, d: 1.5 }, { x: 540, y: 1600, d: 3 }].map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y + Math.sin(frame * 0.05 + pt.d) * 8}
            r={6} fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
