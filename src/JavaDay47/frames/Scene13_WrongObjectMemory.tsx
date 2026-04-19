/**
 * Scene 13 — Wrong Object in Memory
 * "If T does not actually hold an Express train in memory,"
 * CSV: 50.840s → 54.260s
 * Duration: ~102 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–60): Memory diagram showing wrong object
 *   Phase 3 (frames 50–end): Pulsing X / warning
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene13_WrongObjectMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const codeCard = useSpringEntrance(frame, 14);
  const memBlock = useSpringEntrance(frame, 22);
  const xMark = useSpringEntrance(frame, 34);
  const questionCard = useSpringEntrance(frame, 44);
  const bottomCard = useSpringEntrance(frame, 54);

  // Pointer arrow
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 28, arrowLen, 20);

  // X cross path
  const crossLen = 120;
  const crossDash = usePathDraw(frame, 36, crossLen, 15);

  const breathe = Math.sin(frame * 0.06) * 4;
  const warnPulse = 0.6 + Math.sin(frame * 0.1) * 0.4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[12];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MEMORY · MISMATCH" y={160} opacity={0.8} />
        </g>

        {/* Zone B — headline */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            What if T holds
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.vibrant_red}>
            the wrong type?
          </text>
        </g>

        {/* Code card — Train t = new FreightTrain() scenario */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={120} />
          <rect x={60} y={480} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={555} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.text_muted}>
            Train t = new
          </text>
          <text x={440} y={555} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.vibrant_red}>
            {' FreightTrain'}
          </text>
          <text x={740} y={555} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.text_muted}>
            ();
          </text>
        </g>

        {/* Memory block — showing FreightTrain NOT ExpressTrain */}
        <g opacity={memBlock.opacity} transform={`translate(0, ${memBlock.translateY})`}>
          {/* JVM heap label */}
          <text x={540} y={660} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} letterSpacing="0.15em">
            JVM HEAP MEMORY
          </text>

          {/* Memory block */}
          <BentoCard x={180} y={690} w={720} h={320} accent />
          <rect x={180} y={690} width={720} height={60} rx={0}
            fill={COLORS.vibrant_red} fillOpacity={0.15} />
          <text x={540} y={730} textAnchor="middle"
            fontFamily={MONO} fontSize={36} fontWeight={700} fill={COLORS.vibrant_red}>
            FreightTrain instance
          </text>

          {/* Fields */}
          <text x={220} y={800} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            cargoWeight: 50000
          </text>
          <text x={220} y={845} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            hazardous: true
          </text>
          <text x={220} y={890} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            loadManifest()
          </text>

          {/* NO Express methods */}
          <line x1={220} y1={920} x2={860} y2={920} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={540} y={960} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red} opacity={warnPulse}>
            NO serveLunch() — NO reserveSeat()
          </text>
        </g>

        {/* Pointer arrow from "t" to memory block */}
        <path d="M 200,600 L 200,690"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Big X mark over the "cast to ExpressTrain" idea */}
        <g opacity={xMark.opacity} transform={`translate(780, ${1060 + breathe})`}>
          <path d="M -30,-30 L 30,30 M 30,-30 L -30,30"
            stroke={COLORS.vibrant_red} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={crossLen} strokeDashoffset={crossDash} />
          <circle cx={0} cy={0} r={45} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.2 * warnPulse} />
        </g>

        {/* Question card */}
        <g opacity={questionCard.opacity} transform={`translate(0, ${questionCard.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={180} />
          <rect x={60} y={1100} width={8} height={180} rx={4} fill={COLORS.vibrant_red} />
          <text x={110} y={1175} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Casting to ExpressTrain would fail
          </text>
          <text x={110} y={1230} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            The object in memory is NOT an ExpressTrain
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={140} />
          <text x={540} y={1405} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            The cast compiles — but the JVM rejects it at runtime
          </text>
        </g>

        {/* Train illustration — freight train at bottom */}
        <g opacity={bottomCard.opacity * shimmer} transform={`translate(540, ${1560 + breathe})`}>
          {/* Simple freight car silhouette */}
          <rect x={-200} y={-40} width={400} height={80} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Cargo boxes */}
          <rect x={-170} y={-70} width={80} height={40} rx={4}
            fill={COLORS.vibrant_red} fillOpacity={0.15} stroke={COLORS.vibrant_red} strokeWidth={1} />
          <rect x={-70} y={-70} width={80} height={40} rx={4}
            fill={COLORS.vibrant_red} fillOpacity={0.15} stroke={COLORS.vibrant_red} strokeWidth={1} />
          <rect x={30} y={-70} width={80} height={40} rx={4}
            fill={COLORS.vibrant_red} fillOpacity={0.15} stroke={COLORS.vibrant_red} strokeWidth={1} />
          {/* Wheels */}
          <circle cx={-140} cy={54} r={20} fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={2} />
          <circle cx={-60} cy={54} r={20} fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={2} />
          <circle cx={60} cy={54} r={20} fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={2} />
          <circle cx={140} cy={54} r={20} fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={2} />
          {/* Rails */}
          <line x1={-250} y1={80} x2={250} y2={80} stroke={COLORS.text_muted} strokeWidth={3} />
          <line x1={-250} y1={88} x2={250} y2={88} stroke={COLORS.text_muted} strokeWidth={3} />
          {/* Label */}
          <text x={0} y={10} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            FREIGHT
          </text>
        </g>

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

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
