/**
 * Scene13 — Secured Within Minutes
 * "The capsule is secured within minutes."
 * CSV: 77.980s → 79.940s (SHORT scene)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring entrance
 *   Phase 2 (15–70): Lock icon, capsule with flotation collar + ocean + tethers, checklist
 *   Phase 3 (60–end): Pulse, breathe, wave motion, lock glow
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import {
  PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents,
  Divider,
} from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(
  frame: number,
  startFrame: number,
  totalLength: number,
  durationFrames = 30,
) {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  );
  return totalLength * (1 - progress);
}

export const Scene13_SecuredMinutes: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // ── Phase 2: Content build ─────────────────────────────────────────────
  const lockIcon = useSpringEntrance(frame, 14);
  const minutesBadge = useSpringEntrance(frame, 20);
  const capsuleEnt = useSpringEntrance(frame, 26);
  const collarEnt = useSpringEntrance(frame, 32);
  const tetherDraw = usePathDraw(frame, 30, 400, 25);
  const lockBorderDraw = usePathDraw(frame, 14, 600, 30);
  const checkCard1 = useSpringEntrance(frame, 40);
  const checkCard2 = useSpringEntrance(frame, 50);
  const checkCard3 = useSpringEntrance(frame, 60);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.82, 1],
  );
  const lockPulse = 1 + Math.sin(frame * 0.1) * 0.025;
  const wave1 = Math.sin(frame * 0.06) * 6;
  const wave2 = Math.sin(frame * 0.07 + 1) * 4;
  const wave3 = Math.sin(frame * 0.08 + 2.2) * 3;
  const lockGlow = 0.12 + Math.sin(frame * 0.08) * 0.06;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  const oceanY = 940;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={1080}
        height={1920}
      >
        <PaperBackground />
        <GlobalDefs />

        {/* ── Ghost background text ── */}
        <text
          x={540}
          y={680}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={280}
          fontWeight={900}
          fill={COLORS.green}
          opacity={0.035}
        >
          SAFE
        </text>

        {/* ── Zone A — Section label ── */}
        <g
          transform={`translate(0, ${labelEnt.translateY})`}
          opacity={labelEnt.opacity}
        >
          <SectionLabel
            text="RECOVERY · SECURE"
            y={260}
            opacity={0.55}
          />
        </g>

        {/* ── Zone B — Headline ── */}
        <g
          transform={`translate(0, ${headA.translateY})`}
          opacity={headA.opacity}
        >
          <text
            x={540}
            y={380}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68}
            fontWeight={900}
            fill={COLORS.deep_black}
          >
            Secured in
          </text>
        </g>
        <g
          transform={`translate(0, ${headB.translateY})`}
          opacity={headB.opacity}
        >
          <text
            x={540}
            y={448}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60}
            fontWeight={900}
            fill={COLORS.green}
          >
            Minutes
          </text>
          {/* Green underline */}
          <rect
            x={380}
            y={458}
            width={320}
            height={4}
            rx={2}
            fill={COLORS.green}
            opacity={0.5}
          />
        </g>

        {/* ═══ LARGE LOCK ICON ═══ */}
        <g
          opacity={lockIcon.opacity}
          transform={`translate(540, ${600 + lockIcon.translateY}) scale(${lockPulse})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Glow ring */}
          <circle
            cx={0}
            cy={40}
            r={100}
            fill={COLORS.green}
            fillOpacity={lockGlow}
          />
          {/* Outer ring */}
          <circle
            cx={0}
            cy={40}
            r={100}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={2.5}
            opacity={0.3}
            strokeDasharray={600}
            strokeDashoffset={lockBorderDraw}
          />

          {/* Lock body — solid */}
          <rect
            x={-80}
            y={0}
            width={160}
            height={120}
            rx={16}
            fill={COLORS.green}
            fillOpacity={0.1}
            stroke={COLORS.green}
            strokeWidth={3}
          />
          {/* Body cross hatch */}
          {[0, 1, 2].map(i => (
            <line
              key={`lbl-${i}`}
              x1={-60 + i * 50}
              y1={10}
              x2={-60 + i * 50}
              y2={110}
              stroke={COLORS.green}
              strokeWidth={1}
              opacity={0.08}
            />
          ))}
          {/* Rivets */}
          {[-55, -20, 20, 55].map((rx, i) => (
            <circle
              key={`lrv-${i}`}
              cx={rx}
              cy={8}
              r={3}
              fill={COLORS.green}
              fillOpacity={0.25}
            />
          ))}
          {[-55, -20, 20, 55].map((rx, i) => (
            <circle
              key={`lrv2-${i}`}
              cx={rx}
              cy={112}
              r={3}
              fill={COLORS.green}
              fillOpacity={0.25}
            />
          ))}

          {/* Shackle — thick */}
          <path
            d="M -48,2 L -48,-48 C -48,-90 48,-90 48,-48 L 48,2"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={6}
            strokeLinecap="round"
          />
          {/* Shackle inner highlight */}
          <path
            d="M -38,2 L -38,-44 C -38,-78 38,-78 38,-44 L 38,2"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={1.5}
            opacity={0.15}
          />

          {/* Keyhole */}
          <circle
            cx={0}
            cy={48}
            r={20}
            fill={COLORS.green}
            fillOpacity={0.2}
            stroke={COLORS.green}
            strokeWidth={2}
          />
          <rect
            x={-5}
            y={60}
            width={10}
            height={30}
            rx={4}
            fill={COLORS.green}
            fillOpacity={0.35}
          />

          {/* LARGE check mark over lock */}
          <path
            d="M -28,90 L -8,112 L 35,70"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ── "MINUTES" pill badge ── */}
        <g
          opacity={minutesBadge.opacity}
          transform={`translate(540, ${780 + minutesBadge.translateY})`}
        >
          <rect
            x={-120}
            y={-30}
            width={240}
            height={60}
            rx={30}
            fill={COLORS.green}
            fillOpacity={0.1}
            stroke={COLORS.green}
            strokeWidth={2}
          />
          {/* Clock icon inside pill */}
          <circle
            cx={-70}
            cy={0}
            r={16}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={2}
            opacity={0.5}
          />
          <line
            x1={-70}
            y1={0}
            x2={-70}
            y2={-10}
            stroke={COLORS.green}
            strokeWidth={2}
            opacity={0.5}
          />
          <line
            x1={-70}
            y1={0}
            x2={-62}
            y2={4}
            stroke={COLORS.green}
            strokeWidth={2}
            opacity={0.5}
          />
          <text
            x={10}
            y={8}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={800}
            fill={COLORS.green}
          >
            MINUTES
          </text>
        </g>

        {/* ═══ OCEAN SURFACE ═══ */}
        <g opacity={capsuleEnt.opacity * shimmer}>
          <path
            d={`M 0,${oceanY + wave1} Q 180,${oceanY - 8 + wave2} 360,${oceanY + wave1} T 720,${oceanY + wave1} T 1080,${oceanY + wave1}`}
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={3}
            opacity={0.25}
          />
          <path
            d={`M 0,${oceanY + 16 + wave2} Q 270,${oceanY + 8 + wave3} 540,${oceanY + 16 + wave2} T 1080,${oceanY + 16 + wave2}`}
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={2}
            opacity={0.18}
          />
          <path
            d={`M 0,${oceanY + 28 + wave3} Q 250,${oceanY + 22 + wave1} 500,${oceanY + 28 + wave3} T 1000,${oceanY + 28 + wave3}`}
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
            opacity={0.1}
          />
          {/* Depth */}
          <rect
            x={0}
            y={oceanY + 30}
            width={1080}
            height={140}
            fill={COLORS.sky_blue}
            fillOpacity={0.05}
          />
          {/* Spray */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <circle
              key={`sp-${i}`}
              cx={100 + i * 120}
              cy={oceanY - 3 + Math.sin(frame * 0.07 + i * 0.9) * 5}
              r={1.5}
              fill={COLORS.sky_blue}
              opacity={0.15 + Math.sin(frame * 0.05 + i) * 0.06}
            />
          ))}
        </g>

        {/* ═══ CAPSULE with flotation collar + tethers ═══ */}
        <g
          opacity={capsuleEnt.opacity}
          transform={`translate(540, ${oceanY - 25 + capsuleEnt.translateY + breathe})`}
        >
          {/* Flotation collar — large orange ring */}
          <g opacity={collarEnt.opacity}>
            <ellipse
              cx={0}
              cy={38}
              rx={120}
              ry={20}
              fill={COLORS.orange}
              fillOpacity={0.25}
              stroke={COLORS.orange}
              strokeWidth={2.5}
            />
            {/* Collar segment marks */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const ang = (i * 60 * Math.PI) / 180;
              return (
                <circle
                  key={`csg-${i}`}
                  cx={Math.cos(ang) * 110}
                  cy={38 + Math.sin(ang) * 16}
                  r={4}
                  fill={COLORS.orange}
                  fillOpacity={0.45}
                />
              );
            })}
          </g>

          {/* Capsule body — conical */}
          <path
            d="M -55,-45 L -65,20 L -68,38 L 68,38 L 65,20 L 55,-45 Z"
            fill={COLORS.cool_silver}
            fillOpacity={0.2}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
          />
          {/* Panel lines */}
          <line
            x1={0}
            y1={-42}
            x2={0}
            y2={36}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.1}
          />
          <line
            x1={-30}
            y1={-40}
            x2={-35}
            y2={36}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.08}
          />
          <line
            x1={30}
            y1={-40}
            x2={35}
            y2={36}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.08}
          />
          {/* Rivets */}
          {[-42, -20, 0, 20, 42].map((rx, i) => (
            <circle
              key={`rv-${i}`}
              cx={rx}
              cy={-8}
              r={2}
              fill={COLORS.deep_black}
              opacity={0.12}
            />
          ))}
          {/* Heat shield */}
          <rect
            x={-66}
            y={36}
            width={132}
            height={12}
            rx={6}
            fill={COLORS.brown}
            fillOpacity={0.3}
            stroke={COLORS.brown}
            strokeWidth={1.5}
          />
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={`hs-${i}`}
              x1={-52 + i * 24}
              y1={39}
              x2={-48 + i * 24}
              y2={45}
              stroke={COLORS.brown}
              strokeWidth={1}
              opacity={0.15}
            />
          ))}
          {/* Portholes */}
          <circle
            cx={-24}
            cy={0}
            r={7}
            fill={COLORS.sky_blue}
            fillOpacity={0.15}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          <circle
            cx={24}
            cy={0}
            r={7}
            fill={COLORS.sky_blue}
            fillOpacity={0.15}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          {/* Docking ring */}
          <rect
            x={-20}
            y={-52}
            width={40}
            height={9}
            rx={4}
            fill={COLORS.cool_silver}
            fillOpacity={0.2}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
          />
          {/* ORION label */}
          <text
            x={0}
            y={-60}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20}
            fontWeight={800}
            fill={COLORS.orange}
            letterSpacing="0.1em"
          >
            ORION
          </text>

          {/* Tether lines to PORT and STBD ships */}
          <line
            x1={-68}
            y1={28}
            x2={-260}
            y2={10}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
            opacity={0.18}
            strokeDasharray={400}
            strokeDashoffset={tetherDraw}
          />
          <line
            x1={68}
            y1={28}
            x2={260}
            y2={10}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
            opacity={0.18}
            strokeDasharray={400}
            strokeDashoffset={tetherDraw}
          />
          {/* Anchor nodes */}
          <g>
            <circle
              cx={-260}
              cy={10}
              r={10}
              fill={COLORS.sky_blue}
              fillOpacity={0.15}
              stroke={COLORS.sky_blue}
              strokeWidth={2}
            />
            <text
              x={-260}
              y={-8}
              textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={18}
              fontWeight={700}
              fill={COLORS.sky_blue}
            >
              PORT
            </text>
          </g>
          <g>
            <circle
              cx={260}
              cy={10}
              r={10}
              fill={COLORS.sky_blue}
              fillOpacity={0.15}
              stroke={COLORS.sky_blue}
              strokeWidth={2}
            />
            <text
              x={260}
              y={-8}
              textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={18}
              fontWeight={700}
              fill={COLORS.sky_blue}
            >
              STBD
            </text>
          </g>
        </g>

        {/* ═══ CHECKLIST — 3 items with unique icons ═══ */}

        {/* Card 1 — Flotation collar */}
        <g
          opacity={checkCard1.opacity}
          transform={`translate(60, ${1180 + checkCard1.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={90}
            rx={12}
            fill={COLORS.green}
            fillOpacity={0.05}
            stroke={COLORS.green}
            strokeWidth={1.5}
          />
          {/* Ring / collar icon */}
          <ellipse
            cx={50}
            cy={45}
            rx={22}
            ry={10}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={2.5}
          />
          <ellipse
            cx={50}
            cy={45}
            rx={14}
            ry={6}
            fill={COLORS.green}
            fillOpacity={0.15}
          />
          <text
            x={90}
            y={52}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={600}
            fill={COLORS.deep_black}
          >
            Flotation collar deployed
          </text>
          {/* Checkmark */}
          <path
            d="M 900,36 L 914,50 L 940,28"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* Card 2 — Tow lines */}
        <g
          opacity={checkCard2.opacity}
          transform={`translate(60, ${1290 + checkCard2.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={90}
            rx={12}
            fill={COLORS.sky_blue}
            fillOpacity={0.05}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          {/* Rope / tow line icon */}
          <path
            d="M 30,35 Q 40,28 50,35 T 70,35"
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle
            cx={26}
            cy={35}
            r={5}
            fill={COLORS.sky_blue}
            fillOpacity={0.3}
          />
          <circle
            cx={74}
            cy={35}
            r={5}
            fill={COLORS.sky_blue}
            fillOpacity={0.3}
          />
          <line
            x1={30}
            y1={50}
            x2={70}
            y2={50}
            stroke={COLORS.sky_blue}
            strokeWidth={2}
            opacity={0.3}
          />
          <text
            x={90}
            y={52}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={600}
            fill={COLORS.deep_black}
          >
            Divers attach tow lines
          </text>
          <path
            d="M 900,36 L 914,50 L 940,28"
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* Card 3 — Alongside ship */}
        <g
          opacity={checkCard3.opacity}
          transform={`translate(60, ${1400 + checkCard3.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={90}
            rx={12}
            fill={COLORS.orange}
            fillOpacity={0.05}
            stroke={COLORS.orange}
            strokeWidth={1.5}
          />
          {/* Ship alongside icon */}
          <path
            d="M 30,50 L 28,55 L 72,55 L 70,50 Z"
            fill={COLORS.orange}
            fillOpacity={0.25}
          />
          <rect
            x={36}
            y={42}
            width={28}
            height={8}
            rx={2}
            fill={COLORS.orange}
            fillOpacity={0.2}
          />
          <rect
            x={42}
            y={34}
            width={16}
            height={8}
            rx={2}
            fill={COLORS.orange}
            fillOpacity={0.15}
          />
          <text
            x={90}
            y={52}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={600}
            fill={COLORS.deep_black}
          >
            Capsule alongside recovery ship
          </text>
          <path
            d="M 900,36 L 914,50 L 940,28"
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* ── Corner accents ── */}
        <CornerAccents color={COLORS.green} opacity={0.4} />

        {/* ── Bottom divider + note ── */}
        <Divider y={1840} opacity={0.1} />
        <text
          x={540}
          y={1870}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={28}
          fontWeight={400}
          fill={COLORS.cool_silver}
          opacity={0.5}
        >
          Full capsule recovery within one hour of splashdown
        </text>

        {/* ── Caption ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
