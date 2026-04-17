/**
 * Scene 16 — Confuse Them Dashboard
 * "Confuse them in the control room dashboard reports wrong numbers."
 * CSV: 67.700s → 72.060s
 * Duration: 131 frames (4.37s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Control room dashboard with incorrect numbers, warning badges, error state.
 * Shows what goes wrong when instance vs static are confused.
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring
 *   Phase 2 (frames 18–85): Dashboard panels with wrong data + warning flash
 *   Phase 3 (frames 70–end): Error pulse, red flash, shimmer
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

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

export const Scene16_ConfuseThemDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headWord1 = useSpringEntrance(frame, 4);
  const headWord2 = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Dashboard header bar
  const dashHeader = useSpringEntrance(frame, 14);
  const dashHeaderPerim = 2 * (960 + 60);
  const dashHeaderBorder = interpolate(frame, [14, 36], [dashHeaderPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Dashboard panels
  const panel1 = useSpringEntrance(frame, 22);
  const panel2 = useSpringEntrance(frame, 30);
  const panel3 = useSpringEntrance(frame, 38);

  // Warning/error overlay
  const warningEntry = useSpringEntrance(frame, 50);

  // Explanation cards
  const explain1 = useSpringEntrance(frame, 58);
  const explain2 = useSpringEntrance(frame, 66);

  // Error X marks
  const x1Draw = usePathDraw(frame, 45, 60, 18);
  const x2Draw = usePathDraw(frame, 48, 60, 18);
  const x3Draw = usePathDraw(frame, 51, 60, 18);

  // Bar chart path
  const barDraw = usePathDraw(frame, 34, 300, 25);

  // Counter — wrong number ticking
  const wrongCount = useCounter(frame, 30, 1458, 40);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Red error flash (pulsing)
  const errorFlash = Math.abs(Math.sin(frame * 0.12)) * 0.25;
  const warningPulse = 1 + Math.sin(frame * 0.1) * 0.03;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INSTANCE VS STATIC · DANGER" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────── */}
        <g opacity={headWord1.opacity} transform={`translate(0, ${headWord1.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Confuse Them
          </text>
        </g>
        <g opacity={headWord2.opacity} transform={`translate(0, ${headWord2.translateY})`}>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>
            Dashboard Reports Wrong
          </text>
        </g>

        {/* ── Dashboard Header Bar ────────────────────────────────────── */}
        <g opacity={dashHeader.opacity} transform={`translate(0, ${dashHeader.translateY})`}>
          <rect x={60} y={440} width={960} height={60} rx={12}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1.5}
            strokeDasharray={dashHeaderPerim} strokeDashoffset={dashHeaderBorder} />
          {/* Red dot indicator */}
          <circle cx={100} cy={470} r={6}
            fill={COLORS.vibrant_red}
            opacity={0.6 + errorFlash} />
          <text x={120} y={478} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            CONTROL ROOM — LIVE DASHBOARD
          </text>
          <text x={900} y={478} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.5 + errorFlash}>
            ERROR
          </text>
        </g>

        {/* ── Dashboard Panel 1: Total Passengers ─────────────────────── */}
        <g opacity={panel1.opacity} transform={`translate(0, ${panel1.translateY})`}>
          <BentoCard x={60} y={520} w={300} h={220} />
          <text x={100} y={565} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            TOTAL PASSENGERS
          </text>
          <text x={210} y={660} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.vibrant_red}>
            {wrongCount}
          </text>
          <text x={210} y={710} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.5 + errorFlash}>
            WRONG VALUE
          </text>
          {/* X mark over panel */}
          <path d="M 80,540 L 340,720"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            strokeDasharray={60} strokeDashoffset={x1Draw}
            strokeLinecap="round" opacity={0.5} />
          <path d="M 340,540 L 80,720"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            strokeDasharray={60} strokeDashoffset={x1Draw}
            strokeLinecap="round" opacity={0.5} />
        </g>

        {/* ── Dashboard Panel 2: Train KL2401 ─────────────────────────── */}
        <g opacity={panel2.opacity} transform={`translate(0, ${panel2.translateY})`}>
          <BentoCard x={390} y={520} w={300} h={220} />
          <text x={430} y={565} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            KL2401
          </text>
          <text x={540} y={660} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.vibrant_red}>
            729
          </text>
          <text x={540} y={700} textAnchor="middle"
            fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.text_muted}>
            showing system total
          </text>
          <text x={540} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.5}>
            should show 300
          </text>
          {/* X mark */}
          <path d="M 410,540 L 670,720"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            strokeDasharray={60} strokeDashoffset={x2Draw}
            strokeLinecap="round" opacity={0.4} />
          <path d="M 670,540 L 410,720"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            strokeDasharray={60} strokeDashoffset={x2Draw}
            strokeLinecap="round" opacity={0.4} />
        </g>

        {/* ── Dashboard Panel 3: Mini bar chart ───────────────────────── */}
        <g opacity={panel3.opacity} transform={`translate(0, ${panel3.translateY})`}>
          <BentoCard x={720} y={520} w={300} h={220} />
          <text x={760} y={565} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            OVERVIEW
          </text>
          {/* Bar chart rects */}
          {[
            { x: 760, h: 80, label: 'A' },
            { x: 810, h: 120, label: 'B' },
            { x: 860, h: 60, label: 'C' },
            { x: 910, h: 100, label: 'D' },
            { x: 960, h: 140, label: 'E' },
          ].map((bar, i) => {
            const barH = interpolate(frame, [34 + i * 4, 50 + i * 4], [0, bar.h], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            return (
              <g key={i}>
                <rect x={bar.x} y={720 - barH} width={30} height={barH}
                  rx={4} fill={COLORS.vibrant_red} fillOpacity={0.3 + errorFlash * 0.3} />
                <text x={bar.x + 15} y={730} textAnchor="middle"
                  fontFamily={FONT} fontSize={12} fontWeight={800}
                  fill={COLORS.text_muted} opacity={0.4}>
                  {bar.label}
                </text>
              </g>
            );
          })}
          {/* X mark */}
          <path d="M 740,540 L 1000,720"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={60} strokeDashoffset={x3Draw}
            strokeLinecap="round" opacity={0.35} />
          <path d="M 1000,540 L 740,720"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={60} strokeDashoffset={x3Draw}
            strokeLinecap="round" opacity={0.35} />
        </g>

        {/* ── WARNING banner ──────────────────────────────────────────── */}
        <g opacity={warningEntry.opacity}
          transform={`translate(0, ${warningEntry.translateY}) scale(${warningPulse})`}
          style={{ transformOrigin: '540px 790px' }}>
          <rect x={240} y={770} width={600} height={56} rx={28}
            fill={COLORS.vibrant_red} fillOpacity={0.12 + errorFlash * 0.1}
            stroke={COLORS.vibrant_red} strokeWidth={2} strokeOpacity={0.4 + errorFlash * 0.3} />
          {/* Warning triangle */}
          <polygon points="275,810 285,790 295,810"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={285} y={806} textAnchor="middle"
            fontFamily={FONT} fontSize={14} fontWeight={800}
            fill={COLORS.vibrant_red}>!</text>
          <text x={540} y={805} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>
            SCOPE CONFUSION DETECTED
          </text>
        </g>

        {/* ── Explanation card 1 ───────────────────────────────────────── */}
        <g opacity={explain1.opacity} transform={`translate(0, ${explain1.translateY})`}>
          <BentoCard x={60} y={860} w={460} h={200} />
          <rect x={60} y={860} width={6} height={200} rx={3}
            fill={COLORS.vibrant_red} />
          <text x={100} y={915} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.vibrant_red}>
            THE MISTAKE
          </text>
          <text x={100} y={960} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            Reading static variable
          </text>
          <text x={100} y={992} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            where instance is expected
          </text>
          <text x={100} y={1030} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            totalPassengersInSystem vs currentPassengerCount
          </text>
        </g>

        {/* ── Explanation card 2 ───────────────────────────────────────── */}
        <g opacity={explain2.opacity} transform={`translate(0, ${explain2.translateY})`}>
          <BentoCard x={560} y={860} w={460} h={200} accent />
          <text x={600} y={915} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>
            THE RESULT
          </text>
          <text x={600} y={960} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            Dashboard shows system
          </text>
          <text x={600} y={992} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            total as per-train count
          </text>
          <text x={600} y={1030} fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            729 passengers on one train? Impossible.
          </text>
        </g>

        {/* ── Monitor / screen illustration ────────────────────────────── */}
        <g opacity={explain2.opacity * 0.4}
          transform={`translate(540, ${1160 + breathe})`}>
          {/* Monitor screen */}
          <rect x={-180} y={-60} width={360} height={220} rx={16}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
          {/* Screen bezel */}
          <rect x={-170} y={-50} width={340} height={190} rx={8}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
          {/* Error lines on screen */}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i}
              x={-150} y={-30 + i * 32}
              width={140 + (i * 20) % 60} height={6} rx={3}
              fill={COLORS.vibrant_red} fillOpacity={0.06 + errorFlash * 0.04} />
          ))}
          {/* Stand */}
          <rect x={-20} y={160} width={40} height={40} rx={4}
            fill="rgba(255,255,255,0.04)" />
          <rect x={-60} y={195} width={120} height={8} rx={4}
            fill="rgba(255,255,255,0.04)" />
          {/* Warning icon on screen */}
          <polygon points="0,-20 16,10 -16,10"
            fill="none" stroke={COLORS.vibrant_red}
            strokeWidth={2} opacity={0.2 + errorFlash * 0.3} />
          <text x={0} y={6} textAnchor="middle"
            fontFamily={FONT} fontSize={14} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.3 + errorFlash * 0.2}>
            !
          </text>
        </g>

        {/* ── Floating warning dots ────────────────────────────────────── */}
        {[
          { x: 120, y: 1450, r: 5 },
          { x: 960, y: 1480, r: 4 },
          { x: 200, y: 1520, r: 3 },
          { x: 880, y: 1540, r: 5 },
        ].map((dot, i) => (
          <circle key={i}
            cx={dot.x} cy={dot.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={dot.r}
            fill={COLORS.vibrant_red}
            fillOpacity={0.03 * shimmer} />
        ))}

        {/* ── Summary strip ────────────────────────────────────────────── */}
        <g opacity={explain2.opacity} transform={`translate(0, ${explain2.translateY * 0.3})`}>
          <BentoCard x={60} y={1450} w={960} h={80} />
          <text x={540} y={1500} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            Wrong scope = wrong numbers = broken dashboard
          </text>
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s16.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
