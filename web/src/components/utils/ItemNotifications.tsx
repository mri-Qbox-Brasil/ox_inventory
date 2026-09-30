import React from 'react';
import { createPortal } from 'react-dom';
import useNuiEvent from '../../hooks/useNuiEvent';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { Items } from '../../store/items';
import { isInventoryOpen, playSfx } from '../../lib/sfx';

interface ItemNotificationProps {
  item: SlotWithItem;
  text: string;
  count?: number;
}

type Tone = 'gain' | 'loss' | 'equip' | 'holster';

interface Notification {
  id: number;
  key: string;
  item: SlotWithItem;
  text: string;
  count: number;
  tone: Tone;
  bump: number;
  leaving: boolean;
}

/** Tempo que cada aviso fica na tela, reiniciado quando o mesmo item chega de novo. */
export const NOTIFY_DURATION = 3200;

/** Duração da animação de saída antes de tirar o aviso da lista. */
export const NOTIFY_EXIT = 360;

/** Máximo de avisos empilhados ao mesmo tempo. */
export const NOTIFY_MAX = 5;

const toneOf = (text: string): Tone => {
  if (text === 'ui_removed') return 'loss';
  if (text === 'ui_equipped') return 'equip';
  if (text === 'ui_holstered') return 'holster';

  return 'gain';
};

export const ItemNotificationsContext = React.createContext<{
  add: (item: ItemNotificationProps) => void;
} | null>(null);

export const useItemNotifications = () => {
  const itemNotificationsContext = React.useContext(ItemNotificationsContext);
  if (!itemNotificationsContext) throw new Error(`ItemNotificationsContext undefined`);
  return itemNotificationsContext;
};

const ItemNotification = ({ notification }: { notification: Notification }) => {
  const { item, text, count, tone, bump, leaving } = notification;
  const [imageFailed, setImageFailed] = React.useState(false);
  const image = getItemUrl(item);
  const label = item.metadata?.label || Items[item.name]?.label || item.name;
  const showCount = (tone === 'gain' || tone === 'loss') && count > 0;

  return (
    <div className={`item-notify item-notify--${tone}${leaving ? ' item-notify--leaving' : ''}`}>
      <div className={`item-notify-inner${showCount ? '' : ' item-notify-inner--plain'}`}>
        <div className="item-notify-panel">
          <span className="item-notify-stripe" />
        </div>
        {image && !imageFailed ? (
          <img className="item-notify-image" src={image} alt="" onError={() => setImageFailed(true)} />
        ) : (
          <span className="item-notify-fallback">{label.charAt(0)}</span>
        )}
        <div className="item-notify-body">
          <p className="item-notify-label">{label}</p>
          <p className="item-notify-action">{Locale[text] || text}</p>
        </div>
        {showCount && (
          <span key={bump} className={`item-notify-count${bump ? ' item-notify-count--bump' : ''}`}>
            {tone === 'loss' ? '−' : '+'}
            {count}
          </span>
        )}
      </div>
    </div>
  );
};

export const ItemNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const timers = React.useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const nextId = React.useRef(0);
  const listRef = React.useRef(notifications);

  const commit = React.useCallback((update: (list: Notification[]) => Notification[]) => {
    listRef.current = update(listRef.current);
    setNotifications(listRef.current);
  }, []);

  const dismiss = React.useCallback(
    (id: number) => {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);

      commit((list) => list.map((entry) => (entry.id === id ? { ...entry, leaving: true } : entry)));
      setTimeout(() => commit((list) => list.filter((entry) => entry.id !== id)), NOTIFY_EXIT);
    },
    [commit]
  );

  const schedule = React.useCallback(
    (id: number) => {
      clearTimeout(timers.current.get(id));
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), NOTIFY_DURATION)
      );
    },
    [dismiss]
  );

  const add = React.useCallback(
    ({ item, text, count = 0 }: ItemNotificationProps) => {
      const key = `${item.name}|${text}|${item.metadata?.label ?? ''}`;

      if (toneOf(text) === 'gain' && !isInventoryOpen()) playSfx('collect');

      const existing = listRef.current.find((entry) => entry.key === key && !entry.leaving);

      if (existing) {
        schedule(existing.id);
        commit((list) =>
          list.map((entry) =>
            entry.id === existing.id ? { ...entry, item, count: entry.count + count, bump: entry.bump + 1 } : entry
          )
        );
        return;
      }

      const id = ++nextId.current;
      const active = listRef.current.filter((entry) => !entry.leaving);

      if (active.length >= NOTIFY_MAX) dismiss(active[0].id);

      schedule(id);
      commit((list) => [...list, { id, key, item, text, count, tone: toneOf(text), bump: 0, leaving: false }]);
    },
    [commit, schedule, dismiss]
  );

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useNuiEvent<[item: SlotWithItem, text: string, count?: number]>('itemNotify', ([item, text, count]) => {
    add({ item, text, count });
  });

  return (
    <ItemNotificationsContext.Provider value={{ add }}>
      {children}
      {createPortal(
        <div className="item-notify-stack">
          {notifications.map((notification) => (
            <ItemNotification key={notification.id} notification={notification} />
          ))}
        </div>,
        document.body
      )}
    </ItemNotificationsContext.Provider>
  );
};
