import { getMFAppEntry, getMFAppVar, mainModule } from './utils';

export const getMFAppConfig = ({ app }: { app: string }) => ({
  name: getMFAppVar(app),
  filename: `${getMFAppEntry(app)}`,
});

export const getMFExposes = (mod: string) => ({
  [mainModule]: mod,
});
