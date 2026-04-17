/**
 * Scene 14 — Two Different Scopes
 * "Two different scopes,"
 * CSV: 61.660s → 63.760s
 * Duration: 63 frames (2.10s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * SHORT DRAMATIC SCENE — big typographic "TWO" + two contrasting scope circles.
 * Left circle: INSTANCE scope (per object), Right circle: STATIC scope (per class).
 * Minimalist but impactful — massive text, clean separation.
 *
 * Animation phases:
 *   Phase 1 (frames 0–18): TWO headline springs up, scope circles expand
 *   Phase 2 (frames 10–40): Labels appear, divider path-draw
 *   Phase 3 (frames 30–end): Pulse, shimmer, breathing
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

export const Scene14_TwoDifferentScopes: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const heroEntry = spring({ frame, fps, config: SPRING_SNAP });
  const heroOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const heroScale = interpolate(heroEntry, [0, 1], [0.7, 1]);
  const heroGhostOp = interpolate(frame, [0, 12], [0, 0.08], { extrapolateRight: 'clamp' });

  // Left circle (INSTANCE)
  const leftCircle = useSpringEntrance(frame, 8);
  const leftCircleScale = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_SOFT });
  const leftR = interpolate(leftCircleScale, [0, 1], [0, 140]);

  // Right circle (STATIC)
  const rightCircle = useSpringEntrance(frame, 12);
  const rightCircleScale = spring({ frame: Math.max(0, frame - 12), fps, config: SPRING_SOFT });
  const rightR = interpolate(rightCircleScale, [0, 1], [0, 140]);

  // Divider
  const dividerLen = 900;
  const dividerDash = usePathDraw(frame, 6, dividerLen, 18);

  // Labels
  const labelLeft = useSpringEntrance(frame, 16);
  const labelRight = useSpringEntrance(frame, 18);

  // Inner diagrams
  const innerLeftEntry = useSpringEntrance(frame, 22);
  const innerRightEntry = useSpringEntrance(frame, 24);

  // Bottom cards
  const card1 = useSpringEntrance(frame, 28);
  const card2 = useSpringEntrance(frame, 32);
  const card1Perim = 2 * (460 + 160);
  const card1BorderDash = interpolate(frame, [28, 46], [card1Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const card2Perim = 2 * (460 + 160);
  const card2BorderDash = interpolate(frame, [32, 50], [card2Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Summary banner
  const banner = useSpringEntrance(frame, 38);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const leftGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.04, 0.08]);
  const rightGlow = interpolate(Math.sin(frame * 0.1 + 1.5), [-1, 1], [0.04, 0.08]);
  const orbFloat = Math.sin(frame * 0.05) * 3;

  // Caption
  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="SCOPE · SEPARATION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero "TWO" ──────────────────────────────────────── */}
        <text x={540} y={440} textAnchor="middle"
          fontFamily={FONT} fontSize={280} fontWeight={800}
          fill={COLORS.accent} opacity={heroGhostOp}
          transform={`translate(0, 4) scale(1.04)`}
          style={{ transformOrigin: '540px 380px' }}>
          TWO
        </text>
        <text x={540} y={440} textAnchor="middle"
          fontFamily={FONT} fontSize={260} fontWeight={800}
          fill={COLORS.white} opacity={heroOp}
          transform={`scale(${heroScale})`}
          style={{ transformOrigin: '540px 380px' }}>
          TWO
        </text>
        <text x={540} y={510} textAnchor="middle"
          fontFamily={FONT} fontSize={52} fontWeight={800}
          fill={COLORS.accent} fontStyle="italic"
          opacity={heroOp}>
          DIFFERENT SCOPES
        </text>

        {/* ── Vertical divider ────────────────────────────────────────── */}
        <line x1={540} y1={560} x2={540} y2={1460}
          stroke="rgba(255,255,255,0.08)" strokeWidth={2}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
          strokeLinecap="round" />

        {/* ── Left circle: INSTANCE ───────────────────────────────────── */}
        <g opacity={leftCircle.opacity}>
          {/* Glow ring */}
          <circle cx={290} cy={760} r={leftR + 10}
            fill="none" stroke={COLORS.text_muted} strokeWidth={1}
            strokeOpacity={leftGlow} />
          {/* Main circle */}
          <circle cx={290} cy={760} r={leftR}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
          {/* Label */}
          <g opacity={labelLeft.opacity} transform={`translate(0, ${labelLeft.translateY})`}>
            <text x={290} y={740} textAnchor="middle"
              fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.text_muted}>
              INSTANCE
            </text>
            <text x={290} y={790} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.text_muted} opacity={0.6}>
              per Object
            </text>
          </g>

          {/* Inner: 3 small object dots */}
          <g opacity={innerLeftEntry.opacity}>
            {[-40, 0, 40].map((dx, i) => (
              <g key={i} transform={`translate(${290 + dx}, 840)`}>
                <rect x={-14} y={-14} width={28} height={28} rx={6}
                  fill={COLORS.text_muted} fillOpacity={0.06}
                  stroke={COLORS.text_muted} strokeWidth={1} strokeOpacity={0.15} />
                <text x={0} y={4} textAnchor="middle"
                  fontFamily={FONT} fontSize={14} fontWeight={800}
                  fill={COLORS.text_muted} opacity={0.5}>
                  {['A', 'B', 'C'][i]}
                </text>
              </g>
            ))}
            <text x={290} y={890} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.text_muted} opacity={0.4}>
              Each has own copy
            </text>
          </g>
        </g>

        {/* ── Right circle: STATIC ────────────────────────────────────── */}
        <g opacity={rightCircle.opacity}>
          {/* Glow ring */}
          <circle cx={790} cy={760} r={rightR + 10}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            strokeOpacity={rightGlow} />
          {/* Main circle */}
          <circle cx={790} cy={760} r={rightR}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Label */}
          <g opacity={labelRight.opacity} transform={`translate(0, ${labelRight.translateY})`}>
            <text x={790} y={740} textAnchor="middle"
              fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.accent}>
              STATIC
            </text>
            <text x={790} y={790} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent} opacity={0.6}>
              per Class
            </text>
          </g>

          {/* Inner: single shared node */}
          <g opacity={innerRightEntry.opacity}>
            <rect x={762} y={822} width={56} height={56} rx={10}
              fill={COLORS.accent} fillOpacity={0.08}
              stroke={COLORS.accent} strokeWidth={1.5}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '790px 850px' }} />
            <text x={790} y={856} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.accent}>
              1
            </text>
            <text x={790} y={900} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.accent} opacity={0.4}>
              One shared copy
            </text>
          </g>
        </g>

        {/* ── Bottom comparison cards ──────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <rect x={60} y={1000} width={460} height={160} rx={20}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1.5}
            strokeDasharray={card1Perim} strokeDashoffset={card1BorderDash} />
          <text x={80} y={1050} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            currentPassengerCount
          </text>
          <text x={80} y={1100} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Lives with the object
          </text>
          <text x={80} y={1136} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Dies with the object
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <rect x={560} y={1000} width={460} height={160} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={card2Perim} strokeDashoffset={card2BorderDash} />
          <text x={580} y={1050} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>
            totalPassengersInSystem
          </text>
          <text x={580} y={1100} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent} opacity={0.5}>
            Lives with the class
          </text>
          <text x={580} y={1136} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent} opacity={0.5}>
            Until JVM shuts down
          </text>
        </g>

        {/* ── Summary banner ───────────────────────────────────────────── */}
        <g opacity={banner.opacity} transform={`translate(0, ${banner.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={120} />
          <rect x={60} y={1200} width={6} height={120} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1270} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Two different scopes — never mix them up
          </text>
        </g>

        {/* ── Floating details ─────────────────────────────────────────── */}
        {/* Left side orbs */}
        <g transform={`translate(120, ${1420 + orbFloat})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.text_muted} fillOpacity={0.02 * shimmer} />
          <circle cx={0} cy={0} r={14} fill="none"
            stroke={COLORS.text_muted} strokeWidth={1} strokeOpacity={0.06} />
        </g>
        <g transform={`translate(960, ${1380 + orbFloat * -1})`}>
          <circle cx={0} cy={0} r={10} fill={COLORS.accent} fillOpacity={0.02 * shimmer} />
          <circle cx={0} cy={0} r={10} fill="none"
            stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.06} />
        </g>

        {/* Decorative tiny circles */}
        {[{x:80,y:1500},{x:200,y:1520},{x:350,y:1480},{x:500,y:1510},{x:700,y:1490},{x:860,y:1530},{x:1000,y:1500}].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y + breathe * (i % 2 === 0 ? 1 : -1) * 0.3}
            r={2} fill={i % 2 === 0 ? COLORS.text_muted : COLORS.accent}
            fillOpacity={0.06 * shimmer} />
        ))}

        {/* ── VS badge (center) ────────────────────────────────────────── */}
        <g opacity={banner.opacity * 0.5} transform={`translate(540, ${1550 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.bg_primary}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={0} y={7} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent}>
            VS
          </text>
        </g>

        {/* Arrow pair flanking VS */}
        <g opacity={banner.opacity * 0.3}>
          <line x1={440} y1={1550} x2={510} y2={1550}
            stroke={COLORS.text_muted} strokeWidth={1} markerEnd="url(#arrow)" />
          <line x1={640} y1={1550} x2={570} y2={1550}
            stroke={COLORS.accent} strokeWidth={1} markerEnd="url(#arrow)" />
        </g>

        {/* Terminal dots bottom */}
        <g opacity={banner.opacity * 0.2}>
          <circle cx={290} cy={1640} r={4} fill={COLORS.text_muted} fillOpacity={0.12} />
          <circle cx={790} cy={1640} r={4} fill={COLORS.accent} fillOpacity={0.12} />
          <line x1={290} y1={1640} x2={290} y2={1690}
            stroke={COLORS.text_muted} strokeWidth={1} strokeOpacity={0.06} />
          <line x1={790} y1={1640} x2={790} y2={1690}
            stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.06} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
