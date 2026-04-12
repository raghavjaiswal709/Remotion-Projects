/**
 * Scene10 — No Tower No Escape
 * "No tower, no fast escape. The mission profile switches immediately."
 * CSV: 48.020s → 52.480s
 * Duration: 152 frames (5.07s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, crossed-out headline
 *   Phase 2 (20–90): Content — X-marks, profile switch diagram
 *   Phase 3 (80–end): Micro — glow, gentle float
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

export const Scene10_NoTowerNoEscape: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const xMark1 = useSpringEntrance(frame, 20);
  const xMark2 = useSpringEntrance(frame, 28);
  const switchCard = useSpringEntrance(frame, 36);
  const arrowSwitch = useSpringEntrance(frame, 44);
  const profileCard1 = useSpringEntrance(frame, 52);
  const profileCard2 = useSpringEntrance(frame, 62);
  const factCard = useSpringEntrance(frame, 72);

  // X strikethrough path draws
  const xLineLen = 100;
  const xDash1 = usePathDraw(frame, 22, xLineLen, 15);
  const xDash2 = usePathDraw(frame, 30, xLineLen, 15);

  // Switch arrow path
  const switchArrowLen = 200;
  const switchDash = usePathDraw(frame, 46, switchArrowLen, 25);

  // Profile connector
  const connLen = 150;
  const connDash = usePathDraw(frame, 56, connLen, 20);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.vibrant_red} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={360} fontWeight={900} fill={COLORS.vibrant_red} opacity={0.04}>
          X
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MISSION PROFILE · DEEP SPACE" y={260} opacity={0.55} />
        </g>

        {/* Zone B — NO + crossed out items */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={900} fill={COLORS.vibrant_red}>
            No Tower
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={460} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={700} fill={COLORS.deep_black}>
            No Fast Escape
          </text>
        </g>

        {/* Zone C */}
        {/* "NO TOWER" card with X */}
        <g opacity={xMark1.opacity}
          transform={`translate(60, ${580 + xMark1.translateY})`}>
          <rect x={0} y={0} width={440} height={180} rx={16}
            fill={COLORS.vibrant_red} fillOpacity={0.04}
            stroke={COLORS.vibrant_red} strokeWidth={2} />

          {/* LAS Tower icon (crossed out) */}
          <g transform="translate(60, 20)">
            {/* Tower line */}
            <line x1={30} y1={140} x2={30} y2={10}
              stroke={COLORS.cool_silver} strokeWidth={3} opacity={0.3} />
            {/* Nozzle */}
            <path d="M 18,10 L 30,0 L 42,10"
              fill="none" stroke={COLORS.cool_silver} strokeWidth={2} opacity={0.3} />
            {/* X over tower */}
            <line x1={5} y1={5} x2={55} y2={135}
              stroke={COLORS.vibrant_red} strokeWidth={3}
              strokeDasharray={xLineLen} strokeDashoffset={xDash1}
              strokeLinecap="round" />
            <line x1={55} y1={5} x2={5} y2={135}
              stroke={COLORS.vibrant_red} strokeWidth={3}
              strokeDasharray={xLineLen} strokeDashoffset={xDash1}
              strokeLinecap="round" />
          </g>

          <text x={160} y={70} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700} fill={COLORS.deep_black}>
            No LAS Tower
          </text>
          <text x={160} y={110} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={400} fill={COLORS.cool_silver}>
            Already jettisoned in orbit
          </text>
          <text x={160} y={145} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={400} fill={COLORS.cool_silver}>
            No solid rocket escape
          </text>
        </g>

        {/* "NO FAST ESCAPE" card with X */}
        <g opacity={xMark2.opacity}
          transform={`translate(560, ${580 + xMark2.translateY})`}>
          <rect x={0} y={0} width={460} height={180} rx={16}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={2} />

          {/* Speed icon (crossed out) */}
          <g transform="translate(50, 25)">
            {/* Arrow pointing right */}
            <line x1={0} y1={65} x2={60} y2={65}
              stroke={COLORS.cool_silver} strokeWidth={3} opacity={0.3}
              markerEnd="url(#arrow)" />
            <text x={30} y={50} textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={20} fontWeight={600} fill={COLORS.cool_silver} opacity={0.3}>
              SPEED
            </text>
            {/* X over speed */}
            <line x1={0} y1={10} x2={60} y2={120}
              stroke={COLORS.orange} strokeWidth={3}
              strokeDasharray={xLineLen} strokeDashoffset={xDash2}
              strokeLinecap="round" />
            <line x1={60} y1={10} x2={0} y2={120}
              stroke={COLORS.orange} strokeWidth={3}
              strokeDasharray={xLineLen} strokeDashoffset={xDash2}
              strokeLinecap="round" />
          </g>

          <text x={160} y={70} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700} fill={COLORS.deep_black}>
            No Quick Exit
          </text>
          <text x={160} y={110} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={400} fill={COLORS.cool_silver}>
            3-second escape gone
          </text>
          <text x={160} y={145} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={400} fill={COLORS.cool_silver}>
            Different strategy required
          </text>
        </g>

        {/* Switch arrow (big downward arrow between sections) */}
        <g opacity={arrowSwitch.opacity}>
          <path d="M 540,780 L 540,880"
            fill="none" stroke={COLORS.sky_blue} strokeWidth={3}
            strokeDasharray={switchArrowLen} strokeDashoffset={switchDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={540} y={860} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.sky_blue}
            opacity={shimmer}>
            PROFILE SWITCHES
          </text>
        </g>

        {/* Mission profile switch visualization */}
        <g opacity={switchCard.opacity}
          transform={`translate(60, ${920 + switchCard.translateY})`}>
          <rect x={0} y={0} width={960} height={80} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <text x={480} y={50} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={800} fill={COLORS.sky_blue}>
            MISSION PROFILE SWITCHES IMMEDIATELY
          </text>
        </g>

        {/* Two profile cards */}
        <g opacity={profileCard1.opacity}
          transform={`translate(60, ${1040 + profileCard1.translateY})`}>
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill={COLORS.cool_silver} fillOpacity={0.05}
            stroke={COLORS.cool_silver} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.cool_silver} />
          {/* Strikethrough */}
          <line x1={30} y1={58} x2={400} y2={58}
            stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.4} />
          <text x={30} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.cool_silver}>
            NOMINAL MISSION
          </text>
          <text x={30} y={90} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Planned orbit and return
          </text>
          <text x={30} y={120} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={700} fill={COLORS.vibrant_red}>
            CANCELLED
          </text>
        </g>

        {/* Connector */}
        <line x1={520} y1={1110} x2={560} y2={1110}
          stroke={COLORS.sky_blue} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDash}
          markerEnd="url(#arrow)" />

        <g opacity={profileCard2.opacity}
          transform={`translate(560, ${1040 + profileCard2.translateY})`}>
          <rect x={0} y={0} width={460} height={140} rx={12}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.green} />
          <text x={30} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            ABORT RETURN
          </text>
          <text x={30} y={90} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Emergency trajectory home
          </text>
          <text x={30} y={120} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={700} fill={COLORS.green}
            style={{ transform: `scale(${pulse})`, transformOrigin: '590px 1160px' }}>
            ACTIVE
          </text>
        </g>

        {/* Bottom fact card */}
        <g opacity={factCard.opacity}
          transform={`translate(60, ${1220 + factCard.translateY + breathe})`}>
          <rect x={0} y={0} width={960} height={80} rx={12}
            fill={COLORS.amber} fillOpacity={0.05}
            stroke={COLORS.amber} strokeWidth={1.5} />
          <text x={480} y={48} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            Service module engines become primary abort tool
          </text>
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">NO TOWER · NO ESCAPE · ENGINE MUST FIRE</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
