/**
 * Scene 11 — Model Decides, Tool Does
 * "The model decides the tool does."
 * CSV: 46.520s → 49.080s
 * Duration: 95 frames (3.2s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring entrance
 *   Phase 2 (frames 15–60):  Split-screen: MODEL (decides) vs TOOL (does)
 *   Phase 3 (frames 50–end): Pulse on divider, shimmer on icons, breathe on labels
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

// Brain icon path (simplified, drawn as SVG)
function BrainIcon({ cx, cy, r, opacity }: { cx: number; cy: number; r: number; opacity: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={opacity}>
      {/* Brain outline (two hemispheres) */}
      <path d={`M 0,${-r} C ${r * 0.6},${-r} ${r},${-r * 0.4} ${r},0 C ${r},${r * 0.5} ${r * 0.3},${r} 0,${r}`}
        fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
      <path d={`M 0,${-r} C ${-r * 0.6},${-r} ${-r},${-r * 0.4} ${-r},0 C ${-r},${r * 0.5} ${-r * 0.3},${r} 0,${r}`}
        fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
      {/* Center dividing line */}
      <line x1={0} y1={-r + 4} x2={0} y2={r - 4}
        stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray="4 4" />
      {/* Internal fold lines */}
      <path d={`M ${-r * 0.35},${-r * 0.3} C ${-r * 0.2},${-r * 0.1} ${-r * 0.5},${r * 0.1} ${-r * 0.3},${r * 0.35}`}
        fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.5} />
      <path d={`M ${r * 0.35},${-r * 0.3} C ${r * 0.2},${-r * 0.1} ${r * 0.5},${r * 0.1} ${r * 0.3},${r * 0.35}`}
        fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.5} />
    </g>
  );
}

