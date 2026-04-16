/**
 * Scene 24 — SystemReadsDecision
 * "And the system that reads every decision and turns it into a real action,"
 * CSV: 74.960s → 79.780s
 * Duration: 144 frames (4.8s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Section label + per-word headline reveal
 *   Phase 2 (frames 20–100): Full pipeline diagram: MODEL → DECISION spec flies →
 *                             SYSTEM reads → transforms → REAL ACTION output.
 *                             Staggered cards, path-draw connectors, data particles.
 *   Phase 3 (frames 90–end): Pulse rings, gear spin, shimmer, floating accents
 *
 * Visual: End-to-end pipeline from decision document to real-world action
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY  = { damping: 28, stiffness: 100, mass: 1.4 } as const;

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

function useCounter(frame: number, start: number, end: number, dur = 45) {
  const raw = interpolate(frame, [start, start + dur], [0, end], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene24_SystemReadsDecision: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);

  // Per-word headline
  const headWords = ['Reads', 'Every', 'Decision.'];
  const headSprings = headWords.map((_, i) => {
    const f = Math.max(0, frame - i * 6);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [28, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const subEnter = useSpringEntrance(frame, 20);

  // ── Phase 2: Pipeline diagram ────────────────────────────────────────────
  // Node positions: horizontal pipeline at center of Zone C
  const pipeY = 720;
  const NODE_W = 180;
  const NODE_H = 100;
  const nodeXs = [100, 340, 580, 820]; // 4 nodes across
  const nodeLabels = ['MODEL', 'DECISION', 'SYSTEM', 'ACTION'];
  const nodeColors = [
    COLORS.text_muted,
    COLORS.accent,
    COLORS.accent,
    COLORS.white,
  ];

  const nodeEntrances = nodeXs.map((_, i) =>
    useSpringEntrance(frame, 24 + i * 10)
  );

  // Connectors (3 arrows between 4 nodes)
  const connLen = 60;
  const connDashes = [
    usePathDraw(frame, 34, connLen, 14),
    usePathDraw(frame, 44, connLen, 14),
    usePathDraw(frame, 54, connLen, 14),
  ];

  // Detailed illustration below pipeline
  const detailEnter = useSpringEntrance(frame, 50);

  // Decision spec document (left)
  const specEnter = useSpringEntrance(frame, 55);
  const specBorderPerim = 2 * (360 + 300);
  const specBorderDash = usePathDraw(frame, 55, specBorderPerim, 25);

  // Transformation engine (center)
  const engineEnter = useSpringEntrance(frame, 65);
  const gearRotation = frame * 1.5;

  // Action output (right)
  const actionEnter = useSpringEntrance(frame, 75);
  const actionBorderPerim = 2 * (360 + 300);
  const actionBorderDash = usePathDraw(frame, 75, actionBorderPerim, 25);

  // Data flow arrows between detail sections
  const flowArrowLen = 80;
  const flowDash1 = usePathDraw(frame, 68, flowArrowLen, 16);
  const flowDash2 = usePathDraw(frame, 78, flowArrowLen, 16);

  // Data particles (flying dots along connector paths)
  const particleProgress1 = interpolate(frame, [40, 90], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const particleProgress2 = interpolate(frame, [55, 105], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Bottom summary cards
  const bottomCard1 = useSpringEntrance(frame, 85);
  const bottomCard2 = useSpringEntrance(frame, 92);
  const wideCard = useSpringEntrance(frame, 100);

  // Step counter
  const stepCount = useCounter(frame, 80, 4, 30);

  // ── Phase 3: Micro-animations ────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Pulse rings on SYSTEM node
  const sysNodeCX = nodeXs[2] + NODE_W / 2;
  const ringR = 60 + ((frame * 0.8) % 40);
  const ringOp = interpolate((frame * 0.8) % 40, [0, 40], [0.1, 0], {
    extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s24.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · FULL PIPELINE" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word headline ──────────────────────────────── */}
        {headWords.map((word, i) => (
          <g key={i} opacity={headSprings[i].op}
             transform={`translate(0, ${headSprings[i].ty})`}>
            <text x={60 + i * 340} y={310}
              fontFamily={FONT}
              fontSize={i === 2 ? 88 : 84} fontWeight={800}
              fill={i === 2 ? COLORS.accent : COLORS.white}
              fontStyle={i === 2 ? 'italic' : undefined}>
              {word}
            </text>
          </g>
        ))}
        <g opacity={subEnter.opacity} transform={`translate(0, ${subEnter.translateY})`}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            Turns it into a <tspan fill={COLORS.accent}>real action</tspan>
          </text>
        </g>

        {/* ── Pipeline nodes (horizontal) ────────────────────────────── */}
        {nodeXs.map((nx, i) => (
          <g key={i} opacity={nodeEntrances[i].opacity}
             transform={`translate(0, ${nodeEntrances[i].translateY})`}>
            <rect x={nx} y={pipeY} width={NODE_W} height={NODE_H} rx={16}
              fill={COLORS.bg_secondary}
              stroke={i === 2 || i === 3 ? COLORS.accent : 'rgba(255,255,255,0.1)'}
              strokeWidth={i === 2 || i === 3 ? 2 : 1} />
            <text x={nx + NODE_W / 2} y={pipeY + 60} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={nodeColors[i]} letterSpacing="0.08em">
              {nodeLabels[i]}
            </text>
          </g>
        ))}

        {/* Connectors between pipeline nodes */}
        {[0, 1, 2].map(i => {
          const x1 = nodeXs[i] + NODE_W;
          const x2 = nodeXs[i + 1];
          const cy = pipeY + NODE_H / 2;
          return (
            <line key={i} x1={x1} y1={cy} x2={x2} y2={cy}
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={connLen} strokeDashoffset={connDashes[i]}
              markerEnd="url(#arrow)" />
          );
        })}

        {/* Data particle on first connector */}
        {particleProgress1 > 0 && particleProgress1 < 1 && (
          <circle
            cx={nodeXs[0] + NODE_W + (nodeXs[1] - nodeXs[0] - NODE_W) * particleProgress1}
            cy={pipeY + NODE_H / 2}
            r={4} fill={COLORS.accent} opacity={0.6} />
        )}
        {/* Data particle on second connector */}
        {particleProgress2 > 0 && particleProgress2 < 1 && (
          <circle
            cx={nodeXs[1] + NODE_W + (nodeXs[2] - nodeXs[1] - NODE_W) * particleProgress2}
            cy={pipeY + NODE_H / 2}
            r={4} fill={COLORS.accent} opacity={0.6} />
        )}

        {/* Pulse ring on SYSTEM node */}
        {frame > 60 && (
          <circle cx={sysNodeCX} cy={pipeY + NODE_H / 2} r={ringR}
            fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={ringOp} />
        )}

        {/* ── Detailed illustration: 3 panels ────────────────────────── */}

        {/* Left: Decision spec document */}
        <g opacity={specEnter.opacity} transform={`translate(0, ${specEnter.translateY})`}>
          <rect x={60} y={880} width={300} height={340} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={specBorderPerim} strokeDashoffset={specBorderDash} />
          <text x={210} y={930} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            DECISION SPEC
          </text>
          {/* JSON-like lines */}
          {[
            { text: '{  "tool": "search",', y: 970 },
            { text: '   "query": "moon",', y: 1005 },
            { text: '   "limit": 5', y: 1040 },
            { text: '}', y: 1075 },
          ].map((l, i) => (
            <text key={i} x={90} y={l.y}
              fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500}
              fill={i === 0 ? COLORS.accent : COLORS.text_muted}
              opacity={specEnter.opacity * interpolate(frame, [58 + i * 4, 66 + i * 4], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })}>
              {l.text}
            </text>
          ))}
          {/* Status dot */}
          <circle cx={88} cy={1130} r={4} fill={COLORS.accent} opacity={0.5 + 0.5 * Math.sin(frame * 0.1)} />
          <text x={104} y={1136}
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            Ready to process
          </text>
        </g>

        {/* Flow arrow 1 */}
        <line x1={370} y1={1040} x2={370 + flowArrowLen} y2={1040}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={flowArrowLen} strokeDashoffset={flowDash1}
          markerEnd="url(#arrow)" />

        {/* Center: Transformation engine */}
        <g opacity={engineEnter.opacity} transform={`translate(0, ${engineEnter.translateY})`}>
          <rect x={460} y={880} width={200} height={340} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={560} y={930} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            RUNTIME
          </text>
          {/* Spinning gear */}
          <g transform={`translate(560, 1040) rotate(${gearRotation})`}
             style={{ transformOrigin: '0px 0px' }}>
            {/* Gear teeth */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (Math.PI * 2 * i) / 8;
              return (
                <rect key={i}
                  x={-6} y={-44} width={12} height={14} rx={2}
                  fill={COLORS.accent} opacity={0.6}
                  transform={`rotate(${(360 / 8) * i})`}
                  style={{ transformOrigin: '0px 0px' }} />
              );
            })}
            <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={0} r={10} fill={COLORS.accent} opacity={0.4} />
          </g>
          {/* Status */}
          <text x={560} y={1140} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer}>
            PROCESSING
          </text>
          {/* Progress dots */}
          {[0, 1, 2].map(i => (
            <circle key={i} cx={536 + i * 24} cy={1170} r={3}
              fill={COLORS.accent}
              opacity={interpolate((frame + i * 8) % 24, [0, 12, 24], [0.2, 1, 0.2])} />
          ))}
        </g>

        {/* Flow arrow 2 */}
        <line x1={670} y1={1040} x2={670 + flowArrowLen} y2={1040}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={flowArrowLen} strokeDashoffset={flowDash2}
          markerEnd="url(#arrow)" />

        {/* Right: Real action output */}
        <g opacity={actionEnter.opacity} transform={`translate(0, ${actionEnter.translateY})`}>
          <rect x={760} y={880} width={260} height={340} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.white} strokeWidth={2}
            strokeDasharray={actionBorderPerim} strokeDashoffset={actionBorderDash} />
          <text x={890} y={930} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white} letterSpacing="0.1em">
            REAL ACTION
          </text>
          {/* Action icon — lightning bolt */}
          <path d="M 875,970 L 865,1020 L 880,1020 L 870,1070 L 910,1010 L 892,1010 L 905,970 Z"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            opacity={actionEnter.opacity * shimmer} />
          {/* Result badge */}
          <rect x={810} y={1090} width={160} height={36} rx={18}
            fill={COLORS.accent} opacity={0.12} />
          <text x={890} y={1114} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
            HTTP 200 OK
          </text>
          {/* Result check */}
          <path d="M 860,1150 L 878,1168 L 920,1130"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            opacity={actionEnter.opacity * 0.7} />
        </g>

        {/* ── Bottom summary ─────────────────────────────────────────── */}
        <g opacity={bottomCard1.opacity} transform={`translate(0, ${bottomCard1.translateY})`}>
          <BentoCard x={60} y={1280} w={460} h={130} accent />
          <rect x={60} y={1280} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={1338}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Read + Parse + Execute
          </text>
          <text x={100} y={1378}
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            {stepCount} steps automatically
          </text>
        </g>

        <g opacity={bottomCard2.opacity} transform={`translate(0, ${bottomCard2.translateY})`}>
          <BentoCard x={560} y={1280} w={460} h={130} />
          <rect x={560} y={1280} width={6} height={130} rx={3}
            fill={COLORS.accent} opacity={0.5} />
          <text x={600} y={1338}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Every single decision
          </text>
          <text x={600} y={1378}
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Becomes a real-world effect
          </text>
        </g>

        {/* Wide summary card */}
        <g opacity={wideCard.opacity} transform={`translate(0, ${wideCard.translateY})`}>
          <BentoCard x={60} y={1440} w={960} h={110} accent />
          <text x={540} y={1508} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Decision in → <tspan fill={COLORS.accent} fontStyle="italic">real action</tspan> out
          </text>
        </g>

        {/* ── Floating accent particles ──────────────────────────────── */}
        {[
          { x: 200, y: 560, r: 2 }, { x: 880, y: 560, r: 2.5 },
          { x: 160, y: 1580, r: 2 }, { x: 940, y: 1600, r: 2 },
          { x: 500, y: 1620, r: 1.5 }, { x: 700, y: 580, r: 2 },
        ].map((d, i) => (
          <circle key={i}
            cx={d.x} cy={d.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={d.r} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {/* ── Corner accent indicators ───────────────────────────────── */}
        <g opacity={labelEnter.opacity * 0.4}>
          <line x1={60} y1={470} x2={60} y2={530}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <line x1={60} y1={470} x2={120} y2={470}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s24.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
