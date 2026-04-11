/**
 * Scene 14 — History Made
 * "45 minutes of silence ended in one second of static that confirmed history had just been made."
 * Duration: 233 frames (~7.8s) — audio 79.000s → 86.760s
 *
 * Visual: Full-width timeline bar. Left ~85% = pure black silence.
 * Right ~15% = audio waveform burst (powder blue). "HISTORY CONFIRMED" above.
 * The weight and contrast tells the story.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Static waveform shape for the 1-second burst
const WAVEFORM = Array.from({ length: 48 }, (_, i) => {
  const h1 = ((i * 2654435761 + 9) >>> 0) / 4294967296;
  const h2 = ((i * 2246822519 + 17) >>> 0) / 4294967296;
  return { x: i, amp: (0.3 + h1 * 0.7) * (i > 4 && i < 44 ? 1 : 0.4) };
});

export const Scene14_HistoryMade: React.FC = () => {
  const frame = useCurrentFrame();

  const enter       = fadeIn(frame, 0, 18);
  const captionOp   = fadeIn(frame, 10, 20);
  const tlEnter     = interpolate(frame, [6, 32], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const silenceOp   = interpolate(frame, [12, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const burstEnter  = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const histEnter   = interpolate(frame, [50, 84], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bottomEnter = interpolate(frame, [64, 96], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const statsEnter  = interpolate(frame, [80, 120], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Timeline dimensions
  const tlX  = 60;
  const tlY  = 820;
  const tlW  = 960;
  const tlH  = 90;

  const silenceW = tlW * 0.84;
  const burstX   = tlX + silenceW;
  const burstW   = tlW * 0.16;

  // Waveform animation — grows in from left to right
  const waveDrawn = burstEnter;

  // "HISTORY" pulse
  const pulse = 1 + interpolate(frame % 40, [0, 20, 40], [0, 0.02, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="histGlow14" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={C.warm_pink} floodOpacity="0.35" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="burstGlow14" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feFlood floodColor={C.powder_blue} floodOpacity="0.5" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="mintGlow14" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={C.mint} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="burstClip14">
            <rect x={burstX} y={tlY - 60} width={burstW} height={tlH + 120} />
          </clipPath>
        </defs>

        <StarField opacity={enter * 0.4} />

        {/* Scene header */}
        <text x={540} y={130}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={C.slate} letterSpacing="0.35em"
          opacity={enter * 0.5}>
          APOLLO 8 · DECEMBER 25, 1968
        </text>

        {/* ── HISTORY CONFIRMED ── */}
        <g opacity={histEnter}
          filter="url(#histGlow14)"
          transform={`scale(${pulse}) translate(${540 * (1 - pulse)}, ${440 * (1 - pulse)})`}>
          <text x={540} y={380}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={700}
            fill={C.warm_pink} letterSpacing="0.12em" opacity={0.85}>
            HISTORY
          </text>
          <text x={540} y={456}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={700}
            fill={C.warm_pink} letterSpacing="0.12em" opacity={0.85}>
            CONFIRMED
          </text>
        </g>

        {/* Divider */}
        <line x1={160} y1={500} x2={920} y2={500}
          stroke={C.warm_pink} strokeWidth={1.5} opacity={histEnter * 0.4} />

        {/* ── 45 min label above silence zone ── */}
        <g opacity={silenceOp}>
          <text x={tlX + silenceW / 2} y={740}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={C.slate} letterSpacing="0.2em" opacity={0.6}>
            45 MINUTES
          </text>
          <text x={tlX + silenceW / 2} y={784}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400}
            fill={C.slate} letterSpacing="0.2em" opacity={0.4}>
            OF SILENCE
          </text>
          {/* Duration arrow */}
          <line x1={tlX + 10} y1={800} x2={tlX + silenceW - 10} y2={800}
            stroke={C.slate} strokeWidth={1.5} strokeLinecap="round" opacity={0.3} />
        </g>

        {/* ── Timeline bar ── */}
        <g opacity={tlEnter}>
          {/* Full bar outline */}
          <rect x={tlX} y={tlY} width={tlW} height={tlH} rx={8}
            fill="none" stroke={C.slate} strokeWidth={1.5} opacity={0.3} />

          {/* Silence zone — pure black fill within */}
          <rect x={tlX + 1} y={tlY + 1} width={silenceW - 2} height={tlH - 2} rx={6}
            fill={C.bg} />
          <rect x={tlX + 1} y={tlY + 1} width={silenceW - 2} height={tlH - 2} rx={6}
            fill="none" stroke={C.rose_coral} strokeWidth={2} opacity={0.5} />

          {/* "SILENCE" text inside silence bar */}
          <text x={tlX + silenceW / 2} y={tlY + 57}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={C.slate} letterSpacing="0.3em" opacity={0.4}>
            SILENCE
          </text>

          {/* Burst zone */}
          <rect x={burstX} y={tlY} width={burstW} height={tlH} rx={6}
            fill={C.steel_blue} opacity={burstEnter * 0.12} />
          <rect x={burstX} y={tlY} width={burstW} height={tlH} rx={6}
            fill="none" stroke={C.powder_blue} strokeWidth={2} opacity={burstEnter * 0.7} />

          {/* Waveform in burst zone */}
          <g clipPath="url(#burstClip14)" filter="url(#burstGlow14)" opacity={burstEnter}>
            {WAVEFORM.map((pt, i) => {
              if (i >= Math.round(waveDrawn * WAVEFORM.length)) return null;
              const wx = burstX + 4 + (i / WAVEFORM.length) * (burstW - 8);
              const wh = pt.amp * (tlH - 16);
              const wy = tlY + (tlH - wh) / 2;
              return (
                <rect key={i}
                  x={wx} y={wy}
                  width={Math.max(2, burstW / WAVEFORM.length - 2)}
                  height={wh}
                  rx={1}
                  fill={i % 2 === 0 ? C.powder_blue : C.teal}
                />
              );
            })}
          </g>
        </g>

        {/* ── "1 SECOND OF STATIC" label ── */}
        <g opacity={burstEnter}>
          <line x1={burstX + burstW / 2} y1={tlY + tlH + 10}
                x2={burstX + burstW / 2} y2={tlY + tlH + 50}
            stroke={C.powder_blue} strokeWidth={1.5} opacity={0.6} />
          <text x={burstX + burstW / 2} y={tlY + tlH + 80}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={C.powder_blue} letterSpacing="0.1em">
            1 SECOND
          </text>
          <text x={burstX + burstW / 2} y={tlY + tlH + 110}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={400}
            fill={C.silver} letterSpacing="0.14em" opacity={0.7}>
            OF STATIC
          </text>
        </g>

        {/* ── Statistics row ── */}
        <g opacity={statsEnter}>
          {/* Panel */}
          <rect x={80} y={1180} width={920} height={320} rx={12}
            fill={C.muted_blue} opacity={0.12} />
          <rect x={80} y={1180} width={920} height={320} rx={12}
            fill="none" stroke={C.steel_blue} strokeWidth={1.5} opacity={0.35} />

          {/* Stat 1: 45 */}
          <text x={230} y={1278}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={90} fontWeight={900}
            fill={C.warm_pink} letterSpacing="-0.02em">
            45
          </text>
          <text x={230} y={1320}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
            fill={C.silver} letterSpacing="0.16em" opacity={0.6}>
            MIN SILENCE
          </text>
          <text x={230} y={1358}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={400}
            fill={C.slate} letterSpacing="0.16em" opacity={0.45}>
            COMPLETE BLACKOUT
          </text>

          <line x1={400} y1={1200} x2={400} y2={1480}
            stroke={C.slate} strokeWidth={1} opacity={0.3} />

          {/* Stat 2: 1 */}
          <text x={540} y={1278}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={90} fontWeight={900}
            fill={C.steel_blue} letterSpacing="-0.02em">
            1
          </text>
          <text x={540} y={1320}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
            fill={C.silver} letterSpacing="0.16em" opacity={0.6}>
            SEC STATIC
          </text>
          <text x={540} y={1358}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={400}
            fill={C.slate} letterSpacing="0.16em" opacity={0.45}>
            SIGNAL RESTORED
          </text>

          <line x1={680} y1={1200} x2={680} y2={1480}
            stroke={C.slate} strokeWidth={1} opacity={0.3} />

          {/* Stat 3: ∞ */}
          <text x={850} y={1290}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={90} fontWeight={900}
            fill={C.mint} letterSpacing="-0.02em"
            filter="url(#mintGlow14)">
            ∞
          </text>
          <text x={850} y={1330}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
            fill={C.silver} letterSpacing="0.16em" opacity={0.6}>
            HISTORY
          </text>
          <text x={850} y={1368}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={400}
            fill={C.slate} letterSpacing="0.16em" opacity={0.45}>
            MADE FOREVER
          </text>
        </g>

        {/* Bottom mission label */}
        <g opacity={bottomEnter}>
          <text x={540} y={1570}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700}
            fill={C.silver} letterSpacing="0.12em" opacity={0.7}>
            APOLLO 8 · FIRST HUMANS TO ORBIT THE MOON
          </text>
          <text x={540} y={1616}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400}
            fill={C.slate} letterSpacing="0.18em" opacity={0.45}>
            DECEMBER 24–25, 1968
          </text>
        </g>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="45 minutes of silence ended in one second of static that confirmed history had just been made."
          highlight={['45', 'silence', 'history']}
        />
      </svg>
    </AbsoluteFill>
  );
};
