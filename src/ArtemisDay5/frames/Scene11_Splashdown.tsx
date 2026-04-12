/**
 * Scene11 — Splashdown Speed
 * "By the moment of splashdown, Orion is descending at under 10 meters per second."
 * CSV: 65.300s → 70.420s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring entrance
 *   Phase 2 (20–90): Speed counter, detailed gauge with 3 zones, capsule + multi-layer ocean
 *   Phase 3 (80–end): Ocean shimmer, capsule float, gauge pulse, spray particles
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

function useCounterDown(frame: number, startFrame: number, startVal: number, endVal: number, durationFrames = 50) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [startVal, endVal], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene11_Splashdown: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 (0–30) ────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2 (20–90) ───────────────────────────────────────────────────────
  const heroNumber = useSpringEntrance(frame, 18);
  const speedValue = useCounterDown(frame, 20, 11111, 10, 60);
  const gaugeEnt = useSpringEntrance(frame, 32);
  const gaugeDraw = usePathDraw(frame, 34, 520, 30);
  const capsuleEnt = useSpringEntrance(frame, 44);
  const safeCard = useSpringEntrance(frame, 58);
  const missionCard = useSpringEntrance(frame, 68);
  const bottomNote = useSpringEntrance(frame, 78);

  // ── Phase 3 (80–end) ──────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 5;
  const sway = Math.sin(frame * 0.04) * 3;
  const wave1 = Math.sin(frame * 0.06) * 8;
  const wave2 = Math.sin(frame * 0.07 + 1.5) * 6;
  const wave3 = Math.sin(frame * 0.055 + 3.0) * 5;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.82, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  const displaySpeed = speedValue > 100 ? `${Math.round(speedValue / 1000)}k` : `${speedValue}`;
  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  // ── Gauge geometry ────────────────────────────────────────────────────────
  const GX = 540, GY = 860, GR = 180;
  const startAngle = -135;
  const endAngle = 135;
  const totalSweep = endAngle - startAngle; // 270 degrees
  const needleAngle = interpolate(speedValue, [0, 100], [startAngle, endAngle], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Arc helper: convert angle to x,y on circle
  const arcPt = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
  };

  // SVG arc path from a1 to a2 on radius r
  const arcPath = (a1: number, a2: number, r: number) => {
    const p1 = arcPt(a1 - 90, r); // offset -90 so 0=top
    const p2 = arcPt(a2 - 90, r);
    const sweep = a2 - a1;
    const large = sweep > 180 ? 1 : 0;
    return `M ${p1.x},${p1.y} A ${r},${r} 0 ${large} 1 ${p2.x},${p2.y}`;
  };

  // 3 gauge zones: SAFE (green 0–30%), MODERATE (amber 30–70%), DANGER (red 70–100%)
  const zoneAngles = [
    { from: startAngle, to: startAngle + totalSweep * 0.3, color: COLORS.green },
    { from: startAngle + totalSweep * 0.3, to: startAngle + totalSweep * 0.7, color: COLORS.amber },
    { from: startAngle + totalSweep * 0.7, to: endAngle, color: COLORS.vibrant_red },
  ];

  // Tick marks at 0, 10, 20, 30, 50, 70, 100
  const ticks = [
    { val: 0, label: '0' }, { val: 10, label: '10' },
    { val: 20, label: '20' }, { val: 30, label: '30' },
    { val: 50, label: '50' }, { val: 70, label: '70' },
    { val: 100, label: '100' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.green} />

        {/* Ghost "<10" background */}
        <text x={540} y={620} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={300} fontWeight={900}
          fill={COLORS.green} opacity={0.035 * shimmer}>
          {'<'}10
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SPLASHDOWN · FINAL DESCENT" y={260} opacity={0.55} />
        </g>

        {/* Zone B headline */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={900} fill={COLORS.deep_black}>
            {'Under '}
          </text>
          <text x={360} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={900} fill={COLORS.green}>
            10 m/s
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={440} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={500} fill={COLORS.cool_silver}>
            Orion descending at safe velocity
          </text>
        </g>

        {/* ── Hero speed counter ──────────────────────────────────────────── */}
        <g opacity={heroNumber.opacity}
          transform={`translate(540, ${570 + heroNumber.translateY})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={200} fontWeight={900}
            fill={COLORS.green} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            {displaySpeed}
          </text>
          <text x={0} y={65} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={500} fill={COLORS.cool_silver}>
            m/s
          </text>
          {/* Green underline */}
          <line x1={-120} y1={85} x2={120} y2={85}
            stroke={COLORS.green} strokeWidth={3} opacity={0.3} />
        </g>

        {/* ── Detailed speed gauge with 3 zones ───────────────────────────── */}
        <g opacity={gaugeEnt.opacity}
          transform={`translate(${GX}, ${GY + gaugeEnt.translateY})`}>

          {/* Background track */}
          <path d={arcPath(startAngle, endAngle, GR)}
            fill="none" stroke={COLORS.deep_black} strokeWidth={22} opacity={0.05}
            strokeLinecap="round" />

          {/* 3 colored arc zones */}
          {zoneAngles.map((zone, i) => (
            <path key={`zone-${i}`} d={arcPath(zone.from, zone.to, GR)}
              fill="none" stroke={zone.color} strokeWidth={18} opacity={0.25}
              strokeLinecap={i === 0 ? 'round' : i === 2 ? 'round' : 'butt'}
              strokeDasharray={520} strokeDashoffset={gaugeDraw} />
          ))}

          {/* Inner thin ring */}
          <path d={arcPath(startAngle, endAngle, GR - 18)}
            fill="none" stroke={COLORS.deep_black} strokeWidth={1} opacity={0.06} />

          {/* Tick marks */}
          {ticks.map((tick, i) => {
            const pct = tick.val / 100;
            const ang = startAngle + pct * totalSweep - 90;
            const rad = (ang * Math.PI) / 180;
            const inner = GR - 26;
            const outer = GR + 6;
            const labelR = GR + 28;
            return (
              <g key={`tick-${i}`}>
                <line
                  x1={inner * Math.cos(rad)} y1={inner * Math.sin(rad)}
                  x2={outer * Math.cos(rad)} y2={outer * Math.sin(rad)}
                  stroke={COLORS.deep_black} strokeWidth={2} opacity={0.2}
                  strokeLinecap="round" />
                <text
                  x={labelR * Math.cos(rad)} y={labelR * Math.sin(rad) + 5}
                  textAnchor="middle"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={18} fontWeight={600}
                  fill={COLORS.deep_black} opacity={0.35}>
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Needle */}
          <line x1={0} y1={0}
            x2={0} y2={-(GR - 30)}
            stroke={COLORS.vibrant_red} strokeWidth={3.5} strokeLinecap="round"
            transform={`rotate(${needleAngle})`}
            style={{ transformOrigin: '0px 0px' }} />

          {/* Center hub */}
          <circle cx={0} cy={0} r={14}
            fill={COLORS.deep_black} fillOpacity={0.15}
            stroke={COLORS.deep_black} strokeWidth={2.5} opacity={0.3} />
          <circle cx={0} cy={0} r={6} fill={COLORS.vibrant_red} opacity={0.6} />

          {/* Digital readout */}
          <rect x={-50} y={52} width={100} height={40} rx={8}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={1.5} opacity={0.5} />
          <text x={0} y={80} textAnchor="middle"
            fontFamily="'Fira Code', monospace"
            fontSize={24} fontWeight={700}
            fill={COLORS.green} opacity={0.7}>
            {displaySpeed}
          </text>

          {/* Zone labels */}
          <text x={-(GR - 48)} y={78}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={600} fill={COLORS.green} opacity={0.5}>
            SAFE
          </text>
          <text x={(GR - 58)} y={78}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={600} fill={COLORS.vibrant_red} opacity={0.5}>
            FATAL
          </text>
        </g>

        {/* ── Capsule with parachute above ocean ──────────────────────────── */}
        <g opacity={capsuleEnt.opacity}
          transform={`translate(${540 + sway}, ${1200 + capsuleEnt.translateY + breathe})`}>

          {/* Single main parachute canopy */}
          <path d="M -110,-230 C -145,-140 -90,-80 0,-65 C 90,-80 145,-140 110,-230 C 70,-260 -70,-260 -110,-230 Z"
            fill={COLORS.orange} fillOpacity={0.12}
            stroke={COLORS.orange} strokeWidth={2.5} />
          {/* Panel dividers */}
          <line x1={0} y1={-255} x2={0} y2={-68} stroke={COLORS.orange} strokeWidth={1} opacity={0.15} />
          <line x1={-60} y1={-240} x2={-48} y2={-72} stroke={COLORS.orange} strokeWidth={0.8} opacity={0.1} />
          <line x1={60} y1={-240} x2={48} y2={-72} stroke={COLORS.orange} strokeWidth={0.8} opacity={0.1} />
          {/* Vent hole */}
          <ellipse cx={0} cy={-250} rx={12} ry={6}
            fill={COLORS.bg_paper} stroke={COLORS.orange} strokeWidth={1.5} opacity={0.4} />
          {/* 4 suspension lines */}
          <line x1={-70} y1={-85} x2={-40} y2={8} stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.18} />
          <line x1={-25} y1={-70} x2={-12} y2={8} stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.18} />
          <line x1={25} y1={-70} x2={12} y2={8} stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.18} />
          <line x1={70} y1={-85} x2={40} y2={8} stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.18} />

          {/* Capsule body */}
          <path d="M 0,-42 L -60,28 L -70,72 L -76,92 L 76,92 L 70,72 L 60,28 Z"
            fill={COLORS.cool_silver} fillOpacity={0.12}
            stroke={COLORS.deep_black} strokeWidth={2.5} />
          {/* Panel lines */}
          <line x1={-28} y1={-18} x2={-48} y2={60} stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.08} />
          <line x1={28} y1={-18} x2={48} y2={60} stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.08} />
          {/* Rivets */}
          {Array.from({length: 6}, (_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return <circle key={`r-${i}`} cx={Math.cos(a) * 32} cy={Math.sin(a) * 10 + 12}
              r={2} fill={COLORS.deep_black} fillOpacity={0.08} />;
          })}
          {/* Heat shield */}
          <rect x={-76} y={92} width={152} height={14} rx={5}
            fill={COLORS.brown} fillOpacity={0.25}
            stroke={COLORS.brown} strokeWidth={2} />
          {/* Portholes */}
          <ellipse cx={-20} cy={0} rx={11} ry={8}
            fill={COLORS.sky_blue} fillOpacity={0.15}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <ellipse cx={20} cy={0} rx={11} ry={8}
            fill={COLORS.sky_blue} fillOpacity={0.15}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
        </g>

        {/* ── Multi-layer ocean ───────────────────────────────────────────── */}
        <g opacity={capsuleEnt.opacity * shimmer}>
          <path d={`M 0,${1408 + wave1} Q 180,${1396 + wave2} 360,${1408 + wave1} T 720,${1408 + wave1} T 1080,${1408 + wave1}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={3} opacity={0.25} />
          <path d={`M 0,${1422 + wave2} Q 200,${1412 + wave1} 400,${1422 + wave2} T 800,${1422 + wave2} T 1080,${1422 + wave2}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.18} />
          <path d={`M 0,${1436 + wave3} Q 160,${1428 + wave2} 340,${1436 + wave3} T 700,${1436 + wave3} T 1080,${1436 + wave3}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.12} />
          {/* Depth fill */}
          <rect x={0} y={1445} width={1080} height={100}
            fill={COLORS.sky_blue} fillOpacity={0.035} />
          {/* Spray particles */}
          {Array.from({ length: 8 }, (_, i) => {
            const sx = 180 + i * 90 + Math.sin(frame * 0.1 + i) * 12;
            const sy = 1395 + Math.sin(frame * 0.12 + i * 1.3) * 8;
            return <circle key={`sp-${i}`} cx={sx} cy={sy} r={2}
              fill={COLORS.sky_blue} opacity={0.12 * shimmer} />;
          })}
        </g>

        {/* ── Info cards ──────────────────────────────────────────────────── */}
        <g opacity={safeCard.opacity}
          transform={`translate(60, ${1560 + safeCard.translateY})`}>
          <rect x={0} y={0} width={450} height={90} rx={12}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.green} />
          {/* Shield + checkmark icon */}
          <g transform="translate(36, 45)">
            <path d="M 0,-14 L -12,0 L -10,14 L 0,18 L 10,14 L 12,0 Z"
              fill={COLORS.green} fillOpacity={0.2}
              stroke={COLORS.green} strokeWidth={1.5} />
            <path d="M -4,2 L -1,6 L 5,-3"
              fill="none" stroke={COLORS.green} strokeWidth={2} strokeLinecap="round" />
          </g>
          <text x={70} y={38}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            VELOCITY
          </text>
          <text x={70} y={68}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Safe descent speed
          </text>
        </g>

        <g opacity={missionCard.opacity}
          transform={`translate(540, ${1560 + missionCard.translateY})`}>
          <rect x={0} y={0} width={450} height={90} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.sky_blue} />
          {/* Parachute checkmark icon */}
          <g transform="translate(36, 45)">
            <path d="M -10,-10 C -16,-2 -12,8 0,12 C 12,8 16,-2 10,-10 C 4,-14 -4,-14 -10,-10 Z"
              fill={COLORS.sky_blue} fillOpacity={0.2}
              stroke={COLORS.sky_blue} strokeWidth={1.5} />
            <path d="M -3,1 L 0,5 L 5,-2"
              fill="none" stroke={COLORS.sky_blue} strokeWidth={2} strokeLinecap="round" />
          </g>
          <text x={70} y={38}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            STATUS
          </text>
          <text x={70} y={68}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Parachute mission done
          </text>
        </g>

        {/* ── Bottom divider + note ───────────────────────────────────────── */}
        <g opacity={bottomNote.opacity}>
          <line x1={200} y1={1690} x2={880} y2={1690}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />
          <text x={540} y={1734} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={0.6}>
            Slower than an Olympic sprinter
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
