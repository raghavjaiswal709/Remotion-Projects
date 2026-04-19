/**
 * Scene 02 — Runtime Polymorphism Recap
 * "Last day, we learned how runtime polymorphism lets the actual objects type determine which method runs."
 * CSV: 6.060s → 12.580s
 * Duration: ~218 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–30): Label + headline spring
 *   Phase 2 (frames 20–90): Parent/child class boxes, method arrow draws
 *   Phase 3 (frames 80–end): Pulse, float
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene02_PolymorphismRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Phase 2
  const parentBox = useSpringEntrance(frame, 20);
  const childBox = useSpringEntrance(frame, 32);
  const arrowEnt = useSpringEntrance(frame, 44);
  const resultCard = useSpringEntrance(frame, 56);
  const methodCard = useSpringEntrance(frame, 68);

  // Arrows
  const inheritLen = 200;
  const inheritDash = usePathDraw(frame, 40, inheritLen, 25);
  const callLen = 300;
  const callDash = usePathDraw(frame, 55, callLen, 25);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Border draw
  const perimParent = 2 * (400 + 260);
  const borderParent = interpolate(frame, [20, 50], [perimParent, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const perimChild = 2 * (400 + 260);
  const borderChild = interpolate(frame, [32, 62], [perimChild, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · TICKETING ENGINE" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Yesterday
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Runtime Polymorphism
          </text>
        </g>

        {/* ZONE C — Parent class box */}
        <g opacity={parentBox.opacity} transform={`translate(0, ${parentBox.translateY})`}>
          <rect x={100} y={500} width={400} height={260} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={perimParent} strokeDashoffset={borderParent} />
          <rect x={100} y={500} width={400} height={260} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={100} y={500} width={400} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={300} y={542} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Train
          </text>
          <line x1={120} y1={560} x2={480} y2={560} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={140} y={610} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            + depart()
          </text>
          <text x={140} y={660} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            + schedule()
          </text>
          <text x={140} y={710} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            + announce()
          </text>
        </g>

        {/* Child class box */}
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY})`}>
          <rect x={580} y={500} width={400} height={260} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={perimChild} strokeDashoffset={borderChild} />
          <rect x={580} y={500} width={400} height={260} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={580} y={500} width={400} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.25} />
          <text x={780} y={542} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            ExpressTrain
          </text>
          <line x1={600} y1={560} x2={960} y2={560} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={620} y={610} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            + depart()
          </text>
          <text x={620} y={660} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            + expressLounge()
          </text>
          <text x={620} y={710} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            + priorityBoard()
          </text>
        </g>

        {/* Inheritance arrow */}
        <path d="M 580,630 L 500,630" fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={inheritLen} strokeDashoffset={inheritDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <text x={540} y={618} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
          fill={COLORS.text_muted} opacity={arrowEnt.opacity}>
          extends
        </text>

        {/* Method call illustration */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={60} y={840} w={960} h={180} accent />
          <rect x={60} y={840} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={915} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            t.depart()
          </text>
          <text x={540} y={915} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            →
          </text>
          <text x={600} y={915} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Runs ExpressTrain version
          </text>
          <text x={100} y={970} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Actual object type decides at runtime
          </text>
        </g>

        {/* Key insight card */}
        <g opacity={methodCard.opacity} transform={`translate(0, ${methodCard.translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={200} />
          <text x={100} y={1160} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Compile Time
          </text>
          <text x={100} y={1210} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Reference type checked
          </text>
          <text x={100} y={1250} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            by the compiler
          </text>

          <BentoCard x={560} y={1080} w={460} h={200} accent />
          <text x={600} y={1160} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Runtime
          </text>
          <text x={600} y={1210} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Actual object decides
          </text>
          <text x={600} y={1250} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            which method runs
          </text>
        </g>

        {/* Call flow arrow */}
        <path d="M 540,1020 L 540,1080" fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={callLen} strokeDashoffset={callDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Floating accents */}
        <g transform={`translate(900, ${1400 + breathe})`}>
          <circle cx={0} cy={0} r={36} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(180, ${1500 + breathe * 0.6})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.04} />
        </g>

        {/* Recap connector */}
        <g opacity={methodCard.opacity}>
          <BentoCard x={60} y={1340} w={960} h={160} />
          <text x={540} y={1410} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            The object in memory decides behavior
          </text>
          <text x={540} y={1460} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            not the reference type
          </text>
        </g>

        {/* Additional diagram: object vs reference */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${breathe * 0.5})`}>
          <BentoCard x={60} y={1560} w={960} h={140} />
          <circle cx={140} cy={1630} r={30} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={140} y={1638} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            OBJ
          </text>
          <line x1={170} y1={1630} x2={320} y2={1630} stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          <rect x={320} y={1605} width={200} height={50} rx={10} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={420} y={1638} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Express
          </text>
          <line x1={520} y1={1630} x2={620} y2={1630} stroke={COLORS.text_muted} strokeWidth={2} opacity={0.4} />
          <rect x={620} y={1605} width={200} height={50} rx={10} fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={720} y={1638} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Train ref
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s02.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
