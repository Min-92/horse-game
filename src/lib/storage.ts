const OWNED_KEY = 'horse-game:v1:ownedIds';
const HISTORY_KEY = 'horse-game:v1:drawHistory';

export type DrawHistory = {
  id: string;
  drawnAt: string;
};

export const loadOwnedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(OWNED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveOwnedIds = (ids: string[]) => {
  localStorage.setItem(OWNED_KEY, JSON.stringify(ids));
};

export const loadHistory = (): DrawHistory[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveHistory = (history: DrawHistory[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};
