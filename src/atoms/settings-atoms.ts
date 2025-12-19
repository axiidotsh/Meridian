import { atomWithStorage } from 'jotai/utils';

export type CommandMenuPosition = 'top' | 'center';

interface AppSettings {
  commandMenuPosition: CommandMenuPosition;
}

const DEFAULT_SETTINGS: AppSettings = {
  commandMenuPosition: 'top',
};

export const settingsAtom = atomWithStorage<AppSettings>(
  'horizon-settings',
  DEFAULT_SETTINGS
);
