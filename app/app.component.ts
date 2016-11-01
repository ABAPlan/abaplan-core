import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'aba-plan',
  templateUrl: 'app.component.html'
})


export class AppComponent {

  title = "AbaPlan";

  public tabs: Array<any> = [
    {
      heading: 'Plan OSM',
    },
    {
      heading: 'Plan de quartier',
    },
    {
      heading: 'Plan de ville',
    }
  ];

  public activeTab: string = this.tabs[0].heading;

  public isActive(tab: any) {
    return tab.heading === this.activeTab;
  }

  public onSelect(tab: any) {
    this.activeTab = tab.heading;
  }

  constructor() {}

}

