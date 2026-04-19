/**
 * Scene 09 — This Is Upcasting
 * "This is upcasting."
 * CSV: 33.960s → 35.600s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + massive hero text spring
 *   Phase 2 (20–60): Definition card, arrow hierarchy, formal box
 *   Phase 3 (50–end): Pulse, breathe, shimmer on hero text
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

export const Scene09_ThisIsUpcasting: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  // Hero text with snap spring for dramatic pop
  const heroF = Math.max(0, frame - 4);
  const heroProgress = spring({ frame: heroF, fps, config: SPRING_SNAP });
  const heroScale = interpolate(heroProgress, [0, 1], [0.7, 1]);
  const heroOp = interpolate(heroF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  const ghostOp = interpolate(heroF, [0, 15], [0, 0.08], { extrapolateRight: 'clamp' });

  const defCard = useSpringEntrance(frame, 14);
  const hierarchyEnt = useSpringEntrance(frame, 22);
  const arrowLen = 180;
  const arrowDash = usePathDraw(frame, 26, arrowLen, 20);
  const formalCard = useSpringEntrance(frame, 30);
  const exampleCard = useSpringEntrance(frame, 38);
  const bottomCard = useSpringEntrance(frame, 44);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="KEY CONCEPT" y={130} />
        </g>

        {/* Hero text — MASSIVE */}
        <g opacity={ghostOp}>
          <text x={540} y={480} textAnchor="middle" fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent}>
            UPCAST
          </text>
        </g>
        <g opacity={heroOp} transform={`scale(${heroScale})`} style={{ transformOrigin: '540px 400px' }}>
          <text x={540} y={380} textAnchor="middle" fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.white}>
            This is
          </text>
          <text x={540} y={540} textAnchor="middle" fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Upcasting
          </text>
        </g>

        {/* Definition card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={620} w={960} h={160} accent />
          <rect x={60} y={620} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={685} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Storing a child object in a parent type reference
          </text>
          <text x={100} y={735} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            Moving UP the inheritance hierarchy
          </text>
        </g>

        {/* Visual hierarchy — vertical */}
        <g opacity={hierarchyEnt.opacity} transform={`translate(0, ${hierarchyEnt.translateY})`}>
          {/* Parent box */}
          <rect x={360} y={840} width={280} height={80} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={500} y={890} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Train
          </text>

          {/* Arrow from child up to parent */}
          <path d="M 500,1020 L 500,920" fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={530} y={975} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent} opacity={0.7}>
            UP
          </text>

          {/* Child box */}
          <rect x={340} y={1020} width={320} height={80} rx={16}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <text x={500} y={1070} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            ExpressTrain
          </text>
        </g>

        {/* Formal definition */}
        <g opacity={formalCard.opacity} transform={`translate(0, ${formalCard.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={200} />
          <text x={100} y={1195} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            FORMAL DEFINITION
          </text>
          <line x1={80} y1={1215} x2={500} y2={1215} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={100} y={1255} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.white}>
            Implicit widening
          </text>
          <text x={100} y={1290} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            reference conversion
          </text>
          <text x={100} y={1320} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            (JLS §5.1.5)
          </text>
        </g>

        {/* Code example */}
        <g opacity={exampleCard.opacity} transform={`translate(0, ${exampleCard.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={200} accent />
          <text x={600} y={1195} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            SYNTAX
          </text>
          <line x1={580} y1={1215} x2={1000} y2={1215} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          <text x={600} y={1260} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.white}>
            Train t =
          </text>
          <text x={620} y={1300} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.accent}>
              new ExpressTrain();
          </text>
          <text x={600} y={1330} fontFamily={FONT} fontSize={22} fontWeight={800} fill="#22C55E">
            No explicit cast needed
          </text>
        </g>

        {/* Bottom card */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={120} />
          <text x={100} y={1460} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Upcasting =
          </text>
          <text x={360} y={1460} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            child in parent's clothing
          </text>
        </g>

        {/* Floating pulsing ring */}
        <g transform={`translate(540, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.3} />
        </g>

        {/* Rail decoration */}
        <g opacity={bottomCard.opacity * 0.2}>
          <line x1={60} y1={1690} x2={1020} y2={1690} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={60} y1={1700} x2={1020} y2={1700} stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
