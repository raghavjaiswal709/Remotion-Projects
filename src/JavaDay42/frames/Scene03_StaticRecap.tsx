/**
 * Scene 03 — Static Recap
 * "while static variables describe the class as a whole."
 * CSV: 11.660s → 15.160s
 * Duration: 105 frames (3.5s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline springs
 *   Phase 2 (frames 20–70):  Class diagram with static field, multiple train instances
 *   Phase 3 (frames 60–end): Connector pulse, floating accents
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
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

export const Scene03_StaticRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const classBox = useSpringEntrance(frame, 18);
  const inst1    = useSpringEntrance(frame, 30);
  const inst2    = useSpringEntrance(frame, 38);
  const inst3    = useSpringEntrance(frame, 46);
  const bottomCard = useSpringEntrance(frame, 54);

  // ── Path draws for connector lines ─────────────────────────────────────────
  const connLen1 = 200;
  const connDash1 = usePathDraw(frame, 34, connLen1, 20);
  const connDash2 = usePathDraw(frame, 42, connLen1, 20);
  const connDash3 = usePathDraw(frame, 50, connLen1, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · STATIC VARIABLES" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Static
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Variables
          </text>
          <text x={60} y={450} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Describe the class as a whole
          </text>
        </g>

        {/* ── ZONE C — Class box at top ───────────────────────────────────── */}
        <g opacity={classBox.opacity} transform={`translate(0, ${classBox.translateY})`}>
          <BentoCard x={240} y={520} w={600} h={220} accent />
          {/* Header stripe */}
          <rect x={240} y={520} width={600} height={56} rx={20}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={540} y={558} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Train (CLASS)
          </text>
          {/* Static field */}
          <text x={280} y={620}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500} fill={COLORS.accent}>
            static totalTrains = 42
          </text>
          {/* Static method */}
          <text x={280} y={660}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            static getFleetSize()
          </text>
          {/* Shared badge */}
          <rect x={580} y={680} width={220} height={40} rx={10}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1} />
          <text x={690} y={708} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            SHARED
          </text>
        </g>

        {/* ── Connector lines to instances ─────────────────────────────────── */}
        <path d="M 400,740 L 200,860" fill="none"
          stroke={COLORS.accent} strokeWidth={2} strokeDasharray={connLen1}
          strokeDashoffset={connDash1} strokeLinecap="round" opacity={0.6} />
        <path d="M 540,740 L 540,860" fill="none"
          stroke={COLORS.accent} strokeWidth={2} strokeDasharray={connLen1}
          strokeDashoffset={connDash2} strokeLinecap="round" opacity={0.6} />
        <path d="M 680,740 L 880,860" fill="none"
          stroke={COLORS.accent} strokeWidth={2} strokeDasharray={connLen1}
          strokeDashoffset={connDash3} strokeLinecap="round" opacity={0.6} />

        {/* ── Instance boxes ──────────────────────────────────────────────── */}
        {[
          { x: 60, label: 'Express #1', delay: inst1 },
          { x: 400, label: 'Local #14', delay: inst2 },
          { x: 720, label: 'Freight #9', delay: inst3 },
        ].map((inst, i) => (
          <g key={i} opacity={inst.delay.opacity} transform={`translate(0, ${inst.delay.translateY})`}>
            <BentoCard x={inst.x} y={870} w={300} h={160} />
            {/* Instance icon — small train */}
            <rect x={inst.x + 20} y={890} width={80} height={40} rx={8}
              fill={COLORS.accent} fillOpacity={0.1}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={inst.x + 40} cy={940} r={12}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={inst.x + 80} cy={940} r={12}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={inst.x + 120} y={920}
              fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.white}>
              {inst.label}
            </text>
            <text x={inst.x + 20} y={1000}
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.text_muted}>
              instance data
            </text>
          </g>
        ))}

        {/* ── Comparison summary ──────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={200} />
          <rect x={60} y={1080} width={6} height={200} rx={3} fill={COLORS.text_muted} />
          <text x={100} y={1150} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Instance
          </text>
          <text x={100} y={1195} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            one object's data
          </text>
          <text x={100} y={1235} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            unique per train
          </text>
        </g>

        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={560} y={1080} w={460} h={200} accent />
          <rect x={560} y={1080} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={600} y={1150} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Static
          </text>
          <text x={600} y={1195} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            class-wide data
          </text>
          <text x={600} y={1235} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            shared by all
          </text>
        </g>

        {/* ── Full-width emphasis ─────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={100} accent />
          <text x={540} y={1382} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Static = the class as a whole
          </text>
        </g>

        {/* ── Floating accents ────────────────────────────────────────────── */}
        <g transform={`translate(100, ${1550 + breathe})`} opacity={0.2}>
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent}
            strokeWidth={2} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(980, ${1600 + breathe * 0.7})`} opacity={0.15 * shimmer}>
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
