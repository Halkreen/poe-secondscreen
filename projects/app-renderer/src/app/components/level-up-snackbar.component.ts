import { Component } from '@angular/core';

@Component({
  selector: 'app-level-up',
  template: `<span class="example-pizza-party">
    <p style="text-align: center">Level Up 👍</p>
  </span>`,
  styles: [
    `
      .example-pizza-party {
        font-family: 'Nunito Sans', sans-serif;
        font-size: 26px;
        font-weight: 600;
      }
    `,
  ],
})
export class PizzaPartyComponent {}
