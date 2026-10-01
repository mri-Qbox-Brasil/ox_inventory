import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import UsefulControls from './UsefulControls';
import HintBar from './HintBar';
import { closeTooltip } from '../../store/tooltip';
import { closeContextMenu } from '../../store/contextMenu';

const InventoryControl: React.FC = () => {
  const dispatch = useAppDispatch();
  const [infoVisible, setInfoVisible] = useState(false);

  const closeInventory = () => {
    dispatch(closeTooltip());
    dispatch(closeContextMenu());
    fetchNui('exit');
  };

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      <HintBar />
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
