export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ThemeState = {
  mode: ThemeMode
}

export const defaultThemeState: ThemeState = {
  mode: ThemeMode.DARK,
}
