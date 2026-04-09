/**
 * Scene 09 — One Step Done
 * "One step done."
 * Hero: Satisfying completion checkmark, single step diagram with big check.
 * Duration: 36 frames (1.2s) — brief punchy scene
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene09_OneStepDone: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const checkScale = interpolate(frame, [6, 24], [0.3, 1.05], { extrapolateRight: 'clamp', easing: ease });
  const checkLen = 220;
  const checkDash = interpolate(frame, [10, 28], [checkLen, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          {/* Ambient glow */}
          <ellipse cx={540} cy={960} rx={300} ry={300}
            fill={COLORS.vibrant_green} opacity={enter * 0.08}
            filter="url(#softGlow)"/>
          {/* Large completion ring */}
          <circle cx={540} cy={960} r={260}
            fill="none" stroke={COLORS.vibrant_green} strokeWidth={8}
            opacity={enter * 0.4}/>
          <circle cx={540} cy={960} r={230}
            fill="none" stroke={COLORS.vibrant_green} strokeWidth={4}
            opacity={enter * 0.2} strokeDasharray="20 10"/>
          {/* Check mark */}
          <g transform={`translate(540, 960) scale(${checkScale}) translate(-540, -960)`}>
            <polyline
              points="400,960 500,1060 690,840"
              fill="none" stroke={COLORS.vibrant_green} strokeWidth={22}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash}
              filter="url(#softGlow)"/>
          </g>
        </svg>

        {/* Text */}
        <div style={{
          position: 'absolute', top: 740, left: 80, right: 80,
          textAlign: 'center',
          opacity: enter,
        }}>
          <div style={{
            fontSize: 44, fontWeight: 700, color: COLORS.light_gray,
            letterSpacing: '0.06em', marginBottom: 16,
          }}>
            STEP COMPLETE
          </div>
        </div>

        <div style={{
          position: 'absolute', top: 1120, left: 80, right: 80,
          textAlign: 'center',
          opacity: enter,
        }}>
          <div style={{
            fontSize: 80, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
          }}>
            One step done.
          </div>
          <div style={{ fontSize: 32, color: COLORS.light_gray, marginTop: 16 }}>
            The model's job is finished.
          </div>
        </div>

        <CaptionBar text="One step done." opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
