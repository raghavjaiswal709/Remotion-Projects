/**
 * Scene 02 — TwoCrews
 * "Two crews, same path around the moon, 56 years apart."
 * CSV: 0.000s → 5.840s
 * Duration: 193 frames (6.43s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Scene reveal — label + headline spring up
 *   Phase 2 (20–90): Earth, Moon, orbit path draw, two capsule icons stagger in
 *   Phase 3 (80–end): Capsules float, orbit pulses, year counter ticks
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene02_TwoCrews: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ──
  const earthEntrance = useSpringEntrance(frame, 20);
  const moonEntrance = useSpringEntrance(frame, 32);
  const orbitLength = 600;
  const orbitDash = usePathDraw(frame, 28, orbitLength, 35);
  const capsule1 = useSpringEntrance(frame, 44);
  const capsule2 = useSpringEntrance(frame, 56);
  const yearBadge1 = useSpringEntrance(frame, 65);
  const yearBadge2 = useSpringEntrance(frame, 75);
  const dividerLine = useSpringEntrance(frame, 48);

  // ── Phase 3: Micro-animations ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const yearCount = useCounter(frame, 50, 56, 40);

  // Orbit angle for capsule positions
  const orbitProgress = interpolate(frame, [44, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Ghost background "56" */}
        <text x={540} y={680} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={360} fontWeight={900} fill={COLORS.sky_blue} opacity={0.035}>
          56
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ARTEMIS II · HIDDEN WORLD SECRETS" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Headlines */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={360} fontFamily="'Inter', system-ui, sans-serif" fontSize={72} fontWeight={800} fill={COLORS.deep_black}>
            Two Crews
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={440} fontFamily="'Inter', system-ui, sans-serif" fontSize={48} fontWeight={400} fill={COLORS.sky_blue}>
            Same Path, Different Eras
          </text>
        </g>

        {/* Zone C — Earth (left side) */}
        <g opacity={earthEntrance.opacity} transform={`translate(0, ${earthEntrance.translateY})`}>
          {/* Earth circle */}
          <circle cx={260} cy={780} r={110} fill={COLORS.sky_blue} fillOpacity={0.15} stroke={COLORS.sky_blue} strokeWidth={3} />
          {/* Atmosphere ring */}
          <circle cx={260} cy={780} r={125} fill="none" stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.12} />
          <circle cx={260} cy={780} r={135} fill="none" stroke={COLORS.sky_blue} strokeWidth={0.5} opacity={0.06} />
          {/* Continent shapes */}
          <ellipse cx={240} cy={760} rx={40} ry={30} fill={COLORS.green} fillOpacity={0.3} />
          <ellipse cx={285} cy={800} rx={25} ry={35} fill={COLORS.green} fillOpacity={0.25} />
          <ellipse cx={230} cy={810} rx={18} ry={12} fill={COLORS.green} fillOpacity={0.2} />
          {/* Latitude lines */}
          <ellipse cx={260} cy={750} rx={100} ry={18} fill="none" stroke={COLORS.sky_blue} strokeWidth={0.6} opacity={0.12} />
          <ellipse cx={260} cy={810} rx={100} ry={18} fill="none" stroke={COLORS.sky_blue} strokeWidth={0.6} opacity={0.12} />
          {/* Earth label */}
          <text x={260} y={920} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            EARTH
          </text>
        </g>

        {/* Moon (right side) */}
        <g opacity={moonEntrance.opacity} transform={`translate(0, ${moonEntrance.translateY + breathe})`}>
          <circle cx={820} cy={780} r={70} fill={COLORS.cool_silver} fillOpacity={0.2} stroke={COLORS.cool_silver} strokeWidth={2.5} />
          {/* Crater details */}
          <circle cx={800} cy={765} r={14} fill={COLORS.cool_silver} fillOpacity={0.15} stroke={COLORS.cool_silver} strokeWidth={0.6} />
          <circle cx={835} cy={790} r={10} fill={COLORS.cool_silver} fillOpacity={0.12} stroke={COLORS.cool_silver} strokeWidth={0.5} />
          <circle cx={815} cy={810} r={7} fill={COLORS.cool_silver} fillOpacity={0.1} />
          <circle cx={845} cy={765} r={5} fill={COLORS.cool_silver} fillOpacity={0.08} />
          <circle cx={798} cy={800} r={4} fill={COLORS.cool_silver} fillOpacity={0.06} />
          {/* Surface texture lines */}
          <path d="M 772,770 Q 790,755 810,760" fill="none" stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={0.12} />
          <path d="M 810,800 Q 830,810 850,795" fill="none" stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={0.1} />
          <text x={820} y={880} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            MOON
          </text>
        </g>

        {/* Orbital path — curved arc from Earth to Moon and back */}
        <path
          d="M 370,780 C 500,580 700,580 750,780 C 700,980 500,980 370,780"
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2.5}
          strokeDasharray={orbitLength}
          strokeDashoffset={orbitDash}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Divider between eras */}
        <g opacity={dividerLine.opacity}>
          <line x1={540} y1={1000} x2={540} y2={1600} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.12} />
        </g>

        {/* ── Apollo 8 Capsule (left) ── */}
        <g opacity={capsule1.opacity} transform={`translate(270, ${1080 + capsule1.translateY})`}>
          {/* Capsule body — cone shape */}
          <polygon points="0,-60 -40,40 40,40" fill={COLORS.cool_silver} fillOpacity={0.25} stroke={COLORS.cool_silver} strokeWidth={2} />
          {/* Panel lines */}
          <line x1={-20} y1={-20} x2={-30} y2={30} stroke={COLORS.cool_silver} strokeWidth={0.6} opacity={0.3} />
          <line x1={20} y1={-20} x2={30} y2={30} stroke={COLORS.cool_silver} strokeWidth={0.6} opacity={0.3} />
          {/* Window */}
          <circle cx={0} cy={-5} r={10} fill="none" stroke={COLORS.cool_silver} strokeWidth={1.5} />
          <circle cx={0} cy={-5} r={6} fill={COLORS.sky_blue} fillOpacity={0.08} />
          {/* Rivets */}
          {[-25, -12, 0, 12, 25].map((rx, ri) => (
            <circle key={ri} cx={rx} cy={38} r={1.8} fill={COLORS.cool_silver} opacity={0.3} />
          ))}
          {/* Heat shield base */}
          <rect x={-45} y={40} width={90} height={14} rx={6} fill={COLORS.brown} fillOpacity={0.35} stroke={COLORS.brown} strokeWidth={1} opacity={0.6} />
          {/* Heat shield texture */}
          {[-30, -15, 0, 15, 30].map((tx, ti) => (
            <line key={ti} x1={tx} y1={41} x2={tx} y2={53} stroke={COLORS.brown} strokeWidth={0.5} opacity={0.2} />
          ))}
          <text x={0} y={90} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.deep_black}>
            Apollo 8
          </text>
          <text x={0} y={130} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            3 Astronauts
          </text>
        </g>

        {/* Year badge — 1968 */}
        <g opacity={yearBadge1.opacity} transform={`translate(270, ${1260 + yearBadge1.translateY})`}>
          <rect x={-80} y={-30} width={160} height={60} rx={12} fill={COLORS.cool_silver} fillOpacity={0.08} stroke={COLORS.cool_silver} strokeWidth={1.5} />
          <text x={0} y={12} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={900} fill={COLORS.cool_silver}>
            1968
          </text>
        </g>

        {/* ── Artemis II Capsule (right) ── */}
        <g opacity={capsule2.opacity} transform={`translate(810, ${1080 + capsule2.translateY})`}>
          {/* Orion capsule body — wider cone */}
          <polygon points="0,-65 -50,45 50,45" fill={COLORS.sky_blue} fillOpacity={0.18} stroke={COLORS.sky_blue} strokeWidth={2.5} />
          {/* Panel lines */}
          <line x1={-25} y1={-20} x2={-38} y2={35} stroke={COLORS.sky_blue} strokeWidth={0.7} opacity={0.25} />
          <line x1={0} y1={-60} x2={0} y2={40} stroke={COLORS.sky_blue} strokeWidth={0.5} opacity={0.15} />
          <line x1={25} y1={-20} x2={38} y2={35} stroke={COLORS.sky_blue} strokeWidth={0.7} opacity={0.25} />
          {/* Windows (multiple) */}
          <circle cx={-14} cy={-8} r={8} fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <circle cx={-14} cy={-8} r={5} fill={COLORS.sky_blue} fillOpacity={0.1} />
          <circle cx={14} cy={-8} r={8} fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <circle cx={14} cy={-8} r={5} fill={COLORS.sky_blue} fillOpacity={0.1} />
          {/* Docking ring */}
          <ellipse cx={0} cy={-65} rx={12} ry={4} fill="none" stroke={COLORS.sky_blue} strokeWidth={1.2} opacity={0.4} />
          {/* Rivets along base */}
          {[-35, -20, -5, 10, 25, 40].map((rx, ri) => (
            <circle key={ri} cx={rx} cy={42} r={1.8} fill={COLORS.sky_blue} opacity={0.25} />
          ))}
          {/* Service module */}
          <rect x={-55} y={45} width={110} height={30} rx={4} fill={COLORS.sky_blue} fillOpacity={0.12} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          {/* RCS thruster pods */}
          <rect x={-58} y={50} width={6} height={10} rx={2} fill={COLORS.sky_blue} fillOpacity={0.2} />
          <rect x={52} y={50} width={6} height={10} rx={2} fill={COLORS.sky_blue} fillOpacity={0.2} />
          {/* Solar panels — wider with cell grid */}
          <rect x={-110} y={50} width={48} height={18} rx={2} fill={COLORS.sky_blue} fillOpacity={0.2} stroke={COLORS.sky_blue} strokeWidth={1} />
          <line x1={-98} y1={50} x2={-98} y2={68} stroke={COLORS.sky_blue} strokeWidth={0.4} opacity={0.2} />
          <line x1={-86} y1={50} x2={-86} y2={68} stroke={COLORS.sky_blue} strokeWidth={0.4} opacity={0.2} />
          <line x1={-74} y1={50} x2={-74} y2={68} stroke={COLORS.sky_blue} strokeWidth={0.4} opacity={0.2} />
          <rect x={62} y={50} width={48} height={18} rx={2} fill={COLORS.sky_blue} fillOpacity={0.2} stroke={COLORS.sky_blue} strokeWidth={1} />
          <line x1={74} y1={50} x2={74} y2={68} stroke={COLORS.sky_blue} strokeWidth={0.4} opacity={0.2} />
          <line x1={86} y1={50} x2={86} y2={68} stroke={COLORS.sky_blue} strokeWidth={0.4} opacity={0.2} />
          <line x1={98} y1={50} x2={98} y2={68} stroke={COLORS.sky_blue} strokeWidth={0.4} opacity={0.2} />
          {/* ORION label */}
          <text x={0} y={66} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={14} fontWeight={700} fill={COLORS.sky_blue} opacity={0.4}>
            ORION
          </text>
          <text x={0} y={120} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.deep_black}>
            Artemis II
          </text>
          <text x={0} y={160} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.sky_blue}>
            4 Astronauts
          </text>
        </g>

        {/* Year badge — 2025 */}
        <g opacity={yearBadge2.opacity} transform={`translate(810, ${1260 + yearBadge2.translateY})`}>
          <rect x={-80} y={-30} width={160} height={60} rx={12} fill={COLORS.sky_blue} fillOpacity={0.08} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <text x={0} y={12} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={900} fill={COLORS.sky_blue}>
            2025
          </text>
        </g>

        {/* ── 56 Years counter (center bottom) ── */}
        <g opacity={yearBadge2.opacity} transform={`translate(540, ${1450 + breathe})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={160} fontWeight={900} fill={COLORS.sky_blue} opacity={0.1}>
            {yearCount}
          </text>
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={120} fontWeight={900} fill={COLORS.deep_black}>
            {yearCount}
          </text>
          <text x={0} y={60} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={500} fill={COLORS.cool_silver}>
            YEARS APART
          </text>
        </g>

        {/* Connecting arrow — path draw */}
        <path
          d="M 350,1260 C 440,1350 640,1350 730,1260"
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2}
          strokeDasharray={300}
          strokeDashoffset={usePathDraw(frame, 60, 300, 30)}
          strokeLinecap="round"
          opacity={0.35}
          markerEnd="url(#arrow)"
        />

        {/* Pulsing ring on Artemis capsule */}
        <circle
          cx={810} cy={1080}
          r={interpolate(pulse, [0.985, 1.015], [70, 75])}
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={1.5}
          opacity={shimmer * 0.3 * capsule2.opacity}
        />

        {/* Caption */}
        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1820} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={shimmer * 0.6} letterSpacing="0.12em">
          2 MISSIONS · 1 PATH · 56 YEARS
        </text>

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
