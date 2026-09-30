import React, { useEffect, useRef, useState } from 'react';
import { DragSource, Inventory, InventoryType, Slot, SlotWithItem } from '../../typings';
import { useDrag, useDragDropManager, useDrop } from 'react-dnd';
import { useAppDispatch } from '../../store';
import { onDrop } from '../../dnd/onDrop';
import { onBuy } from '../../dnd/onBuy';
import { Items } from '../../store/items';
import { canCraftItem, canPurchaseItem, getItemUrl, isSlotWithItem } from '../../helpers';
import { onUse } from '../../dnd/onUse';
import { Locale } from '../../store/locale';
import { onCraft } from '../../dnd/onCraft';
import useNuiEvent from '../../hooks/useNuiEvent';
import { ItemsPayload } from '../../reducers/refreshSlots';
import { closeTooltip, openTooltip } from '../../store/tooltip';
import { openContextMenu } from '../../store/contextMenu';
import { useMergeRefs } from '@floating-ui/react';
import { durabilityLevel, formatWeight } from '../../lib/itemFormat';
type Impact = { type: 'land' | 'stack' | 'consume'; id: number };

interface SlotProps {
  inventoryId: Inventory['id'];
  inventoryType: Inventory['type'];
  inventoryGroups: Inventory['groups'];
  item: Slot;
  dimmed?: boolean;
}

