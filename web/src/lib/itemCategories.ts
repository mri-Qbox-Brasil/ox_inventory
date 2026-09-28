import { useSyncExternalStore } from 'react';

export type ItemCategory = {
  name: string;
  label: string;
  icon?: string;
  items?: string[];
  prefixes?: string[];
};

type CategoryState = {
  categories: ItemCategory[];
  active: string | null;
};

let state: CategoryState = { categories: [], active: null };
const listeners = new Set<() => void>();

const emit = (next: CategoryState) => {
  state = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const isCategory = (value: any): value is ItemCategory =>
  value && typeof value.name === 'string' && typeof value.label === 'string';

export const setItemCategories = (value: unknown) => {
  const categories = Array.isArray(value) ? value.filter(isCategory) : [];
  const active = categories.some((category) => category.name === state.active) ? state.active : null;

  emit({ categories, active });
};

export const setActiveCategory = (name: string | null) => {
  emit({ ...state, active: state.active === name ? null : name });
};

export const useItemCategories = () => useSyncExternalStore(subscribe, () => state);

export const itemInCategory = (itemName: string, category: ItemCategory) => {
  const name = itemName.toLowerCase();

  if (category.items?.some((item) => item.toLowerCase() === name)) return true;

  return category.prefixes?.some((prefix) => name.startsWith(prefix.toLowerCase())) ?? false;
};
