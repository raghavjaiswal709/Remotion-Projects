/**
 * Scene 04 — Before Trains Created
 * "When the railway system application starts, before a single train is created,"
 * CSV: 16.460s → 22.220s | Duration: 173 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Railway app loading visualization, empty depot
 *   Phase 3 (80–end): Loading indicator pulse, breathe on elements
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene04_BeforeTrainsCreated: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);
  const subE = useSpringEntrance(frame, 16);

  // Phase 2 — depot illustration
  const depotE = useSpringEntrance(frame, 24);
  const trackLen = 880;
  const trackDash = usePathDraw(frame, 30, trackLen, 35);

  // Empty train slots
  const slot1 = useSpringEntrance(frame, 40);
  const slot2 = useSpringEntrance(frame, 52);
  const slot3 = useSpringEntrance(frame, 64);

  // Loading bar
  const loadingE = useSpringEntrance(frame, 36);
  const loadW = interpolate(frame, [40, 120], [0, 600], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const blink = Math.sin(frame * 0.15) > 0 ? 1 : 0.3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="APPLICATION STARTUP" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Before Any
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}>
            Train Exists
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={460} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            The railway system is starting up...
          </text>
        </g>

        {/* Zone C — Loading visualization */}
        <g opacity={loadingE.opacity} transform={`translate(0, ${loadingE.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={120} accent />
          <text x={100} y={575} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            SYSTEM LOADING
          </text>
          <rect x={420} y={555} width={580} height={24} rx={12} fill="rgba(255,255,255,0.06)" />
          <rect x={420} y={555} width={loadW} height={24} rx={12} fill={COLORS.accent} opacity={0.8} />
          {/* Blinking cursor */}
          <rect x={420 + loadW} y={553} width={4} height={28} rx={2}
            fill={COLORS.accent} opacity={blink} />
        </g>

        {/* Empty depot */}
        <g opacity={depotE.opacity} transform={`translate(0, ${depotE.translateY})`}>
          <BentoCard x={60} y={680} w={960} h={480} />
          {/* Depot roof */}
          <polygon points="540,700 100,820 980,820"
            fill={COLORS.accent} fillOpacity={0.06} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Depot label */}
          <text x={540} y={780} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} opacity={0.7}>TRAIN DEPOT</text>
          {/* Tracks inside depot */}
          <line x1={100} y1={1050} x2={980} y2={1050} stroke={COLORS.text_muted} strokeWidth={2}
            strokeDasharray={trackLen} strokeDashoffset={trackDash} opacity={0.5} />
          <line x1={100} y1={1070} x2={980} y2={1070} stroke={COLORS.text_muted} strokeWidth={2}
            strokeDasharray={trackLen} strokeDashoffset={trackDash} opacity={0.5} />
          {/* Cross ties */}
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={140 + i * 84} y={1044} width={6} height={32} rx={2}
              fill={COLORS.text_muted} opacity={0.3} />
          ))}
        </g>

        {/* Empty train slots — dashed outlines */}
        {[
          { x: 140, y: 880, e: slot1 },
          { x: 420, y: 880, e: slot2 },
          { x: 700, y: 880, e: slot3 },
        ].map((s, i) => (
          <g key={i} opacity={s.e.opacity} transform={`translate(0, ${s.e.translateY})`}>
            <rect x={s.x} y={s.y} width={220} height={140} rx={16}
              fill="none" stroke={COLORS.text_muted} strokeWidth={2}
              strokeDasharray="12 8" opacity={0.4} />
            <text x={s.x + 110} y={s.y + 80} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted} opacity={0.4}>
              EMPTY
            </text>
          </g>
        ))}

        {/* Info label at bottom */}
        <g opacity={slot3.opacity} transform={`translate(0, ${slot3.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={140} accent />
          <text x={100} y={1280} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Zero Train objects created yet
          </text>
        </g>

        {/* Floating loading indicator */}
        <g transform={`translate(540, ${1480 + breathe})`}>
          <circle r={32} fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.5} />
          <circle r={8} fill={COLORS.accent} fillOpacity={0.3} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
