import { useEffect } from 'react';
import { store } from '../store';
import { onDrop } from '../dnd/onDrop';
import { onUse } from '../dnd/onUse';
import { isSlotWithItem } from '../helpers';
import { getHoveredSlot } from '../lib/inventoryUx';

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

/** Atalhos com o mouse em cima de um item: E usa, F larga/guarda ou pega do chão, 1 a 5 manda pro atalho rápido. */
export const useInventoryHotkeys = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.altKey || isTyping(event.target)) return;

      const hovered = getHoveredSlot();
      if (!hovered || hovered.inventoryType === 'shop' || hovered.inventoryType === 'crafting') return;

      const { inventory } = store.getState();
      const source = hovered.inventoryType === 'player' ? inventory.leftInventory : inventory.rightInventory;
      const item = source.items[hovered.item.slot - 1];
      if (!item || !isSlotWithItem(item)) return;

      const key = event.key.toLowerCase();
      const hotbar = Number(key);

      if (key === 'e' && hovered.inventoryType === 'player') {
        onUse(item);
      } else if (key === 'f') {
        onDrop({ item, inventory: hovered.inventoryType }, undefined, 0);
      } else if (hotbar >= 1 && hotbar <= 5 && !(hovered.inventoryType === 'player' && item.slot === hotbar)) {
        onDrop({ item, inventory: hovered.inventoryType }, { inventory: 'player', item: { slot: hotbar } }, 0);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
};
