/**
 * Scene 07 — NoLandingJustALoop
 * "no landing just a loop to prove the journey was survivable."
 * CSV: 30.800s → 34.740s
 * Duration: 136 frames (4.53s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label, headline springs
 *   Phase 2 (20–70): Loop orbit diagram draws, checkmark appears
 *   Phase 3 (60–end): Orbit ring breathes, checkmark pulses
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene07_NoLandingJustALoop: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Loop diagram ──
  const moonNode = useSpringEntrance(frame, 18);
  const earthNode = useSpringEntrance(frame, 22);
  const loopLength = 900;
  const loopDash = usePathDraw(frame, 26, loopLength, 40);
  const xMark = useSpringEntrance(frame, 35);
  const checkMark = useSpringEntrance(frame, 50);
  const surviveCard = useSpringEntrance(frame, 58);
  const proofCard = useSpringEntrance(frame, 68);

  // Labels
  const labelNoLand = useSpringEntrance(frame, 40);
  const labelLoop = useSpringEntrance(frame, 48);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 5;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Capsule moving along the loop
  const t = interpolate(frame, [26, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Parametric path: wide elliptical loop
  const capsuleAngle = t * Math.PI * 2;
  const capsuleX = 540 + Math.cos(capsuleAngle) * 280;
  const capsuleY = 850 + Math.sin(capsuleAngle) * 180;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Ghost background LOOP text */}
        <text x={820} y={500} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={360} fontWeight={900} fill={COLORS.green} opacity={0.03}>
          LOOP
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="APOLLO 8 · MISSION PROFILE" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', sans-serif" fontSize={72} fontWeight={800} fill={COLORS.deep_black}>
            No Landing
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={450} fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={600} fill={COLORS.sky_blue}>
            Just a Loop
          </text>
        </g>

        {/* Zone C — Orbital loop diagram */}
        {/* Earth node (left) */}
        <g opacity={earthNode.opacity} transform={`translate(0, ${earthNode.translateY})`}>
          <circle cx={260} cy={850} r={60} fill={COLORS.sky_blue} fillOpacity={0.08} stroke={COLORS.sky_blue} strokeWidth={2.5} />
          <ellipse cx={250} cy={840} rx={22} ry={16} fill={COLORS.green} fillOpacity={0.2} />
          <text x={260} y={935} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            EARTH
          </text>
        </g>

        {/* Moon node (right) */}
        <g opacity={moonNode.opacity} transform={`translate(0, ${moonNode.translateY})`}>
          <circle cx={820} cy={850} r={50} fill={COLORS.cool_silver} fillOpacity={0.1} stroke={COLORS.cool_silver} strokeWidth={2} />
          <circle cx={805} cy={840} r={8} fill={COLORS.cool_silver} fillOpacity={0.08} />
          <circle cx={830} cy={860} r={6} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <text x={820} y={925} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            MOON
          </text>
        </g>

        {/* Orbital loop path */}
        <ellipse
          cx={540} cy={850} rx={280} ry={180}
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2.5}
          strokeDasharray={loopLength}
          strokeDashoffset={loopDash}
          strokeLinecap="round"
          opacity={0.4}
        />

        {/* Direction arrows on loop */}
        <g opacity={moonNode.opacity * 0.5}>
          <path d="M 540,670 L 550,680 L 530,680 Z" fill={COLORS.sky_blue} opacity={shimmer * 0.6} />
          <path d="M 540,1030 L 530,1020 L 550,1020 Z" fill={COLORS.sky_blue} opacity={shimmer * 0.6} />
        </g>

        {/* Moving capsule */}
        <g opacity={earthNode.opacity}>
          <polygon
            points={`${capsuleX},${capsuleY - 12} ${capsuleX - 8},${capsuleY + 6} ${capsuleX + 8},${capsuleY + 6}`}
            fill={COLORS.cool_silver} fillOpacity={0.5}
            stroke={COLORS.cool_silver} strokeWidth={1.5}
          />
          {/* Trail */}
          <circle cx={capsuleX} cy={capsuleY} r={16} fill="none" stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.2} />
        </g>

        {/* ── X mark over "LANDING" ── */}
        <g opacity={xMark.opacity} transform={`translate(0, ${xMark.translateY})`}>
          <rect x={140} y={1100} width={340} height={80} rx={12} fill={COLORS.vibrant_red} fillOpacity={0.04} stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={310} y={1152} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.cool_silver} textDecoration="line-through">
            LANDING
          </text>
          {/* X lines */}
          <line x1={180} y1={1110} x2={440} y2={1170} stroke={COLORS.vibrant_red} strokeWidth={2.5} opacity={0.5} />
          <line x1={440} y1={1110} x2={180} y2={1170} stroke={COLORS.vibrant_red} strokeWidth={2.5} opacity={0.5} />
        </g>

        {/* ── Checkmark over "SURVIVABLE" ── */}
        <g opacity={checkMark.opacity} transform={`translate(0, ${checkMark.translateY})`}>
          <rect x={600} y={1100} width={380} height={80} rx={12} fill={COLORS.green} fillOpacity={0.04} stroke={COLORS.green} strokeWidth={1.5} />
          <text x={790} y={1152} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.green}>
            SURVIVABLE
          </text>
          {/* Checkmark */}
          <path d="M 930,1120 L 950,1145 L 980,1110" fill="none" stroke={COLORS.green} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* ── "No landing" label ── */}
        <g opacity={labelNoLand.opacity}>
          <text x={310} y={1060} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.vibrant_red} opacity={0.6}>
            NOT THE GOAL
          </text>
        </g>

        {/* ── "Prove the loop" label ── */}
        <g opacity={labelLoop.opacity}>
          <text x={790} y={1060} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.green} opacity={0.6}>
            THE GOAL
          </text>
        </g>

        {/* Info card: Survive */}
        <g opacity={surviveCard.opacity} transform={`translate(60, ${1260 + surviveCard.translateY})`}>
          <rect x={0} y={0} width={460} height={100} rx={12} fill={COLORS.green} fillOpacity={0.05} stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.green} />
          <text x={24} y={42} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Prove survival is possible
          </text>
          <text x={24} y={78} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Human body in deep space transit
          </text>
        </g>

        {/* Info card: Return */}
        <g opacity={proofCard.opacity} transform={`translate(560, ${1260 + proofCard.translateY})`}>
          <rect x={0} y={0} width={460} height={100} rx={12} fill={COLORS.sky_blue} fillOpacity={0.05} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.sky_blue} />
          <text x={24} y={42} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Free return trajectory
          </text>
          <text x={24} y={78} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Gravity does the work home
          </text>
        </g>

        {/* Decorative loop arrows */}
        <path
          d="M 310,1450 C 420,1520 660,1520 770,1450"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5}
          strokeDasharray={400}
          strokeDashoffset={usePathDraw(frame, 65, 400, 25)}
          strokeLinecap="round"
          opacity={0.2}
          markerEnd="url(#arrow)"
        />

        {/* Star field */}
        {Array.from({ length: 10 }, (_, i) => (
          <circle
            key={i}
            cx={100 + (i * 103) % 880}
            cy={580 + (i * 67) % 400}
            r={1.5 + (i % 2)}
            fill={COLORS.sky_blue}
            opacity={interpolate(Math.sin(frame * 0.04 + i), [-1, 1], [0.1, 0.3])}
          />
        ))}

        {/* Bottom label */}
        <g opacity={proofCard.opacity * shimmer}>
          <text x={540} y={1700} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.15em">
            LOOP AROUND AND COME HOME
          </text>
        </g>

        {/* Caption */}
        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1820} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={shimmer * 0.6} letterSpacing="0.12em">
          NO LANDING · JUST A LOOP · SURVIVABLE
        </text>

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
