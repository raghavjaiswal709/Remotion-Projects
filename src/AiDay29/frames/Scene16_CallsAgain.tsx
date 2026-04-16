/**
 * Scene 16 — CallsAgain
 * "Then it calls the model again."
 * CSV: 44.680s → 46.980s
 * Duration: 69 frames (2.3s)
 *
 * Animation phases:
 *   Phase 1 (0–18): headline
 *   Phase 2 (12–45): loopback arrow, runtime→model re-call
 *   Phase 3 (40–end): micro
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

export const Scene16_CallsAgain: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);

  // Runtime node
  const runtimeNode = useSpringEntrance(frame, 12);
  // Model node
  const modelNode = useSpringEntrance(frame, 18);

  // Forward arrow
  const fwdLen = 300;
  const fwdDash = usePathDraw(frame, 22, fwdLen, 20);

  // Loopback arrow (curved)
  const loopLen = 500;
  const loopDash = usePathDraw(frame, 30, loopLen, 25);

  // Iteration counter
  const iterCounter = Math.min(2, Math.floor(interpolate(frame, [34, 55], [0, 2.99], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })));

  // Detail cards
  const card1 = useSpringEntrance(frame, 36);
  const card2 = useSpringEntrance(frame, 44);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Signal dot moving along the path
  const signalProgress = interpolate(frame, [28, 60], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const signalX = interpolate(signalProgress, [0, 0.5, 1], [280, 800, 280]);
  const signalY = interpolate(signalProgress, [0, 0.25, 0.5, 0.75, 1], [750, 750, 750, 650, 750]);

  const particles = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 + frame * 0.016;
    const r = 320 + Math.sin(frame * 0.023 + i) * 20;
    return { x: 540 + Math.cos(a) * r, y: 900 + Math.sin(a) * r * 0.3 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Calls Again
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            The loop continues
          </text>
        </g>

        {/* Runtime node */}
        <g opacity={runtimeNode.opacity} transform={`translate(0, ${runtimeNode.translateY})`}>
          <rect x={100} y={520} width={340} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={270} y={580} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>RUNTIME</text>
        </g>

        {/* Forward arrow to Model */}
        <path d="M 440,570 L 640,570"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={fwdLen} strokeDashoffset={fwdDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />
        <text x={540} y={556}
          textAnchor="middle"
          fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.text_muted} opacity={modelNode.opacity}>call #{iterCounter + 1}</text>

        {/* Model node */}
        <g opacity={modelNode.opacity} transform={`translate(0, ${modelNode.translateY})`}>
          <rect x={640} y={520} width={340} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={810} y={580} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>MODEL</text>
        </g>

        {/* Loopback curved arrow */}
        <path d="M 810,620 C 810,720 270,720 270,620"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={loopLen} strokeDashoffset={loopDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />
        <text x={540} y={710}
          textAnchor="middle"
          fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.accent} opacity={interpolate(frame, [34, 42], [0, 1], { extrapolateRight: 'clamp' })}>
          LOOP BACK
        </text>

        {/* Traveling signal dot */}
        <circle cx={signalX} cy={signalY} r={6}
          fill={COLORS.accent} opacity={signalProgress > 0 && signalProgress < 1 ? 0.9 : 0} />
        <circle cx={signalX} cy={signalY} r={14}
          fill={COLORS.accent} opacity={signalProgress > 0 && signalProgress < 1 ? 0.15 : 0} />

        {/* Detail cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={780} w={460} h={220} />
          <rect x={60} y={780} width={6} height={220} rx={3} fill={COLORS.accent} />
          <text x={100} y={840}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>UPDATED CONTEXT</text>
          <text x={100} y={885}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Conversation now includes:
          </text>
          <text x={100} y={925}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.white}>
            user + assistant + tool messages
          </text>
          <text x={100} y={965}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Model has full history
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={780} w={460} h={220} accent />
          <text x={600} y={840}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>NEXT DECISION</text>
          <text x={600} y={885}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Model will either:
          </text>
          <text x={600} y={925}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.white}>
            Respond with text (done)
          </text>
          <text x={600} y={965}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.white}>
            Call another tool (loop)
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1060} w={960} h={120} />
          <text x={100} y={1133}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Each iteration adds more context
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.05 * shimmer} />
        ))}

        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} opacity={0.04} />
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.12} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
