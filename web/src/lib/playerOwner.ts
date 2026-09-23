// Owner (citizenid) do inventario do proprio player, exibido no cabecalho antes
// do nome. Vem do mri/client.lua (evento `mriSetOwner`), fora do payload do
// ox_inventory, pra nao mexer no server.lua do upstream.
import { useSyncExternalStore } from 'react';

let owner: string | undefined;
const listeners = new Set<() => void>();

export const setPlayerOwner = (value?: string) => {
  owner = value || undefined;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const usePlayerOwner = () => useSyncExternalStore(subscribe, () => owner);
