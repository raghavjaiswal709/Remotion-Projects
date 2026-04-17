/**
 * Scene 08 — java.lang.Object
 * "That parent is java.lang.Object."
 * CSV: 28.380s → 32.340s
 * Duration: 119 frames (3.97s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline
 *   Phase 2 (frames 18–70):  Package path "java.lang.Object" with dot separators, class icon
 *   Phase 3 (frames 60–end): Glow pulse, floating particles
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene08_JavaLangObject: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 5);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 — package path segments ────────────────────────────────────────
  const seg1 = useSpringEntrance(frame, 16); // java
  const dot1 = useSpringEntrance(frame, 22); // .
  const seg2 = useSpringEntrance(frame, 26); // lang
  const dot2 = useSpringEntrance(frame, 32); // .
  const seg3 = useSpringEntrance(frame, 36); // Object

  // ── Class diagram box ──────────────────────────────────────────────────────
  const classBox = useSpringEntrance(frame, 40);
  const methodCards = [
    useSpringEntrance(frame, 48),
    useSpringEntrance(frame, 54),
    useSpringEntrance(frame, 60),
  ];

  // ── Connector path ─────────────────────────────────────────────────────────
  const connLen = 120;
  const connDash = usePathDraw(frame, 44, connLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 4;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glow     = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.6, 1]);

  // ── Border draw ────────────────────────────────────────────────────────────
  const boxPerim = 2 * (800 + 320);
  const boxBorder = interpolate(frame, [40, 68], [boxPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  const segments = [
    { text: 'java', ent: seg1, color: COLORS.text_muted },
    { text: '.', ent: dot1, color: COLORS.text_muted },
    { text: 'lang', ent: seg2, color: COLORS.text_muted },
    { text: '.', ent: dot2, color: COLORS.text_muted },
    { text: 'Object', ent: seg3, color: COLORS.accent },
  ];

  const methods = [
    { name: 'toString()', desc: 'String representation' },
    { name: 'equals(Object)', desc: 'Value comparison' },
    { name: 'hashCode()', desc: 'Hash for collections' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 2 · THE ROOT CLASS" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            That Parent Is
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            java.lang.Object
          </text>
        </g>

        {/* ── Package path breadcrumb ─────────────────────────────────────── */}
        {(() => {
          let xOff = 140;
          return segments.map((s, i) => {
            const el = (
              <g key={i} opacity={s.ent.opacity}
                transform={`translate(0, ${s.ent.translateY})`}>
                <text x={xOff} y={540} fontFamily={MONO} fontSize={48} fontWeight={500}
                  fill={s.color}>
                  {s.text}
                </text>
              </g>
            );
            xOff += s.text.length * 30;
            return el;
          });
        })()}

        {/* ── Underline accent ────────────────────────────────────────────── */}
        <rect x={140} y={556} width={interpolate(seg3.progress, [0, 1], [0, 700])}
          height={3} rx={1.5} fill={COLORS.accent} fillOpacity={0.4} />

        {/* ── Connector ───────────────────────────────────────────────────── */}
        <path d="M 540,580 L 540,660"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={connLen} strokeDashoffset={connDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Class diagram box ───────────────────────────────────────────── */}
        <g opacity={classBox.opacity} transform={`translate(0, ${classBox.translateY})`}>
          <rect x={140} y={680} width={800} height={320} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={boxPerim} strokeDashoffset={boxBorder} />
          <BentoCard x={140} y={680} w={800} h={320} accent />

          {/* Header */}
          <rect x={140} y={680} width={800} height={56} rx={20}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={540} y={718} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            java.lang.Object
          </text>
          <line x1={180} y1={740} x2={900} y2={740}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

          {/* Methods */}
          {methods.map((m, i) => (
            <g key={i} opacity={methodCards[i].opacity}
              transform={`translate(0, ${methodCards[i].translateY})`}>
              <circle cx={200} cy={780 + i * 76} r={7}
                fill={COLORS.accent} fillOpacity={0.6} />
              <text x={220} y={788 + i * 76} fontFamily={MONO} fontSize={30} fontWeight={500}
                fill={COLORS.white}>
                {m.name}
              </text>
              <text x={600} y={788 + i * 76} fontFamily={FONT} fontSize={26} fontWeight={800}
                fill={COLORS.text_muted}>
                {m.desc}
              </text>
            </g>
          ))}
        </g>

        {/* ── Ghost text behind ───────────────────────────────────────────── */}
        <text x={540} y={1140} textAnchor="middle"
          fontFamily={FONT} fontSize={200} fontWeight={800}
          fill={COLORS.accent} opacity={0.04 * shimmer}>
          Object
        </text>

        {/* ── Info cards ──────────────────────────────────────────────────── */}
        <g opacity={methodCards[2].opacity} transform={`translate(0, ${methodCards[2].translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={160} />
          <text x={100} y={1140} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Available in
          </text>
          <text x={100} y={1180} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            every Java class
          </text>

          <BentoCard x={560} y={1080} w={460} h={160} accent />
          <text x={600} y={1140} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Since Java
          </text>
          <text x={600} y={1180} fontFamily={FONT} fontSize={54} fontWeight={800}
            fill={COLORS.accent}>
            1.0
          </text>
        </g>

        {/* ── Pulse rings ─────────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1400 + breathe})`} opacity={0.1 * glow}>
          <circle cx={0} cy={0} r={60} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={100} fill="none"
            stroke={COLORS.accent} strokeWidth={1} opacity={0.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Floating accents ────────────────────────────────────────────── */}
        <circle cx={100} cy={600 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.2} />
        <circle cx={980} cy={750 - breathe * 0.5} r={2.5} fill={COLORS.accent} fillOpacity={0.15} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
