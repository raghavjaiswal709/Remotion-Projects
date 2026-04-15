/**
 * Scene 07 — Cannot Wait For Object
 * "This cannot wait for an object to be created. It must happen the moment the class is loaded into memory."
 * CSV: 35.340s → 42.440s | Duration: 213 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Timeline — class load vs object creation, X mark
 *   Phase 3 (80–end): Memory block pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene07_CannotWaitForObject: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);
  const subE = useSpringEntrance(frame, 16);

  // Timeline
  const timelineE = useSpringEntrance(frame, 24);
  const timelineLen = 800;
  const timelineDash = usePathDraw(frame, 28, timelineLen, 35);

  // Timeline events
  const ev1 = useSpringEntrance(frame, 40);
  const ev2 = useSpringEntrance(frame, 54);
  const ev3 = useSpringEntrance(frame, 68);

  // X mark on "wait for object"
  const xMark = useSpringEntrance(frame, 76);

  // Memory block
  const memE = useSpringEntrance(frame, 60);
  const cardE = useSpringEntrance(frame, 84);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="CLASS LOADING" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Cannot Wait
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Must happen at class load time
          </text>
        </g>

        {/* Timeline arrow */}
        <g opacity={timelineE.opacity}>
          <line x1={100} y1={520} x2={980} y2={520}
            stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={timelineLen} strokeDashoffset={timelineDash}
            markerEnd="url(#arrow)" />
          <text x={540} y={500} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>TIME</text>
        </g>

        {/* Event 1 — Class Loaded */}
        <g opacity={ev1.opacity} transform={`translate(0, ${ev1.translateY})`}>
          <line x1={200} y1={520} x2={200} y2={600} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={200} cy={520} r={10} fill={COLORS.accent} />
          <BentoCard x={100} y={610} w={240} h={120} accent />
          <text x={120} y={660} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>CLASS</text>
          <text x={120} y={700} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>LOADED</text>
        </g>

        {/* Event 2 — Data Init (should happen here!) */}
        <g opacity={ev2.opacity} transform={`translate(0, ${ev2.translateY})`}>
          <line x1={440} y1={520} x2={440} y2={600} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={440} cy={520} r={10} fill={COLORS.accent} />
          <BentoCard x={340} y={610} w={240} h={120} accent />
          <text x={360} y={660} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>DATA INIT</text>
          <text x={360} y={700} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            must be here
          </text>
        </g>

        {/* Event 3 — Object Created (too late!) */}
        <g opacity={ev3.opacity} transform={`translate(0, ${ev3.translateY})`}>
          <line x1={740} y1={520} x2={740} y2={600} stroke={COLORS.text_muted} strokeWidth={2} opacity={0.5} />
          <circle cx={740} cy={520} r={10} fill={COLORS.text_muted} opacity={0.5} />
          <BentoCard x={640} y={610} w={240} h={120} />
          <text x={660} y={660} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>OBJECT</text>
          <text x={660} y={700} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>CREATED</text>
        </g>

        {/* X mark — cannot wait */}
        <g opacity={xMark.opacity}>
          <line x1={720} y1={590} x2={780} y2={650} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          <line x1={780} y1={590} x2={720} y2={650} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          <text x={750} y={760} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>TOO LATE!</text>
        </g>

        {/* Memory block illustration */}
        <g opacity={memE.opacity} transform={`translate(0, ${memE.translateY})`}>
          <BentoCard x={60} y={820} w={960} h={340} accent />
          {/* JVM Memory visualization */}
          <rect x={120} y={868} width={840} height={240} rx={12}
            fill={COLORS.accent} fillOpacity={0.05} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={540} y={910} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>JVM MEMORY</text>
          {/* Class area */}
          <rect x={160} y={940} width={340} height={140} rx={10}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={330} y={990} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Class Area</text>
          <text x={330} y={1030} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Loaded First</text>
          {/* Heap area — empty */}
          <rect x={540} y={940} width={340} height={140} rx={10}
            fill="none" stroke={COLORS.text_muted} strokeWidth={1.5} strokeDasharray="10 6" opacity={0.4} />
          <text x={710} y={990} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>Heap</text>
          <text x={710} y={1030} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.3}>Objects Later</text>
        </g>

        {/* Bottom takeaway */}
        <g opacity={cardE.opacity} transform={`translate(0, ${cardE.translateY})`}>
          <BentoCard x={60} y={1210} w={960} h={140} />
          <text x={100} y={1292} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Init must happen at
          </text>
          <text x={660} y={1292} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            class load time
          </text>
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1480 + breathe})`}>
          <circle r={36} fill={COLORS.accent} fillOpacity={0.05} />
          <circle r={36} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.4} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
