const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error(`WORLD INTEGRITY FAILED: ${message}`);
  process.exitCode = 1;
};

const placement = read('src/game/world/data/placementPlan.ts');
const districtExperience = read('src/game/features/portfolio/data/districtExperience.ts');
const projectStories = read('src/game/features/portfolio/data/projectCaseStudy.ts');
const garage = read('src/game/features/portfolio/ProjectGarage.tsx');

if (!placement.includes('zone:') || !placement.includes('role:') || !placement.includes('purpose:')) {
  fail('placementPlan.ts must keep explicit zone/role/purpose metadata.');
}
if (/purpose:\s*['"]\s*['"]/.test(placement)) {
  fail('placementPlan.ts contains an empty purpose.');
}
if (!placement.includes('sparseByDefault')) {
  fail('purposeful-placement guardrail is missing.');
}

const transitionMatch = districtExperience.match(/TOUR_TRANSITION_SECONDS\s*=\s*(\d+)/);
const holdMatches = [...districtExperience.matchAll(/holdSeconds:\s*(\d+)/g)];
const transitionSeconds = transitionMatch ? Number(transitionMatch[1]) : NaN;
const holdSeconds = holdMatches.map((match) => Number(match[1]));
const totalTourSeconds = transitionSeconds * holdSeconds.length + holdSeconds.reduce((sum, value) => sum + value, 0);
if (!Number.isFinite(totalTourSeconds) || totalTourSeconds !== 90) {
  fail(`recruiter tour must remain exactly 90 seconds; resolved ${totalTourSeconds}.`);
}

for (const id of ['exam-system', 'fintech-payment', 'e-government', 'weather-warning']) {
  if (!projectStories.includes(`'${id}'`)) fail(`missing engineering story for ${id}.`);
}

if (!garage.includes('(projectsData.length - 1) / 2')) {
  fail('ProjectGarage must derive bay placement from project count; hard-coded 3-bay layouts are not allowed.');
}

if (!process.exitCode) console.log('World integrity checks passed.');
