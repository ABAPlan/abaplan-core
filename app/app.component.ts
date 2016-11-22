import { Component, ViewChild } from '@angular/core';
import { LayerType } from './core/layer';
import { CityMapComponent } from './navigator/navigator.component'
import { OptionMap } from './core/map';

@Component({
selector: 'aba-plan',
templateUrl: 'app.component.html',
styles: ['.show-grid { margin-bottom:10px; }']
})


export class AppComponent {

  title = "AbaPlan";

  @ViewChild(CityMapComponent) mapComponent:CityMapComponent;

  private tabs: Array<any> = [
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
  private activeTab = this.tabs[0];



  public isActive(tab: any) {
    return tab === this.activeTab;
  }

  public onSelectTab(tab: any) {
    this.setActiveTab(tab);
  }

  public setActiveTab(tab: any){
    this.activeTab = tab;
    if(this.mapComponent)
      this.mapComponent.setLayerType(tab);
  }

  public selectTabByLayerType(layerType : LayerType) : void{
    // Find first layer type tabs
    this.tabs.forEach( (tab) => {
        if(tab.kind == layerType.kind)
          this.setActiveTab(tab)
      }
    );
  }

  public onMapInstancied(optionMap : OptionMap){
    this.selectTabByLayerType(optionMap.layerType);
  }

  ngAfterViewInit() {
    // Init default tab to first
    this.setActiveTab(this.tabs[0]);
  }


  constructor() {
  }

}
