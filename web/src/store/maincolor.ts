export let maincolor = '#40c05780';

export function setMainColor(color: string) {
  if (color && color !== '') maincolor = color;
}