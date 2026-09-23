import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonType,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button<T> {
  emitButtonClick = output<T | void>();

  public dataToEmit = input<T>();
  public buttonType = input<ButtonType>();
  public buttonConfiguration = input<ButtonConfiguration>({});
  public buttonDisabled = input<boolean>();

  protected defaultButtonConfig: ButtonConfiguration = {
    variant: ButtonVariants.primary,
    size: ButtonSizes.medium,
    margin: '',
    padding: '',
  };

  protected currentButtonClasses = computed(() => {
    const config = { ...this.defaultButtonConfig, ...this.buttonConfiguration() };
    return [config.variant, config.size, config.margin, config.padding].filter(Boolean);
  });

  protected onButtonClick(): void {
    if (this.dataToEmit() !== undefined || null) {
      const value = this.dataToEmit();

      if (value !== undefined && value !== null) {
        this.emitButtonClick.emit(value);
      }
    } else {
      this.emitButtonClick.emit();
    }
  }
}
