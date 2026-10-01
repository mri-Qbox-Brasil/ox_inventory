import React, { useRef } from 'react';
import { Inventory, Slot } from '../../typings';
import InventorySlot from './InventorySlot';
import { getTotalWeight, isSlotWithItem } from '../../helpers';
import { store, useAppSelector } from '../../store';
import { onDrop } from '../../dnd/onDrop';
import { useIntersection } from '../../hooks/useIntersection';
import UserIcon from '../utils/icons/UserIcon';
import StoreIcon from '../utils/icons/StoreIcon';
import ToolsIcon from '../utils/icons/TooltsIcon';
import BoxIcon from '../utils/icons/BoxIcon';
import VehicleIcon from '../utils/icons/VehicleIcon';
import GroundIcon from '../utils/icons/GroundIcon';
import { FilterIcon, GridIcon, LayersIcon, TakeAllIcon, WeightIcon } from '../utils/icons/InventoryIcons';
import { usePlayerOwner } from '../../lib/playerOwner';
import { itemInCategory, setActiveCategory, useItemCategories } from '../../lib/itemCategories';
import { Locale } from '../../store/locale';

const PAGE_SIZE = 30;
const FAST_SLOTS = 5;
const RING_RADIUS = 15;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const WeightRing: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="weight-ring">
    <svg viewBox="0 0 36 36">
      <circle className="weight-ring-track" cx="18" cy="18" r={RING_RADIUS} />
      <circle
        className={`weight-ring-value ${percent >= 90 ? 'weight-ring-value--full' : ''}`}
        cx="18"
        cy="18"
        r={RING_RADIUS}
        strokeDasharray={RING_LENGTH}
        strokeDashoffset={RING_LENGTH * (1 - Math.min(percent, 100) / 100)}
      />
    </svg>
    <WeightIcon />
  </div>
);

const TypeIcon: React.FC<{ type?: string }> = ({ type }) => {
  switch (type) {
    case 'player':
    case 'otherplayer':
      return <UserIcon />;
    case 'shop':
      return <StoreIcon />;
    case 'crafting':
      return <ToolsIcon />;
    case 'stash':
    case 'container':
    case 'policeevidence':
      return <BoxIcon />;
    case 'trunk':
    case 'glovebox':
      return <VehicleIcon />;
    default:
      return <GroundIcon />;
  }
};

const describe = (inventory: Inventory) =>
  Locale[`ui_mri_desc_${inventory.type || 'drop'}`] || 'Veículos, jogadores ou baús próximos';

const isGround = (inventory: Inventory) => inventory.type === 'drop' || inventory.type === 'newdrop';

/** Nome que o servidor dá aos drops comuns (`Drop 123456`); CustomDrop com prefixo próprio mantém o nome. */
const GENERATED_DROP_LABEL = /^Drop \d+$/;

const useScrollFade = (deps: unknown[]) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fade, setFade] = React.useState({ top: false, bottom: false });

  const update = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const top = el.scrollTop > 2;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    setFade((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
  }, []);

  React.useEffect(update, deps);

  return { ref, fade, update };
};

const formatKg = (grams: number) => Number((grams / 1000).toFixed(2)).toLocaleString('pt-BR');

