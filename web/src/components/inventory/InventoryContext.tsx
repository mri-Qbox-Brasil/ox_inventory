import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { onDrop } from '../../dnd/onDrop';
import { Items } from '../../store/items';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { isSlotWithItem } from '../../helpers';
import { setClipboard } from '../../utils/setClipboard';
import { useAppSelector } from '../../store';
import React from 'react';
import { Menu, MenuItem } from '../utils/menu/Menu';
import {
  ActionIcon,
  CopyIcon,
  DropIcon,
  GiveIcon,
  RemoveIcon,
  SplitIcon,
  TakeIcon,
  UseIcon,
  WrenchIcon,
} from '../utils/icons/MenuIcons';
import { requestQuantity } from '../../lib/inventoryUx';
import { formatWeight } from '../../lib/itemFormat';
import { DurabilityMeter, ItemDescription, ItemHeader, itemCount, itemDescription } from './ItemDetails';

interface DataProps {
  action: string;
  component?: string;
  slot?: number;
  serial?: string;
  id?: number;
}

interface Button {
  label: string;
  index: number;
  group?: string;
}

interface Group {
  groupName: string | null;
  buttons: ButtonWithIndex[];
}

interface ButtonWithIndex extends Button {
  index: number;
}

interface GroupedButtons extends Array<Group> {}

