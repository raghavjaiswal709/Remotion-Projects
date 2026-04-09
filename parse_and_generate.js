const fs = require('fs');
const path = require('path');

const mdSource = fs.readFileSync('src/Instructions/Day_23_motion.md', 'utf-8');
const framesDir = path.join('src', 'Day23', 'frames');

if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

const scenes = mdSource.split(/━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSCENE (\d+) —/g).slice(1);
const sceneData = [];

for (let i = 0; i < scenes.length; i += 2) {
  const sceneNum = scenes[i];
  const content = scenes[i+1];

  const frameWindowMatch = content.match(/FRAME WINDOW:\s+(\d+)\s+–\s+(\d+)/);
  if (!frameWindowMatch) continue;

  const startFrame = parseInt(frameWindowMatch[1], 10);
  const endFrame = parseInt(frameWindowMatch[2], 10);
  const duration = endFrame - startFrame;

  sceneData.push({
    sceneNum: sceneNum.padStart(2, '0'),
    startFrame,
    endFrame,
    duration
  });

  const componentName = `Scene${sceneNum.padStart(2, '0')}`;
  const code = `import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const ${componentName}: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill style={{
			backgroundColor: '#faf9f6', /* off-white paper */
			color: '#000000', /* deep black */
			fontFamily: 'sans-serif',
			justifyContent: 'center',
			alignItems: 'center',
			opacity
		}}>
			<div style={{ fontSize: '40px', color: '#00ffff' }}>
				Scene ${sceneNum} Content
			</div>
		</AbsoluteFill>
	);
};
`;
  
  fs.writeFileSync(path.join(framesDir, `${componentName}.tsx`), code);
}

const sceneImports = sceneData.map(s => `import { Scene${s.sceneNum} } from './Scene${s.sceneNum}';`).join('\n');
const sequenceTags = sceneData.map(s => `-`<Sequence from={${s.startFrame}} durationInFrames={${s.duration}}>
				<Scene${s.sceneNum} />
			</Sequence>`).join('\n');

const mainSceneCode = `import React from 'react';
import { AbsoluteFill, Sequence, Audio, useVideoConfig } from 'remotion';
${sceneImports}

export const Day23Scene: React.FC = () => {
	const { fps } = useVideoConfig();
	return (
		<AbsoluteFill style={{ backgroundColor: 'black' }}>
${sequenceTags}
		</AbsoluteFill>
	);
};
`;
fs.writeFileSync(path.join('src', 'Day23', 'frames', 'Scene.tsx'), mainSceneCode);
fs.renameSync(path.join('src', 'Day23', 'frames', 'Scene.tsx'), path.join('src', 'Day23', 'Scene.tsx'));

const rootCode = `import { Composition } from 'remotion';
import { Day23Scene } from './Scene';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Day23AIVideo"
				component={Day23Scene}
				durationInFrames={2700}
				fps={30}
				width={1080}
				height={1920}
			/>
		</>
	);
};
`;
fs.writeFileSync(path.join('src', 'Day23', 'Root.tsx'), rootCode);

console.log("Generated all scenes seamlessly!");
