/**
 * Scene 15 — Feeds Observation Back, Runs Again
 * "It feeds that observation back as the next input, and it runs again."
 * Hero: Full animated loop — observation flows back as arrow, cycle spins.
 * Duration: 141 frames (4.7s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, LoopArrow, AIRobot, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene15_FeedsBack: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const circ = 2 * Math.PI * 300;
  const loopDash = interpolate(frame, [20, 100], [circ, 0], { extrapolateRight: 'clamp' });
  const feedbackEnter = interpolate(frame, [80, 125], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  const LOOP_STEPS = [
    { label: 'INPUT', angle: -90, color: COLORS.warm_blue },
    { label: 'ACT', angle: 0, color: COLORS.vibrant_green },
    { label: 'OBSERVE', angle: 90, color: COLORS.electric_cyan },
    { label: 'NEXT\nINPUT', angle: 180, color: '#F59E0B' },
  ];

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>

          {/* Ambient */}
          <ellipse cx={540} cy={960} rx={400} ry={400}
            fill={COLORS.electric_cyan} opacity={0.025}/>

          {/* Main loop */}
          <LoopArrow cx={540} cy={1000} r={300}
            color={COLORS.electric_cyan} strokeWidth={10}
            dashOffset={loopDash} opacity={enter}
            showArrow={loopDash < 60}/>

          {/* Loop step nodes */}
          {LOOP_STEPS.map((step, i) => {
            const rad = (step.angle * Math.PI) / 180;
            const nx = 540 + Math.cos(rad) * 300;
            const ny = 1000 + Math.sin(rad) * 300;
            const nEnter = interpolate(frame, [15 + i*20, 40 + i*20], [0, 1], { extrapolateRight: 'clamp' });
            const lines = step.label.split('\n');
            return (
              <g key={i} opacity={nEnter}>
                {/* Halo */}
                <circle cx={nx} cy={ny} r={62}
                  fill={step.color} opacity={0.1}
                  filter="url(#softGlow)"/>
                {/* Circle */}
                <circle cx={nx} cy={ny} r={52}
                  fill="#F5F0E8" stroke={step.color} strokeWidth={5}
                  filter="url(#shadow)"/>
                {/* Label */}
                {lines.map((line, li) => (
                  <text key={li}
                    x={nx} y={ny + li * 22 - (lines.length - 1) * 11}
                    textAnchor="middle" dominantBaseline="middle"
                    fontFamily="'Inter', sans-serif"
                    fontSize={21} fontWeight={800}
                    fill={step.color}>
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Feedback arrow — observation → next input */}
          {feedbackEnter > 0 && (
            <g opacity={feedbackEnter}>
              <path d={`M 540,1300 Q 300,1440 240,1000`}
                fill="none" stroke="#F59E0B" strokeWidth={6}
                strokeLinecap="round" strokeDasharray="18 10"
                filter="url(#softGlow)"/>
              <text x={320} y={1390}
                fontFamily="'Caveat', cursive"
                fontSize={30} fill="#F59E0B" opacity={0.9}>
                feeds back!
              </text>
            </g>
          )}

          {/* Robot (small, top) */}
          <AIRobot cx={540} cy={200} scale={enter * 0.55} opacity={enter}
            coreGlow={0.8} frame={frame} variant="active"/>
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 80, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 60, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            Observation
            <span style={{ color: COLORS.electric_cyan }}> → Next Input</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light_gray, marginTop: 10 }}>
            The loop that defines an agent
          </div>
        </div>

        {/* "Runs again" indicator */}
        <div style={{
          position: 'absolute', top: 1500, left: 80, right: 80,
          display: 'flex', gap: 14, justifyContent: 'center',
          opacity: feedbackEnter,
        }}>
          {['RUN 1', '→', 'RUN 2', '→', 'RUN 3', '→', '...'].map((t, i) => (
            <div key={i} style={{
              padding: '10px 18px',
              background: i % 2 === 0 ? 'rgba(0,229,255,0.1)' : 'transparent',
              border: i % 2 === 0 ? '2px solid rgba(0,229,255,0.3)' : 'none',
              borderRadius: 10,
              fontSize: 26, fontWeight: 800,
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
