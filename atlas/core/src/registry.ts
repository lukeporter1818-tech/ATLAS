import { traides } from '../../skills/traides';

export interface Skill {
  run: () => Promise<void>;
}

export const registry: Record<string, Skill> = {
  traides,
};
