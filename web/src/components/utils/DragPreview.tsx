import React, { useEffect, useRef } from 'react';
import { useDragDropManager, useDragLayer } from 'react-dnd';
import { DragSource } from '../../typings';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';

interface DragLayerProps {
  data: DragSource;
  isDragging: boolean;
}

/** Same as the 7.7vh box in index.scss, so the pointer sits in the middle without reading layout. */
const previewHalf = () => (window.innerHeight * 0.077) / 2;

/** Inclinação máxima (graus) do item arrastado conforme a velocidade do mouse. */
export const DRAG_MAX_TILT = 14;

/** Teto da rodinha ao arrastar de loja/craft sem estoque definido. */
export const DRAG_PRICED_MAX = 100;

const DragPreview: React.FC = () => {
  const element = useRef<HTMLDivElement>(null);
  const tiltElement = useRef<HTMLSpanElement>(null);
  const monitor = useDragDropManager().getMonitor();

  // Position is written straight to the DOM each frame; React only renders when the drag starts or ends.
  const { data, isDragging } = useDragLayer<DragLayerProps>((monitor) => ({
    data: monitor.getItem(),
    isDragging: monitor.isDragging(),
  }));

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
    document.documentElement.classList.toggle('inv-dragging', isDragging);
    if (!isDragging) return;

    let frame = 0;
    let tilt = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;
    const half = previewHalf();

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const offset = monitor.getClientOffset();
      if (!offset || !element.current || !tiltElement.current) return;

      const velocity = lastX !== null ? offset.x - lastX : 0;
      const target = Math.max(-DRAG_MAX_TILT, Math.min(DRAG_MAX_TILT, velocity * 0.9));
      const moved = offset.x !== lastX || offset.y !== lastY;

      lastX = offset.x;
      lastY = offset.y;
      if (!moved && Math.abs(tilt) < 0.05 && target === 0) return;

      tilt += (target - tilt) * 0.18;
      element.current.style.transform = `translate3d(${offset.x - half}px, ${offset.y - half}px, 0)`;
      tiltElement.current.style.transform = `rotate(${tilt.toFixed(2)}deg)`;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isDragging, monitor]);

  const start = isDragging ? monitor.getClientOffset() : null;
  const half = previewHalf();

  return (
    <>
      {isDragging && start && data?.item && (
        <div
          className="item-drag-preview"
          ref={element}
          style={{ transform: `translate3d(${start.x - half}px, ${start.y - half}px, 0)` }}
        >
          <span className="item-drag-preview-tilt" ref={tiltElement}>
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
