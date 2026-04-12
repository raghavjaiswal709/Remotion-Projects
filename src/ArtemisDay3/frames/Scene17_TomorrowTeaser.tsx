/**
 * Scene 17 — TomorrowTeaser
 * "Tomorrow, one button on board Artemis II, what happens the moment a crew member hits it?"
 * CSV: 82.480s → 89.600s
 * Duration: 219 frames (7.3s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–100): Abort button illustration, question card, countdown
 *   Phase 3 (80–end): Button pulse, particle float
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene17_TomorrowTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2 ──
  const buttonOuter = useSpringEntrance(frame, 18);
  const buttonInner = useSpringEntrance(frame, 24);
  const labelAbort = useSpringEntrance(frame, 30);
  const questionCard = useSpringEntrance(frame, 40);
  const infoCard1 = useSpringEntrance(frame, 52);
  const infoCard2 = useSpringEntrance(frame, 62);
  const bottomTeaser = useSpringEntrance(frame, 75);

  // Button ring draw
  const ringCircum = 2 * Math.PI * 100;
  const ringDash = usePathDraw(frame, 20, ringCircum, 30);

  // Connector
  const connLen = 120;
  const connDash = usePathDraw(frame, 40, connLen, 20);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const btnPulse = 1 + Math.sin(frame * 0.12) * 0.03;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Warning particles around button
  const warningParticles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 + frame * 2) * Math.PI / 180;
    const r = 140 + Math.sin(frame * 0.08 + i) * 15;
    return {
      cx: 540 + Math.cos(angle) * r,
      cy: 740 + Math.sin(angle) * r,
      opacity: 0.15 + Math.sin(frame * 0.1 + i * 0.8) * 0.1,
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={0.35} color={COLORS.vibrant_red} />

        {/* Ghost "ABORT" watermark */}
        <text x={540} y={1620} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={280} fontWeight={900}
          fill={COLORS.vibrant_red} opacity={0.02}>
          ABORT
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TOMORROW · PREVIEW" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={540} y={370} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={700} fill={COLORS.deep_black}>
            One Button
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={540} y={445} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={600} fill={COLORS.vibrant_red}>
            What Happens When You Hit It?
          </text>
        </g>

        {/* Zone C — Big abort button illustration */}
        <g opacity={buttonOuter.opacity} transform={`translate(540, ${740 + buttonOuter.translateY})`}
          style={{ transformOrigin: '540px 740px' }}>
          {/* Outer ring */}
          <circle cx={0} cy={0} r={100} fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeDasharray={ringCircum} strokeDashoffset={ringDash}
          />
          {/* Warning hashes around ring */}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i * 22.5) * Math.PI / 180;
            return (
              <line key={i}
                x1={Math.cos(angle) * 105} y1={Math.sin(angle) * 105}
                x2={Math.cos(angle) * 115} y2={Math.sin(angle) * 115}
                stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.2 * shimmer}
              />
            );
          })}
          {/* Inner button circle */}
          <g opacity={buttonInner.opacity}>
            <circle cx={0} cy={0} r={70} fill={COLORS.vibrant_red} fillOpacity={0.06}
              stroke={COLORS.vibrant_red} strokeWidth={3}
              transform={`scale(${btnPulse})`} style={{ transformOrigin: '0px 0px' }}
            />
            <circle cx={0} cy={0} r={50} fill={COLORS.vibrant_red} fillOpacity={0.04} />
            {/* Button cap highlight */}
            <ellipse cx={0} cy={-10} rx={30} ry={20} fill={COLORS.vibrant_red} fillOpacity={0.03} />
          </g>
          {/* ABORT text */}
          <g opacity={labelAbort.opacity}>
            <text x={0} y={10} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900}
              fill={COLORS.vibrant_red} letterSpacing="0.15em">
              ABORT
            </text>
          </g>
        </g>

        {/* Warning particles */}
        {warningParticles.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={3}
            fill={COLORS.vibrant_red} opacity={buttonOuter.opacity * p.opacity} />
        ))}

        {/* Connector to question */}
        <line x1={540} y1={850} x2={540} y2={970}
          stroke={COLORS.vibrant_red} strokeWidth={1.5} opacity={0.2}
          strokeDasharray={connLen} strokeDashoffset={connDash}
          markerEnd="url(#arrow)"
        />

        {/* Question card */}
        <g opacity={questionCard.opacity} transform={`translate(110, ${990 + questionCard.translateY})`}>
          <rect x={0} y={0} width={860} height={120} rx={16}
            fill={COLORS.vibrant_red} fillOpacity={0.03} stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={430} y={50} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700}
            fill={COLORS.deep_black}>
            What happens the moment
          </text>
          <text x={430} y={95} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700}
            fill={COLORS.vibrant_red}>
            a crew member hits it?
          </text>
        </g>

        {/* Info cards */}
        <g opacity={infoCard1.opacity} transform={`translate(60, ${1160 + infoCard1.translateY})`}>
          <rect x={0} y={0} width={460} height={140} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.04} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            LAUNCH ABORT
          </text>
          <text x={30} y={80} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            Escape tower fires
          </text>
          <text x={30} y={115} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.6}>
            700 km/h in 3 seconds
          </text>
        </g>

        <g opacity={infoCard2.opacity} transform={`translate(560, ${1160 + infoCard2.translateY})`}>
          <rect x={0} y={0} width={460} height={140} rx={12}
            fill={COLORS.orange} fillOpacity={0.04} stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.orange} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            DEEP SPACE ABORT
          </text>
          <text x={30} y={80} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            Service module redirects
          </text>
          <text x={30} y={115} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.6}>
            Fastest return trajectory
          </text>
        </g>

        {/* Bottom teaser */}
        <g opacity={bottomTeaser.opacity} transform={`translate(0, ${bottomTeaser.translateY + breathe})`}>
          <text x={540} y={1400} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={shimmer}>
            Find Out Tomorrow
          </text>
          {/* Arrow icon */}
          <path d="M 520,1430 L 540,1450 L 560,1430" fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            strokeLinecap="round" opacity={0.4} />
        </g>

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          TOMORROW · THE ABORT BUTTON
        </text>

        {/* Caption */}
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
