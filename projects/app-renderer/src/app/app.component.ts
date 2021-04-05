import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomWindow } from 'my-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor() {
    const api = ((window as any) as CustomWindow).api;
    if (api) {
      api.onMainMessage((msg) => console.log('Got message from main:', msg));
      // api.sendToMain('Message from renderer!');
    }
  }
}
