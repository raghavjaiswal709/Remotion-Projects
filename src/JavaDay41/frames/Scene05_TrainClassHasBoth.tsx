/**
 * Scene 05 — Train Class Has Both
 * "The train class has both."
 * CSV: 18.700s → 20.140s
 * Duration: 68 frames (2.27s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Short dramatic reveal scene — massive Train class diagram
 * showing INSTANCE and STATIC sections in a single class box.
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Class box border-draw + headline spring
 *   Phase 2 (frames 12–50): Internal sections reveal — instance fields, static fields
 *   Phase 3 (frames 40–end): Pulse accent bars, breathe on diagram, shimmer
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

export const Scene05_TrainClassHasBoth: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Class box reveal ──────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);

  // "BOTH" headline
  const bothSpring = spring({ frame: Math.max(0, frame - 4), fps, config: SPRING_SNAP });
  const bothTy = interpolate(bothSpring, [0, 1], [40, 0]);
  const bothOp = interpolate(bothSpring, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' });

  // Class box border draw
  const classBoxW = 800;
  const classBoxH = 900;
  const classBoxPerimeter = 2 * (classBoxW + classBoxH);
  const classBorderDash = interpolate(frame, [4, 34], [classBoxPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Class box fill fade
  const classBoxFillOp = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Class header
  const headerEntry = useSpringEntrance(frame, 8);

  // ── Phase 2: Internal sections ─────────────────────────────────────────────
  // Divider line in class box
  const dividerLen = 720;
  const dividerDash = usePathDraw(frame, 14, dividerLen, 18);

  // Instance section
  const instanceEntry = useSpringEntrance(frame, 16);
  const instanceItem1 = useSpringEntrance(frame, 20);
  const instanceItem2 = useSpringEntrance(frame, 24);

  // Static section
  const staticEntry = useSpringEntrance(frame, 22);
  const staticItem1 = useSpringEntrance(frame, 28);
  const staticItem2 = useSpringEntrance(frame, 32);

  // Instance accent bar
  const instanceBarLen = 200;
  const instanceBarDash = usePathDraw(frame, 18, instanceBarLen, 16);

  // Static accent bar
  const staticBarLen = 200;
  const staticBarDash = usePathDraw(frame, 24, staticBarLen, 16);

  // Train wheels decoration
  const wheel1Entry = useSpringEntrance(frame, 30);
  const wheel2Entry = useSpringEntrance(frame, 34);
  const wheel3Entry = useSpringEntrance(frame, 38);

  // Bottom summary badge
  const badgeEntry = useSpringEntrance(frame, 36);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const wheelSpin = frame * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="JAVA · CLASS STRUCTURE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — "HAS BOTH" headline ────────────────────────────── */}
        <g opacity={bothOp} transform={`translate(0, ${bothTy})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.text_muted}>
            The Train class has
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic"
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '200px 380px' }}
          >
            BOTH
          </text>
        </g>

        {/* Ghost "BOTH" behind */}
        <text x={540} y={420} textAnchor="middle"
          fontFamily={FONT} fontSize={280} fontWeight={800}
          fill={COLORS.accent} opacity={bothOp * 0.03}>
          BOTH
        </text>

        {/* ── ZONE C — Train class diagram ────────────────────────────── */}
        <g transform={`translate(140, ${520 + breathe * 0.5})`}>

          {/* Class box background */}
          <rect x={0} y={0} width={classBoxW} height={classBoxH} rx={24}
            fill={COLORS.bg_secondary} opacity={classBoxFillOp}
          />

          {/* Class box border draw */}
          <rect x={0} y={0} width={classBoxW} height={classBoxH} rx={24}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={classBoxPerimeter} strokeDashoffset={classBorderDash}
          />

          {/* Class header band */}
          <g opacity={headerEntry.opacity} transform={`translate(0, ${headerEntry.translateY * 0.5})`}>
            <rect x={0} y={0} width={classBoxW} height={90} rx={24}
              fill={COLORS.accent} fillOpacity={0.1}
            />
            <rect x={0} y={70} width={classBoxW} height={20}
              fill={COLORS.accent} fillOpacity={0.1}
            />
            <text x={classBoxW / 2} y={58} textAnchor="middle"
              fontFamily={FONT} fontSize={40} fontWeight={800}
              fill={COLORS.accent}>
              class Train
            </text>
          </g>

          {/* ── Instance section ──────────────────────────────────────── */}
          <g opacity={instanceEntry.opacity} transform={`translate(0, ${instanceEntry.translateY * 0.4})`}>
            {/* Instance label */}
            <text x={40} y={148} fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.accent} letterSpacing="0.1em">
              INSTANCE VARIABLES
            </text>
            {/* Accent left bar */}
            <line x1={16} y1={120} x2={16} y2={320}
              stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
              strokeDasharray={instanceBarLen} strokeDashoffset={instanceBarDash}
            />
          </g>

          {/* Instance field 1 */}
          <g opacity={instanceItem1.opacity} transform={`translate(0, ${instanceItem1.translateY * 0.3})`}>
            <rect x={40} y={170} width={720} height={56} rx={12}
              fill={COLORS.accent} fillOpacity={0.06}
            />
            <text x={60} y={206} fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.white}>
              int currentPassengerCount
            </text>
            <text x={700} y={206} textAnchor="end" fontFamily={FONT}
              fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
              per obj
            </text>
          </g>

          {/* Instance field 2 */}
          <g opacity={instanceItem2.opacity} transform={`translate(0, ${instanceItem2.translateY * 0.3})`}>
            <rect x={40} y={240} width={720} height={56} rx={12}
              fill={COLORS.accent} fillOpacity={0.04}
            />
            <text x={60} y={276} fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.text_muted}>
              String trainId
            </text>
            <text x={700} y={276} textAnchor="end" fontFamily={FONT}
              fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
              per obj
            </text>
          </g>

          {/* ── Divider ──────────────────────────────────────────────── */}
          <line x1={40} y1={340} x2={760} y2={340}
            stroke={COLORS.text_muted} strokeWidth={1.5}
            strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
            strokeOpacity={0.3}
          />

          {/* ── Static section ────────────────────────────────────────── */}
          <g opacity={staticEntry.opacity} transform={`translate(0, ${staticEntry.translateY * 0.4})`}>
            <text x={40} y={398} fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.white} letterSpacing="0.1em">
              STATIC VARIABLES
            </text>
            <line x1={16} y1={370} x2={16} y2={570}
              stroke={COLORS.white} strokeWidth={4} strokeLinecap="round"
              strokeDasharray={staticBarLen} strokeDashoffset={staticBarDash}
              strokeOpacity={0.5}
            />
          </g>

          {/* Static field 1 */}
          <g opacity={staticItem1.opacity} transform={`translate(0, ${staticItem1.translateY * 0.3})`}>
            <rect x={40} y={418} width={720} height={56} rx={12}
              fill={COLORS.white} fillOpacity={0.04}
            />
            <text x={60} y={454} fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.white}>
              static int totalPassengersInSystem
            </text>
          </g>

          {/* Static field 2 */}
          <g opacity={staticItem2.opacity} transform={`translate(0, ${staticItem2.translateY * 0.3})`}>
            <rect x={40} y={488} width={720} height={56} rx={12}
              fill={COLORS.white} fillOpacity={0.03}
            />
            <text x={60} y={524} fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.text_muted}>
              static int maxCapacity
            </text>
          </g>

          {/* ── Methods section placeholder ────────────────────────────── */}
          <line x1={40} y1={580} x2={760} y2={580}
            stroke={COLORS.text_muted} strokeWidth={1}
            strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
            strokeOpacity={0.2}
          />
          <g opacity={staticItem2.opacity * 0.5}>
            <text x={40} y={630} fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.text_muted} letterSpacing="0.08em">
              METHODS
            </text>
            <text x={60} y={670} fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted} opacity={0.4}>
              board(), unboard(), getCount()...
            </text>
          </g>

          {/* Train wheels at bottom of class box */}
          {[180, 400, 620].map((wx, i) => {
            const wEntry = [wheel1Entry, wheel2Entry, wheel3Entry][i];
            return (
              <g key={i} opacity={wEntry.opacity} transform={`translate(${wx}, 840)`}>
                <circle cx={0} cy={0} r={36} fill="none"
                  stroke={COLORS.accent} strokeWidth={2.5}
                  transform={`rotate(${wheelSpin})`}
                  style={{ transformOrigin: `${wx}px 840px` }}
                />
                <circle cx={0} cy={0} r={20} fill="none"
                  stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.4} />
                <circle cx={0} cy={0} r={6} fill={COLORS.accent} fillOpacity={0.6} />
                {/* Spokes */}
                {[0, 60, 120].map(angle => (
                  <line key={angle}
                    x1={0} y1={-6} x2={0} y2={-34}
                    stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.3}
                    transform={`rotate(${angle + wheelSpin})`}
                    style={{ transformOrigin: '0px 0px' }}
                  />
                ))}
              </g>
            );
          })}

          {/* Rail track under class box */}
          <line x1={-40} y1={880} x2={840} y2={880}
            stroke={COLORS.text_muted} strokeWidth={3} strokeOpacity={0.3} />
          <line x1={-40} y1={890} x2={840} y2={890}
            stroke={COLORS.text_muted} strokeWidth={3} strokeOpacity={0.3} />
          {/* Cross-ties */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={-20 + i * 72} y={875} width={24} height={20} rx={2}
              fill={COLORS.text_muted} fillOpacity={0.15} />
          ))}
        </g>

        {/* ── Summary badge ────────────────────────────────────────────── */}
        <g opacity={badgeEntry.opacity} transform={`translate(0, ${badgeEntry.translateY})`}>
          <BentoCard x={200} y={1480} w={680} h={100} accent />
          <text x={540} y={1544} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            ONE CLASS — TWO TYPES OF DATA
          </text>
        </g>

        {/* Floating accent orbs */}
        <g transform={`translate(120, ${1660 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>
        <g transform={`translate(960, ${1700 + breathe * 0.8})`}>
          <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
