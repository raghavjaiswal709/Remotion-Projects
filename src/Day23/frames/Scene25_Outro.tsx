/**
 * Scene 25 — Outro
 * Full-width layout, no overlap:
 *   Top label          y=70
 *   Title              y=180
 *   Robot (centered)   y=420–900
 *   Summary points     y=940–1200
 *   Subscribe CTA      y=1240–1460
 *   Day 24 preview     y=1490–1640
 *   Caption            y=1700
 * Duration: 149 frames (4.97s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { BlackBackground, CaptionBar, GlobalDefs, AIRobot, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene25_Outro: React.FC = () => {
  const frame     = useCurrentFrame();
  const enter     = interpolate(frame, [0,  40],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotEnter= interpolate(frame, [18, 58],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const ctaEnter  = interpolate(frame, [50, 100], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const day24Enter= interpolate(frame, [80, 130], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const fadeOut   = interpolate(frame, [118, 149],[1, 0], { extrapolateRight: 'clamp' });

  // Robot: cx=540, cy=380, scale=0.68 → antenna≈297..feet≈897
  const ROBOT_CY    = 380;
  const ROBOT_SCALE = 0.68;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <BlackBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.3} color={COLORS.electric_cyan}/>
          {/* Top accent line */}
          <line x1={80} y1={155} x2={1000} y2={155}
            stroke={COLORS.electric_cyan} strokeWidth={2}
            opacity={enter * 0.35}/>
          {/* Bottom accent line */}
          <line x1={80} y1={1762} x2={1000} y2={1762}
            stroke={COLORS.electric_cyan} strokeWidth={2}
            opacity={enter * 0.35}/>
          {/* Ambient center glow */}
          <ellipse cx={540} cy={620} rx={320} ry={280}
            fill={COLORS.electric_cyan} opacity={0.025} filter="url(#softGlow)"/>

          {/* Robot — centered, scaled to fit y≈290..900 */}
          <AIRobot cx={540} cy={ROBOT_CY} scale={robotEnter * ROBOT_SCALE} opacity={robotEnter}
            coreGlow={1} eyeColor={COLORS.electric_cyan} frame={frame} variant="active"/>
        </svg>

        {/* Series label */}
        <div style={{
          position: 'absolute', top: 70, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(0,229,255,0.1)',
            border: '1.5px solid rgba(0,229,255,0.3)',
            borderRadius: 40, padding: '10px 36px',
            fontSize: 22, fontWeight: 700, color: COLORS.electric_cyan,
            letterSpacing: '0.1em',
          }}>
            SERIES: HIDDEN WORLD OF AI
          </div>
        </div>

        {/* Day title */}
        <div style={{
          position: 'absolute', top: 180, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 24, color: COLORS.cool_silver, fontWeight: 600,
            letterSpacing: '0.15em', marginBottom: 8,
          }}>
            DAY 23 RECAP
          </div>
          <div style={{
            fontSize: 52, fontWeight: 900, color: '#F0F4F8',
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
            lineHeight: 1.12,
          }}>
            Model vs Agent:
            <br/><span style={{ color: COLORS.electric_cyan }}>The Loop</span>
          </div>
        </div>

        {/* Summary points — full width below robot */}
        <div style={{
          position: 'absolute', top: 940, left: 80, right: 80,
          opacity: ctaEnter,
        }}>
          {[
            { text: 'A model answers — once.',          color: COLORS.warm_blue },
            { text: 'An agent loops — continuously.',   color: COLORS.electric_cyan },
            { text: 'The loop enables navigation.',     color: COLORS.vibrant_green },
            { text: 'The loop IS the definition.',      color: '#F59E0B' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 18,
              marginBottom: 22,
              opacity: interpolate(frame, [54 + i * 12, 80 + i * 12], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: item.color, flexShrink: 0,
                boxShadow: `0 0 8px ${item.color}`,
              }}/>
              <div style={{
                fontSize: 28, fontWeight: 700, color: item.color,
              }}>
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div style={{
          position: 'absolute', top: 1240, left: 80, right: 80,
          textAlign: 'center', opacity: ctaEnter,
          background: 'rgba(0,229,255,0.06)',
          border: '1.5px solid rgba(0,229,255,0.22)',
          borderRadius: 22, padding: '30px 40px',
        }}>
          <div style={{
            fontSize: 20, color: COLORS.cool_silver, fontWeight: 600,
            letterSpacing: '0.08em', marginBottom: 8,
          }}>
            IF THIS CLICKED FOR YOU
          </div>
          <div style={{
            fontSize: 42, fontWeight: 900, color: '#F0F4F8',
            marginBottom: 10, letterSpacing: '-0.02em',
          }}>
            Like · Subscribe
          </div>
          <div style={{ fontSize: 22, color: '#608090' }}>
            Daily breakdowns of AI concepts that matter.
          </div>
        </div>

        {/* Day 24 preview */}
        <div style={{
          position: 'absolute', top: 1490, left: 80, right: 80,
          opacity: day24Enter,
          background: 'rgba(59,130,246,0.07)',
          border: '1.5px solid rgba(59,130,246,0.2)',
          borderRadius: 18, padding: '24px 36px',
        }}>
          <div style={{
            fontSize: 20, color: COLORS.warm_blue, fontWeight: 700,
            marginBottom: 6, letterSpacing: '0.08em',
          }}>
            TOMORROW · DAY 24
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#F0F4F8' }}>
            Tool Use & Function Calling
          </div>
          <div style={{ fontSize: 22, color: '#5878A0', marginTop: 6 }}>
            How agents connect to the real world.
          </div>
        </div>

        <CaptionBar text="See you on Day 24." opacity={ctaEnter} y={1700}/>
      </BlackBackground>
    </AbsoluteFill>
  );
};
