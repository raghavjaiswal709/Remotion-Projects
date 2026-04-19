/**
 * Scene 06 — Start to Finish
 * "from start to finish."
 * CSV: 20.240s → 21.980s
 * Duration: 53 frames (1.77s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline spring
 *   Phase 2 (10–35): Start→Finish arrow path-draw, bento cards
 *   Phase 3 (30–end): Pulse on endpoints, shimmer
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene06_StartToFinish: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 4);

  // ── Phase 2 ──
  const startCard = useSpringEntrance(frame, 8);
  const finishCard = useSpringEntrance(frame, 14);
  const arrowLen = 600;
  const arrowDash = usePathDraw(frame, 12, arrowLen, 20);

  // Middle events
  const midEvents = useSpringEntrance(frame, 18);

  // ── Phase 3 ──
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 4;

  // Start/finish glow
  const startGlow = 0.3 + Math.sin(frame * 0.12) * 0.15;
  const finishGlow = 0.3 + Math.sin(frame * 0.12 + Math.PI) * 0.15;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 5 · TRAJECTORY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            From Start
          </text>
          <text x={60} y={420} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}>
            to Finish
          </text>
        </g>

        {/* ── ZONE C — Large horizontal arrow with endpoint cards ── */}
        {/* START card */}
        <g opacity={startCard.opacity} transform={`translate(0, ${startCard.translateY})`}>
          <BentoCard x={60} y={540} w={380} h={360} accent />
          {/* Large circle node */}
          <circle cx={250} cy={660} r={60}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={4} />
          <circle cx={250} cy={660} r={72} fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} opacity={startGlow}
            transform={`scale(${pulse})`} style={{ transformOrigin: '250px 660px' }} />
          <text x={250} y={672} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            START
          </text>
          <text x={250} y={780} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            User gives goal
          </text>
          <text x={250} y={820} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Agent begins work
          </text>
          {/* Flag icon */}
          <rect x={220} y={840} width={4} height={40} fill={COLORS.accent} opacity={0.5} />
          <polygon points="224,840 260,855 224,870" fill={COLORS.accent} opacity={0.3} />
        </g>

        {/* FINISH card */}
        <g opacity={finishCard.opacity} transform={`translate(0, ${finishCard.translateY})`}>
          <BentoCard x={640} y={540} w={380} h={360} accent />
          <circle cx={830} cy={660} r={60}
            fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={4} />
          <circle cx={830} cy={660} r={72} fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} opacity={finishGlow}
            transform={`scale(${pulse})`} style={{ transformOrigin: '830px 660px' }} />
          <text x={830} y={672} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            FINISH
          </text>
          <text x={830} y={780} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Output delivered
          </text>
          <text x={830} y={820} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Task complete
          </text>
          {/* Checkmark */}
          <path d="M 810,850 L 825,865 L 855,835" fill="none"
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        </g>

        {/* Arrow between START and FINISH */}
        <path
          d="M 440,660 C 500,580 580,580 640,660"
          fill="none" stroke={COLORS.accent} strokeWidth={4}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />
        {/* Background track */}
        <path
          d="M 440,660 C 500,580 580,580 640,660"
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />

        {/* Middle dots representing events between start and finish */}
        <g opacity={midEvents.opacity}>
          {[0, 1, 2, 3, 4].map(i => {
            const mx = 470 + i * 40;
            const my = 610 + Math.sin((i / 4) * Math.PI) * (-50);
            const mFloat = Math.sin(frame * 0.06 + i * 0.8) * 3;
            return (
              <circle key={i} cx={mx} cy={my + mFloat} r={6}
                fill={COLORS.accent} opacity={0.4 * shimmer} />
            );
          })}
        </g>

        {/* Full-width summary card */}
        <g opacity={midEvents.opacity} transform={`translate(0, ${midEvents.translateY})`}>
          <BentoCard x={60} y={960} w={960} h={260} />
          <text x={100} y={1040} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            The trajectory captures
          </text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={44} fontWeight={800} fontStyle="italic" fill={COLORS.accent}>
            everything in between
          </text>
          <text x={100} y={1160} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            States, actions, observations — ordered
          </text>
        </g>

        {/* Six small event icons in a row */}
        <g opacity={midEvents.opacity}>
          {['S₀', 'A₁', 'O₁', 'S₁', 'A₂', 'O₂'].map((sym, i) => {
            const ex = 130 + i * 150;
            const ey = 1320;
            const isAction = sym.startsWith('A');
            const eFloat = Math.sin(frame * 0.05 + i * 0.7) * 3;
            return (
              <g key={i} transform={`translate(${ex}, ${ey + eFloat})`}>
                <circle cx={0} cy={0} r={24}
                  fill={isAction ? COLORS.accent : COLORS.bg_secondary}
                  stroke={COLORS.accent} strokeWidth={2} />
                <text x={0} y={6} textAnchor="middle"
                  fontFamily={FONT} fontSize={18} fontWeight={800}
                  fill={isAction ? COLORS.bg_primary : COLORS.accent}>
                  {sym}
                </text>
                {i < 5 && (
                  <line x1={24} y1={0} x2={126} y2={0}
                    stroke={COLORS.accent} strokeWidth={1} opacity={0.2}
                    strokeDasharray="4 4" />
                )}
              </g>
            );
          })}
        </g>

        {/* Decorative floating rings */}
        {[
          { x: 200, y: 1500 },
          { x: 540, y: 1540 },
          { x: 880, y: 1510 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y + breathe * (i % 2 === 0 ? 1 : -1)})`}>
            <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.accent}
              strokeWidth={1} opacity={0.1 * shimmer}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          </g>
        ))}

        {/* Dashed connectors */}
        <line x1={216} y1={1500} x2={524} y2={1540}
          stroke={COLORS.accent} strokeWidth={0.8} strokeDasharray="4 6" opacity={0.08} />
        <line x1={556} y1={1540} x2={864} y2={1510}
          stroke={COLORS.accent} strokeWidth={0.8} strokeDasharray="4 6" opacity={0.08} />

        {/* Bottom accent line */}
        <rect x={60} y={1680} width={960} height={3} rx={1.5}
          fill={COLORS.accent} opacity={0.12 * shimmer} />

        {/* ── CAPTION ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
