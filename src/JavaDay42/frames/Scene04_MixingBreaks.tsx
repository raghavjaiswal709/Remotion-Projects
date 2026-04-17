/**
 * Scene 04 — Mixing Breaks
 * "and why mixing them breaks the system."
 * CSV: 15.160s → 18.480s
 * Duration: 104 frames (3.47s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline springs
 *   Phase 2 (frames 20–70):  Broken system diagram — crossed wires, error indicators
 *   Phase 3 (frames 60–end): Warning pulse, shake micro-animation
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

export const Scene04_MixingBreaks: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);
  const warningCard = useSpringEntrance(frame, 36);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const crossLen = 300;
  const crossDash1 = usePathDraw(frame, 28, crossLen, 25);
  const crossDash2 = usePathDraw(frame, 32, crossLen, 25);

  // ── X mark path draw ──────────────────────────────────────────────────────
  const xLen = 120;
  const xDash = usePathDraw(frame, 40, xLen, 15);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const shakeX = frame > 40 ? Math.sin(frame * 0.5) * 2 : 0;
  const warningPulse = 1 + Math.sin(frame * 0.12) * 0.03;
  const breathe = Math.sin(frame * 0.06) * 3;
  const dangerFlash = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.6, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="WARNING · MIXING CONTEXTS" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Mixing Them
          </text>
        </g>
        <g transform={`translate(${shakeX}, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.vibrant_red}>
            Breaks
          </text>
          <text x={400} y={400} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            {' '}the System
          </text>
        </g>

        {/* ── ZONE C — Broken system diagram ──────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          {/* Instance box */}
          <BentoCard x={60} y={500} w={420} h={280} />
          <rect x={60} y={500} width={420} height={50} rx={20}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={270} y={535} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent}>
            INSTANCE CONTEXT
          </text>
          <text x={100} y={610}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.white}>
            this.name
          </text>
          <text x={100} y={650}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.white}>
            this.speed
          </text>
          <text x={100} y={690}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            belongs to ONE train
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          {/* Static box */}
          <BentoCard x={560} y={500} w={460} h={280} />
          <rect x={560} y={500} width={460} height={50} rx={20}
            fill={COLORS.vibrant_red} fillOpacity={0.1} />
          <text x={790} y={535} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.vibrant_red}>
            STATIC CONTEXT
          </text>
          <text x={600} y={610}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.white}>
            Train.totalTrains
          </text>
          <text x={600} y={650}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.white}>
            Train.getFleetSize()
          </text>
          <text x={600} y={690}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            belongs to THE CLASS
          </text>
        </g>

        {/* ── Crossed wires (X pattern) ──────────────────────────────────── */}
        <path d="M 480,600 L 560,720" fill="none"
          stroke={COLORS.vibrant_red} strokeWidth={3}
          strokeDasharray={crossLen} strokeDashoffset={crossDash1}
          strokeLinecap="round" opacity={0.8} />
        <path d="M 480,720 L 560,600" fill="none"
          stroke={COLORS.vibrant_red} strokeWidth={3}
          strokeDasharray={crossLen} strokeDashoffset={crossDash2}
          strokeLinecap="round" opacity={0.8} />

        {/* ── Big X mark ──────────────────────────────────────────────────── */}
        <g transform={`translate(520, 660) scale(${warningPulse})`}
          style={{ transformOrigin: '520px 660px' }}>
          <path d="M -30,-30 L 30,30" fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={5}
            strokeDasharray={xLen} strokeDashoffset={xDash}
            strokeLinecap="round" />
          <path d="M 30,-30 L -30,30" fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={5}
            strokeDasharray={xLen} strokeDashoffset={xDash}
            strokeLinecap="round" />
        </g>

        {/* ── Warning card ────────────────────────────────────────────────── */}
        <g opacity={warningCard.opacity} transform={`translate(0, ${warningCard.translateY})`}>
          <BentoCard x={60} y={840} w={960} h={180} />
          <rect x={60} y={840} width={960} height={180} rx={20}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
          <rect x={60} y={840} width={6} height={180} rx={3} fill={COLORS.vibrant_red} />
          {/* Warning triangle */}
          <polygon points="120,880 150,930 90,930"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5} />
          <text x={120} y={922} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            !
          </text>
          <text x={180} y={910}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.vibrant_red}>
            Cannot use instance data in static context
          </text>
          <text x={100} y={970}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            static void show() {'{'} System.out.println(this.name); {'}'}  // ERROR
          </text>
        </g>

        {/* ── Bottom explanation cards ─────────────────────────────────────── */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={140} accent />
          <text x={100} y={1140} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Static methods have
          </text>
          <text x={590} y={1140} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            no access
          </text>
          <text x={760} y={1140} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            to
          </text>
          <text x={100} y={1190} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            this
          </text>
          <text x={175} y={1190} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            — there is no object to reference
          </text>
        </g>

        {/* ── Danger pulse ring ────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1380 + breathe})`} opacity={0.3 * dangerFlash}>
          <circle cx={0} cy={0} r={50} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={2}
            transform={`scale(${warningPulse})`}
            style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={80} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={1} opacity={0.4}
            transform={`scale(${warningPulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
