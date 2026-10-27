import { useSyncExternalStore } from 'react';
import { applyUiConfig, setAccentOverride, setBackgroundOverride, type MriUiConfig } from '@mriqbox/ui-kit';

/** Inventory look from the /uiconfig Inventário tab (ox_lib mri/server.lua validates the values). */
export interface InventoryLook {
  inventoryScale: number;
  inventoryColumns: number;
  inventorySlotStyle: 'card' | 'outline' | 'clean';
  inventoryLabels: 'always' | 'hover' | 'hidden';
  inventoryWeight: 'ring' | 'bar' | 'text';
  inventoryDurability: 'show' | 'hide';
  inventoryFilters: 'show' | 'hide';
  inventoryHints: 'show' | 'hide';
  inventoryHotbar: 'center' | 'left' | 'right';
  inventoryBackdrop: 'full' | 'vignette' | 'bottom' | 'none';
  inventoryBackdropColor: 'theme' | 'black' | 'accent';
  inventoryBackdropOpacity: Opacity;
  inventorySlotOpacity: Opacity;
}

// 'theme' follows the /uiconfig opacity, a number is a fixed percent.
type Opacity = 'theme' | number;

export type SuiteUiConfig = MriUiConfig &
  Partial<InventoryLook> & {
    theme?: string;
    accentColor?: string;
    backgroundColor?: string;
  };

const DEFAULT_LOOK: InventoryLook = {
  inventoryScale: 100,
  inventoryColumns: 5,
  inventorySlotStyle: 'card',
  inventoryLabels: 'always',
  inventoryWeight: 'ring',
  inventoryDurability: 'show',
  inventoryFilters: 'show',
  inventoryHints: 'show',
  inventoryHotbar: 'center',
  inventoryBackdrop: 'full',
  inventoryBackdropColor: 'theme',
  inventoryBackdropOpacity: 'theme',
  inventorySlotOpacity: 'theme',
};

const OPACITY_KEYS = new Set<keyof InventoryLook>(['inventoryBackdropOpacity', 'inventorySlotOpacity']);

let look = DEFAULT_LOOK;
const listeners = new Set<() => void>();

const pickLook = (cfg: SuiteUiConfig): InventoryLook => {
  const next = { ...DEFAULT_LOOK };
  (Object.keys(DEFAULT_LOOK) as (keyof InventoryLook)[]).forEach((key) => {
    const value = cfg[key];
    const valid = OPACITY_KEYS.has(key) ? value === 'theme' || typeof value === 'number' : typeof value === typeof DEFAULT_LOOK[key];
    if (value !== undefined && valid) (next as Record<string, unknown>)[key] = value;
  });
  return next;
};

// Unset falls back to the theme opacity in index.scss.
const setOpacity = (root: HTMLElement, name: string, value: Opacity) =>
  value === 'theme' ? root.style.removeProperty(name) : root.style.setProperty(name, String(value / 100));

// Grid and slot choices are CSS (index.scss reads these); the rest is read by the components through useInventoryLook.
function applyLook(next: InventoryLook) {
  const root = document.documentElement;
  root.style.setProperty('--inv-scale', String(next.inventoryScale / 100));
  root.style.setProperty('--inv-cols', String(next.inventoryColumns));
  root.dataset.invSlot = next.inventorySlotStyle;
  root.dataset.invLabels = next.inventoryLabels;
  root.dataset.invDurability = next.inventoryDurability;
  root.dataset.invHotbar = next.inventoryHotbar;
  root.dataset.invBackdrop = next.inventoryBackdrop;
  root.dataset.invBackdropColor = next.inventoryBackdropColor;
  setOpacity(root, '--inv-backdrop-alpha', next.inventoryBackdropOpacity);
  setOpacity(root, '--inv-slot-alpha', next.inventorySlotOpacity);
  root.dataset.invSlotOpacity = next.inventorySlotOpacity === 'theme' ? 'theme' : 'custom';

  look = next;
  listeners.forEach((listener) => listener());
}

export const useInventoryLook = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => look
  );

/** Aplica o estilo do painel /uiconfig do ox_lib: tema, fonte, radius, status, accent/fundo override e o visual do inventário. */
export function applySuiteUiConfig(cfg: SuiteUiConfig | null | undefined) {
  if (!cfg || typeof cfg !== 'object') return;

  applyUiConfig(cfg);
  setAccentOverride(cfg.accentColor);
  setBackgroundOverride(cfg.backgroundColor);
  document.documentElement.setAttribute('data-theme', cfg.theme === 'glass' ? 'glass' : 'dark');
  applyLook(pickLook(cfg));
}
