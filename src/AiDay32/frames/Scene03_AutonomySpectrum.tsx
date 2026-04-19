/**
 * Scene 03 — Autonomy Spectrum
 * "the spectrum between full independence and full human control."
 * CSV: 8.000s → 12.700s
 * Duration: 141 frames (4.70s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): Detailed spectrum visualization with 5 levels
 *   Phase 3 (70–end): Micro-animations, pulsing markers
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

const SPECTRUM_LEVELS = [
  { label: 'MANUAL', desc: 'Human does it all', x: 120 },
  { label: 'ASSISTED', desc: 'Agent suggests', x: 330 },
  { label: 'PARTIAL', desc: 'Agent acts, asks', x: 540 },
  { label: 'HIGH', desc: 'Agent decides most', x: 750 },
  { label: 'FULL', desc: 'Agent acts alone', x: 960 },
];

export const Scene03_AutonomySpectrum: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2 ──
  const mainCard = useSpringEntrance(frame, 16);
  const spectrumLineLen = 840;
  const spectrumDash = usePathDraw(frame, 22, spectrumLineLen, 35);

  const levelSprings = SPECTRUM_LEVELS.map((_, i) =>
    useSpringEntrance(frame, 28 + i * 8)
  );

  const bottomCard = useSpringEntrance(frame, 60);

  // Arrow connector
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 55, arrowLen, 20);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.055) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.8, 1]);

  // Human figure (left side)
  const humanSway = Math.sin(frame * 0.04) * 3;

  // Robot figure (right side)
  const robotFloat = Math.sin(frame * 0.05) * 5;
  const eyeBlink = Math.sin(frame * 0.15) > 0.95 ? 0.2 : 1;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 5 · TRAJECTORY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            The Spectrum
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Independence ↔ Control
          </text>
        </g>

        {/* ── ZONE C — Large spectrum illustration ── */}
        {/* Human figure — left */}
        <g opacity={mainCard.opacity} transform={`translate(140, ${560 + humanSway})`}>
          {/* Head */}
          <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.text_muted} strokeWidth={2.5} />
          {/* Body */}
          <line x1={0} y1={28} x2={0} y2={90} stroke={COLORS.text_muted} strokeWidth={2.5} />
          {/* Arms */}
          <line x1={0} y1={50} x2={-30} y2={75} stroke={COLORS.text_muted} strokeWidth={2} strokeLinecap="round" />
          <line x1={0} y1={50} x2={30} y2={75} stroke={COLORS.text_muted} strokeWidth={2} strokeLinecap="round" />
          {/* Legs */}
          <line x1={0} y1={90} x2={-20} y2={130} stroke={COLORS.text_muted} strokeWidth={2} strokeLinecap="round" />
          <line x1={0} y1={90} x2={20} y2={130} stroke={COLORS.text_muted} strokeWidth={2} strokeLinecap="round" />
          <text x={0} y={160} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            HUMAN
          </text>
        </g>

        {/* Robot figure — right */}
        <g opacity={mainCard.opacity} transform={`translate(940, ${560 + robotFloat})`}>
          {/* Head */}
          <rect x={-30} y={-35} width={60} height={50} rx={12} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Eyes */}
          <circle cx={-12} cy={-15} r={6} fill={COLORS.accent} opacity={eyeBlink} />
          <circle cx={12} cy={-15} r={6} fill={COLORS.accent} opacity={eyeBlink} />
          {/* Antenna */}
          <line x1={0} y1={-35} x2={0} y2={-55} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={0} cy={-60} r={4} fill={COLORS.accent} />
          {/* Body */}
          <rect x={-25} y={18} width={50} height={55} rx={8} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          {/* Arms */}
          <line x1={-25} y1={35} x2={-50} y2={55} stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <line x1={25} y1={35} x2={50} y2={55} stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>
        </g>

        {/* Main spectrum card */}
        <g opacity={mainCard.opacity} transform={`translate(0, ${mainCard.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={520} accent />

          <text x={100} y={800} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            LEVELS OF AUTONOMY
          </text>

          {/* Spectrum bar */}
          <line
            x1={120} y1={870} x2={960} y2={870}
            stroke={COLORS.accent} strokeWidth={5}
            strokeDasharray={spectrumLineLen}
            strokeDashoffset={spectrumDash}
            strokeLinecap="round"
          />

          {/* Background track */}
          <line x1={120} y1={870} x2={960} y2={870}
            stroke="rgba(255,255,255,0.08)" strokeWidth={5} strokeLinecap="round" />

          {/* Level markers */}
          {SPECTRUM_LEVELS.map((level, i) => {
            const sp = levelSprings[i];
            const isLast = i === SPECTRUM_LEVELS.length - 1;
            const markerPulse = isLast ? pulse : 1;
            return (
              <g key={i} opacity={sp.opacity} transform={`translate(${level.x}, ${870 + sp.translateY})`}>
                {/* Marker dot */}
                <circle cx={0} cy={0} r={isLast ? 14 : 10}
                  fill={i === 0 ? COLORS.text_muted : COLORS.accent}
                  opacity={isLast ? shimmer : 0.8}
                  transform={`scale(${markerPulse})`}
                  style={{ transformOrigin: '0px 0px' }}
                />
                {isLast && (
                  <circle cx={0} cy={0} r={22} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
                    opacity={0.3 + Math.sin(frame * 0.1) * 0.15} />
                )}
                {/* Label */}
                <text x={0} y={-24} textAnchor="middle"
                  fontFamily={FONT} fontSize={24} fontWeight={800}
                  fill={i === 0 ? COLORS.text_muted : COLORS.accent}
                  letterSpacing="0.05em">
                  {level.label}
                </text>
                {/* Desc below */}
                <text x={0} y={38} textAnchor="middle"
                  fontFamily={FONT} fontSize={22} fontWeight={800}
                  fill={COLORS.text_muted}>
                  {level.desc}
                </text>
              </g>
            );
          })}

          {/* Gradient arrow below spectrum: human → agent */}
          <path d="M 120,940 L 960,940" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5}
            markerEnd="url(#arrow)" />
          <text x={120} y={980} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            More human
          </text>
          <text x={960} y={980} textAnchor="end" fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            More agent
          </text>

          {/* Key insight box inside main card */}
          <rect x={100} y={1020} width={880} height={100} rx={14}
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <text x={140} y={1070} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Either extreme is valid — context determines the right level.
          </text>
          <rect x={100} y={1130} width={880} height={80} rx={14}
            fill={COLORS.accent_dim} stroke={COLORS.accent_mid} strokeWidth={1} />
          <text x={140} y={1180} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            But what actually happens during agent work?
          </text>
        </g>

        {/* Arrow down to bottom card */}
        <path
          d={`M 540,1280 L 540,${1280 + arrowLen}`}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />

        {/* Bottom transition card */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1480} w={960} h={180} />
          <text x={100} y={1556} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Today we define the
          </text>
          <text x={680} y={1556} fontFamily={FONT} fontSize={42} fontWeight={800} fontStyle="italic" fill={COLORS.accent}>
            trajectory
          </text>

          {/* Subtle path decoration */}
          <path d="M 100,1610 Q 300,1640 500,1610 T 900,1610" fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.25} strokeDasharray="4 6" />
        </g>

        {/* Floating accent dots */}
        {[
          { x: 100, y: 1700, r: 6 },
          { x: 540, y: 1710, r: 8 },
          { x: 980, y: 1695, r: 5 },
        ].map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y + Math.sin(frame * 0.05 + i) * 3}
            r={d.r} fill={COLORS.accent} opacity={0.12 * shimmer} />
        ))}

        {/* ── CAPTION ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
