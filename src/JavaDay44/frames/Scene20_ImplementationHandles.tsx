/**
 * Scene 20 — ImplementationHandles
 * "The implementation handles the variation."
 * CSV: 60.100s → 61.860s
 * Duration: 82 frames (2.7s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + hero headline
 *   Phase 2 (frames 14–60): Gear mechanism, three method channels
 *   Phase 3 (frames 50–end): Breathe, pulse, shimmer
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene20_ImplementationHandles: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label  = useSpringEntrance(frame, 0);
  const heroA  = useSpringEntrance(frame, 4);
  const heroB  = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const gearE  = useSpringEntrance(frame, 14);
  const ch1    = useSpringEntrance(frame, 20);
  const ch2    = useSpringEntrance(frame, 26);
  const ch3    = useSpringEntrance(frame, 32);
  const arrow1 = usePathDraw(frame, 22, 200, 20);
  const arrow2 = usePathDraw(frame, 28, 200, 20);
  const arrow3 = usePathDraw(frame, 34, 200, 20);
  const inputE = useSpringEntrance(frame, 38);
  const summ   = useSpringEntrance(frame, 44);

  // Gear rotation
  const gearRot = interpolate(frame, [14, 70], [0, 90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  // Gear teeth path
  const gearTeeth = (cx: number, cy: number, r: number, teeth: number) => {
    let d = '';
    const innerR = r * 0.65;
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.35) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a4 = ((i + 0.85) / teeth) * Math.PI * 2;
      d += `${i === 0 ? 'M' : 'L'} ${cx + Math.cos(a1) * innerR},${cy + Math.sin(a1) * innerR} `;
      d += `L ${cx + Math.cos(a2) * r},${cy + Math.sin(a2) * r} `;
      d += `L ${cx + Math.cos(a3) * r},${cy + Math.sin(a3) * r} `;
      d += `L ${cx + Math.cos(a4) * innerR},${cy + Math.sin(a4) * innerR} `;
    }
    d += 'Z';
    return d;
  };

  // Channel data
  const channels = [
    { label: 'calculateFare(route)', variant: 'V1', color: COLORS.accent },
    { label: 'calculateFare(route, cls)', variant: 'V2', color: COLORS.accent },
    { label: 'calculateFare(route, cls, peak)', variant: 'V3', color: COLORS.accent },
  ];
  const channelEntrances = [ch1, ch2, ch3];
  const arrowDashes = [arrow1, arrow2, arrow3];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            IMPLEMENTATION · RESPONSIBILITY
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.white}>
            The Implementation
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Handles the Variation
          </text>
        </g>

        {/* ── Central gear mechanism ─────────────────────────────────────── */}
        <g opacity={gearE.opacity} transform={`translate(0, ${gearE.translateY})`}>
          {/* Gear mount background */}
          <rect x={420} y={530} width={240} height={240} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2}
            opacity={0.5} />
          {/* Rotating gear */}
          <g transform={`rotate(${gearRot}, 540, 650)`}>
            <path d={gearTeeth(540, 650, 80, 8)}
              fill="none" stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={540} cy={650} r={30}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={540} cy={650} r={8} fill={COLORS.accent} />
          </g>
          <text x={540} y={755} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            METHOD DISPATCH
          </text>
        </g>

        {/* ── Input arrow (caller side) ──────────────────────────────────── */}
        <g opacity={inputE.opacity} transform={`translate(0, ${inputE.translateY})`}>
          <text x={200} y={644} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            .calculateFare(...)
          </text>
          <line x1={310} y1={650} x2={420} y2={650}
            stroke={COLORS.accent} strokeWidth={2.5}
            markerEnd="url(#arrow)" opacity={0.7} />
        </g>

        {/* ── Three output channels ──────────────────────────────────────── */}
        {channels.map((ch, i) => {
          const yCenter = 550 + i * 100;
          const cardY = 840 + i * 160;
          const ent = channelEntrances[i];
          const dash = arrowDashes[i];
          return (
            <g key={i}>
              {/* Arrow from gear to channel card */}
              <path
                d={`M 660,${yCenter + 100} Q 720,${cardY + 50} 760,${cardY + 50}`}
                fill="none" stroke={COLORS.accent} strokeWidth={2}
                strokeDasharray={200} strokeDashoffset={dash}
                strokeLinecap="round" markerEnd="url(#arrow)"
                opacity={ent.opacity * 0.6} />

              {/* Channel card */}
              <g opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                <BentoCard x={60} y={cardY} w={960} h={130} accent={i === 0} />
                <rect x={60} y={cardY} width={6} height={130} rx={3}
                  fill={ch.color} />
                {/* Variant badge */}
                <rect x={100} y={cardY + 30} width={80} height={50} rx={10}
                  fill={COLORS.accent} fillOpacity={0.15} />
                <text x={140} y={cardY + 63} textAnchor="middle"
                  fontFamily={FONT} fontSize={28} fontWeight={800}
                  fill={COLORS.accent}>
                  {ch.variant}
                </text>
                <text x={220} y={cardY + 68}
                  fontFamily="'Fira Code', 'Courier New', monospace"
                  fontSize={26} fontWeight={500}
                  fill={COLORS.white}>
                  {ch.label}
                </text>
                {/* Handle label */}
                <text x={960} y={cardY + 105} textAnchor="end"
                  fontFamily={FONT} fontSize={22} fontWeight={800}
                  fill={COLORS.text_muted}>
                  handles different params
                </text>
              </g>
            </g>
          );
        })}

        {/* ── Summary card ───────────────────────────────────────────────── */}
        <g opacity={summ.opacity} transform={`translate(0, ${summ.translateY})`}>
          <BentoCard x={120} y={1380} w={840} h={120} />
          <text x={540} y={1450} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Caller stays <tspan fill={COLORS.accent}>simple</tspan> — implementation absorbs <tspan fill={COLORS.accent}>complexity</tspan>
          </text>
        </g>

        {/* ── Detail tiles ───────────────────────────────────────────────── */}
        <g opacity={summ.opacity * shimmer}>
          <BentoCard x={60} y={1540} w={460} h={110} />
          <text x={100} y={1596}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Caller: one method name
          </text>
          <text x={100} y={1632}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            calculateFare()
          </text>
        </g>
        <g opacity={summ.opacity * shimmer}>
          <BentoCard x={560} y={1540} w={460} h={110} accent />
          <text x={600} y={1596}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            Implementation: 3 versions
          </text>
          <text x={600} y={1632}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Different param handling
          </text>
        </g>

        {/* ── Floating micro-anim ────────────────────────────────────────── */}
        <g transform={`translate(140, ${1710 + breathe})`} opacity={0.08}>
          <circle cx={0} cy={0} r={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(940, ${1710 + breathe * 0.7})`} opacity={shimmer * 0.08}>
          <circle cx={0} cy={0} r={5} fill={COLORS.accent} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s20.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
