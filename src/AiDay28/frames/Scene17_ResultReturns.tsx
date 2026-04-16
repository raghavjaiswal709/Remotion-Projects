/**
 * Scene 17 — ResultReturns
 * "The result returns as the next observation."
 * CSV: 53.900s → 56.380s
 * Duration: 104 frames (3.47s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + headline spring in
 *   Phase 2 (frames 12–60): Result box flies back toward model, arrow path-draws,
 *                            observation badge springs in,  append-to-context display
 *   Phase 3 (frames 55–end): Context window scroll, pulse ring on observation
 *
 * Visual: Result flying from system back to model as an "observation",
 *         being appended to the conversation/context window.
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

export const Scene17_ResultReturns: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // ── Phase 2 ──────────────────────────────────────────────────────────────

  // System box (right side, source of result)
  const sysEnter = useSpringEntrance(frame, 12);

  // Model box (left side, receives observation)
  const modelEnter = useSpringEntrance(frame, 14);

  // Return arrow (right to left)
  const arrowLen = 280;
  const arrowDash = usePathDraw(frame, 18, arrowLen, 22);

  // Result packet — flies from right to left
  const resultFly = spring({
    frame: Math.max(0, frame - 20), fps, config: SPRING_SOFT,
  });
  const resultX = interpolate(resultFly, [0, 1], [740, 320]);
  const resultOpacity = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // "OBSERVATION" badge
  const obsBadge = spring({
    frame: Math.max(0, frame - 38), fps, config: SPRING_SNAP,
  });
  const obsBadgeScale = interpolate(obsBadge, [0, 1], [0.6, 1]);
  const obsBadgeOpacity = interpolate(obsBadge, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Context window with message history
  const ctxEnter = useSpringEntrance(frame, 30);
  const ctxPerim = 2 * (960 + 380);
  const ctxBorder = interpolate(frame, [30, 52], [ctxPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Context messages staggered
  const messages = [
    { type: 'user', text: 'Search for tool calling', delay: 34 },
    { type: 'model', text: 'search(query="tool calling")', delay: 38 },
    { type: 'observation', text: 'Result: Tool calling is...', delay: 44 },
  ];

  // Bottom description cards
  const card1 = useSpringEntrance(frame, 48);
  const card2 = useSpringEntrance(frame, 54);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  // Pulse ring on observation entry
  const obsRingR = interpolate(frame, [44, 70], [0, 40], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const obsRingOp = interpolate(frame, [44, 70], [0.3, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Return trail particles
  const trailParticles = Array.from({ length: 6 }, (_, i) => {
    const offset = (frame * 4 + i * 35) % 280;
    return {
      x: 740 - offset,
      y: 580 + Math.sin(offset * 0.04) * 8,
      opacity: frame > 18 ? interpolate(offset, [0, 140, 280], [0, 0.35, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      }) : 0,
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · RETURN" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Result Returns
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={370}
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            As The Next Observation
          </text>
        </g>

        {/* ── ZONE C — Return flow ───────────────────────────────────────── */}

        {/* MODEL BOX (left side — receives result) */}
        <g opacity={modelEnter.opacity} transform={`translate(0, ${modelEnter.translateY})`}>
          <BentoCard x={60} y={480} w={260} h={200} accent />
          <text x={190} y={545} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            MODEL
          </text>
          {/* Robot head mini */}
          <rect x={155} y={560} width={70} height={56} rx={10}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={175} cy={582} r={5} fill={COLORS.accent} opacity={0.7} />
          <circle cx={205} cy={582} r={5} fill={COLORS.accent} opacity={0.7} />
          <line x1={190} y1={560} x2={190} y2={545}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={190} cy={542} r={3} fill={COLORS.accent} opacity={0.5} />
        </g>

        {/* SYSTEM BOX (right side — source of result) */}
        <g opacity={sysEnter.opacity} transform={`translate(0, ${sysEnter.translateY})`}>
          <BentoCard x={760} y={480} w={260} h={200} />
          <text x={890} y={545} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">
            SYSTEM
          </text>
          {/* Gear mini icon */}
          <g transform="translate(890, 600)">
            <circle cx={0} cy={0} r={20} fill="none"
              stroke={COLORS.text_muted} strokeWidth={2} opacity={0.4} />
            <circle cx={0} cy={0} r={8} fill="none"
              stroke={COLORS.text_muted} strokeWidth={1.5} opacity={0.3} />
          </g>
        </g>

        {/* Return arrow (right → left) */}
        <path d="M 760,580 C 680,580 580,580 460,580"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" />
        {/* Arrow head pointing left */}
        <g opacity={interpolate(frame, [36, 40], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })}>
          <polygon points="330,580 350,568 350,592"
            fill={COLORS.accent} />
        </g>

        {/* Trail particles */}
        {trailParticles.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={2}
            fill={COLORS.accent} opacity={pt.opacity} />
        ))}

        {/* Result packet (flying) */}
        <g opacity={resultOpacity}
           transform={`translate(${resultX}, ${575 + breathe * 0.3})`}>
          <rect x={-50} y={-24} width={100} height={48} rx={10}
            fill={COLORS.accent} opacity={0.15} />
          <rect x={-50} y={-24} width={100} height={48} rx={10}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={0} y={6} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
            RESULT
          </text>
        </g>

        {/* OBSERVATION badge */}
        <g transform={`translate(540, 510) scale(${obsBadgeScale})`}
           opacity={obsBadgeOpacity}
           style={{ transformOrigin: '0px 0px' }}>
          <rect x={-80} y={-18} width={160} height={36} rx={18}
            fill={COLORS.accent} opacity={0.2} />
          <text x={0} y={6} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            OBSERVATION
          </text>
        </g>

        {/* ── Context window ─────────────────────────────────────────────── */}
        <g opacity={ctxEnter.opacity} transform={`translate(0, ${ctxEnter.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={380} />
          <rect x={60} y={740} width={960} height={380} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={ctxPerim} strokeDashoffset={ctxBorder} />
          {/* Header */}
          <rect x={60} y={740} width={960} height={44} rx={20}
            fill={COLORS.accent} opacity={0.06} />
          <text x={100} y={770}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            CONVERSATION CONTEXT
          </text>

          {/* Messages */}
          {messages.map((msg, i) => {
            const msgOpacity = interpolate(frame, [msg.delay, msg.delay + 8], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const msgY = 810 + i * 90;
            const isObs = msg.type === 'observation';
            const color = msg.type === 'user' ? COLORS.text_muted :
                          msg.type === 'model' ? COLORS.white : COLORS.accent;
            const label = msg.type === 'user' ? 'USER' :
                          msg.type === 'model' ? 'MODEL' : 'OBS';
            return (
              <g key={i} opacity={msgOpacity}>
                {/* Row background for observation */}
                {isObs && (
                  <rect x={80} y={msgY - 8} width={920} height={64} rx={12}
                    fill={COLORS.accent} opacity={0.06} />
                )}
                {/* Type badge */}
                <rect x={100} y={msgY} width={72} height={28} rx={14}
                  fill={isObs ? COLORS.accent : 'rgba(255,255,255,0.08)'}
                  opacity={isObs ? 0.2 : 1} />
                <text x={136} y={msgY + 20} textAnchor="middle"
                  fontFamily={FONT} fontSize={14} fontWeight={800}
                  fill={isObs ? COLORS.accent : COLORS.text_muted}
                  letterSpacing="0.08em">
                  {label}
                </text>
                {/* Message text */}
                <text x={190} y={msgY + 21}
                  fontFamily={FONT} fontSize={28} fontWeight={800}
                  fill={color}>
                  {msg.text}
                </text>
                {/* Pulse ring on observation */}
                {isObs && (
                  <circle cx={136} cy={msgY + 14} r={obsRingR}
                    fill="none" stroke={COLORS.accent} strokeWidth={1.5}
                    opacity={obsRingOp} />
                )}
              </g>
            );
          })}

          {/* Append indicator arrow */}
          <g opacity={interpolate(frame, [44, 50], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })}>
            <line x1={540} y1={1060} x2={540} y2={1090}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
            <polygon points="540,1098 532,1086 548,1086"
              fill={COLORS.accent} opacity={0.4} />
          </g>
        </g>

        {/* ── Bottom cards ───────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1180} w={460} h={160} accent />
          <rect x={60} y={1180} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1250}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Result becomes
          </text>
          <text x={100} y={1300}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            next observation
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1180} w={460} h={160} />
          <text x={600} y={1250}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Appended to
          </text>
          <text x={600} y={1300}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            conversation context
          </text>
        </g>

        {/* Wide bottom card */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY + 8})`}>
          <BentoCard x={60} y={1390} w={960} h={130} />
          <text x={540} y={1468} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Model can now <tspan fill={COLORS.accent} fontStyle="italic">see</tspan> the real-world data
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {[
          { x: 120, y: 1580 }, { x: 960, y: 1600 },
          { x: 340, y: 1640 }, { x: 740, y: 1660 },
          { x: 540, y: 1700 }, { x: 200, y: 1720 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 0.9) * 4}
            r={2.5} fill={COLORS.accent} opacity={0.07 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s17.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
