/**
 * Scene 19 — JobIsDecide
 * "Its job is to decide."
 * CSV: 60.900s → 62.240s
 * Duration: 62 frames (2.07s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–16):  Label + hero "DECIDE" headline
 *   Phase 2 (frames 10–40): Brain/decision SVG with radiating choice arrows,
 *                            decision node, choice paths fanning out
 *   Phase 3 (frames 35–end): Pulse on central node, radiating rings
 *
 * Visual: A brain/model node at centre with three radiating paths
 *         representing different possible decisions. Emphasises the
 *         model's ONE job — choosing what to do, not doing it.
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

export const Scene19_JobIsDecide: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);

  // Hero DECIDE slam-in
  const decideSlam = spring({ frame: Math.max(0, frame - 2), fps, config: SPRING_SNAP });
  const decideScale = interpolate(decideSlam, [0, 1], [1.5, 1]);
  const decideOp = interpolate(decideSlam, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Ghost behind
  const ghostOp = interpolate(decideSlam, [0, 1], [0, 0.08]);

  const subtitleEnter = useSpringEntrance(frame, 6);

  // ── Phase 2 — Decision diagram ───────────────────────────────────────────

  // Central node
  const nodeEnter = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING_SOFT });
  const nodeScale = interpolate(nodeEnter, [0, 1], [0.7, 1]);
  const nodeOp = interpolate(nodeEnter, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Choice paths (3 radiating lines at angles)
  const choiceAngles = [-40, 0, 40]; // degrees
  const choiceLen = 200;
  const choiceColors = [COLORS.accent, COLORS.white, COLORS.accent];
  const choiceLabels = ['search()', 'respond()', 'calculate()'];

  // Path draw staggered
  const choiceDashes = choiceAngles.map((_, i) =>
    usePathDraw(frame, 14 + i * 4, choiceLen, 18),
  );

  // End nodes for each choice
  const endNodeEnters = choiceAngles.map((_, i) =>
    useSpringEntrance(frame, 22 + i * 4),
  );

  // "ITS JOB" bento card
  const jobCard = useSpringEntrance(frame, 28);

  // Bottom description card
  const descCard = useSpringEntrance(frame, 32);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const pulse = 1 + Math.sin(frame * 0.12) * 0.025;
  const breathe = Math.sin(frame * 0.07) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // Radiating rings from centre
  const ringRadius = interpolate((frame % 50) / 50, [0, 1], [60, 180]);
  const ringOp = interpolate((frame % 50) / 50, [0, 0.5, 1], [0.2, 0.15, 0]);

  // Second ring offset
  const ring2Radius = interpolate(((frame + 25) % 50) / 50, [0, 1], [60, 180]);
  const ring2Op = interpolate(((frame + 25) % 50) / 50, [0, 0.5, 1], [0.2, 0.15, 0]);

  // Centre coordinates
  const CX = 540;
  const CY = 750;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · ROLE" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero headline ────────────────────────────────────── */}
        {/* Ghost text */}
        <text x={540} y={320} textAnchor="middle"
          fontFamily={FONT} fontSize={180} fontWeight={800}
          fill={COLORS.accent} opacity={ghostOp}>
          DECIDE
        </text>
        {/* Main text */}
        <g opacity={decideOp}
           transform={`translate(540, 320) scale(${decideScale})`}
           style={{ transformOrigin: '0px 0px' }}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent}>
            DECIDE
          </text>
        </g>
        <g transform={`translate(0, ${subtitleEnter.translateY})`} opacity={subtitleEnter.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.text_muted}>
            That is the model's <tspan fontStyle="italic" fill={COLORS.white}>only</tspan> job
          </text>
        </g>

        {/* ── ZONE C — Decision diagram ──────────────────────────────────── */}

        {/* Radiating pulse rings */}
        <circle cx={CX} cy={CY} r={ringRadius}
          fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          opacity={frame > 30 ? ringOp : 0} />
        <circle cx={CX} cy={CY} r={ring2Radius}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={frame > 30 ? ring2Op : 0} />

        {/* Central decision node */}
        <g opacity={nodeOp}
           transform={`translate(${CX}, ${CY}) scale(${nodeScale * pulse})`}
           style={{ transformOrigin: '0px 0px' }}>
          {/* Outer circle */}
          <circle cx={0} cy={0} r={60}
            fill={COLORS.accent} opacity={0.1} />
          <circle cx={0} cy={0} r={60}
            fill="none" stroke={COLORS.accent} strokeWidth={3} />
          {/* Brain icon (simplified) */}
          <ellipse cx={0} cy={-5} rx={30} ry={25}
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.7} />
          {/* Brain folds */}
          <path d="M -12,-20 C -12,-5 -4,0 0,5" fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <path d="M 12,-20 C 12,-5 4,0 0,5" fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <path d="M -20,-5 C -8,-5 8,-5 20,-5" fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
          {/* "?" inside */}
          <text x={0} y={28} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}>
            ?
          </text>
        </g>

        {/* Choice paths radiating outward */}
        {choiceAngles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const endX = CX + Math.sin(rad) * choiceLen;
          const endY = CY + Math.cos(rad) * choiceLen;
          return (
            <g key={i}>
              {/* Line from center to end */}
              <line
                x1={CX + Math.sin(rad) * 65}
                y1={CY + Math.cos(rad) * 65}
                x2={endX} y2={endY}
                stroke={choiceColors[i]} strokeWidth={2.5}
                strokeDasharray={choiceLen} strokeDashoffset={choiceDashes[i]}
                strokeLinecap="round" opacity={0.7}
              />
              {/* Arrowhead */}
              <g opacity={endNodeEnters[i].opacity}>
                <polygon
                  points={`${endX},${endY} ${endX - 6},${endY - 10} ${endX + 6},${endY - 10}`}
                  fill={choiceColors[i]} opacity={0.5}
                  transform={`rotate(${angle}, ${endX}, ${endY})`}
                />
              </g>
              {/* End node circle + label */}
              <g opacity={endNodeEnters[i].opacity}
                 transform={`translate(0, ${endNodeEnters[i].translateY})`}>
                <circle cx={endX} cy={endY + 20} r={24}
                  fill={COLORS.bg_secondary}
                  stroke={choiceColors[i]} strokeWidth={1.5} />
                <text x={endX} y={endY + 70} textAnchor="middle"
                  fontFamily={FONT} fontSize={24} fontWeight={800}
                  fill={choiceColors[i]}>
                  {choiceLabels[i]}
                </text>
              </g>
            </g>
          );
        })}

        {/* "ITS JOB" card */}
        <g opacity={jobCard.opacity} transform={`translate(0, ${jobCard.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={180} accent />
          <rect x={60} y={1100} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={540} y={1175} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.white}>
            Choose <tspan fill={COLORS.accent} fontStyle="italic">which</tspan> tool
          </text>
          <text x={540} y={1240} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            and <tspan fill={COLORS.accent}>what</tspan> arguments to pass
          </text>
        </g>

        {/* Description card */}
        <g opacity={descCard.opacity} transform={`translate(0, ${descCard.translateY})`}>
          <BentoCard x={60} y={1320} w={460} h={140} />
          <text x={100} y={1385}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Decision only
          </text>
          <text x={100} y={1430}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Not execution
          </text>
        </g>

        <g opacity={descCard.opacity} transform={`translate(0, ${descCard.translateY + 4})`}>
          <BentoCard x={560} y={1320} w={460} h={140} />
          <text x={600} y={1385}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Structured output
          </text>
          <text x={600} y={1430}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Is the product
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────── */}
        {[
          { x: 120, y: 1560 }, { x: 960, y: 1580 },
          { x: 300, y: 1620 }, { x: 740, y: 1640 },
          { x: 540, y: 1680 }, { x: 200, y: 1710 },
          { x: 860, y: 1700 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.05 + i * 0.8) * 3}
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
            sceneDuration={SCENE_TIMING.s19.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
