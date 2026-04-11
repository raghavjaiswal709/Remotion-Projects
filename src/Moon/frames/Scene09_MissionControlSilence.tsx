/**
 * Scene 09 — Mission Control Silence
 * "For those 45 minutes, mission control heard nothing.
 *  No signal, no telemetry, no confirmation the engine burn had worked."
 * Duration: 301 frames (~10s) — audio 48.160s → 58.200s
 *
 * Visual: Mission control room — blank screens, flatline meters, silent operators.
 * "NO SIGNAL" / "NO TELEMETRY" / "NO CONFIRMATION" revealed one by one.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn } from '../helpers/timing';
import { CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene09_MissionControlSilence: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const captionOp  = fadeIn(frame, 10, 20);
  const roomEnter  = interpolate(frame, [6, 32], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const nosig      = interpolate(frame, [28, 52], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const notel      = interpolate(frame, [52, 76], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const nocon      = interpolate(frame, [76, 100], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const timerOp    = interpolate(frame, [40, 64], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Flatline waveform animation
  const flatY = 0;

  // Clock ticking
  const elapsed = Math.floor(frame * 45 / 301); // 0..45 minutes over the scene
  const elMin   = elapsed.toString().padStart(2, '0');
  const elSec   = Math.floor((frame * 45 * 60 / 301) % 60).toString().padStart(2, '0');

  // 3 operator stations
  const STATIONS = [
    { x: 80,  y: 900, label: 'COMMS' },
    { x: 380, y: 900, label: 'TELEMETRY' },
    { x: 680, y: 900, label: 'SYSTEMS' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="redGlow09" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={C.rose_coral} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="screenGlow09" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor={C.steel_blue} floodOpacity="0.2" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Subtle background floor structure */}
        <rect x={0} y={0} width={1080} height={1920} fill={C.muted_blue} opacity={enter * 0.04} />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={0} y1={880 + i * 100} x2={1080} y2={880 + i * 100}
            stroke={C.slate} strokeWidth={0.4} opacity={enter * 0.15} />
        ))}

        {/* Scene header */}
        <text x={540} y={130}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={C.slate} letterSpacing="0.35em"
          opacity={enter * 0.5}>
          MISSION CONTROL · HOUSTON, TEXAS
        </text>

        {/* ── Large central status display ── */}
        <g opacity={roomEnter}>
          <rect x={80} y={200} width={920} height={440} rx={12}
            fill={C.muted_blue} opacity={0.18} />
          <rect x={80} y={200} width={920} height={440} rx={12}
            fill="none" stroke={C.steel_blue} strokeWidth={2} opacity={0.4}
            filter="url(#screenGlow09)" />

          {/* Scanlines */}
          {Array.from({ length: 15 }, (_, i) => (
            <line key={i} x1={92} y1={214 + i * 28} x2={988} y2={214 + i * 28}
              stroke={C.steel_blue} strokeWidth={0.25} opacity={0.08} />
          ))}

          {/* "NO SIGNAL" large status */}
          <text x={540} y={370}
            textAnchor="middle"
            fontFamily="monospace" fontSize={70} fontWeight={700}
            fill={C.rose_coral}
            filter="url(#redGlow09)"
            opacity={nosig}>
            NO SIGNAL
          </text>

          {/* Signal bars — all zero */}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i}
              x={160 + i * 160} y={430}
              width={100} height={160}
              rx={4}
              fill="none" stroke={C.rose_coral} strokeWidth={2}
              opacity={roomEnter * 0.5}
            />
          ))}

          {/* Flatline across screen */}
          <line x1={100} y1={500} x2={980} y2={500}
            stroke={C.rose_coral} strokeWidth={2.5}
            filter="url(#redGlow09)"
            opacity={nosig * 0.9}
          />

          {/* Screen label */}
          <text x={540} y={244}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
            fill={C.powder_blue} letterSpacing="0.2em" opacity={0.6}>
            MISSION CONTROL · COMMUNICATION STATUS
          </text>
        </g>

        {/* ── Operator stations ── */}
        <g opacity={roomEnter}>
          {STATIONS.map((st, i) => (
            <g key={i}>
              {/* Desk structure */}
              <rect x={st.x} y={st.y} width={280} height={180} rx={8}
                fill={C.muted_blue} opacity={0.2} />
              <rect x={st.x} y={st.y} width={280} height={180} rx={8}
                fill="none" stroke={C.steel_blue} strokeWidth={1.5} opacity={0.4} />
              {/* Monitor */}
              <rect x={st.x + 16} y={st.y + 14} width={248} height={120} rx={4}
                fill={C.bg} opacity={0.85} />
              <rect x={st.x + 16} y={st.y + 14} width={248} height={120} rx={4}
                fill="none" stroke={C.steel_blue} strokeWidth={1} opacity={0.3} />
              {/* Flatline on monitor */}
              <line x1={st.x + 26} y1={st.y + 74} x2={st.x + 254} y2={st.y + 74}
                stroke={C.rose_coral} strokeWidth={2}
                filter="url(#redGlow09)"
                opacity={0.8}
              />
              {/* Station label */}
              <text x={st.x + 140} y={st.y + 160}
                textAnchor="middle"
                fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={600}
                fill={C.slate} letterSpacing="0.18em" opacity={0.6}>
                {st.label}
              </text>
              {/* Operator silhouette */}
              <ellipse cx={st.x + 140} cy={st.y + 200} rx={22} ry={12}
                fill={C.peach} opacity={0.3} />
              <circle cx={st.x + 140} cy={st.y + 186} r={14}
                fill={C.peach} opacity={0.3} />
              {/* Headset */}
              <path d={`M ${st.x + 126},${st.y + 182} Q ${st.x + 140},${st.y + 172} ${st.x + 154},${st.y + 182}`}
                fill="none" stroke={C.copper} strokeWidth={2} opacity={0.5} />
              <rect x={st.x + 122} y={st.y + 180} width={8} height={12} rx={3}
                fill={C.copper} opacity={0.5} />
              <rect x={st.x + 150} y={st.y + 180} width={8} height={12} rx={3}
                fill={C.copper} opacity={0.5} />
            </g>
          ))}
        </g>

        {/* ── Elapsed time counter ── */}
        <g opacity={timerOp}>
          <rect x={280} y={1140} width={520} height={100} rx={10}
            fill={C.bg} opacity={0.9} />
          <rect x={280} y={1140} width={520} height={100} rx={10}
            fill="none" stroke={C.rose_coral} strokeWidth={2.5} opacity={0.6} />
          <text x={420} y={1178}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={C.silver} letterSpacing="0.2em" opacity={0.5}>
            ELAPSED BLACKOUT
          </text>
          <text x={540} y={1218}
            textAnchor="middle"
            fontFamily="monospace" fontSize={40} fontWeight={700}
            fill={C.rose_coral}
            filter="url(#redGlow09)">
            {`00:${elMin}:${elSec}`}
          </text>
        </g>

        {/* ── NO SIGNAL / NO TELEMETRY / NO CONFIRMATION list ── */}
        <g>
          {[
            { text: '× NO SIGNAL',       op: nosig,  color: C.rose_coral, y: 1310 },
            { text: '× NO TELEMETRY',    op: notel,  color: C.salmon,     y: 1390 },
            { text: '× NO CONFIRMATION', op: nocon,  color: C.warm_pink,  y: 1470 },
          ].map((item, i) => (
            <g key={i} opacity={item.op} filter="url(#redGlow09)">
              <text x={540} y={item.y}
                textAnchor="middle"
                fontFamily="'Inter', sans-serif" fontSize={42} fontWeight={700}
                fill={item.color} letterSpacing="0.06em">
                {item.text}
              </text>
            </g>
          ))}
        </g>

        {/* "NOTHING" large background watermark */}
        <text x={540} y={1660}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={130} fontWeight={900}
          fill={C.slate} letterSpacing="0.04em"
          opacity={enter * 0.07}>
          NOTHING
        </text>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="For those 45 minutes, mission control heard nothing. No signal, no telemetry, no confirmation."
          highlight={['nothing', 'signal', 'telemetry', 'confirmation']}
        />
      </svg>
    </AbsoluteFill>
  );
};