export const Scene11_ModelDecides: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headlineEnt = useSpringEntrance(frame, 4);
  const vsEnt = useSpringEntrance(frame, 10);

  // ── Phase 2: Left and right panels ─────────────────────────────────────────
  const leftPanel = useSpringEntrance(frame, 14);
  const rightPanel = useSpringEntrance(frame, 20);
  const leftItems = [
    useSpringEntrance(frame, 26),
    useSpringEntrance(frame, 34),
    useSpringEntrance(frame, 42),
  ];
  const rightItems = [
    useSpringEntrance(frame, 30),
    useSpringEntrance(frame, 38),
    useSpringEntrance(frame, 46),
  ];

  // Divider line draw
  const dividerLen = 1000;
  const dividerDraw = usePathDraw(frame, 16, dividerLen, 25);

  // Bottom card
  const bottomCard = useSpringEntrance(frame, 55);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 3;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const dividerGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.8]);

  // Lightning bolt scale for "action" side
  const boltPulse = 1 + Math.sin(frame * 0.12) * 0.06;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  // Left model items
  const modelItems = ['Which tool?', 'What arguments?', 'When to call?'];
  // Right tool items
  const toolItems = ['Run the code', 'Fetch the data', 'Return result'];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SEPARATION OF CONCERNS" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEnt.translateY})`} opacity={headlineEnt.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Model
          </text>
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            Decides
          </text>
        </g>

        {/* ── VS badge ────────────────────────────────────────────────────── */}
        <g opacity={vsEnt.opacity} transform={`translate(0, ${vsEnt.translateY})`}>
          <circle cx={540} cy={500} r={34}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={512} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            VS
          </text>
        </g>

        {/* ── CENTER DIVIDER LINE (vertical from y=560 to y=1560) ─────────── */}
        <line x1={540} y1={560} x2={540} y2={1560}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDraw}
          opacity={dividerGlow} strokeLinecap="round" />

        {/* ── LEFT PANEL — MODEL (Decides) ────────────────────────────────── */}
        <g opacity={leftPanel.opacity} transform={`translate(0, ${leftPanel.translateY})`}>
          <BentoCard x={60} y={570} w={440} h={560} />

          {/* Brain icon at top of card */}
          <BrainIcon cx={280} cy={660} r={46} opacity={shimmer} />

          {/* "MODEL" label */}
          <text x={280} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            MODEL
          </text>

          {/* "DECIDES" badge */}
          <rect x={190} y={760} width={180} height={42} rx={21}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={280} y={788} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            DECIDES
          </text>

          {/* Deciding items */}
          {modelItems.map((item, i) => {
            const anim = leftItems[i];
            return (
              <g key={i} opacity={anim.opacity} transform={`translate(0, ${anim.translateY})`}>
                <rect x={100} y={830 + i * 80} width={360} height={60} rx={12}
                  fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                {/* Thought bubble dot */}
                <circle cx={124} cy={860 + i * 80} r={8}
                  fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
                <circle cx={124} cy={860 + i * 80} r={3}
                  fill={COLORS.accent} opacity={0.6 * shimmer} />
                <text x={150} y={868 + i * 80} fontFamily={FONT} fontSize={32} fontWeight={800}
                  fill={COLORS.white}>
                  {item}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── RIGHT PANEL — TOOL (Does) ───────────────────────────────────── */}
        <g opacity={rightPanel.opacity} transform={`translate(0, ${rightPanel.translateY})`}>
          <BentoCard x={580} y={570} w={440} h={560} accent />

          {/* Lightning bolt icon */}
          <g transform={`translate(800, 660) scale(${boltPulse})`} style={{ transformOrigin: '0px 0px' }}>
            <polygon points="0,-40 12,-10 4,-10 10,40 -8,4 0,4 -12,-40"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinejoin="round" />
            <polygon points="0,-30 8,-8 2,-8 6,28 -4,2 0,2 -8,-30"
              fill={COLORS.accent} fillOpacity={0.15} />
          </g>

          {/* "TOOL" label */}
          <text x={800} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            TOOL
          </text>

          {/* "DOES" badge */}
          <rect x={710} y={760} width={180} height={42} rx={21}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={800} y={788} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            DOES
          </text>

          {/* Doing items */}
          {toolItems.map((item, i) => {
            const anim = rightItems[i];
            return (
              <g key={i} opacity={anim.opacity} transform={`translate(0, ${anim.translateY})`}>
                <rect x={620} y={830 + i * 80} width={360} height={60} rx={12}
                  fill="rgba(255,255,255,0.03)" stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
                {/* Gear mini icon */}
                <circle cx={644} cy={860 + i * 80} r={8}
                  fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
                <circle cx={644} cy={860 + i * 80} r={3}
                  fill={COLORS.accent} opacity={0.4} />
                <text x={670} y={868 + i * 80} fontFamily={FONT} fontSize={32} fontWeight={800}
                  fill={COLORS.text_muted}>
                  {item}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Arrow from left → right (horizontal, across the divide) ─────── */}
        <g opacity={bottomCard.opacity}>
          {/* Horizontal arrow showing "model decides → tool does" */}
          <path d="M 280,1170 C 380,1170 440,1170 540,1170 C 640,1170 700,1170 800,1170"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray="300" strokeDashoffset={usePathDraw(frame, 50, 300, 20)}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={540} y={1155} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}
            opacity={0.6 * shimmer}>
            HANDOFF
          </text>
        </g>

        {/* ── Bottom summary card ──────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1230} w={960} h={160} accent />

          {/* Left side — the principle */}
          <text x={100} y={1300} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The model
          </text>
          <text x={100} y={1350} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            never executes
          </text>

          {/* Divider inside card */}
          <line x1={540} y1={1260} x2={540} y2={1370}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Right side — the complement */}
          <text x={580} y={1300} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The tool
          </text>
          <text x={580} y={1350} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            never decides
          </text>
        </g>

        {/* Floating accents */}
        <g transform={`translate(0, ${breathe})`}>
          <circle cx={100} cy={1470} r={2.5} fill={COLORS.accent} opacity={0.15 * shimmer} />
          <circle cx={980} cy={1490} r={2} fill={COLORS.accent} opacity={0.12 * shimmer} />
          <circle cx={540} cy={1450} r={3} fill={COLORS.accent} opacity={0.1 * shimmer} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s11.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
