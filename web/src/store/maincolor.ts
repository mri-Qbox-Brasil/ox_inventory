export let maincolor = '#40c057';

export function setMainColor(color: string) {
  if (color && color !== '') maincolor = color;
}