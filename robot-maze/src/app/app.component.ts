import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-maze height="3" width="4"></app-maze>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'robot-maze';
}
