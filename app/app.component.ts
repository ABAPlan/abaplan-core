import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'aba-plan',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  title = "AbaPlan";

  constructor() {}

  public tabs: Array<any> = [
    {
      heading: 'Plan de quartier',
    },
    {
      heading: 'Plan de ville',
    }
  ];

}
