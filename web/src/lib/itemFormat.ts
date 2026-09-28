import { Inventory } from '../typings';

export type DurabilityLevel = 'good' | 'fair' | 'worn' | 'broken';

/** Peso em gramas formatado em g ou kg (pt-BR). */
export const formatWeight = (weight: number) =>
  weight >= 1000
    ? `${(weight / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}kg`
    : `${weight.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}g`;

/** Faixa de durabilidade usada nas cores de status; null em lojas ou sem durabilidade. */
export const durabilityLevel = (
  durability: number | undefined,
  inventoryType?: Inventory['type']
): DurabilityLevel | null => {
  if (inventoryType === 'shop' || durability === undefined) return null;
  if (durability >= 75) return 'good';
  if (durability >= 50) return 'fair';
  if (durability >= 15) return 'worn';

  return 'broken';
};
