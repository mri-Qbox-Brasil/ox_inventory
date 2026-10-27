import { TouchBackend, TouchBackendImpl } from 'react-dnd-touch-backend';

type BackendArgs = Parameters<typeof TouchBackend>;

type Internals = {
  actions: { publishDragSource: () => unknown };
  monitor: { isSourcePublic: () => boolean | null };
  dragOverTargetIds?: string[];
};

// Stock TouchBackend hit-tests once per drop target on every mouse move and republishes the source,
// which re-runs every slot's collect; this keeps a single elementsFromPoint per move.
class InventoryDragBackend extends TouchBackendImpl {
  constructor(manager: BackendArgs[0], context: BackendArgs[1], options: BackendArgs[2]) {
    super(manager, context ?? {}, options ?? {});
    const self = this as unknown as Internals;
    const actions = self.actions;

    self.actions = {
      ...actions,
      publishDragSource: () => (self.monitor.isSourcePublic() ? undefined : actions.publishDragSource()),
    };
    this.handleTopMoveCapture = () => {
      self.dragOverTargetIds = [...this.targetNodes.keys()];
    };
  }

  connectDropTarget(targetId: string, node: HTMLElement) {
    this.targetNodes.set(targetId, node);
    return () => {
      this.targetNodes.delete(targetId);
    };
  }
}

export const InventoryBackend = (...[manager, context, options]: BackendArgs) => new InventoryDragBackend(manager, context, options);
