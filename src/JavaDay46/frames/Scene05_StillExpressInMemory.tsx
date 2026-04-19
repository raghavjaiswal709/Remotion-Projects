/**
 * Scene 05 — Object Still ExpressTrain in Memory
 * "the object is still an express train in memory,"
 * CSV: 20.080s → 22.760s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Memory block, object glow, identity card
 *   Phase 3 (80–end): Breathe, pulse, shimmer
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

export const Scene05_StillExpressInMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Phase 2
  const memBlock = useSpringEntrance(frame, 20);
  const objGlow = useSpringEntrance(frame, 30);
  const fieldCards = [
    useSpringEntrance(frame, 36),
    useSpringEntrance(frame, 44),
    useSpringEntrance(frame, 52),
    useSpringEntrance(frame, 60),
  ];
  const identityCard = useSpringEntrance(frame, 68);
  const bottomCard = useSpringEntrance(frame, 78);

  // Path draws
  const borderLen = 2 * (800 + 560);
  const borderDash = usePathDraw(frame, 22, borderLen, 35);
  const pointerLen = 200;
  const pointerDash = usePathDraw(frame, 40, pointerLen, 25);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.08, 0.18]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UPCASTING · MEMORY" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Still Express
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            in Memory
          </text>
        </g>

        {/* ZONE C — Large memory block */}
        <g opacity={memBlock.opacity} transform={`translate(0, ${memBlock.translateY})`}>
          {/* Outer border draw */}
          <rect x={100} y={480} width={800} height={560} rx={24}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={borderLen} strokeDashoffset={borderDash}
            strokeLinecap="round" />
          {/* Fill */}
          <rect x={100} y={480} width={800} height={560} rx={24}
            fill={COLORS.bg_secondary} />

          {/* Heap label */}
          <rect x={120} y={495} width={160} height={40} rx={10}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={200} y={523} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            HEAP
          </text>

          {/* Glow ring around object */}
          <circle cx={500} cy={700} r={180} fill={COLORS.accent} fillOpacity={glowPulse}
            opacity={objGlow.opacity} />
          <circle cx={500} cy={700} r={180} fill="none" stroke={COLORS.accent} strokeWidth={2}
            opacity={objGlow.opacity * 0.6}
            transform={`scale(${pulse})`} style={{ transformOrigin: '500px 700px' }} />

          {/* Object box inside glow */}
          <rect x={320} y={580} width={360} height={240} rx={16}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={500} y={625} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
          <line x1={340} y1={645} x2={660} y2={645} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Object fields */}
          {['speed: 320', 'lounge: true', 'name: "ICE"', 'depart()'].map((field, i) => (
            <g key={i} opacity={fieldCards[i].opacity} transform={`translate(0, ${fieldCards[i].translateY * 0.3})`}>
              <text x={360} y={690 + i * 40} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={i === 3 ? COLORS.accent : COLORS.text_muted}>
                {field}
              </text>
            </g>
          ))}

          {/* Identity label */}
          <rect x={320} y={850} width={360} height={44} rx={10}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={500} y={880} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            instanceof ExpressTrain = true
          </text>
        </g>

        {/* Reference pointer from stack */}
        <g opacity={identityCard.opacity} transform={`translate(0, ${identityCard.translateY})`}>
          <BentoCard x={60} y={1100} w={400} h={200} accent />
          <text x={80} y={1155} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Stack Reference
          </text>
          <rect x={100} y={1175} width={200} height={55} rx={10}
            fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={1} />
          <text x={200} y={1210} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            t : Train
          </text>
          <text x={100} y={1270} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Sees Train interface only
          </text>
        </g>

        {/* Pointer arrow from stack to heap */}
        <path d="M 460,1200 L 500,1040" fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={pointerLen} strokeDashoffset={pointerDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Right-side status cards */}
        <g opacity={identityCard.opacity} transform={`translate(0, ${identityCard.translateY})`}>
          <BentoCard x={520} y={1100} w={500} h={200} />
          <text x={560} y={1155} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Object Identity
          </text>
          <line x1={540} y1={1170} x2={1000} y2={1170} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={560} y={1210} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Actual class:
          </text>
          <text x={740} y={1210} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
          <text x={560} y={1250} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            All fields and methods preserved
          </text>
          <text x={560} y={1285} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Nothing is lost or removed
          </text>
        </g>

        {/* Bottom insight */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={160} accent />
          <rect x={60} y={1360} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1425} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Upcasting never changes the object
          </text>
          <text x={100} y={1475} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            It only narrows your view of it
          </text>
        </g>

        {/* Locomotive silhouette at bottom */}
        <g opacity={bottomCard.opacity * shimmer} transform={`translate(0, ${breathe * 0.5})`}>
          {/* Simple stylized locomotive */}
          <rect x={300} y={1570} width={400} height={80} rx={12}
            fill={COLORS.accent} fillOpacity={0.06} stroke={COLORS.accent} strokeWidth={1} />
          <rect x={620} y={1540} width={80} height={110} rx={6}
            fill={COLORS.accent} fillOpacity={0.04} stroke={COLORS.accent} strokeWidth={1} />
          {/* Wheels */}
          <circle cx={360} cy={1665} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <circle cx={440} cy={1665} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <circle cx={520} cy={1665} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <circle cx={660} cy={1665} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          {/* Rails */}
          <line x1={260} y1={1685} x2={740} y2={1685} stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
          <line x1={260} y1={1695} x2={740} y2={1695} stroke={COLORS.accent} strokeWidth={2} opacity={0.2} />
        </g>

        {/* Floating accents */}
        <g transform={`translate(950, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
