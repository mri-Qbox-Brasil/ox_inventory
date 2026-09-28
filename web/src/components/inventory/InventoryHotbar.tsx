import React, { useState } from 'react';
import { getItemUrl, isSlotWithItem } from '../../helpers';
import useNuiEvent from '../../hooks/useNuiEvent';
import { Items } from '../../store/items';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { SlotWithItem } from '../../typings';
import SlideUp from '../utils/transitions/SlideUp';

const InventoryHotbar: React.FC = () => {
  const [hotbarVisible, setHotbarVisible] = useState(false);
  const items = useAppSelector(selectLeftInventory).items.slice(0, 5);

  const [handle, setHandle] = useState<ReturnType<typeof setTimeout>>();
  useNuiEvent('toggleHotbar', () => {
    if (hotbarVisible) {
      setHotbarVisible(false);
    } else {
      if (handle) clearTimeout(handle);
      setHotbarVisible(true);
      setHandle(setTimeout(() => setHotbarVisible(false), 3000));
    }
  });

  return (
    <SlideUp in={hotbarVisible}>
      <div className="hotbar-container">
        {items.map((item) => (
          <div
            className={`inventory-slot hotbar-item-slot mri-surface-card ${isSlotWithItem(item) ? 'inventory-slot--filled' : ''}`}
            key={`hotbar-${item.slot}`}
          >
            {isSlotWithItem(item) && (
              <span className="item-slot-image" style={{ backgroundImage: `url(${getItemUrl(item as SlotWithItem)})` }} />
            )}
            <span className="inventory-slot-hotkey">{item.slot}</span>

            {isSlotWithItem(item) && (
              <div className="item-slot-wrapper">
                <div className="item-slot-top item-slot-top--hotkey">
                  <span className="item-slot-weight" />
                  {item.count ? <span className="item-slot-count">{item.count.toLocaleString('pt-BR')}x</span> : null}
                </div>
                <div className="item-slot-label">
                  {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SlideUp>
  );
};

export default InventoryHotbar;
