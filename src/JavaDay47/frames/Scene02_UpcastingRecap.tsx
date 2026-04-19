/**
 * Scene 02 — Upcasting Recap
 * "Last day, we learnt how upcasting stores a child object in a parent-type reference,"
 * CSV: 6.960s → 13.440s
 * Duration: ~194 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring in
 *   Phase 2 (frames 20–80):  Class hierarchy diagram — ExpressTrain → Train
 *   Phase 3 (frames 70–end): Pulse on arrow, floating accent rings
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene02_UpcastingRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const parentCard = useSpringEntrance(frame, 22);
  const childCard = useSpringEntrance(frame, 34);
  const arrowLen = 240;
  const arrowDash = usePathDraw(frame, 45, arrowLen, 25);
  const codeCard = useSpringEntrance(frame, 50);
  const refCard = useSpringEntrance(frame, 60);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Parent box border draw
  const parentPerim = 2 * (400 + 260);
  const parentBorderDash = usePathDraw(frame, 24, parentPerim, 30);

  // Child box border draw
  const childPerim = 2 * (400 + 260);
  const childBorderDash = usePathDraw(frame, 36, childPerim, 30);

  const caption = CAPTIONS[1];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RECAP · UPCASTING" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Child → Parent
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Reference Widening
          </text>
        </g>

        {/* Divider */}
        <line x1={60} y1={420} x2={1020} y2={420} stroke="rgba(255,255,255,0.08)" strokeWidth={1}
          opacity={headB.opacity} />

        {/* ── ZONE C — Class hierarchy diagram ───────────────────────────── */}
        {/* Parent class: Train */}
        <g opacity={parentCard.opacity} transform={`translate(0, ${parentCard.translateY})`}>
          <rect x={340} y={480} width={400} height={260} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={parentPerim} strokeDashoffset={parentBorderDash} />
          {/* Header stripe */}
          <rect x={340} y={480} width={400} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.15} />
          <rect x={340} y={520} width={400} height={20}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={540} y={525} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Train
          </text>
          {/* Fields */}
          <text x={380} y={590} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            + name: String
          </text>
          <text x={380} y={630} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            + speed: int
          </text>
          {/* Method separator */}
          <line x1={360} y1={655} x2={720} y2={655} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={380} y={695} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            + depart()
          </text>
        </g>

        {/* Inheritance arrow — path-draw */}
        <path d="M 540,740 L 540,880"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" />
        {/* Hollow arrowhead pointing up */}
        <g opacity={interpolate(frame, [60, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <polygon points="540,740 525,770 555,770"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
        </g>

        {/* Child class: ExpressTrain */}
        <g opacity={childCard.opacity} transform={`translate(0, ${childCard.translateY})`}>
          <rect x={340} y={880} width={400} height={260} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.text_muted} strokeWidth={1}
            strokeDasharray={childPerim} strokeDashoffset={childBorderDash} />
          {/* Header */}
          <rect x={340} y={880} width={400} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.08} />
          <rect x={340} y={920} width={400} height={20}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={540} y={925} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            ExpressTrain
          </text>
          <text x={380} y={990} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            + premium: boolean
          </text>
          <line x1={360} y1={1015} x2={720} y2={1015} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={380} y={1055} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            + serveLunch()
          </text>
          <text x={380} y={1095} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            + reserveSeat()
          </text>
        </g>

        {/* ── Upcasting code card ────────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={160} accent />
          <rect x={60} y={1200} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1260} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={32} fontWeight={500} fill={COLORS.accent}>
            Train t = new ExpressTrain();
          </text>
          <text x={100} y={1310} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            ↑ Upcasting — child stored in parent reference
          </text>
        </g>

        {/* ── What's accessible card ─────────────────────────────────────── */}
        <g opacity={refCard.opacity} transform={`translate(0, ${refCard.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={280} />
          <text x={100} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Through reference T:
          </text>
          {/* Accessible */}
          <circle cx={120} cy={1530} r={12} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={120} cy={1530} r={6} fill={COLORS.accent} />
          <text x={150} y={1540} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            depart(), name, speed
          </text>
          {/* Not accessible */}
          <circle cx={120} cy={1590} r={12} fill={COLORS.vibrant_red} fillOpacity={0.3} />
          <line x1={112} y1={1582} x2={128} y2={1598}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <line x1={128} y1={1582} x2={112} y2={1598}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={150} y={1600} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            serveLunch(), reserveSeat()
          </text>
          <text x={150} y={1650} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Hidden — only Train methods visible
          </text>
        </g>

        {/* Floating micro-animations */}
        <circle cx={180} cy={600 + breathe} r={6} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={900} cy={950 + breathe * 0.7} r={8} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={200} cy={1100 + breathe * 1.2} r={5} fill={COLORS.accent} opacity={0.18 * shimmer} />

        {/* Pulse ring around parent class */}
        <rect x={330} y={470} width={420} height={280} rx={24}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={0.1 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 610px' }} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
