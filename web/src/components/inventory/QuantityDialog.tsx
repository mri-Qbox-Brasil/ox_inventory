import React from 'react';
import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { requestQuantity, useQuantityRequest } from '../../lib/inventoryUx';
import { Locale } from '../../store/locale';

const clamp = (value: number, max: number) => Math.min(Math.max(Math.round(value) || 1, 1), max);

const QuantityDialog: React.FC = () => {
  const request = useQuantityRequest();
  const [amount, setAmount] = React.useState(1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const open = request !== null;

  const close = () => requestQuantity(null);

  const { refs, context } = useFloating({ open, onOpenChange: (value) => !value && close() });
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown', escapeKey: false });
  const { getFloatingProps } = useInteractions([dismiss]);

  React.useEffect(() => {
    if (!request) return;

    setAmount(clamp(request.initial, request.max));
    requestAnimationFrame(() => inputRef.current?.select());
  }, [request]);

  if (!request) return null;

  const { max } = request;

  const confirm = () => {
    request.onConfirm(clamp(amount, max));
    close();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
    } else if (event.key === 'Enter') {
      confirm();
    }
  };

  return (
    <FloatingPortal>
      <FloatingOverlay lockScroll className="quantity-dialog-overlay">
        <FloatingFocusManager context={context} initialFocus={inputRef}>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            className="quantity-dialog mri-surface"
            onKeyUp={handleKeyUp}
            onWheel={(event) => setAmount((current) => clamp(current + (event.deltaY < 0 ? 1 : -1), max))}
          >
            <p className="quantity-dialog-title">{request.title}</p>

            <div className="quantity-dialog-value">
              <button type="button" onClick={() => setAmount((current) => clamp(current - 1, max))}>
                −
              </button>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(clamp(Number(event.target.value.replace(/\D/g, '')), max))}
              />
              <button type="button" onClick={() => setAmount((current) => clamp(current + 1, max))}>
                +
              </button>
            </div>

            <input
              className="quantity-dialog-slider"
              type="range"
              min={1}
              max={max}
              value={amount}
              style={{ '--fill': `${max > 1 ? ((amount - 1) / (max - 1)) * 100 : 100}%` } as React.CSSProperties}
              onChange={(event) => setAmount(clamp(Number(event.target.value), max))}
            />

            <div className="quantity-dialog-presets">
              <button type="button" onClick={() => setAmount(1)}>
                1
              </button>
              <button type="button" onClick={() => setAmount(clamp(max / 2, max))}>
                ½
              </button>
              <button type="button" onClick={() => setAmount(max)}>
                {Locale.ui_mri_all || 'Tudo'}
              </button>
            </div>

            <div className="quantity-dialog-actions">
              <button type="button" className="quantity-dialog-cancel" onClick={close}>
                {Locale.ui_mri_cancel || 'Cancelar'}
              </button>
              <button type="button" className="quantity-dialog-confirm" onClick={confirm}>
                {request.confirmLabel}
              </button>
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};

export default QuantityDialog;
