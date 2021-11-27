// Use matchMedia to check the user preference
// https://ionicframework.com/docs/theming/dark-mode
export const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
).matches;
