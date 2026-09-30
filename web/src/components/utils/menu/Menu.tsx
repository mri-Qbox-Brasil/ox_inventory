// https://floating-ui.com/docs/react-examples
// https://codesandbox.io/s/admiring-lamport-5wt3yg?file=/src/DropdownMenu.tsx

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTransitionStyles,
  useTypeahead,
} from '@floating-ui/react';
import * as React from 'react';
import { useAppSelector } from '../../../store';
import { ChevronRightIcon } from '../icons/MenuIcons';

const MenuContext = React.createContext<{
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}>({
  getItemProps: () => ({}),
  activeIndex: null,
  setActiveIndex: () => { },
  setHasFocusInside: () => { },
  isOpen: false,
});

interface MenuProps {
  label?: string;
  nested?: boolean;
  icon?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export const MenuComponent = React.forwardRef<HTMLButtonElement, MenuProps & React.HTMLProps<HTMLButtonElement>>(
  ({ children, label, icon, header, ...props }, forwardedRef) => {
    const menu = useAppSelector((state) => state.contextMenu);
    const [isOpen, setIsOpen] = React.useState(false);
    const [hasFocusInside, setHasFocusInside] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
    const labelsRef = React.useRef<Array<string | null>>([]);
    const parent = React.useContext(MenuContext);

    const tree = useFloatingTree();
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const item = useListItem();

    const isNested = parentId != null;

    const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
      nodeId,
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: isNested ? 'right-start' : 'bottom-start',
      middleware: [offset({ mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0 }), flip(), shift()],
      whileElementsMounted: autoUpdate,
      transform: false,
    });

    const { isMounted, styles } = useTransitionStyles(context, {
      duration: { open: 220, close: 120 },
      initial: { opacity: 0, transform: 'scale(0.92) translateY(-0.6vh)' },
      common: ({ side }) => ({
        transformOrigin: side === 'top' ? 'bottom left' : side === 'right' ? 'left top' : 'top left',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      }),
    });

    React.useEffect(() => {
      if (isNested) return;
      if (menu.coords) {
        refs.setPositionReference({
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: menu.coords!.x,
              y: menu.coords!.y,
              top: menu.coords!.y,
              right: menu.coords!.x,
              bottom: menu.coords!.y,
              left: menu.coords!.x,
            };
          },
        });

        setIsOpen(true);
      }

      if (!menu.coords) {
        setIsOpen(false);
      }
    }, [menu]);

    const hover = useHover(context, {
      enabled: isNested,
      delay: { open: 75 },
      handleClose: safePolygon({ blockPointerEvents: true }),
    });
    const click = useClick(context, {
      event: 'mousedown',
      toggle: !isNested,
      ignoreMouse: isNested,
    });
    const role = useRole(context, { role: 'menu' });
    const dismiss = useDismiss(context, { bubbles: true });
    const listNavigation = useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      nested: isNested,
      onNavigate: setActiveIndex,
    });
    const typeahead = useTypeahead(context, {
      listRef: labelsRef,
      onMatch: isOpen ? setActiveIndex : undefined,
      activeIndex,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      hover,
      click,
      role,
      dismiss,
      listNavigation,
      typeahead,
    ]);

    // Event emitter allows you to communicate across tree components.
    // This effect closes all menus when an item gets clicked anywhere
    // in the tree.
    React.useEffect(() => {
      if (!tree) return;

      function handleTreeClick() {
        setIsOpen(false);
      }

      function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
        if (event.nodeId !== nodeId && event.parentId === parentId) {
          setIsOpen(false);
        }
      }

      tree.events.on('click', handleTreeClick);
      tree.events.on('menuopen', onSubMenuOpen);

      return () => {
        tree.events.off('click', handleTreeClick);
        tree.events.off('menuopen', onSubMenuOpen);
      };
    }, [tree, nodeId, parentId]);

    React.useEffect(() => {
      if (isOpen && tree) {
        tree.events.emit('menuopen', { parentId, nodeId });
      }
    }, [tree, isOpen, nodeId, parentId]);

    return (
      <FloatingNode id={nodeId}>
        {isNested && (
          <button
            ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
            tabIndex={!isNested ? undefined : parent.activeIndex === item.index ? 0 : -1}
            role={isNested ? 'menuitem' : undefined}
            data-open={isOpen ? '' : undefined}
            data-nested={isNested ? '' : undefined}
            data-focus-inside={hasFocusInside ? '' : undefined}
            className={isNested ? 'context-menu-item mri-surface-card' : 'context-menu-list mri-surface'}
            {...getReferenceProps(
              parent.getItemProps({
                ...props,
                onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                  props.onFocus?.(event);
                  setHasFocusInside(false);
                  parent.setHasFocusInside(true);
                },
              })
            )}
          >
            <span className="context-menu-item-label">
              {icon}
              {label}
            </span>
            {isNested && <ChevronRightIcon />}
          </button>
        )}
        <MenuContext.Provider
          value={{
            activeIndex,
            setActiveIndex,
            getItemProps,
            setHasFocusInside,
            isOpen,
          }}
        >
          <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
            {isMounted && (
              <FloatingPortal>
                <FloatingOverlay lockScroll className="context-menu-overlay">
                  <FloatingFocusManager context={context} modal={true} initialFocus={refs.floating}>
                    <div
                      ref={refs.setFloating}
                      className="context-menu-list mri-surface"
                      style={{ ...floatingStyles, ...styles }}
                      {...getFloatingProps()}
                    >
                      {header}
                      {children}
                    </div>
                  </FloatingFocusManager>
                </FloatingOverlay>
              </FloatingPortal>
            )}
          </FloatingList>
        </MenuContext.Provider>
      </FloatingNode>
    );
  }
);

interface MenuItemProps {
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'row' | 'tile';
}

export const MenuItem = React.forwardRef<
  HTMLButtonElement,
  MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ label, disabled, icon, variant = 'row', ...props }, forwardedRef) => {
  const menu = React.useContext(MenuContext);
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();
  const isActive = item.index === menu.activeIndex;

  return (
    <button
      {...props}
      ref={useMergeRefs([item.ref, forwardedRef])}
      type="button"
      role="menuitem"
      className={`context-menu-item mri-surface-card ${variant === 'tile' ? 'context-menu-item--tile' : ''}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      {...menu.getItemProps({
        onClick(event: React.MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit('click');
        },
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          menu.setHasFocusInside(true);
        },
      })}
    >
      <span className="context-menu-item-label">
        {icon}
        {label}
      </span>
    </button>
  );
});

export const Menu = React.forwardRef<HTMLButtonElement, MenuProps & React.HTMLProps<HTMLButtonElement>>(
  (props, ref) => {
    const parentId = useFloatingParentNodeId();

    if (parentId === null) {
      return (
        <FloatingTree>
          <MenuComponent {...props} ref={ref} />
        </FloatingTree>
      );
    }

    return <MenuComponent {...props} ref={ref} />;
  }
);
