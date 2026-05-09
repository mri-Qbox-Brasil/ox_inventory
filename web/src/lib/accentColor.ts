// Aplica `accentColor` (hex #RRGGBB) na CSS var --primaryColor que alimenta
// `rgba(var(--primaryColor), N)` espalhado pelo SCSS desse script.
//
// Diferente do resto da suite MRI (mri_Qmultichar / mri_Qspawn / mri_Qadmin /
// mri_Qchat / ox_lib) que padroniza shadcn HSL, o ox_inventory ja existia em
// formato RGB triplet (R, G, B). Mantemos o formato pra evitar reescrever
// todos os usos — convar `mri:color` continua sendo a fonte da verdade.
export function applyAccentColor(hex: string) {
  if (!isValidHex(hex)) return;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  document.documentElement.style.setProperty('--primaryColor', `${r}, ${g}, ${b}`);
}

export function isValidHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}
