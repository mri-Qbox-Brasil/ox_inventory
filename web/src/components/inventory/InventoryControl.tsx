import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { DragSource } from '../../typings';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import UsefulControls from './UsefulControls';

const InventoryControl: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();

  const [infoVisible, setInfoVisible] = useState(false);

  const [, use] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [, give] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.valueAsNumber =
      isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
    dispatch(setItemAmount(event.target.valueAsNumber));
  };

  return (
    <>
      <div className="inventory-control flex items-start justify-center px-3">
        <div className="grid grid-cols-1 gap-2.5">
          <input
            className="w-50 2k:w-50 4k:w-100 px-1 py-2.5 2k:py-4 4k:py-6 2k:text-xl 4k:text-3xl bg-dark bg-opacity-40 rounded-md text-center mb-8 focus:outline-none hover:border-gray-400/20 border border-transparent focus:border-gray-400 transition-colors duration-300"
            type="number"
            defaultValue={itemAmount}
            onChange={inputHandler}
          />
        </div>
      </div>
    </>
  );
};

export default InventoryControl;