const InventorySlot: React.ForwardRefRenderFunction<HTMLDivElement, SlotProps> = (
  { item, inventoryId, inventoryType, inventoryGroups, dimmed },
  ref
) => {
  const manager = useDragDropManager();
  const dispatch = useAppDispatch();
  const timerRef = useRef<number | null>(null);

  const canDrag = React.useCallback(() => {
    return canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) && canCraftItem(item, inventoryType);
  }, [item, inventoryType, inventoryGroups]);

  const [{ isDragging }, drag] = useDrag<DragSource, void, { isDragging: boolean }>(
    () => ({
      type: 'SLOT',
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () =>
        isSlotWithItem(item, inventoryType !== InventoryType.SHOP)
          ? {
              inventory: inventoryType,
              item: {
                name: item.name,
                slot: item.slot,
              },
              image: item?.name && `url(${getItemUrl(item) || 'none'}`,
            }
          : null,
      canDrag,
    }),
    [inventoryType, item]
  );

  const [{ isOver, canDrop }, drop] = useDrop<DragSource, void, { isOver: boolean; canDrop: boolean }>(
    () => ({
      accept: 'SLOT',
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop: (source) => {
        dispatch(closeTooltip());
        switch (source.inventory) {
          case InventoryType.SHOP:
            onBuy(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
          case InventoryType.CRAFTING:
            onCraft(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
          default:
            onDrop(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
        }
      },
      canDrop: (source) =>
        (source.item.slot !== item.slot || source.inventory !== inventoryType) &&
        inventoryType !== InventoryType.SHOP &&
        inventoryType !== InventoryType.CRAFTING,
    }),
    [inventoryType, item]
  );

  useNuiEvent('refreshSlots', (data: { items?: ItemsPayload | ItemsPayload[] }) => {
    if (!isDragging && !data.items) return;
    if (!Array.isArray(data.items)) return;

    const itemSlot = data.items.find(
      (dataItem) => dataItem.item.slot === item.slot && dataItem.inventory === inventoryId
    );

    if (!itemSlot) return;

    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  const [impact, setImpact] = useState<Impact | null>(null);
  const previous = useRef<{ name?: string; count: number } | null>(null);

  useEffect(() => {
    const prev = previous.current;
    const count = item.count ?? 0;
    previous.current = { name: item.name, count };

    if (!prev || !item.name) return;

    const type = prev.name !== item.name ? 'land' : count > prev.count ? 'stack' : count < prev.count ? 'consume' : null;
    if (type) setImpact((current) => ({ type, id: (current?.id ?? 0) + 1 }));
  }, [item.name, item.count]);

  const connectRef = (element: HTMLDivElement) => drag(drop(element));

  const handleContext = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isSlotWithItem(item)) return;

    if (inventoryType === 'drop') {
      dispatch(closeTooltip());
      return onDrop({ item, inventory: inventoryType });
    }

    if (inventoryType !== 'player') return;

    dispatch(openContextMenu({ item, coords: { x: event.clientX, y: event.clientY } }));
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    dispatch(closeTooltip());
    if (timerRef.current) clearTimeout(timerRef.current);
    if (event.ctrlKey && isSlotWithItem(item) && inventoryType !== 'shop' && inventoryType !== 'crafting') {
      onDrop({ item: item, inventory: inventoryType });
    } else if (event.altKey && isSlotWithItem(item) && inventoryType === 'player') {
      onUse(item);
    }
  };

  const refs = useMergeRefs([connectRef, ref]);
  const isHotkey = inventoryType === 'player' && item.slot <= 5;
  const hasItem = isSlotWithItem(item);
  const durability = hasItem ? durabilityLevel(item.durability, inventoryType) : null;
  const locked =
    !canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) || !canCraftItem(item, inventoryType);

  return (
    <div
      ref={refs}
      onContextMenu={handleContext}
      onClick={handleClick}
      className={`inventory-slot mri-surface-card ${hasItem ? 'inventory-slot--filled' : ''} ${dimmed ? 'inventory-slot--dimmed' : ''} ${
        isDragging ? 'inventory-slot--dragging' : ''
      } ${isOver && canDrop ? 'inventory-slot--over' : ''}`}
      style={{
        filter: locked ? 'brightness(80%) grayscale(100%)' : undefined,
        opacity: isDragging ? 0.4 : dimmed ? 0.25 : 1.0,
      }}
    >
      {durability && <span className={`item-slot-durability item-slot-durability--${durability}`} />}
      {impact && <span key={`flash-${impact.id}`} className={`item-slot-flash item-slot-flash--${impact.type}`} />}
      {hasItem && (
        <span
          key={`image-${impact?.id ?? 0}`}
          className={`item-slot-image ${impact ? `item-slot-image--${impact.type}` : ''}`}
          style={{ backgroundImage: `url(${getItemUrl(item as SlotWithItem)})` }}
        />
      )}
      {isHotkey && <span className="inventory-slot-hotkey">{item.slot}</span>}

      {isSlotWithItem(item) && (
        <div
          className="item-slot-wrapper"
          onMouseEnter={() => {
            timerRef.current = window.setTimeout(() => {
              dispatch(openTooltip({ item, inventoryType }));
            }, 500) as unknown as number;
          }}
          onMouseLeave={() => {
            dispatch(closeTooltip());
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
          }}
        >
          <div className={`item-slot-top ${isHotkey ? 'item-slot-top--hotkey' : ''}`}>
            <span className="item-slot-weight">{item.weight > 0 ? formatWeight(item.weight) : ''}</span>
            {item.count ? (
              <span
                key={`count-${impact?.id ?? 0}`}
                className={`item-slot-count ${item.name === 'money' ? 'item-slot-count--money' : ''} ${
                  impact?.type === 'stack' ? 'item-slot-count--bump' : ''
                }`}
              >
                {item.name === 'money'
                  ? `${Locale.$ || 'R$'}${item.count.toLocaleString('pt-BR')}`
                  : `${item.count.toLocaleString('pt-BR')}x`}
              </span>
            ) : null}
          </div>

          {inventoryType === 'shop' && item.price !== undefined && item.price > 0 && (
            <div className="item-slot-price">
              {item.currency && item.currency !== 'money' && item.currency !== 'black_money' ? (
                <>
                  <img src={getItemUrl(item.currency)} alt="" />
                  <span>{item.price.toLocaleString('pt-BR')}</span>
                </>
              ) : (
                <span className={item.currency === 'black_money' ? 'item-slot-price--dirty' : 'item-slot-price--clean'}>
                  {Locale.$ || 'R$'}
                  {item.price.toLocaleString('pt-BR')}
                </span>
              )}
            </div>
          )}

          <div className="item-slot-label">
            {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(React.forwardRef(InventorySlot));
