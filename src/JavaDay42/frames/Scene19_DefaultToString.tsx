/**
 * Scene 19 — Default ToString
 * "The default toString returns Train@4a3b2c, meaningless."
 * CSV: 82.200s → 89.700s
 * Duration: 225 frames (7.5s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring in
 *   Phase 2 (frames 14–80):  Object glyph → toString() → ugly output
 *   Phase 3 (frames 70–end): Micro-animations, code block, override teaser
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
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene19_DefaultToString: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 5);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const objBox   = useSpringEntrance(frame, 14);
  const arrowDash = usePathDraw(frame, 24, 200, 22);
  const outputBox = useSpringEntrance(frame, 32);

  // Typewriter for ugly output
  const fullOutput = 'Train@4a3b2c';
  const charsVis = Math.floor(interpolate(frame, [38, 38 + fullOutput.length * 2], [0, fullOutput.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  const typeText = fullOutput.slice(0, charsVis);

  // Code block
  const codeEnt  = useSpringEntrance(frame, 44);
  const codeLines = [
    { text: '// What you see by default:', kw: false },
    { text: 'System.out.println(train);', kw: true },
    { text: '→ Train@4a3b2c', kw: false },
    { text: '', kw: false },
    { text: '// class@hexHash — NOT useful', kw: false },
  ];

  // vs card
  const vsEnt = useSpringEntrance(frame, 60);

  // Meaning card
  const meanEnt = useSpringEntrance(frame, 68);

  // Explanation card
  const explEnt = useSpringEntrance(frame, 76);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="toString() · DEFAULT" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={270} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Meaningless
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={350} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.accent}>
            Output
          </text>
        </g>

        {/* ── Object → arrow → output ─────────────────────────────────── */}
        {/* Object box */}
        <g opacity={objBox.opacity} transform={`translate(0, ${objBox.translateY})`}>
          <BentoCard x={60} y={430} w={280} h={140} accent />
          <text x={200} y={510} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Train
          </text>
          {/* Little train icon */}
          <rect x={120} y={450} width={60} height={30} rx={6} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={140} cy={490} r={8} fill={COLORS.accent} fillOpacity={0.5} />
          <circle cx={165} cy={490} r={8} fill={COLORS.accent} fillOpacity={0.5} />
        </g>

        {/* Arrow */}
        <line x1={340} y1={500} x2={540} y2={500}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={200} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <text x={440} y={484} textAnchor="middle"
          fontFamily={MONO} fontSize={22} fontWeight={800} fill={COLORS.accent}
          opacity={outputBox.opacity}>.toString()</text>

        {/* Output box */}
        <g opacity={outputBox.opacity} transform={`translate(0, ${outputBox.translateY})`}>
          <BentoCard x={560} y={430} w={460} h={140} />
          <rect x={560} y={430} width={6} height={140} rx={3} fill={COLORS.vibrant_red} />
          <text x={590} y={510} fontFamily={MONO} fontSize={32} fontWeight={800}
            fill={COLORS.vibrant_red}>{typeText}</text>
          {/* Cursor blink */}
          {charsVis < fullOutput.length && frame % 16 < 8 && (
            <rect x={590 + charsVis * 19} y={486} width={2} height={28} fill={COLORS.vibrant_red} />
          )}
        </g>

        {/* ── Code block ──────────────────────────────────────────────── */}
        <g opacity={codeEnt.opacity} transform={`translate(0, ${codeEnt.translateY})`}>
          <BentoCard x={60} y={610} w={960} h={310} />
          <rect x={60} y={610} width={6} height={310} rx={3} fill={COLORS.accent} />
          {codeLines.map((l, i) => (
            <text key={i} x={100} y={660 + i * 52}
              fontFamily={MONO} fontSize={26} fontWeight={500}
              fill={l.kw ? COLORS.accent : COLORS.text_muted}>{l.text}</text>
          ))}
        </g>

        {/* ── VS comparison ───────────────────────────────────────────── */}
        <g opacity={vsEnt.opacity} transform={`translate(0, ${vsEnt.translateY})`}>
          <BentoCard x={60} y={950} w={460} h={200} />
          <rect x={60} y={950} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={1000} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>DEFAULT</text>
          <text x={100} y={1050} fontFamily={MONO} fontSize={24} fontWeight={500}
            fill={COLORS.text_muted}>Train@4a3b2c</text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Class name + hex hash</text>

          <BentoCard x={560} y={950} w={460} h={200} accent />
          <rect x={560} y={950} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={600} y={1000} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>OVERRIDDEN</text>
          <text x={600} y={1050} fontFamily={MONO} fontSize={24} fontWeight={500}
            fill={COLORS.white}>Express 42 → Delhi</text>
          <text x={600} y={1100} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Meaningful, readable</text>
        </g>

        {/* ── Meaning card ────────────────────────────────────────────── */}
        <g opacity={meanEnt.opacity} transform={`translate(0, ${meanEnt.translateY})`}>
          <BentoCard x={60} y={1190} w={960} h={120} />
          <text x={100} y={1262} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            @ = class name + memory hash = no real info
          </text>
        </g>

        {/* ── Explanation card ─────────────────────────────────────────── */}
        <g opacity={explEnt.opacity} transform={`translate(0, ${explEnt.translateY})`}>
          <BentoCard x={60} y={1350} w={960} h={120} />
          <text x={100} y={1422} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>
            Override toString() to print what matters
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
