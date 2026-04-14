/**
 * Scene 09 — Runtime Reads Output
 * "The runtime reads that output."
 * CSV: 38.800s → 40.560s
 * Duration: 71 frames (2.4s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Section label + headline spring
 *   Phase 2 (frames 15–50):  Runtime reader diagram: document → scanner → parse = quick build
 *   Phase 3 (frames 40–end): Scanner sweep, document pulse, data flow shimmer
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
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
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

export const Scene09_RuntimeReadsOutput: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 10);

  // ── Phase 2: Content build (fast for short scene) ──────────────────────────
  const docCard = useSpringEntrance(frame, 14);
  const scannerCard = useSpringEntrance(frame, 20);
  const parseCard = useSpringEntrance(frame, 28);
  const bottomCard = useSpringEntrance(frame, 36);

  // Arrow draws
  const arrowLen = 100;
  const arrow1 = usePathDraw(frame, 22, arrowLen, 12);
  const arrow2 = usePathDraw(frame, 30, arrowLen, 12);

  // Scanner sweep animation
  const scanProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const scanX = interpolate(scanProgress, [0, 1], [0, 300]);

  // Document border draw
  const docBorderLen = 2 * (300 + 380);
  const docBorderDash = usePathDraw(frame, 14, docBorderLen, 20);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.08) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.85, 1]);
  const scanBlink = Math.sin(frame * 0.25) > 0 ? 0.8 : 0.3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RUNTIME LAYER" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Runtime
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}>
            Reads
          </text>
        </g>

        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={480} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            Parsing the model&apos;s text output
          </text>
        </g>

        {/* ── ZONE C — Document → Scanner → Parsed Data flow ──────────────── */}

        {/* Document Card (model output) */}
        <g opacity={docCard.opacity} transform={`translate(0, ${docCard.translateY})`}>
          <BentoCard x={60} y={540} w={300} h={380} accent />
          <rect x={60} y={540} width={300} height={380} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={docBorderLen} strokeDashoffset={docBorderDash} />

          {/* Document icon — page with lines */}
          <g transform={`translate(210, ${660 + breathe})`}>
            <rect x={-40} y={-50} width={80} height={100} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            {/* Text lines */}
            <line x1={-26} y1={-30} x2={26} y2={-30}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.7} />
            <line x1={-26} y1={-14} x2={20} y2={-14}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
            <line x1={-26} y1={2} x2={26} y2={2}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.7} />
            <line x1={-26} y1={18} x2={14} y2={18}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
            <line x1={-26} y1={34} x2={26} y2={34}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.7} />
            {/* Folded corner */}
            <path d="M 20,-50 L 40,-50 L 40,-30 Z" fill={COLORS.accent} fillOpacity={0.2} />
          </g>

          <text x={210} y={780} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            TEXT OUTPUT
          </text>
          {/* Sample JSON mini */}
          <text x={100} y={830} fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.6 * shimmer}>
            {'{ "name": "search" }'}
          </text>
          <text x={100} y={872} fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.5 * shimmer}>
            {'{ "arguments": {...} }'}
          </text>
        </g>

        {/* Arrow 1: Document → Scanner */}
        <line x1={370} y1={730} x2={430} y2={730}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow1}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Scanner Card (runtime) */}
        <g opacity={scannerCard.opacity} transform={`translate(0, ${scannerCard.translateY})`}>
          <BentoCard x={430} y={540} w={260} h={380} />

          {/* Scanner eye icon */}
          <g transform={`translate(560, ${650 + breathe * 0.5})`}>
            {/* Outer eye shape */}
            <path d="M -36,0 C -36,-24 -12,-44 0,-44 C 12,-44 36,-24 36,0 C 36,24 12,44 0,44 C -12,44 -36,24 -36,0 Z"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Iris */}
            <circle cx={0} cy={0} r={16}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Pupil */}
            <circle cx={0} cy={0} r={6} fill={COLORS.accent} opacity={0.8 * shimmer} />
            {/* Scan lines radiating */}
            <line x1={-44} y1={-8} x2={-52} y2={-12}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={scanBlink} />
            <line x1={-44} y1={8} x2={-52} y2={12}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={scanBlink} />
            <line x1={44} y1={-8} x2={52} y2={-12}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={scanBlink} />
            <line x1={44} y1={8} x2={52} y2={12}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={scanBlink} />
          </g>

          <text x={560} y={760} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            RUNTIME
          </text>
          <text x={560} y={806} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Reads &amp; Parses
          </text>

          {/* Scanner sweep line */}
          <line x1={460 + scanX * 0.6} y1={840} x2={460 + scanX * 0.6} y2={900}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.4 * shimmer} />
          {/* Scanning dots */}
          {[0, 1, 2].map(i => (
            <circle key={i} cx={480 + i * 40} cy={880} r={4}
              fill={COLORS.accent}
              opacity={scanProgress > (i + 1) * 0.3 ? 0.7 * shimmer : 0.1} />
          ))}
        </g>

        {/* Arrow 2: Scanner → Parsed */}
        <line x1={700} y1={730} x2={760} y2={730}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow2}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Parsed Data Card */}
        <g opacity={parseCard.opacity} transform={`translate(0, ${parseCard.translateY})`}>
          <BentoCard x={760} y={540} w={260} h={380} accent />

          {/* Checkmark icon */}
          <g transform="translate(890, 660)">
            <circle cx={0} cy={0} r={32}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2.5}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            <path d="M -14,2 L -4,12 L 16,-10"
              fill="none" stroke={COLORS.accent} strokeWidth={3.5} strokeLinecap="round" />
          </g>

          <text x={890} y={750} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            PARSED
          </text>
          <text x={890} y={796} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Ready to Execute
          </text>

          {/* Structured data blocks */}
          <rect x={800} y={840} width={180} height={28} rx={6}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1} />
          <text x={810} y={860} fontFamily={MONO} fontSize={18} fontWeight={500} fill={COLORS.accent}>
            fn: search
          </text>
          <rect x={800} y={876} width={180} height={28} rx={6}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1} />
          <text x={810} y={896} fontFamily={MONO} fontSize={18} fontWeight={500} fill={COLORS.accent}>
            args: &#123;query&#125;
          </text>
        </g>

        {/* ── Bottom explanation card ──────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={260} />

          <text x={100} y={1060} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            The runtime is the{' '}
          </text>
          <text x={562} y={1060} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            interpreter
          </text>

          <text x={100} y={1120} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            It reads the model&apos;s structured text output and
          </text>
          <text x={100} y={1166} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            translates it into an actual function call.
          </text>
          <text x={100} y={1210} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Text → Parsed instruction → Ready for execution
          </text>
        </g>

        {/* ── Step labels ─────────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          {/* Step 1 */}
          <BentoCard x={60} y={1290} w={300} h={100} />
          <circle cx={100} cy={1340} r={18} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={100} y={1347} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>1</text>
          <text x={134} y={1346} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Read output
          </text>

          {/* Step 2 */}
          <BentoCard x={380} y={1290} w={300} h={100} />
          <circle cx={420} cy={1340} r={18} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={420} y={1347} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>2</text>
          <text x={454} y={1346} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Parse JSON
          </text>

          {/* Step 3 */}
          <BentoCard x={700} y={1290} w={320} h={100} />
          <circle cx={740} cy={1340} r={18} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={740} y={1347} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>3</text>
          <text x={774} y={1346} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Dispatch call
          </text>
        </g>

        {/* Floating dots */}
        <circle cx={100} cy={1440} r={3} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={980} cy={1460} r={2.5} fill={COLORS.accent} opacity={0.1 * shimmer} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
