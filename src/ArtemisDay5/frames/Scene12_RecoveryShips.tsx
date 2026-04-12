/**
 * Scene12 — Recovery Ships
 * "Recovery ships are prepositioned before launch day, divers enter the water immediately on contact."
 * CSV: 71.040s → 77.480s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring entrance
 *   Phase 2 (20–100): Large ship, capsule with flotation collar, divers with gear, helicopter, ocean
 *   Phase 3 (80–end): Wave motion, ship sway, rotor spin, diver kick, spray particles
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

export const Scene12_RecoveryShips: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────
  const shipEnt = useSpringEntrance(frame, 22);
  const capsuleEnt = useSpringEntrance(frame, 32);
  const collarEnt = useSpringEntrance(frame, 38);
  const diverEnt1 = useSpringEntrance(frame, 42);
  const diverEnt2 = useSpringEntrance(frame, 50);
  const heliEnt = useSpringEntrance(frame, 28);
  const card1 = useSpringEntrance(frame, 56);
  const card2 = useSpringEntrance(frame, 66);
  const card3 = useSpringEntrance(frame, 76);
  const connectorDraw = usePathDraw(frame, 58, 500, 35);
  const shipBorderDraw = usePathDraw(frame, 22, 1200, 40);
  const collarBorderDraw = usePathDraw(frame, 38, 500, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 5;
  const wave1 = Math.sin(frame * 0.06) * 7;
  const wave2 = Math.sin(frame * 0.07 + 1.2) * 5;
  const wave3 = Math.sin(frame * 0.08 + 2.4) * 4;
  const shipRock = Math.sin(frame * 0.04) * 2.5;
  const shimmer = interpolate(
    Math.sin(frame * 0.035),
    [-1, 1],
    [0.82, 1],
  );
  const rotorAngle = (frame * 18) % 360;
  const diverKick = Math.sin(frame * 0.12) * 8;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  /* ── Layout constants ── */
  const oceanY = 780;
  const SHIP_X = 120;
  const SHIP_W = 440;
  const CAP_X = 740;

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
          y={740}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={200}
          fontWeight={900}
          fill={COLORS.sky_blue}
          opacity={0.035}
        >
          USS
        </text>

        {/* ── Zone A — Section label ── */}
        <g
          transform={`translate(0, ${labelEnt.translateY})`}
          opacity={labelEnt.opacity}
        >
          <SectionLabel
            text="RECOVERY · POST-SPLASHDOWN"
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
            x={60}
            y={380}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64}
            fontWeight={900}
            fill={COLORS.deep_black}
          >
            Recovery Ships
          </text>
        </g>
        <g
          transform={`translate(0, ${headB.translateY})`}
          opacity={headB.opacity}
        >
          <text
            x={60}
            y={448}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36}
            fontWeight={500}
            fill={COLORS.sky_blue}
          >
            Prepositioned Before Launch Day
          </text>
        </g>

        {/* ═══ OCEAN — 3-layer waves + depth fill + spray ═══ */}
        <g opacity={shipEnt.opacity * shimmer}>
          {/* Wave 1 — main surface */}
          <path
            d={`M 0,${oceanY + wave1} Q 180,${oceanY - 10 + wave2} 360,${oceanY + wave1} T 720,${oceanY + wave1} T 1080,${oceanY + wave1}`}
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={3}
            opacity={0.3}
          />
          {/* Wave 2 — mid */}
          <path
            d={`M 0,${oceanY + 18 + wave2} Q 220,${oceanY + 10 + wave3} 440,${oceanY + 18 + wave2} T 880,${oceanY + 18 + wave2} T 1080,${oceanY + 18 + wave2}`}
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={2}
            opacity={0.2}
          />
          {/* Wave 3 — subtle */}
          <path
            d={`M 0,${oceanY + 32 + wave3} Q 270,${oceanY + 25 + wave1} 540,${oceanY + 32 + wave3} T 1080,${oceanY + 32 + wave3}`}
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
            opacity={0.12}
          />
          {/* Depth fill */}
          <rect
            x={0}
            y={oceanY + 35}
            width={1080}
            height={260}
            fill={COLORS.sky_blue}
            fillOpacity={0.06}
          />
          <rect
            x={0}
            y={oceanY + 120}
            width={1080}
            height={175}
            fill={COLORS.sky_blue}
            fillOpacity={0.04}
          />
          {/* Spray particles */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
            const sx = 80 + i * 102;
            const sy =
              oceanY - 4 + Math.sin(frame * 0.09 + i * 0.7) * 6;
            return (
              <circle
                key={`spray-${i}`}
                cx={sx}
                cy={sy}
                r={1.8}
                fill={COLORS.sky_blue}
                opacity={0.15 + Math.sin(frame * 0.06 + i) * 0.08}
              />
            );
          })}
        </g>

        {/* ═══ RECOVERY SHIP — large 440px hull with full details ═══ */}
        <g
          opacity={shipEnt.opacity}
          transform={`translate(${SHIP_X}, ${oceanY - 40 + shipEnt.translateY + breathe}) rotate(${shipRock}, ${SHIP_W / 2}, 20)`}
        >
          {/* Hull — trapezoid */}
          <path
            d={`M 0,0 L -30,55 L ${SHIP_W + 30},55 L ${SHIP_W},0 Z`}
            fill={COLORS.cool_silver}
            fillOpacity={0.15}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
            strokeDasharray={1200}
            strokeDashoffset={shipBorderDraw}
          />
          {/* Hull waterline stripe */}
          <line
            x1={-10}
            y1={40}
            x2={SHIP_W + 10}
            y2={40}
            stroke={COLORS.vibrant_red}
            strokeWidth={3}
            opacity={0.35}
          />
          {/* Hull plate lines */}
          {[0, 1, 2, 3].map(i => (
            <line
              key={`hpl-${i}`}
              x1={60 + i * 100}
              y1={5}
              x2={50 + i * 100}
              y2={50}
              stroke={COLORS.deep_black}
              strokeWidth={1}
              opacity={0.08}
            />
          ))}
          {/* Rivets along hull top */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <circle
              key={`rv-${i}`}
              cx={20 + i * 44}
              cy={2}
              r={2.5}
              fill={COLORS.deep_black}
              opacity={0.12}
            />
          ))}

          {/* Main deck */}
          <rect
            x={20}
            y={-40}
            width={SHIP_W - 40}
            height={40}
            rx={4}
            fill={COLORS.deep_black}
            fillOpacity={0.06}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
          />
          {/* Deck center line */}
          <line
            x1={30}
            y1={-20}
            x2={SHIP_W - 30}
            y2={-20}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.08}
          />

          {/* Bridge / superstructure */}
          <rect
            x={60}
            y={-100}
            width={140}
            height={60}
            rx={4}
            fill={COLORS.deep_black}
            fillOpacity={0.08}
            stroke={COLORS.deep_black}
            strokeWidth={2}
          />
          {/* Bridge windows — 4 panes */}
          {[0, 1, 2, 3].map(i => (
            <rect
              key={`bw-${i}`}
              x={72 + i * 30}
              y={-92}
              width={20}
              height={14}
              rx={2}
              fill={COLORS.sky_blue}
              fillOpacity={0.2}
              stroke={COLORS.sky_blue}
              strokeWidth={1}
            />
          ))}
          {/* Bridge roof */}
          <rect
            x={55}
            y={-108}
            width={150}
            height={10}
            rx={3}
            fill={COLORS.deep_black}
            fillOpacity={0.04}
            stroke={COLORS.deep_black}
            strokeWidth={1}
          />

          {/* Mast + radar dish */}
          <line
            x1={130}
            y1={-108}
            x2={130}
            y2={-160}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
          />
          {/* Radar dish — rotating ellipse */}
          <ellipse
            cx={130}
            cy={-160}
            rx={22}
            ry={6}
            fill={COLORS.cool_silver}
            fillOpacity={0.25}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
            transform={`rotate(${Math.sin(frame * 0.03) * 40}, 130, -160)`}
          />
          {/* Small radar array */}
          <line
            x1={130}
            y1={-160}
            x2={130}
            y2={-175}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
          />
          <circle
            cx={130}
            cy={-178}
            r={4}
            fill={COLORS.vibrant_red}
            opacity={0.4 + Math.sin(frame * 0.1) * 0.2}
          />

          {/* Crane arm (aft section) */}
          <line
            x1={320}
            y1={-40}
            x2={380}
            y2={-120}
            stroke={COLORS.deep_black}
            strokeWidth={3}
            opacity={0.5}
          />
          <line
            x1={380}
            y1={-120}
            x2={420}
            y2={-90}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.4}
          />
          {/* Crane hook */}
          <path
            d="M 420,-90 Q 425,-78 418,-72"
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.4}
          />
          {/* Crane base */}
          <rect
            x={310}
            y={-50}
            width={30}
            height={14}
            rx={3}
            fill={COLORS.deep_black}
            fillOpacity={0.1}
            stroke={COLORS.deep_black}
            strokeWidth={1}
          />

          {/* Smokestacks */}
          <rect
            x={230}
            y={-80}
            width={20}
            height={40}
            rx={3}
            fill={COLORS.deep_black}
            fillOpacity={0.08}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
          />
          <rect
            x={260}
            y={-72}
            width={16}
            height={32}
            rx={3}
            fill={COLORS.deep_black}
            fillOpacity={0.06}
            stroke={COLORS.deep_black}
            strokeWidth={1}
          />

          {/* Ship name on hull */}
          <text
            x={SHIP_W / 2}
            y={32}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28}
            fontWeight={800}
            fill={COLORS.sky_blue}
            letterSpacing="0.12em"
            opacity={0.7}
          >
            USS RECOVERY
          </text>

          {/* Flag at mast top */}
          <rect
            x={132}
            y={-175}
            width={24}
            height={14}
            rx={2}
            fill={COLORS.sky_blue}
            fillOpacity={0.35}
            stroke={COLORS.sky_blue}
            strokeWidth={1}
          />
        </g>

        {/* ═══ CAPSULE with flotation collar ═══ */}
        <g
          opacity={capsuleEnt.opacity}
          transform={`translate(${CAP_X}, ${oceanY - 20 + capsuleEnt.translateY + breathe * 0.6})`}
        >
          {/* Flotation collar — ring around capsule at waterline */}
          <g opacity={collarEnt.opacity}>
            <ellipse
              cx={0}
              cy={40}
              rx={110}
              ry={22}
              fill={COLORS.orange}
              fillOpacity={0.25}
              stroke={COLORS.orange}
              strokeWidth={2.5}
              strokeDasharray={500}
              strokeDashoffset={collarBorderDraw}
            />
            {/* Collar segments */}
            {[0, 1, 2, 3].map(i => {
              const angle = (i * 90 * Math.PI) / 180;
              const cx2 = Math.cos(angle) * 100;
              const cy2 = Math.sin(angle) * 18;
              return (
                <circle
                  key={`cs-${i}`}
                  cx={cx2}
                  cy={40 + cy2}
                  r={4}
                  fill={COLORS.orange}
                  fillOpacity={0.5}
                />
              );
            })}
            <text
              x={0}
              y={70}
              textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={20}
              fontWeight={600}
              fill={COLORS.orange}
              opacity={0.7}
            >
              FLOTATION COLLAR
            </text>
          </g>

          {/* Capsule body — conical */}
          <path
            d="M -60,-50 L -70,20 L -74,40 L 74,40 L 70,20 L 60,-50 Z"
            fill={COLORS.cool_silver}
            fillOpacity={0.2}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
          />
          {/* Panel lines */}
          <line
            x1={0}
            y1={-48}
            x2={0}
            y2={38}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.1}
          />
          <line
            x1={-35}
            y1={-45}
            x2={-40}
            y2={38}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.08}
          />
          <line
            x1={35}
            y1={-45}
            x2={40}
            y2={38}
            stroke={COLORS.deep_black}
            strokeWidth={1}
            opacity={0.08}
          />
          {/* Rivets */}
          {[-45, -25, -5, 15, 35, 55].map((rx, i) => (
            <circle
              key={`crv-${i}`}
              cx={rx - 5}
              cy={-10 + Math.abs(rx) * 0.1}
              r={2}
              fill={COLORS.deep_black}
              opacity={0.12}
            />
          ))}
          {/* Heat shield */}
          <rect
            x={-72}
            y={38}
            width={144}
            height={14}
            rx={7}
            fill={COLORS.brown}
            fillOpacity={0.3}
            stroke={COLORS.brown}
            strokeWidth={1.5}
          />
          {/* Heat shield texture */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={`hst-${i}`}
              x1={-58 + i * 28}
              y1={42}
              x2={-54 + i * 28}
              y2={49}
              stroke={COLORS.brown}
              strokeWidth={1}
              opacity={0.15}
            />
          ))}
          {/* Portholes */}
          <circle
            cx={-28}
            cy={-5}
            r={8}
            fill={COLORS.sky_blue}
            fillOpacity={0.15}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          <circle
            cx={-28}
            cy={-5}
            r={4}
            fill={COLORS.sky_blue}
            fillOpacity={0.08}
          />
          <circle
            cx={28}
            cy={-5}
            r={8}
            fill={COLORS.sky_blue}
            fillOpacity={0.15}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          <circle
            cx={28}
            cy={-5}
            r={4}
            fill={COLORS.sky_blue}
            fillOpacity={0.08}
          />
          {/* Docking ring */}
          <rect
            x={-22}
            y={-58}
            width={44}
            height={10}
            rx={5}
            fill={COLORS.cool_silver}
            fillOpacity={0.2}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
          />
          {/* ORION label */}
          <text
            x={0}
            y={-66}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22}
            fontWeight={800}
            fill={COLORS.orange}
            letterSpacing="0.1em"
          >
            ORION
          </text>
        </g>

        {/* ═══ DIVERS with gear ═══ */}
        {/* Diver 1 — approaching capsule */}
        <g
          opacity={diverEnt1.opacity}
          transform={`translate(${CAP_X - 160}, ${oceanY + 50 + diverEnt1.translateY})`}
        >
          {/* Head with helmet */}
          <circle
            cx={0}
            cy={0}
            r={14}
            fill={COLORS.deep_black}
            fillOpacity={0.12}
            stroke={COLORS.deep_black}
            strokeWidth={2}
          />
          {/* Mask visor */}
          <rect
            x={-8}
            y={-6}
            width={16}
            height={8}
            rx={3}
            fill={COLORS.sky_blue}
            fillOpacity={0.3}
            stroke={COLORS.sky_blue}
            strokeWidth={1}
          />
          {/* Torso */}
          <rect
            x={-10}
            y={14}
            width={20}
            height={30}
            rx={4}
            fill={COLORS.deep_black}
            fillOpacity={0.1}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
          />
          {/* Air tank */}
          <rect
            x={10}
            y={16}
            width={10}
            height={24}
            rx={4}
            fill={COLORS.cool_silver}
            fillOpacity={0.2}
            stroke={COLORS.deep_black}
            strokeWidth={1}
          />
          {/* Air hose */}
          <path
            d="M 15,16 Q 8,8 2,2"
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
            opacity={0.3}
          />
          {/* Arms — reaching */}
          <line
            x1={-10}
            y1={22}
            x2={-26}
            y2={32 + diverKick * 0.3}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          <line
            x1={10}
            y1={22}
            x2={26}
            y2={28}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          {/* Legs with flippers */}
          <line
            x1={-6}
            y1={44}
            x2={-12}
            y2={66 + diverKick}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          <path
            d={`M -12,${66 + diverKick} L -24,${72 + diverKick}`}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3}
            opacity={0.4}
          />
          <line
            x1={6}
            y1={44}
            x2={12}
            y2={66 - diverKick}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          <path
            d={`M 12,${66 - diverKick} L 24,${72 - diverKick}`}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3}
            opacity={0.4}
          />
          {/* Label */}
          <text
            x={0}
            y={-22}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18}
            fontWeight={700}
            fill={COLORS.sky_blue}
          >
            DIVER 1
          </text>
        </g>

        {/* Diver 2 — deeper */}
        <g
          opacity={diverEnt2.opacity}
          transform={`translate(${CAP_X + 140}, ${oceanY + 70 + diverEnt2.translateY})`}
        >
          <circle
            cx={0}
            cy={0}
            r={14}
            fill={COLORS.deep_black}
            fillOpacity={0.12}
            stroke={COLORS.deep_black}
            strokeWidth={2}
          />
          <rect
            x={-8}
            y={-6}
            width={16}
            height={8}
            rx={3}
            fill={COLORS.sky_blue}
            fillOpacity={0.3}
            stroke={COLORS.sky_blue}
            strokeWidth={1}
          />
          <rect
            x={-10}
            y={14}
            width={20}
            height={30}
            rx={4}
            fill={COLORS.deep_black}
            fillOpacity={0.1}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
          />
          <rect
            x={-20}
            y={16}
            width={10}
            height={24}
            rx={4}
            fill={COLORS.cool_silver}
            fillOpacity={0.2}
            stroke={COLORS.deep_black}
            strokeWidth={1}
          />
          <path
            d="M -15,16 Q -8,8 -2,2"
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
            opacity={0.3}
          />
          <line
            x1={-10}
            y1={22}
            x2={-26}
            y2={32}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          <line
            x1={10}
            y1={22}
            x2={26}
            y2={28 - diverKick * 0.3}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          <line
            x1={-6}
            y1={44}
            x2={-12}
            y2={66 - diverKick}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          <path
            d={`M -12,${66 - diverKick} L -24,${72 - diverKick}`}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3}
            opacity={0.4}
          />
          <line
            x1={6}
            y1={44}
            x2={12}
            y2={66 + diverKick}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          <path
            d={`M 12,${66 + diverKick} L 24,${72 + diverKick}`}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3}
            opacity={0.4}
          />
          <text
            x={0}
            y={-22}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18}
            fontWeight={700}
            fill={COLORS.sky_blue}
          >
            DIVER 2
          </text>
        </g>

        {/* ═══ HELICOPTER overhead ═══ */}
        <g
          opacity={heliEnt.opacity}
          transform={`translate(${SHIP_X + SHIP_W / 2}, ${530 + heliEnt.translateY + breathe * 0.4})`}
        >
          {/* Fuselage */}
          <ellipse
            cx={0}
            cy={0}
            rx={50}
            ry={18}
            fill={COLORS.cool_silver}
            fillOpacity={0.15}
            stroke={COLORS.deep_black}
            strokeWidth={2}
          />
          {/* Cockpit window */}
          <ellipse
            cx={38}
            cy={-4}
            rx={16}
            ry={10}
            fill={COLORS.sky_blue}
            fillOpacity={0.2}
            stroke={COLORS.sky_blue}
            strokeWidth={1}
          />
          {/* Tail boom */}
          <line
            x1={-50}
            y1={0}
            x2={-100}
            y2={-10}
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
          />
          {/* Tail rotor */}
          <line
            x1={-100}
            y1={-20}
            x2={-100}
            y2={0}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
            opacity={0.4}
          />
          {/* Tail fin */}
          <path
            d="M -100,-10 L -112,-22 L -90,-22 Z"
            fill={COLORS.deep_black}
            fillOpacity={0.08}
            stroke={COLORS.deep_black}
            strokeWidth={1}
          />
          {/* Landing skids */}
          <line
            x1={-30}
            y1={18}
            x2={30}
            y2={18}
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.3}
          />
          <line
            x1={-20}
            y1={22}
            x2={20}
            y2={22}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
            opacity={0.2}
          />
          {/* Main rotor mast */}
          <line
            x1={0}
            y1={-18}
            x2={0}
            y2={-30}
            stroke={COLORS.deep_black}
            strokeWidth={2}
          />
          {/* Main rotor blades — spinning */}
          <g transform={`rotate(${rotorAngle}, 0, -30)`}>
            <line
              x1={-80}
              y1={-30}
              x2={80}
              y2={-30}
              stroke={COLORS.deep_black}
              strokeWidth={3}
              opacity={0.35}
              strokeLinecap="round"
            />
            <line
              x1={0}
              y1={-110}
              x2={0}
              y2={50}
              stroke={COLORS.deep_black}
              strokeWidth={3}
              opacity={0.35}
              strokeLinecap="round"
            />
          </g>
          {/* Winch line descending */}
          <line
            x1={0}
            y1={18}
            x2={0}
            y2={80}
            stroke={COLORS.deep_black}
            strokeWidth={1.5}
            opacity={0.2}
            strokeDasharray="6 4"
          />
          {/* Label */}
          <text
            x={0}
            y={-44}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20}
            fontWeight={700}
            fill={COLORS.sky_blue}
            opacity={0.7}
          >
            RESCUE HELO
          </text>
        </g>

        {/* ═══ TIMELINE — 3 recovery phases ═══ */}
        {/* Vertical connector line */}
        <line
          x1={110}
          y1={1140}
          x2={110}
          y2={1800}
          stroke={COLORS.deep_black}
          strokeWidth={2}
          opacity={0.08}
          strokeDasharray={500}
          strokeDashoffset={connectorDraw}
        />

        {/* Phase 1 — Pre-positioned */}
        <g
          opacity={card1.opacity}
          transform={`translate(60, ${1140 + card1.translateY})`}
        >
          {/* Icon: ship silhouette */}
          <circle
            cx={50}
            cy={40}
            r={30}
            fill={COLORS.sky_blue}
            fillOpacity={0.1}
            stroke={COLORS.sky_blue}
            strokeWidth={2}
          />
          <path
            d="M 35,42 L 32,50 L 68,50 L 65,42 Z"
            fill={COLORS.sky_blue}
            fillOpacity={0.3}
          />
          <rect
            x={40}
            y={34}
            width={20}
            height={8}
            rx={2}
            fill={COLORS.sky_blue}
            fillOpacity={0.25}
          />
          <line
            x1={50}
            y1={30}
            x2={50}
            y2={34}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          <text
            x={50}
            y={46}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14}
            fontWeight={800}
            fill={COLORS.sky_blue}
          >
            1
          </text>
          {/* Text */}
          <text
            x={110}
            y={28}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            BEFORE LAUNCH
          </text>
          <text
            x={110}
            y={60}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34}
            fontWeight={700}
            fill={COLORS.deep_black}
          >
            Ships prepositioned in Pacific
          </text>
        </g>

        {/* Phase 2 — On contact */}
        <g
          opacity={card2.opacity}
          transform={`translate(60, ${1360 + card2.translateY})`}
        >
          {/* Icon: diver in circle */}
          <circle
            cx={50}
            cy={40}
            r={30}
            fill={COLORS.orange}
            fillOpacity={0.1}
            stroke={COLORS.orange}
            strokeWidth={2}
          />
          {/* Diver icon */}
          <circle cx={50} cy={32} r={6} fill={COLORS.orange} fillOpacity={0.4} />
          <rect
            x={45}
            y={38}
            width={10}
            height={14}
            rx={2}
            fill={COLORS.orange}
            fillOpacity={0.3}
          />
          <line
            x1={42}
            y1={52}
            x2={38}
            y2={58}
            stroke={COLORS.orange}
            strokeWidth={2}
            opacity={0.4}
          />
          <line
            x1={58}
            y1={52}
            x2={62}
            y2={58}
            stroke={COLORS.orange}
            strokeWidth={2}
            opacity={0.4}
          />
          <text
            x={50}
            y={46}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14}
            fontWeight={800}
            fill={COLORS.orange}
          >
            2
          </text>
          <text
            x={110}
            y={28}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            ON CONTACT
          </text>
          <text
            x={110}
            y={60}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34}
            fontWeight={700}
            fill={COLORS.deep_black}
          >
            Divers enter water immediately
          </text>
        </g>

        {/* Phase 3 — Secure */}
        <g
          opacity={card3.opacity}
          transform={`translate(60, ${1580 + card3.translateY})`}
        >
          {/* Icon: checkmark in circle */}
          <circle
            cx={50}
            cy={40}
            r={30}
            fill={COLORS.green}
            fillOpacity={0.1}
            stroke={COLORS.green}
            strokeWidth={2}
          />
          <path
            d="M 38,40 L 46,48 L 62,32"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={50}
            y={58}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14}
            fontWeight={800}
            fill={COLORS.green}
          >
            3
          </text>
          <text
            x={110}
            y={28}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            SECURE
          </text>
          <text
            x={110}
            y={60}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34}
            fontWeight={700}
            fill={COLORS.deep_black}
          >
            Capsule recovery in progress
          </text>
        </g>

        {/* ── Corner accents ── */}
        <CornerAccents color={COLORS.sky_blue} opacity={0.4} />

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
          Navy divers secure capsule within minutes of splashdown
        </text>

        {/* ── Caption ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
