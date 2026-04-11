/**
 * Scene10 — Same Name, Different Implementation
 * "The name stays the same. The implementation inside changes."
 * CSV: 37.18s → 40.98s
 * Duration: 129 frames (4.3s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Scene reveal — label slides, headline springs up
 *   Phase 2 (frames 20–80):  Two method blocks side by side, name highlighted same, body different
 *   Phase 3 (frames 70–end): Pulse on "SAME" label, shimmer on "DIFFERENT" label, breathe float
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

// ─── Spring configs ───────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

// ─── Helper: spring-based entrance ────────────────────────────────────────────
function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

// ─── Helper: path-draw ────────────────────────────────────────────────────────
function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene10_SameNameDifferentImpl: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (frames 0–25) ────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineWord0 = useSpringEntrance(frame, 4);
  const headlineWord1 = useSpringEntrance(frame, 8);
  const headlineWord2 = useSpringEntrance(frame, 12);
  const headlineWord3 = useSpringEntrance(frame, 16);

  // ── Phase 2: Content build (stagger 12 frames) ────────────────────────────
  const nameBarEntrance = useSpringEntrance(frame, 24);
  const leftBlock = useSpringEntrance(frame, 30);
  const rightBlock = useSpringEntrance(frame, 42);
  const sameBadge = useSpringEntrance(frame, 50);
  const diffBadge = useSpringEntrance(frame, 58);
  const arrowDown = useSpringEntrance(frame, 64);
  const implCard1 = useSpringEntrance(frame, 70);
  const implCard2 = useSpringEntrance(frame, 78);
  const summaryCard = useSpringEntrance(frame, 86);

  // ── Path draw for connectors ──────────────────────────────────────────────
  const connectorLeft = usePathDraw(frame, 55, 180, 25);
  const connectorRight = usePathDraw(frame, 60, 180, 25);
  const bracketDraw = usePathDraw(frame, 68, 400, 30);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.08, 0.18]);

  // ── Border draw animations ────────────────────────────────────────────────
  const LEFT_PERIM = 2 * (420 + 280);
  const RIGHT_PERIM = 2 * (420 + 280);
  const leftBorderDash = interpolate(frame, [30, 60], [LEFT_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rightBorderDash = interpolate(frame, [42, 72], [RIGHT_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Headline words ────────────────────────────────────────────────────────
  const headlineWords = [
    { text: 'Same Name.', spring: headlineWord0, color: COLORS.orange },
    { text: 'Different', spring: headlineWord1, color: COLORS.deep_black },
    { text: 'Implementation', spring: headlineWord2, color: COLORS.sky_blue },
    { text: 'Inside.', spring: headlineWord3, color: COLORS.deep_black },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="METHOD OVERRIDING · CORE CONCEPT" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Per-word headline ──────────────────────────────────── */}
        {headlineWords.map((w, i) => (
          <g key={i} transform={`translate(0, ${w.spring.translateY})`} opacity={w.spring.opacity}>
            <text
              x={60}
              y={220 + i * 60}
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={i === 0 ? 72 : 52}
              fontWeight={i === 0 ? 900 : 700}
              fill={w.color}
            >
              {w.text}
            </text>
          </g>
        ))}

        {/* ── ZONE C — Main visual content ───────────────────────────────── */}

        {/* Shared method name bar at top center */}
        <g opacity={nameBarEntrance.opacity} transform={`translate(0, ${nameBarEntrance.translateY})`}>
          <rect x={240} y={480} width={600} height={70} rx={12}
            fill={COLORS.orange} fillOpacity={0.12}
            stroke={COLORS.orange} strokeWidth={2.5} />
          <text x={540} y={526} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={34} fontWeight={700} fill={COLORS.orange}>
            calculateFare()
          </text>
        </g>

        {/* "SAME NAME" badge above method bar */}
        <g opacity={sameBadge.opacity * shimmer} transform={`translate(540, ${458 + sameBadge.translateY})`}>
          <text textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={800} fill={COLORS.orange}
            letterSpacing="0.15em">
            SAME NAME
          </text>
        </g>

        {/* Connector lines from method name to left/right blocks */}
        <path
          d="M 390,550 L 300,620"
          fill="none" stroke={COLORS.orange} strokeWidth={2.5}
          strokeDasharray={180} strokeDashoffset={connectorLeft}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />
        <path
          d="M 690,550 L 780,620"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5}
          strokeDasharray={180} strokeDashoffset={connectorRight}
          strokeLinecap="round" markerEnd="url(#arrowBlue)"
        />

        {/* Left block — ExpressTrain implementation */}
        <g opacity={leftBlock.opacity} transform={`translate(60, ${640 + leftBlock.translateY})`}>
          {/* Border draw animation */}
          <rect x={0} y={0} width={420} height={280} rx={16}
            fill="none" stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={LEFT_PERIM} strokeDashoffset={leftBorderDash} />
          {/* Fill (fades in after border) */}
          <rect x={0} y={0} width={420} height={280} rx={16}
            fill={COLORS.orange} fillOpacity={0.06} />

          {/* Class header */}
          <rect x={0} y={0} width={420} height={56} rx={16}
            fill={COLORS.orange} fillOpacity={0.15} />
          <rect x={0} y={28} width={420} height={28}
            fill={COLORS.orange} fillOpacity={0.15} />
          <text x={210} y={40} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800} fill={COLORS.orange}>
            ExpressTrain
          </text>

          {/* Implementation code */}
          <text x={24} y={100}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            baseFare * 1.5
          </text>
          <text x={24} y={136}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            + premiumCharge
          </text>
          <text x={24} y={172}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            + serviceTax
          </text>

          {/* Accent bar */}
          <rect x={0} y={210} width={420} height={4} fill={COLORS.orange} fillOpacity={0.3} />

          {/* Price indicator */}
          <text x={210} y={256} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900} fill={COLORS.orange}>
            PREMIUM
          </text>
        </g>

        {/* Right block — MetroTrain implementation */}
        <g opacity={rightBlock.opacity} transform={`translate(600, ${640 + rightBlock.translateY})`}>
          <rect x={0} y={0} width={420} height={280} rx={16}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={RIGHT_PERIM} strokeDashoffset={rightBorderDash} />
          <rect x={0} y={0} width={420} height={280} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.06} />

          {/* Class header */}
          <rect x={0} y={0} width={420} height={56} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.15} />
          <rect x={0} y={28} width={420} height={28}
            fill={COLORS.sky_blue} fillOpacity={0.15} />
          <text x={210} y={40} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800} fill={COLORS.sky_blue}>
            MetroTrain
          </text>

          {/* Implementation code */}
          <text x={24} y={100}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            if (dist {'<'} 5) ₹10
          </text>
          <text x={24} y={136}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            if (dist {'<'} 15) ₹25
          </text>
          <text x={24} y={172}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            if (dist {'<'} 30) ₹40
          </text>

          <rect x={0} y={210} width={420} height={4} fill={COLORS.sky_blue} fillOpacity={0.3} />

          <text x={210} y={256} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900} fill={COLORS.sky_blue}>
            DISTANCE
          </text>
        </g>

        {/* "DIFFERENT IMPLEMENTATION" badge between blocks */}
        <g opacity={diffBadge.opacity} transform={`translate(0, ${diffBadge.translateY})`}>
          <rect x={340} y={940} width={400} height={52} rx={26}
            fill={COLORS.green} fillOpacity={0.12}
            stroke={COLORS.green} strokeWidth={2} />
          <text x={540} y={974} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={800}
            fill={COLORS.green} letterSpacing="0.12em">
            DIFFERENT LOGIC
          </text>
        </g>

        {/* Downward bracket from both blocks to summary */}
        <path
          d="M 280,920 L 280,1020 L 540,1020 L 800,1020 L 800,920"
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
          strokeDasharray={400} strokeDashoffset={bracketDraw}
          strokeLinecap="round"
        />

        {/* Arrow down from bracket to summary card */}
        <g opacity={arrowDown.opacity} transform={`translate(0, ${arrowDown.translateY})`}>
          <line x1={540} y1={1020} x2={540} y2={1080}
            stroke={COLORS.cool_silver} strokeWidth={2}
            markerEnd="url(#arrowBlue)" />
        </g>

        {/* Summary insight card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <rect x={80} y={1100} width={920} height={260} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.cool_silver} strokeWidth={1.5} />
          <rect x={80} y={1100} width={6} height={260} rx={3}
            fill={COLORS.orange} />

          <text x={120} y={1152}
            fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800} fill={COLORS.deep_black}>
            Key Insight
          </text>

          <text x={120} y={1200}
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500} fill={COLORS.deep_black}>
            The method signature is identical.
          </text>
          <text x={120} y={1244}
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500} fill={COLORS.deep_black}>
            The behavior inside each class is
          </text>
          <text x={120} y={1288}
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.orange}>
            completely unique to that train type.
          </text>
        </g>

        {/* Implementation detail cards below */}
        <g opacity={implCard1.opacity} transform={`translate(80, ${1400 + implCard1.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={12}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.orange} />
          <text x={30} y={42}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            Same Signature
          </text>
          <text x={30} y={82}
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Name, params, return type
          </text>
        </g>

        <g opacity={implCard2.opacity} transform={`translate(560, ${1400 + implCard2.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={42}
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            Different Body
          </text>
          <text x={30} y={82}
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Logic, formulas, execution
          </text>
        </g>

        {/* Floating pulse on SAME NAME badge */}
        <g transform={`translate(540, ${458 + breathe})`} opacity={glowPulse}>
          <circle cx={0} cy={0} r={42}
            fill="none" stroke={COLORS.orange} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
