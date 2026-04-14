/**
 * Scene 12 — Separation Matters
 * "This separation matters deeply."
 * CSV: 50.140s → 52.160s
 * Duration: 79 frames (2.6s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–15):   Label + HUGE typographic "SEPARATION" headline spring
 *   Phase 2 (frames 12–50):  Two opposing bento blocks pull apart from center, divider appears
 *   Phase 3 (frames 40–end): Pulse on divider, shimmer on labels, breathe on elements
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
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

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

export const Scene12_SeparationMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);

  // BIG word "SEPARATION" springs in
  const sepSpring = spring({ frame: Math.max(0, frame - 4), fps, config: SPRING_HEAVY });
  const sepScale = interpolate(sepSpring, [0, 1], [0.7, 1]);
  const sepOpacity = interpolate(sepSpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // "MATTERS" word
  const mattersSpring = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING_SNAP });
  const mattersY = interpolate(mattersSpring, [0, 1], [28, 0]);
  const mattersOp = interpolate(mattersSpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // "DEEPLY" accent word
  const deeplySpring = spring({ frame: Math.max(0, frame - 16), fps, config: SPRING_SNAP });
  const deeplyY = interpolate(deeplySpring, [0, 1], [20, 0]);
  const deeplyOp = interpolate(deeplySpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // ── Phase 2: The two sides separating ──────────────────────────────────────
  // Left block slides left, right block slides right
  const separateProgress = spring({ frame: Math.max(0, frame - 14), fps, config: SPRING_CONFIG });
  const leftSlide = interpolate(separateProgress, [0, 1], [60, 0]);
  const rightSlide = interpolate(separateProgress, [0, 1], [-60, 0]);
  const blockOp = interpolate(separateProgress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Center divider line draw
  const dividerLen = 700;
  const dividerDraw = usePathDraw(frame, 18, dividerLen, 20);

  // Inner items
  const leftItem1 = useSpringEntrance(frame, 24);
  const leftItem2 = useSpringEntrance(frame, 30);
  const rightItem1 = useSpringEntrance(frame, 28);
  const rightItem2 = useSpringEntrance(frame, 34);

  // Bottom insight card
  const insightCard = useSpringEntrance(frame, 40);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 3;
  const dividerPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 1.0]);
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);
  const glowPulse = 1 + Math.sin(frame * 0.09) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="CORE PRINCIPLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Giant typographic statement ────────────────────────── */}
        <g opacity={sepOpacity} transform={`scale(${sepScale})`}
          style={{ transformOrigin: '540px 310px' }}>
          {/* Ghost shadow */}
          <text x={540} y={330} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}>
            SEPARATION
          </text>
          {/* Main word */}
          <text x={540} y={320} textAnchor="middle"
            fontFamily={FONT} fontSize={110} fontWeight={800}
            fill={COLORS.white}>
            SEPARATION
          </text>
        </g>

        <g transform={`translate(0, ${mattersY})`} opacity={mattersOp}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.text_muted}>
            MATTERS
          </text>
        </g>

        <g transform={`translate(0, ${deeplyY})`} opacity={deeplyOp}>
          <text x={540} y={510} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent}>
            DEEPLY
          </text>
        </g>

        {/* ── ZONE C — Two separated panels ───────────────────────────────── */}

        {/* Center vertical divider */}
        <line x1={540} y1={580} x2={540} y2={1280}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDraw}
          opacity={dividerPulse} strokeLinecap="round" />

        {/* Center diamond accent */}
        <g opacity={blockOp}>
          <rect x={528} y={920} width={24} height={24} rx={4}
            fill={COLORS.accent} opacity={0.3 * shimmer}
            transform="rotate(45 540 932)" />
        </g>

        {/* ── LEFT BLOCK — MODEL ──────────────────────────────────────────── */}
        <g opacity={blockOp} transform={`translate(${leftSlide}, 0)`}>
          <BentoCard x={60} y={590} w={440} h={700} />

          {/* Brain outline */}
          <ellipse cx={280} cy={680} rx={52} ry={48}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} opacity={shimmer} />
          <line x1={280} y1={635} x2={280} y2={725}
            stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.5} />
          {/* Curved folds */}
          <path d="M 250,660 C 260,680 240,700 255,715"
            fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
          <path d="M 310,660 C 300,680 320,700 305,715"
            fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />

          <text x={280} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            MODEL
          </text>

          <g opacity={leftItem1.opacity} transform={`translate(0, ${leftItem1.translateY})`}>
            <rect x={100} y={810} width={360} height={56} rx={12}
              fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={120} y={845} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
              Reasons
            </text>
          </g>

          <g opacity={leftItem2.opacity} transform={`translate(0, ${leftItem2.translateY})`}>
            <rect x={100} y={886} width={360} height={56} rx={12}
              fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={120} y={921} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
              Chooses
            </text>
          </g>

          {/* Planning icon: bullet points */}
          <g opacity={leftItem2.opacity} transform={`translate(120, 990)`}>
            {[0, 1, 2].map(i => (
              <g key={i}>
                <circle cx={0} cy={i * 34} r={4} fill={COLORS.accent} opacity={0.6 * shimmer} />
                <rect x={20} y={i * 34 - 4} width={interpolate(frame, [30 + i * 6, 45 + i * 6], [0, 200], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                })} height={8} rx={4}
                  fill={COLORS.accent} fillOpacity={0.15} />
              </g>
            ))}
          </g>

          {/* "DECIDES" stamp */}
          <rect x={160} y={1120} width={240} height={50} rx={25}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={280} y={1152} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            DECIDES
          </text>
        </g>

        {/* ── RIGHT BLOCK — TOOL ──────────────────────────────────────────── */}
        <g opacity={blockOp} transform={`translate(${rightSlide}, 0)`}>
          <BentoCard x={580} y={590} w={440} h={700} accent />

          {/* Gear icon */}
          <g transform={`translate(800, 680) scale(${glowPulse})`} style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={38} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Gear teeth (simplified as 4 rects) */}
            {[0, 90, 180, 270].map(angle => (
              <rect key={angle} x={-5} y={-48} width={10} height={14} rx={3}
                fill={COLORS.accent} opacity={0.6}
                transform={`rotate(${angle})`} />
            ))}
          </g>

          <text x={800} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            TOOL
          </text>

          <g opacity={rightItem1.opacity} transform={`translate(0, ${rightItem1.translateY})`}>
            <rect x={620} y={810} width={360} height={56} rx={12}
              fill="rgba(255,255,255,0.03)" stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
            <text x={640} y={845} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
              Executes
            </text>
          </g>

          <g opacity={rightItem2.opacity} transform={`translate(0, ${rightItem2.translateY})`}>
            <rect x={620} y={886} width={360} height={56} rx={12}
              fill="rgba(255,255,255,0.03)" stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
            <text x={640} y={921} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
              Returns
            </text>
          </g>

          {/* Action bars */}
          <g opacity={rightItem2.opacity} transform={`translate(640, 990)`}>
            {[0, 1, 2].map(i => (
              <g key={i}>
                <polygon points={`0,${i * 34} 10,${i * 34 - 6} 10,${i * 34 + 6}`}
                  fill={COLORS.accent} opacity={0.5 * shimmer} />
                <rect x={20} y={i * 34 - 4} width={interpolate(frame, [32 + i * 6, 50 + i * 6], [0, 180], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                })} height={8} rx={4}
                  fill={COLORS.accent} fillOpacity={0.2} />
              </g>
            ))}
          </g>

          {/* "DOES" stamp */}
          <rect x={680} y={1120} width={240} height={50} rx={25}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={800} y={1152} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            DOES
          </text>
        </g>

        {/* ── Bottom insight card ──────────────────────────────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={140} accent />
          <text x={540} y={1400} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Clean separation = reliable agents
          </text>
          <text x={540} y={1448} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Each layer does one thing well
          </text>
        </g>

        {/* Floating particles */}
        <g transform={`translate(0, ${breathe})`}>
          <circle cx={80} cy={1540} r={2.5} fill={COLORS.accent} opacity={0.12 * shimmer} />
          <circle cx={1000} cy={1560} r={2} fill={COLORS.accent} opacity={0.1 * shimmer} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
