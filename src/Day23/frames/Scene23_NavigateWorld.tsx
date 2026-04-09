/**
 * Scene 23 — With the Loop: Navigate the World
 * "With the loop, you have something that can navigate the world."
 * Hero: WorldGlobe + AIRobot + navigation path + LoopArrow surrounding the globe.
 * Duration: 111 frames (3.7s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, AIRobot, WorldGlobe, LoopArrow } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene23_NavigateWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 32], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const globeEnter = interpolate(frame, [18, 55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopEnter = interpolate(frame, [40, 85], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const pathProgress = interpolate(frame, [50, 105], [0, 1], { extrapolateRight: 'clamp' });

  // Nav path across globe surface (SVG arc representation)
  const pathLen = 600;
  const dashOffset = (1 - pathProgress) * pathLen;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          {/* Large globe in center */}
          <WorldGlobe cx={540} cy={960} r={280}
            opacity={globeEnter}
            scale={1}
            glowColor={COLORS.electric_cyan}/>
          {/* Loop ring around globe */}
          <LoopArrow cx={540} cy={960} r={350}
            color={COLORS.electric_cyan}
            strokeWidth={6}
            dashOffset={(1 - loopEnter) * (2 * Math.PI * 350)}
            opacity={loopEnter}
            showArrow={loopEnter > 0.9}
            label=""
            labelOffset={0}/>
          {/* Navigation path across globe */}
          {pathProgress > 0 && (
            <path
              d="M 300 860 Q 540 740 780 860 Q 900 960 780 1060 Q 540 1160 300 1060"
              fill="none"
              stroke={COLORS.electric_cyan}
              strokeWidth={5}
              strokeDasharray={`${pathLen}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              filter="url(#cyanGlow)"
              opacity={0.9}/>
          )}
          {/* Moving dot on path */}
          {pathProgress > 0.1 && (
            <circle cx={300 + pathProgress * 480} cy={960 - Math.sin(pathProgress * Math.PI) * 120}
              r={14} fill={COLORS.electric_cyan}
              filter="url(#cyanGlow)" opacity={0.95}/>
          )}
          {/* Robot at top-left */}
          <AIRobot cx={180} cy={400} scale={0.65} opacity={enter}
            coreGlow={1} eyeColor={COLORS.electric_cyan} frame={frame} variant="active"/>
          {/* Connection beam from robot */}
          {enter > 0.5 && (
            <line x1={280} y1={470} x2={400} y2={800}
              stroke={COLORS.electric_cyan} strokeWidth={3}
              opacity={enter * 0.5} strokeDasharray="8 6"/>
          )}
          {/* Navigation markers */}
          {loopEnter > 0.5 && [
            { cx: 330, cy: 870, label: 'A' },
            { cx: 650, cy: 790, label: 'B' },
            { cx: 770, cy: 1020, label: 'C' },
          ].map((m, i) => (
            <g key={i}
              opacity={interpolate(frame, [60 + i * 12, 80 + i * 12], [0, 1], { extrapolateRight: 'clamp' })}>
              <circle cx={m.cx} cy={m.cy} r={20}
                fill={COLORS.electric_cyan} opacity={0.15}/>
              <circle cx={m.cx} cy={m.cy} r={12}
                fill={COLORS.electric_cyan}
                filter="url(#cyanGlow)"/>
              <text x={m.cx} y={m.cy + 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={16} fontWeight={900} fill="#000">
                {m.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Title */}
        <div style={{ position: 'absolute', top: 80, left: 80, right: 80, opacity: enter }}>
          <div style={{
            fontSize: 56, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            With the Loop:
            <br/>
            <span style={{ color: COLORS.electric_cyan }}>Navigate the World</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light_gray, marginTop: 10 }}>
            The agent perceives, acts, adapts — autonomously.
          </div>
        </div>

        {/* Capability chips */}
        <div style={{
          position: 'absolute', top: 1460, left: 80, right: 80,
          display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
          opacity: interpolate(frame, [75, 108], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {['Perceive', 'Act', 'Observe', 'Adapt', 'Navigate'].map((label, i) => (
            <div key={i} style={{
              background: 'rgba(0,229,255,0.08)',
              border: `2px solid rgba(0,229,255,0.3)`,
              borderRadius: 40, padding: '12px 28px',
              fontSize: 26, fontWeight: 700, color: COLORS.electric_cyan,
            }}>
              {label}
            </div>
          ))}
        </div>

        <CaptionBar
          text="With the loop, you have something that can navigate the world."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
