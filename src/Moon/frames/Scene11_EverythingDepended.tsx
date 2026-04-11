/**
 * Scene 11 — Everything Depended on a Burn
 * "Everything depended on a burn that no one on Earth could observe."
 * Duration: 144 frames (~4.8s) — audio 65.760s → 70.580s
 *
 * Visual: Engine burn diagram — rocket nozzle (copper), exhaust plume (warm pink/salmon),
 * orbital path change arc. Moon limb blocking line of sight to Earth.
 * "UNOBSERVED" label.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene11_EverythingDepended: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const captionOp  = fadeIn(frame, 10, 20);
  const engineEnter = interpolate(frame, [4, 26], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const plumeProg   = clamp((frame - 10) / 60);
  const orbitEnter  = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const moonEnter   = interpolate(frame, [8, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const labelEnter  = interpolate(frame, [40, 68], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xEnter      = interpolate(frame, [50, 76], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Plume size animates: grow then sustain
  const plumeLen = interpolate(plumeProg, [0, 0.5, 1], [0, 260, 240]);
  const plumeW   = interpolate(plumeProg, [0, 0.5, 1], [0, 120, 110]);

  // Engine body center position
  const engX = 540, engY = 760;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="plumeGlow11" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feFlood floodColor={C.warm_pink} floodOpacity="0.6" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="engineGlow11" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="plumeGrad11" cx="50%" cy="0%" r="100%">
            <stop offset="0%"  stopColor={C.warm_pink}  stopOpacity="0.9" />
            <stop offset="40%" stopColor={C.salmon}     stopOpacity="0.7" />
            <stop offset="100%" stopColor={C.bg}        stopOpacity="0" />
          </radialGradient>
        </defs>

        <StarField opacity={enter * 0.6} />

        {/* Moon limb — upper-right, blocking line of sight */}
        <g opacity={moonEnter}>
          <circle cx={950} cy={340} r={280}
            fill={C.silver} opacity={0.15} />
          <circle cx={950} cy={340} r={280}
            fill="none" stroke={C.silver} strokeWidth={2.5} opacity={0.4} />
          {/* Shadow zone */}
          <clipPath id="moonClip11">
            <circle cx={950} cy={340} r={280} />
          </clipPath>
          <ellipse cx={870} cy={340} rx={160} ry={280}
            fill={C.muted_blue} opacity={0.35}
            clipPath="url(#moonClip11)" />
          <text x={820} y={380}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={C.silver} letterSpacing="0.18em" opacity={0.4}>
            MOON
          </text>
        </g>

        {/* Earth — lower-left, blocked */}
        <g opacity={enter}>
          <circle cx={100} cy={1600} r={50}
            fill={C.teal} stroke={C.mint} strokeWidth={2} opacity={0.4} />
          <text x={100} y={1666}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
            fill={C.mint} opacity={0.5}>
            EARTH
          </text>
        </g>

        {/* Line of sight — blocked by Moon */}
        <g opacity={xEnter}>
          <line x1={100} y1={1600} x2={540} y2={760}
            stroke={C.rose_coral} strokeWidth={2}
            strokeDasharray="10,8"
            opacity={0.45} />
          {/* Block point */}
          <line x1={430} y1={1180} x2={460} y2={1150}
            stroke={C.rose_coral} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
          <line x1={460} y1={1180} x2={430} y2={1150}
            stroke={C.rose_coral} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
          <text x={500} y={1145}
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={600}
            fill={C.rose_coral} opacity={0.8}>
            BLOCKED
          </text>
        </g>

        {/* ── Engine module ── */}
        <g opacity={engineEnter} filter="url(#engineGlow11)">
          {/* Service module cylinder */}
          <rect x={engX - 55} y={engY - 140} width={110} height={180} rx={8}
            fill={C.muted_blue} stroke={C.silver} strokeWidth={2} />
          {/* Thermal panels */}
          {[-1, 0, 1].map(i => (
            <rect key={i}
              x={engX - 44 + i * 36} y={engY - 128}
              width={30} height={90}
              fill={C.steel_blue} stroke={C.powder_blue} strokeWidth={1} opacity={0.6} />
          ))}
          {/* Engine bell nozzle */}
          <path d={`M ${engX - 38},${engY + 40} L ${engX - 58},${engY + 120} L ${engX + 58},${engY + 120} L ${engX + 38},${engY + 40} Z`}
            fill={C.copper} stroke={C.silver} strokeWidth={2} />
          {/* Nozzle throat */}
          <ellipse cx={engX} cy={engY + 40} rx={38} ry={10}
            fill={C.copper} stroke={C.silver} strokeWidth={1.5} />
          {/* Nozzle exit */}
          <ellipse cx={engX} cy={engY + 120} rx={58} ry={14}
            fill={C.copper} stroke={C.silver} strokeWidth={1.5} opacity={0.7} />
        </g>

        {/* ── Exhaust plume ── */}
        {plumeProg > 0 && (
          <g filter="url(#plumeGlow11)" opacity={engineEnter}>
            {/* Main plume cone */}
            <path d={`M ${engX - 58},${engY + 120}
              Q ${engX - plumeW / 2},${engY + 120 + plumeLen * 0.4}
                ${engX - 10},${engY + 120 + plumeLen}
              Q ${engX},${engY + 120 + plumeLen + 20}
                ${engX + 10},${engY + 120 + plumeLen}
              Q ${engX + plumeW / 2},${engY + 120 + plumeLen * 0.4}
                ${engX + 58},${engY + 120}`}
              fill="url(#plumeGrad11)"
              opacity={0.85}
            />
            {/* Hot core */}
            <path d={`M ${engX - 24},${engY + 124}
              Q ${engX},${engY + 160} ${engX},${engY + 200}
              Q ${engX},${engY + 160} ${engX + 24},${engY + 124}`}
              fill={C.peach}
              opacity={0.7}
            />
          </g>
        )}

        {/* Orbital path — before/after burn */}
        <g opacity={orbitEnter}>
          {/* Pre-burn path: approaching Moon */}
          <path d={`M 80,1560 Q 300,1200 ${engX},${engY - 160}`}
            fill="none" stroke={C.teal} strokeWidth={2.5}
            strokeDasharray="12,8" opacity={0.5} />
          {/* Post-burn path: departing toward Earth */}
          <path d={`M ${engX},${engY - 160} Q 700,400 1020,200`}
            fill="none" stroke={C.mint} strokeWidth={2.5}
            strokeDasharray="12,8" opacity={0.5} />
          {/* Delta-v arrow at burn point */}
          <polygon points={`${engX - 20},${engY - 200} ${engX},${engY - 260} ${engX + 20},${engY - 200}`}
            fill={C.mint} opacity={0.7} />
          <text x={engX + 30} y={engY - 220}
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
            fill={C.mint} opacity={0.7}>
            DELTA-V
          </text>
        </g>

        {/* "UNOBSERVED" label */}
        <g opacity={labelEnter}>
          <rect x={180} y={1380} width={720} height={150} rx={12}
            fill={C.muted_blue} opacity={0.15} />
          <rect x={180} y={1380} width={720} height={150} rx={12}
            fill="none" stroke={C.rose_coral} strokeWidth={2} opacity={0.5} />
          <text x={540} y={1444}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={72} fontWeight={900}
            fill={C.rose_coral} letterSpacing="0.08em" opacity={0.9}>
            UNOBSERVED
          </text>
          <text x={540} y={1500}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={C.silver} letterSpacing="0.18em" opacity={0.55}>
            NO ONE ON EARTH COULD SEE
          </text>
        </g>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="Everything depended on a burn that no one on Earth could observe."
          highlight={['burn', 'observe', 'depended']}
        />
      </svg>
    </AbsoluteFill>
  );
};
