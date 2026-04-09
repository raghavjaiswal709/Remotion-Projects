/**
 * Scene 14 — Observes What Output Caused
 * "...observes what that output caused in the world."
 * Hero: World globe, observation beam, agent watching effect.
 * Duration: 78 frames (2.6s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, WorldGlobe, AIRobot, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene14_ObservesWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const globeEnter = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const beamEnter = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>

          {/* World globe */}
          <WorldGlobe cx={540} cy={1180} r={200}
            opacity={globeEnter}
            scale={interpolate(frame, [20, 55], [0.7, 1], { extrapolateRight: 'clamp' })}/>

          {/* Observation beam from robot eyes to world */}
          {beamEnter > 0 && (
            <>
              <line x1={480} y1={610} x2={460} y2={980}
                stroke={COLORS.electric_cyan} strokeWidth={3}
                strokeDasharray="12 8" opacity={beamEnter * 0.5}
                filter="url(#cyanGlow)"/>
              <line x1={600} y1={610} x2={620} y2={980}
                stroke={COLORS.electric_cyan} strokeWidth={3}
                strokeDasharray="12 8" opacity={beamEnter * 0.5}
                filter="url(#cyanGlow)"/>
              {/* Attention nodes */}
              {[1, 2, 3].map(i => (
                <circle key={i}
                  cx={480 + (i/4) * 120} cy={610 + (i/4) * 370}
                  r={8} fill={COLORS.electric_cyan}
                  opacity={beamEnter * (0.4 + Math.sin(frame * 0.15 + i) * 0.2)}/>
              ))}
            </>
          )}

          {/* Robot */}
          <AIRobot cx={540} cy={220} scale={enter} opacity={enter}
            coreGlow={0.7} frame={frame} variant="active"/>

          {/* Effect indicators on world */}
          {beamEnter > 0.4 && (
            <>
              <circle cx={580} cy={1130} r={18}
                fill={COLORS.vibrant_green} opacity={beamEnter * 0.8}
                filter="url(#softGlow)"/>
              <circle cx={500} cy={1210} r={14}
                fill={COLORS.warm_blue} opacity={beamEnter * 0.6}/>
              <text x={540} y={1440} textAnchor="middle"
                fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700}
                fill={COLORS.electric_cyan} opacity={beamEnter}>
                Effect observed
              </text>
            </>
          )}
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
            <span style={{ color: COLORS.electric_cyan }}>Observes</span> the World
          </div>
        </div>

        {/* Description */}
        <div style={{
          position: 'absolute', top: 1450, left: 80, right: 80,
          opacity: interpolate(frame, [45, 70], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(0,229,255,0.06)',
          border: '2px solid rgba(0,229,255,0.2)',
          borderRadius: 16, padding: '22px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, color: COLORS.light_gray, lineHeight: 1.6 }}>
            The agent watches what its action
            <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}> actually caused</span> — not just what it intended.
          </div>
        </div>

        <CaptionBar
          text="observes what that output caused in the world"
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
