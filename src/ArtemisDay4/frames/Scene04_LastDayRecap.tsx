/**
 * Scene04 — Last Day Recap
 * "Last day, we learned how Artemis II mirrors Apollo 8, same path around the moon,
 *  unrecognizable technology, 56 years between them."
 * CSV: 8.640s → 18.660s
 * Duration: 319 frames (10.63s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Scene reveal — label, headline spring in
 *   Phase 2 (20–120): Two-column comparison — Apollo 8 vs Artemis II
 *   Phase 3 (100–end): Micro-animations — orbit path draw, year counter, shimmer
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

export const Scene04_LastDayRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Two columns ──
  const dividerEntrance = useSpringEntrance(frame, 18);
  const leftHeader = useSpringEntrance(frame, 22);
  const rightHeader = useSpringEntrance(frame, 26);

  // Apollo 8 items
  const apollo1 = useSpringEntrance(frame, 34);
  const apollo2 = useSpringEntrance(frame, 44);
  const apollo3 = useSpringEntrance(frame, 54);

  // Artemis II items
  const artemis1 = useSpringEntrance(frame, 38);
  const artemis2 = useSpringEntrance(frame, 48);
  const artemis3 = useSpringEntrance(frame, 58);

  // Year counter
  const yearCounter = useCounter(frame, 65, 56, 50);

  // Orbit path
  const orbitPath = 'M 100,1400 Q 300,1200 540,1300 Q 780,1400 900,1300';
  const orbitLength = 900;
  const orbitDash = usePathDraw(frame, 70, orbitLength, 50);

  // Moon illustration
  const moonEntrance = useSpringEntrance(frame, 60);

  // Earth illustration
  const earthEntrance = useSpringEntrance(frame, 50);

  // Bottom connector
  const connectorLength = 200;
  const connectorDash = usePathDraw(frame, 80, connectorLength, 30);

  // Divider line path draw
  const dividerLength = 1100;
  const dividerDash = usePathDraw(frame, 20, dividerLength, 35);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.cool_silver} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={300} fontWeight={900} fill={COLORS.cool_silver} opacity={0.04}>
          REC
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · SAME PATH, DIFFERENT ERA" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={900} fill={COLORS.deep_black}>
            Same Orbit
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={460} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={500} fill={COLORS.sky_blue}>
            Unrecognizable Technology
          </text>
        </g>

        {/* Zone C — Vertical divider */}
        <line x1={540} y1={520} x2={540} y2={1100}
          stroke={COLORS.deep_black} strokeWidth={1}
          strokeDasharray={dividerLength} strokeDashoffset={dividerDash}
          opacity={dividerEntrance.opacity * 0.15} />

        {/* Left column header — Apollo 8 */}
        <g opacity={leftHeader.opacity} transform={`translate(0, ${leftHeader.translateY})`}>
          <text x={280} y={560} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={800} fill={COLORS.cool_silver}>
            APOLLO 8
          </text>
          <text x={280} y={595} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={0.6}>
            1968
          </text>
        </g>

        {/* Right column header — Artemis II */}
        <g opacity={rightHeader.opacity} transform={`translate(0, ${rightHeader.translateY})`}>
          <text x={800} y={560} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={800} fill={COLORS.sky_blue}>
            ARTEMIS II
          </text>
          <text x={800} y={595} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.sky_blue} opacity={0.6}>
            2025
          </text>
        </g>

        {/* Apollo items */}
        {[
          { text: 'Analog controls', y: 660, entrance: apollo1 },
          { text: 'Manual navigation', y: 760, entrance: apollo2 },
          { text: '3 crew members', y: 860, entrance: apollo3 },
        ].map((item, i) => (
          <g key={i} opacity={item.entrance.opacity}
            transform={`translate(60, ${item.y + item.entrance.translateY})`}>
            <rect x={0} y={0} width={440} height={80} rx={12}
              fill={COLORS.deep_black} fillOpacity={0.03}
              stroke={COLORS.cool_silver} strokeWidth={1} strokeOpacity={0.2} />
            <rect x={0} y={0} width={6} height={80} rx={3} fill={COLORS.cool_silver} opacity={0.4} />
            <text x={30} y={48} fontFamily="'Inter', system-ui, sans-serif"
              fontSize={32} fontWeight={600} fill={COLORS.deep_black} opacity={0.7}>
              {item.text}
            </text>
          </g>
        ))}

        {/* Artemis items */}
        {[
          { text: 'Glass cockpit', y: 660, entrance: artemis1 },
          { text: 'AI-assisted nav', y: 760, entrance: artemis2 },
          { text: '4 crew members', y: 860, entrance: artemis3 },
        ].map((item, i) => (
          <g key={i} opacity={item.entrance.opacity}
            transform={`translate(580, ${item.y + item.entrance.translateY})`}>
            <rect x={0} y={0} width={440} height={80} rx={12}
              fill={COLORS.sky_blue} fillOpacity={0.06}
              stroke={COLORS.sky_blue} strokeWidth={1.5} strokeOpacity={0.4} />
            <rect x={0} y={0} width={6} height={80} rx={3} fill={COLORS.sky_blue} />
            <text x={30} y={48} fontFamily="'Inter', system-ui, sans-serif"
              fontSize={32} fontWeight={600} fill={COLORS.deep_black}>
              {item.text}
            </text>
          </g>
        ))}

        {/* Year gap counter */}
        <g opacity={interpolate(frame, [65, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          transform={`translate(540, ${1050 + breathe})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={120} fontWeight={900} fill={COLORS.vibrant_red}>
            {yearCounter}
          </text>
          <text x={0} y={50} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={600} fill={COLORS.cool_silver}>
            YEARS APART
          </text>
        </g>

        {/* Orbit path — shared trajectory */}
        <g opacity={moonEntrance.opacity * 0.6}>
          <path d={orbitPath} fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={orbitLength} strokeDashoffset={orbitDash}
            strokeLinecap="round" />
        </g>

        {/* Earth illustration (left) */}
        <g opacity={earthEntrance.opacity}
          transform={`translate(140, ${1350 + earthEntrance.translateY})`}>
          <circle cx={0} cy={0} r={50} fill={COLORS.sky_blue} fillOpacity={0.1} />
          <circle cx={0} cy={0} r={50} fill="none" stroke={COLORS.sky_blue} strokeWidth={2} />
          <ellipse cx={0} cy={0} rx={50} ry={18} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.3} />
          <text x={0} y={80} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.deep_black} opacity={0.5}>
            EARTH
          </text>
        </g>

        {/* Moon illustration (right) */}
        <g opacity={moonEntrance.opacity}
          transform={`translate(900, ${1300 + moonEntrance.translateY + breathe})`}>
          <circle cx={0} cy={0} r={40}
            fill={COLORS.cool_silver} fillOpacity={0.15}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={40} fill="none"
            stroke={COLORS.cool_silver} strokeWidth={2} />
          {/* Crater details */}
          <circle cx={-12} cy={-10} r={8} fill="none"
            stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.3} />
          <circle cx={10} cy={12} r={6} fill="none"
            stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.25} />
          <circle cx={-5} cy={18} r={4} fill="none"
            stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.2} />
          <text x={0} y={70} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.deep_black} opacity={0.5}>
            MOON
          </text>
        </g>

        {/* Arrow indicator on orbit path */}
        <g opacity={moonEntrance.opacity * 0.5}>
          <circle cx={540} cy={1300} r={6} fill={COLORS.vibrant_red} opacity={shimmer} />
        </g>

        {/* Connector line from year counter to orbit */}
        <line x1={540} y1={1120} x2={540} y2={1280}
          stroke={COLORS.cool_silver} strokeWidth={1}
          strokeDasharray={connectorLength} strokeDashoffset={connectorDash}
          opacity={0.2} />

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">YESTERDAY · SAME PATH, DIFFERENT ERA</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
