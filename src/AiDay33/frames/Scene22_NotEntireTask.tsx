/**
 * Scene 22 — Not Entire Task
 * "Not the entire task from the beginning."
 * CSV: 69.900s → 72.840s
 * Duration: 88 frames (2.93s)
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene22_NotEntireTask: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const wrongCard = useSpringEntrance(frame, 18);
  const rightCard = useSpringEntrance(frame, 34);
  const breathe = Math.sin(frame * 0.06) * 3;

  // Strikethrough on wrong approach
  const strikeW = interpolate(frame, [28, 40], [0, 860], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RETRY · SCOPE" y={160} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Not From
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.vibrant_red}>
            The Beginning
          </text>
        </g>

        {/* Wrong approach — strikethrough */}
        <g opacity={wrongCard.opacity} transform={`translate(0, ${wrongCard.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={280} />
          <text x={100} y={580} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            WRONG APPROACH
          </text>
          {/* Step chain 1→2→...→17→FAIL→1→2→... */}
          {[1, 2, 3, '...', 17, 'X'].map((s, i) => {
            const cx = 130 + i * 130;
            return (
              <g key={i}>
                <circle cx={cx} cy={700} r={36}
                  fill="rgba(255,255,255,0.05)"
                  stroke={s === 'X' ? COLORS.vibrant_red : 'rgba(255,255,255,0.15)'}
                  strokeWidth={2} />
                <text x={cx} y={710} textAnchor="middle" fontFamily={FONT}
                  fontSize={28} fontWeight={800}
                  fill={s === 'X' ? COLORS.vibrant_red : COLORS.text_muted}>
                  {s}
                </text>
                {i < 5 && (
                  <line x1={cx + 36} y1={700} x2={cx + 130 - 36} y2={700}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                )}
              </g>
            );
          })}
          {/* Strikethrough */}
          <line x1={80} y1={695} x2={80 + strikeW} y2={695}
            stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
        </g>

        {/* Right approach */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY + breathe})`}>
          <BentoCard x={60} y={840} w={960} h={280} accent />
          <rect x={60} y={840} width={6} height={280} rx={3} fill={COLORS.accent} />
          <text x={100} y={920} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            CORRECT APPROACH
          </text>
          <text x={100} y={990} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Retry <tspan fontStyle="italic" fill={COLORS.accent}>only step 17</tspan>
          </text>
          <text x={100} y={1050} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Steps 1–16 already passed
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
