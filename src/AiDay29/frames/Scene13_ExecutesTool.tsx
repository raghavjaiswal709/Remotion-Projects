/**
 * Scene 13 — ExecutesTool
 * "If the response contains a tool call, it executes that tool."
 * CSV: 36.080s → 39.720s
 * Duration: 109 frames (3.6s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline
 *   Phase 2 (14–70): tool call card, execution flow
 *   Phase 3 (60–end): micro
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

export const Scene13_ExecutesTool: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);
  const badge = useSpringEntrance(frame, 2);

  // Tool call JSON card
  const toolCard = useSpringEntrance(frame, 14);
  const toolPerim = 2 * (960 + 260);
  const toolBorderDash = usePathDraw(frame, 14, toolPerim, 25);

  // Execution flow nodes
  const nodeRuntime = useSpringEntrance(frame, 30);
  const nodeArrow1 = usePathDraw(frame, 36, 100, 20);
  const nodeTool = useSpringEntrance(frame, 40);
  const nodeArrow2 = usePathDraw(frame, 46, 100, 20);
  const nodeResult = useSpringEntrance(frame, 52);

  // Detail card
  const detailCard = useSpringEntrance(frame, 58);

  // Gear illustration
  const gearEnt = useSpringEntrance(frame, 22);
  const gearRotation = frame * 1.2;

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Gear teeth path
  const gearPath = (cx: number, cy: number, r: number) => {
    const teeth = 8;
    let d = '';
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.35) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a4 = ((i + 0.85) / teeth) * Math.PI * 2;
      const innerR = r * 0.72;
      const outerR = r;
      d += `${i === 0 ? 'M' : 'L'} ${cx + Math.cos(a1) * innerR},${cy + Math.sin(a1) * innerR} `;
      d += `L ${cx + Math.cos(a2) * outerR},${cy + Math.sin(a2) * outerR} `;
      d += `L ${cx + Math.cos(a3) * outerR},${cy + Math.sin(a3) * outerR} `;
      d += `L ${cx + Math.cos(a4) * innerR},${cy + Math.sin(a4) * innerR} `;
    }
    d += 'Z';
    return d;
  };

  const particles = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 + frame * 0.015;
    const r = 340 + Math.sin(frame * 0.025 + i) * 25;
    return { x: 540 + Math.cos(a) * r, y: 1050 + Math.sin(a) * r * 0.25 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

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
            fill={COLORS.accent} letterSpacing="0.1em">STEP 5</text>
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Executes Tool
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            If tool_calls is present, run it
          </text>
        </g>

        {/* Tool call JSON card */}
        <g opacity={toolCard.opacity} transform={`translate(0, ${toolCard.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={260} accent />
          <rect x={60} y={460} width={960} height={260} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={toolPerim} strokeDashoffset={toolBorderDash} />
          <rect x={60} y={460} width={6} height={260} rx={3} fill={COLORS.accent} />
          <text x={120} y={518}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">TOOL CALL DETECTED</text>
          {[
            '"tool_calls": [{',
            '  "name": "get_weather",',
            '  "arguments": { "city": "Tokyo" }',
            '}]',
          ].map((line, i) => {
            const op = interpolate(frame, [18 + i * 3, 26 + i * 3], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={120} y={566 + i * 40}
                fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500}
                fill={COLORS.text_muted} opacity={op}>{line}</text>
            );
          })}
        </g>

        {/* Execution flow: RUNTIME → TOOL → RESULT */}
        <g opacity={nodeRuntime.opacity} transform={`translate(0, ${nodeRuntime.translateY})`}>
          <rect x={100} y={780} width={240} height={80} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={220} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>RUNTIME</text>
        </g>

        <line x1={340} y1={820} x2={440} y2={820}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={100} strokeDashoffset={nodeArrow1}
          markerEnd="url(#arrow)" />

        <g opacity={nodeTool.opacity} transform={`translate(0, ${nodeTool.translateY})`}>
          <rect x={440} y={780} width={200} height={80} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Gear inside */}
          <g transform={`translate(540, 820) rotate(${gearRotation})`} opacity={gearEnt.opacity}>
            <path d={gearPath(0, 0, 22)} fill={COLORS.accent} opacity={0.2} />
            <circle cx={0} cy={0} r={8} fill={COLORS.accent} opacity={0.4} />
          </g>
        </g>

        <line x1={640} y1={820} x2={740} y2={820}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={100} strokeDashoffset={nodeArrow2}
          markerEnd="url(#arrow)" />

        <g opacity={nodeResult.opacity} transform={`translate(0, ${nodeResult.translateY})`}>
          <rect x={740} y={780} width={240} height={80} rx={16}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={860} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>RESULT</text>
        </g>

        {/* Labels under nodes */}
        <text x={220} y={890} textAnchor="middle"
          fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.text_muted} opacity={nodeRuntime.opacity}>Orchestrator</text>
        <text x={540} y={890} textAnchor="middle"
          fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.text_muted} opacity={nodeTool.opacity}>get_weather</text>
        <text x={860} y={890} textAnchor="middle"
          fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.text_muted} opacity={nodeResult.opacity}>"22°C, Sunny"</text>

        {/* Detail: what happens during execution */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={60} y={940} w={460} h={340} />
          <rect x={60} y={940} width={6} height={340} rx={3} fill={COLORS.accent} />
          <text x={100} y={1000}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            EXECUTION
          </text>
          {[
            '1. Validate arguments',
            '2. Call external API',
            '3. Await response',
            '4. Parse result',
            '5. Format as observation',
          ].map((step, i) => {
            const op = interpolate(frame, [60 + i * 4, 68 + i * 4], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={100} y={1050 + i * 46}
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted} opacity={op}>{step}</text>
            );
          })}
        </g>

        {/* Large gear illustration */}
        <g opacity={gearEnt.opacity} transform={`translate(780, 1120) rotate(${-gearRotation * 0.6})`}>
          <path d={gearPath(0, 0, 110)} fill={COLORS.accent} opacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} opacity={0.04} />
          <path d={gearPath(0, 0, 110)} fill="none" stroke={COLORS.accent}
            strokeWidth={2} opacity={0.12} />
        </g>

        {/* Bottom summary */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={120} />
          <text x={100} y={1413}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Real-world action happens at this step
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        <g transform={`translate(540, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} opacity={0.04} />
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.12} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
