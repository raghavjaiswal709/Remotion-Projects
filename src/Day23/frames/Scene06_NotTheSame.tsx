/**
 * Scene 06 — Model vs Agent: Not the Same
 * "Now, a model and an agent are not the same thing."
 * Layout (no overlaps, 1080×1920):
 *   Headline            y=60–200
 *   MODEL box (left)    y=230, w=440, h=620
 *   AGENT box (right)   y=230, w=440, h=620
 *   ≠ badge             y=480 (center, over the divider — z-indexed above boxes)
 *   Key insight         y=900–1100
 *   Architecture note   y=1130–1300
 *   Caption             y=1700
 * Duration: 101 frames (3.37s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets, SlashMark } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const MODEL_PROPS = ['One input', 'One output', 'No loop', 'No memory', 'Stateless'];
const AGENT_PROPS = ['Looping', 'Observes output', 'Adapts', 'Has memory', 'Autonomous'];

export const Scene06_NotTheSame: React.FC = () => {
  const frame = useCurrentFrame();
  const enter      = interpolate(frame, [0, 28],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const badgeEnter = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const insightEnter=interpolate(frame, [46, 75], [0, 1], { extrapolateRight: 'clamp' });

  // Slash drawn diagonally across the two boxes only (y=230→850)
  const slashLen = Math.sqrt((1000 - 80) ** 2 + (850 - 230) ** 2);
  const slashDash = interpolate(frame, [32, 68], [slashLen, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.28}/>

          {/* Vertical divider */}
          <line x1={540} y1={220} x2={540} y2={920}
            stroke={COLORS.light_gray} strokeWidth={1.5}
            strokeDasharray="6 5" opacity={enter * 0.3}/>

          {/* Ambient glows */}
          <ellipse cx={270} cy={580} rx={220} ry={360}
            fill={COLORS.warm_blue} opacity={0.03}/>
          <ellipse cx={810} cy={580} rx={220} ry={360}
            fill={COLORS.electric_cyan} opacity={0.03}/>

          {/* Slash mark */}
          <SlashMark x1={80} y1={230} x2={1000} y2={850}
            dashOffset={slashDash} opacity={badgeEnter * 0.6} sw={10}/>

          {/* Headline underline */}
          <line x1={200} y1={210} x2={880} y2={210}
            stroke={COLORS.electric_cyan} strokeWidth={2.5}
            opacity={enter * 0.35}/>
        </svg>

        {/* ── Headline ── */}
        <div style={{
          position: 'absolute', top: 64, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 62, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            Not The <span style={{ color: COLORS.vibrant_red }}>Same</span> Thing
          </div>
          <div style={{ marginTop: 10, fontSize: 28, color: COLORS.light_gray, fontWeight: 400 }}>
            A critical architectural distinction
          </div>
        </div>

        {/* ── MODEL box — left ── */}
        <div style={{
          position: 'absolute', top: 230, left: 66, width: 448, height: 660,
          background: 'linear-gradient(155deg, #131A2E 0%, #0C1018 100%)',
          borderRadius: 26,
          border: `2.5px solid ${COLORS.warm_blue}45`,
          boxShadow: '0 18px 48px rgba(0,0,0,0.35)',
          padding: '36px 32px',
          opacity: enter,
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {/* Header */}
          <div style={{
            paddingBottom: 20, marginBottom: 20,
            borderBottom: `2px solid rgba(59,130,246,0.25)`,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 50, fontWeight: 900, color: COLORS.warm_blue,
              letterSpacing: '0.06em', fontFamily: '"Inter", sans-serif',
            }}>
              MODEL
            </div>
          </div>
          {/* Icon */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(59,130,246,0.08)',
            border: '2.5px solid rgba(59,130,246,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            alignSelf: 'center', marginBottom: 20,
          }}>
            <svg width={72} height={72} viewBox="0 0 72 72">
              <ellipse cx={36} cy={32} rx={24} ry={20} fill="none" stroke="rgba(59,130,246,0.55)" strokeWidth={2.5}/>
              <line x1={36} y1={12} x2={36} y2={52} stroke="rgba(59,130,246,0.35)" strokeWidth={1.5}/>
              <path d="M 22,24 Q 12,28 14,38 Q 16,46 24,46" fill="none" stroke="rgba(59,130,246,0.45)" strokeWidth={2}/>
              <path d="M 50,24 Q 60,28 58,38 Q 56,46 48,46" fill="none" stroke="rgba(59,130,246,0.45)" strokeWidth={2}/>
              <circle cx={36} cy={54} r={4} fill="rgba(59,130,246,0.5)"/>
            </svg>
          </div>
          {/* Properties */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MODEL_PROPS.map((prop, i) => (
              <div key={i} style={{
                padding: '10px 16px',
                background: 'rgba(59,130,246,0.07)',
                borderRadius: 10,
                fontSize: 24, color: '#7088B8',
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: interpolate(frame, [12 + i * 8, 32 + i * 8], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                <span style={{ color: COLORS.warm_blue, fontWeight: 900, fontSize: 20 }}>›</span>
                {prop}
              </div>
            ))}
          </div>
        </div>

        {/* ── AGENT box — right ── */}
        <div style={{
          position: 'absolute', top: 230, right: 66, width: 448, height: 660,
          background: 'linear-gradient(155deg, #001B22 0%, #001015 100%)',
          borderRadius: 26,
          border: `2.5px solid ${COLORS.electric_cyan}45`,
          boxShadow: '0 18px 48px rgba(0,0,0,0.35)',
          padding: '36px 32px',
          opacity: enter,
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {/* Header */}
          <div style={{
            paddingBottom: 20, marginBottom: 20,
            borderBottom: `2px solid rgba(0,229,255,0.25)`,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 50, fontWeight: 900, color: COLORS.electric_cyan,
              letterSpacing: '0.06em', fontFamily: '"Inter", sans-serif',
            }}>
              AGENT
            </div>
          </div>
          {/* Icon */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(0,229,255,0.07)',
            border: '2.5px solid rgba(0,229,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            alignSelf: 'center', marginBottom: 20,
          }}>
            <svg width={72} height={72} viewBox="0 0 72 72">
              <rect x={18} y={23} width={36} height={28} rx={6} fill="none" stroke="rgba(0,229,255,0.6)" strokeWidth={2.5}/>
              <circle cx={29} cy={36} r={5} fill="rgba(0,229,255,0.7)"/>
              <circle cx={43} cy={36} r={5} fill="rgba(0,229,255,0.7)"/>
              <rect x={31} y={44} width={10} height={3} rx={1.5} fill="rgba(0,229,255,0.5)"/>
              <rect x={33} y={13} width={6} height={10} rx={3} fill="none" stroke="rgba(0,229,255,0.5)" strokeWidth={2}/>
              <circle cx={36} cy={10} r={3} fill="rgba(0,229,255,0.6)"/>
              <line x1={12} y1={29} x2={18} y2={29} stroke="rgba(0,229,255,0.5)" strokeWidth={3} strokeLinecap="round"/>
              <line x1={54} y1={29} x2={60} y2={29} stroke="rgba(0,229,255,0.5)" strokeWidth={3} strokeLinecap="round"/>
              {/* Loop arc */}
              <path d="M 18,56 Q 36,68 54,56" fill="none" stroke="rgba(0,229,255,0.4)" strokeWidth={2} strokeLinecap="round"/>
              <polygon points="12,54 18,60 22,52" fill="rgba(0,229,255,0.5)"/>
            </svg>
          </div>
          {/* Properties */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AGENT_PROPS.map((prop, i) => (
              <div key={i} style={{
                padding: '10px 16px',
                background: 'rgba(0,229,255,0.06)',
                borderRadius: 10,
                fontSize: 24, color: '#50849A',
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: interpolate(frame, [16 + i * 8, 38 + i * 8], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                <span style={{ color: COLORS.electric_cyan, fontWeight: 900, fontSize: 20 }}>›</span>
                {prop}
              </div>
            ))}
          </div>
        </div>

        {/* ── ≠ badge — center, z above boxes ── */}
        <div style={{
          position: 'absolute', top: 513, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: badgeEnter, zIndex: 10,
        }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 35%, #FF6B6B 0%, ${COLORS.vibrant_red} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 52, fontWeight: 900, color: 'white',
            boxShadow: '0 0 40px rgba(239,68,68,0.65), 0 6px 24px rgba(0,0,0,0.4)',
          }}>
            ≠
          </div>
        </div>

        {/* ── Key insight ── y=940 */}
        <div style={{
          position: 'absolute', top: 940, left: 80, right: 80,
          opacity: insightEnter,
          background: 'rgba(239,68,68,0.07)',
          border: '2px solid rgba(239,68,68,0.28)',
          borderRadius: 18, padding: '28px 36px',
        }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#EF4444', marginBottom: 12 }}>
            The Common Mistake
          </div>
          <div style={{ fontSize: 26, color: COLORS.light_gray, lineHeight: 1.65 }}>
            Most developers use <em>model</em> and <em>agent</em> interchangeably.
            <span style={{ color: COLORS.vibrant_red, fontWeight: 700 }}> They are architecturally different.</span>
          </div>
        </div>

        {/* ── Architecture difference note ── y=1150 */}
        <div style={{
          position: 'absolute', top: 1155, left: 80, right: 80,
          display: 'flex', gap: 16,
          opacity: interpolate(frame, [58, 85], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            flex: 1, background: 'rgba(59,130,246,0.08)',
            border: '1.5px solid rgba(59,130,246,0.22)',
            borderRadius: 14, padding: '20px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, color: COLORS.warm_blue, fontWeight: 700, marginBottom: 6 }}>MODEL</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.warm_blue }}>→</div>
            <div style={{ fontSize: 18, color: '#6070A0', marginTop: 4 }}>Linear. Stops.</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            fontSize: 32, color: COLORS.light_gray, fontWeight: 300,
          }}>≠</div>
          <div style={{
            flex: 1, background: 'rgba(0,229,255,0.07)',
            border: '1.5px solid rgba(0,229,255,0.22)',
            borderRadius: 14, padding: '20px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, color: COLORS.electric_cyan, fontWeight: 700, marginBottom: 6 }}>AGENT</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.electric_cyan }}>↻</div>
            <div style={{ fontSize: 18, color: '#407888', marginTop: 4 }}>Loops. Adapts.</div>
          </div>
        </div>

        <CaptionBar
          text="Now, a model and an agent are not the same thing."
          opacity={enter} y={1700}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
