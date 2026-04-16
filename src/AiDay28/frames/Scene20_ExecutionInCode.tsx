/**
 * Scene 20 — ExecutionInCode
 * "Execution happens in code, outside the model entirely."
 * CSV: 62.980s → 66.440s
 * Duration: 147 frames (4.90s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):   Label + headline springs
 *   Phase 2 (frames 14–80):  Two-region diagram: Model region (left, locked/dim)
 *                             vs Code/System region (right, lit up, active, animated)
 *   Phase 3 (frames 70–end): System-side micro-animations, gear spin,
 *                             code cursor blink, data flow particles
 *
 * Visual: Split-screen — left is the model (dim, passive, locked) and
 *         right is the code/system (bright, active, executing).
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

export const Scene20_ExecutionInCode: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 10);

  // ── Phase 2 — Two-region split ───────────────────────────────────────────

  // Divider line (vertical centre)
  const dividerLen = 700;
  const dividerDash = usePathDraw(frame, 12, dividerLen, 25);

  // MODEL region (left — dim, passive)
  const modelRegion = useSpringEntrance(frame, 14);

  // SYSTEM / CODE region (right — bright, active)
  const sysRegion = useSpringEntrance(frame, 16);

  // Model robot (dim)
  const robotEnter = useSpringEntrance(frame, 18);

  // System gear
  const gearEnter = useSpringEntrance(frame, 20);

  // Code block card
  const codeCard = useSpringEntrance(frame, 26);
  const codePerim = 2 * (400 + 240);
  const codeBorderDash = interpolate(frame, [26, 48], [codePerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Code lines appear staggered
  const codeLines = [
    { text: 'result = search(', delay: 30 },
    { text: '  query="tool calling"', delay: 34 },
    { text: ')', delay: 37 },
    { text: 'return result', delay: 40 },
  ];

  // DATA keyword block
  const dataCard = useSpringEntrance(frame, 44);

  // Labels: "PASSIVE" and "ACTIVE"
  const passiveLabel = useSpringEntrance(frame, 48);
  const activeLabel = useSpringEntrance(frame, 50);

  // Lock icon on model side
  const lockEnter = spring({ frame: Math.max(0, frame - 36), fps, config: SPRING_SNAP });
  const lockOp = interpolate(lockEnter, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Bottom cards
  const card1 = useSpringEntrance(frame, 56);
  const card2 = useSpringEntrance(frame, 62);
  const card3 = useSpringEntrance(frame, 68);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Gear rotation
  const gearRotation = frame * 1.2;

  // Code cursor blink
  const cursorOn = Math.sin(frame * 0.2) > 0;

  // Data flow particles (from system side downward)
  const dataParticles = Array.from({ length: 5 }, (_, i) => {
    const yOffset = ((frame * 3 + i * 40) % 200);
    return {
      x: 740 + Math.sin(i * 1.2) * 30,
      y: 600 + yOffset,
      opacity: frame > 50 ? interpolate(yOffset, [0, 100, 200], [0, 0.3, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      }) : 0,
    };
  });

  // Activity ring on system side
  const actRing = interpolate((frame % 60) / 60, [0, 1], [0, 220]);
  const actRingOp = interpolate((frame % 60) / 60, [0, 0.5, 1], [0.2, 0.1, 0]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · EXECUTION" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Execution In Code
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={350}
            fontFamily={FONT} fontSize={46} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Outside the model entirely
          </text>
        </g>

        {/* ── ZONE C — Split diagram ─────────────────────────────────────── */}

        {/* Vertical divider */}
        <line x1={540} y1={440} x2={540} y2={1140}
          stroke="rgba(255,255,255,0.2)" strokeWidth={2}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
          strokeLinecap="round" />

        {/* ── LEFT REGION — MODEL (dim, passive) ─────────────────────── */}
        <g opacity={modelRegion.opacity * 0.5}>
          {/* Region bg */}
          <rect x={60} y={440} width={460} height={700} rx={20}
            fill={COLORS.bg_secondary} opacity={0.3} />
          {/* "MODEL" header */}
          <text x={290} y={490} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.15em" opacity={0.6}>
            MODEL
          </text>
        </g>

        {/* Robot (dim, passive) */}
        <g opacity={robotEnter.opacity * 0.4}
           transform={`translate(${robotEnter.translateY * 0.5}, ${robotEnter.translateY})`}>
          {/* Head */}
          <rect x={248} y={550} width={84} height={66} rx={12}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
          <circle cx={272} cy={576} r={6} fill={COLORS.text_muted} opacity={0.4} />
          <circle cx={308} cy={576} r={6} fill={COLORS.text_muted} opacity={0.4} />
          <line x1={276} y1={598} x2={304} y2={598}
            stroke={COLORS.text_muted} strokeWidth={2} opacity={0.3} />
          {/* Body */}
          <rect x={252} y={626} width={76} height={80} rx={8}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
          {/* Arms hanging (passive) */}
          <line x1={252} y1={640} x2={220} y2={690}
            stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" opacity={0.4} />
          <line x1={328} y1={640} x2={360} y2={690}
            stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" opacity={0.4} />
          {/* Legs */}
          <line x1={272} y1={706} x2={272} y2={746}
            stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
          <line x1={308} y1={706} x2={308} y2={746}
            stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
        </g>

        {/* Lock icon on model */}
        <g opacity={lockOp} transform={`translate(290, 800)`}>
          <rect x={-16} y={-4} width={32} height={24} rx={4}
            fill={COLORS.text_muted} opacity={0.3} />
          <path d="M -10,-4 L -10,-14 C -10,-22 10,-22 10,-14 L 10,-4"
            fill="none" stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.4} />
        </g>

        {/* "PASSIVE" label */}
        <g opacity={passiveLabel.opacity} transform={`translate(0, ${passiveLabel.translateY})`}>
          <rect x={220} y={860} width={140} height={36} rx={18}
            fill="rgba(255,255,255,0.06)" />
          <text x={290} y={886} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            PASSIVE
          </text>
        </g>

        {/* ── RIGHT REGION — SYSTEM / CODE (bright, active) ──────────── */}
        <g opacity={sysRegion.opacity}>
          {/* Region bg */}
          <rect x={560} y={440} width={460} height={700} rx={20}
            fill={COLORS.bg_secondary} opacity={0.5} />
          <rect x={560} y={440} width={460} height={700} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3} />
          {/* "SYSTEM CODE" header */}
          <text x={790} y={490} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            SYSTEM CODE
          </text>
        </g>

        {/* Activity ring */}
        <circle cx={790} cy={700} r={actRing}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={frame > 50 ? actRingOp : 0} />

        {/* Gear (spinning) */}
        <g opacity={gearEnter.opacity}
           transform={`translate(790, 590) rotate(${gearRotation})`}
           style={{ transformOrigin: '0px 0px' }}>
          {/* Gear teeth */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const innerR = 28;
            const outerR = 40;
            return (
              <line key={i}
                x1={Math.cos(a) * innerR} y1={Math.sin(a) * innerR}
                x2={Math.cos(a) * outerR} y2={Math.sin(a) * outerR}
                stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round" />
            );
          })}
          <circle cx={0} cy={0} r={28} fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={0} cy={0} r={10} fill={COLORS.accent} opacity={0.3} />
        </g>

        {/* Code block */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <rect x={590} y={660} width={400} height={240} rx={14}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={codePerim} strokeDashoffset={codeBorderDash} />
          {/* Terminal header dots */}
          <circle cx={612} cy={680} r={4} fill={COLORS.vibrant_red} opacity={0.6} />
          <circle cx={628} cy={680} r={4} fill={COLORS.accent} opacity={0.4} />
          <circle cx={644} cy={680} r={4} fill={COLORS.text_muted} opacity={0.4} />
          {/* Code lines */}
          {codeLines.map((line, i) => {
            const lineOp = interpolate(frame, [line.delay, line.delay + 6], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <text key={i} x={618} y={720 + i * 44}
                fontFamily="'Fira Code', 'Courier New', monospace"
                fontSize={24} fontWeight={500}
                fill={i === 3 ? COLORS.accent : COLORS.text_muted}
                opacity={lineOp}>
                {line.text}
              </text>
            );
          })}
          {/* Cursor blink */}
          {cursorOn && frame > 40 && (
            <rect x={618 + 24 * 13} y={712 + 3 * 44 - 18} width={2} height={22}
              fill={COLORS.accent} opacity={0.8} />
          )}
        </g>

        {/* Data flow particles */}
        {dataParticles.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={2}
            fill={COLORS.accent} opacity={pt.opacity} />
        ))}

        {/* "ACTIVE" label */}
        <g opacity={activeLabel.opacity} transform={`translate(0, ${activeLabel.translateY})`}>
          <rect x={720} y={930} width={140} height={36} rx={18}
            fill={COLORS.accent} opacity={0.15} />
          <text x={790} y={956} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            ACTIVE
          </text>
        </g>

        {/* ── Bottom cards — summary ─────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1200} w={300} h={140} />
          <rect x={60} y={1200} width={6} height={140} rx={3}
            fill={COLORS.text_muted} />
          <text x={100} y={1260}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Model
          </text>
          <text x={100} y={1305}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} fontStyle="italic">
            decides
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={390} y={1200} w={300} h={140} accent />
          <rect x={390} y={1200} width={6} height={140} rx={3}
            fill={COLORS.accent} />
          <text x={430} y={1260}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Code
          </text>
          <text x={430} y={1305}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            executes
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={720} y={1200} w={300} h={140} />
          <text x={760} y={1260}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Complete
          </text>
          <text x={760} y={1305}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} fontStyle="italic">
            separation
          </text>
        </g>

        {/* Wide accent card */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY + 6})`}>
          <BentoCard x={60} y={1390} w={960} h={120} accent />
          <text x={540} y={1462} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Execution is <tspan fill={COLORS.accent} fontStyle="italic">outside</tspan> the model entirely
          </text>
        </g>

        {/* ── Floating motes ─────────────────────────────────────────── */}
        {[
          { x: 100, y: 1570 }, { x: 980, y: 1590 },
          { x: 320, y: 1630 }, { x: 760, y: 1650 },
          { x: 540, y: 1690 }, { x: 180, y: 1720 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.05 + i * 0.7) * 3}
            r={2} fill={COLORS.accent}
            opacity={0.06 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s20.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
