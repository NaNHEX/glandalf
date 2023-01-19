import { DiscordRequest } from './utils.js';

export async function HasCommands(appId, commands) {
  if (appId === '') return;

  commands.forEach((c) => InstallCommand(appId, c));
}

export async function InstallCommand(appId, command) {
  const endpoint = `applications/${appId}/commands`;
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

export const COMPS_COMMAND = {
  name: 'comps',
  description: 'Get competencies for a given project and specialization',
  options: [
    {
      type: 3,
      name: 'specialization',
      description: 'Your specialization (e.g IOT)',
      required: true,
    },
    {
      type: 3,
      name: 'project',
      description: 'The project (e.g T-DEV-700)',
      required: true,
    },
    {
      type: 3,
      name: 'cookie',
      description: 'The Moodle session cookie',
      required: true,
    }
  ],
  type: 1,
};
