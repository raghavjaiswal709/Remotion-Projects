/**
 * Scene 03 — RecapLoopCode
 * "The code that wraps the model and executes the loop."
 * CSV: 8.860s → 11.580s
 * Duration: ~100 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring entrance
 *   Phase 2 (frames 20–80):  Code block bento card with animated lines + model wrapper diagram
 *   Phase 3 (frames 60–end): Bracket pulse, data flow particles, connector shimmer
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene03_RecapLoopCode: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const codeCard    = useSpringEntrance(frame, 18);
  const wrapperCard = useSpringEntrance(frame, 30);
  const infoCard    = useSpringEntrance(frame, 42);

  // Code line reveals
  const codeLine1 = interpolate(frame, [22, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const codeLine2 = interpolate(frame, [28, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const codeLine3 = interpolate(frame, [34, 42], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const codeLine4 = interpolate(frame, [40, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const codeLine5 = interpolate(frame, [46, 54], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Path draws for wrapper brackets
  const bracketLen = 700;
  const bracketLeftDash  = usePathDraw(frame, 25, bracketLen, 35);
  const bracketRightDash = usePathDraw(frame, 30, bracketLen, 35);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const dataFlowX = interpolate(frame % 60, [0, 60], [0, 960], { extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 5 · RECAP" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headlines ────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Code That
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Wraps The Model
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={450} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            And executes the loop — the runtime layer
          </text>
        </g>

        {/* ── ZONE C — Code block ───────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={380} accent />
          <rect x={60} y={520} width={6} height={380} rx={3} fill={COLORS.accent} />

          {/* Code header */}
          <text x={100} y={568} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            RUNTIME.PY
          </text>
          <line x1={100} y1={580} x2={980} y2={580}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

          {/* Code lines with staggered reveal */}
          <text x={100} y={630} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={30} fontWeight={500} fill={COLORS.accent} opacity={codeLine1}>
            def runtime(model, tools):
          </text>
          <text x={140} y={680} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={30} fontWeight={500} fill={COLORS.text_muted} opacity={codeLine2}>
            state = init()
          </text>
          <text x={140} y={730} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={30} fontWeight={500} fill={COLORS.accent} opacity={codeLine3}>
            while not done(state):
          </text>
          <text x={180} y={780} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={30} fontWeight={500} fill={COLORS.text_muted} opacity={codeLine4}>
            thought = model.think(state)
          </text>
          <text x={180} y={830} fontFamily="'Fira Code','Courier New',monospace"
            fontSize={30} fontWeight={500} fill={COLORS.text_muted} opacity={codeLine5}>
            state = tools.act(thought)
          </text>
        </g>

        {/* ── Wrapper diagram — large brackets around model box ──────────── */}
        <g opacity={wrapperCard.opacity} transform={`translate(0, ${wrapperCard.translateY})`}>
          {/* Left curly bracket */}
          <path
            d="M 140,960 C 100,960 100,1040 100,1080 C 100,1120 80,1140 80,1160 C 80,1180 100,1200 100,1240 C 100,1280 100,1360 140,1360"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={bracketLen} strokeDashoffset={bracketLeftDash}
            strokeLinecap="round"
          />
          {/* Right curly bracket */}
          <path
            d="M 940,960 C 980,960 980,1040 980,1080 C 980,1120 1000,1140 1000,1160 C 1000,1180 980,1200 980,1240 C 980,1280 980,1360 940,1360"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={bracketLen} strokeDashoffset={bracketRightDash}
            strokeLinecap="round"
          />

          {/* Model box inside brackets */}
          <rect x={200} y={1020} width={680} height={240} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />

          {/* Robot head inside model box */}
          <rect x={440} y={1050} width={100} height={80} rx={12}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={465} cy={1085} r={8} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={515} cy={1085} r={8} fill={COLORS.accent} opacity={shimmer} />
          <rect x={465} y={1105} width={50} height={4} rx={2} fill={COLORS.accent} opacity={0.6} />
          {/* Antenna */}
          <line x1={490} y1={1050} x2={490} y2={1035} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={490} cy={1030} r={4} fill={COLORS.accent} opacity={pulse} />

          <text x={540} y={1170} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            LLM MODEL
          </text>
          <text x={540} y={1215} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Wrapped by runtime code
          </text>

          {/* Label left */}
          <text x={80} y={1170} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}
            writingMode="tb" transform="rotate(180, 80, 1170)">
            RUNTIME
          </text>
        </g>

        {/* ── Info card ─────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={140} />
          <text x={100} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Runtime = orchestration layer around the model
          </text>
          <text x={100} y={1510} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            It manages the loop, state, and tool dispatch
          </text>
        </g>

        {/* ── Data flow particles ─────────────────────────────────────── */}
        <g opacity={interpolate(frame, [55, 70], [0, 0.5], { extrapolateRight: 'clamp' })}>
          <circle cx={60 + dataFlowX * 0.3} cy={950 + breathe} r={3} fill={COLORS.accent} opacity={0.4} />
          <circle cx={200 + dataFlowX * 0.5} cy={940 + breathe * 0.8} r={2.5} fill={COLORS.accent} opacity={0.35} />
          <circle cx={400 + dataFlowX * 0.7} cy={955 + breathe * 1.2} r={3.5} fill={COLORS.accent} opacity={0.3} />
        </g>

        {/* ── Floating accent circles ─────────────────────────────────── */}
        <g transform={`translate(900, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
