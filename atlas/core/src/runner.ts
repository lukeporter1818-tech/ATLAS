import 'dotenv/config';
import { registry } from './registry';
import { logSkillRun, updateSkillRun } from '../../shared/db/src/skill-runs';

const [, , command, skillName] = process.argv;

if (command !== 'run' || !skillName) {
  console.error('Usage: npm run atlas:run <skill-name>');
  console.error('Available skills:', Object.keys(registry).join(', '));
  process.exit(1);
}

async function main() {
  const skill = registry[skillName];
  if (!skill) {
    console.error(`Unknown skill: "${skillName}". Available: ${Object.keys(registry).join(', ')}`);
    process.exit(1);
  }

  console.log(`[atlas] Starting skill: ${skillName}`);
  const run = await logSkillRun(skillName);
  console.log(`[atlas] Run logged with id: ${run.id}`);

  try {
    await skill.run();
    await updateSkillRun(run.id, 'success');
    console.log(`[atlas] ${skillName} completed successfully`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await updateSkillRun(run.id, 'error', message);
    console.error(`[atlas] ${skillName} failed:`, message);
    process.exit(1);
  }
}

main();
