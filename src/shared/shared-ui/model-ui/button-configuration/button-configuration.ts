export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'abort' | 'transparent';
export type ButtonSize = 'large' | 'medium' | 'small' | 'extra-small';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonConfiguration {
  variant?: ButtonVariant;
  size?: ButtonSize;
  padding?: string;
  margin?: string;
}
