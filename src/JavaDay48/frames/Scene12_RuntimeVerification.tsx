/**
 * Scene 12 — Runtime Type Verification
 * "a runtime type verification before a type cast."
 * CSV: 35.360s → 38.700s | Duration: 105 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–60): Flow diagram: Check → Gate → Cast
 *   Phase 3 (55–end): Micro-animations, pulse
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

export const Scene12_RuntimeVerification: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 6);
  const subE = useSpringEntrance(frame, 12);
  const node1E = useSpringEntrance(frame, 18);
  const node2E = useSpringEntrance(frame, 26);
  const node3E = useSpringEntrance(frame, 34);
  const arrowE = useSpringEntrance(frame, 30);
  const defCardE = useSpringEntrance(frame, 40);
  const timelineE = useSpringEntrance(frame, 46);

  const arrow1Len = 120;
  const arrow2Len = 120;
  const arrow1Dash = usePathDraw(frame, 30, arrow1Len, 18);
  const arrow2Dash = usePathDraw(frame, 36, arrow2Len, 18);

  const gateBarLen = 200;
  const gateBarDash = usePathDraw(frame, 28, gateBarLen, 20);

  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TYPE SAFETY · DEFINITION" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Runtime Type
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Verification
          </text>
        </g>

        {/* Flow: OBJECT → instanceof → CAST */}
        {/* Node 1: Object */}
        <g opacity={node1E.opacity} transform={`translate(0, ${node1E.translateY})`}>
          <BentoCard x={60} y={520} w={280} h={200} />
          <circle cx={200} cy={590} r={32} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={200} y={598} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>OBJ</text>
          <text x={200} y={680} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>Object</text>
        </g>

        {/* Arrow 1 */}
        <line x1={340} y1={620} x2={410} y2={620}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
          markerEnd="url(#arrow)" opacity={arrowE.opacity} />

        {/* Node 2: instanceof gate */}
        <g opacity={node2E.opacity} transform={`translate(0, ${node2E.translateY})`}>
          <BentoCard x={410} y={520} w={300} h={200} accent />
          {/* Gate bars */}
          <line x1={480} y1={540} x2={480} y2={700}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={gateBarLen} strokeDashoffset={gateBarDash} />
          <line x1={640} y1={540} x2={640} y2={700}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={gateBarLen} strokeDashoffset={gateBarDash} />
          <text x={560} y={610} textAnchor="middle" fontFamily={MONO} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>instanceof</text>
          <text x={560} y={680} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Type Check</text>
        </g>

        {/* Arrow 2 */}
        <line x1={710} y1={620} x2={780} y2={620}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
          markerEnd="url(#arrow)" opacity={arrowE.opacity} />

        {/* Node 3: Cast */}
        <g opacity={node3E.opacity} transform={`translate(0, ${node3E.translateY})`}>
          <BentoCard x={780} y={520} w={240} h={200} />
          <text x={900} y={610} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>CAST</text>
          <text x={900} y={665} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>Safe</text>
        </g>

        {/* Definition */}
        <g opacity={defCardE.opacity} transform={`translate(0, ${defCardE.translateY})`}>
          <BentoCard x={60} y={780} w={960} h={200} accent />
          <rect x={60} y={780} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={855} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            instanceof
          </text>
          <text x={400} y={855} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            verifies at runtime
          </text>
          <text x={100} y={920} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            whether an object is an instance of a given class
          </text>
          <text x={100} y={960} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            before committing to a type cast
          </text>
        </g>

        {/* Timeline: Compile vs Runtime */}
        <g opacity={timelineE.opacity} transform={`translate(0, ${timelineE.translateY})`}>
          <BentoCard x={60} y={1020} w={460} h={180} />
          <text x={100} y={1090} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            COMPILE TIME
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Syntax check only
          </text>
          <text x={100} y={1175} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No type guarantee
          </text>

          <BentoCard x={560} y={1020} w={460} h={180} accent />
          <text x={600} y={1090} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            RUNTIME
          </text>
          <text x={600} y={1140} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            Actual object inspected
          </text>
          <text x={600} y={1175} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            instanceof lives here
          </text>
        </g>

        {/* Code example */}
        <g opacity={timelineE.opacity * 0.7} transform={`translate(0, ${timelineE.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={120} />
          <text x={100} y={1310} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            {'if (t '}
          </text>
          <text x={200} y={1310} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.accent}>
            instanceof
          </text>
          <text x={440} y={1310} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            {' ExpressTrain) { cast... }'}
          </text>
        </g>

        {/* Floating elements */}
        <g transform={`translate(540, ${1500 + breathe})`} opacity={0.3}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.08 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={-80} cy={20} r={12} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={80} cy={-10} r={16} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
