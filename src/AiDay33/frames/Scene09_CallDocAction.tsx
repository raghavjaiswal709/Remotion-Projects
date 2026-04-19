/**
 * Scene 09 — Call Doc Action
 * "Call the document reader. That is the action."
 * CSV: 28.480s → 31.800s
 * Duration: 106 frames (3.5s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–22): Label + headline spring
 *   Phase 2 (frames 18–70): Tool call diagram — agent box → arrow → tool box → document
 *   Phase 3 (frames 60–end): Pulse on tool, breathing on document
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

export const Scene09_CallDocAction: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const agentBox = useSpringEntrance(frame, 18);
  const arrow1Dash = usePathDraw(frame, 30, 140, 20);
  const toolBox = useSpringEntrance(frame, 35);
  const arrow2Dash = usePathDraw(frame, 48, 140, 20);
  const docBox = useSpringEntrance(frame, 52);

  // Tool gear animation
  const gearSpin = frame > 40 ? (frame - 40) * 1.5 : 0;

  // Document lines stagger
  const docLines = [0, 1, 2, 3, 4].map(i => useSpringEntrance(frame, 56 + i * 4));

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // Action badge
  const actionBadge = useSpringEntrance(frame, 60);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="STEP EXAMPLE · ACTION" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Call the Tool
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Document Reader
          </text>
        </g>

        {/* ── ZONE C — Tool call flow ─────────────────────────────────── */}

        {/* Agent box */}
        <g opacity={agentBox.opacity} transform={`translate(0, ${agentBox.translateY})`}>
          <BentoCard x={60} y={480} w={280} h={200} accent />
          {/* Robot head */}
          <rect x={150} y={520} width={100} height={80} rx={12} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={180} cy={555} r={10} fill={COLORS.accent} />
          <circle cx={220} cy={555} r={10} fill={COLORS.accent} />
          <rect x={185} y={580} width={30} height={4} rx={2} fill={COLORS.accent} opacity={0.6} />
          {/* Antenna */}
          <line x1={200} y1={520} x2={200} y2={500} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={200} cy={496} r={4} fill={COLORS.accent} />
          <text x={200} y={640} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            AGENT
          </text>
        </g>

        {/* Arrow 1: Agent → Tool */}
        <path d="M 340,580 L 420,580"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={140} strokeDashoffset={arrow1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />
        <text x={380} y={560} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
          fill={COLORS.text_muted} opacity={toolBox.opacity * 0.7}>
          CALL
        </text>

        {/* Tool box with gear */}
        <g opacity={toolBox.opacity} transform={`translate(0, ${toolBox.translateY})`}>
          <BentoCard x={420} y={480} w={280} h={200} accent />

          {/* Gear icon */}
          <g transform={`translate(560, 545) rotate(${gearSpin})`} style={{ transformOrigin: '0px 0px' }}>
            {/* Outer ring */}
            <circle cx={0} cy={0} r={35} fill="none" stroke={COLORS.accent} strokeWidth={3} />
            {/* Inner circle */}
            <circle cx={0} cy={0} r={14} fill={COLORS.accent} fillOpacity={0.3} stroke={COLORS.accent} strokeWidth={2} />
            {/* Teeth */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
              const rad = (deg * Math.PI) / 180;
              return (
                <rect key={deg}
                  x={Math.cos(rad) * 33 - 5}
                  y={Math.sin(rad) * 33 - 5}
                  width={10} height={10} rx={2}
                  fill={COLORS.accent}
                  transform={`rotate(${deg}, ${Math.cos(rad) * 33}, ${Math.sin(rad) * 33})`}
                />
              );
            })}
          </g>

          <text x={560} y={640} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            TOOL
          </text>
        </g>

        {/* Arrow 2: Tool → Document */}
        <path d="M 700,580 L 780,580"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={140} strokeDashoffset={arrow2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />
        <text x={740} y={560} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
          fill={COLORS.text_muted} opacity={docBox.opacity * 0.7}>
          READ
        </text>

        {/* Document box */}
        <g opacity={docBox.opacity} transform={`translate(0, ${docBox.translateY})`}>
          <BentoCard x={780} y={480} w={240} h={200} />
          {/* Document icon */}
          <rect x={845} y={510} width={110} height={130} rx={8}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
          {/* Folded corner */}
          <path d="M 930,510 L 955,510 L 955,535 Z" fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          {/* Text lines in document */}
          {docLines.map((ent, i) => (
            <line key={i}
              x1={860} y1={545 + i * 18}
              x2={860 + (i < 3 ? 80 : 50)} y2={545 + i * 18}
              stroke={i === 0 ? COLORS.accent : COLORS.text_muted}
              strokeWidth={2.5} opacity={ent.opacity * 0.6}
              strokeLinecap="round"
            />
          ))}
          <text x={900} y={660} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            DOC
          </text>
        </g>

        {/* ACTION badge */}
        <g opacity={actionBadge.opacity} transform={`translate(0, ${actionBadge.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={240} accent />
          <rect x={60} y={740} width={6} height={240} rx={3} fill={COLORS.accent} />
          <text x={100} y={810} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} letterSpacing="0.12em">
            ACTION
          </text>
          <text x={100} y={870} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            The agent decides to call a tool
          </text>
          <text x={100} y={930} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            This is the step's output half
          </text>
        </g>

        {/* Summary strip at bottom */}
        <g opacity={actionBadge.opacity * 0.9} transform={`translate(0, ${actionBadge.translateY * 0.3})`}>
          <BentoCard x={60} y={1040} w={960} h={100} />
          <text x={540} y={1100} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Observation in → <tspan fill={COLORS.accent} fontStyle="italic">Action out</tspan> → Step complete
          </text>
        </g>

        {/* Floating micro-elements */}
        <circle cx={180} cy={1300 + breathe} r={4} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={860} cy={1350 + breathe * 1.2} r={3} fill={COLORS.accent} opacity={0.15} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
