import React, { useRef } from 'react';
import { flip, FloatingPortal, offset, shift, useFloating, useTransitionStyles } from '@floating-ui/react';
import { useAppSelector } from '../../store';
import SlotTooltip from '../inventory/SlotTooltip';
import { useDebounce } from '../../hooks/useDebounce';

const Tooltip: React.FC = () => {
  const hoverData = useAppSelector((state) => state.tooltip);
  const debounce = useDebounce(hoverData.open, 500);
  const [open, setOpen] = React.useState(false);
  const openTimer = useRef<NodeJS.Timer | null>(null);
  const canOpen = useRef(false);

  const { refs, context, floatingStyles } = useFloating({
    middleware: [flip(), shift(), offset({ mainAxis: 10, crossAxis: 10 })],
    open: hoverData.open,
    placement: 'right-start',
  });

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 200,
  });

  const pointer = useRef({ x: 0, y: 0 });
  const openRef = useRef(false);
  openRef.current = hoverData.open;

  const placeAt = (clientX: number, clientY: number) => {
    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: clientX,
          y: clientY,
          left: clientX,
          top: clientY,
          right: clientX,
          bottom: clientY,
        };
      },
    });
  };

  // Only the open tooltip follows the mouse; updating it closed re-rendered on every move.
  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    pointer.current = { x: clientX, y: clientY };
    if (openRef.current) placeAt(clientX, clientY);
  };

  React.useLayoutEffect(() => {
    if (hoverData.open) placeAt(pointer.current.x, pointer.current.y);
  }, [hoverData.open]);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {isMounted && hoverData.item && hoverData.inventoryType && (
        <FloatingPortal>
          <SlotTooltip
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...styles }}
            item={hoverData.item!}
            inventoryType={hoverData.inventoryType!}
          />
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