const InventoryContext: React.FC = () => {
  const contextMenu = useAppSelector((state) => state.contextMenu);
  const rightType = useAppSelector((state) => state.inventory.rightInventory.type);
  const leftItems = useAppSelector((state) => state.inventory.leftInventory.items);
  const item = contextMenu.item;
  const isOwn = contextMenu.inventoryType === 'player';
  const toGround = rightType === 'drop' || rightType === 'newdrop';

  const askQuantity = (title: string, confirmLabel: string, max: number, initial: number, onConfirm: (n: number) => void) =>
    max > 1 ? requestQuantity({ title, confirmLabel, max, initial, onConfirm }) : onConfirm(max);

  const handleClick = (data: DataProps) => {
    if (!item) return;

    switch (data && data.action) {
      case 'use':
        onUse({ name: item.name, slot: item.slot });
        break;
      case 'give':
        askQuantity(Locale.ui_give || 'Enviar', Locale.ui_give || 'Enviar', item.count, 1, (amount) =>
          onGive({ name: item.name, slot: item.slot }, amount)
        );
        break;
      case 'drop':
        isSlotWithItem(item) && onDrop({ item: item, inventory: 'player' }, undefined, 0);
        break;
      case 'take':
        isSlotWithItem(item) && onDrop({ item, inventory: contextMenu.inventoryType }, undefined, 0);
        break;
      case 'takeAmount':
        askQuantity(Locale.ui_mri_take_amount || 'Pegar quantidade', Locale.ui_mri_take || 'Pegar', item.count, item.count, (amount) =>
          onDrop({ item, inventory: contextMenu.inventoryType }, undefined, amount)
        );
        break;
      case 'split': {
        const empty = leftItems.find((slot) => !slot.name);
        if (!empty) return;

        askQuantity(Locale.ui_mri_split || 'Dividir', Locale.ui_mri_split || 'Dividir', item.count - 1, Math.floor(item.count / 2), (amount) =>
          onDrop({ item, inventory: 'player' }, { inventory: 'player', item: { slot: empty.slot } }, amount)
        );
        break;
      }
      case 'remove':
        fetchNui('removeComponent', { component: data?.component, slot: data?.slot });
        break;
      case 'removeAmmo':
        fetchNui('removeAmmo', item.slot);
        break;
      case 'copy':
        setClipboard(data.serial || '');
        break;
      case 'custom':
        fetchNui('useButton', { id: (data?.id || 0) + 1, slot: item.slot });
        break;
    }
  };

  const groupButtons = (buttons: any): GroupedButtons => {
    return buttons.reduce((groups: Group[], button: Button, index: number) => {
      if (button.group) {
        const groupIndex = groups.findIndex((group) => group.groupName === button.group);
        if (groupIndex !== -1) {
          groups[groupIndex].buttons.push({ ...button, index });
        } else {
          groups.push({
            groupName: button.group,
            buttons: [{ ...button, index }],
          });
        }
      } else {
        groups.push({
          groupName: null,
          buttons: [{ ...button, index }],
        });
      }
      return groups;
    }, []);
  };

  const hasItem = !!item && isSlotWithItem(item);
  const canSplit = isOwn && !!item && item.count > 1;
  const hasExtraActions =
    !!item &&
    (canSplit ||
      !!item.metadata?.serial ||
      (isOwn &&
        (item.metadata?.ammo > 0 ||
          (item.metadata?.components?.length || 0) > 0 ||
          (Items[item.name!]?.buttons?.length || 0) > 0)));
  const subtitle =
    hasItem &&
    [item.count > 1 ? itemCount(item) : null, item.weight > 0 ? formatWeight(item.weight) : null]
      .filter(Boolean)
      .join(' · ');

  return (
    <>
      <Menu
        header={
          hasItem && (
            <div className="context-menu-header">
              <ItemHeader item={item} subtitle={subtitle || undefined} large />
              <ItemDescription text={itemDescription(item)} clamp />
              <DurabilityMeter item={item} />
            </div>
          )
        }
      >
        {isOwn ? (
          <div className="context-menu-tiles">
            <MenuItem variant="tile" onClick={() => handleClick({ action: 'use' })} label={Locale.ui_use || 'Usar'} icon={<UseIcon />} />
            <MenuItem variant="tile" onClick={() => handleClick({ action: 'give' })} label={Locale.ui_give || 'Enviar'} icon={<GiveIcon />} />
            <MenuItem
              variant="tile"
              onClick={() => handleClick({ action: 'drop' })}
              label={toGround ? Locale.ui_drop || 'Largar' : Locale.ui_mri_store || 'Guardar'}
              icon={<DropIcon />}
            />
          </div>
        ) : (
          <div className="context-menu-tiles">
            <MenuItem variant="tile" onClick={() => handleClick({ action: 'take' })} label={Locale.ui_mri_take || 'Pegar'} icon={<TakeIcon />} />
            {item && item.count > 1 && (
              <MenuItem
                variant="tile"
                onClick={() => handleClick({ action: 'takeAmount' })}
                label={Locale.ui_mri_take_some || 'Pegar parte'}
                icon={<SplitIcon />}
              />
            )}
          </div>
        )}
        {hasExtraActions && <span className="context-menu-section">{Locale.ui_mri_more_actions || 'Mais ações'}</span>}
        {canSplit && (
          <MenuItem onClick={() => handleClick({ action: 'split' })} label={Locale.ui_mri_split || 'Dividir'} icon={<SplitIcon />} />
        )}
        {isOwn && item && item.metadata?.ammo > 0 && (
          <MenuItem
            onClick={() => handleClick({ action: 'removeAmmo' })}
            label={Locale.ui_remove_ammo || 'Remover munição'}
            icon={<RemoveIcon />}
          />
        )}
        {item && item.metadata?.serial && (
          <MenuItem
            onClick={() => handleClick({ action: 'copy', serial: item.metadata?.serial })}
            label={Locale.ui_copy || 'Copiar número de série'}
            icon={<CopyIcon />}
          />
        )}
        {isOwn && item && item.metadata?.components && item.metadata?.components.length > 0 && (
          <Menu label={Locale.ui_removeattachments || 'Remover acessórios'} icon={<WrenchIcon />}>
            {item &&
              item.metadata?.components.map((component: string, index: number) => (
                <MenuItem
                  key={index}
                  onClick={() => handleClick({ action: 'remove', component, slot: item.slot })}
                  label={Items[component]?.label || ''}
                />
              ))}
          </Menu>
        )}
        {isOwn && ((item && item.name && Items[item.name]?.buttons?.length) || 0) > 0 && (
          <>
            {item &&
              item.name &&
              groupButtons(Items[item.name]?.buttons).map((group: Group, index: number) => (
                <React.Fragment key={index}>
                  {group.groupName ? (
                    <Menu label={group.groupName} icon={<ActionIcon />}>
                      {group.buttons.map((button: Button) => (
                        <MenuItem
                          key={button.index}
                          onClick={() => handleClick({ action: 'custom', id: button.index })}
                          label={button.label}
                          icon={<ActionIcon />}
                        />
                      ))}
                    </Menu>
                  ) : (
                    group.buttons.map((button: Button) => (
                      <MenuItem
                        key={button.index}
                        onClick={() => handleClick({ action: 'custom', id: button.index })}
                        label={button.label}
                        icon={<ActionIcon />}
                      />
                    ))
                  )}
                </React.Fragment>
              ))}
          </>
        )}
      </Menu>
    </>
  );
};

export default InventoryContext;
