import { db } from './client';

export async function logSkillRun(skillName: string) {
  const { data, error } = await db
    .from('skill_runs')
    .insert({ skill_name: skillName, status: 'started' })
    .select()
    .single();

  if (error) throw new Error(`Failed to log skill run: ${error.message}`);
  return data as { id: string; skill_name: string; status: string; started_at: string };
}

export async function updateSkillRun(
  id: string,
  status: 'success' | 'error',
  errorMessage?: string,
) {
  const { error } = await db
    .from('skill_runs')
    .update({
      status,
      finished_at: new Date().toISOString(),
      ...(errorMessage ? { error: errorMessage } : {}),
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to update skill run: ${error.message}`);
}
