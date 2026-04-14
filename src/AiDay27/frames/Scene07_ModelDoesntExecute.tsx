/**
 * Scene 07 — Model Doesn't Execute
 * "The language model never directly executes anything."
 * CSV: 25.820s → 29.840s
 * Duration: 139 frames (4.6s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Headline + "NEVER" pop in with spring
 *   Phase 2 (frames 20–90):  LLM box with X marks, barrier line draws
 *   Phase 3 (frames 80–end): Barrier pulse, X wobble, prohibition ring shimmer
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene07_ModelDoesntExecute: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const neverPop = (() => {
    const f = Math.max(0, frame - 14);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const scale = interpolate(sp, [0, 1], [0.3, 1]);
    const op = interpolate(sp, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
    return { scale, op };
  })();
  const h2 = useSpringEntrance(frame, 22);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const llmCard = useSpringEntrance(frame, 28);
  const barrierCard = useSpringEntrance(frame, 40);
  const actionCard = useSpringEntrance(frame, 52);
  const bottomCard = useSpringEntrance(frame, 66);

  // Barrier line draw
  const barrierLen = 800;
  const barrierDash = usePathDraw(frame, 44, barrierLen, 30);

  // X mark draws
  const xLen = 60;
  const xDash1 = usePathDraw(frame, 50, xLen, 15);
  const xDash2 = usePathDraw(frame, 55, xLen, 15);
  const xDash3 = usePathDraw(frame, 60, xLen, 15);

  // Prohibition circle draw
  const prohibCirc = Math.ceil(2 * Math.PI * 56);
  const prohibDash = usePathDraw(frame, 36, prohibCirc, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const barrierPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 0.9]);
  const xWobble = Math.sin(frame * 0.12) * 2;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="CRITICAL DISTINCTION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            The Model
          </text>
        </g>

        {/* NEVER — big pop with scale spring */}
        <g opacity={neverPop.op} transform={`translate(540, 420) scale(${neverPop.scale})`}
          style={{ transformOrigin: '0px 0px' }}>
          <text textAnchor="middle" y={0}
            fontFamily={FONT} fontSize={120} fontWeight={800} fill={COLORS.vibrant_red}>
            NEVER
          </text>
        </g>

        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={500} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            directly executes anything
          </text>
        </g>

        {/* ── ZONE C — LLM vs Execution diagram ──────────────────────────── */}

        {/* LLM Box — left side */}
        <g opacity={llmCard.opacity} transform={`translate(0, ${llmCard.translateY})`}>
          <BentoCard x={60} y={560} w={420} h={520} accent />

          {/* Brain icon */}
          <g transform={`translate(270, ${680 + breathe})`}>
            <ellipse cx={0} cy={0} rx={54} ry={44}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -30,-20 C -20,-40 20,-40 30,-20"
              fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
            <path d="M -20,0 C -10,-15 10,-15 20,0"
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
            <path d="M -25,15 C -15,5 15,5 25,15"
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
          </g>

          <text x={270} y={780} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            LLM
          </text>
          <text x={270} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Generates text
          </text>
          <text x={270} y={874} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Thinks and reasons
          </text>

          {/* Produces text indicator */}
          <rect x={140} y={920} width={260} height={60} rx={12}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={270} y={958} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.accent}>
            {"{ text output }"}
          </text>

          {/* Output label */}
          <text x={270} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            OUTPUT: TEXT ONLY
          </text>
        </g>

        {/* ── Barrier line ────────────────────────────────────────────────── */}
        <g opacity={barrierCard.opacity}>
          {/* Vertical barrier line */}
          <line x1={540} y1={580} x2={540} y2={1060}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={barrierLen} strokeDashoffset={barrierDash}
            opacity={barrierPulse} strokeLinecap="round" />

          {/* Prohibition circle */}
          <g transform={`translate(540, 820)`}>
            <circle cx={0} cy={0} r={56}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
              strokeDasharray={prohibCirc} strokeDashoffset={prohibDash} />
            {/* Diagonal strike-through */}
            <line x1={-36} y1={-36} x2={36} y2={36}
              stroke={COLORS.vibrant_red} strokeWidth={3.5}
              opacity={barrierPulse} strokeLinecap="round" />
          </g>
        </g>

        {/* Action side — right side */}
        <g opacity={actionCard.opacity} transform={`translate(0, ${actionCard.translateY})`}>
          <BentoCard x={600} y={560} w={420} h={520} />

          {/* Three X marks for forbidden actions */}
          {[
            { y: 650, label: 'Run code' },
            { y: 770, label: 'Call API' },
            { y: 890, label: 'Send email' },
          ].map((item, i) => {
            const xd = [xDash1, xDash2, xDash3][i];
            return (
              <g key={item.label}>
                {/* X mark */}
                <g transform={`translate(${670 + xWobble * (i % 2 === 0 ? 1 : -1)}, ${item.y})`}>
                  <line x1={-16} y1={-16} x2={16} y2={16}
                    stroke={COLORS.vibrant_red} strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={xLen} strokeDashoffset={xd} />
                  <line x1={16} y1={-16} x2={-16} y2={16}
                    stroke={COLORS.vibrant_red} strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={xLen} strokeDashoffset={xd} />
                </g>

                {/* Label */}
                <text x={720} y={item.y + 8}
                  fontFamily={FONT} fontSize={40} fontWeight={800}
                  fill={COLORS.text_muted} opacity={0.6}>
                  {item.label}
                </text>

                {/* Strikethrough */}
                <line x1={718} y1={item.y + 2} x2={920} y2={item.y + 2}
                  stroke={COLORS.vibrant_red} strokeWidth={2}
                  opacity={0.4 * shimmer} />
              </g>
            );
          })}

          <text x={810} y={1000} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            EXECUTION BLOCKED
          </text>

          <text x={810} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Cannot do real work
          </text>
        </g>

        {/* ── Bottom explanation card ──────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={280} accent />

          <text x={100} y={1200} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The language model is a{' '}
          </text>
          <text x={658} y={1200} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            text machine
          </text>

          <text x={100} y={1260} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            It can reason about actions, but cannot perform them.
          </text>
          <text x={100} y={1310} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Execution requires tools — external functions that
          </text>
          <text x={100} y={1360} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            bridge the gap between thinking and doing.
          </text>
        </g>

        {/* Bottom accent dots */}
        <circle cx={200} cy={1440} r={3} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={880} cy={1450} r={4} fill={COLORS.accent} opacity={0.15 * pulse} />

        {/* Key insight badge */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1440} w={960} h={120} />
          <text x={540} y={1514} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Text in → Text out →{' '}
          </text>
          <text x={766} y={1514}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            That&apos;s the limit
          </text>
        </g>

        {/* Floating dots */}
        <circle cx={120} cy={1640} r={3} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={960} cy={1660} r={2.5} fill={COLORS.accent} opacity={0.12 * shimmer} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
