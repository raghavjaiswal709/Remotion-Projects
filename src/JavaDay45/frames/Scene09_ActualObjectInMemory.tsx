/**
 * Scene 09 — Actual Object In Memory
 * "Java looks at the actual object in memory, not the reference type."
 * CSV: 33.000s → 37.280s
 * Duration: 128 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label + headline
 *   Phase 2 (frames 20–70): Memory diagram with ref → object, cross on ref type
 *   Phase 3 (frames 60–end): Pulse on actual object, breathing
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene09_ActualObjectInMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 5);
  const headB  = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const refBox     = useSpringEntrance(frame, 18);
  const arrowE     = useSpringEntrance(frame, 28);
  const objectBox  = useSpringEntrance(frame, 32);
  const crossE     = useSpringEntrance(frame, 42);
  const checkE     = useSpringEntrance(frame, 50);
  const bottomCard = useSpringEntrance(frame, 56);

  // Arrow path
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 28, arrowLen, 20);

  // Cross lines
  const crossLen = 80;
  const crossDash = usePathDraw(frame, 42, crossLen, 15);

  // Check path
  const checkLen = 60;
  const checkDash = usePathDraw(frame, 50, checkLen, 15);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe  = Math.sin(frame * 0.06) * 4;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glow     = interpolate(Math.sin(frame * 0.07), [-1, 1], [0.08, 0.18]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · MEMORY MODEL" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Java Looks At
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            The Actual Object
          </text>
          <text x={60} y={480} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            not the reference type
          </text>
        </g>

        {/* ── ZONE C — Reference box (left) ────────────────────────────── */}
        <g opacity={refBox.opacity} transform={`translate(0, ${refBox.translateY})`}>
          <BentoCard x={60} y={560} w={400} h={280} />
          <text x={100} y={610} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">REFERENCE</text>
          <rect x={100} y={640} width={320} height={80} rx={12}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text x={260} y={692} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={34} fontWeight={500} fill={COLORS.white}>
            FareCalculator fc
          </text>
          <text x={100} y={770} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Declared type
          </text>
          <text x={100} y={810} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Parent class
          </text>
        </g>

        {/* ── Red X over "reference type" concept ──────────────────────── */}
        <g opacity={crossE.opacity}>
          <line x1={80} y1={760} x2={160} y2={820}
            stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={crossLen} strokeDashoffset={crossDash} />
          <line x1={160} y1={760} x2={80} y2={820}
            stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={crossLen} strokeDashoffset={crossDash} />
          <text x={180} y={800} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={crossE.opacity}>
            NOT THIS
          </text>
        </g>

        {/* ── Arrow ref → object ───────────────────────────────────────── */}
        <path d="M 470,700 L 610,700"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />
        <text x={510} y={680} fontFamily={FONT} fontSize={24} fontWeight={800}
          fill={COLORS.accent} opacity={arrowE.opacity}>
          points to
        </text>

        {/* ── Object box (right) — ACTUAL OBJECT ───────────────────────── */}
        <g opacity={objectBox.opacity} transform={`translate(0, ${objectBox.translateY})`}>
          {/* Glow behind */}
          <rect x={610} y={555} width={420} height={290} rx={24}
            fill={COLORS.accent} opacity={glow} />
          <BentoCard x={620} y={560} w={400} h={280} accent />
          <text x={660} y={610} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">ACTUAL OBJECT</text>
          <rect x={660} y={640} width={320} height={80} rx={12}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={820} y={692} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={500} fill={COLORS.accent}>
            ExpressFareCalc
          </text>
          <text x={660} y={770} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Runtime type
          </text>
          <text x={660} y={810} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Child class
          </text>
        </g>

        {/* ── Green check on actual object ─────────────────────────────── */}
        <g opacity={checkE.opacity}>
          <path d="M 950,560 L 970,585 L 1010,545"
            fill="none" stroke="#4ADE80" strokeWidth={4} strokeLinecap="round"
            strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          <text x={940} y={530} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill="#4ADE80" opacity={checkE.opacity}>
            THIS!
          </text>
        </g>

        {/* ── Memory address card ──────────────────────────────────────── */}
        <g opacity={objectBox.opacity}>
          <BentoCard x={620} y={870} w={400} h={90} />
          <text x={660} y={928} fontFamily="'Fira Code', monospace" fontSize={32} fontWeight={500}
            fill={COLORS.text_muted}>
            @0x7F3A · Heap
          </text>
        </g>

        {/* ── Summary card ─────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1020} w={960} h={260} accent />
          <rect x={60} y={1020} width={6} height={260} rx={3} fill={COLORS.accent} />

          {/* Memory diagram mini */}
          <rect x={120} y={1060} width={180} height={60} rx={10}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text x={210} y={1098} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            STACK: fc
          </text>
          <line x1={300} y1={1090} x2={380} y2={1090}
            stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)" />
          <rect x={380} y={1060} width={220} height={60} rx={10}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={490} y={1098} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            HEAP: Express
          </text>

          <text x={120} y={1170} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            JVM checks the heap object
          </text>
          <text x={120} y={1220} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Reference type is irrelevant at dispatch
          </text>
        </g>

        {/* ── Bottom tiles ─────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1320} w={460} h={160} />
          <text x={100} y={1380} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>REFERENCE</text>
          <text x={100} y={1430} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            FareCalculator
          </text>

          <BentoCard x={560} y={1320} w={460} h={160} accent />
          <text x={600} y={1380} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>ACTUAL</text>
          <text x={600} y={1430} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            ExpressFareCalc
          </text>
        </g>

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <g opacity={0.1 * shimmer}>
          <line x1={60} y1={1540} x2={1020} y2={1540} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1550} x2={1020} y2={1550} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1535} width={28} height={6} rx={2}
              fill={COLORS.accent} opacity={0.3} />
          ))}
        </g>

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
