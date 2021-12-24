const tag='Single_SPA_MF';

export function getMFAppVar(app: string) {
  return `${app}_${tag}_App`;
}

export function getMFAppEntry(app: string) {
  return `${app}_${tag}_Entry.js`;
}

export function getMFAppMD5Key(app: string) {
  return `${app}_${tag}_MD5.js`;
}

export const mainModule=`${tag}_Main`;
