import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { DragSource } from '../../typings';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import UsefulControls from './UsefulControls';
import { GiveBoxIcon, UseHandIcon } from '../utils/icons/InventoryIcons';
import { closeTooltip } from '../../store/tooltip';
import { closeContextMenu } from '../../store/contextMenu';

const formatAmount = (n: number) => (n > 0 ? n.toLocaleString('en-US') : '0');
const digitsOnly = (s: string) => s.replace(/\D/g, '');
const countDigitsBefore = (s: string, index: number) => digitsOnly(s.substring(0, index)).length;

const InventoryControl: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();

  const [infoVisible, setInfoVisible] = useState(false);
  const [value, setValue] = useState(formatAmount(itemAmount));
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number | null>(null);

  const [{ isOver: overUse }, use] = useDrop<DragSource, void, { isOver: boolean }>(() => ({
    accept: 'SLOT',
    collect: (monitor) => ({ isOver: monitor.isOver() && monitor.getItem()?.inventory === 'player' }),
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [{ isOver: overGive }, give] = useDrop<DragSource, void, { isOver: boolean }>(() => ({
    accept: 'SLOT',
    collect: (monitor) => ({ isOver: monitor.isOver() && monitor.getItem()?.inventory === 'player' }),
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const commitValue = (raw: string, cursorIndex: number) => {
    const digitsBefore = countDigitsBefore(raw, cursorIndex);
    const num = parseInt(digitsOnly(raw), 10) || 0;

    setValue(formatAmount(num));
    dispatch(setItemAmount(num));
    cursorRef.current = digitsBefore;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    commitValue(event.target.value, event.target.selectionStart ?? 0);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget;
    const pos = el.selectionStart ?? 0;

    if (pos !== el.selectionEnd) return;

    if (event.key === 'Backspace' && el.value[pos - 1] === ',') {
      event.preventDefault();
      commitValue(el.value.slice(0, pos - 2) + el.value.slice(pos), pos - 2);
    } else if (event.key === 'Delete' && el.value[pos] === ',') {
      event.preventDefault();
      commitValue(el.value.slice(0, pos) + el.value.slice(pos + 2), pos);
    }
  };

  useEffect(() => {
    if (!inputRef.current || cursorRef.current === null) return;
    let newPos = 0;
    let count = 0;

    for (let i = 0; i < value.length && count < cursorRef.current; i++) {
      if (/\d/.test(value[i])) count++;
      newPos++;
    }

    inputRef.current.setSelectionRange(newPos, newPos);
    cursorRef.current = null;
  }, [value]);

  const closeInventory = () => {
    dispatch(closeTooltip());
    dispatch(closeContextMenu());
    fetchNui('exit');
  };

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      <div className="inventory-control">
        <button
          type="button"
          className={`inventory-control-button ${overUse ? 'inventory-control-button--over' : ''}`}
          ref={use}
        >
          <UseHandIcon />
          <span>{Locale.ui_use || 'Usar'}</span>
        </button>
        <input
          className="inventory-control-input mri-surface-card"
          type="text"
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          min={0}
        />
        <button
          type="button"
          className={`inventory-control-button ${overGive ? 'inventory-control-button--over' : ''}`}
          ref={give}
        >
          <GiveBoxIcon />
          <span>{Locale.ui_give || 'Enviar'}</span>
        </button>
      </div>
      <div className="inventory-footer">
        <button type="button" className="inventory-footer-link" onClick={() => setInfoVisible(true)}>
          {Locale.ui_usefulcontrols || 'Controles'}
        </button>
        <button type="button" className="inventory-footer-close" onClick={closeInventory}>
          <span>{Locale.ui_mri_close || 'Fechar inventário'}</span>
          <kbd>ESC</kbd>
        </button>
      </div>
    </>
  );
};

export default InventoryControl;
