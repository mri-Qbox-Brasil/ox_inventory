import React from 'react';

export type MouseAction = 'left' | 'right' | 'drag' | 'wheel';

/** Tecla física (CTRL, ALT, SHIFT, C...) com topo, borda e sombra de profundidade. */
export const KeyCap: React.FC<{ label: string }> = ({ label }) => <kbd className="control-key">{label}</kbd>;

/** Mouse em SVG com o botão (ou a rodinha) usado aceso na cor da suíte. */
export const MouseGlyph: React.FC<{ action: MouseAction }> = ({ action }) => {
  const button = action === 'wheel' ? null : action === 'right' ? 'right' : 'left';

  return (
    <span className={`control-mouse control-mouse--${action}`}>
      <svg viewBox="0 0 24 34" aria-hidden>
        <rect className="control-mouse-body" x="3" y="2" width="18" height="30" rx="9" />
        {button && (
          <path
            className="control-mouse-button"
            d={button === 'left' ? 'M12 2.6C7.3 2.6 3.6 6.3 3.6 11v2.4H12Z' : 'M12 2.6c4.7 0 8.4 3.7 8.4 8.4v2.4H12Z'}
          />
        )}
        <path className="control-mouse-line" d="M12 2.6v10.8M3.6 13.4h16.8" />
        <rect
          className={`control-mouse-wheel ${action === 'wheel' ? 'control-mouse-wheel--active' : ''}`}
          x="10.8"
          y="6"
          width="2.4"
          height="4.4"
          rx="1.2"
        />
      </svg>
      {action === 'drag' && (
        <svg className="control-mouse-arrows" viewBox="0 0 34 12" aria-hidden>
          <path d="M5 2 1 6l4 4M29 2l4 4-4 4M1 6h32" />
        </svg>
      )}
      {action === 'wheel' && (
        <svg className="control-mouse-scroll" viewBox="0 0 10 24" aria-hidden>
          <path d="M1.5 6 5 2l3.5 4M1.5 18 5 22l3.5-4" />
        </svg>
      )}
    </span>
  );
};

/** Combinação de teclas e mouse separada por "+". */
export const ControlCombo: React.FC<{ keys?: string[]; mouse?: MouseAction }> = ({ keys = [], mouse }) => {
  const parts = [
    ...keys.map((key) => <KeyCap key={key} label={key} />),
    ...(mouse ? [<MouseGlyph key="mouse" action={mouse} />] : []),
  ];

  return (
    <span className="control-combo">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="control-plus">+</span>}
          {part}
        </React.Fragment>
      ))}
    </span>
  );
};
