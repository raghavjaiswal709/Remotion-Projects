/**
 * Scene 13 — SignatureChooses
 * "The signature chooses for you."
 * CSV: 43.980s → 45.480s
 * Duration: 67 frames (2.23s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline spring
 *   Phase 2 (frames 12–50): Signature fingerprint SVG, match indicator
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

export const Scene13_SignatureChooses: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const heroA    = useSpringEntrance(frame, 4);
  const heroB    = useSpringEntrance(frame, 8);
  const subline  = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const fpCard    = useSpringEntrance(frame, 14);
  const sig1      = useSpringEntrance(frame, 18);
  const sig2      = useSpringEntrance(frame, 24);
  const sig3      = useSpringEntrance(frame, 30);
  const matchCard = useSpringEntrance(frame, 36);
  const bottomRow = useSpringEntrance(frame, 42);

  // ── Fingerprint arcs path draw ─────────────────────────────────────────────
  const fpArc1 = usePathDraw(frame, 16, 320, 20);
  const fpArc2 = usePathDraw(frame, 20, 260, 20);
  const fpArc3 = usePathDraw(frame, 24, 200, 20);
  const fpArc4 = usePathDraw(frame, 28, 140, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glow    = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

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
            METHOD SIGNATURE · IDENTITY
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            The Signature
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Chooses
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={540} y={480} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>
            Parameter types are the method's fingerprint
          </text>
        </g>

        {/* ── Fingerprint illustration ────────────────────────────────────── */}
        <g opacity={fpCard.opacity} transform={`translate(0, ${fpCard.translateY})`}>
          <BentoCard x={60} y={540} w={500} h={500} accent />

          {/* Fingerprint arcs — concentric curves */}
          <g transform="translate(310, 790)">
            <path d="M -120,0 Q -120,-90 0,-90 Q 120,-90 120,0"
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={320} strokeDashoffset={fpArc1}
              strokeLinecap="round" />
            <path d="M -90,10 Q -90,-60 0,-60 Q 90,-60 90,10"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={260} strokeDashoffset={fpArc2}
              strokeLinecap="round" opacity={0.7} />
            <path d="M -60,15 Q -60,-35 0,-35 Q 60,-35 60,15"
              fill="none" stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={200} strokeDashoffset={fpArc3}
              strokeLinecap="round" opacity={0.5} />
            <path d="M -30,18 Q -30,-12 0,-12 Q 30,-12 30,18"
              fill="none" stroke={COLORS.accent} strokeWidth={1.5}
              strokeDasharray={140} strokeDashoffset={fpArc4}
              strokeLinecap="round" opacity={0.3} />
            {/* Center dot */}
            <circle cx={0} cy={20} r={5}
              fill={COLORS.accent} fillOpacity={glow * 0.8} />
          </g>

          {/* Decorative ridges */}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={i}
              x1={130 + i * 20} y1={870}
              x2={130 + i * 20} y2={920}
              stroke={COLORS.accent} strokeWidth={1.5}
              opacity={fpCard.opacity * 0.15} />
          ))}

          <text x={310} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            SIGNATURE = IDENTITY
          </text>
        </g>

        {/* ── Three signature rows ───────────────────────────────────────── */}
        <g opacity={sig1.opacity} transform={`translate(0, ${sig1.translateY})`}>
          <BentoCard x={600} y={540} w={420} h={130} />
          <circle cx={660} cy={605} r={16}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={660} y={613} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>1</text>
          <text x={700} y={600}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            (String)
          </text>
          <text x={700} y={640}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            route only
          </text>
        </g>

        <g opacity={sig2.opacity} transform={`translate(0, ${sig2.translateY})`}>
          <BentoCard x={600} y={700} w={420} h={130} accent />
          <circle cx={660} cy={765} r={16}
            fill={COLORS.accent} fillOpacity={0.3}
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '660px 765px' }} />
          <text x={660} y={773} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>2</text>
          <text x={700} y={760}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            (String, String)
          </text>
          <text x={700} y={800}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            route + class
          </text>
        </g>

        <g opacity={sig3.opacity} transform={`translate(0, ${sig3.translateY})`}>
          <BentoCard x={600} y={860} w={420} h={130} />
          <circle cx={660} cy={925} r={16}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={660} y={933} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>3</text>
          <text x={700} y={920}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            (String, String, boolean)
          </text>
          <text x={700} y={960}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            route + class + peak
          </text>
        </g>

        {/* ── Match card ─────────────────────────────────────────────────── */}
        <g opacity={matchCard.opacity} transform={`translate(0, ${matchCard.translateY})`}>
          <BentoCard x={60} y={1110} w={960} h={160} accent />
          <rect x={60} y={1110} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={540} y={1180} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Each <tspan fill={COLORS.accent} fontStyle="italic">signature</tspan> is unique
          </text>
          <text x={540} y={1230} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>
            The parameter list IS the selector — nothing else needed
          </text>
        </g>

        {/* ── Bottom info row ────────────────────────────────────────────── */}
        <g opacity={bottomRow.opacity} transform={`translate(0, ${bottomRow.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={120} />
          <text x={100} y={1410}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Name + Types = Identity
          </text>
        </g>
        <g opacity={bottomRow.opacity} transform={`translate(0, ${bottomRow.translateY})`}>
          <BentoCard x={560} y={1340} w={460} h={120} />
          <text x={600} y={1410}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Unique fingerprint
          </text>
        </g>

        {/* ── Floating micro ─────────────────────────────────────────────── */}
        <g transform={`translate(200, ${1580 + breathe})`} opacity={0.2}>
          <circle cx={0} cy={0} r={14} fill={COLORS.accent} fillOpacity={0.06} />
        </g>
        <g transform={`translate(880, ${1620 + breathe * 0.7})`} opacity={shimmer * 0.2}>
          <circle cx={0} cy={0} r={20}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        <g opacity={bottomRow.opacity * 0.35}>
          <text x={540} y={1560} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            The method name alone is shared — the identity lies in the params
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
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
