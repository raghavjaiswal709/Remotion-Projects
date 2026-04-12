/**
 * Scene 04 — DayThreeCard
 * "This is day three of resolving hidden secrets around the world."
 * CSV: 9.820s → 14.160s
 * Duration: 148 frames (4.93s)
 *
 * Animation phases:
 *   Phase 1 (0–30): "DAY 3" number springs in huge, globe icon appears
 *   Phase 2 (20–80): Supporting text staggered, world ring draws
 *   Phase 3 (70–end): Globe rotates slowly, ring pulses
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

export const Scene04_DayThreeCard: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Big number entrance ──
  const dayNumSpring = spring({ frame, fps, config: { damping: 14, stiffness: 200, mass: 0.7 } });
  const dayNumScale = interpolate(dayNumSpring, [0, 1], [0.3, 1]);
  const dayNumOp = interpolate(dayNumSpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  const labelEntrance = useSpringEntrance(frame, 0);
  const subtitleA = useSpringEntrance(frame, 10);
  const subtitleB = useSpringEntrance(frame, 18);

  // ── Phase 2: Globe and ring ──
  const globeEntrance = useSpringEntrance(frame, 24);
  const ringCircumference = 2 * Math.PI * 200;
  const ringDash = usePathDraw(frame, 30, ringCircumference, 40);

  // Supporting lines
  const line1 = useSpringEntrance(frame, 40);
  const line2 = useSpringEntrance(frame, 50);
  const line3 = useSpringEntrance(frame, 60);

  // Decorative elements
  const star1 = useSpringEntrance(frame, 35);
  const star2 = useSpringEntrance(frame, 45);
  const star3 = useSpringEntrance(frame, 55);

  // ── Phase 3: Micro-animations ──
  const breathe = Math.sin(frame * 0.05) * 5;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.012;
  const globeRotation = frame * 0.3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Day counter tick
  const dayCount = useCounter(frame, 5, 3, 25);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="HIDDEN WORLD SECRETS" y={260} opacity={0.55} />
        </g>

        {/* Zone B — DAY badge */}
        <g opacity={subtitleA.opacity} transform={`translate(0, ${subtitleA.translateY})`}>
          <text x={540} y={380} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.15em">
            RESOLVING HIDDEN SECRETS
          </text>
        </g>

        {/* Big DAY number */}
        <g opacity={dayNumOp} transform={`translate(540, 620) scale(${dayNumScale})`} style={{ transformOrigin: '540px 620px' }}>
          {/* Ghost layer */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={320} fontWeight={900} fill={COLORS.sky_blue} opacity={0.08}>
            {dayCount}
          </text>
          {/* Main number */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={280} fontWeight={900} fill={COLORS.sky_blue}>
            {dayCount}
          </text>
        </g>
        <g opacity={subtitleB.opacity} transform={`translate(0, ${subtitleB.translateY})`}>
          <text x={540} y={700} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={700} fill={COLORS.deep_black}>
            DAY THREE
          </text>
        </g>

        {/* Zone C — Globe illustration */}
        <g opacity={globeEntrance.opacity} transform={`translate(540, ${1050 + breathe})`}>
          {/* Outer orbit ring — draws in */}
          <circle
            cx={0} cy={0} r={200}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2}
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringDash}
            opacity={0.4}
          />
          {/* Globe body */}
          <circle cx={0} cy={0} r={130} fill={COLORS.sky_blue} fillOpacity={0.12} stroke={COLORS.sky_blue} strokeWidth={2.5} />
          {/* Continent silhouettes - simplified */}
          <ellipse cx={-20} cy={-20} rx={45} ry={35} fill={COLORS.green} fillOpacity={0.2}
            transform={`rotate(${globeRotation}, -20, -20)`} style={{ transformOrigin: '-20px -20px' }} />
          <ellipse cx={30} cy={30} rx={30} ry={45} fill={COLORS.green} fillOpacity={0.15}
            transform={`rotate(${globeRotation * 0.5}, 30, 30)`} style={{ transformOrigin: '30px 30px' }} />
          <ellipse cx={-50} cy={50} rx={20} ry={25} fill={COLORS.green} fillOpacity={0.12} />
          {/* Latitude lines */}
          <ellipse cx={0} cy={-40} rx={120} ry={20} fill="none" stroke={COLORS.sky_blue} strokeWidth={0.8} opacity={0.2} />
          <ellipse cx={0} cy={0} rx={130} ry={25} fill="none" stroke={COLORS.sky_blue} strokeWidth={0.8} opacity={0.2} />
          <ellipse cx={0} cy={40} rx={120} ry={20} fill="none" stroke={COLORS.sky_blue} strokeWidth={0.8} opacity={0.2} />
          {/* Longitude line */}
          <ellipse cx={0} cy={0} rx={25} ry={130} fill="none" stroke={COLORS.sky_blue} strokeWidth={0.8} opacity={0.2} />

          {/* Pulsing outer ring */}
          <circle cx={0} cy={0} r={interpolate(pulse, [0.988, 1.012], [195, 205])}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1} opacity={shimmer * 0.2} />
        </g>

        {/* Decorative stars around globe */}
        {[
          { cx: 280, cy: 900, delay: star1 },
          { cx: 800, cy: 920, delay: star2 },
          { cx: 350, cy: 1200, delay: star3 },
          { cx: 740, cy: 1180, delay: star1 },
        ].map((s, i) => (
          <g key={i} opacity={s.delay.opacity * 0.5}>
            <circle cx={s.cx} cy={s.cy} r={3} fill={COLORS.sky_blue}
              opacity={interpolate(Math.sin(frame * 0.05 + i * 1.5), [-1, 1], [0.3, 0.7])} />
          </g>
        ))}

        {/* Info lines below globe */}
        <g opacity={line1.opacity} transform={`translate(0, ${line1.translateY})`}>
          <rect x={200} y={1320} width={6} height={48} rx={3} fill={COLORS.sky_blue} />
          <text x={225} y={1354} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={600} fill={COLORS.deep_black}>
            Apollo 8 vs Artemis II
          </text>
        </g>
        <g opacity={line2.opacity} transform={`translate(0, ${line2.translateY})`}>
          <rect x={200} y={1400} width={6} height={48} rx={3} fill={COLORS.green} />
          <text x={225} y={1434} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={600} fill={COLORS.deep_black}>
            56 Years of Progress
          </text>
        </g>
        <g opacity={line3.opacity} transform={`translate(0, ${line3.translateY})`}>
          <rect x={200} y={1480} width={6} height={48} rx={3} fill={COLORS.purple} />
          <text x={225} y={1514} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={600} fill={COLORS.deep_black}>
            Same Moon, Different Machine
          </text>
        </g>

        {/* Decorative corner accents */}
        <g opacity={labelEntrance.opacity * 0.3}>
          <path d="M 60,1700 L 60,1780 M 60,1780 L 140,1780" fill="none" stroke={COLORS.sky_blue} strokeWidth={2} strokeLinecap="round" />
          <path d="M 1020,1700 L 1020,1780 M 1020,1780 L 940,1780" fill="none" stroke={COLORS.sky_blue} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* Bottom tag */}
        <g opacity={line3.opacity * shimmer}>
          <text x={540} y={1680} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.2em">
            AROUND THE WORLD
          </text>
        </g>

        {/* Caption */}
        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1820} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={shimmer * 0.6} letterSpacing="0.12em">
          DAY 3 · HIDDEN WORLD SECRETS
        </text>

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
