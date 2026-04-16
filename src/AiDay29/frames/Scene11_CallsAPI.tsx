/**
 * Scene 11 — CallsAPI
 * "It calls the model API."
 * CSV: 31.780s → 33.720s
 * Duration: 58 frames (1.9s)
 *
 * Animation phases:
 *   Phase 1 (0–18): headline
 *   Phase 2 (12–40): runtime → API → model arrow chain
 *   Phase 3 (35–end): micro
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

export const Scene11_CallsAPI: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);
  const badge = useSpringEntrance(frame, 2);

  // Three nodes: Runtime → API → Model
  const runtimeNode = useSpringEntrance(frame, 12);
  const apiNode = useSpringEntrance(frame, 18);
  const modelNode = useSpringEntrance(frame, 24);

  // Arrow 1: runtime → api
  const arrow1Len = 180;
  const arrow1Dash = usePathDraw(frame, 16, arrow1Len, 18);
  // Arrow 2: api → model
  const arrow2Len = 180;
  const arrow2Dash = usePathDraw(frame, 22, arrow2Len, 18);

  // HTTP call card
  const httpCard = useSpringEntrance(frame, 28);
  const httpPerim = 2 * (960 + 280);
  const httpBorderDash = usePathDraw(frame, 28, httpPerim, 25);

  // Bottom detail
  const bottomCard = useSpringEntrance(frame, 34);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Signal dots traveling along arrow
  const signalProgress = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const signalX = interpolate(signalProgress, [0, 0.45, 0.55, 1], [210, 440, 580, 810]);
  const signalOp = interpolate(signalProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  const particles = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 + frame * 0.014;
    const r = 340 + Math.sin(frame * 0.025 + i) * 30;
    return { x: 540 + Math.cos(a) * r, y: 900 + Math.sin(a) * r * 0.3 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <rect x={60} y={200} width={100} height={40} rx={10}
            fill={COLORS.accent} opacity={0.15} />
          <text x={110} y={227} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">STEP 3</text>
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Calls the API
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Runtime sends the prompt to the model
          </text>
        </g>

        {/* Runtime node */}
        <g opacity={runtimeNode.opacity} transform={`translate(0, ${runtimeNode.translateY})`}>
          <rect x={80} y={500} width={260} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={210} y={560} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            RUNTIME
          </text>
        </g>

        {/* Arrow 1 */}
        <line x1={340} y1={550} x2={420} y2={550}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
          markerEnd="url(#arrow)" />

        {/* API node */}
        <g opacity={apiNode.opacity} transform={`translate(0, ${apiNode.translateY})`}>
          <rect x={420} y={500} width={240} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text x={540} y={560} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            API
          </text>
        </g>

        {/* Arrow 2 */}
        <line x1={660} y1={550} x2={740} y2={550}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
          markerEnd="url(#arrow)" />

        {/* Model node */}
        <g opacity={modelNode.opacity} transform={`translate(0, ${modelNode.translateY})`}>
          <rect x={740} y={500} width={260} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={870} y={560} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            MODEL
          </text>
        </g>

        {/* Signal dot */}
        <circle cx={signalX} cy={550} r={6} fill={COLORS.accent} opacity={signalOp} />

        {/* HTTP call card */}
        <g opacity={httpCard.opacity} transform={`translate(0, ${httpCard.translateY})`}>
          <BentoCard x={60} y={680} w={960} h={280} accent />
          <rect x={60} y={680} width={960} height={280} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={httpPerim} strokeDashoffset={httpBorderDash} />
          <rect x={60} y={680} width={6} height={280} rx={3} fill={COLORS.accent} />
          <text x={120} y={740}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}
            letterSpacing="0.1em">HTTP REQUEST</text>
          <text x={120} y={790}
            fontFamily="'Fira Code', monospace" fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>
            POST /v1/chat/completions
          </text>
          <text x={120} y={840}
            fontFamily="'Fira Code', monospace" fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>
            {'{ model: "gpt-4", messages: [...] }'}
          </text>
          <text x={120} y={890}
            fontFamily="'Fira Code', monospace" fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>
            Authorization: Bearer sk-...
          </text>
        </g>

        {/* Bottom explanation */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1040} w={460} h={180} />
          <text x={100} y={1110}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Structured request
          </text>
          <text x={100} y={1160}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Messages + parameters
          </text>

          <BentoCard x={560} y={1040} w={460} h={180} accent />
          <text x={600} y={1110}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Awaits response
          </text>
          <text x={600} y={1160}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Model processes prompt
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        <g transform={`translate(540, ${1450 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} opacity={0.04} />
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.15} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
