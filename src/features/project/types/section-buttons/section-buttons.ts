export const SectionButtonsTypes = {
  general: 'general',
  component: 'component',
} as const;

export type SectionButtonsType = (typeof SectionButtonsTypes)[keyof typeof SectionButtonsTypes];

export interface SectionButtons {
  type: SectionButtonsType;
  label: string;
  labelTranslateFallback: string;
}
