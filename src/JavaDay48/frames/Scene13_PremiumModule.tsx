/**
 * Scene 13 — Premium Services Module
 * "The premium services module now checks before every downcast."
 * CSV: 39.300s → 43.960s | Duration: 143 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–70): Module diagram with service boxes
 *   Phase 3 (65–end): Pulse, float
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

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

export const Scene13_PremiumModule: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 6);
  const subE = useSpringEntrance(frame, 12);
  const moduleE = useSpringEntrance(frame, 18);
  const svc1E = useSpringEntrance(frame, 26);
  const svc2E = useSpringEntrance(frame, 34);
  const svc3E = useSpringEntrance(frame, 42);
  const arrowsE = useSpringEntrance(frame, 38);
  const ruleE = useSpringEntrance(frame, 50);
  const summaryE = useSpringEntrance(frame, 58);

  const conn1Len = 160;
  const conn2Len = 160;
  const conn3Len = 160;
  const conn1Dash = usePathDraw(frame, 38, conn1Len, 18);
  const conn2Dash = usePathDraw(frame, 42, conn2Len, 18);
  const conn3Dash = usePathDraw(frame, 46, conn3Len, 18);

  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="MODULE 3 · TICKETING ENGINE" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Premium Services
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Checks before every downcast
          </text>
        </g>

        {/* Central module box */}
        <g opacity={moduleE.opacity} transform={`translate(0, ${moduleE.translateY})`}>
          <BentoCard x={300} y={480} w={480} h={120} accent />
          {/* Gear icon */}
          <g transform="translate(360, 540)">
            <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={0} r={6} fill={COLORS.accent} fillOpacity={0.3} />
          </g>
          <text x={400} y={548} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            PremiumServices
          </text>
        </g>

        {/* Service 1: Express */}
        <g opacity={svc1E.opacity} transform={`translate(0, ${svc1E.translateY})`}>
          <BentoCard x={60} y={680} w={280} h={160} />
          <text x={200} y={740} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Express</text>
          <text x={200} y={780} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>instanceof</text>
          <text x={200} y={810} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>ExpressTrain</text>
        </g>
        <line x1={420} y1={600} x2={200} y2={680}
          stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
          strokeDasharray={conn1Len} strokeDashoffset={conn1Dash}
          markerEnd="url(#arrow)" opacity={arrowsE.opacity} />

        {/* Service 2: Metro */}
        <g opacity={svc2E.opacity} transform={`translate(0, ${svc2E.translateY})`}>
          <BentoCard x={400} y={680} w={280} h={160} />
          <text x={540} y={740} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Metro</text>
          <text x={540} y={780} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>instanceof</text>
          <text x={540} y={810} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>MetroTrain</text>
        </g>
        <line x1={540} y1={600} x2={540} y2={680}
          stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
          strokeDasharray={conn2Len} strokeDashoffset={conn2Dash}
          markerEnd="url(#arrow)" opacity={arrowsE.opacity} />

        {/* Service 3: Freight */}
        <g opacity={svc3E.opacity} transform={`translate(0, ${svc3E.translateY})`}>
          <BentoCard x={740} y={680} w={280} h={160} />
          <text x={880} y={740} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Freight</text>
          <text x={880} y={780} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>instanceof</text>
          <text x={880} y={810} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>FreightTrain</text>
        </g>
        <line x1={660} y1={600} x2={880} y2={680}
          stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
          strokeDasharray={conn3Len} strokeDashoffset={conn3Dash}
          markerEnd="url(#arrow)" opacity={arrowsE.opacity} />

        {/* Rule card */}
        <g opacity={ruleE.opacity} transform={`translate(0, ${ruleE.translateY})`}>
          <BentoCard x={60} y={900} w={960} h={180} accent />
          <rect x={60} y={900} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={970} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Rule: Always check
          </text>
          <text x={540} y={970} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            before
          </text>
          <text x={640} y={970} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            casting
          </text>
          <text x={100} y={1030} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Every downcast in the module now uses instanceof
          </text>
          <text x={100} y={1065} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Zero ClassCastException risk — guaranteed
          </text>
        </g>

        {/* Code snippet */}
        <g opacity={summaryE.opacity} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={200} />
          <rect x={60} y={1120} width={6} height={200} rx={3} fill={COLORS.accent} opacity={0.5} />
          <text x={100} y={1180} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>
            {'if (t instanceof ExpressTrain) {'}
          </text>
          <text x={140} y={1220} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            {'ExpressTrain e = (ExpressTrain) t;'}
          </text>
          <text x={140} y={1260} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            {'e.activateExpressMode();'}
          </text>
          <text x={100} y={1300} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>
            {'}'}
          </text>
        </g>

        {/* Floating accents */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={180 + i * 260} cy={1480 + Math.sin(frame * 0.04 + i) * 4}
            r={4} fill={COLORS.accent} fillOpacity={0.1 * shimmer} />
        ))}

        {/* Bottom train */}
        <g opacity={summaryE.opacity * 0.25} transform={`translate(${200 + breathe * 3}, 1560)`}>
          <rect x={0} y={0} width={120} height={30} rx={6} fill={COLORS.accent} fillOpacity={0.3} />
          <rect x={-30} y={4} width={30} height={22} rx={4} fill={COLORS.accent} fillOpacity={0.2} />
          <circle cx={20} cy={34} r={7} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={90} cy={34} r={7} fill={COLORS.accent} fillOpacity={0.3} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
