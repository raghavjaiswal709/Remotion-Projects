/**
 * Scene 12 — Agent: Different Architecturally
 * "An agent is different at the architectural level."
 * Layout (1080×1920):
 *   Title              top=60 → ~150
 *   Arch comparison    top=168 → ~320
 *   Separator          SVG y=340
 *   Loop circle        cy=740, r=260, spans y=480–1000
 *   Node labels        4 nodes on loop perimeter
 *   Key statement      top=1060 → ~1240
 *   Callout            top=1270 → ~1390
 *   Caption            y=1730
 * Duration: 86 frames (2.87s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets, LoopArrow } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const LOOP_CY = 740;
const LOOP_R = 260;

const LOOP_NODES = [
  { angle: 0,   label: 'Input',   color: '#3B82F6' },
  { angle: 90,  label: 'Act',     color: '#22C55E' },
  { angle: 180, label: 'Observe', color: '#F59E0B' },
  { angle: 270, label: 'Adapt',   color: '#A78BFA' },
];

export const Scene12_AgentDifferent: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const archEnter = interpolate(frame, [8, 38], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  const circ = 2 * Math.PI * LOOP_R;
  const loopDash = interpolate(frame, [25, 75], [circ, 0], { extrapolateRight: 'clamp' });
  const loopGlow = 0.65 + Math.sin(frame * 0.18) * 0.35;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* Ambient glow centered on loop */}
          <ellipse cx={540} cy={LOOP_CY} rx={400} ry={360}
            fill={COLORS.electric_cyan} opacity={0.022}/>

          {/* Separator between comparison strip and loop */}
          <line x1={100} y1={348} x2={980} y2={348}
            stroke={COLORS.electric_cyan} strokeWidth={1.5}
            strokeDasharray="5 6" opacity={archEnter * 0.22}/>

          {/* Loop orbit glow */}
          <circle cx={540} cy={LOOP_CY} r={LOOP_R + 50}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1}
            opacity={enter * loopGlow * 0.06} strokeDasharray="4 6"/>

          {/* Main loop arc */}
          <LoopArrow cx={540} cy={LOOP_CY} r={LOOP_R}
            color={COLORS.electric_cyan} strokeWidth={10}
            dashOffset={loopDash} opacity={enter}
            showArrow={loopDash < 40}/>

          {/* Center AGENT label — rendered in SVG for glow */}
          <text x={540} y={LOOP_CY - 18} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={84} fontWeight={900}
            fill={COLORS.electric_cyan} letterSpacing="-0.04em"
            opacity={enter} filter="url(#cyanGlow)">
            AGENT
          </text>
          <text x={540} y={LOOP_CY + 36} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver} opacity={enter * 0.65}>
            Architectural loop
          </text>

          {/* Node circles on loop perimeter */}
          {LOOP_NODES.map((n, i) => {
            const rad = (n.angle * Math.PI) / 180;
            const nx = 540 + Math.cos(rad) * LOOP_R;
            const ny = LOOP_CY + Math.sin(rad) * LOOP_R;
            const nEnter = interpolate(frame, [20 + i * 12, 46 + i * 12], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={i} opacity={nEnter}>
                {/* Node glow */}
                <circle cx={nx} cy={ny} r={52}
                  fill={n.color} opacity={0.12} filter="url(#softGlow)"/>
                {/* Node circle */}
                <circle cx={nx} cy={ny} r={44}
                  fill="#F5F0E8" stroke={n.color} strokeWidth={4}
                  filter="url(#shadow)"/>
                <text x={nx} y={ny + 9} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={23} fontWeight={800}
                  fill={n.color}>{n.label}</text>
              </g>
            );
          })}
        </svg>

        {/* ── Title ── */}
        <div style={{
          position: 'absolute', top: 60, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 66, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            Architecturally
            <span style={{ color: COLORS.electric_cyan }}> Different</span>
          </div>
        </div>

        {/* ── Architecture comparison strip ── top=168 */}
        <div style={{
          position: 'absolute', top: 168, left: 80, right: 80,
          display: 'flex', alignItems: 'center', gap: 18,
          opacity: archEnter,
        }}>
          {/* MODEL block */}
          <div style={{
            flex: 1,
            background: 'rgba(59,130,246,0.08)',
            border: '1.5px solid rgba(59,130,246,0.22)',
            borderRadius: 14, padding: '18px 20px',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
          }}>
            <div style={{
              fontSize: 20, color: COLORS.warm_blue,
              fontWeight: 800, marginBottom: 6,
            }}>MODEL</div>
            <div style={{
              fontSize: 52, fontWeight: 900, color: COLORS.warm_blue,
              lineHeight: 1,
            }}>→</div>
            <div style={{
              fontSize: 18, color: '#6070A0', marginTop: 6,
            }}>Linear. Stops.</div>
          </div>

          {/* ≠ divider */}
          <div style={{
            fontSize: 36, color: COLORS.light_gray,
            fontWeight: 300, flexShrink: 0,
          }}>≠</div>

          {/* AGENT block */}
          <div style={{
            flex: 1,
            background: 'rgba(0,229,255,0.07)',
            border: '1.5px solid rgba(0,229,255,0.22)',
            borderRadius: 14, padding: '18px 20px',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
          }}>
            <div style={{
              fontSize: 20, color: COLORS.electric_cyan,
              fontWeight: 800, marginBottom: 6,
            }}>AGENT</div>
            <div style={{
              fontSize: 52, fontWeight: 900, color: COLORS.electric_cyan,
              lineHeight: 1,
            }}>↻</div>
            <div style={{
              fontSize: 18, color: '#407888', marginTop: 6,
            }}>Loops. Adapts.</div>
          </div>
        </div>

        {/* ── Key statement ── top=1062 */}
        <div style={{
          position: 'absolute', top: 1062, left: 80, right: 80,
          opacity: interpolate(frame, [50, 78], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(0,229,255,0.07)',
          border: '2px solid rgba(0,229,255,0.25)',
          borderRadius: 18, padding: '28px 40px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 34, fontWeight: 700, color: COLORS.deep_black, lineHeight: 1.45,
            fontFamily: '"Inter", sans-serif',
          }}>
            The loop is <span style={{ color: COLORS.electric_cyan }}>not a feature</span>.
            <br/>It is the <span style={{ color: COLORS.electric_cyan }}>architecture itself</span>.
          </div>
        </div>

        {/* ── Secondary callout ── top=1276 */}
        <div style={{
          position: 'absolute', top: 1276, left: 80, right: 80,
          opacity: interpolate(frame, [62, 86], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(59,130,246,0.07)',
          border: '1.5px solid rgba(59,130,246,0.2)',
          borderRadius: 16, padding: '22px 36px',
        }}>
          <div style={{ fontSize: 27, color: COLORS.light_gray, lineHeight: 1.65 }}>
            Remove the loop — and you no longer have an
            <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}> agent</span>.
            You have a model.
          </div>
        </div>

        <CaptionBar
          text="An agent is different at the architectural level."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
