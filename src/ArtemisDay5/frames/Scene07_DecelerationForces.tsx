/**
 * Scene07 — Deceleration Forces
 * "At that speed, hitting solid ground, even with parachutes fully deployed,
 *  produces deceleration forces no human spine survives reliably."
 * CSV: 36.220s → 45.860s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline reveal with per-word spring
 *   Phase 2 (20–100): Detailed spine diagram, G-force gauge with needle sweep, ground vs water comparison bars
 *   Phase 3 (80–end): Gauge needle oscillates, spine glows red, breathing on all elements
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene07_DecelerationForces: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ──
  const spineEnt = useSpringEntrance(frame, 22);
  const gaugeEnt = useSpringEntrance(frame, 34);
  const gForce = useCounter(frame, 38, 160, 45);
  const groundBar = useSpringEntrance(frame, 50);
  const waterBar = useSpringEntrance(frame, 62);
  const warningEnt = useSpringEntrance(frame, 74);
  const forceArrowDraw = usePathDraw(frame, 26, 280, 25);
  const groundBarDraw = usePathDraw(frame, 52, 700, 30);
  const waterBarDraw = usePathDraw(frame, 64, 300, 25);
  const gaugeBorderDraw = usePathDraw(frame, 36, 320, 30);

  // ── Phase 3: Micro-animations ──
  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const spineGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.15, 0.35]);
  const needleOscillate = Math.sin(frame * 0.12) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <g opacity={labelEnt.opacity * 0.4}>
          <path d="M 60,220 L 60,280 M 60,220 L 120,220" fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,220 L 1020,280 M 1020,220 L 960,220" fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="IMPACT PHYSICS · SURVIVAL" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={900} fill={COLORS.deep_black}>
            Deceleration
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={445} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={900} fill={COLORS.vibrant_red}>
            Forces
          </text>
          <text x={310} y={445} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={400} fill={COLORS.cool_silver}>
            on the human body
          </text>
        </g>

        {/* ── Detailed spine illustration (left side, y=520–940) ── */}
        <g opacity={spineEnt.opacity}
          transform={`translate(220, ${540 + spineEnt.translateY})`}>
          {/* Skull (simplified) */}
          <ellipse cx={0} cy={-30} rx={35} ry={40}
            fill={COLORS.cool_silver} fillOpacity={0.15}
            stroke={COLORS.deep_black} strokeWidth={2} opacity={0.6} />
          <circle cx={-10} cy={-35} r={5} fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.3} />
          <circle cx={10} cy={-35} r={5} fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.3} />
          {/* Spine — 12 vertebrae stacked */}
          {Array.from({ length: 12 }, (_, i) => {
            const w = 28 - Math.abs(i - 5) * 1.5;
            const y = i * 34 + 15;
            return (
              <g key={i}>
                {/* Vertebra body */}
                <rect x={-w} y={y} width={w * 2} height={24} rx={5}
                  fill={COLORS.vibrant_red} fillOpacity={spineGlow}
                  stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.6} />
                {/* Spinous process (rear spike) */}
                <line x1={0} y1={y + 12} x2={-18} y2={y + 6}
                  stroke={COLORS.deep_black} strokeWidth={1} opacity={0.25} />
                <line x1={0} y1={y + 12} x2={18} y2={y + 6}
                  stroke={COLORS.deep_black} strokeWidth={1} opacity={0.25} />
                {/* Disk between vertebrae */}
                {i < 11 && (
                  <ellipse cx={0} cy={y + 27} rx={w - 2} ry={4}
                    fill={COLORS.sky_blue} fillOpacity={0.1}
                    stroke={COLORS.sky_blue} strokeWidth={0.5} opacity={0.3} />
                )}
              </g>
            );
          })}
          {/* Pelvis base */}
          <path d="M -40,430 C -50,445 -30,460 0,460 C 30,460 50,445 40,430"
            fill={COLORS.cool_silver} fillOpacity={0.12}
            stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.4} />
          {/* SPINE label */}
          <text x={0} y={-80} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            HUMAN SPINE
          </text>
          {/* Danger indicator */}
          <text x={0} y={495} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600} fill={COLORS.vibrant_red} opacity={shimmer}>
            COMPRESSION FAILURE ZONE
          </text>
        </g>

        {/* Force arrows pointing down at spine */}
        <path d="M 220,470 L 220,520"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
          strokeDasharray={280} strokeDashoffset={forceArrowDraw}
          markerEnd="url(#arrow)" />
        {/* Side force arrows */}
        <path d="M 160,500 L 185,530"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
          strokeDasharray={60} strokeDashoffset={forceArrowDraw * 0.2}
          opacity={0.5} />
        <path d="M 280,500 L 255,530"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
          strokeDasharray={60} strokeDashoffset={forceArrowDraw * 0.2}
          opacity={0.5} />

        {/* ── G-Force gauge (right side, large) ── */}
        <g opacity={gaugeEnt.opacity}
          transform={`translate(740, ${720 + gaugeEnt.translateY})`}>
          {/* Gauge background arc */}
          <path d="M -130,0 A 130,130 0 0 1 130,0"
            fill="none" stroke={COLORS.deep_black} strokeWidth={3} opacity={0.1}
            strokeDasharray={320} strokeDashoffset={gaugeBorderDraw} />
          {/* Safe zone (green arc — left portion) */}
          <path d="M -130,0 A 130,130 0 0 1 -65,-112"
            fill="none" stroke={COLORS.green} strokeWidth={12} opacity={0.2} />
          {/* Warning zone (amber arc) */}
          <path d="M -65,-112 A 130,130 0 0 1 65,-112"
            fill="none" stroke={COLORS.amber} strokeWidth={12} opacity={0.2} />
          {/* Danger zone (red arc — right portion) */}
          <path d="M 65,-112 A 130,130 0 0 1 130,0"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={12} opacity={0.3 * shimmer} />
          {/* Tick marks */}
          {[0, 40, 80, 120, 160].map((val, i) => {
            const angle = interpolate(val, [0, 160], [-180, 0]);
            const rad = (angle * Math.PI) / 180;
            const inner = 110;
            const outer = 130;
            return (
              <g key={i}>
                <line
                  x1={Math.cos(rad) * inner} y1={Math.sin(rad) * inner}
                  x2={Math.cos(rad) * outer} y2={Math.sin(rad) * outer}
                  stroke={COLORS.deep_black} strokeWidth={2} opacity={0.4} />
                <text
                  x={Math.cos(rad) * 96} y={Math.sin(rad) * 96 + 5}
                  textAnchor="middle" fontFamily="'Inter', sans-serif"
                  fontSize={18} fontWeight={600} fill={COLORS.cool_silver}>
                  {val}
                </text>
              </g>
            );
          })}
          {/* Needle */}
          {(() => {
            const angle = interpolate(gForce, [0, 160], [-180, 0], { extrapolateRight: 'clamp' }) + needleOscillate;
            const rad = (angle * Math.PI) / 180;
            return (
              <line x1={0} y1={0} x2={Math.cos(rad) * 100} y2={Math.sin(rad) * 100}
                stroke={COLORS.vibrant_red} strokeWidth={3.5}
                strokeLinecap="round" />
            );
          })()}
          {/* Center pivot */}
          <circle cx={0} cy={0} r={10} fill={COLORS.vibrant_red} />
          <circle cx={0} cy={0} r={5} fill={COLORS.bg_paper} />
          {/* Digital readout */}
          <text x={0} y={55} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={900} fill={COLORS.vibrant_red}
            style={{ transform: `scale(${pulse})`, transformOrigin: '0px 55px' }}>
            {gForce}G
          </text>
          <text x={0} y={88} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            GROUND IMPACT
          </text>
          {/* G label */}
          <text x={0} y={-145} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.deep_black} opacity={0.6}>
            G-FORCE METER
          </text>
        </g>

        {/* ── Comparison bars (y=1120–1350) ── */}
        {/* Ground impact bar */}
        <g opacity={groundBar.opacity}
          transform={`translate(60, ${1140 + groundBar.translateY})`}>
          <text x={0} y={0} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            GROUND IMPACT
          </text>
          <rect x={0} y={16} width={800} height={44} rx={8}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={700} strokeDashoffset={groundBarDraw} />
          <rect x={0} y={16} width={interpolate(frame, [52, 82], [0, 800], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })} height={44} rx={8}
            fill={COLORS.vibrant_red} fillOpacity={0.3} />
          {/* Skull/danger icon inside bar */}
          <text x={820} y={48} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            FATAL
          </text>
        </g>

        {/* Water impact bar */}
        <g opacity={waterBar.opacity}
          transform={`translate(60, ${1270 + waterBar.translateY})`}>
          <text x={0} y={0} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            WATER IMPACT
          </text>
          <rect x={0} y={16} width={300} height={44} rx={8}
            fill="none" stroke={COLORS.green} strokeWidth={2}
            strokeDasharray={300} strokeDashoffset={waterBarDraw} />
          <rect x={0} y={16} width={interpolate(frame, [64, 88], [0, 300], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })} height={44} rx={8}
            fill={COLORS.green} fillOpacity={0.3} />
          {/* Checkmark icon */}
          <path d="M 320,30 L 334,46 L 356,20"
            fill="none" stroke={COLORS.green} strokeWidth={3} strokeLinecap="round" />
          <text x={370} y={48} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={800} fill={COLORS.green}>
            SURVIVABLE
          </text>
        </g>

        {/* ── Warning card ── */}
        <g opacity={warningEnt.opacity}
          transform={`translate(60, ${1420 + warningEnt.translateY + breathe})`}>
          <rect x={0} y={0} width={960} height={100} rx={14}
            fill={COLORS.vibrant_red} fillOpacity={0.06}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Warning triangle icon */}
          <polygon points="50,20 30,60 70,60"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5} />
          <text x={50} y={52} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={900} fill={COLORS.vibrant_red}>
            !
          </text>
          <text x={100} y={60} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            No human spine survives ground impact reliably
          </text>
        </g>

        {/* ── Parachute note (even with chutes deployed) ── */}
        <g opacity={warningEnt.opacity * 0.6}>
          <line x1={60} y1={1560} x2={1020} y2={1560}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />
          <text x={540} y={1600} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            Even with parachutes fully deployed
          </text>
          {/* Small parachute icon */}
          <path d="M 540,1630 C 520,1615 510,1640 530,1650 L 540,1645 L 550,1650 C 570,1640 560,1615 540,1630 Z"
            fill={COLORS.orange} fillOpacity={0.3} stroke={COLORS.orange} strokeWidth={1.5} />
          <line x1={532} y1={1648} x2={540} y2={1680} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.3} />
          <line x1={548} y1={1648} x2={540} y2={1680} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.3} />
          {/* Tiny capsule */}
          <path d="M 534,1680 L 536,1670 L 544,1670 L 546,1680 Z"
            fill={COLORS.cool_silver} fillOpacity={0.3} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.4} />
        </g>

        {/* Corner accents bottom */}
        <g opacity={warningEnt.opacity * 0.3}>
          <path d="M 60,1850 L 60,1790 M 60,1850 L 120,1850" fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,1850 L 1020,1790 M 1020,1850 L 960,1850" fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
