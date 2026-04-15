/**
 * Scene 10 — Runs Once Automatic
 * "It runs once, automatically, the moment the JVM loads the class into memory."
 * CSV: 50.860s → 56.680s | Duration: 175 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–80): "ONCE" hero number + JVM diagram
 *   Phase 3 (70–end): Pulsing ring on "1"
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene10_RunsOnceAutomatic: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);

  // Hero "1" spring snap
  const heroF = Math.max(0, frame - 10);
  const heroSp = spring({ frame: heroF, fps: FPS, config: SPRING_SNAP });
  const heroTy = interpolate(heroSp, [0, 1], [60, 0]);
  const heroOp = interpolate(heroSp, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const ghostOp = interpolate(frame, [12, 30], [0, 0.06], { extrapolateRight: 'clamp' });

  const subE = useSpringEntrance(frame, 20);

  // JVM diagram
  const jvmE = useSpringEntrance(frame, 36);
  const arrowLen = 180;
  const arrowDash = usePathDraw(frame, 44, arrowLen, 25);

  // Process cards
  const procCards = [0, 1, 2].map(i => useSpringEntrance(frame, 56 + i * 12));

  // Bottom
  const bottomE = useSpringEntrance(frame, 88);

  // Phase 3
  const pulse = 1 + Math.sin(frame * 0.1) * 0.025;
  const breathe = Math.sin(frame * 0.06) * 4;
  const ringScale = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.95, 1.05]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />
        <CornerAccents opacity={labelE.opacity * 0.3} />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="EXECUTION · ONE TIME" y={140} />
        </g>

        {/* Ghost */}
        <text x={540} y={520} textAnchor="middle" fontFamily={FONT} fontSize={360} fontWeight={800}
          fill={COLORS.accent} opacity={ghostOp}>1</text>

        {/* Hero number */}
        <g opacity={heroOp} transform={`translate(0, ${heroTy})`}>
          <text x={540} y={520} textAnchor="middle" fontFamily={FONT} fontSize={280} fontWeight={800}
            fill={COLORS.white}>1</text>
        </g>

        {/* Pulsing ring */}
        <circle cx={540} cy={420} r={160} fill="none" stroke={COLORS.accent} strokeWidth={3}
          transform={`scale(${ringScale})`} style={{ transformOrigin: '540px 420px' }}
          opacity={heroOp * 0.3} />

        <g opacity={subE.opacity} transform={`translate(0, ${subE.translateY})`}>
          <text x={540} y={620} textAnchor="middle" fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}>RUNS ONCE</text>
          <text x={540} y={680} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>Automatically at class load</text>
        </g>

        {/* JVM flow diagram */}
        <g opacity={jvmE.opacity} transform={`translate(0, ${jvmE.translateY})`}>
          <BentoCard x={60} y={740} w={300} h={140} accent />
          <text x={100} y={810} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>JVM</text>
          <text x={100} y={848} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Loads Class
          </text>
        </g>

        {/* Arrow */}
        <line x1={360} y1={810} x2={520} y2={810}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={jvmE.opacity * 0.8} />

        <g opacity={jvmE.opacity} transform={`translate(0, ${jvmE.translateY})`}>
          <BentoCard x={530} y={740} w={490} h={140} accent />
          <text x={570} y={810} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Static Block Fires
          </text>
          <text x={570} y={848} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Automatically
          </text>
        </g>

        {/* Process steps */}
        {['Load Stations', 'Map Routes', 'Pull Fares'].map((label, i) => (
          <g key={i} opacity={procCards[i].opacity} transform={`translate(0, ${procCards[i].translateY})`}>
            <BentoCard x={60 + i * 340} y={930} w={300} h={160} />
            <circle cx={90 + i * 340 + 30} cy={990} r={20} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={90 + i * 340 + 30} y={998} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent}>{i + 1}</text>
            <text x={90 + i * 340 + 60} y={998} fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.white}>{label}</text>
            <text x={90 + i * 340} y={1054} fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted}>Done once</text>
          </g>
        ))}

        {/* Bottom */}
        <g opacity={bottomE.opacity} transform={`translate(0, ${bottomE.translateY})`}>
          <BentoCard x={60} y={1140} w={960} h={120} />
          <text x={100} y={1214} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The moment JVM loads the class into
          </text>
          <text x={870} y={1214} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            memory
          </text>
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1400 + breathe})`}>
          <circle r={30} fill={COLORS.accent} fillOpacity={0.05} />
          <circle r={30} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.35} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
