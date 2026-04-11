/**
 * Scene 08 — Apollo 8 Blackout
 * "During Apollo 8, the blackout lasted 45 minutes."
 * Duration: 141 frames (~4.7s) — audio 43.480s → 48.160s
 *
 * Visual: "APOLLO 8" hero text. Full-width timeline with 45-minute blackout zone.
 * Signal-ON bookends in soft mint, blackout zone in black/rose coral border.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene08_Apollo8Blackout: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const captionOp  = fadeIn(frame, 10, 20);
  const titleEnter = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleScale = interpolate(frame, [0, 24], [0.7, 1], { extrapolateRight: 'clamp', easing: ease });
  const yearEnter  = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const tlEnter    = interpolate(frame, [20, 46], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const minEnter   = interpolate(frame, [34, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const badgeEnter = interpolate(frame, [14, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Timeline layout
  const tlX   = 80;
  const tlY   = 1160;
  const tlW   = 920;
  const tlH   = 80;
  const sigW  = tlW * 0.08; // signal-ON zones at each end
  const blkX  = tlX + sigW;
  const blkW  = tlW * 0.84;

  // 45-minute label pulse
  const pulse = 1 + interpolate(frame % 60, [0, 30, 60], [0, 0.03, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="pinkGlow08" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feFlood floodColor={C.warm_pink} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="mintGlow08" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={C.mint} floodOpacity="0.35" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="titleGlow08" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={C.steel_blue} floodOpacity="0.3" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <StarField opacity={enter * 0.4} />

        {/* Background band — dark panel */}
        <rect x={0} y={280} width={1080} height={400} fill={C.muted_blue} opacity={enter * 0.07} />

        {/* APOLLO 8 — hero title */}
        <g opacity={titleEnter}
          transform={`translate(540, 500) scale(${titleScale}) translate(-540, -500)`}>
          <text x={540} y={440}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={160} fontWeight={900}
            fill={C.steel_blue} letterSpacing="-0.02em"
            filter="url(#titleGlow08)">
            APOLLO
          </text>
          <text x={540} y={590}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={220} fontWeight={900}
            fill={C.steel_blue} letterSpacing="-0.04em"
            opacity={0.95}>
            8
          </text>
        </g>

        {/* Year & mission label */}
        <g opacity={yearEnter}>
          <text x={540} y={680}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500}
            fill={C.silver} letterSpacing="0.22em" opacity={0.7}>
            DECEMBER 24, 1968
          </text>
          <text x={540} y={724}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400}
            fill={C.slate} letterSpacing="0.2em" opacity={0.55}>
            FIRST HUMANS TO ORBIT THE MOON
          </text>
        </g>

        {/* Mission badge */}
        <g opacity={badgeEnter}>
          <circle cx={540} cy={890} r={70}
            fill="none" stroke={C.copper} strokeWidth={3} opacity={0.6} />
          <circle cx={540} cy={890} r={58}
            fill="none" stroke={C.steel_blue} strokeWidth={1.5} opacity={0.4}
            strokeDasharray="8,6" />
          {/* Moon inside badge */}
          <circle cx={540} cy={890} r={32}
            fill={C.silver} opacity={0.3} />
          <circle cx={540} cy={890} r={32}
            fill="none" stroke={C.silver} strokeWidth={1.5} opacity={0.5} />
          {/* Orbit arc in badge */}
          <path d="M 480,870 Q 540,820 600,870"
            fill="none" stroke={C.teal} strokeWidth={2} opacity={0.6} />
        </g>

        {/* ── Timeline ── */}
        <g opacity={tlEnter}>
          {/* Timeline label */}
          <text x={540} y={1098}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
            fill={C.slate} letterSpacing="0.28em" opacity={0.6}>
            LUNAR OCCULTATION TIMELINE
          </text>

          {/* Full bar background */}
          <rect x={tlX} y={tlY} width={tlW * tlEnter} height={tlH} rx={8}
            fill={C.slate} opacity={0.15} />
          <rect x={tlX} y={tlY} width={tlW} height={tlH} rx={8}
            fill="none" stroke={C.slate} strokeWidth={1.5} opacity={0.4} />

          {/* Signal ON — left */}
          <rect x={tlX} y={tlY} width={sigW * tlEnter} height={tlH} rx={8}
            fill={C.mint} opacity={0.7} />
          <text x={tlX + sigW / 2} y={tlY - 12}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={600}
            fill={C.mint} opacity={0.8}>
            SIGNAL
          </text>

          {/* Blackout zone */}
          <rect x={blkX} y={tlY} width={blkW * tlEnter} height={tlH}
            fill={C.bg} />
          <rect x={blkX} y={tlY} width={blkW} height={tlH}
            fill="none" stroke={C.rose_coral} strokeWidth={2} opacity={0.7} />

          {/* Signal ON — right */}
          <rect x={tlX + sigW + blkW} y={tlY} width={sigW * tlEnter} height={tlH} rx={8}
            fill={C.mint} opacity={0.7} />
          <text x={tlX + sigW + blkW + sigW / 2} y={tlY - 12}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={600}
            fill={C.mint} opacity={0.8}>
            SIGNAL
          </text>

          {/* Timeline ticks */}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i}
              x1={tlX + sigW + i * blkW / 9} y1={tlY}
              x2={tlX + sigW + i * blkW / 9} y2={tlY + tlH}
              stroke={C.slate} strokeWidth={0.5} opacity={0.25}
            />
          ))}
        </g>

        {/* 45 MINUTES label — centered over blackout */}
        <g opacity={minEnter}
          transform={`scale(${pulse}) translate(${540 * (1 - pulse)}, ${1260 * (1 - pulse)})`}>
          <text x={540} y={1300}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={110} fontWeight={900}
            fill={C.warm_pink} letterSpacing="-0.02em"
            filter="url(#pinkGlow08)">
            45
          </text>
          <text x={540} y={1380}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={46} fontWeight={700}
            fill={C.warm_pink} letterSpacing="0.1em" opacity={0.9}>
            MINUTES
          </text>
          <text x={540} y={1432}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400}
            fill={C.silver} letterSpacing="0.18em" opacity={0.6}>
            OF BLACKOUT
          </text>
        </g>

        {/* Duration arrow */}
        <g opacity={minEnter * 0.6}>
          <line x1={blkX + 10} y1={tlY + tlH + 30} x2={blkX + blkW - 10} y2={tlY + tlH + 30}
            stroke={C.warm_pink} strokeWidth={2} strokeLinecap="round" />
          <polygon points={`${blkX + 10},${tlY + tlH + 25} ${blkX + 25},${tlY + tlH + 30} ${blkX + 10},${tlY + tlH + 35}`}
            fill={C.warm_pink} />
          <polygon points={`${blkX + blkW - 10},${tlY + tlH + 25} ${blkX + blkW - 25},${tlY + tlH + 30} ${blkX + blkW - 10},${tlY + tlH + 35}`}
            fill={C.warm_pink} />
        </g>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="During Apollo 8, the blackout lasted 45 minutes."
          highlight={['Apollo', '8', '45', 'minutes']}
        />
      </svg>
    </AbsoluteFill>
  );
};
