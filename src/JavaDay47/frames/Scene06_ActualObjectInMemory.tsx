/**
 * Scene 06 — Actual Object In Memory
 * "The actual object in memory is an Express train."
 * CSV: 24.280s → 27.660s
 * Duration: ~101 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline
 *   Phase 2 (frames 20–70):  Memory diagram — heap block with ExpressTrain
 *   Phase 3 (frames 60–end): Pulse, shimmer
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

export const Scene06_ActualObjectInMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  const heapCard = useSpringEntrance(frame, 18);
  const objBlock = useSpringEntrance(frame, 26);
  const fieldCards = [
    useSpringEntrance(frame, 34),
    useSpringEntrance(frame, 42),
    useSpringEntrance(frame, 50),
    useSpringEntrance(frame, 58),
  ];
  const summaryCard = useSpringEntrance(frame, 64);

  // Border draw
  const objPerim = 2 * (700 + 500);
  const objBorderDash = interpolate(frame, [26, 56], [objPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[5];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="HEAP MEMORY" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Actual Object
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            ExpressTrain in Memory
          </text>
        </g>

        {/* Heap memory region */}
        <g opacity={heapCard.opacity} transform={`translate(0, ${heapCard.translateY})`}>
          <rect x={60} y={500} width={960} height={60} rx={12}
            fill={COLORS.accent} fillOpacity={0.06} />
          <text x={540} y={540} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent} letterSpacing="0.2em">
            JVM HEAP
          </text>
        </g>

        {/* Object block */}
        <g opacity={objBlock.opacity} transform={`translate(0, ${objBlock.translateY})`}>
          <rect x={140} y={600} width={800} height={560} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={objPerim} strokeDashoffset={objBorderDash} />
          {/* Header bar */}
          <rect x={140} y={600} width={800} height={70} rx={20}
            fill={COLORS.accent} fillOpacity={0.15} />
          <rect x={140} y={650} width={800} height={20}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={540} y={648} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain instance
          </text>
          <text x={540} y={700} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            @0x7a3f (heap address)
          </text>
        </g>

        {/* Fields inside object */}
        {[
          { label: 'name', value: '"Rajdhani Express"', y: 740 },
          { label: 'speed', value: '160 km/h', y: 820 },
          { label: 'serveLunch()', value: 'method ref', y: 900 },
          { label: 'reserveSeat()', value: 'method ref', y: 980 },
        ].map((field, i) => (
          <g key={i} opacity={fieldCards[i].opacity} transform={`translate(0, ${fieldCards[i].translateY})`}>
            <rect x={180} y={field.y} width={720} height={60} rx={10}
              fill={COLORS.accent} fillOpacity={i >= 2 ? 0.08 : 0.04}
              stroke={i >= 2 ? COLORS.accent : 'rgba(255,255,255,0.08)'}
              strokeWidth={i >= 2 ? 1.5 : 1} />
            <text x={210} y={field.y + 40} fontFamily={FONT} fontSize={30} fontWeight={800}
              fill={i >= 2 ? COLORS.accent : COLORS.white}>
              {field.label}
            </text>
            <text x={860} y={field.y + 40} textAnchor="end"
              fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
              {field.value}
            </text>
          </g>
        ))}

        {/* Express-only badge */}
        <g opacity={fieldCards[2].opacity}>
          <rect x={700} y={885} width={180} height={32} rx={16}
            fill={COLORS.accent} fillOpacity={0.2} />
          <text x={790} y={908} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
            EXPRESS ONLY
          </text>
          <rect x={700} y={965} width={180} height={32} rx={16}
            fill={COLORS.accent} fillOpacity={0.2} />
          <text x={790} y={988} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
            EXPRESS ONLY
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1220} w={960} h={260} accent />
          <rect x={60} y={1220} width={8} height={260} rx={4} fill={COLORS.accent} />
          <text x={100} y={1300} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            The heap holds the
          </text>
          <text x={660} y={1300} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            full
          </text>
          <text x={730} y={1300} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            object
          </text>
          <text x={100} y={1370} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            All ExpressTrain fields and methods exist
          </text>
          <text x={100} y={1420} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            The reference type just limits what you can see
          </text>
        </g>

        {/* Floating accents */}
        <circle cx={100} cy={700 + breathe} r={5} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={980} cy={850 + breathe * 0.7} r={7} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <g transform={`translate(540, ${1100 + breathe})`}>
          <circle r={40} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.08 * shimmer} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
