import { Component, ViewChild } from '@angular/core';
import { LayerType } from './core/layer';
import { CityMapComponent } from './city-map/city-map.component'

@Component({
  selector: 'aba-plan',
  templateUrl: 'app.component.html',
  styles: ['.show-grid { margin-bottom:10px; }']
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

  public activeTab: string = this.tabs[0];

  public isActive(tab: any) {
    return tab === this.activeTab;
  }

  public onSelect(tab: any) {
    this.activeTab = tab;
    if(this.mapComponent)
      this.mapComponent.setLayerType(tab);
  }

  public onMapInstancied(event : any){
    this.onSelect(this.activeTab);
  }

  ngAfterViewInit() {
    // Init default tab to first
    this.onSelect(this.activeTab);
  }

  constructor() {
  }

}
