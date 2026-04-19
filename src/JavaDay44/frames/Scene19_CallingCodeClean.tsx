/**
 * Scene 19 — CallingCodeClean
 * "The calling code stays clean."
 * CSV: 58.200s → 59.580s
 * Duration: 57 frames (1.9s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + hero
 *   Phase 2 (frames 12–46): Clean vs messy comparison, sparkle
 *   Phase 3 (frames 40–end): Pulse, shimmer
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

export const Scene19_CallingCodeClean: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label  = useSpringEntrance(frame, 0);
  const heroA  = useSpringEntrance(frame, 4);
  const heroB  = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const messyC  = useSpringEntrance(frame, 12);
  const cleanC  = useSpringEntrance(frame, 18);
  const crossE  = useSpringEntrance(frame, 22);
  const checkE  = useSpringEntrance(frame, 26);
  const codeBox = useSpringEntrance(frame, 30);
  const detailR = useSpringEntrance(frame, 36);
  const summE   = useSpringEntrance(frame, 42);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const crossLen  = 80;
  const crossD1   = usePathDraw(frame, 22, crossLen, 12);
  const crossD2   = usePathDraw(frame, 23, crossLen, 12);
  const checkLen  = 100;
  const checkD    = usePathDraw(frame, 26, checkLen, 15);
  const sparkLen  = 60;
  const sparkD    = usePathDraw(frame, 30, sparkLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  // Messy code lines
  const messyLines = [
    'if (hasClass && hasPeak) {',
    '  calcFareV3(r,c,p);',
    '} else if (hasClass) {',
    '  calcFareV2(r,c);',
    '} else {',
    '  calcFareV1(r);',
    '}',
  ];
  // Clean code lines
  const cleanLines = [
    'calculateFare(route);',
    'calculateFare(route, cls);',
    'calculateFare(route, cls, peak);',
  ];

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
            API DESIGN · CLEAN CODE
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Calling Code
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Stays Clean
          </text>
        </g>

        {/* ── LEFT: MESSY (without overloading) ──────────────────────────── */}
        <g opacity={messyC.opacity} transform={`translate(0, ${messyC.translateY})`}>
          <BentoCard x={60} y={540} w={460} h={520} />
          <text x={290} y={588} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            WITHOUT OVERLOADING
          </text>
          {/* Messy code block */}
          {messyLines.map((line, i) => (
            <text key={i} x={100} y={640 + i * 48}
              fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={22} fontWeight={500}
              fill={COLORS.text_muted} opacity={0.7}>
              {line}
            </text>
          ))}
          {/* Red X over messy code */}
          <line x1={100} y1={630} x2={480} y2={970}
            stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeDasharray={crossLen * 6} strokeDashoffset={crossD1 * 6}
            strokeLinecap="round" opacity={crossE.opacity * 0.5} />
          <line x1={480} y1={630} x2={100} y2={970}
            stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeDasharray={crossLen * 6} strokeDashoffset={crossD2 * 6}
            strokeLinecap="round" opacity={crossE.opacity * 0.5} />
        </g>

        {/* ── RIGHT: CLEAN (with overloading) ────────────────────────────── */}
        <g opacity={cleanC.opacity} transform={`translate(0, ${cleanC.translateY})`}>
          <BentoCard x={560} y={540} w={460} h={520} accent />
          <text x={790} y={588} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            WITH OVERLOADING
          </text>
          {/* Clean code */}
          {cleanLines.map((line, i) => (
            <text key={i} x={600} y={660 + i * 72}
              fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={24} fontWeight={500}
              fill={COLORS.accent} opacity={0.9}>
              {line}
            </text>
          ))}
          {/* Green check */}
          <path d="M 750,880 L 780,920 L 850,840"
            fill="none" stroke={COLORS.accent} strokeWidth={5}
            strokeDasharray={checkLen} strokeDashoffset={checkD}
            strokeLinecap="round"
            opacity={checkE.opacity} />

          {/* Sparkle lines */}
          {[
            { x1: 900, y1: 820, x2: 920, y2: 800 },
            { x1: 920, y1: 840, x2: 940, y2: 830 },
            { x1: 890, y1: 850, x2: 910, y2: 860 },
          ].map((s, i) => (
            <line key={i}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={sparkLen} strokeDashoffset={sparkD}
              strokeLinecap="round"
              opacity={checkE.opacity * 0.5} />
          ))}
        </g>

        {/* ── Code simplification card ───────────────────────────────────── */}
        <g opacity={codeBox.opacity} transform={`translate(0, ${codeBox.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={130} />
          <rect x={60} y={1100} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={540} y={1175} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            No <tspan fill={COLORS.vibrant_red}>if-else chains</tspan> — just call <tspan fill={COLORS.accent} fontStyle="italic">calculateFare()</tspan>
          </text>
        </g>

        {/* ── Detail row ─────────────────────────────────────────────────── */}
        <g opacity={detailR.opacity} transform={`translate(0, ${detailR.translateY})`}>
          <BentoCard x={60} y={1270} w={460} h={130} />
          <text x={100} y={1330}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            7 lines → 3 lines
          </text>
          <text x={100} y={1370}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Less branching logic
          </text>
        </g>
        <g opacity={detailR.opacity} transform={`translate(0, ${detailR.translateY})`}>
          <BentoCard x={560} y={1270} w={460} h={130} accent />
          <text x={600} y={1330}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Compiler handles routing
          </text>
          <text x={600} y={1370}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Zero runtime overhead
          </text>
        </g>

        {/* ── Summary ────────────────────────────────────────────────────── */}
        <g opacity={summE.opacity} transform={`translate(0, ${summE.translateY})`}>
          <BentoCard x={120} y={1450} w={840} h={100} />
          <text x={540} y={1512} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Overloading keeps calling code <tspan fill={COLORS.accent}>simple</tspan> and <tspan fill={COLORS.accent}>readable</tspan>
          </text>
        </g>

        {/* ── Floating micro-anim ────────────────────────────────────────── */}
        <g transform={`translate(160, ${1620 + breathe})`} opacity={0.1}>
          <circle cx={0} cy={0} r={10}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(920, ${1640 + breathe * 0.7})`} opacity={shimmer * 0.1}>
          <circle cx={0} cy={0} r={6} fill={COLORS.accent} />
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
            sceneDuration={SCENE_TIMING.s19.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
