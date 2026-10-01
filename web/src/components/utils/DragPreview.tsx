import React, { RefObject, useEffect, useRef } from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';
import { DragSource } from '../../typings';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';

interface DragLayerProps {
  data: DragSource;
  currentOffset: XYCoord | null;
  isDragging: boolean;
}

const subtract = (a: XYCoord, b: XYCoord): XYCoord => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
};

const calculateParentOffset = (monitor: DragLayerMonitor): XYCoord => {
  const client = monitor.getInitialClientOffset();
  const source = monitor.getInitialSourceClientOffset();
  if (client === null || source === null || client.x === undefined || client.y === undefined) {
    return { x: 0, y: 0 };
  }
  return subtract(client, source);
};

export const calculatePointerPosition = (monitor: DragLayerMonitor, childRef: RefObject<Element>): XYCoord | null => {
  const offset = monitor.getClientOffset();
  if (offset === null) {
    return null;
  }

  if (!childRef.current || !childRef.current.getBoundingClientRect) {
    return subtract(offset, calculateParentOffset(monitor));
  }

  const bb = childRef.current.getBoundingClientRect();
  const middle = { x: bb.width / 2, y: bb.height / 2 };
  return subtract(offset, middle);
};

/** Inclinação máxima (graus) do item arrastado conforme a velocidade do mouse. */
export const DRAG_MAX_TILT = 14;

/** Teto da rodinha ao arrastar de loja/craft sem estoque definido. */
export const DRAG_PRICED_MAX = 100;

const DragPreview: React.FC = () => {
  const element = useRef<HTMLDivElement>(null);
  const pointer = useRef<XYCoord | null>(null);

  const { data, isDragging, currentOffset } = useDragLayer<DragLayerProps>((monitor) => ({
    data: monitor.getItem(),
    currentOffset: calculatePointerPosition(monitor, element),
    isDragging: monitor.isDragging(),
  }));

  pointer.current = currentOffset;

  const dispatch = useAppDispatch();
  const amount = useAppSelector(selectItemAmount);
  const sourceCount = useAppSelector((state) => {
    if (!data?.item) return 0;

    const inventory = data.inventory === 'player' ? state.inventory.leftInventory : state.inventory.rightInventory;
    return inventory.items[data.item.slot - 1]?.count ?? 0;
  });
  const priced = data?.inventory === 'shop' || data?.inventory === 'crafting';
  const max = priced ? sourceCount || DRAG_PRICED_MAX : sourceCount;
  const shiftPressed = useAppSelector((state) => state.inventory.shiftPressed);
  const shown = amount || (priced ? 1 : shiftPressed && sourceCount > 1 ? Math.floor(sourceCount / 2) : sourceCount);
  const wheel = useRef({ shown, max, priced });
  wheel.current = { shown, max, priced };

  useEffect(() => {
    dispatch(setItemAmount(0));
    if (!isDragging) return;

    const onWheel = (event: WheelEvent) => {
      const { shown, max, priced } = wheel.current;
      if (max <= 1) return;

      event.preventDefault();
      const step = (event.deltaY < 0 ? 1 : -1) * (event.shiftKey ? 10 : 1);
      const next = Math.min(Math.max(shown + step, 1), max);

      dispatch(setItemAmount(next === max && !priced ? 0 : next));
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [isDragging, dispatch]);

  useEffect(() => {
    if (!isDragging) return;

    let frame = 0;
    let tilt = 0;
    let lastX: number | null = null;

    const tick = () => {
      const x = pointer.current?.x ?? null;
      const velocity = x !== null && lastX !== null ? x - lastX : 0;
      const target = Math.max(-DRAG_MAX_TILT, Math.min(DRAG_MAX_TILT, velocity * 0.9));

      lastX = x;
      tilt += (target - tilt) * 0.18;
      element.current?.style.setProperty('--drag-tilt', `${tilt.toFixed(2)}deg`);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isDragging]);

  return (
    <>
      {isDragging && currentOffset && data.item && (
        <div
          className="item-drag-preview"
          ref={element}
          style={{ transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)` }}
        >
          <span className="item-drag-preview-tilt">
            <span className="item-drag-preview-image" style={{ backgroundImage: data.image }} />
          </span>
          {max > 1 && (
            <span key={shown} className="item-drag-preview-count">
              {shown.toLocaleString('pt-BR')}
              {!priced && <small>/{max.toLocaleString('pt-BR')}</small>}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default DragPreview;
