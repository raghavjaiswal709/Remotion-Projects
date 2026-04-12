/**
 * Scene11 — Return Trajectory
 * "Orion uses its service module engines to alter trajectory and begin the fastest, survivable return path to Earth."
 * CSV: 53.120s → 60.540s
 * Duration: 241 frames (8.03s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline
 *   Phase 2 (20–120): Content — trajectory diagram, engine burn, Earth→Moon→Earth path
 *   Phase 3 (100–end): Micro — engine glow, capsule float, path shimmer
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene11_ReturnTrajectory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const earthBody = useSpringEntrance(frame, 16);
  const moonBody = useSpringEntrance(frame, 22);
  const capsuleBody = useSpringEntrance(frame, 28);
  const engineBurn = useSpringEntrance(frame, 34);
  const infoCard1 = useSpringEntrance(frame, 50);
  const infoCard2 = useSpringEntrance(frame, 62);
  const infoCard3 = useSpringEntrance(frame, 74);

  // Trajectory path draws
  const outboundPath = 600;
  const outboundDash = usePathDraw(frame, 20, outboundPath, 40);
  const returnPath = 700;
  const returnDash = usePathDraw(frame, 40, returnPath, 50);

  // Engine burn indicator
  const burnGlow = interpolate(frame, [36, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Capsule progress along return path
  const capsuleProgress = interpolate(frame, [45, 160], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Position capsule along a curve
  const cpX = interpolate(capsuleProgress, [0, 0.3, 0.6, 1], [750, 600, 400, 200]);
  const cpY = interpolate(capsuleProgress, [0, 0.3, 0.6, 1], [700, 800, 780, 750]);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.05) * 3;
  const engineFlicker = interpolate(Math.sin(frame * 0.3), [-1, 1], [0.6, 1]);
  const pulse = 1 + Math.sin(frame * 0.07) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.sky_blue} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={240} fontWeight={900} fill={COLORS.sky_blue} opacity={0.04}>
          FTA
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ABORT RETURN · TRAJECTORY" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={900} fill={COLORS.deep_black}>
            Return Trajectory
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={450} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={600} fill={COLORS.sky_blue}>
            Fastest Survivable Path to Earth
          </text>
        </g>

        {/* Zone C — Trajectory diagram */}
        {/* Earth */}
        <g opacity={earthBody.opacity}
          transform={`translate(160, ${750 + earthBody.translateY})`}>
          <circle cx={0} cy={0} r={70}
            fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={2.5} />
          {/* Continents */}
          <path d="M -25,-40 Q -10,-45 10,-30 Q 20,-20 15,-5 Q 5,5 -20,0 Q -35,-15 -25,-40"
            fill={COLORS.green} fillOpacity={0.12} stroke={COLORS.green} strokeWidth={1} />
          <path d="M 15,15 Q 30,10 35,25 Q 30,40 20,35 Q 10,30 15,15"
            fill={COLORS.green} fillOpacity={0.12} stroke={COLORS.green} strokeWidth={1} />
          {/* Atmosphere glow */}
          <circle cx={0} cy={0} r={80}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1}
            opacity={0.15 * shimmer} />
          <text x={0} y={105} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            EARTH
          </text>
        </g>

        {/* Moon */}
        <g opacity={moonBody.opacity}
          transform={`translate(860, ${650 + moonBody.translateY})`}>
          <circle cx={0} cy={0} r={45}
            fill={COLORS.cool_silver} fillOpacity={0.1}
            stroke={COLORS.cool_silver} strokeWidth={2} />
          {/* Craters */}
          <circle cx={-10} cy={-8} r={7} fill={COLORS.cool_silver} fillOpacity={0.08} />
          <circle cx={12} cy={8} r={9} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <circle cx={-5} cy={18} r={5} fill={COLORS.cool_silver} fillOpacity={0.07} />
          <text x={0} y={70} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.cool_silver}>
            MOON
          </text>
        </g>

        {/* Outbound path (dashed — original mission path) */}
        <path d="M 240,740 Q 500,580 820,650"
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
          strokeDasharray="10,8" opacity={earthBody.opacity * 0.3} />
        <text x={530} y={600} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={20} fontWeight={500} fill={COLORS.cool_silver}
          opacity={earthBody.opacity * 0.4}>
          NOMINAL PATH
        </text>

        {/* Return trajectory path (solid — abort path) */}
        <path d="M 800,680 Q 650,850 400,830 Q 250,810 230,760"
          fill="none" stroke={COLORS.green} strokeWidth={3}
          strokeDasharray={returnPath} strokeDashoffset={returnDash}
          strokeLinecap="round" />

        {/* Return path label */}
        <g opacity={engineBurn.opacity}>
          <text x={500} y={870} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.green}>
            ABORT RETURN PATH
          </text>
        </g>

        {/* Capsule on return path */}
        <g opacity={capsuleBody.opacity}
          transform={`translate(${cpX}, ${cpY + breathe})`}>
          {/* Capsule */}
          <path d="M -16,-5 L -20,18 L 20,18 L 16,-5 Z"
            fill={COLORS.sky_blue} fillOpacity={0.12}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Service module */}
          <rect x={-20} y={18} width={40} height={25} rx={3}
            fill={COLORS.deep_black} fillOpacity={0.05}
            stroke={COLORS.cool_silver} strokeWidth={1} />
          {/* Solar panels */}
          <rect x={-50} y={22} width={26} height={10} rx={2}
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={1} />
          <rect x={24} y={22} width={26} height={10} rx={2}
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={1} />

          {/* Engine burn indicator */}
          <g opacity={burnGlow * engineFlicker}>
            <circle cx={0} cy={50} r={12}
              fill={COLORS.orange} fillOpacity={0.2} />
            <circle cx={0} cy={50} r={6}
              fill={COLORS.vibrant_red} fillOpacity={0.3} />
            <path d="M -6,50 Q -8,65 0,75 Q 8,65 6,50"
              fill={COLORS.orange} fillOpacity={0.25} />
          </g>
        </g>

        {/* Burn point marker */}
        <g opacity={engineBurn.opacity}>
          <circle cx={750} cy={700} r={10}
            fill={COLORS.vibrant_red} fillOpacity={0.15}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            style={{ transform: `scale(${pulse})`, transformOrigin: '750px 700px' }} />
          <text x={750} y={680} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={700} fill={COLORS.vibrant_red}>
            ENGINE BURN
          </text>
        </g>

        {/* Info cards */}
        <g opacity={infoCard1.opacity}
          transform={`translate(60, ${960 + infoCard1.translateY})`}>
          <rect x={0} y={0} width={300} height={110} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={110} rx={3} fill={COLORS.orange} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.cool_silver}>
            ENGINE
          </text>
          <text x={30} y={75} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800} fill={COLORS.deep_black}>
            Service Module
          </text>
        </g>

        <g opacity={infoCard2.opacity}
          transform={`translate(390, ${960 + infoCard2.translateY})`}>
          <rect x={0} y={0} width={300} height={110} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={110} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.cool_silver}>
            ACTION
          </text>
          <text x={30} y={75} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800} fill={COLORS.deep_black}>
            Alter Trajectory
          </text>
        </g>

        <g opacity={infoCard3.opacity}
          transform={`translate(720, ${960 + infoCard3.translateY})`}>
          <rect x={0} y={0} width={300} height={110} rx={12}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={110} rx={3} fill={COLORS.green} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.cool_silver}>
            GOAL
          </text>
          <text x={30} y={75} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800} fill={COLORS.deep_black}>
            Survivable Path
          </text>
        </g>

        {/* Star field in space area */}
        {Array.from({ length: 20 }, (_, i) => {
          const sx = 350 + (i * 43) % 400;
          const sy = 550 + (i * 31) % 250;
          return (
            <circle key={i} cx={sx} cy={sy} r={1.2}
              fill={COLORS.cool_silver}
              opacity={interpolate(Math.sin(frame * 0.08 + i * 1.7), [-1, 1], [0.15, 0.5])} />
          );
        })}

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">FREE RETURN · TRAJECTORY · LUNAR GRAVITY</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
