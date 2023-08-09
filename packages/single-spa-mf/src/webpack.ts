import { getMFAppEntry, getMFAppVar, mainModule } from './utils';

/**
 *@public
 */
export const getMFAppConfig = ({ app }: { app: string }) => ({
  name: getMFAppVar(app),
  filename: `${getMFAppEntry(app)}`,
});

/**
 *@public
 */
export const getMFExposes = (mod: string) => ({
  [mainModule]: mod,
});
