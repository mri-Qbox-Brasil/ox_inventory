import { applyUiConfig, setAccentOverride, setBackgroundOverride, type MriUiConfig } from '@mriqbox/ui-kit';

export type SuiteUiConfig = MriUiConfig & {
  theme?: string;
  accentColor?: string;
  backgroundColor?: string;
};

/** Aplica o estilo do painel /uiconfig do ox_lib: tema, fonte, radius, status, accent/fundo override. */
export function applySuiteUiConfig(cfg: SuiteUiConfig | null | undefined) {
  if (!cfg || typeof cfg !== 'object') return;

  applyUiConfig(cfg);
  setAccentOverride(cfg.accentColor);
  setBackgroundOverride(cfg.backgroundColor);
  document.documentElement.setAttribute('data-theme', cfg.theme === 'glass' ? 'glass' : 'dark');
}
