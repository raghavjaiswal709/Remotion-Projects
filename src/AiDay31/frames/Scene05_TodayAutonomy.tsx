/**
 * Scene 05 — Today Autonomy
 * "Today, we define autonomy."
 * CSV: 13.280s → 15.140s | Duration: 86 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring entrance
 *   Phase 2 (20–65): Robot with gears, autonomy concept intro
 *   Phase 3 (55–end): Micro pulses
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene05_TodayAutonomy: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const mainCard = useSpringEntrance(frame, 18);
  const sideCardA = useSpringEntrance(frame, 30);
  const sideCardB = useSpringEntrance(frame, 42);
  const bottomRow = useSpringEntrance(frame, 52);

  // Robot outline
  const robotPath = 600;
  const robotDash = usePathDraw(frame, 20, robotPath, 35);

  // Gear rotation
  const gearAngle = interpolate(frame, [0, 86], [0, 180], { extrapolateRight: 'clamp' });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  // Gear teeth path helper
  const gearPath = (cx: number, cy: number, r: number, teeth: number) => {
    let d = '';
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.4) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a4 = ((i + 0.9) / teeth) * Math.PI * 2;
      const outerR = r + 12;
      d += `${i === 0 ? 'M' : 'L'} ${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r} `;
      d += `L ${cx + Math.cos(a2) * outerR},${cy + Math.sin(a2) * outerR} `;
      d += `L ${cx + Math.cos(a3) * outerR},${cy + Math.sin(a3) * outerR} `;
      d += `L ${cx + Math.cos(a4) * r},${cy + Math.sin(a4) * r} `;
    }
    return d + 'Z';
  };

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="MODULE 5 · AUTONOMY" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Today:
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={96} fontWeight={800}
            fontStyle="italic" fill={COLORS.accent}>
            Autonomy
          </text>
        </g>

        {/* ── ZONE C — Robot + gear illustration ──────────────────────────── */}
        <g opacity={mainCard.opacity} transform={`translate(0, ${mainCard.translateY})`}>
          <BentoCard x={60} y={520} w={620} h={560} accent />

          {/* Robot head */}
          <rect x={200} y={600} width={240} height={200} rx={30}
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={robotPath} strokeDashoffset={robotDash} />
          {/* Eyes */}
          <circle cx={280} cy={690} r={16} fill={COLORS.accent}
            opacity={interpolate(frame % 60, [0, 3, 6], [1, 0.2, 1], { extrapolateRight: 'clamp' })} />
          <circle cx={360} cy={690} r={16} fill={COLORS.accent}
            opacity={interpolate(frame % 60, [0, 3, 6], [1, 0.2, 1], { extrapolateRight: 'clamp' })} />
          {/* Antenna */}
          <line x1={320} y1={600} x2={320} y2={560}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <circle cx={320} cy={550} r={8} fill={COLORS.accent} opacity={shimmer} />

          {/* Robot body */}
          <rect x={220} y={820} width={200} height={180} rx={16}
            fill="none" stroke={COLORS.accent} strokeWidth={3} />
          {/* Arms */}
          <line x1={220} y1={870} x2={160} y2={930}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <line x1={420} y1={870} x2={480} y2={930}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          {/* Chest icon — lightning bolt */}
          <path d="M 310,860 L 290,900 L 320,900 L 300,950"
            fill="none" stroke={COLORS.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Gear cards */}
        <g opacity={sideCardA.opacity} transform={`translate(0, ${sideCardA.translateY})`}>
          <BentoCard x={720} y={520} w={300} h={260} />
          <g transform={`translate(870, ${650 + breathe}) rotate(${gearAngle})`}
            style={{ transformOrigin: '0px 0px' }}>
            <path d={gearPath(0, 0, 50, 8)}
              fill="none" stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={0} cy={0} r={18} fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          </g>
          <text x={870} y={728} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.white}>
            SELF-DRIVEN
          </text>
        </g>

        <g opacity={sideCardB.opacity} transform={`translate(0, ${sideCardB.translateY})`}>
          <BentoCard x={720} y={800} w={300} h={280} accent />
          <g transform={`translate(870, ${930 + breathe * -0.7}) rotate(${-gearAngle * 0.6})`}
            style={{ transformOrigin: '0px 0px' }}>
            <path d={gearPath(0, 0, 40, 6)}
              fill="none" stroke={COLORS.accent} strokeWidth={3} opacity={0.6} />
            <circle cx={0} cy={0} r={14} fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          </g>
          <text x={870} y={1018} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.accent}>
            DECISION
          </text>
          <text x={870} y={1050} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.accent}>
            MAKING
          </text>
        </g>

        {/* Bottom row */}
        <g opacity={bottomRow.opacity} transform={`translate(0, ${bottomRow.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={180} />
          <rect x={60} y={1120} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={120} y={1200} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            How much freedom does the agent have?
          </text>
          <text x={120} y={1255} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            We define a spectrum — not a binary switch.
          </text>
        </g>

        {/* Decorative connectors */}
        <line x1={540} y1={1340} x2={540} y2={1420}
          stroke={COLORS.accent} strokeWidth={2} opacity={0.15}
          strokeDasharray="6 6" />
        {[0, 1, 2].map(i => (
          <circle key={i} cx={440 + i * 100} cy={1460 + Math.sin(frame * 0.07 + i) * 8}
            r={5} fill={COLORS.accent} opacity={0.15 * shimmer} />
        ))}

        {/* Additional emphasis elements */}
        <g opacity={interpolate(frame, [60, 75], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1550} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            From zero control to full independence
          </text>
        </g>

        {/* Floating accent ring */}
        <g transform={`translate(540, ${1650 + breathe})`}>
          <circle cx={0} cy={0} r={35} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={35} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.3} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
