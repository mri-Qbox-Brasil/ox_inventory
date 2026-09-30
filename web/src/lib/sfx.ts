import { fetchNui } from '../utils/fetchNui';

/** Sons nativos do GTA (PlaySoundFrontend) disparados pela NUI: [som, soundset, throttle ms]. */
export const SOUNDS = {
  open: ['Clothes_On', 'GTAO_Hot_Tub_Sounds'],
  close: ['Clothes_Off', 'GTAO_Hot_Tub_Sounds'],
  move: ['Grab_Parachute', 'BASEJUMPS_SOUNDS'],
  collect: ['sports_bag', 'dlc_xm_pickup_sweetener_sounds', 120],
} satisfies Record<string, [string, string] | [string, string, number]>;

export type Sfx = keyof typeof SOUNDS;

let inventoryOpen = false;
const lastPlayed = new Map<Sfx, number>();

export const setInventoryOpen = (value: boolean) => {
  inventoryOpen = value;
};

export const isInventoryOpen = () => inventoryOpen;

export const playSfx = (name: Sfx) => {
  const [sound, set, throttle = 40]: [string, string, number?] = SOUNDS[name];
  const now = performance.now();

  if (now - (lastPlayed.get(name) ?? 0) < throttle) return;

  lastPlayed.set(name, now);
  fetchNui('mriPlaySound', { name: sound, set }).catch(() => {});
};
