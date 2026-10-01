import React from 'react';
import { useDragLayer } from 'react-dnd';
import { useAppSelector } from '../../store';
import { Locale } from '../../store/locale';
import { DragSource } from '../../typings';
import { useHoveredSlot } from '../../lib/inventoryUx';
import { ControlCombo, MouseAction } from '../utils/icons/ControlGlyphs';

type Hint = { keys?: string[]; mouse?: MouseAction; label: string };

const t = (key: string, fallback: string) => Locale[key] || fallback;

const HintBar: React.FC = () => {
  const hovered = useHoveredSlot();
  const rightType = useAppSelector((state) => state.inventory.rightInventory.type);
  const { dragging, source } = useDragLayer((monitor) => ({
    dragging: monitor.isDragging(),
    source: monitor.getItem() as DragSource | null,
  }));

  const toGround = rightType === 'drop' || rightType === 'newdrop';
  const release = toGround ? t('ui_drop', 'Largar') : t('ui_mri_store', 'Guardar');
  const amount: Hint = { mouse: 'wheel', label: t('ui_mri_hint_amount', 'Quantidade') };

  let hints: Hint[];
  let context = 'idle';

  if (dragging && source) {
    context = 'drag';
    hints =
      source.inventory === 'shop'
        ? [{ mouse: 'drag', label: t('ui_mri_hint_buy', 'Soltar no inventário para comprar') }, amount]
        : source.inventory === 'crafting'
        ? [{ mouse: 'drag', label: t('ui_mri_hint_craft', 'Soltar no inventário para fabricar') }, amount]
        : [
            { mouse: 'drag', label: t('ui_mri_hint_drop_slot', 'Soltar num slot') },
            amount,
            { keys: ['SHIFT'], label: t('ui_mri_hint_half', 'Metade') },
            ...(source.inventory === 'player'
              ? [{ label: `${t('ui_mri_hint_drop_outside', 'Solte fora para')} ${release.toLowerCase()}` }]
              : []),
          ];
  } else if (hovered?.inventoryType === 'player') {
    context = 'own';
    hints = [
      { keys: ['E'], label: t('ui_use', 'Usar') },
      { mouse: 'right', label: t('ui_mri_hint_actions', 'Ações') },
      { keys: ['1-5'], label: t('ui_mri_hint_hotbar', 'Atalho') },
      { keys: ['F'], label: release },
    ];
  } else if (hovered?.inventoryType === 'shop') {
    context = 'shop';
    hints = [{ mouse: 'drag', label: t('ui_mri_hint_buy_short', 'Comprar') }, amount];
  } else if (hovered?.inventoryType === 'crafting') {
    context = 'craft';
    hints = [{ mouse: 'drag', label: t('ui_mri_hint_craft_short', 'Fabricar') }, amount];
  } else if (hovered) {
    context = 'other';
    hints = [
      { keys: ['F'], label: t('ui_mri_take', 'Pegar') },
      { mouse: 'right', label: t('ui_mri_hint_actions', 'Ações') },
      { keys: ['1-5'], label: t('ui_mri_hint_hotbar', 'Atalho') },
    ];
  } else {
    hints = [
      { mouse: 'drag', label: t('ui_mri_hint_move', 'Mover') },
      { keys: ['E'], label: t('ui_use', 'Usar') },
      { mouse: 'right', label: t('ui_mri_hint_actions', 'Ações') },
    ];
  }

  return (
    <div key={context} className={`hint-bar ${context === 'idle' ? 'hint-bar--idle' : ''}`}>
      {hints.map((hint, index) => (
        <span className="hint-bar-item" key={index}>
          {(hint.keys || hint.mouse) && <ControlCombo keys={hint.keys} mouse={hint.mouse} />}
          <span className="hint-bar-label">{hint.label}</span>
        </span>
      ))}
    </div>
  );
};

export default HintBar;
