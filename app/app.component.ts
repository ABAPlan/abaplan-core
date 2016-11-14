import { Component, ViewChild } from '@angular/core';
import { LayerType } from './core/layer';
import { CityMapComponent } from './city-map/city-map.component'

@Component({
  selector: 'aba-plan',
  templateUrl: 'app.component.html'
})


export class AppComponent {

  title = "AbaPlan";
  @ViewChild(CityMapComponent) mapComponent:CityMapComponent;

  public tabs: Array<any> = [
    {
      heading: 'Plan OSM',
      kind : 'osm'
    },
    {
      heading: 'Plan de quartier',
      kind : 'square'
    },
    {
      heading: 'Plan de ville',
      kind : 'city'
    }
  ];

  public activeTab: string = this.tabs[0].heading;

  public isActive(tab: any) {
    return tab.heading === this.activeTab;
  }

  public onSelect(tab: any) {
    this.activeTab = tab.heading;
    this.mapComponent.setLayerType(tab);
  }

  ngAfterViewInit() {
    // Init default tab to first
    this.onSelect(this.tabs[0]);
  }

  constructor() {
  }

}
