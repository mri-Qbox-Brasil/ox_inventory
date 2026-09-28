import React, { useRef } from 'react';
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

  const [{ isOver }, drop] = useDrop<DragSource, void, { isOver: boolean }>(
    () => ({
      accept: 'SLOT',
      collect: (monitor) => ({
        isOver: monitor.isOver(),
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

  const connectRef = (element: HTMLDivElement) => drag(drop(element));

  const handleContext = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (inventoryType !== 'player' || !isSlotWithItem(item)) return;

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
      className={`inventory-slot mri-surface-card ${hasItem ? 'inventory-slot--filled' : ''} ${dimmed ? 'inventory-slot--dimmed' : ''}`}
      style={{
        filter: locked ? 'brightness(80%) grayscale(100%)' : undefined,
        opacity: isDragging ? 0.4 : dimmed ? 0.25 : 1.0,
        borderColor: isOver ? 'hsl(var(--primary) / 0.8)' : undefined,
      }}
    >
      {durability && <span className={`item-slot-durability item-slot-durability--${durability}`} />}
      {hasItem && (
        <span className="item-slot-image" style={{ backgroundImage: `url(${getItemUrl(item as SlotWithItem)})` }} />
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
              <span className={`item-slot-count ${item.name === 'money' ? 'item-slot-count--money' : ''}`}>
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
