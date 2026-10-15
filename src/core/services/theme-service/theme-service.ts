import { effect, Injectable, signal } from '@angular/core';

export enum ThemeType {
  Dark = 'dark',
  Light = 'light',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {
    const savedTheme = localStorage.getItem('currentTheme');

    if (savedTheme === ThemeType.Dark || savedTheme === ThemeType.Light) {
      this.currentTheme.set(savedTheme);
    }

    effect(() => {
      const theme = this.currentTheme();

      document.body.classList.remove('dark', 'light');
      document.body.classList.add(theme);

      localStorage.setItem('currentTheme', theme);
    });
  }

  currentTheme = signal<ThemeType>(ThemeType.Light);

  onThemeChanged(value: boolean): void {
    this.currentTheme.set(value ? ThemeType.Light : ThemeType.Dark);
  }
}
