/**
 * Scene 15 — Object Lives At Reference
 * "based on what object actually lives at that reference."
 * CSV: 51.120s → 54.520s
 * Duration: 102 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Headline
 *   Phase 2 (frames 15–55): Memory diagram, ref→object arrow
 *   Phase 3 (frames 50–end): Pulse on object
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

export const Scene15_ObjectLivesAtReference: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 9);
  const refBox = useSpringEntrance(frame, 14);
  const arrowE = useSpringEntrance(frame, 22);
  const objBox = useSpringEntrance(frame, 28);
  const stackLabel = useSpringEntrance(frame, 34);
  const heapLabel  = useSpringEntrance(frame, 40);
  const tile1 = useSpringEntrance(frame, 46);
  const tile2 = useSpringEntrance(frame, 52);
  const insightCard = useSpringEntrance(frame, 58);

  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 24, arrowLen, 20);

  const pulse   = 1 + Math.sin(frame * 0.08) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Glow on object
  const glowR = interpolate(Math.sin(frame * 0.07), [-1, 1], [80, 95]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · MEMORY MODEL" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Object Lives
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            at That Reference
          </text>
        </g>

        {/* ── STACK section label ───────────────────────────────────────── */}
        <g opacity={stackLabel.opacity} transform={`translate(0, ${stackLabel.translateY})`}>
          <text x={200} y={510} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">STACK</text>
          <line x1={100} y1={520} x2={300} y2={520} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        </g>

        {/* ── HEAP section label ───────────────────────────────────────── */}
        <g opacity={heapLabel.opacity} transform={`translate(0, ${heapLabel.translateY})`}>
          <text x={780} y={510} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">HEAP</text>
          <line x1={640} y1={520} x2={920} y2={520} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        </g>

        {/* ── Reference box (Stack) ────────────────────────────────────── */}
        <g opacity={refBox.opacity} transform={`translate(0, ${refBox.translateY})`}>
          <BentoCard x={80} y={550} w={300} h={200} />
          <rect x={80} y={550} width={6} height={200} rx={3} fill={COLORS.accent} />

          <text x={120} y={600} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>REFERENCE</text>
          <text x={120} y={650} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>FareCalculator fc</text>
          <text x={120} y={700} fontFamily="'Fira Code', monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted}>@0x7F3A</text>
        </g>

        {/* ── Arrow from ref → object ──────────────────────────────────── */}
        <path d="M 380,650 C 460,650 520,650 620,650"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Object box (Heap) ────────────────────────────────────────── */}
        <g opacity={objBox.opacity} transform={`translate(0, ${objBox.translateY})`}>
          {/* Glow behind */}
          <circle cx={780} cy={650} r={glowR}
            fill={COLORS.accent} fillOpacity={0.04 * shimmer} />

          <BentoCard x={640} y={550} w={320} h={200} accent />

          <text x={680} y={600} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">ACTUAL OBJECT</text>
          <text x={680} y={650} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>ExpressFare</text>
          <text x={680} y={690} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>Calculator</text>
          <text x={680} y={730} fontFamily="'Fira Code', monospace"
            fontSize={24} fontWeight={500} fill={COLORS.text_muted}>@0x7F3A</text>

          {/* Pulse ring */}
          <rect x={640} y={550} width={320} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            opacity={0.3 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '800px 650px' }} />
        </g>

        {/* ── Key insight ──────────────────────────────────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={800} w={960} h={140} accent />
          <rect x={60} y={800} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={860} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            JVM looks at the actual object,
          </text>
          <text x={100} y={910} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            not the declared reference type
          </text>
        </g>

        {/* ── Bottom tiles ─────────────────────────────────────────────── */}
        <g opacity={tile1.opacity} transform={`translate(0, ${tile1.translateY})`}>
          <BentoCard x={60} y={980} w={460} h={160} />
          <text x={100} y={1035} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>DECLARED TYPE</text>
          <text x={100} y={1085} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>FareCalculator</text>
          <text x={100} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Compile-time view</text>
        </g>

        <g opacity={tile2.opacity} transform={`translate(0, ${tile2.translateY})`}>
          <BentoCard x={560} y={980} w={460} h={160} accent />
          <text x={600} y={1035} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>ACTUAL TYPE</text>
          <text x={600} y={1085} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>ExpressFareCalc</text>
          <text x={600} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Runtime truth</text>
        </g>

        {/* ── Locomotive outline (small) ────────────────────────────────── */}
        <g opacity={0.08 * shimmer} transform={`translate(300, ${1280 + breathe})`}>
          <rect x={0} y={0} width={180} height={80} rx={10} fill="none"
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={140} y={-20} width={40} height={20} rx={4} fill="none"
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={40} cy={90} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={100} cy={90} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={160} cy={90} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
        </g>

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <g opacity={0.07 * shimmer}>
          <line x1={60} y1={1640} x2={1020} y2={1640} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1650} x2={1020} y2={1650} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={90 + i * 72} y={1635} width={24} height={6} rx={2}
              fill={COLORS.accent} opacity={0.25} />
          ))}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
