/**
 * Scene 21 — Retry Step 17
 * "If step 17 fails, you retry step 17."
 * CSV: 66.460s → 69.900s
 * Duration: 103 frames (3.43s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline
 *   Phase 2 (frames 16–65): Step chain with step 17 highlighted red then retried green
 *   Phase 3 (frames 60–end): Pulse
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

const STEPS = [15, 16, 17, 18, 19];

export const Scene21_RetryStep17: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const chainCard = useSpringEntrance(frame, 16);
  const retryCard = useSpringEntrance(frame, 50);

  // Step 17 state: normal → fail → retry → pass
  const failAppear = interpolate(frame, [30, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const retryAppear = interpolate(frame, [50, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isRetried = frame > 55;

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse17 = isRetried ? 1 + Math.sin(frame * 0.1) * 0.03 : 1;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RETRY · EXAMPLE" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Step 17 Fails?
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Retry <tspan fontStyle="italic">step 17</tspan>
          </text>
        </g>

        {/* ZONE C — Step chain */}
        <g opacity={chainCard.opacity} transform={`translate(0, ${chainCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={500} accent />

          {STEPS.map((step, i) => {
            const stepEnt = useSpringEntrance(frame, 20 + i * 6);
            const cx = 160 + i * 180;
            const cy = 730;
            const is17 = step === 17;
            const stepColor = is17
              ? (isRetried ? COLORS.accent : (failAppear > 0.5 ? COLORS.vibrant_red : COLORS.text_muted))
              : COLORS.text_muted;
            const stepFill = is17
              ? (isRetried ? COLORS.accent : (failAppear > 0.5 ? COLORS.vibrant_red : 'rgba(255,255,255,0.05)'))
              : 'rgba(255,255,255,0.05)';

            return (
              <g key={i} opacity={stepEnt.opacity} transform={`translate(0, ${stepEnt.translateY})`}>
                {/* Step circle */}
                <circle cx={cx} cy={cy} r={is17 ? 60 : 48}
                  fill={stepFill} fillOpacity={is17 ? 0.15 : 1}
                  stroke={stepColor} strokeWidth={is17 ? 4 : 2}
                  transform={is17 ? `scale(${pulse17})` : undefined}
                  style={is17 ? { transformOrigin: `${cx}px ${cy}px` } : undefined}
                />
                <text x={cx} y={cy + 12} textAnchor="middle" fontFamily={FONT}
                  fontSize={is17 ? 40 : 32} fontWeight={800}
                  fill={is17 ? COLORS.white : COLORS.text_muted}>
                  {step}
                </text>

                {/* Connector to next */}
                {i < STEPS.length - 1 && (
                  <line x1={cx + (is17 ? 60 : 48)} y1={cy}
                    x2={cx + 180 - (STEPS[i + 1] === 17 ? 60 : 48)} y2={cy}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
                )}

                {/* X on fail */}
                {is17 && failAppear > 0 && !isRetried && (
                  <g opacity={failAppear}>
                    <line x1={cx - 18} y1={cy - 18} x2={cx + 18} y2={cy + 18}
                      stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round" />
                    <line x1={cx + 18} y1={cy - 18} x2={cx - 18} y2={cy + 18}
                      stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round" />
                  </g>
                )}

                {/* Check on retry */}
                {is17 && isRetried && (
                  <g opacity={retryAppear}>
                    <path d={`M ${cx - 16},${cy} L ${cx - 4},${cy + 14} L ${cx + 20},${cy - 14}`}
                      fill="none" stroke={COLORS.accent} strokeWidth={5}
                      strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Retry arrow curving back to step 17 */}
          {retryAppear > 0 && (
            <g opacity={retryAppear}>
              <path d="M 520,810 Q 520,880 520,810" fill="none" stroke={COLORS.accent} strokeWidth={3}
                strokeLinecap="round" />
              <text x={540} y={870} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.accent} fontStyle="italic">RETRY</text>
            </g>
          )}
        </g>

        {/* Key point card */}
        <g opacity={retryCard.opacity} transform={`translate(0, ${retryCard.translateY + breathe})`}>
          <BentoCard x={60} y={1040} w={960} h={160} accent />
          <rect x={60} y={1040} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1100} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Retry <tspan fill={COLORS.accent} fontStyle="italic">only</tspan> the failed step
          </text>
          <text x={100} y={1155} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Not the entire trajectory
          </text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
