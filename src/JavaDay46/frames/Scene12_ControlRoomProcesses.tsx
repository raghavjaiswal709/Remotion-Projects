/**
 * Scene 12 — Control Room Processes All Trains Same Way
 * "Imagine the control room that processes all trains the same way."
 * CSV: 40.900s → 45.140s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): Control room illustration, train queue, processing arrows
 *   Phase 3 (70–end): Breathing floats, shimmer on control panel
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

export const Scene12_ControlRoomProcesses: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // Control room building
  const buildingEnt = useSpringEntrance(frame, 16);
  // Train queue
  const trains = ['Express', 'Metro', 'Freight'];
  const trainEnts = trains.map((_, i) => useSpringEntrance(frame, 24 + i * 10));
  // Processing arrows
  const arrowLen = 160;
  const arrowDashes = trains.map((_, i) => usePathDraw(frame, 34 + i * 10, arrowLen, 20));
  // Output card
  const outputEnt = useSpringEntrance(frame, 54);
  const codeCard = useSpringEntrance(frame, 60);
  const insightCard = useSpringEntrance(frame, 68);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RAILWAY ANALOGY" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Control Room
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Processes All Trains The Same Way
          </text>
        </g>

        {/* ── Control Room Building ─────────────────── */}
        <g opacity={buildingEnt.opacity} transform={`translate(0, ${buildingEnt.translateY})`}>
          {/* Building body */}
          <rect x={340} y={450} width={400} height={260} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Roof */}
          <polygon points="340,450 540,380 740,450"
            fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Windows row */}
          {[0, 1, 2].map(i => (
            <rect key={i} x={380 + i * 120} y={490} width={80} height={60} rx={6}
              fill={COLORS.accent} fillOpacity={0.08 * shimmer}
              stroke={COLORS.accent} strokeWidth={1} />
          ))}
          {/* Door */}
          <rect x={500} y={620} width={80} height={90} rx={8}
            fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Label */}
          <text x={540} y={580} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            CONTROL ROOM
          </text>
          {/* Antenna */}
          <line x1={540} y1={380} x2={540} y2={340} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={540} cy={335} r={6} fill={COLORS.accent} fillOpacity={0.5 * pulse} />
        </g>

        {/* ── Train queue (left side) ─────────────────── */}
        {trains.map((name, i) => {
          const ent = trainEnts[i];
          const ty = 780 + i * 120;
          const colors = [COLORS.accent, '#22C55E', '#A855F7'];
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              {/* Mini train box */}
              <rect x={80} y={ty} width={260} height={80} rx={12}
                fill={COLORS.bg_secondary} stroke={colors[i]} strokeWidth={2} />
              {/* Wheels */}
              <circle cx={130} cy={ty + 80} r={12} fill={COLORS.bg_primary} stroke={colors[i]} strokeWidth={1.5} />
              <circle cx={290} cy={ty + 80} r={12} fill={COLORS.bg_primary} stroke={colors[i]} strokeWidth={1.5} />
              {/* Label */}
              <text x={210} y={ty + 48} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={colors[i]}>
                {name}
              </text>

              {/* Arrow to control room */}
              <path d={`M 340,${ty + 40} L 500,${ty + 40}`}
                fill="none" stroke={COLORS.accent} strokeWidth={2}
                strokeDasharray={arrowLen} strokeDashoffset={arrowDashes[i]}
                markerEnd="url(#arrow)" strokeLinecap="round" opacity={0.6} />
            </g>
          );
        })}

        {/* Processing label */}
        <g opacity={outputEnt.opacity} transform={`translate(0, ${outputEnt.translateY})`}>
          <BentoCard x={540} y={800} w={460} h={280} accent />
          <text x={580} y={850} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            UNIFORM PROCESSING
          </text>
          <line x1={560} y1={870} x2={980} y2={870} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={580} y={910} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={22} fontWeight={500} fill={COLORS.white}>
            train.depart();
          </text>
          <text x={580} y={945} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={22} fontWeight={500} fill={COLORS.white}>
            train.arrive();
          </text>
          <text x={580} y={980} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={22} fontWeight={500} fill={COLORS.white}>
            train.getPassengers();
          </text>
          <text x={580} y={1030} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Same methods for ALL types
          </text>
          <text x={580} y={1060} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent} opacity={0.7}>
            Express, Metro, Freight — no difference
          </text>
        </g>

        {/* Code card */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={160} />
          <rect x={60} y={1160} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1210} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.accent}>
            void process(Train t) {'{'}
          </text>
          <text x={140} y={1250} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.white}>
            t.depart(); t.arrive();
          </text>
          <text x={100} y={1290} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.accent}>
            {'}'}
          </text>
        </g>

        {/* Insight */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={120} accent />
          <text x={100} y={1430} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            One method handles
          </text>
          <text x={580} y={1430} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            every train subtype
          </text>
          <text x={100} y={1475} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Thanks to upcasting + polymorphism
          </text>
        </g>

        {/* Rails at bottom */}
        <g opacity={insightCard.opacity * 0.2}>
          <line x1={60} y1={1580} x2={1020} y2={1580} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={60} y1={1590} x2={1020} y2={1590} stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
        </g>

        {/* Floating element */}
        <g transform={`translate(540, ${1680 + breathe})`}>
          <circle cx={0} cy={0} r={22} fill={COLORS.accent} fillOpacity={0.04} />
          <circle cx={0} cy={0} r={22} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.2} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
