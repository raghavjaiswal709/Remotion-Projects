/**
 * Scene 24 — In Production, That's How You Debug
 * "In production, that's how you debug."
 * CSV: 59.800s → 62.800s
 * Duration: 90 frames (3.0s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline
 *   Phase 2 (12–60): Production dashboard, debug flow
 *   Phase 3 (50–end): Pulse, breathe
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 20) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene24_ProductionDebug: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const h2 = useSpringEntrance(frame, 7);

  const dashCard = useSpringEntrance(frame, 12);
  const errorCard = useSpringEntrance(frame, 20);
  const traceCard = useSpringEntrance(frame, 30);
  const stepCards = [0, 1, 2, 3].map(i => useSpringEntrance(frame, 36 + i * 6));
  const summaryCard = useSpringEntrance(frame, 58);

  const arrowLen = 100;
  const arrowDash = usePathDraw(frame, 26, arrowLen, 12);

  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const scanLine = interpolate(frame, [0, 60], [0, 300], {
    extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s24.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="TRAJECTORY · PRACTICAL USE" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            In production,
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            that's how you debug
          </text>
        </g>

        {/* Dashboard card */}
        <g opacity={dashCard.opacity} transform={`translate(0, ${dashCard.translateY})`}>
          <BentoCard x={60} y={480} w={620} h={200} accent />
          <text x={100} y={540} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            PRODUCTION DASHBOARD
          </text>
          {/* Status indicators */}
          {['API', 'DB', 'AGENT'].map((s, i) => (
            <g key={i}>
              <circle cx={120 + i * 170} cy={610} r={8}
                fill={i === 2 ? COLORS.vibrant_red : COLORS.accent} />
              <text x={140 + i * 170} y={616}
                fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={i === 2 ? COLORS.vibrant_red : COLORS.white}>
                {s} {i === 2 ? 'ERROR' : 'OK'}
              </text>
            </g>
          ))}
        </g>

        {/* Error alert */}
        <g opacity={errorCard.opacity} transform={`translate(0, ${errorCard.translateY})`}>
          <BentoCard x={720} y={480} w={300} h={200} />
          <rect x={720} y={480} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={760} y={540} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            INCIDENT
          </text>
          <text x={760} y={590} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.vibrant_red}>
            #4071
          </text>
          <text x={760} y={640} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Agent failed at step 3
          </text>
        </g>

        {/* Arrow from error to trace */}
        <line x1={870} y1={680} x2={870} y2={720}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Trajectory trace panel */}
        <g opacity={traceCard.opacity} transform={`translate(0, ${traceCard.translateY})`}>
          <BentoCard x={60} y={730} w={960} h={80} accent />
          <text x={100} y={782}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            TRAJECTORY TRACE — Incident #4071
          </text>
          {/* Scan line animation */}
          <rect x={60} y={730} width={Math.min(960, scanLine * 3.2)} height={80}
            fill={COLORS.accent} opacity={0.03} rx={20} />
        </g>

        {/* Step trace cards */}
        {[
          { step: 'Step 1', action: 'search("quarterly data")', status: 'OK', ok: true },
          { step: 'Step 2', action: 'read(doc_14)', status: 'OK', ok: true },
          { step: 'Step 3', action: 'summarize(null)', status: 'FAIL', ok: false },
          { step: 'Step 4', action: '— not reached —', status: '—', ok: false },
        ].map((item, i) => {
          const e = stepCards[i];
          const cy = 850 + i * 120;
          return (
            <g key={i} opacity={e.opacity} transform={`translate(0, ${e.translateY})`}>
              <BentoCard x={60} y={cy} w={960} h={100} />
              <circle cx={120} cy={cy + 50} r={8}
                fill={item.ok ? COLORS.accent : COLORS.vibrant_red} />
              <text x={150} y={cy + 42}
                fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={item.ok ? COLORS.white : COLORS.vibrant_red}>
                {item.step}
              </text>
              <text x={150} y={cy + 74}
                fontFamily="'Fira Code', 'Courier New', monospace"
                fontSize={22} fontWeight={500}
                fill={item.ok ? COLORS.text_muted : COLORS.vibrant_red}>
                {item.action}
              </text>
              <text x={960} y={cy + 58} textAnchor="end"
                fontFamily={FONT} fontSize={22} fontWeight={800}
                fill={item.ok ? COLORS.accent : COLORS.vibrant_red}>
                {item.status}
              </text>
            </g>
          );
        })}

        {/* Summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1370} w={960} h={140} accent />
          <text x={540} y={1456} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            <tspan fill={COLORS.accent}>Replay the trajectory</tspan> — find the exact failure point
          </text>
        </g>

        {[100, 540, 980].map((x, i) => (
          <circle key={i} cx={x} cy={1620 + breathe}
            r={4} fill={COLORS.accent} opacity={0.05 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s24.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
