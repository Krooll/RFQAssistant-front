export const ButtonVariants = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  abort: 'abort',
  transparent: 'transparent',
} as const;

export type ButtonVariant = (typeof ButtonVariants)[keyof typeof ButtonVariants];

export const ButtonSizes = {
  large: 'large',
  medium: 'medium',
  small: 'small',
  extraSmall: 'extra-small',
} as const;

export type ButtonSize = (typeof ButtonSizes)[keyof typeof ButtonSizes];

export const ButtonTypes = {
  button: 'button',
  submit: 'submit',
  reset: 'reset',
} as const;

export type ButtonType = (typeof ButtonTypes)[keyof typeof ButtonTypes];

export interface ButtonConfiguration {
  variant?: ButtonVariant;
  size?: ButtonSize;
  padding?: string;
  margin?: string;
}
