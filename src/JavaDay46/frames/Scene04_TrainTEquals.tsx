/**
 * Scene 04 — Train T Equals New ExpressTrain
 * "train T equals new express train,"
 * CSV: 17.420s → 19.560s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–90): Code block with typewriter, memory diagram
 *   Phase 3 (80–end): Pulse, float, breathing
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene04_TrainTEquals: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);

  // Phase 2
  const codeCard = useSpringEntrance(frame, 16);
  const annotCard = useSpringEntrance(frame, 28);
  const memCard = useSpringEntrance(frame, 40);
  const refCard = useSpringEntrance(frame, 52);
  const bottomCard = useSpringEntrance(frame, 64);
  const insightCard = useSpringEntrance(frame, 76);

  // Typewriter
  const codeLine = "Train t = new ExpressTrain();";
  const charsVisible = Math.floor(interpolate(frame, [20, 20 + codeLine.length * 1.8], [0, codeLine.length], {
    extrapolateRight: 'clamp',
  }));

  // Path draws
  const connLen = 200;
  const connDash = usePathDraw(frame, 50, connLen, 25);
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 45, arrowLen, 20);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Cursor blink
  const cursorVisible = Math.sin(frame * 0.15) > 0;

  // Border draw
  const perimCode = 2 * (960 + 160);
  const borderCode = interpolate(frame, [16, 46], [perimCode, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UPCASTING · CODE" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            The Assignment
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Train t = new ExpressTrain()
          </text>
        </g>

        {/* ZONE C — Code block card */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <rect x={60} y={460} width={960} height={160} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={perimCode} strokeDashoffset={borderCode} />
          <BentoCard x={60} y={460} w={960} h={160} accent />
          <rect x={60} y={460} width={6} height={160} rx={3} fill={COLORS.accent} />

          {/* Code with typewriter */}
          <text x={100} y={550} fontFamily={MONO} fontSize={38} fontWeight={500} fill={COLORS.text_muted}>
            <tspan fill={COLORS.accent}>{codeLine.slice(0, Math.min(charsVisible, 5))}</tspan>
            <tspan fill={COLORS.white}>{codeLine.slice(5, Math.min(charsVisible, 7))}</tspan>
            <tspan fill={COLORS.text_muted}>{codeLine.slice(7, Math.min(charsVisible, 11))}</tspan>
            <tspan fill={COLORS.accent}>{codeLine.slice(11, Math.min(charsVisible, 14))}</tspan>
            <tspan fill={COLORS.white}>{codeLine.slice(14, Math.min(charsVisible, 28))}</tspan>
            <tspan fill={COLORS.text_muted}>{codeLine.slice(28, charsVisible)}</tspan>
          </text>
          {/* Blinking cursor */}
          {cursorVisible && charsVisible < codeLine.length && (
            <rect x={100 + charsVisible * 19.5} y={518} width={3} height={38} fill={COLORS.accent} />
          )}
        </g>

        {/* Annotation: left = type, right = object */}
        <g opacity={annotCard.opacity} transform={`translate(0, ${annotCard.translateY})`}>
          <BentoCard x={60} y={660} w={460} h={200} />
          <text x={80} y={720} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Reference Type
          </text>
          <text x={80} y={770} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Train
          </text>
          <text x={80} y={820} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            What the compiler sees
          </text>

          <BentoCard x={560} y={660} w={460} h={200} accent />
          <text x={580} y={720} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Object Type
          </text>
          <text x={580} y={770} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            ExpressTrain
          </text>
          <text x={580} y={820} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            What exists in memory
          </text>
        </g>

        {/* Arrow left → right */}
        <path d="M 520,760 L 560,760" fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Memory / heap diagram */}
        <g opacity={memCard.opacity} transform={`translate(0, ${memCard.translateY})`}>
          <BentoCard x={60} y={920} w={620} h={340} />
          <text x={100} y={975} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Heap Memory
          </text>

          {/* Object box in heap */}
          <rect x={120} y={1010} width={500} height={200} rx={16}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={370} y={1055} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain Instance
          </text>

          {/* Fields inside object */}
          <text x={160} y={1100} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            name: "Shinkansen"
          </text>
          <text x={160} y={1135} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            speed: 320
          </text>
          <text x={160} y={1170} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            expressLounge: true
          </text>
          <text x={160} y={1200} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>
            depart(), schedule()
          </text>
        </g>

        {/* Reference pointer */}
        <g opacity={refCard.opacity} transform={`translate(0, ${refCard.translateY})`}>
          <BentoCard x={720} y={920} w={300} h={340} accent />
          <text x={870} y={980} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Stack
          </text>

          <rect x={760} y={1010} width={220} height={80} rx={12}
            fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={870} y={1060} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            t
          </text>

          {/* Pointer line from t to heap */}
          <path d={`M 760,1050 L 620,1100`} fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={connLen} strokeDashoffset={connDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />

          <text x={870} y={1140} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Type: Train
          </text>
          <text x={870} y={1180} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Points to:
          </text>
          <text x={870} y={1210} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
        </g>

        {/* Bottom insight cards */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={140} />
          <text x={540} y={1405} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            One line of code — two different types at play
          </text>
        </g>

        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1500} w={460} h={140} />
          <text x={290} y={1580} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Compile-time: Train
          </text>

          <BentoCard x={560} y={1500} w={460} h={140} accent />
          <text x={790} y={1580} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Runtime: ExpressTrain
          </text>
        </g>

        {/* Floating decorations */}
        <g transform={`translate(180, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(900, ${1680 + breathe * -0.8})`}>
          <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.04} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
