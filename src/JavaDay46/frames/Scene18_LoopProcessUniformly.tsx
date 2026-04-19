/**
 * Scene 18 — List Processes Every Entry Same Way
 * "When you loop through that list, you call depart or get passengers on each one."
 * CSV: 60.980s → 66.180s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–80): For-loop code + iteration visual
 *   Phase 3 (70–end): Pulse, breathe
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

export const Scene18_LoopProcessUniformly: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // Code block
  const codeEnt = useSpringEntrance(frame, 14);
  const codePerim = 2 * (960 + 320);
  const codeDash = usePathDraw(frame, 16, codePerim, 30);

  const codeLines = [
    { text: 'for (Train t : fleet) {', isKey: true },
    { text: '    t.depart();', isKey: false },
    { text: '    t.arrive();', isKey: false },
    { text: '    int p = t.getPassengers();', isKey: false },
    { text: '}', isKey: true },
  ];
  const lineEnts = codeLines.map((_, i) => useSpringEntrance(frame, 18 + i * 6));

  // Iteration vis: 3 trains going through loop
  const trainNames = ['Express', 'Metro', 'Freight'];
  const trainColors = [COLORS.accent, '#22C55E', '#A855F7'];
  const trainEnts = trainNames.map((_, i) => useSpringEntrance(frame, 50 + i * 12));

  // Highlight which train is "active"
  const cycle = Math.floor(frame / 30) % 3;

  // Arrow from loop
  const arrowLen = 100;
  const arrowDash = usePathDraw(frame, 55, arrowLen, 20);

  // Insight
  const insightEnt = useSpringEntrance(frame, 70);

  // Bottom summary
  const sumEnt = useSpringEntrance(frame, 78);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="LOOP PROCESSING" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Process Every Entry
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            The Same Way
          </text>
        </g>

        {/* Code block */}
        <g opacity={codeEnt.opacity} transform={`translate(0, ${codeEnt.translateY})`}>
          <rect x={60} y={440} width={960} height={320} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={codePerim} strokeDashoffset={codeDash} />
          <rect x={60} y={440} width={6} height={320} rx={3} fill={COLORS.accent} />

          {codeLines.map((line, i) => (
            <g key={i} opacity={lineEnts[i].opacity} transform={`translate(0, ${lineEnts[i].translateY})`}>
              <text x={100} y={500 + i * 52} fontFamily={MONO} fontSize={30} fontWeight={500}
                fill={line.isKey ? COLORS.accent : COLORS.text_muted}>
                {line.text}
              </text>
            </g>
          ))}
        </g>

        {/* Iteration visual — which train is currently being processed */}
        <g opacity={trainEnts[0].opacity}>
          <text x={540} y={830} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            ITERATION
          </text>
        </g>

        {trainNames.map((name, i) => {
          const ent = trainEnts[i];
          const x = 120 + i * 300;
          const isActive = i === cycle;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <rect x={x} y={860} width={240} height={120} rx={16}
                fill={isActive ? COLORS.accent : COLORS.bg_secondary}
                fillOpacity={isActive ? 0.15 : 1}
                stroke={isActive ? COLORS.accent : 'rgba(255,255,255,0.1)'}
                strokeWidth={isActive ? 2.5 : 1} />

              {/* Locomotive icon */}
              <rect x={x + 20} y={885} width={60} height={30} rx={6}
                fill={trainColors[i]} fillOpacity={0.2} />
              <circle cx={x + 35} cy={885 + 30} r={8} fill={trainColors[i]} fillOpacity={0.3} />
              <circle cx={x + 60} cy={885 + 30} r={8} fill={trainColors[i]} fillOpacity={0.3} />

              <text x={x + 100} y={910} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={isActive ? COLORS.accent : COLORS.white}>
                {name}
              </text>
              <text x={x + 100} y={950} fontFamily={FONT} fontSize={20} fontWeight={800}
                fill={isActive ? COLORS.accent : COLORS.text_muted}>
                {isActive ? 'PROCESSING' : 'waiting…'}
              </text>

              {isActive && (
                <circle cx={x + 220} cy={870} r={6} fill={COLORS.accent}>
                  <animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Arrow from loop to trains */}
        <path d="M 540,770 L 540,850"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* Insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1050} w={960} h={120} accent />
          <rect x={60} y={1050} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1100} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            One loop handles all subtypes —
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            no instanceof checks needed
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={sumEnt.opacity} transform={`translate(0, ${sumEnt.translateY})`}>
          <BentoCard x={60} y={1230} w={460} h={160} />
          <text x={100} y={1290} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            depart()
          </text>
          <text x={100} y={1330} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Each subtype runs its override
          </text>
          <text x={100} y={1365} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Express fast route, Metro local
          </text>

          <BentoCard x={560} y={1230} w={460} h={160} />
          <text x={600} y={1290} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            getPassengers()
          </text>
          <text x={600} y={1330} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Returns subtype capacity
          </text>
          <text x={600} y={1365} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Polymorphism selects correct
          </text>
        </g>

        {/* Rail */}
        <g opacity={0.1 * shimmer}>
          <line x1={60} y1={1460} x2={1020} y2={1460} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={60} y1={1470} x2={1020} y2={1470} stroke={COLORS.text_muted} strokeWidth={1} />
        </g>

        {/* Float */}
        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.12} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
