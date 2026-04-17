/**
 * Scene 04 — Compile Time Polymorphism
 * "Today, we learn compile time polymorphism."
 * CSV: 17.960s → 21.200s
 * Duration: ~107 frames
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring in
 *   Phase 2 (frames 20–80):  Gear illustration + concept card build
 *   Phase 3 (frames 70–end): Gear rotation, pulse accents
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

// Generate gear tooth path
function gearPath(cx: number, cy: number, innerR: number, outerR: number, teeth: number): string {
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const angle1 = (i / teeth) * Math.PI * 2;
    const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const angle3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const angle4 = ((i + 0.8) / teeth) * Math.PI * 2;
    points.push(`${cx + innerR * Math.cos(angle1)},${cy + innerR * Math.sin(angle1)}`);
    points.push(`${cx + outerR * Math.cos(angle2)},${cy + outerR * Math.sin(angle2)}`);
    points.push(`${cx + outerR * Math.cos(angle3)},${cy + outerR * Math.sin(angle3)}`);
    points.push(`${cx + innerR * Math.cos(angle4)},${cy + innerR * Math.sin(angle4)}`);
  }
  return `M ${points[0]} L ${points.slice(1).join(' L ')} Z`;
}

export const Scene04_CompileTimePoly: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const gearEntrance = useSpringEntrance(frame, 20);
  const card1 = useSpringEntrance(frame, 30);
  const card2 = useSpringEntrance(frame, 42);
  const card3 = useSpringEntrance(frame, 54);
  const badgeEntrance = useSpringEntrance(frame, 66);

  const gearPerim = 600;
  const gearDash = usePathDraw(frame, 20, gearPerim, 35);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const gearRotation = frame * 0.4;
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 3 · POLYMORPHISM" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Compile-Time
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Polymorphism
          </text>
        </g>

        {/* ── ZONE C — Gear illustration ───────────────────────────── */}
        <g opacity={gearEntrance.opacity} transform={`translate(0, ${gearEntrance.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={500} accent />

          {/* Large gear */}
          <g transform={`translate(360, 730) rotate(${gearRotation})`} style={{ transformOrigin: '0px 0px' }}>
            <path d={gearPath(0, 0, 100, 140, 10)}
              fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={gearPerim} strokeDashoffset={gearDash} />
            <circle cx={0} cy={0} r={50} fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
            <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
              javac
            </text>
          </g>

          {/* Small gear meshed */}
          <g transform={`translate(560, 660) rotate(${-gearRotation * 1.6})`} style={{ transformOrigin: '0px 0px' }}>
            <path d={gearPath(0, 0, 55, 80, 8)}
              fill={COLORS.accent_dim} stroke={COLORS.accent_mid} strokeWidth={2} />
            <circle cx={0} cy={0} r={28} fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={2} />
          </g>

          {/* Arrow from gears to label */}
          <line x1={640} y1={700} x2={780} y2={700}
            stroke={COLORS.accent} strokeWidth={2.5} markerEnd="url(#arrow)" />

          <text x={800} y={680} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Decided at
          </text>
          <text x={800} y={730} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Compile Time
          </text>
          <text x={800} y={780} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Not at runtime
          </text>

          {/* Java .class output */}
          <rect x={160} y={880} width={200} height={70} rx={12}
            fill={COLORS.bg_primary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
          <text x={260} y={925} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            .java
          </text>
          <line x1={360} y1={915} x2={460} y2={915}
            stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)" />
          <rect x={460} y={880} width={200} height={70} rx={12}
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={560} y={925} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={500} fill={COLORS.accent}>
            .class
          </text>
        </g>

        {/* Three concept cards below */}
        {[
          { label: 'SAME NAME', desc: 'Methods share a name', delay: card1 },
          { label: 'DIFF PARAMS', desc: 'Different parameter lists', delay: card2 },
          { label: 'COMPILE PICK', desc: 'Compiler selects version', delay: card3 },
        ].map((item, i) => {
          const cardX = 60 + i * 320;
          return (
            <g key={i} opacity={item.delay.opacity} transform={`translate(0, ${item.delay.translateY})`}>
              <BentoCard x={cardX} y={1020} w={300} h={200} accent={i === 2} />
              <text x={cardX + 150} y={1090} textAnchor="middle"
                fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={i === 2 ? COLORS.accent : COLORS.white}>
                {item.label}
              </text>
              <text x={cardX + 150} y={1140} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
                {item.desc}
              </text>
              {/* Dot accent */}
              <circle cx={cardX + 150} cy={1180} r={6}
                fill={COLORS.accent} opacity={shimmer} />
            </g>
          );
        })}

        {/* Bottom badge */}
        <g opacity={badgeEntrance.opacity} transform={`translate(0, ${badgeEntrance.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={140} accent />
          <text x={540} y={1340} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Method Overloading
          </text>
          <text x={540} y={1380} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            = Compile-Time Polymorphism
          </text>
        </g>

        {/* Floating accents */}
        {[
          { x: 200, y: 1480, r: 24 },
          { x: 880, y: 1520, r: 18 },
          { x: 540, y: 1560, r: 30 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y + breathe * (1 + i * 0.2)})`}>
            <circle cx={0} cy={0} r={p.r} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
            <circle cx={0} cy={0} r={p.r} fill="none" stroke={COLORS.accent_mid} strokeWidth={1.5}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          </g>
        ))}

        {/* Connector lines between concept cards */}
        <line x1={360} y1={1120} x2={380} y2={1120}
          stroke={COLORS.accent_mid} strokeWidth={1.5}
          strokeDasharray="6 4" opacity={card2.opacity * 0.5} />
        <line x1={680} y1={1120} x2={700} y2={1120}
          stroke={COLORS.accent_mid} strokeWidth={1.5}
          strokeDasharray="6 4" opacity={card3.opacity * 0.5} />

        {/* ── CAPTION ──────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
