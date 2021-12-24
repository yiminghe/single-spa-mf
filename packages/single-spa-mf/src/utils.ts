const tag = 'Single_SPA_MF';

export function getMFAppVar(app: string) {
  return `${tag}_${app}_App`;
}

export function getMFAppEntry(app: string) {
  return `${tag}_${app}_Entry.js`;
}

export const mainModule = `${tag}_main`;
