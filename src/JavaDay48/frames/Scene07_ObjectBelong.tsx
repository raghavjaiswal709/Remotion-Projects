/**
 * Scene 07 — Does Object Belong
 * "does the object at this reference actually belong to Express Train?"
 * CSV: 24.040s → 27.400s | Duration: 118 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–70): Object → reference → type check diagram
 *   Phase 3 (60–end): Pulse, float, shimmer
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene07_ObjectBelong: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 6);
  const refBoxE = useSpringEntrance(frame, 14);
  const arrowE = useSpringEntrance(frame, 22);
  const objectE = useSpringEntrance(frame, 28);
  const typeCheckE = useSpringEntrance(frame, 36);
  const resultE = useSpringEntrance(frame, 44);
  const bottomE = useSpringEntrance(frame, 52);

  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 22, arrowLen, 20);
  const checkLen = 400;
  const checkDash = usePathDraw(frame, 38, checkLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TYPE CHECK · RUNTIME" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Does the object
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}>
            actually belong?
          </text>
        </g>

        {/* Reference variable box */}
        <g opacity={refBoxE.opacity} transform={`translate(0, ${refBoxE.translateY})`}>
          <BentoCard x={60} y={480} w={400} h={220} accent />
          <text x={100} y={540} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            REFERENCE
          </text>
          <text x={260} y={620} textAnchor="middle" fontFamily={MONO} fontSize={52} fontWeight={800}
            fill={COLORS.white}>
            Train t
          </text>
          <text x={260} y={670} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Declared type: Train
          </text>
        </g>

        {/* Arrow from reference to object */}
        <line x1={460} y1={590} x2={620} y2={590}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />
        <text x={540} y={570} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
          fill={COLORS.accent} opacity={arrowE.opacity}>
          points to
        </text>

        {/* Actual object box */}
        <g opacity={objectE.opacity} transform={`translate(0, ${objectE.translateY})`}>
          <BentoCard x={620} y={480} w={400} h={220} />
          <text x={660} y={540} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            ACTUAL OBJECT
          </text>
          <text x={820} y={620} textAnchor="middle" fontFamily={MONO} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>
            ExpressTrain
          </text>
          {/* Train icon */}
          <rect x={740} y={650} width={160} height={30} rx={6} fill={COLORS.accent} fillOpacity={0.15} />
          <circle cx={770} cy={690} r={10} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={870} cy={690} r={10} fill={COLORS.accent} fillOpacity={0.3} />
        </g>

        {/* Type check magnifier */}
        <g opacity={typeCheckE.opacity} transform={`translate(540, ${800 + typeCheckE.translateY})`}>
          {/* Magnifying glass */}
          <circle cx={0} cy={0} r={80} fill="none" stroke={COLORS.accent} strokeWidth={3}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <line x1={56} y1={56} x2={100} y2={100}
            stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
          <circle cx={0} cy={0} r={60} fill={COLORS.accent} fillOpacity={0.05} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            check
          </text>
        </g>

        {/* Question card */}
        <g opacity={typeCheckE.opacity}>
          <BentoCard x={60} y={950} w={960} h={160} accent />
          <text x={100} y={1020} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Is the runtime type of
          </text>
          <text x={710} y={1020} fontFamily={MONO} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            t
          </text>
          <text x={100} y={1075} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            assignable to
          </text>
          <text x={420} y={1075} fontFamily={MONO} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
          <text x={800} y={1075} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            ?
          </text>
        </g>

        {/* Result: YES */}
        <g opacity={resultE.opacity} transform={`translate(0, ${resultE.translateY})`}>
          <BentoCard x={60} y={1150} w={460} h={200} accent />
          {/* Green checkmark */}
          <circle cx={180} cy={1250} r={40} fill={COLORS.accent} fillOpacity={0.12} />
          <path d="M 158,1250 L 174,1268 L 204,1232"
            fill="none" stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
          <text x={240} y={1240} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            YES
          </text>
          <text x={240} y={1290} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Same or child class
          </text>
        </g>

        <g opacity={resultE.opacity} transform={`translate(0, ${resultE.translateY})`}>
          <BentoCard x={560} y={1150} w={460} h={200} />
          {/* Red X */}
          <circle cx={680} cy={1250} r={40} fill={COLORS.vibrant_red} fillOpacity={0.1} />
          <line x1={660} y1={1230} x2={700} y2={1270} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          <line x1={700} y1={1230} x2={660} y2={1270} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          <text x={740} y={1240} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.vibrant_red}>
            NO
          </text>
          <text x={740} y={1290} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Different branch
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={bottomE.opacity}>
          <BentoCard x={60} y={1400} w={960} h={120} />
          <text x={100} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            JVM inspects the
          </text>
          <text x={490} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            actual runtime type
          </text>
          <text x={870} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            — not declared
          </text>
        </g>

        {/* Floating particles */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <circle key={i} cx={100 + i * 180} cy={1620 + Math.sin(frame * 0.05 + i) * 5}
            r={3} fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
