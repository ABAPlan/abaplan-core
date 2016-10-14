import { Component } from '@angular/core';
@Component({
  selector: 'aba-plan',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a>Plan de ville</a>
      <a>Plan de quartier</a>
    </nav>
  `
})
export class AppComponent {
  title = "AbaPlan"
}
