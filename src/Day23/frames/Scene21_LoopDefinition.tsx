/**
 * Scene 21 — Loop Is Not a Feature, It's the Definition
 * "The loop is not a feature. It is the definition."
 * Layout (1080×1920):
 *   Title              top=72  → ~248
 *   Dictionary card    top=278 → ~858
 *   "Why it matters"   top=892 → ~1088
 *   Key insight row    top=1112 → ~1218
 *   Summary callout    top=1250 → ~1362
 *   Properties strip   top=1395 → ~1535
 *   Caption            y=1730
 * Duration: 88 frames (2.93s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const PROPERTIES = [
  { icon: '↻', label: 'Loops continuously', color: COLORS.electric_cyan },
  { icon: '👁', label: 'Observes world', color: '#F59E0B' },
  { icon: '⚡', label: 'Acts on results', color: '#22C55E' },
];

export const Scene21_LoopDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const defEnter = interpolate(frame, [18, 52], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const whyEnter = interpolate(frame, [45, 70], [0, 1], { extrapolateRight: 'clamp' });
  const rowEnter = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>
          {/* Decorative accent line under title */}
          <line x1={80} y1={256} x2={1000} y2={256}
            stroke={COLORS.electric_cyan} strokeWidth={3}
            strokeLinecap="round" opacity={enter * 0.28}/>
          {/* Subtle corner glow */}
          <ellipse cx={540} cy={960} rx={480} ry={680}
            fill={COLORS.warm_blue} opacity={0.012}/>
        </svg>

        {/* ── Title ── */}
        <div style={{
          position: 'absolute', top: 72, left: 80, right: 80,
          opacity: enter,
        }}>
          <div style={{
            fontSize: 68, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.034em',
            lineHeight: 1.0,
          }}>
            Not a Feature.
            <br/>
            <span style={{ color: COLORS.electric_cyan }}>The Definition.</span>
          </div>
        </div>

        {/* ── Dictionary card ── top=278 */}
        <div style={{
          position: 'absolute', top: 278, left: 78, right: 78,
          background: '#FFFEF4',
          borderRadius: 22,
          border: '2px solid #D0C8A0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.8)',
          padding: '42px 48px',
          opacity: defEnter,
          transform: `translateY(${interpolate(frame, [18, 52], [30, 0], { extrapolateRight: 'clamp' })}px)`,
        }}>
          {/* Word + pronunciation */}
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 22,
            borderBottom: `3px solid ${COLORS.electric_cyan}`,
            paddingBottom: 16, marginBottom: 22,
          }}>
            <span style={{
              fontSize: 70, fontWeight: 900, color: COLORS.deep_black,
              fontFamily: '"Inter", sans-serif',
            }}>agent</span>
            <span style={{
              fontSize: 26, color: COLORS.light_gray,
              fontWeight: 400, fontStyle: 'italic',
            }}>
              /ˈeɪdʒ(ə)nt/ · noun
            </span>
          </div>

          {/* Definition 1 */}
          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontSize: 22, color: COLORS.light_gray, marginBottom: 8,
              fontWeight: 700, letterSpacing: '0.04em',
            }}>
              1. GENERAL
            </div>
            <div style={{ fontSize: 28, color: '#505060', lineHeight: 1.6 }}>
              A person or thing that takes action on behalf of another.
            </div>
          </div>

          {/* Definition 2 — AI highlight */}
          <div style={{
            padding: '22px 26px',
            background: 'rgba(0,229,255,0.07)',
            borderLeft: `6px solid ${COLORS.electric_cyan}`,
            borderRadius: '0 14px 14px 0',
            boxShadow: 'inset 0 1px 0 rgba(0,229,255,0.1)',
          }}>
            <div style={{
              fontSize: 22, color: COLORS.electric_cyan, marginBottom: 8,
              fontWeight: 700, letterSpacing: '0.04em',
            }}>
              2. AI / COMPUTING
            </div>
            <div style={{ fontSize: 28, color: '#304050', lineHeight: 1.65 }}>
              A system that{' '}
              <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}>perceives</span>{' '}
              its environment,{' '}
              <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}>acts</span>{' '}
              upon it, and{' '}
              <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}>loops</span>{' '}
              — repeatedly adapting until a goal is reached.
            </div>
          </div>
        </div>

        {/* ── Why the loop matters ── top=892 */}
        <div style={{
          position: 'absolute', top: 892, left: 78, right: 78,
          opacity: whyEnter,
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(0,229,255,0.04) 100%)',
          border: '2px solid rgba(59,130,246,0.22)',
          borderRadius: 18, padding: '26px 36px',
        }}>
          <div style={{
            fontSize: 26, fontWeight: 700, color: COLORS.warm_blue,
            marginBottom: 12, fontFamily: '"Inter", sans-serif',
          }}>
            Why the loop is fundamental
          </div>
          <div style={{ fontSize: 26, color: COLORS.light_gray, lineHeight: 1.65 }}>
            The loop is not something you add to make a model smarter.
            It is what <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}>structurally separates</span> an
            agent from a model call.
          </div>
        </div>

        {/* ── Key insight row ── top=1112 */}
        <div style={{
          position: 'absolute', top: 1112, left: 78, right: 78,
          display: 'flex', alignItems: 'center', gap: 16,
          opacity: rowEnter,
        }}>
          {[
            { label: 'Feature', color: '#EF4444', cross: true, bg: 'rgba(239,68,68,0.07)' },
            { label: '→', color: '#8090A0', cross: false, bg: 'transparent' },
            { label: 'Definition', color: '#00E5FF', cross: false, bg: 'rgba(0,229,255,0.07)' },
          ].map((t, i) => (
            <div key={i} style={{
              flex: t.label === '→' ? 0 : 1,
              textAlign: 'center',
              padding: t.label === '→' ? '0 10px' : '22px',
              background: t.bg,
              borderRadius: 14,
              border: t.label === '→' ? 'none' : `2px solid ${t.color}35`,
            }}>
              <div style={{
                fontSize: t.label === '→' ? 42 : 34,
                fontWeight: 900, color: t.color,
                fontFamily: '"Inter", sans-serif',
                textDecoration: t.cross ? 'line-through' : 'none',
                textDecorationColor: '#EF4444',
                textDecorationThickness: 4,
              }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Summary callout ── top=1250 */}
        <div style={{
          position: 'absolute', top: 1250, left: 78, right: 78,
          opacity: interpolate(frame, [62, 84], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(0,229,255,0.06)',
          border: '2px solid rgba(0,229,255,0.22)',
          borderRadius: 16, padding: '22px 36px', textAlign: 'center',
        }}>
          <div style={{
            fontSize: 30, fontWeight: 700, color: COLORS.electric_cyan,
            fontFamily: '"Inter", sans-serif',
          }}>
            Remove the loop — you no longer have an agent.
          </div>
        </div>

        {/* ── Properties strip ── top=1395 */}
        <div style={{
          position: 'absolute', top: 1395, left: 78, right: 78,
          display: 'flex', gap: 16,
          opacity: interpolate(frame, [68, 88], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {PROPERTIES.map((prop, i) => (
            <div key={i} style={{
              flex: 1,
              background: 'rgba(13,13,13,0.04)',
              border: `1.5px solid ${prop.color}30`,
              borderRadius: 14, padding: '18px 12px',
              textAlign: 'center',
              opacity: interpolate(frame, [68 + i * 6, 88 + i * 6], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(frame, [68 + i * 6, 88 + i * 6], [16, 0], { extrapolateRight: 'clamp' })}px)`,
            }}>
              <div style={{
                fontSize: 32, marginBottom: 8,
                color: prop.color,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 900,
              }}>
                {prop.icon}
              </div>
              <div style={{
                fontSize: 20, color: prop.color,
                fontWeight: 700, fontFamily: '"Inter", sans-serif',
              }}>
                {prop.label}
              </div>
            </div>
          ))}
        </div>

        <CaptionBar
          text="The loop is not a feature. It is the definition."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
