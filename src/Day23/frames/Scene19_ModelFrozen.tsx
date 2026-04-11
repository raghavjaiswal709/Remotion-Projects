/**
 * Scene 19 — Model Is Frozen After One Step
 * "The model is frozen after one step."
 * Hero: Model diagram with frost/ice overlay, frozen animation, cracked processor.
 * Duration: 56 frames (1.87s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, ProcessorUnit } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene19_ModelFrozen: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const frozenEnter = interpolate(frame, [18, 46], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          {/* Ice overlay */}
          {frozenEnter > 0 && (
            <rect x={0} y={0} width={1080} height={1920}
              fill="#A8D8EA" opacity={frozenEnter * 0.06}/>
          )}
          {/* ProcessorUnit frozen */}
          <ProcessorUnit cx={540} cy={880} size={380}
            opacity={enter}
            scale={1}
            variant="frozen" label="MODEL" frame={frame}/>
          {/* Freeze crystals radiating out */}
          {frozenEnter > 0.3 && [0,45,90,135,180,225,270,315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const len = 120 + (i % 3) * 40;
            return (
              <g key={i} opacity={frozenEnter * 0.6}>
                <line
                  x1={540 + Math.cos(rad) * 190}
                  y1={880 + Math.sin(rad) * 190}
                  x2={540 + Math.cos(rad) * (190 + len)}
                  y2={880 + Math.sin(rad) * (190 + len)}
                  stroke="#A8D8EA" strokeWidth={3}/>
                <circle
                  cx={540 + Math.cos(rad) * (190 + len)}
                  cy={880 + Math.sin(rad) * (190 + len)}
                  r={8} fill="#A8D8EA" opacity={0.8}/>
              </g>
            );
          })}
          {/* FROZEN text overlay */}
          {frozenEnter > 0.6 && (
            <text x={540} y={880} textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
              fill="#A8D8EA" letterSpacing="0.04em"
              opacity={frozenEnter * 0.8}
              filter="url(#softGlow)">
              FROZEN
            </text>
          )}
        </svg>

        {/* Title */}
        <div style={{ position: 'absolute', top: 88, left: 80, right: 80, textAlign: 'center', opacity: enter }}>
          <div style={{
            fontSize: 66, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            The Model Is
            <span style={{ color: '#A8D8EA' }}> Frozen</span>
          </div>
          <div style={{ fontSize: 30, color: COLORS.light_gray, marginTop: 10 }}>
            After one step, it stops completely.
          </div>
        </div>

        {/* Single-pass pipeline strip */}
        <div style={{
          position: 'absolute', top: 308, left: 78, right: 78,
          opacity: enter,
          display: 'flex', alignItems: 'center', gap: 0,
        }}>
          {[
            { label: 'INPUT', color: COLORS.warm_blue, bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
            { label: '→', color: COLORS.light_gray, bg: 'transparent', border: 'transparent' },
            { label: 'MODEL', color: '#A8D8EA', bg: 'rgba(168,216,234,0.1)', border: 'rgba(168,216,234,0.35)' },
            { label: '→', color: COLORS.light_gray, bg: 'transparent', border: 'transparent' },
            { label: 'OUTPUT', color: COLORS.electric_cyan, bg: 'rgba(0,229,255,0.08)', border: 'rgba(0,229,255,0.3)' },
            { label: '→', color: COLORS.light_gray, bg: 'transparent', border: 'transparent' },
            { label: '✗ STOP', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.35)' },
          ].map((item, i) => (
            <div key={i} style={{
              flex: item.label.includes('→') ? 0 : 1,
              padding: item.label.includes('→') ? '0 6px' : '14px 8px',
              background: item.bg,
              border: item.label.includes('→') ? 'none' : `1.5px solid ${item.border}`,
              borderRadius: 10,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: item.label.includes('→') ? 28 : 20,
                fontWeight: 800, color: item.color,
                fontFamily: '"Inter", sans-serif',
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Callout — moved higher */}
        <div style={{
          position: 'absolute', top: 1160, left: 80, right: 80,
          opacity: interpolate(frame, [26, 48], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(168,216,234,0.07)',
          border: '2px solid rgba(168,216,234,0.28)',
          borderRadius: 16, padding: '24px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 30, color: '#A8D8EA', fontWeight: 700 }}>
            It cannot continue. There is no next step.
          </div>
        </div>

        {/* Secondary note */}
        <div style={{
          position: 'absolute', top: 1310, left: 80, right: 80,
          opacity: interpolate(frame, [32, 52], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(239,68,68,0.06)',
          border: '1.5px solid rgba(239,68,68,0.2)',
          borderRadius: 14, padding: '20px 30px',
        }}>
          <div style={{ fontSize: 27, color: COLORS.light_gray, lineHeight: 1.65 }}>
            No loop. No observation. No adaptation.
            The model has done <span style={{ color: '#EF4444', fontWeight: 700 }}>exactly one thing</span>.
          </div>
        </div>

        <CaptionBar text="The model is frozen after one step." opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
