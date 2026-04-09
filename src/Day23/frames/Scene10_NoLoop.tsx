/**
 * Scene 10 — No Loop, No Observation, No Adaptation
 * "There is no loop. No observation. No adaptation."
 * Hero: Three big red X's crossing out LOOP, OBSERVE, ADAPT boxes.
 * Duration: 164 frames (5.47s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const ABSENT_FEATURES = [
  {
    label: 'LOOP', desc: 'No repeat execution', color: '#EF4444',
    iconSvg: (
      <svg width={64} height={64} viewBox="0 0 64 64">
        <path d="M 52,32 A 20,20 0 1,1 32,12" fill="none" stroke="#EF4444" strokeWidth={4} strokeLinecap="round"/>
        <polygon points="32,4 40,16 24,16" fill="#EF4444"/>
      </svg>
    ),
  },
  {
    label: 'OBSERVATION', desc: 'Cannot see its output effect', color: '#EF4444',
    iconSvg: (
      <svg width={64} height={64} viewBox="0 0 64 64">
        <ellipse cx={32} cy={32} rx={22} ry={13} fill="none" stroke="#EF4444" strokeWidth={3.5}/>
        <circle cx={32} cy={32} r={7} fill="#EF4444" opacity={0.7}/>
        <circle cx={32} cy={32} r={3} fill="#EF4444"/>
      </svg>
    ),
  },
  {
    label: 'ADAPTATION', desc: 'Cannot change its approach', color: '#EF4444',
    iconSvg: (
      <svg width={64} height={64} viewBox="0 0 64 64">
        <circle cx={32} cy={32} r={22} fill="none" stroke="#EF4444" strokeWidth={3.5}/>
        <circle cx={32} cy={32} r={13} fill="none" stroke="#EF4444" strokeWidth={2.5}/>
        <circle cx={32} cy={32} r={5} fill="#EF4444"/>
      </svg>
    ),
  },
];

export const Scene10_NoLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>
          {/* Background pattern */}
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={540} cy={960} r={160 + i * 120}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={1}
              strokeDasharray="6 10" opacity={enter * 0.04}/>
          ))}
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 100, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 68, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            What the Model
            <br/>
            <span style={{ color: COLORS.vibrant_red }}>Does Not Have</span>
          </div>
        </div>

        {/* Feature cards with X */}
        {ABSENT_FEATURES.map((f, i) => {
          const fEnter = interpolate(frame, [20 + i * 35, 50 + i * 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
          const xEnter = interpolate(frame, [45 + i * 35, 70 + i * 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
          return (
            <div key={i} style={{
              position: 'absolute', top: 380 + i * 380, left: 80, right: 80,
              opacity: fEnter,
            }}>
              {/* Feature box */}
              <div style={{
                background: '#0D1A2E',
                borderRadius: 24,
                border: `2px solid rgba(239,68,68,0.15)`,
                padding: '36px 40px',
                display: 'flex', alignItems: 'center', gap: 32,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ flexShrink: 0 }}>{f.iconSvg}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 44, fontWeight: 900, color: '#6080A0',
                    letterSpacing: '0.04em',
                    textDecoration: xEnter > 0.5 ? 'line-through' : 'none',
                    textDecorationColor: COLORS.vibrant_red,
                  }}>
                    {f.label}
                  </div>
                  <div style={{ fontSize: 26, color: '#405060', marginTop: 8 }}>
                    {f.desc}
                  </div>
                </div>
                {/* X overlay */}
                {xEnter > 0 && (
                  <div style={{
                    width: 80, height: 80,
                    borderRadius: '50%',
                    background: COLORS.vibrant_red,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: xEnter,
                    transform: `scale(${interpolate(frame, [45+i*35, 65+i*35], [0.4, 1], { extrapolateRight: 'clamp' })})`,
                    boxShadow: '0 0 30px rgba(239,68,68,0.5)',
                    flexShrink: 0,
                  }}>
                    <svg width={36} height={36} viewBox="0 0 36 36">
                      <line x1={6} y1={6} x2={30} y2={30} stroke="white" strokeWidth={4} strokeLinecap="round"/>
                      <line x1={30} y1={6} x2={6} y2={30} stroke="white" strokeWidth={4} strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div style={{
          position: 'absolute', top: 1570, left: 80, right: 80,
          opacity: interpolate(frame, [120, 155], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(239,68,68,0.06)',
          border: '2px solid rgba(239,68,68,0.2)',
          borderRadius: 16, padding: '24px 36px', textAlign: 'center',
        }}>
          <div style={{
            fontSize: 32, fontWeight: 700, color: COLORS.vibrant_red,
          }}>
            Without these three things, there is no agency.
          </div>
        </div>

        <CaptionBar
          text="There is no loop. No observation. No adaptation."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
