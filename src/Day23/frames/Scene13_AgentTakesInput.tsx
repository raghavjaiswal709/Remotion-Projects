/**
 * Scene 13 — Agent Takes Input, Produces Output
 * "An agent takes input, produces output..."
 * Hero: Agent cycle diagram — first half of loop drawn.
 * Duration: 121 frames (4.03s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, AIRobot, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene13_AgentTakesInput: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotEnter = interpolate(frame, [10, 55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const arrowEnter = interpolate(frame, [50, 90], [0, 1], { extrapolateRight: 'clamp' });
  const circ = 2 * Math.PI * 200;
  const halfDash = interpolate(frame, [50, 100], [circ * 0.5, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>

          {/* Robot */}
          <AIRobot cx={540} cy={350} scale={robotEnter} opacity={robotEnter}
            coreGlow={0.7} frame={frame} variant="active"/>

          {/* Half loop arc */}
          <g opacity={arrowEnter}>
            <circle cx={540} cy={1380} r={200}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth={8}
              strokeDasharray={`${circ * 0.5} ${circ}`}
              strokeDashoffset={halfDash}
              strokeLinecap="round"
              transform={`rotate(-90 540 1380)`}
              filter="url(#cyanGlow)"/>
            {/* Arrowhead */}
            {halfDash < 20 && (
              <polygon points="520,1183 540,1140 560,1183"
                fill={COLORS.electric_cyan} filter="url(#cyanGlow)"/>
            )}
          </g>

          {/* INPUT / OUTPUT labels on arc */}
          <text x={320} y={1390} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
            fill={COLORS.warm_blue} opacity={arrowEnter}>
            INPUT
          </text>
          <text x={760} y={1390} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
            fill={COLORS.electric_cyan} opacity={arrowEnter}>
            OUTPUT
          </text>
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 100, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 62, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            Agent: Input →
            <span style={{ color: COLORS.electric_cyan }}> Output</span>
          </div>
          <div style={{ fontSize: 30, color: COLORS.light_gray, marginTop: 8 }}>
            But it doesn't stop there...
          </div>
        </div>

        {/* Boxes */}
        <div style={{
          position: 'absolute', top: 1200, left: 80, right: 80,
          display: 'flex', gap: 16, opacity: arrowEnter,
        }}>
          <div style={{
            flex: 1, background: '#0A1428', borderRadius: 16,
            border: `2px solid ${COLORS.warm_blue}50`,
            padding: '24px 28px',
          }}>
            <div style={{ fontSize: 24, color: COLORS.warm_blue, fontWeight: 800, marginBottom: 8 }}>INPUT</div>
            <div style={{ fontSize: 26, color: '#8090C0', fontFamily: 'monospace' }}>
              "Book me a flight to Tokyo"
            </div>
          </div>
          <div style={{
            flex: 1, background: '#001820', borderRadius: 16,
            border: `2px solid ${COLORS.electric_cyan}50`,
            padding: '24px 28px',
          }}>
            <div style={{ fontSize: 24, color: COLORS.electric_cyan, fontWeight: 800, marginBottom: 8 }}>OUTPUT</div>
            <div style={{ fontSize: 26, color: '#609080', fontFamily: 'monospace' }}>
              flight_search({"\"city\": \"Tokyo\""})
            </div>
          </div>
        </div>

        <CaptionBar
          text="An agent takes input, produces output..."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
