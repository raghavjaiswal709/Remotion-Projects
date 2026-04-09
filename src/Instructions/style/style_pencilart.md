{
  "style_name": "style_pencilart",
  "video_style_name": "Premium Colored Pencil Tech Explainer — Deep Detail Edition",

  "global_style_description": "Minimalist super aesthetic highly precise colored pencil technical illustration style for 2D animation. Clean lines, no scribbles, no messy sketches. Clean off-white paper-textured background with very subtle grain. Soft clean crisp hand-drawn black technical outlines, precise colored pencil shading and light hatching for depth. Strict color palette: deep black outlines, vibrant electric cyan for all tech and data flows and highlights, subtle vibrant accent color per topic or brand, soft white and gray fills. No hands, no fingers, no people, no faces, no 3D, no photorealism, no ripple, no glow, no pulse, no motion lines, no animation effects inside the illustration. Each scene must visually TELL the story of the spoken sentence — not just decorate it. Every scene is a self-contained pencil diagram or infographic that makes the concept immediately understandable without audio. Rich symbolic detail is allowed and encouraged — technical diagrams, cross-sections, topographic maps, comparison panels, timeline infographics, scorebars, blueprint-style cutaways — all rendered in colored pencil style. Soft premium educational look like high-end illustrated tech explainer. Ultra clean resolution. Typography constraint: Do not render any structural meta-text, UI tags, numbers used as coordinates, or random text. Only render explicitly requested labels.",

  "color_palette": {
    "background": "Clean off-white paper-textured surface with very subtle grain — consistently warm off-white across all illustration scenes. Not pure white. Not gray. Specifically the warm tone of high-quality cartridge or watercolor paper.",
    "color_1_electric_cyan": "electric cyan — primary color for all tech elements, data flows, connection arrows, highlights, and key technical labels",
    "color_2_deep_black": "deep black — all structural outlines, blueprint borders, cross-section dividers, and text elements",
    "color_3_cool_silver": "cool silver — fills for secondary structural elements, neutral zones, passive mechanical components",
    "color_4_soft_white": "soft white — inner fills, clean zones within diagrams, negative space elements inside objects",
    "color_5_vibrant_red": "vibrant red — rejection markers, error states, broken elements, negative examples (use sparingly, prefer structural breaks over large X marks)",
    "color_6_vibrant_green": "vibrant green — success states, positive examples, active healthy systems (use sparingly, prefer structural connections over large checkmarks)",
    "color_7_topic_accent": "topic accent color — one warm vibrant accent chosen per episode based on the topic or brand (amber for engineering systems, warm blue for data topics, green for biology, orange for physics) — used for the central hero object and any logo element",
    "color_8_light_gray": "light gray — subtle hatching fills, depth shading bands, secondary zone backgrounds, supporting structural fills",
    "color_9_warm_amber": "warm amber — technical diagram fills, cutaway layer highlights, structural zone accents when the topic accent is not amber",
    "color_10_soft_pencil_blue": "soft pencil blue — secondary data stream indicators, light path lines, soft structural fills on supporting elements",
    "outline_color": "Deep black for all primary structural outlines and borders — electric cyan for data flow arrows and connection lines — always crisp and precise. Never rough, never sketchy, never hairline-thin.",
    "fill_rule": "Every fill is a clean precise colored pencil application — flat base color with optional subtle hatching strokes for depth where needed. No gradients. No digital blending. No soft glow edges. No photorealistic shading. The pencil mark quality is professional and precise — like a senior technical illustrator, never a child's sketch."
  },

  "composition_rules": [
    "Every scene must VISUALLY EXPLAIN the spoken sentence — the illustration alone must communicate the core idea without needing audio. Ask: could someone understand this concept from the image alone?",
    "Central hero object must be fully visible with a subtle pencil drop shadow underneath — positioned and sized based on the specific content of the speech line.",
    "Vary object angle and position per scene for natural video flow — portrait upright, slightly tilted, landscape, left-aligned or right-aligned or centered — never the same layout twice in a row.",
    "Always show the full body of the central object — never crop it at the edges.",
    "Visual content must be directly relevant to the spoken sentence — subject, action, and any comparisons come directly from the speech. Never add decorative elements not called out in the speech.",
    "Use split-panel comparison layouts when the speech contrasts two things or compares two states.",
    "Use timeline or infographic layouts when the speech describes a sequence of steps or a process.",
    "Use cross-section or blueprint layouts when the speech explains internal structure or hidden layers.",
    "Supporting symbolic elements — contour depth maps, reference pointers, barricade walls, calendar strips — are added only when they are directly relevant to the spoken sentence, not as decoration.",
    "Text labels inside illustrations must be in clean delicate pencil lettering — labels, measurements, captions, and legends add informational richness when they directly explain the speech content.",
    "Use structural breaks or barrier walls for negatives, connected geometry for positives, cyan arrows for data and process flow — used consistently and intelligently.",
    "Maximum two to three directional flow arrows per scene — strictly mapped from source to destination as described in the speech. Never a web of floating arrows.",
    "Maintain generous negative space in the background — the off-white paper is a feature, not a failure. Complexity lives in the diagram area only.",
    "All text inside illustrations must be in clean delicate pencil lettering style — no bold digital fonts, no heavy sans-serif, no UI-looking typography."
  ],

  "layout_types": {
    "single_hero": "One central object dominates the frame, centered or slightly off-center, with supporting symbolic elements arranged cleanly around it — all derived from the speech content. Off-white paper background with generous negative space. A subtle pencil drop shadow under the central object. Best for simple single-concept sentences.",
    "split_panel": "Frame divided by a bold vertical or horizontal deep black pencil line into two contrasting panels. Left panel and right panel each show one side of the comparison described in the speech. Each panel has its own primary colored pencil element. Off-white paper background in both panels. Best for comparisons, before and after, contrasting states.",
    "timeline": "A horizontal or vertical timeline line in deep black spans the frame with labeled steps connected by tick marks and small pencil-drawn icons. Each step corresponds directly to something named in the speech. Best for sequences, processes, lifecycle descriptions.",
    "cross_section": "The central object is shown as a cutaway blueprint diagram revealing internal layers or zones. Each layer is a different palette color, separated by deep black outline strokes with light pencil hatching. Best for explaining internal architecture, encapsulation, hidden structure.",
    "infographic": "The full frame is used as a rich pencil diagram — object graphs, pointer arrays, reference assignments, inheritance trees, flow maps — with the central concept as the organizing element. Best for complex technical concepts requiring visual proof through a system diagram."
  },

  "visual_language_rules": {
    "data_flow": "Engineered electric cyan arrows, strictly and logically mapped, pointing directly from source object to target object. Arrow lines are clean, straight or gently curved — never random or floating. Maximum two to three arrows per scene.",
    "rejection": "Disconnected pencil lines, shattered paths, or solid barrier walls drawn in deep black with subtle vibrant red highlights at the break points — avoid large cartoonish X marks.",
    "approval": "Solid structural connections, tightly interlocking gears, or completed circuits with subtle vibrant green highlights — avoid large cartoonish checkmarks.",
    "barrier_wall": "Double-border rectangle with deep black cross-hatch fill representing isolation or protection — used when the speech describes encapsulation, barriers, or security layers.",
    "attack_arrows": "Arrows pointing toward an object that shatter on contact — shown as clean pencil shatter lines radiating from impact point with vibrant red at tip — used only when the speech describes something being blocked or rejected.",
    "memory_heap": "Large clean cloud-like or designated block shape in light gray with deep black outline representing a memory area or storage zone.",
    "pointer_reference": "Bold electric cyan line with an exact pointer tip (small solid triangle) referring from a reference variable block to its target object — used only when the speech describes a reference or pointer relationship.",
    "blueprint_layers": "Stacked labeled rectangles with light pencil hatching showing internal zones — used when the speech describes internal structure.",
    "badge_array": "Small circular medallion icons arranged in a semicircle or grid, each with a distinct symbol inside in deep black — used when the speech describes multiple items, options, or components.",
    "calendar_strip": "A horizontal strip of evenly spaced day or time segments with small pencil icons stamped on relevant segments — used when the speech describes a time-based pattern."
  },

  "depth_and_density_rules": [
    "DIAGRAM AREA: The central diagram must be richly detailed and occupy the dominant area of the frame. Show all components of the named object — each layer, each sub-element — labeled cleanly in pencil lettering.",
    "SUPPORTING CONTEXT: Supporting elements must be visible and directly tied to what the speech says. Never add atmospheric background objects that are not named or implied in the speech.",
    "PAPER BACKGROUND: The off-white paper texture fills all negative space. It is not empty — it is premium. Never fill the background with additional drawings or patterns to 'fill' space. Generous negative space is part of the design.",
    "CONNECTORS PRECISELY MAPPED: Every data flow arrow and connection line must go from a named source to a named destination as described in the speech. Maximum two to three arrows per scene. No floating decorative arrows.",
    "SCALE REFERENCES: When the speech compares sizes, show a recognizable object at accurate relative scale using a clean pencil icon."
  ],

  "explanation_override_style": {
    "when_to_use": "When the scene's speech line contains no specific physical object or process that can be illustrated — such as the series anchor line, abstract statistics, pure definitions, or conceptual statements — use this override style instead of the pencilart illustration style.",
    "background": "Pure matte black, no paper texture, no off-white.",
    "illustration": "A single minimal clean icon or simple line diagram drawn in cool silver and soft white — the simplest possible visual that represents the concept.",
    "text_labels": "Silver glossy metallic styling, clean minimal lettering, only the essential words from the speech line.",
    "feel": "Minimal, premium, informational — like a sleek tech infographic card on a black screen. No pencil texture on these scenes."
  },

  "scene1_day_card_template": "Clean off-white paper-textured background with very subtle grain filling the entire frame — the signature pencilart paper surface. Maximum negative space. Centered in the absolute middle of the frame, a single hero typographic block containing exactly three lines drawn in precise colored pencil lettering, horizontally centered, with generous vertical spacing between each line. Line one reads exactly 'DAY [N]' — drawn in electric cyan precise pencil strokes, bold crisp weight, at an enormous size spanning roughly half the frame width. Line two reads exactly '[SECRET TITLE]' — drawn in deep black clean pencil outline strokes, bold crisp weight, at a medium-large size, horizontally centered directly below line one with a clear comfortable gap. Line three reads exactly 'HIDDEN WORLD SECRETS' — drawn in light gray pencil at a small size, horizontally centered directly below line two with a clear gap. The three lines form a single vertical stack perfectly centered both horizontally and vertically in the frame. Massive off-white paper negative space surrounds the text on all four sides. No other text. No borders. No illustrations. No decorative elements. Only these three lines on the paper background.",

  "critical_rules": [
    "OFF-WHITE PAPER BACKGROUND ONLY — for all illustration scenes. Not pure white. Not gray. Specifically warm off-white paper texture with subtle grain. Exception: use pure matte black for explanation override scenes.",
    "ZERO GRADIENTS — every fill is one solid flat colored pencil application, optionally with light hatching strokes for depth.",
    "NO SCRIBBLES — the drawing must look like a professional, precise technical blueprint drawn with neat colored pencils. Zero child-like or messy sketch aesthetics. Zero rough lines.",
    "STRICT SPEECH ADHERENCE — every element in the illustration must come directly from the spoken sentence. No decorative tropical backdrops, no city grids, no environmental elements not referenced in the speech.",
    "MAXIMUM THREE ARROWS PER SCENE — flow arrows are mapped strictly from source to destination as described in the speech. No floating or decorative arrows.",
    "NO EXCESSIVE EFFECTS — no dramatic explosion bursts, no pulsing halos, no flashing effects in video prompts unless the speech explicitly describes breaking or exploding.",
    "NO PEOPLE, NO FACES, NO HANDS — the style is object-focused technical illustration only.",
    "NO TEXT LEAKAGE — no number values used as coordinates, no meta-labels, no rendering instructions, no prompt fragments rendered as visible text in the image.",
    "NATURAL LANGUAGE POSITIONS ONLY — left side, right side, center, upper area, lower area. Never numeric coordinates or percentages.",
    "EVERY SCENE TELLS ITS SPECIFIC STORY — the illustration communicates the exact spoken sentence it accompanies, not a generic version of the topic.",
    "NO MISSPELLINGS — all spelled words inside illustrations must be perfectly standard."
  ],

  "negative_prompt": "No text leakage, no meta-labels, no random floating arrows, no scribbles, no messy sketches, no rough lines, no 3D rendering, no photorealism, no misspellings, no UI placeholders, no numbers rendered as coordinates or pixel sizes, no gradients, no color blending, no soft glow edges, no bloom effects, no painterly textures, no watercolor washes, no Ghibli aesthetics, no digital-looking fills, no people, no faces, no hands, no fingers, no palm trees, no ocean or tropical backdrops unless the speech explicitly references them, no excessive arrows beyond three per scene, no dramatic explosion burst effects unless the speech explicitly describes breaking or exploding, no pulsing halos or flashing effects, no pure white backgrounds, no gray backgrounds — only warm off-white paper texture for illustration scenes. Ensure flawless professional blueprint aesthetic, perfectly aligned geometry, and absolute zero random text or numbers.",

  "how_to_use": [
    "1. Identify the spoken sentence for the scene.",
    "2. If the speech has no physical subject (abstract statistic, series anchor, pure definition), use the explanation_override_style — black background, minimal silver icon, not pencilart.",
    "3. Choose the best layout type from the layout_types list based on what the sentence is explaining.",
    "4. Paste the global_style_description verbatim as the fixed opening of every image prompt for illustration scenes.",
    "5. Describe the scene using natural spatial language only — positions, objects, labels — never numeric coordinates.",
    "6. Ensure the supporting diagram elements visually PROVE the spoken sentence — ask: could someone understand this concept from the image alone?",
    "7. Apply visual language rules consistently: cyan for flow, shattered lines for rejection, connected structures for approval, cross-hatch for barriers.",
    "8. Keep arrows minimal — maximum two to three per scene, strictly from a named source to a named destination described in the speech.",
    "9. Add text labels inside the illustration only when they are labels, measurements, or captions directly tied to the speech content.",
    "10. End every image prompt with the negative_prompt field pasted verbatim in full."
  ]
}