import { useSyncExternalStore } from 'react';
import { Inventory, SlotWithItem } from '../typings';

const createStore = <T>(initial: T) => {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (next: T) => {
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export type HoveredSlot = { item: SlotWithItem; inventoryType: Inventory['type'] } | null;

export type QuantityRequest = {
  title: string;
  confirmLabel: string;
  max: number;
  initial: number;
  onConfirm: (amount: number) => void;
} | null;

const hovered = createStore<HoveredSlot>(null);
const quantity = createStore<QuantityRequest>(null);

export const setHoveredSlot = hovered.set;
export const getHoveredSlot = hovered.get;
export const useHoveredSlot = () => useSyncExternalStore(hovered.subscribe, hovered.get);

/** Abre o seletor de quantidade (slider + 1 / metade / tudo) e chama onConfirm com o valor escolhido. */
export const requestQuantity = quantity.set;
export const useQuantityRequest = () => useSyncExternalStore(quantity.subscribe, quantity.get);
