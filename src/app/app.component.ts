import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateFallbackPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
