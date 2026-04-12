/**
 * Scene 06 — Apollo8December
 * "In December 1968, Apollo 8 carried three astronauts around the moon and back,"
 * CSV: 23.800s → 30.280s
 * Duration: 212 frames (7.07s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Label, year counter, headline
 *   Phase 2 (20–100): Capsule illustration, moon orbit path draw, 3 astronaut silhouettes
 *   Phase 3 (90–end): Orbit pulses, capsule floats, star field twinkles
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

export const Scene06_Apollo8December: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);
  const yearCounter = useCounter(frame, 8, 1968, 35);

  // ── Phase 2: Build ──
  const moonIllust = useSpringEntrance(frame, 20);
  const earthSmall = useSpringEntrance(frame, 26);
  const orbitLength = 800;
  const orbitDash = usePathDraw(frame, 24, orbitLength, 40);
  const capsuleApollo = useSpringEntrance(frame, 38);
  const crewRow = useSpringEntrance(frame, 50);
  const crew1 = useSpringEntrance(frame, 55);
  const crew2 = useSpringEntrance(frame, 63);
  const crew3 = useSpringEntrance(frame, 71);

  // Info panels
  const panel1 = useSpringEntrance(frame, 65);
  const panel2 = useSpringEntrance(frame, 77);

  // ── Phase 3: Micro ──
  const breathe = Math.sin(frame * 0.06) * 5;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Capsule orbit position (animated along path)
  const capsuleAngle = interpolate(frame, [38, 160], [Math.PI * 1.2, Math.PI * 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.3, 0, 0.7, 1),
  });
  const capsuleX = 540 + Math.cos(capsuleAngle) * 250;
  const capsuleY = 780 + Math.sin(capsuleAngle) * 120;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Ghost background year */}
        <text x={840} y={520} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={360} fontWeight={900} fill={COLORS.sky_blue} opacity={0.03}>
          68
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="DECEMBER 1968 · APOLLO 8" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Year + Headline */}
        <g opacity={headlineA.opacity} transform={`translate(0, ${headlineA.translateY})`}>
          <text x={60} y={370} fontFamily="'Inter', sans-serif" fontSize={96} fontWeight={900} fill={COLORS.cool_silver} opacity={0.12}>
            {yearCounter}
          </text>
          <text x={60} y={365} fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900} fill={COLORS.deep_black}>
            Apollo 8
          </text>
        </g>
        <g opacity={headlineB.opacity} transform={`translate(0, ${headlineB.translateY})`}>
          <text x={60} y={450} fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={500} fill={COLORS.sky_blue}>
            Three astronauts around the moon
          </text>
        </g>

        {/* Zone C — Moon (large, right-center) */}
        <g opacity={moonIllust.opacity} transform={`translate(0, ${moonIllust.translateY})`}>
          <circle cx={700} cy={760} r={160} fill={COLORS.cool_silver} fillOpacity={0.08}
            stroke={COLORS.cool_silver} strokeWidth={2.5} />
          {/* Crater details */}
          <circle cx={660} cy={730} r={25} fill={COLORS.cool_silver} fillOpacity={0.08} stroke={COLORS.cool_silver} strokeWidth={0.8} />
          <circle cx={720} cy={790} r={18} fill={COLORS.cool_silver} fillOpacity={0.06} stroke={COLORS.cool_silver} strokeWidth={0.6} />
          <circle cx={750} cy={720} r={12} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <circle cx={680} cy={810} r={10} fill={COLORS.cool_silver} fillOpacity={0.05} />
          <circle cx={730} cy={850} r={15} fill={COLORS.cool_silver} fillOpacity={0.04} />
          <text x={700} y={960} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            THE MOON
          </text>
        </g>

        {/* Earth (small, far left) */}
        <g opacity={earthSmall.opacity} transform={`translate(0, ${earthSmall.translateY})`}>
          <circle cx={200} cy={800} r={50} fill={COLORS.sky_blue} fillOpacity={0.06} stroke={COLORS.sky_blue} strokeWidth={2} />
          <ellipse cx={190} cy={790} rx={18} ry={14} fill={COLORS.green} fillOpacity={0.15} />
          <text x={200} y={870} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.cool_silver}>
            EARTH
          </text>
        </g>

        {/* Free-return orbit path: Earth → around Moon → back */}
        <path
          d="M 250,800 C 350,600 600,550 700,600 C 900,600 860,760 700,760 C 600,900 350,900 250,800"
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2}
          strokeDasharray={orbitLength}
          strokeDashoffset={orbitDash}
          strokeLinecap="round"
          opacity={0.35}
        />

        {/* Moving capsule along orbit */}
        <g opacity={capsuleApollo.opacity}>
          <polygon
            points={`${capsuleX},${capsuleY - 16} ${capsuleX - 10},${capsuleY + 8} ${capsuleX + 10},${capsuleY + 8}`}
            fill={COLORS.cool_silver} fillOpacity={0.3}
            stroke={COLORS.cool_silver} strokeWidth={1.5}
          />
          {/* Capsule glow ring */}
          <circle cx={capsuleX} cy={capsuleY} r={20}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1}
            opacity={shimmer * 0.3} />
        </g>

        {/* ── Three crew silhouettes ── */}
        <g opacity={crewRow.opacity} transform={`translate(0, ${crewRow.translateY})`}>
          <text x={540} y={1060} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            CREW OF THREE
          </text>
        </g>

        {/* Crew member 1 — Borman */}
        <g opacity={crew1.opacity} transform={`translate(270, ${1140 + crew1.translateY})`}>
          {/* Head */}
          <circle cx={0} cy={0} r={30} fill={COLORS.deep_black} fillOpacity={0.06} stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          {/* Helmet */}
          <path d="M -32,-10 C -32,-35 32,-35 32,-10" fill="none" stroke={COLORS.cool_silver} strokeWidth={2} opacity={0.4} />
          {/* Body */}
          <rect x={-22} y={35} width={44} height={60} rx={8} fill={COLORS.deep_black} fillOpacity={0.04} stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.4} />
          <text x={0} y={130} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            Borman
          </text>
        </g>

        {/* Crew member 2 — Lovell */}
        <g opacity={crew2.opacity} transform={`translate(540, ${1140 + crew2.translateY})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.deep_black} fillOpacity={0.06} stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          <path d="M -32,-10 C -32,-35 32,-35 32,-10" fill="none" stroke={COLORS.cool_silver} strokeWidth={2} opacity={0.4} />
          <rect x={-22} y={35} width={44} height={60} rx={8} fill={COLORS.deep_black} fillOpacity={0.04} stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.4} />
          <text x={0} y={130} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            Lovell
          </text>
        </g>

        {/* Crew member 3 — Anders */}
        <g opacity={crew3.opacity} transform={`translate(810, ${1140 + crew3.translateY})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.deep_black} fillOpacity={0.06} stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          <path d="M -32,-10 C -32,-35 32,-35 32,-10" fill="none" stroke={COLORS.cool_silver} strokeWidth={2} opacity={0.4} />
          <rect x={-22} y={35} width={44} height={60} rx={8} fill={COLORS.deep_black} fillOpacity={0.04} stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.4} />
          <text x={0} y={130} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            Anders
          </text>
        </g>

        {/* Info panels */}
        <g opacity={panel1.opacity} transform={`translate(60, ${1380 + panel1.translateY})`}>
          <rect x={0} y={0} width={460} height={100} rx={12} fill={COLORS.cool_silver} fillOpacity={0.06} stroke={COLORS.cool_silver} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.cool_silver} />
          <text x={24} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            No landing — just a loop
          </text>
          <text x={24} y={76} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Prove the journey survivable
          </text>
        </g>

        <g opacity={panel2.opacity} transform={`translate(560, ${1380 + panel2.translateY})`}>
          <rect x={0} y={0} width={460} height={100} rx={12} fill={COLORS.sky_blue} fillOpacity={0.06} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.sky_blue} />
          <text x={24} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            Free return trajectory
          </text>
          <text x={24} y={76} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Gravity slingshot home
          </text>
        </g>

        {/* Star field */}
        {Array.from({ length: 12 }, (_, i) => {
          const sx = 80 + (i * 89) % 920;
          const sy = 560 + (i * 137) % 400;
          return (
            <circle key={i} cx={sx} cy={sy} r={1.5 + (i % 3) * 0.5}
              fill={COLORS.sky_blue}
              opacity={interpolate(Math.sin(frame * 0.04 + i * 0.7), [-1, 1], [0.1, 0.35])} />
          );
        })}

        {/* Pulsing ring around moon */}
        <circle cx={700} cy={760} r={interpolate(pulse, [0.988, 1.012], [158, 168])}
          fill="none" stroke={COLORS.cool_silver} strokeWidth={1} opacity={shimmer * 0.2} />

        {/* Bottom timeline marker */}
        <g opacity={panel2.opacity * shimmer}>
          <text x={540} y={1600} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.15em">
            DECEMBER 21 – 27, 1968
          </text>
        </g>

        {/* Caption */}
        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1820} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={shimmer * 0.6} letterSpacing="0.12em">
          3 ASTRONAUTS · DECEMBER 1968 · AROUND THE MOON
        </text>

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
