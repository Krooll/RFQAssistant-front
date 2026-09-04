import { Component, contentChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-form-field',
  imports: [TranslateFallbackPipe],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  private ngControl = contentChild(NgControl);

  get control() {
    return this.ngControl()?.control;
  }

  get showError(): boolean {
    return !!(this.control && this.control?.invalid && this.control?.touched);
  }

  get errorMessage(): string {
    const errors = this.control?.errors;
    if (!errors) return '';

    const firstErrorKey = Object.keys(errors)[0];

    switch (firstErrorKey) {
      case 'required':
        return 'FORM_VALIDATION_TEXTS.required';
      case 'email':
        return 'FORM_VALIDATION_TEXTS.email';
      case 'minlength':
        return 'FORM_VALIDATION_TEXTS.minlength';
      case 'maxlength':
        return 'FORM_VALIDATION_TEXTS.maxlength';
      case 'pattern':
        return 'FORM_VALIDATION_TEXTS.pattern';
      default:
        return 'FORM_VALIDATION_TEXTS.default';
    }
  }
}
