import { Locale } from '../../store/locale';
import React from 'react';
import { ControlCombo, MouseAction } from '../utils/icons/ControlGlyphs';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';

const CONTROLS: { keys?: string[]; mouse?: MouseAction; text: string; fallback: string }[] = [
  { mouse: 'drag', text: 'ui_mri_ctrl_drag', fallback: 'Mover o item; solte fora do inventário para largar' },
  { mouse: 'wheel', text: 'ui_mri_ctrl_wheel', fallback: 'Enquanto arrasta, escolhe a quantidade (SHIFT vai de 10 em 10)' },
  { keys: ['E'], text: 'ui_mri_ctrl_e', fallback: 'Com o mouse em cima, usa ou equipa o item' },
  { mouse: 'right', text: 'ui_mri_ctrl_rmb', fallback: 'Ações do item: usar, enviar, dividir, pegar...' },
  { keys: ['SHIFT'], mouse: 'left', text: 'ui_mri_ctrl_shift', fallback: 'Transferir a pilha inteira para o outro inventário' },
  { keys: ['SHIFT'], mouse: 'drag', text: 'ui_mri_ctrl_shift_drag', fallback: 'Arrastar segurando SHIFT leva metade da pilha' },
  { keys: ['1-5'], text: 'ui_mri_ctrl_hotbar', fallback: 'Com o mouse em cima, manda o item para o atalho' },
  { keys: ['F'], text: 'ui_mri_ctrl_f', fallback: 'Com o mouse em cima, larga o item ou pega do chão' },
  { keys: ['CTRL', 'C'], text: 'ui_ctrl_c', fallback: 'Ao passar o mouse sobre uma arma, copia seu número de série' },
];

interface Props {
  infoVisible: boolean;
  setInfoVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsefulControls: React.FC<Props> = ({ infoVisible, setInfoVisible }) => {
  const { refs, context } = useFloating({
    open: infoVisible,
    onOpenChange: setInfoVisible,
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  return (
    <>
      {isMounted && (
        <FloatingPortal>
          <FloatingOverlay lockScroll className="useful-controls-dialog-overlay" data-open={infoVisible} style={styles}>
            <FloatingFocusManager context={context}>
              <div ref={refs.setFloating} {...getFloatingProps()} className="useful-controls-dialog mri-surface" style={styles}>
                <div className="useful-controls-dialog-title">
                  <p>{Locale.ui_usefulcontrols || 'Useful controls'}</p>
                  <div className="useful-controls-dialog-close" onClick={() => setInfoVisible(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 400 528">
                      <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                    </svg>
                  </div>
                </div>
                <div className="useful-controls-content-wrapper">
                  {CONTROLS.map((control) => (
                    <div className="control-row" key={control.text}>
                      <ControlCombo keys={control.keys} mouse={control.mouse} />
                      <span className="control-description">{Locale[control.text] || control.fallback}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: '0.6rem' }}>
                    <span>by mri Qbox</span>
                    <img
                      className="w-6 p-1"
                      src="https://avatars.githubusercontent.com/u/164149697?s=200&v=4"
                      alt="Logo"
                    />
                  </div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
};

export default UsefulControls;
