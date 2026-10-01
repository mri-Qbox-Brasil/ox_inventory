import React from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import { playSfx, setInventoryOpen } from '../../lib/sfx';
import { useDrop } from 'react-dnd';
import type { DragSource } from '../../typings';
import { onDrop } from '../../dnd/onDrop';
import { useInventoryHotkeys } from '../../hooks/useInventoryHotkeys';
import QuantityDialog from './QuantityDialog';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = React.useState(false);
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  const wasVisible = React.useRef(false);
  React.useEffect(() => {
    setInventoryOpen(inventoryVisible);
    if (inventoryVisible === wasVisible.current) return;

    wasVisible.current = inventoryVisible;
    playSfx(inventoryVisible ? 'open' : 'close');
  }, [inventoryVisible]);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useInventoryHotkeys(inventoryVisible);

  const [, dropOutside] = useDrop<DragSource>(() => ({
    accept: 'SLOT',
    drop: (source, monitor) => {
      if (monitor.didDrop() || source.inventory !== 'player') return;

      const offset = monitor.getClientOffset();
      const panel = offset && document.elementFromPoint(offset.x, offset.y)?.closest('.inventory-panel');
      if (panel?.classList.contains('inventory-panel--own')) return;

      onDrop(source);
    },
  }));

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="inventory-wrapper" ref={dropOutside}>
          <LeftInventory />
          <RightInventory />
          <InventoryControl />
          <Tooltip />
          <InventoryContext />
          <QuantityDialog />
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
