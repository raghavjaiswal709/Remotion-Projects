/**
 * Scene 20 — JVM Never Decides
 * "The JVM never makes this decision."
 * CSV: 74.680s → 76.800s
 * Duration: ~64 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–50): JVM box crossed out, compiler box highlighted
 *   Phase 3 (45–end): Micro pulse
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene20_JVMNeverDecides: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const jvmEnt = useSpringEntrance(frame, 18);
  const crossEnt = useSpringEntrance(frame, 30);
  const compilerEnt = useSpringEntrance(frame, 24);
  const checkEnt = useSpringEntrance(frame, 36);

  const crossLen = 360;
  const crossDash = usePathDraw(frame, 30, crossLen, 15);

  const insightEnt = useSpringEntrance(frame, 42);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RESPONSIBILITY · COMPILER" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Not the JVM
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            JVM Never Makes This Decision
          </text>
        </g>

        {/* JVM Box — crossed out */}
        <g opacity={jvmEnt.opacity} transform={`translate(0, ${jvmEnt.translateY})`}>
          <rect x={60} y={500} width={460} height={500} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* JVM icon — stack machine */}
          <rect x={200} y={580} width={180} height={50} rx={8}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={290} y={613} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            JVM STACK
          </text>
          <rect x={200} y={650} width={180} height={50} rx={8}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={290} y={683} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            HEAP
          </text>
          <rect x={200} y={720} width={180} height={50} rx={8}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={290} y={753} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            GC
          </text>

          <text x={290} y={850} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            JVM
          </text>
          <text x={290} y={910} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Runs bytecode
          </text>
          <text x={290} y={945} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            at runtime only
          </text>

          {/* Big red X */}
          <g opacity={crossEnt.opacity}>
            <path d="M 120,540 L 460,960 M 460,540 L 120,960"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={crossLen} strokeDashoffset={crossDash} />
          </g>
        </g>

        {/* Compiler Box — highlighted */}
        <g opacity={compilerEnt.opacity} transform={`translate(0, ${compilerEnt.translateY})`}>
          <rect x={560} y={500} width={460} height={500} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          <rect x={560} y={500} width={460} height={500} rx={20}
            fill={COLORS.accent} opacity={0.04} />

          {/* Compiler icon — gears */}
          {[0, 1].map((gi) => {
            const cx = 720 + gi * 120;
            const cy = 660;
            const r = 30;
            return (
              <g key={gi}>
                <circle cx={cx} cy={cy} r={r} fill="none"
                  stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
                {Array.from({ length: 6 }, (_, ti) => {
                  const angle = (ti * Math.PI * 2) / 6;
                  return (
                    <rect key={ti} x={cx - 4} y={cy - r - 8} width={8} height={12} rx={2}
                      fill={COLORS.accent} opacity={0.4}
                      transform={`rotate(${(ti * 360) / 6}, ${cx}, ${cy})`} />
                  );
                })}
              </g>
            );
          })}

          <text x={790} y={780} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            COMPILER
          </text>
          <text x={790} y={840} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.white}>
            Resolves overloads
          </text>
          <text x={790} y={875} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.white}>
            before execution
          </text>

          {/* Checkmark */}
          <g opacity={checkEnt.opacity}>
            <circle cx={935} y={530} cy={540} r={20}
              fill={COLORS.accent} opacity={0.15} />
            <path d="M 922,540 L 932,552 L 948,528"
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* Bottom insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={140} accent />
          <rect x={60} y={1120} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1200}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Overloading = <tspan fontStyle="italic" fill={COLORS.accent}>compiler's</tspan> job
          </text>
        </g>

        {/* Track */}
        <line x1={60} y1={1480} x2={1020} y2={1480}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1496} x2={1020} y2={1496}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {/* Locomotive silhouette */}
        <g transform={`translate(${200 + breathe * 2}, 1540)`} opacity={0.05}>
          <rect x={0} y={0} width={160} height={60} rx={8} fill={COLORS.accent} />
          <rect x={140} y={-20} width={40} height={20} rx={4} fill={COLORS.accent} />
          <circle cx={30} cy={70} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={80} cy={70} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={130} cy={70} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
        </g>

        <circle cx={540} cy={1700 + breathe} r={8}
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          opacity={0.05} transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 1700px' }} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
