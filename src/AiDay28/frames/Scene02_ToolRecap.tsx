/**
 * Scene 02 — ToolRecap
 * "Last day, we learned what a tool is,"
 * CSV: 5.440s → 7.860s
 * Duration: 80 frames (2.67s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   "YESTERDAY" label slides in, headline springs
 *   Phase 2 (frames 15–55):  Wrench/tool SVG assembles, recap card appears
 *   Phase 3 (frames 50–end): Subtle pulse on tool icon, breathing elements
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

export const Scene02_ToolRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ───────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headlineEnter = useSpringEntrance(frame, 6);
  const sublineEnter = useSpringEntrance(frame, 12);

  // ── Phase 2: Tool illustration + card ───────────────────────────────────────
  const toolIconEnter = useSpringEntrance(frame, 16);
  const recapCard = useSpringEntrance(frame, 22);
  const defCard1 = useSpringEntrance(frame, 30);
  const defCard2 = useSpringEntrance(frame, 38);

  // Wrench outline draw
  const wrenchLen = 360;
  const wrenchDash = usePathDraw(frame, 18, wrenchLen, 28);

  // Gear path draw
  const gearLen = 300;
  const gearDash = usePathDraw(frame, 24, gearLen, 25);

  // Connector line
  const connLen = 200;
  const connDash = usePathDraw(frame, 35, connLen, 20);

  // ── Phase 3: Micro-animations ───────────────────────────────────────────────
  const gearRotate = frame * 0.8;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  // Border draw for recap card
  const CARD_PERIM = 2 * (960 + 200);
  const cardBorderDash = interpolate(frame, [22, 48], [CARD_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Yesterday label ──────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="YESTERDAY · DAY 27 RECAP" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEnter.translateY})`} opacity={headlineEnter.opacity}>
          <text
            x={60} y={280}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}
          >
            What a Tool Is
          </text>
        </g>
        <g transform={`translate(0, ${sublineEnter.translateY})`} opacity={sublineEnter.opacity}>
          <text
            x={60} y={360}
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}
          >
            A quick refresher
          </text>
        </g>

        {/* ── ZONE C — Tool illustration ────────────────────────────────── */}

        {/* Large wrench SVG illustration */}
        <g transform={`translate(540, ${720 + breathe})`} opacity={toolIconEnter.opacity}>
          <g transform={`translate(${toolIconEnter.translateY}, 0)`}>
            {/* Wrench body */}
            <path
              d={`M -40,-120 L -40,80 Q -40,120 -20,140 L 20,140 Q 40,120 40,80 L 40,-120
                  Q 40,-140 60,-160 L 80,-160 Q 100,-160 100,-140 L 100,-100
                  Q 100,-80 80,-80 L 60,-80 Q 40,-80 40,-60 L 40,-120 Z`}
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={wrenchLen} strokeDashoffset={wrenchDash}
              strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Wrench head open jaw */}
            <path
              d="M -60,-120 Q -80,-140 -80,-180 Q -80,-220 -40,-240 Q 0,-260 40,-240 Q 80,-220 80,-180"
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={wrenchLen} strokeDashoffset={wrenchDash}
              strokeLinecap="round"
            />
            {/* Center grip dots */}
            {[-20, 0, 20].map((dy, i) => (
              <circle key={i} cx={0} cy={dy} r={5}
                fill={COLORS.accent} opacity={toolIconEnter.opacity * 0.6} />
            ))}
          </g>
        </g>

        {/* Rotating gear next to wrench */}
        <g transform={`translate(780, ${680 + breathe})`} opacity={toolIconEnter.opacity}>
          <g transform={`rotate(${gearRotate})`} style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={60} fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={gearLen} strokeDashoffset={gearDash} />
            {/* Gear teeth */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const ix = Math.cos(angle) * 60;
              const iy = Math.sin(angle) * 60;
              const ox = Math.cos(angle) * 80;
              const oy = Math.sin(angle) * 80;
              return (
                <line key={i} x1={ix} y1={iy} x2={ox} y2={oy}
                  stroke={COLORS.accent} strokeWidth={8} strokeLinecap="round"
                  opacity={toolIconEnter.opacity * 0.7} />
              );
            })}
            <circle cx={0} cy={0} r={20} fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={2} />
          </g>
        </g>

        {/* Small gear */}
        <g transform={`translate(300, ${800 + breathe * 0.7})`} opacity={toolIconEnter.opacity * 0.6}>
          <g transform={`rotate(${-gearRotate * 1.5})`} style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i * 60 * Math.PI) / 180;
              return (
                <line key={i}
                  x1={Math.cos(angle) * 36} y1={Math.sin(angle) * 36}
                  x2={Math.cos(angle) * 50} y2={Math.sin(angle) * 50}
                  stroke={COLORS.accent} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
              );
            })}
            <circle cx={0} cy={0} r={12} fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          </g>
        </g>

        {/* ── Recap definition cards ───────────────────────────────────── */}
        <g opacity={recapCard.opacity} transform={`translate(0, ${recapCard.translateY})`}>
          <BentoCard x={60} y={960} w={960} h={200} accent />
          <rect
            x={60} y={960} width={960} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={CARD_PERIM} strokeDashoffset={cardBorderDash}
          />
          <rect x={60} y={960} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1040} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            TOOL
          </text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            A named, callable function
          </text>
        </g>

        {/* Connector to next cards */}
        <path
          d="M 540,1160 L 540,1220"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connLen} strokeDashoffset={connDash}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />

        {/* Two sub-definition cards */}
        <g opacity={defCard1.opacity} transform={`translate(0, ${defCard1.translateY})`}>
          <BentoCard x={60} y={1240} w={460} h={200} />
          <rect x={60} y={1240} width={6} height={200} rx={3}
            fill={COLORS.accent} opacity={0.6} />
          <text x={100} y={1320} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Text Output
          </text>
          <text x={100} y={1370} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Model generates text
          </text>
        </g>

        <g opacity={defCard2.opacity} transform={`translate(0, ${defCard2.translateY})`}>
          <BentoCard x={560} y={1240} w={460} h={200} />
          <rect x={560} y={1240} width={6} height={200} rx={3}
            fill={COLORS.accent} opacity={0.6} />
          <text x={600} y={1320} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Real Effects
          </text>
          <text x={600} y={1370} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Bridges to real world
          </text>
        </g>

        {/* ── Floating particles ────────────────────────────────────────── */}
        {[
          { x: 150, y: 520, r: 4 }, { x: 920, y: 560, r: 5 },
          { x: 200, y: 1600, r: 3 }, { x: 880, y: 1550, r: 4 },
        ].map((p, i) => (
          <circle key={i}
            cx={p.x} cy={p.y + Math.sin(frame * 0.04 + i) * 8}
            r={p.r} fill={COLORS.accent} opacity={0.12 * shimmer}
          />
        ))}

        {/* ── Pulse ring on wrench center ──────────────────────────────── */}
        <circle cx={540} cy={720 + breathe} r={100 * pulse}
          fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.1} />

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
