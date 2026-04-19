/**
 * Scene 12 — Runtime Polymorphism
 * "This is runtime polymorphism."
 * CSV: 42.080s → 44.900s
 * Duration: 85 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline spring
 *   Phase 2 (frames 15–50): Hero term, definition card, pillars
 *   Phase 3 (frames 45–end): Gear rotation, pulse
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene12_RuntimePolymorphism: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelE  = useSpringEntrance(frame, 0);
  const headA   = useSpringEntrance(frame, 4);
  const headB   = useSpringEntrance(frame, 9);
  const heroTerm = useSpringEntrance(frame, 14);
  const defCard  = useSpringEntrance(frame, 22);
  const pillar1  = useSpringEntrance(frame, 30);
  const pillar2  = useSpringEntrance(frame, 38);
  const pillar3  = useSpringEntrance(frame, 46);
  const bottomCard = useSpringEntrance(frame, 52);

  // Gear rotation
  const gearAngle = interpolate(frame, [0, 120], [0, 360], { extrapolateRight: 'extend' });

  // Border draw
  const heroPerimeter = 2 * (600 + 160);
  const heroBorderDash = usePathDraw(frame, 14, heroPerimeter, 25);

  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · CORE CONCEPT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            This Is
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Runtime Polymorphism
          </text>
        </g>

        {/* ── Hero term card ───────────────────────────────────────────── */}
        <g opacity={heroTerm.opacity} transform={`translate(0, ${heroTerm.translateY})`}>
          <rect x={240} y={510} width={600} height={160} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={heroPerimeter} strokeDashoffset={heroBorderDash} />
          <rect x={240} y={510} width={600} height={160} rx={20}
            fill={COLORS.bg_secondary} opacity={0.7} />

          <text x={540} y={570} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">POLY · MORPH · ISM</text>
          <text x={540} y={630} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>"Many Forms"</text>

          {/* Gear icon */}
          <g transform={`translate(840, 590) rotate(${gearAngle})`} style={{ transformOrigin: '0px 0px' }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
              <rect key={i} x={-5} y={-28} width={10} height={16} rx={3}
                fill={COLORS.accent} opacity={0.5}
                transform={`rotate(${a})`} style={{ transformOrigin: '0px 0px' }} />
            ))}
            <circle cx={0} cy={0} r={12} fill={COLORS.accent} opacity={0.3} />
            <circle cx={0} cy={0} r={6} fill={COLORS.accent} opacity={0.7} />
          </g>
        </g>

        {/* ── Definition card ──────────────────────────────────────────── */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={720} w={960} h={160} accent />
          <rect x={60} y={720} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={780} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Method resolved at runtime,
          </text>
          <text x={100} y={830} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            not at compile time
          </text>
        </g>

        {/* ── Three pillars ────────────────────────────────────────────── */}
        {[
          { label: 'Inheritance', desc: 'Parent → Child', e: pillar1, x: 60  },
          { label: 'Override',    desc: 'Same signature', e: pillar2, x: 390 },
          { label: 'Parent Ref',  desc: 'Holds child obj', e: pillar3, x: 720 },
        ].map((p, i) => (
          <g key={i} opacity={p.e.opacity} transform={`translate(0, ${p.e.translateY})`}>
            <BentoCard x={p.x} y={920} w={300} h={260} accent={i === 1} />
            {/* Pillar top line */}
            <rect x={p.x + 130} y={920} width={40} height={6} rx={3} fill={COLORS.accent} opacity={0.5} />
            <text x={p.x + 150} y={1010} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
              fill={COLORS.white}>{p.label}</text>
            <text x={p.x + 150} y={1060} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.text_muted}>{p.desc}</text>

            {/* Number badge */}
            <circle cx={p.x + 150} cy={1130} r={26}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={p.x + 150} y={1140} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.accent}>{i + 1}</text>
          </g>
        ))}

        {/* ── Bottom insight card ──────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1230} w={960} h={140} />
          <text x={100} y={1290} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            JVM decides which method to call
          </text>
          <text x={100} y={1340} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Based on the actual object in memory
          </text>
        </g>

        {/* ── Floating accent circles ──────────────────────────────────── */}
        <g transform={`translate(540, ${1480 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={2}
            opacity={0.3} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <circle cx={180} cy={1550 + breathe * 0.5} r={20} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        <circle cx={900} cy={1520 - breathe * 0.7} r={24} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <g opacity={0.08 * shimmer}>
          <line x1={60} y1={1660} x2={1020} y2={1660} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1670} x2={1020} y2={1670} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={90 + i * 72} y={1655} width={24} height={6} rx={2}
              fill={COLORS.accent} opacity={0.25} />
          ))}
        </g>

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
