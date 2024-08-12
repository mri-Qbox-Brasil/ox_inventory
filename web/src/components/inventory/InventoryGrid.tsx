import React, { useRef } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import UserIcon from '../utils/icons/UserIcon';
import StoreIcon from '../utils/icons/StoreIcon';
import ToolsIcon from '../utils/icons/TooltsIcon';
import BoxIcon from '../utils/icons/BoxIcon';
import VehicleIcon from '../utils/icons/VehicleIcon';
import GroundIcon from '../utils/icons/GroundIcon';
import { maincolor } from '../../store/maincolor';


const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = React.useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );

  const weightPercent = React.useMemo(() => (inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0), [weight]);

  const inventoryIcon = React.useMemo(() => {
    switch (inventory.type) {
      case 'player':
        return <UserIcon />;
      case 'shop':
        return <StoreIcon />;
      case 'crafting':
        return <ToolsIcon />;
      case 'stash':
        return <BoxIcon />;
      case 'drop':
        return <GroundIcon />;
      case 'vehicle':
        return <VehicleIcon />;
      case 'ground':
        return <GroundIcon />;
      case null:
        return <GroundIcon />;
      default:
        return <GroundIcon />;
    }
  }, [inventory.type]);

  const [page, setPage] = React.useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  React.useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);
  return (
    <>
      <div className="inventory-grid-wrapper col-span-3" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div className={`flex items-center ${inventory.label ? 'justify-between' : 'justify-between'}`}>
          <div className="flex items-center space-x-1 pl-2 pr-4 py-2">
            <div className="">{inventoryIcon}</div>
            {inventory.type && inventory.label && <span>{inventory.label}</span>}
            {inventory.type && !inventory.label && <span>Chão</span>}
          </div>

          {inventory.maxWeight && (
            <div className="inline-flex items-center bg-green-50/0 bg-opacity-60 rounded-md float-right">
              <div className="px-2 py-2 bg-gray-300/0 bg-opacity-20 rounded-md">
                <div className="overflow-hidden rounded-md bg-zinc-900 h-1 w-10">
                  <div
                    className={`h-full transition-all duration-150 rounded-md ${
                      weightPercent >= 90 ? 'bg-red-400' : 'bg-green-500'
                    }`}
                    style={{
                      width: `${weightPercent}%`,
                    }}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-300">
                <p>{`${Number((weight / 1000).toFixed(2))}/${inventory.maxWeight / 1000} KG`}</p>
              </div>
            </div>
          )}
        </div>

        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
