import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  ButtonConfiguration,
  ButtonType,
} from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button<T> {
  emitButtonClick = output<T>();

  dataToEmit = input<T>();
  buttonType = input<ButtonType>();
  buttonConfiguration = input<ButtonConfiguration>({});
  buttonDisabled = input<boolean>();

  defaultButtonConfig: ButtonConfiguration = {
    variant: 'primary',
    size: 'medium',
    margin: '',
    padding: '',
  };

  protected currentButtonClasses = computed(() => {
    const config = { ...this.defaultButtonConfig, ...this.buttonConfiguration() };
    return [config.variant, config.size, config.margin, config.padding].filter(Boolean);
  });

  onButtonClick(): void {
    if (this.dataToEmit() !== undefined || null) {
      const value = this.dataToEmit();

      if (value !== undefined && value !== null) {
        this.emitButtonClick.emit(value);
      }
    }
  }
}
