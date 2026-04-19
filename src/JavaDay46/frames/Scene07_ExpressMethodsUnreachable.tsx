/**
 * Scene 07 — Express Specific Methods No Longer Reachable
 * "That means any express specific methods are no longer reachable through that reference."
 * CSV: 25.560s → 30.520s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Method list with X marks, blocked path illustration
 *   Phase 3 (80–end): Pulse, shimmer, breathe
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

export const Scene07_ExpressMethodsUnreachable: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Phase 2
  const refCard = useSpringEntrance(frame, 20);
  const methodCards = [
    useSpringEntrance(frame, 30),
    useSpringEntrance(frame, 40),
    useSpringEntrance(frame, 50),
  ];
  const blockIllust = useSpringEntrance(frame, 55);
  const codeCard = useSpringEntrance(frame, 65);
  const errorCard = useSpringEntrance(frame, 75);
  const insightCard = useSpringEntrance(frame, 85);

  // Path draws
  const crossLen = 60;
  const crossDashes = [
    usePathDraw(frame, 35, crossLen, 15),
    usePathDraw(frame, 45, crossLen, 15),
    usePathDraw(frame, 55, crossLen, 15),
  ];
  const barrierLen = 800;
  const barrierDash = usePathDraw(frame, 58, barrierLen, 30);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const errorFlash = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.6, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  const expressMethods = [
    { name: 'getLounge()', desc: 'First-class lounge access' },
    { name: 'getMaxSpeed()', desc: 'Express speed rating' },
    { name: 'expressService()', desc: 'Priority boarding' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UPCASTING · RESTRICTIONS" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Methods No Longer
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={385} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.vibrant_red} fontStyle="italic">
            Reachable
          </text>
        </g>

        {/* Reference type card */}
        <g opacity={refCard.opacity} transform={`translate(0, ${refCard.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={100} accent />
          <text x={100} y={520} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Reference type: Train t
          </text>
          <text x={680} y={520} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            can only call Train methods
          </text>
        </g>

        {/* Express-only methods with X marks */}
        {expressMethods.map((m, i) => (
          <g key={i} opacity={methodCards[i].opacity} transform={`translate(0, ${methodCards[i].translateY})`}>
            <BentoCard x={60} y={600 + i * 160} w={960} h={140} />

            {/* Method name */}
            <text x={120} y={660 + i * 160} fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={32} fontWeight={500} fill={COLORS.text_muted} opacity={0.5}>
              t.{m.name}
            </text>
            <text x={120} y={705 + i * 160} fontFamily={FONT} fontSize={26} fontWeight={800}
              fill={COLORS.text_muted} opacity={0.4}>
              {m.desc}
            </text>

            {/* Red X crosses */}
            <g opacity={methodCards[i].opacity}>
              <line x1={870} y1={630 + i * 160} x2={930} y2={700 + i * 160}
                stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round"
                strokeDasharray={crossLen} strokeDashoffset={crossDashes[i]} />
              <line x1={930} y1={630 + i * 160} x2={870} y2={700 + i * 160}
                stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round"
                strokeDasharray={crossLen} strokeDashoffset={crossDashes[i]} />
            </g>

            {/* Blocked label */}
            <rect x={760} y={710 + i * 160} width={140} height={28} rx={6}
              fill={COLORS.vibrant_red} fillOpacity={0.1} />
            <text x={830} y={731 + i * 160} textAnchor="middle" fontFamily={FONT}
              fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}>
              BLOCKED
            </text>
          </g>
        ))}

        {/* Barrier line */}
        <line x1={60} y1={1085} x2={1020} y2={1085}
          stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={barrierLen} strokeDashoffset={barrierDash} opacity={0.6} />

        {/* Code example card */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={1120} w={500} h={200} />
          <text x={100} y={1170} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            COMPILE-TIME CHECK
          </text>
          <text x={100} y={1215} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500} fill={COLORS.text_muted} opacity={0.6}>
            t.getLounge()
          </text>
          <text x={100} y={1260} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            Cannot resolve method
          </text>
          <text x={100} y={1295} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            Compiler only knows Train type
          </text>
        </g>

        {/* Error card */}
        <g opacity={errorCard.opacity} transform={`translate(0, ${errorCard.translateY})`}>
          <BentoCard x={600} y={1120} w={420} h={200} />
          <rect x={600} y={1120} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={640} y={1170} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={errorFlash}>
            COMPILATION ERROR
          </text>
          <text x={640} y={1215} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Java prevents calling
          </text>
          <text x={640} y={1255} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            methods not declared
          </text>
          <text x={640} y={1295} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            in the reference type
          </text>
        </g>

        {/* Bottom insight */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1370} w={960} h={140} accent />
          <rect x={60} y={1370} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1430} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Express methods exist inside the object
          </text>
          <text x={100} y={1475} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            but the compiler won't let you reach them
          </text>
        </g>

        {/* Signal light — blocked */}
        <g opacity={blockIllust.opacity * shimmer} transform={`translate(0, ${breathe * 0.4})`}>
          {/* Signal pole */}
          <rect x={80} y={1550} width={8} height={120} rx={3} fill={COLORS.text_muted} opacity={0.3} />
          {/* Signal box */}
          <rect x={60} y={1540} width={50} height={70} rx={8}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Red light */}
          <circle cx={85} cy={1575} r={14} fill={COLORS.vibrant_red} fillOpacity={errorFlash * 0.6} />
          <circle cx={85} cy={1575} r={14} fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5} opacity={0.4} />
        </g>

        {/* Tracks */}
        <g opacity={insightCard.opacity * 0.2}>
          <line x1={60} y1={1700} x2={1020} y2={1700} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={60} y1={1710} x2={1020} y2={1710} stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
