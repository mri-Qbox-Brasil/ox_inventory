import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Inventory, SlotWithItem } from '../../typings';
import { Items } from '../../store/items';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { durabilityLevel } from '../../lib/itemFormat';

/** Nome exibido do item: label do metadata, label do item ou o nome interno. */
export const itemLabel = (item: SlotWithItem) => item.metadata?.label || Items[item.name]?.label || item.name;

/** Descrição do item: a do metadata tem prioridade sobre a do cadastro. */
export const itemDescription = (item: SlotWithItem): string | undefined =>
  item.metadata?.description || Items[item.name]?.description;

/** Quantidade formatada; dinheiro sai em R$. */
export const itemCount = (item: SlotWithItem) =>
  item.name === 'money' ? `${Locale.$ || 'R$'}${item.count.toLocaleString('pt-BR')}` : `${item.count.toLocaleString('pt-BR')}x`;

export const ItemHeader: React.FC<{
  item: SlotWithItem;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  large?: boolean;
}> = ({ item, subtitle, badge, large }) => (
  <div className={`item-header ${large ? 'item-header--large' : ''}`}>
    <span className="item-header-thumb" style={{ backgroundImage: `url(${getItemUrl(item) || 'none'})` }} />
    <div className="item-header-text">
      <span className="item-header-title">{itemLabel(item)}</span>
      {subtitle && <span className="item-header-subtitle">{subtitle}</span>}
    </div>
    {badge && <span className="item-header-badge">{badge}</span>}
  </div>
);

export const DurabilityMeter: React.FC<{ item: SlotWithItem; inventoryType?: Inventory['type'] }> = ({
  item,
  inventoryType,
}) => {
  const level = durabilityLevel(item.durability, inventoryType);
  if (!level || item.durability === undefined) return null;
  const value = Math.max(0, Math.min(100, Math.trunc(item.durability)));

  return (
    <div className={`durability-meter durability-meter--${level}`}>
      <div className="durability-meter-row">
        <span>{Locale.ui_durability || 'Durabilidade'}</span>
        <span className="durability-meter-value">{value}%</span>
      </div>
      <div className="durability-meter-track">
        <div className="durability-meter-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export const ItemDescription: React.FC<{ text?: string; clamp?: boolean }> = ({ text, clamp }) =>
  text ? (
    <ReactMarkdown className={`item-description ${clamp ? 'item-description--clamp' : ''}`}>{text}</ReactMarkdown>
  ) : null;