const InventoryGrid: React.FC<{ inventory: Inventory; side: 'left' | 'right' }> = ({ inventory, side }) => {
  const playerOwner = usePlayerOwner();
  const { categories, active } = useItemCategories();
  const isOwn = side === 'left' && inventory.type === 'player';

  const weight = React.useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );

  const weightPercent = inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0;

  const activeCategory = isOwn ? categories.find((category) => category.name === active) : undefined;
  const isDimmed = (item: Slot) => !!activeCategory && !(item.name && itemInCategory(item.name, activeCategory));

  const fastSlots = isOwn ? inventory.items.slice(0, FAST_SLOTS) : [];
  const gridItems = isOwn ? inventory.items.slice(FAST_SLOTS) : inventory.items;

  const [page, setPage] = React.useState(0);
  const { ref: containerRef, fade, update: updateFade } = useScrollFade([gridItems.length, page]);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  React.useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const ground = isGround(inventory);
  const groundLabel = Locale.ui_mri_ground || 'Chão';
  const title = isOwn
    ? Locale.ui_mri_own_title || 'Inventário'
    : ground && (!inventory.label || GENERATED_DROP_LABEL.test(inventory.label))
    ? groundLabel
    : inventory.label || groundLabel;
  const slotKey = ground ? 'ground' : `${inventory.type}-${inventory.id}`;
  const owner = [inventory.type === 'player' && inventory.id ? `[${inventory.id}]` : null, isOwn ? playerOwner : null]
    .filter(Boolean)
    .join(' ');
  const description = isOwn
    ? [owner, inventory.label].filter(Boolean).join(' · ') || Locale.ui_mri_desc_own || 'Seu inventário pessoal'
    : describe(inventory);

  const [taking, setTaking] = React.useState(false);
  const canTakeAll =
    !isOwn && inventory.type !== 'shop' && inventory.type !== 'crafting' && inventory.items.some((slot) => isSlotWithItem(slot));

  const takeAll = async () => {
    setTaking(true);

    for (const slot of inventory.items.map((entry) => entry.slot)) {
      const current = store.getState().inventory.rightInventory.items[slot - 1];
      if (!current || !isSlotWithItem(current)) continue;

      const result = await onDrop({ item: current, inventory: inventory.type }, undefined, 0);
      if (!result || result.meta.requestStatus === 'rejected') break;
    }

    setTaking(false);
  };

  return (
    <div className={`inventory-panel ${isOwn ? 'inventory-panel--own' : ''}`} style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
      <div className="inventory-header">
        <div className={`inventory-header-icon mri-surface-card ${isOwn ? 'inventory-header-icon--accent' : ''}`}>
          {isOwn ? <GridIcon /> : <TypeIcon type={inventory.type} />}
        </div>
        <div className="inventory-header-text">
          <p className="inventory-header-title">{title}</p>
          <p className="inventory-header-description">{description}</p>
        </div>

        {canTakeAll && (
          <button type="button" className="inventory-take-all mri-surface-card" disabled={taking} onClick={takeAll}>
            <TakeAllIcon />
            {Locale.ui_mri_take_all || 'Pegar tudo'}
          </button>
        )}

        {inventory.maxWeight ? (
          <div className="inventory-weight-info">
            <div className="inventory-weight-text">
              <span className="inventory-weight-label">{Locale.ui_mri_weight || 'Peso'}</span>
              <span className="inventory-weight-value">
                {formatKg(weight)}
                <span className="inventory-weight-max"> / {formatKg(inventory.maxWeight)}kg</span>
              </span>
            </div>
            <WeightRing percent={weightPercent} />
          </div>
        ) : null}
      </div>

      <div
        className={`inventory-grid ${isOwn ? 'inventory-grid--own' : ''} ${fade.top ? 'inventory-grid--fade-top' : ''} ${fade.bottom ? 'inventory-grid--fade-bottom' : ''}`}
        ref={containerRef}
        onScroll={updateFade}
      >
        {gridItems.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
          <InventorySlot
            key={`${slotKey}-${item.slot}`}
            item={item}
            dimmed={isDimmed(item)}
            ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
            inventoryType={inventory.type}
            inventoryGroups={inventory.groups}
            inventoryId={inventory.id}
          />
        ))}
      </div>

      {isOwn && (
        <div className="inventory-fast">
          <div className="inventory-header inventory-header--section">
            <div className="inventory-header-icon inventory-header-icon--accent mri-surface-card">
              <LayersIcon />
            </div>
            <div className="inventory-header-text">
              <p className="inventory-header-title">{Locale.ui_mri_fastslots || 'Atalhos rápidos'}</p>
              <p className="inventory-header-description">
                {Locale.ui_mri_fastslots_hint || 'Use as teclas 1 a 5 para usar rapidamente'}
              </p>
            </div>

            {categories.length > 0 && (
              <div className="inventory-filters">
                <button
                  type="button"
                  className={`inventory-filter inventory-filter--text mri-surface-card ${active === null ? 'inventory-filter--active' : ''}`}
                  onClick={() => setActiveCategory(null)}
                >
                  {Locale.ui_mri_filter_all || 'Todos'}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    title={category.label}
                    className={`inventory-filter mri-surface-card ${category.icon ? '' : 'inventory-filter--text'} ${
                      active === category.name ? 'inventory-filter--active' : ''
                    }`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    {category.icon ? <FilterIcon name={category.icon} /> : category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="inventory-fast-grid">
            {fastSlots.map((item) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                dimmed={isDimmed(item)}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;
