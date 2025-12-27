import { atomWithStorage } from 'jotai/utils';

export type CommandMenuPosition = 'top' | 'center';

interface AppSettings {
  commandMenuPosition: CommandMenuPosition;
}

const DEFAULT_SETTINGS: AppSettings = {
  commandMenuPosition: 'center',
};

export const settingsAtom = atomWithStorage<AppSettings>(
  'horizon-settings',
  DEFAULT_SETTINGS
);
