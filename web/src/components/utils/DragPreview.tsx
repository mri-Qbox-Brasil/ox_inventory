import React, { RefObject, useEffect, useRef } from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';
import { DragSource } from '../../typings';

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

const DragPreview: React.FC = () => {
  const element = useRef<HTMLDivElement>(null);
  const pointer = useRef<XYCoord | null>(null);

  const { data, isDragging, currentOffset } = useDragLayer<DragLayerProps>((monitor) => ({
    data: monitor.getItem(),
    currentOffset: calculatePointerPosition(monitor, element),
    isDragging: monitor.isDragging(),
  }));

  pointer.current = currentOffset;

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
        </div>
      )}
    </>
  );
};

export default DragPreview;
