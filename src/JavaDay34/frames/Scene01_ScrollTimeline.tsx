/**
 * Scene01_ScrollTimeline — Day 34
 * Duration: 150 frames = 5s (SILENT — no audio plays during this scene)
 * Shows: full 105-day list from architecture_java.md, scrolls to Day 34
 * Row height: 220px — exactly 6 rows visible at a time
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground } from '../helpers/components';

interface Props {
  currentDay: number;
  seriesTitle: string;
}

const ALL_DAYS = [
  { day: 1, topic: "What is OOPs & Why" },
  { day: 2, topic: "Procedural vs OOPs" },
  { day: 3, topic: "What is a Class?" },
  { day: 4, topic: "What is an Object?" },
  { day: 5, topic: "Stack vs Heap Memory" },
  { day: 6, topic: "Pass by Value" },
  { day: 7, topic: "What is a Constructor?" },
  { day: 8, topic: "Default vs Parameterized Constructor" },
  { day: 9, topic: "Constructor Overloading" },
  { day: 10, topic: "Constructor Chaining" },
  { day: 11, topic: "this keyword" },
  { day: 12, topic: "super keyword" },
  { day: 13, topic: "Encapsulation" },
  { day: 14, topic: "Getters & Setters" },
  { day: 15, topic: "Access Modifiers" },
  { day: 16, topic: "Abstraction" },
  { day: 17, topic: "Abstract Class" },
  { day: 18, topic: "Interface" },
  { day: 19, topic: "Abstract Class vs Interface" },
  { day: 20, topic: "Inheritance" },
  { day: 21, topic: "Single Inheritance" },
  { day: 22, topic: "Multilevel Inheritance" },
  { day: 23, topic: "Hierarchical Inheritance" },
  { day: 24, topic: "Why No Multiple Inheritance" },
  { day: 25, topic: "Multiple Inheritance via Interface" },
  { day: 26, topic: "Association" },
  { day: 27, topic: "Aggregation" },
  { day: 28, topic: "Composition" },
  { day: 29, topic: "Association vs Aggregation vs Composition" },
  { day: 30, topic: "Coupling" },
  { day: 31, topic: "Cohesion" },
  { day: 32, topic: "Method Overriding" },
  { day: 33, topic: "@Override Annotation" },
  { day: 34, topic: "Covariant Return Type" },
  { day: 35, topic: "final variable" },
  { day: 36, topic: "final method" },
  { day: 37, topic: "final class" },
  { day: 38, topic: "static variable" },
  { day: 39, topic: "static method" },
  { day: 40, topic: "static block" },
  { day: 41, topic: "Instance vs Static variable" },
  { day: 42, topic: "Object class" },
  { day: 43, topic: "Compile-time Polymorphism" },
  { day: 44, topic: "Method Overloading" },
  { day: 45, topic: "Runtime Polymorphism" },
  { day: 46, topic: "Upcasting" },
  { day: 47, topic: "Downcasting" },
  { day: 48, topic: "instanceof keyword" },
  { day: 49, topic: "instanceof Pattern Matching" },
  { day: 50, topic: "Varargs" },
  { day: 51, topic: "toString()" },
  { day: 52, topic: "equals()" },
  { day: 53, topic: "hashCode()" },
  { day: 54, topic: "Object Cloning" },
  { day: 55, topic: "Shallow vs Deep Clone" },
  { day: 56, topic: "String Immutability" },
  { day: 57, topic: "String Pool" },
  { day: 58, topic: "String vs StringBuilder vs StringBuffer" },
  { day: 59, topic: "Packages" },
  { day: 60, topic: "Import statement" },
  { day: 61, topic: "Interface default method" },
  { day: 62, topic: "Interface static method" },
  { day: 63, topic: "Functional Interface" },
  { day: 64, topic: "Lambda Expressions" },
  { day: 65, topic: "Method References" },
  { day: 66, topic: "Generics basics" },
  { day: 67, topic: "Generic class" },
  { day: 68, topic: "Generic method" },
  { day: 69, topic: "Bounded Generics" },
  { day: 70, topic: "Wildcard ?" },
  { day: 71, topic: "Enum basics" },
  { day: 72, topic: "Enum with constructor & methods" },
  { day: 73, topic: "Nested class" },
  { day: 74, topic: "Static nested class" },
  { day: 75, topic: "Anonymous class" },
  { day: 76, topic: "Sealed Classes" },
  { day: 77, topic: "Records" },
  { day: 78, topic: "Wrapper classes" },
  { day: 79, topic: "Autoboxing / Unboxing" },
  { day: 80, topic: "Serialization" },
  { day: 81, topic: "Comparable" },
  { day: 82, topic: "Comparator" },
  { day: 83, topic: "Immutable class" },
  { day: 84, topic: "finally block preview" },
  { day: 85, topic: "What are Design Patterns?" },
  { day: 86, topic: "Singleton Pattern" },
  { day: 87, topic: "Factory Pattern" },
  { day: 88, topic: "Builder Pattern" },
  { day: 89, topic: "Strategy Pattern" },
  { day: 90, topic: "Observer Pattern" },
  { day: 91, topic: "Decorator Pattern" },
  { day: 92, topic: "Adapter Pattern" },
  { day: 93, topic: "Template Method Pattern" },
  { day: 94, topic: "SOLID — S" },
  { day: 95, topic: "SOLID — O" },
  { day: 96, topic: "SOLID — L" },
  { day: 97, topic: "SOLID — I" },
  { day: 98, topic: "SOLID — D" },
  { day: 99, topic: "Exception Handling" },
  { day: 100, topic: "Custom Exception" },
  { day: 101, topic: "Checked vs Unchecked Exception" },
  { day: 102, topic: "Try-catch-finally" },
  { day: 103, topic: "Collections" },
  { day: 104, topic: "Stream API" },
  { day: 105, topic: "Grand Finale" },
];

const ROW_H = 220;
const VISIBLE = 6;
const VIEW_H = ROW_H * VISIBLE;
const VIEW_Y = Math.round((1920 - VIEW_H) / 2);

export const Scene01_ScrollTimeline: React.FC<Props> = ({ currentDay, seriesTitle }) => {
  const frame = useCurrentFrame();

  const targetScrollY = -(currentDay - 1 - Math.floor(VISIBLE / 2) + 0.5) * ROW_H;
  const clampedTarget = Math.min(0, Math.max(
    -(ALL_DAYS.length - VISIBLE) * ROW_H,
    targetScrollY,
  ));

  const scrollY = interpolate(
    frame,
    [0, 120],
    [0, clampedTarget],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1) },
  );

  const sceneFade = interpolate(frame, [130, 149], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headerEnter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg
        style={{ position: 'absolute', inset: 0, opacity: sceneFade }}
        width={1080}
        height={1920}
      >
        <PaperBackground />

        <text
          x={540} y={190}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={26} fontWeight={500}
          fill={COLORS.cool_silver}
          letterSpacing="0.22em"
          opacity={headerEnter * 0.7}
        >
          {seriesTitle}
        </text>

        <defs>
          <clipPath id={`scrollClip-d${currentDay}`}>
            <rect x={0} y={VIEW_Y} width={1080} height={VIEW_H} />
          </clipPath>
        </defs>

        <rect x={0} y={VIEW_Y} width={1080} height={48} fill={COLORS.bg_paper} opacity={0.85} />
        <rect x={0} y={VIEW_Y + VIEW_H - 48} width={1080} height={48} fill={COLORS.bg_paper} opacity={0.85} />

        <g
          clipPath={`url(#scrollClip-d${currentDay})`}
          transform={`translate(0, ${VIEW_Y + scrollY})`}
        >
          {ALL_DAYS.map((d, idx) => {
            const isCurrent = d.day === currentDay;
            const rowY = idx * ROW_H;

            return (
              <g key={d.day}>
                {isCurrent && (
                  <rect
                    x={60} y={rowY + 10}
                    width={960} height={ROW_H - 20}
                    rx={8}
                    fill={COLORS.orange}
                    opacity={0.06}
                  />
                )}

                {isCurrent && (
                  <rect x={60} y={rowY + 30} width={6} height={160} rx={3} fill={COLORS.orange} />
                )}

                <text
                  x={isCurrent ? 90 : 80}
                  y={rowY + 85}
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={isCurrent ? 52 : 40}
                  fontWeight={isCurrent ? 900 : 600}
                  fill={isCurrent ? COLORS.orange : COLORS.deep_black}
                  opacity={isCurrent ? 1 : 0.45}
                >
                  {`DAY ${d.day}`}
                </text>

                <text
                  x={isCurrent ? 90 : 80}
                  y={rowY + 142}
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={isCurrent ? 34 : 28}
                  fontWeight={isCurrent ? 700 : 400}
                  fill={isCurrent ? COLORS.deep_black : COLORS.cool_silver}
                  opacity={isCurrent ? 0.9 : 0.4}
                >
                  {d.topic}
                </text>

                <line
                  x1={60} y1={rowY + ROW_H - 1}
                  x2={1020} y2={rowY + ROW_H - 1}
                  stroke={COLORS.deep_black}
                  strokeWidth={1}
                  opacity={0.07}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
