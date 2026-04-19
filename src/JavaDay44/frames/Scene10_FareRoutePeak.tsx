/**
 * Scene 10 — calculateFare(route, seatClass, isPeakHour)
 * "calculateFare(route, seatClass, isPeakHour)."
 * CSV: 34.460s → 37.060s
 * Duration: 102 frames (3.40s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Section label + headline spring
 *   Phase 2 (frames 15–70): Hero method card, 3-param visual, clock + premium badge
 *   Phase 3 (frames 60–end): Pulse, glow on peak indicator, breathing
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

export const Scene10_FareRoutePeak: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 4);
  const subline  = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const heroCard  = useSpringEntrance(frame, 12);
  const param1    = useSpringEntrance(frame, 20);
  const param2    = useSpringEntrance(frame, 28);
  const param3    = useSpringEntrance(frame, 36);
  const clockCard = useSpringEntrance(frame, 44);
  const summaryCard = useSpringEntrance(frame, 52);

  // ── Border draw ────────────────────────────────────────────────────────────
  const heroPerim = 2 * (960 + 180);
  const heroBorder = usePathDraw(frame, 10, heroPerim, 22);

  // ── Clock animation ────────────────────────────────────────────────────────
  const hourAngle = interpolate(frame, [44, 80], [0, 150], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const minuteAngle = interpolate(frame, [44, 80], [0, 540], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Connector path draws ───────────────────────────────────────────────────
  const conn1Dash = usePathDraw(frame, 24, 60, 12);
  const conn2Dash = usePathDraw(frame, 32, 60, 12);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.05) * 4;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const peakGlow = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.5, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

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
            OVERLOAD VARIANT 3 · FULL CONTEXT
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            calculateFare
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={46} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            (route, seatClass, isPeakHour)
          </text>
        </g>

        {/* ── Hero card ──────────────────────────────────────────────────── */}
        <g opacity={heroCard.opacity} transform={`translate(0, ${heroCard.translateY})`}>
          <rect x={60} y={470} width={960} height={180} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={heroPerim} strokeDashoffset={heroBorder} />
          <rect x={60} y={470} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={550}
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            Three Parameters — Fullest Context
          </text>
          <text x={100} y={600}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Route + Class + Time-of-day &#x2192; most precise fare
          </text>
        </g>

        {/* ── Three parameter cards stacked ───────────────────────────────── */}
        {/* Param 1: route */}
        <g opacity={param1.opacity} transform={`translate(0, ${param1.translateY})`}>
          <BentoCard x={60} y={700} w={300} h={120} accent />
          <circle cx={120} cy={760} r={20}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={120} y={768} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>1</text>
          <text x={160} y={765}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white} fontStyle="italic">
            route
          </text>
        </g>

        {/* Connector 1→2 */}
        <path d="M 360,760 L 390,760"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={60} strokeDashoffset={conn1Dash}
          markerEnd="url(#arrow)" />

        {/* Param 2: seatClass */}
        <g opacity={param2.opacity} transform={`translate(0, ${param2.translateY})`}>
          <BentoCard x={390} y={700} w={300} h={120} accent />
          <circle cx={450} cy={760} r={20}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={450} y={768} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>2</text>
          <text x={490} y={765}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white} fontStyle="italic">
            seatClass
          </text>
        </g>

        {/* Connector 2→3 */}
        <path d="M 690,760 L 720,760"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={60} strokeDashoffset={conn2Dash}
          markerEnd="url(#arrow)" />

        {/* Param 3: isPeakHour — highlighted */}
        <g opacity={param3.opacity} transform={`translate(0, ${param3.translateY})`}>
          <BentoCard x={720} y={700} w={300} h={120} accent />
          <circle cx={780} cy={760} r={20}
            fill={COLORS.accent} fillOpacity={peakGlow * 0.3}
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '780px 760px' }} />
          <text x={780} y={768} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>3</text>
          <text x={820} y={765}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            isPeak
          </text>
        </g>

        {/* ── Clock illustration ──────────────────────────────────────────── */}
        <g opacity={clockCard.opacity} transform={`translate(0, ${clockCard.translateY})`}>
          <BentoCard x={60} y={870} w={500} h={460} />

          {/* Clock face */}
          <circle cx={310} cy={1100} r={150}
            fill={COLORS.bg_primary}
            stroke={COLORS.accent} strokeWidth={3} />
          <circle cx={310} cy={1100} r={145}
            fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth={1} />

          {/* Tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const isHour = i % 3 === 0;
            const r1 = isHour ? 125 : 132;
            const r2 = 140;
            return (
              <line key={i}
                x1={310 + Math.cos(angle) * r1}
                y1={1100 + Math.sin(angle) * r1}
                x2={310 + Math.cos(angle) * r2}
                y2={1100 + Math.sin(angle) * r2}
                stroke={isHour ? COLORS.accent : 'rgba(255,255,255,0.2)'}
                strokeWidth={isHour ? 3 : 1.5}
                strokeLinecap="round" />
            );
          })}

          {/* Hour hand */}
          <line
            x1={310} y1={1100}
            x2={310 + Math.cos((hourAngle - 90) * Math.PI / 180) * 70}
            y2={1100 + Math.sin((hourAngle - 90) * Math.PI / 180) * 70}
            stroke={COLORS.white} strokeWidth={5} strokeLinecap="round" />

          {/* Minute hand */}
          <line
            x1={310} y1={1100}
            x2={310 + Math.cos((minuteAngle - 90) * Math.PI / 180) * 105}
            y2={1100 + Math.sin((minuteAngle - 90) * Math.PI / 180) * 105}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />

          {/* Center dot */}
          <circle cx={310} cy={1100} r={6} fill={COLORS.accent} />

          {/* Label */}
          <text x={310} y={1300} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            TIME OF DAY
          </text>
        </g>

        {/* ── Peak/off-peak badge ─────────────────────────────────────────── */}
        <g opacity={clockCard.opacity} transform={`translate(0, ${clockCard.translateY})`}>
          <BentoCard x={600} y={870} w={420} h={200} />
          <text x={810} y={945} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            OFF-PEAK
          </text>
          <text x={810} y={1000} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.6}>
            1.0x
          </text>
        </g>

        <g opacity={clockCard.opacity} transform={`translate(0, ${clockCard.translateY})`}>
          <BentoCard x={600} y={1100} w={420} h={230} accent />
          <rect x={600} y={1100} width={6} height={230} rx={3}
            fill={COLORS.accent} />
          <text x={810} y={1175} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent} opacity={peakGlow}>
            PEAK HOUR
          </text>
          <text x={810} y={1240} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} opacity={peakGlow}>
            1.25x
          </text>
          <text x={810} y={1295} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            surge multiplier
          </text>
        </g>

        {/* ── Summary card ───────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={120} />
          <text x={540} y={1475} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            All three factors combine for the <tspan fill={COLORS.accent}>most accurate</tspan> fare
          </text>
        </g>

        {/* ── Floating micro-animations ──────────────────────────────────── */}
        <g transform={`translate(160, ${1620 + breathe})`}>
          <circle cx={0} cy={0} r={20}
            fill={COLORS.accent} fillOpacity={0.04} />
        </g>
        <g transform={`translate(920, ${1600 + breathe * 0.8})`}>
          <circle cx={0} cy={0} r={28}
            fill={COLORS.accent} fillOpacity={shimmer * 0.04}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Divider line ───────────────────────────────────────────────── */}
        <line x1={60} y1={1560} x2={1020} y2={1560}
          stroke="rgba(255,255,255,0.06)" strokeWidth={1}
          opacity={summaryCard.opacity} />

        {/* ── Bottom sub-label ────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity * shimmer * 0.5}>
          <text x={540} y={1610} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            The richest variant — complete pricing intelligence
          </text>
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
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
