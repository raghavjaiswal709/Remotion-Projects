/**
 * Scene 12 — ReadsResponse
 * "When the response arrives, it reads it."
 * CSV: 33.720s → 36.080s
 * Duration: 71 frames (2.4s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline
 *   Phase 2 (14–50): response JSON card, parsing illustration
 *   Phase 3 (45–end): micro
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

export const Scene12_ReadsResponse: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);
  const badge = useSpringEntrance(frame, 2);

  // Response card
  const respCard = useSpringEntrance(frame, 14);
  const respPerim = 2 * (960 + 440);
  const respBorderDash = usePathDraw(frame, 14, respPerim, 28);

  // Response JSON lines
  const jsonLines = [
    { text: '{ "choices": [{', delay: 18 },
    { text: '    "message": {', delay: 21 },
    { text: '      "role": "assistant",', delay: 24 },
    { text: '      "content": "Tokyo is 22°C",', delay: 27 },
    { text: '      "tool_calls": null', delay: 30 },
    { text: '    }', delay: 33 },
    { text: '  }]', delay: 35 },
    { text: '}', delay: 37 },
  ];

  // Parsing indicator
  const parseBar = useSpringEntrance(frame, 36);
  const parseWidth = interpolate(frame, [36, 50], [0, 860], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Decision card
  const decisionCard = useSpringEntrance(frame, 42);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + frame * 0.012;
    const r = 360 + Math.sin(frame * 0.02 + i) * 30;
    return { x: 540 + Math.cos(a) * r, y: 950 + Math.sin(a) * r * 0.3 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

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
            fill={COLORS.accent} letterSpacing="0.1em">STEP 4</text>
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Reads Response
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Parses what the model returned
          </text>
        </g>

        {/* Response JSON card */}
        <g opacity={respCard.opacity} transform={`translate(0, ${respCard.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={440} accent />
          <rect x={60} y={460} width={960} height={440} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={respPerim} strokeDashoffset={respBorderDash} />
          <rect x={60} y={460} width={6} height={440} rx={3} fill={COLORS.accent} />
          <text x={120} y={520}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">API RESPONSE</text>
          {jsonLines.map((line, i) => {
            const op = interpolate(frame, [line.delay, line.delay + 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={120} y={570 + i * 42}
                fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500}
                fill={COLORS.text_muted} opacity={op}>
                {line.text}
              </text>
            );
          })}
        </g>

        {/* Parse progress bar */}
        <g opacity={parseBar.opacity}>
          <rect x={100} y={930} width={860} height={8} rx={4}
            fill="rgba(255,255,255,0.06)" />
          <rect x={100} y={930} width={parseWidth} height={8} rx={4}
            fill={COLORS.accent} opacity={0.8} />
          <text x={540} y={975} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            PARSING RESPONSE...
          </text>
        </g>

        {/* Decision card: text response vs tool call */}
        <g opacity={decisionCard.opacity} transform={`translate(0, ${decisionCard.translateY})`}>
          <BentoCard x={60} y={1020} w={460} h={240} />
          <circle cx={140} cy={1100} r={20}
            fill={COLORS.accent} opacity={0.15} />
          <text x={140} y={1108} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>A</text>
          <text x={180} y={1108}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Text response
          </text>
          <text x={100} y={1160}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Return to user directly
          </text>
          <text x={100} y={1200}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            tool_calls = null
          </text>

          <BentoCard x={560} y={1020} w={460} h={240} accent />
          <circle cx={640} cy={1100} r={20}
            fill={COLORS.accent} opacity={0.15} />
          <text x={640} y={1108} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>B</text>
          <text x={680} y={1108}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Tool call
          </text>
          <text x={600} y={1160}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Execute the tool first
          </text>
          <text x={600} y={1200}
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            tool_calls = [...]
          </text>
        </g>

        {/* Summary */}
        <g opacity={decisionCard.opacity} transform={`translate(0, ${decisionCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={120} />
          <rect x={60} y={1320} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={120} y={1392}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The response decides the next action
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={22} fill={COLORS.accent} opacity={0.04} />
          <circle cx={0} cy={0} r={22} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.16} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
