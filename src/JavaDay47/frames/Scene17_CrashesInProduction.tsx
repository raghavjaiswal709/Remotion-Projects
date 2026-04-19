/**
 * Scene 17 — Application Crashes in Production
 * "The application crashes in production."
 * CSV: 62.680s → 65.740s
 * Duration: ~92 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–60): Server rack crash illustration
 *   Phase 3 (frames 50–end): Alert pulse
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene17_CrashesInProduction: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const serverEnt = useSpringEntrance(frame, 18);
  const alertEnt = useSpringEntrance(frame, 30);
  const impactEnt = useSpringEntrance(frame, 42);
  const bottomEnt = useSpringEntrance(frame, 54);

  // Crash shake effect
  const shakeActive = frame >= 28 && frame <= 40;
  const shakeX = shakeActive ? Math.sin(frame * 8) * 6 : 0;
  const shakeY = shakeActive ? Math.cos(frame * 10) * 4 : 0;

  // Crack path draw
  const crackLen = 400;
  const crackDash = usePathDraw(frame, 28, crackLen, 12);

  // Alert pulse
  const alertPulse = 0.4 + Math.sin(frame * 0.15) * 0.6;
  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Screen flicker
  const screenFlicker = frame >= 30 && frame <= 42 
    ? (Math.random() > 0.5 ? 0.2 : 0.8) 
    : frame >= 42 ? 0.15 : 0.8;

  const caption = CAPTIONS[16];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="PRODUCTION · FAILURE" y={160} opacity={0.8} />
        </g>

        {/* Headline */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            The application
          </text>
          <text x={540} y={410} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.vibrant_red}
            fontStyle="italic">
            crashes
          </text>
          <text x={540} y={480} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.text_muted}>
            in production.
          </text>
        </g>

        {/* Server rack illustration */}
        <g opacity={serverEnt.opacity}
           transform={`translate(${shakeX}, ${serverEnt.translateY + shakeY})`}>
          <BentoCard x={140} y={540} w={340} h={620} accent />

          {/* Server rack body */}
          <rect x={180} y={570} width={260} height={560} rx={8}
            fill="rgba(255,255,255,0.03)" stroke={COLORS.text_muted} strokeWidth={2} />

          {/* Server units */}
          {[0, 1, 2, 3, 4].map((i) => {
            const unitY = 590 + i * 105;
            const isCrashed = i === 2;
            return (
              <g key={i}>
                <rect x={195} y={unitY} width={230} height={80} rx={4}
                  fill={isCrashed ? COLORS.vibrant_red : COLORS.bg_secondary}
                  fillOpacity={isCrashed ? 0.15 : 1}
                  stroke={isCrashed ? COLORS.vibrant_red : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isCrashed ? 2 : 1} />
                {/* LEDs */}
                <circle cx={215} cy={unitY + 40} r={5}
                  fill={isCrashed ? COLORS.vibrant_red : COLORS.accent}
                  opacity={isCrashed ? alertPulse : 0.6} />
                <circle cx={235} cy={unitY + 40} r={5}
                  fill={isCrashed ? COLORS.vibrant_red : COLORS.accent}
                  opacity={isCrashed ? alertPulse : 0.4} />
                {/* Lines representing drive slots */}
                <line x1={260} y1={unitY + 25} x2={400} y2={unitY + 25}
                  stroke={isCrashed ? COLORS.vibrant_red : 'rgba(255,255,255,0.1)'}
                  strokeWidth={1} opacity={isCrashed ? 0.5 : 0.3} />
                <line x1={260} y1={unitY + 45} x2={400} y2={unitY + 45}
                  stroke={isCrashed ? COLORS.vibrant_red : 'rgba(255,255,255,0.1)'}
                  strokeWidth={1} opacity={isCrashed ? 0.5 : 0.3} />
                <line x1={260} y1={unitY + 65} x2={380} y2={unitY + 65}
                  stroke={isCrashed ? COLORS.vibrant_red : 'rgba(255,255,255,0.1)'}
                  strokeWidth={1} opacity={isCrashed ? 0.5 : 0.3} />
              </g>
            );
          })}

          {/* Crack line across crashed unit */}
          <path d="M 195,840 L 240,830 L 260,850 L 310,825 L 350,835 L 390,820 L 425,840"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={crackLen} strokeDashoffset={crackDash} />
        </g>

        {/* Alert box */}
        <g opacity={alertEnt.opacity} transform={`translate(0, ${alertEnt.translateY})`}>
          <BentoCard x={540} y={540} w={440} h={300} />
          <rect x={540} y={540} width={8} height={300} rx={4} fill={COLORS.vibrant_red} />

          {/* Warning icon */}
          <g transform="translate(760, 620)">
            <polygon points="0,-40 36,30 -36,30"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
              opacity={alertPulse} />
            <text x={0} y={18} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
              !
            </text>
          </g>

          <text x={760} y={700} textAnchor="middle"
            fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.vibrant_red}>
            FATAL ERROR
          </text>
          <text x={760} y={745} textAnchor="middle"
            fontFamily={MONO} fontSize={22} fontWeight={500} fill={COLORS.text_muted}>
            ClassCastException
          </text>
          <text x={760} y={785} textAnchor="middle"
            fontFamily={MONO} fontSize={22} fontWeight={500} fill={COLORS.text_muted}>
            at TicketingEngine.main
          </text>
        </g>

        {/* Impact cards */}
        <g opacity={impactEnt.opacity} transform={`translate(0, ${impactEnt.translateY})`}>
          <BentoCard x={540} y={870} w={440} h={290} />
          <text x={580} y={920} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            IMPACT
          </text>

          {/* Impact items */}
          {['Users cannot book tickets', 'Revenue loss per minute', 'Manual restart required'].map((item, i) => (
            <g key={i}>
              <circle cx={580} cy={968 + i * 56} r={4} fill={COLORS.vibrant_red} opacity={0.6} />
              <text x={600} y={980 + i * 56}
                fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
                {item}
              </text>
            </g>
          ))}
        </g>

        {/* Bottom emphasis */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1220} w={960} h={140} accent />
          <rect x={60} y={1220} width={8} height={140} rx={4} fill={COLORS.vibrant_red} />
          <text x={540} y={1300} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            A single bad cast can take down
          </text>
          <text x={540} y={1345} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.vibrant_red}
            fontStyle="italic">
            the entire ticketing system
          </text>
        </g>

        {/* Floating debris */}
        <circle cx={100} cy={1480 + breathe} r={3} fill={COLORS.vibrant_red} opacity={0.1 * shimmer} />
        <circle cx={980} cy={1520 - breathe} r={4} fill={COLORS.accent} opacity={0.08 * shimmer} />
        <circle cx={540} cy={1600 + breathe * 0.5} r={2} fill={COLORS.vibrant_red} opacity={0.06} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s17.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
