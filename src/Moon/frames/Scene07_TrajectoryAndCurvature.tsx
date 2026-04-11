/**
 * Scene 07 — Speed, Trajectory & Curvature
 * "They know the spacecraft's speed, its trajectory, and the precise curvature of the moon at that latitude.
 *  The cutoff is predictable to within a single second."
 * Duration: 322 frames (~10.7s) — audio 32.720s → 43.480s
 *
 * Visual: Orbital mechanics diagram — Moon center-right, spacecraft arc, three data
 * annotation tags (SPEED / TRAJECTORY / CURVATURE). Latitude lines on Moon.
 * "±1 SECOND" precision label.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, drawLine, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, MoonCircle, Spacecraft, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene07_TrajectoryAndCurvature: React.FC = () => {
  const frame = useCurrentFrame();

  const enter       = fadeIn(frame, 0, 18);
  const captionOp   = fadeIn(frame, 10, 20);
  const moonEnter   = interpolate(frame, [6, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const arcEnter    = interpolate(frame, [16, 52], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const tag1Enter   = interpolate(frame, [28, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const tag2Enter   = interpolate(frame, [40, 62], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const tag3Enter   = interpolate(frame, [52, 74], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const latEnter    = interpolate(frame, [60, 84], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const precEnter   = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Spacecraft position along the arc (animates)
  const craftT   = clamp((frame - 16) / 180);
  // Arc: from (80, 1600) curving up to (560, 340) — approaching Moon from below-left
  const craftX   = 80 + craftT * (560 - 80);
  const craftY   = 1600 + craftT * (340 - 1600) + Math.sin(craftT * Math.PI) * (-200);
  const craftAngle = -45 + craftT * 30;

  // Arc path for the trajectory
  const arcD = `M 80,1600 Q 300,800 560,340`;

  // Stroke-dasharray: total length approx 1380, animate
  const arcDrawn = arcEnter * 1380;

  // Moon: center-right
  const moonCX = 760, moonCY = 680, moonR = 260;

  // Latitude lines on Moon (horizontal slices)
  const latLines = [-0.5, -0.25, 0, 0.25, 0.5].map(t => ({
    dy: t * moonR * 1.9,
    halfW: Math.sqrt(Math.max(0, moonR * moonR - (t * moonR * 1.9) ** 2)),
    label: t === 0 ? 'EQUATOR' : null,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="tealGlow07" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="mintGlow07" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={C.mint} floodOpacity="0.35" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="moonClipSc07">
            <circle cx={moonCX} cy={moonCY} r={moonR} />
          </clipPath>
        </defs>

        <StarField opacity={enter * 0.5} />

        {/* Coordinate grid background */}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`hg${i}`} x1={0} y1={200 + i * 200} x2={1080} y2={200 + i * 200}
            stroke={C.slate} strokeWidth={0.4} opacity={enter * 0.2} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`vg${i}`} x1={100 + i * 180} y1={0} x2={100 + i * 180} y2={1920}
            stroke={C.slate} strokeWidth={0.4} opacity={enter * 0.15} />
        ))}

        {/* Scene header */}
        <text x={540} y={130}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={C.slate} letterSpacing="0.35em"
          opacity={enter * 0.5}>
          ORBITAL MECHANICS · OCCULTATION PREDICTION
        </text>

        {/* Moon */}
        <MoonCircle cx={moonCX} cy={moonCY} r={moonR} opacity={moonEnter} />

        {/* Latitude lines on Moon */}
        <g opacity={latEnter} clipPath="url(#moonClipSc07)">
          {latLines.map((ll, i) => (
            <g key={i}>
              <line
                x1={moonCX - ll.halfW}
                y1={moonCY + ll.dy}
                x2={moonCX + ll.halfW}
                y2={moonCY + ll.dy}
                stroke={ll.label ? C.warm_pink : C.slate}
                strokeWidth={ll.label ? 2 : 1}
                opacity={ll.label ? 0.8 : 0.4}
                strokeDasharray={ll.label ? undefined : '5,6'}
              />
              {ll.label && (
                <text x={moonCX + ll.halfW + 12} y={moonCY + ll.dy + 6}
                  fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={500}
                  fill={C.warm_pink} opacity={0.75}>
                  {ll.label}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Curvature tangent marks on Moon surface at crossing point */}
        <g opacity={tag3Enter}>
          {[-30, 0, 30].map((offset, i) => {
            const angle = (offset * Math.PI) / 180;
            const sx = moonCX - moonR * Math.cos(angle + 0.3);
            const sy = moonCY - moonR * Math.sin(angle + 0.3);
            return (
              <line key={i}
                x1={sx - 18 * Math.sin(angle + 0.3)}
                y1={sy + 18 * Math.cos(angle + 0.3)}
                x2={sx + 18 * Math.sin(angle + 0.3)}
                y2={sy - 18 * Math.cos(angle + 0.3)}
                stroke={C.warm_pink} strokeWidth={2.5} strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}
        </g>

        {/* Trajectory arc */}
        <g opacity={arcEnter}>
          <path d={arcD}
            fill="none"
            stroke={C.teal}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray={`${arcDrawn} 9999`}
            filter="url(#tealGlow07)"
          />
          {/* Arrow at end of drawn arc */}
          {arcEnter > 0.8 && (
            <polygon
              points={`${craftX},${craftY - 14} ${craftX - 9},${craftY + 8} ${craftX + 9},${craftY + 8}`}
              fill={C.teal}
              transform={`rotate(${craftAngle}, ${craftX}, ${craftY})`}
              opacity={0.9}
            />
          )}
        </g>

        {/* Spacecraft on arc */}
        <Spacecraft cx={craftX} cy={craftY} scale={0.85} angle={craftAngle - 90} opacity={arcEnter} />

        {/* ── Data annotation tags ── */}

        {/* Tag 1: SPEED */}
        <g opacity={tag1Enter}>
          <rect x={60} y={1000} width={280} height={120} rx={10}
            fill={C.muted_blue} opacity={0.3} />
          <rect x={60} y={1000} width={280} height={120} rx={10}
            fill="none" stroke={C.powder_blue} strokeWidth={2} opacity={0.7} />
          <text x={200} y={1046}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
            fill={C.silver} letterSpacing="0.2em" opacity={0.6}>
            SPEED
          </text>
          <text x={200} y={1090}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={800}
            fill={C.powder_blue}>
            10.9 km/s
          </text>
          {/* Velocity arrow */}
          <line x1={340} y1={1060} x2={400} y2={1040}
            stroke={C.powder_blue} strokeWidth={2} />
          <polygon points="400,1040 390,1048 396,1060" fill={C.powder_blue} />
        </g>

        {/* Tag 2: TRAJECTORY */}
        <g opacity={tag2Enter}>
          <rect x={60} y={1160} width={280} height={120} rx={10}
            fill={C.muted_blue} opacity={0.3} />
          <rect x={60} y={1160} width={280} height={120} rx={10}
            fill="none" stroke={C.teal} strokeWidth={2} opacity={0.7} />
          <text x={200} y={1206}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
            fill={C.silver} letterSpacing="0.2em" opacity={0.6}>
            TRAJECTORY
          </text>
          <text x={200} y={1250}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
            fill={C.teal}>
            ARC · VERIFIED
          </text>
          {/* Connector to arc */}
          <line x1={340} y1={1220} x2={440} y2={1100}
            stroke={C.teal} strokeWidth={1.5} strokeDasharray="5,6" opacity={0.5} />
        </g>

        {/* Tag 3: CURVATURE */}
        <g opacity={tag3Enter}>
          <rect x={60} y={1320} width={280} height={120} rx={10}
            fill={C.muted_blue} opacity={0.3} />
          <rect x={60} y={1320} width={280} height={120} rx={10}
            fill="none" stroke={C.warm_pink} strokeWidth={2} opacity={0.7} />
          <text x={200} y={1366}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
            fill={C.silver} letterSpacing="0.2em" opacity={0.6}>
            CURVATURE
          </text>
          <text x={200} y={1410}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
            fill={C.warm_pink}>
            AT LATITUDE
          </text>
          {/* Connector to Moon */}
          <line x1={340} y1={1380} x2={490} y2={700}
            stroke={C.warm_pink} strokeWidth={1.5} strokeDasharray="5,6" opacity={0.4} />
        </g>

        {/* ── Precision label ── */}
        <g opacity={precEnter}>
          <rect x={140} y={1500} width={800} height={130} rx={10}
            fill={C.mint} opacity={0.08} />
          <rect x={140} y={1500} width={800} height={130} rx={10}
            fill="none" stroke={C.mint} strokeWidth={2} opacity={0.5} />
          <text x={540} y={1548}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={C.silver} letterSpacing="0.12em" opacity={0.7}>
            CUTOFF PREDICTABLE TO WITHIN
          </text>
          <text x={540} y={1600}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={46} fontWeight={900}
            fill={C.mint} letterSpacing="0.06em"
            filter="url(#mintGlow07)">
            ± 1 SECOND
          </text>
        </g>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="They know the spacecraft's speed, trajectory, and precise curvature of the moon at that latitude."
          highlight={["speed", "trajectory", "curvature"]}
        />
      </svg>
    </AbsoluteFill>
  );
};
