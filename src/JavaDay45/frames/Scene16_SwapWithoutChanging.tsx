/**
 * Scene 16 — Swap Without Changing
 * "This is why you can swap ExpressFareCalculator for MetroFareCalculator
 *  without changing a single line of calling code."
 * CSV: 54.520s → 62.360s
 * Duration: 235 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Headline
 *   Phase 2 (frames 20–100): Two swap cards, calling code unchanged
 *   Phase 3 (frames 90–end): Swap animation, floating elements
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

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

export const Scene16_SwapWithoutChanging: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 9);

  const codeCard  = useSpringEntrance(frame, 16);
  const beforeCard = useSpringEntrance(frame, 28);
  const afterCard  = useSpringEntrance(frame, 40);
  const swapArrow  = useSpringEntrance(frame, 50);
  const unchangedCard = useSpringEntrance(frame, 60);
  const benefitTile1 = useSpringEntrance(frame, 70);
  const benefitTile2 = useSpringEntrance(frame, 78);
  const benefitTile3 = useSpringEntrance(frame, 86);

  // Swap animation — Express slides out, Metro slides in
  const swapProgress = interpolate(frame, [100, 140], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const expressX = interpolate(swapProgress, [0, 1], [0, -400]);
  const expressOp = interpolate(swapProgress, [0, 0.5], [1, 0], { extrapolateRight: 'clamp' });
  const metroX   = interpolate(swapProgress, [0, 1], [400, 0]);
  const metroOp  = interpolate(swapProgress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' });

  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 52, arrowLen, 25);

  const pulse   = 1 + Math.sin(frame * 0.06) * 0.012;
  const breathe = Math.sin(frame * 0.04) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · FLEXIBILITY" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Swap Without
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.accent}>
            Changing Code
          </text>
        </g>

        {/* ── Calling code card (unchanged) ─────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={160} />
          <rect x={60} y={460} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={515} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">CALLING CODE — NEVER CHANGES</text>
          <text x={100} y={570} fontFamily="'Fira Code', monospace"
            fontSize={32} fontWeight={500} fill={COLORS.white}>
            fc.calculate(ticket);
          </text>
          <text x={100} y={605} fontFamily="'Fira Code', monospace"
            fontSize={24} fontWeight={500} fill={COLORS.text_muted}>
            // same line, different behavior
          </text>
        </g>

        {/* ── Swap visualization ───────────────────────────────────────── */}
        <g opacity={beforeCard.opacity}>
          {/* Express card — slides out */}
          <g transform={`translate(${expressX}, ${beforeCard.translateY})`} opacity={expressOp}>
            <BentoCard x={60} y={660} w={460} h={200} accent />
            <text x={100} y={715} fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent}>BEFORE</text>
            <text x={100} y={765} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>ExpressFare</text>
            <text x={100} y={810} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>Calculator</text>
            <text x={100} y={845} fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted}>Express surcharge</text>
          </g>
        </g>

        {/* Metro card — slides in */}
        <g opacity={afterCard.opacity}>
          <g transform={`translate(${metroX}, ${afterCard.translateY})`} opacity={metroOp}>
            <BentoCard x={560} y={660} w={460} h={200} accent />
            <text x={600} y={715} fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent}>AFTER</text>
            <text x={600} y={765} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>MetroFare</text>
            <text x={600} y={810} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>Calculator</text>
            <text x={600} y={845} fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted}>Metro zone pricing</text>
          </g>
        </g>

        {/* ── Swap arrow ───────────────────────────────────────────────── */}
        <g opacity={swapArrow.opacity}>
          <path d="M 460,760 C 500,720 520,720 560,760"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" />
          <text x={510} y={710} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>SWAP</text>
        </g>

        {/* ── Unchanged card ───────────────────────────────────────────── */}
        <g opacity={unchangedCard.opacity} transform={`translate(0, ${unchangedCard.translateY})`}>
          <BentoCard x={60} y={900} w={960} h={120} accent />
          <text x={100} y={970} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Zero lines of calling code changed
          </text>
        </g>

        {/* ── Benefit tiles ────────────────────────────────────────────── */}
        {[
          { label: 'Open/Closed', desc: 'New behavior', e: benefitTile1, x: 60  },
          { label: 'Loose Coupling', desc: 'No dependency', e: benefitTile2, x: 390 },
          { label: 'Testable', desc: 'Mock objects', e: benefitTile3, x: 720 },
        ].map((b, i) => (
          <g key={i} opacity={b.e.opacity} transform={`translate(0, ${b.e.translateY})`}>
            <BentoCard x={b.x} y={1060} w={300} h={180} accent={i === 0} />
            <text x={b.x + 150} y={1130} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.accent}>{b.label}</text>
            <text x={b.x + 150} y={1175} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted}>{b.desc}</text>
          </g>
        ))}

        {/* ── Locomotive illustration ───────────────────────────────────── */}
        <g opacity={0.1 * shimmer} transform={`translate(200, ${1340 + breathe})`}>
          {/* Train body */}
          <rect x={0} y={0} width={280} height={100} rx={12} fill="none"
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Cab */}
          <rect x={220} y={-30} width={60} height={30} rx={6} fill="none"
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Smokestack */}
          <rect x={50} y={-25} width={20} height={25} rx={4} fill="none"
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Wheels */}
          <circle cx={60} cy={110} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={140} cy={110} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={220} cy={110} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          {/* Tracks */}
          <line x1={-20} y1={130} x2={310} y2={130} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={-20} y1={136} x2={310} y2={136} stroke={COLORS.accent} strokeWidth={2} />
        </g>

        {/* ── Bottom tracks ────────────────────────────────────────────── */}
        <g opacity={0.06 * shimmer}>
          <line x1={60} y1={1640} x2={1020} y2={1640} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1650} x2={1020} y2={1650} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={90 + i * 72} y={1635} width={24} height={6} rx={2}
              fill={COLORS.accent} opacity={0.25} />
          ))}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
