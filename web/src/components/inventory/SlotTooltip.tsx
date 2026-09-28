import { Inventory, SlotWithItem } from '../../typings';
import React, { useMemo } from 'react';
import { Items } from '../../store/items';
import { Locale } from '../../store/locale';
import { useAppSelector } from '../../store';
import { getItemUrl, isSlotWithItem } from '../../helpers';
import { formatWeight } from '../../lib/itemFormat';
import { CheckIcon, ClockIcon, CrossIcon } from '../utils/icons/MenuIcons';
import { DurabilityMeter, ItemDescription, ItemHeader, itemCount, itemDescription } from './ItemDetails';

type Stat = { label: string; value: React.ReactNode; mono?: boolean };

const SlotTooltip: React.ForwardRefRenderFunction<
  HTMLDivElement,
  { item: SlotWithItem; inventoryType: Inventory['type']; style: React.CSSProperties }
> = ({ item, inventoryType, style }, ref) => {
  const additionalMetadata = useAppSelector((state) => state.inventory.additionalMetadata);
  const playerItems = useAppSelector((state) => state.inventory.leftInventory.items);
  const itemData = Items[item.name];
  const isCrafting = inventoryType === 'crafting';

  const ingredients = useMemo(() => {
    if (!item.ingredients) return [];
    return Object.entries(item.ingredients)
      .sort((a, b) => a[1] - b[1])
      .map(([name, count]) => {
        const owned = playerItems.filter((slot) => isSlotWithItem(slot) && slot.name === name);
        const total = owned.reduce((sum, slot) => sum + (slot.count || 0), 0);
        const has =
          count >= 1
            ? total >= count
            : count > 0
              ? owned.some((slot) => (slot.metadata?.durability ?? 100) >= count * 100)
              : total > 0;
        const amount =
          count >= 1 ? `${total}/${count}` : count > 0 ? `${Math.round(count * 100)}%` : Locale.ui_mri_tool || 'Ferramenta';

        return { name, label: Items[name]?.label || name, amount, has };
      });
  }, [item, playerItems]);

  const stats: Stat[] = [];

  if (!isCrafting) {
    if (inventoryType === 'shop' && item.price !== undefined && item.price > 0) {
      const currency =
        item.currency && item.currency !== 'money' && item.currency !== 'black_money'
          ? ` ${Items[item.currency]?.label || item.currency}`
          : '';
      stats.push({
        label: Locale.ui_mri_price || 'Preço',
        value: currency ? `${item.price.toLocaleString('pt-BR')}${currency}` : `${Locale.$ || 'R$'}${item.price.toLocaleString('pt-BR')}`,
      });
    }
    if (item.weight > 0) stats.push({ label: Locale.ui_mri_weight || 'Peso', value: formatWeight(item.weight) });
    if (item.metadata?.ammo !== undefined) stats.push({ label: Locale.ui_ammo || 'Munição', value: item.metadata.ammo });
    if (itemData?.ammoName && Items[itemData.ammoName]?.label)
      stats.push({ label: Locale.ammo_type || 'Tipo de munição', value: Items[itemData.ammoName]!.label });
    if (item.metadata?.serial)
      stats.push({ label: Locale.ui_serial || 'Número de série', value: item.metadata.serial, mono: true });
    if (item.metadata?.weapontint) stats.push({ label: Locale.ui_tint || 'Tonalidade', value: item.metadata.weapontint });
    for (const data of additionalMetadata as { metadata: string; value: string }[]) {
      const value = item.metadata?.[data.metadata];
      if (value !== undefined && value !== null && value !== '' && typeof value !== 'object')
        stats.push({ label: data.value, value: String(value) });
    }
  }

  const components: string[] = !isCrafting && Array.isArray(item.metadata?.components) ? item.metadata!.components : [];

  const subtitle = isCrafting ? (
    <span className="item-header-inline">
      <ClockIcon />
      {((item.duration ?? 3000) / 1000).toLocaleString('pt-BR')}s
    </span>
  ) : (
    item.metadata?.type
  );

  return (
    <div className="tooltip-wrapper mri-surface" ref={ref} style={style}>
      <ItemHeader item={item} subtitle={subtitle} badge={item.count > 1 ? itemCount(item) : undefined} large />

      {!isCrafting && <DurabilityMeter item={item} inventoryType={inventoryType} />}

      <ItemDescription text={itemDescription(item)} />

      {stats.length > 0 && (
        <dl className="tooltip-stats">
          {stats.map((stat, index) => (
            <div className="tooltip-stat" key={`${stat.label}-${index}`}>
              <dt>{stat.label}</dt>
              <dd className={stat.mono ? 'tooltip-stat--mono' : undefined}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {components.length > 0 && (
        <div className="tooltip-section">
          <span className="tooltip-section-title">{Locale.ui_components || 'Componentes'}</span>
          <div className="tooltip-chips">
            {components.map((component, index) => (
              <span className="tooltip-chip mri-surface-card" key={`${component}-${index}`}>
                {Items[component]?.label || component}
              </span>
            ))}
          </div>
        </div>
      )}

      {isCrafting && ingredients.length > 0 && (
        <div className="tooltip-section">
          <span className="tooltip-section-title">{Locale.ui_mri_ingredients || 'Ingredientes'}</span>
          <ul className="tooltip-ingredients">
            {ingredients.map((ingredient) => (
              <li
                key={`ingredient-${ingredient.name}`}
                className={`tooltip-ingredient mri-surface-card ${ingredient.has ? 'tooltip-ingredient--ok' : 'tooltip-ingredient--missing'}`}
              >
                <img src={getItemUrl(ingredient.name) || 'none'} alt="" />
                <span className="tooltip-ingredient-label">{ingredient.label}</span>
                <span className="tooltip-ingredient-amount">{ingredient.amount}</span>
                {ingredient.has ? <CheckIcon /> : <CrossIcon />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(SlotTooltip);
