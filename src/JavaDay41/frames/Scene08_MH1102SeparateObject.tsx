/**
 * Scene 08 — MH1102 Separate Object
 * "Train MH1102 carries its own, completely separate per object."
 * CSV: 30.180s → 37.060s
 * Duration: 237 frames (7.90s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Two-column comparison: KL2401 vs MH1102 each with their own
 * memory block showing different currentPassengerCount values.
 * Giant "SEPARATE" banner between them. Divider wall rendered
 * as a path-draw vertical line separating the two object worlds.
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Label + headline spring entrance
 *   Phase 2 (frames 20–120): Two train bento cards cascade,
 *                             memory blocks build, counters tick
 *   Phase 3 (frames 100–end): Pulse badges, floating orbs, shimmer
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

export const Scene08_MH1102SeparateObject: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headWords = ['Completely', 'Separate'];
  const headSprings = headWords.map((_, i) => {
    const f = Math.max(0, frame - 6 - i * 8);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });
  const sublineEntry = useSpringEntrance(frame, 18);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Left card (KL2401)
  const leftCard = useSpringEntrance(frame, 26);
  const leftPerim = 2 * (440 + 680);
  const leftBorderDash = interpolate(frame, [26, 56], [leftPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Right card (MH1102)
  const rightCard = useSpringEntrance(frame, 38);
  const rightPerim = 2 * (440 + 680);
  const rightBorderDash = interpolate(frame, [38, 68], [rightPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Divider wall
  const dividerLen = 700;
  const dividerDash = usePathDraw(frame, 32, dividerLen, 28);

  // Train icons inside cards
  const trainIconL = useSpringEntrance(frame, 34);
  const trainIconR = useSpringEntrance(frame, 46);

  // Labels inside cards
  const labelL1 = useSpringEntrance(frame, 40);
  const labelL2 = useSpringEntrance(frame, 48);
  const labelR1 = useSpringEntrance(frame, 52);
  const labelR2 = useSpringEntrance(frame, 60);

  // Counters
  const counterL = useCounter(frame, 48, 142, 40);
  const counterR = useCounter(frame, 60, 87, 40);

  // Field labels
  const fieldL = useSpringEntrance(frame, 54);
  const fieldR = useSpringEntrance(frame, 66);

  // SEPARATE banner
  const bannerEntry = useSpringEntrance(frame, 72);
  const bannerPerim = 2 * (360 + 64);
  const bannerBorderDash = interpolate(frame, [72, 92], [bannerPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Bottom info card
  const infoCard = useSpringEntrance(frame, 80);

  // X marks (showing no sharing)
  const xMark1 = useSpringEntrance(frame, 88);
  const xMark2 = useSpringEntrance(frame, 94);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const floatA = Math.sin(frame * 0.05) * 3;
  const floatB = Math.cos(frame * 0.07) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INSTANCE VARIABLES · PER OBJECT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word headline ────────────────────────────────── */}
        {headWords.map((word, i) => (
          <text key={i}
            x={i === 0 ? 60 : 540}
            y={310}
            opacity={headSprings[i].op}
            transform={`translate(0, ${headSprings[i].ty})`}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={i === 1 ? COLORS.accent : COLORS.white}
          >
            {word}
          </text>
        ))}
        <g opacity={sublineEntry.opacity} transform={`translate(0, ${sublineEntry.translateY})`}>
          <text x={60} y={400} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            Each train object has its own memory
          </text>
        </g>

        {/* ── Vertical divider (wall between objects) ──────────────────── */}
        <line x1={540} y1={460} x2={540} y2={1160}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.3}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
          strokeLinecap="round"
        />

        {/* ── Left card — KL2401 ───────────────────────────────────────── */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <rect x={60} y={470} width={440} height={680} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={leftPerim} strokeDashoffset={leftBorderDash}
          />

          {/* Header bar */}
          <rect x={60} y={470} width={440} height={56} rx={20}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={280} y={508} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            OBJECT 1
          </text>
        </g>

        {/* KL2401 mini train icon */}
        <g opacity={trainIconL.opacity} transform={`translate(120, ${560 + breathe * 0.4})`}>
          <rect x={0} y={0} width={220} height={60} rx={8}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <rect x={160} y={-20} width={60} height={80} rx={6}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1} />
          {/* Wheels */}
          <circle cx={50} cy={72} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={120} cy={72} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={190} cy={72} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          {/* Track */}
          <line x1={-10} y1={88} x2={230} y2={88}
            stroke={COLORS.text_muted} strokeWidth={2} strokeOpacity={0.3} />
        </g>

        {/* KL2401 label */}
        <g opacity={labelL1.opacity} transform={`translate(0, ${labelL1.translateY * 0.3})`}>
          <text x={280} y={710} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>
            KL2401
          </text>
        </g>

        {/* KL2401 field */}
        <g opacity={labelL2.opacity} transform={`translate(0, ${labelL2.translateY * 0.3})`}>
          <text x={280} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            currentPassengerCount
          </text>
        </g>

        {/* KL2401 counter */}
        <g opacity={fieldL.opacity}>
          <text x={280} y={870} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.white}>
            {counterL}
          </text>
        </g>

        {/* KL2401 own-copy badge */}
        <g opacity={fieldL.opacity}>
          <rect x={160} y={910} width={240} height={44} rx={12}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={280} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            OWN COPY
          </text>
        </g>

        {/* ── Right card — MH1102 ──────────────────────────────────────── */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <rect x={580} y={470} width={440} height={680} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={rightPerim} strokeDashoffset={rightBorderDash}
          />

          {/* Header bar */}
          <rect x={580} y={470} width={440} height={56} rx={20}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={800} y={508} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            OBJECT 2
          </text>
        </g>

        {/* MH1102 mini train icon */}
        <g opacity={trainIconR.opacity} transform={`translate(640, ${560 + floatA})`}>
          <rect x={0} y={0} width={220} height={60} rx={8}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <rect x={160} y={-20} width={60} height={80} rx={6}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={50} cy={72} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={120} cy={72} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={190} cy={72} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <line x1={-10} y1={88} x2={230} y2={88}
            stroke={COLORS.text_muted} strokeWidth={2} strokeOpacity={0.3} />
        </g>

        {/* MH1102 label */}
        <g opacity={labelR1.opacity} transform={`translate(0, ${labelR1.translateY * 0.3})`}>
          <text x={800} y={710} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>
            MH1102
          </text>
        </g>

        {/* MH1102 field */}
        <g opacity={labelR2.opacity} transform={`translate(0, ${labelR2.translateY * 0.3})`}>
          <text x={800} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            currentPassengerCount
          </text>
        </g>

        {/* MH1102 counter */}
        <g opacity={fieldR.opacity}>
          <text x={800} y={870} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.white}>
            {counterR}
          </text>
        </g>

        {/* MH1102 own-copy badge */}
        <g opacity={fieldR.opacity}>
          <rect x={680} y={910} width={240} height={44} rx={12}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={800} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            OWN COPY
          </text>
        </g>

        {/* ── X marks — no sharing ─────────────────────────────────────── */}
        <g opacity={xMark1.opacity} transform={`translate(540, ${1000 + floatB})`}>
          <line x1={-16} y1={-16} x2={16} y2={16}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <line x1={16} y1={-16} x2={-16} y2={16}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
        </g>
        <g opacity={xMark2.opacity} transform={`translate(540, ${1070 + floatB})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.vibrant_red}>
            NO SHARING
          </text>
        </g>

        {/* ── SEPARATE banner ──────────────────────────────────────────── */}
        <g opacity={bannerEntry.opacity} transform={`translate(0, ${bannerEntry.translateY})`}>
          <rect x={360} y={1190} width={360} height={64} rx={16}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={bannerPerim} strokeDashoffset={bannerBorderDash}
          />
          <text x={540} y={1232} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic"
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 1225px' }}>
            PER OBJECT
          </text>
        </g>

        {/* ── Bottom info card ─────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1310} w={960} h={140} />
          <rect x={60} y={1310} width={6} height={140} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1370} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Instance variables live inside each object —
          </text>
          <text x={100} y={1414} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            completely separate, never shared
          </text>
        </g>

        {/* Floating accent circles */}
        <g transform={`translate(100, ${1530 + breathe})`}>
          <circle cx={0} cy={0} r={12} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>
        <g transform={`translate(980, ${1580 + breathe * 0.6})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>
        <g transform={`translate(540, ${1640 + floatA})`}>
          <circle cx={0} cy={0} r={10} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
