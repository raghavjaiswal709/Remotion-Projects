/**
 * Scene 15 — Feeds Observation Back, Runs Again
 * "It feeds that observation back as the next input, and it runs again."
 * Layout (no overlaps):
 *   Title               y=60–200
 *   Robot (small)       y=200–630  (cy=200, scale=0.55 → height≈418px)
 *   Separator line      y=660
 *   Loop diagram        y=700–1440 (center=1070, r=300 → y=770..1370)
 *   Runs row            y=1490–1570
 *   Caption             y=1710
 * Duration: 141 frames (4.7s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, LoopArrow, AIRobot, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const LOOP_STEPS = [
  { label: 'INPUT',      angle: -90, color: COLORS.warm_blue },
  { label: 'ACT',        angle:   0, color: COLORS.vibrant_green },
  { label: 'OBSERVE',    angle:  90, color: COLORS.electric_cyan },
  { label: 'NEXT\nINPUT',angle: 180, color: '#F59E0B' },
];

// Loop diagram center — sits below robot with clear gap
const LOOP_CX = 540;
const LOOP_CY = 1080;
const LOOP_R  = 280;

export const Scene15_FeedsBack: React.FC = () => {
  const frame = useCurrentFrame();
  const enter         = interpolate(frame, [0, 30],    [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const circ          = 2 * Math.PI * LOOP_R;
  const loopDash      = interpolate(frame, [20, 100],  [circ, 0], { extrapolateRight: 'clamp' });
  const feedbackEnter = interpolate(frame, [82, 126],  [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Robot: cy=220 scale=0.52 → antenna at 220-128*0.52≈154, feet at 220+760*0.52≈615
  const ROBOT_CY    = 220;
  const ROBOT_SCALE = 0.52;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* Ambient glow in robot zone */}
          <ellipse cx={540} cy={420} rx={260} ry={240}
            fill={COLORS.electric_cyan} opacity={0.025}/>

          {/* Separator between robot and loop diagram */}
          <line x1={80} y1={658} x2={1000} y2={658}
            stroke={COLORS.electric_cyan} strokeWidth={1.5}
            strokeDasharray="5 6" opacity={0.2 * enter}/>

          {/* Loop arc */}
          <LoopArrow cx={LOOP_CX} cy={LOOP_CY} r={LOOP_R}
            color={COLORS.electric_cyan} strokeWidth={9}
            dashOffset={loopDash} opacity={enter}
            showArrow={loopDash < 50}/>

          {/* Feedback dashed path */}
          {feedbackEnter > 0 && (
            <g opacity={feedbackEnter}>
              <path d={`M ${LOOP_CX},${LOOP_CY + LOOP_R} Q ${LOOP_CX - 220},${LOOP_CY + LOOP_R + 100} ${LOOP_CX - LOOP_R},${LOOP_CY}`}
                fill="none" stroke="#F59E0B" strokeWidth={5}
                strokeLinecap="round" strokeDasharray="16 10"
                filter="url(#softGlow)"/>
              <text x={LOOP_CX - 200} y={LOOP_CY + LOOP_R + 80}
                fontFamily="'Inter', sans-serif"
                fontSize={26} fontWeight={700} fill="#F59E0B" opacity={0.9}>
                feeds back!
              </text>
            </g>
          )}

          {/* Loop step nodes */}
          {LOOP_STEPS.map((step, i) => {
            const rad = (step.angle * Math.PI) / 180;
            const nx = LOOP_CX + Math.cos(rad) * LOOP_R;
            const ny = LOOP_CY + Math.sin(rad) * LOOP_R;
            const nEnter = interpolate(frame, [16 + i * 18, 42 + i * 18], [0, 1], { extrapolateRight: 'clamp' });
            const lines = step.label.split('\n');
            return (
              <g key={i} opacity={nEnter}>
                <circle cx={nx} cy={ny} r={60}
                  fill={step.color} opacity={0.09} filter="url(#softGlow)"/>
                <circle cx={nx} cy={ny} r={50}
                  fill="#F5F0E8" stroke={step.color} strokeWidth={4}
                  filter="url(#shadow)"/>
                {lines.map((line, li) => (
                  <text key={li}
                    x={nx} y={ny + li * 22 - (lines.length - 1) * 11}
                    textAnchor="middle" dominantBaseline="middle"
                    fontFamily="'Inter', sans-serif"
                    fontSize={20} fontWeight={800}
                    fill={step.color}>
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Robot — scaled small, anchored in upper zone (y≈154..615) */}
          <AIRobot cx={540} cy={ROBOT_CY} scale={enter * ROBOT_SCALE} opacity={enter}
            coreGlow={0.85} frame={frame} variant="active"/>
        </svg>

        {/* Title — above robot, clears antenna region */}
        <div style={{
          position: 'absolute', top: 60, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 52, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.025em',
            lineHeight: 1.15,
          }}>
            Observation →
            <span style={{ color: COLORS.electric_cyan }}> Next Input</span>
          </div>
          <div style={{ fontSize: 26, color: COLORS.light_gray, marginTop: 8 }}>
            The loop that defines an agent
          </div>
        </div>

        {/* Runs indicator row — below loop arc */}
        <div style={{
          position: 'absolute', top: 1460, left: 60, right: 60,
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          opacity: feedbackEnter,
        }}>
          {['RUN 1', '→', 'RUN 2', '→', 'RUN 3', '→', '...'].map((t, i) => (
            <div key={i} style={{
              padding: '10px 18px',
              background: i % 2 === 0 ? 'rgba(0,229,255,0.1)' : 'transparent',
              border: i % 2 === 0 ? '1.5px solid rgba(0,229,255,0.3)' : 'none',
              borderRadius: 10,
              fontSize: 24, fontWeight: 800,
              color: i % 2 === 0 ? COLORS.electric_cyan : COLORS.light_gray,
            }}>
              {t}
            </div>
          ))}
        </div>

        <CaptionBar
          text="It feeds that observation back as the next input, and it runs again."
          opacity={enter} y={1700}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
