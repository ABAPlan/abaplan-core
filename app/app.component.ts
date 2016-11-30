import { Component, ViewChild, Input } from '@angular/core';
import { LayerType } from './core/layer';
import { CityMapComponent } from './navigator/navigator.component'
import { OptionMap } from './core/map';
import {ToolbarMapComponent} from "./toolbar/toolbar.component";


interface IButtonInfo { heading: string }
type ButtonInfo = LayerType & IButtonInfo;


@Component({
  selector: 'aba-plan',
  templateUrl: 'app.component.html',
  styles: ['.show-grid { margin-bottom:10px; }']
})
export class AppComponent {

  @ViewChild(CityMapComponent) mapComponent: CityMapComponent;
  @ViewChild(ToolbarMapComponent) toolbarMapComponent: ToolbarMapComponent;

  title = "AbaPlan";

  private _btnInfos: Array<ButtonInfo> = [
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
  private _activeButtonInfo: ButtonInfo = this._btnInfos[0];


  constructor() {}


  public onClick(btnInfo: ButtonInfo) {
    this.setActive(btnInfo);
  }

  public isActive(btnInfo: ButtonInfo) {
    return btnInfo === this._activeButtonInfo;
  }

  public setActive(btnInfo: ButtonInfo){
    this._activeButtonInfo = btnInfo;
    if (this.mapComponent)
      this.mapComponent.setLayerType(btnInfo);
  }

  public selectTabByLayerType(layerType : LayerType) : void{
    // Find first layer type _btnInfos
    this._btnInfos.forEach( (btnInfo) => {
        if (btnInfo.kind == layerType.kind)
          this.setActive(btnInfo)
      }
    );
  }

  public onMapInstancied(optionMap : OptionMap){
    this.selectTabByLayerType(optionMap.layerType);
  }

  ngAfterViewInit() {
    // Init default btnInfo to first
    this.setActive(this._btnInfos[0]);
  }

  public isEditableMode(): boolean {
    if(this.toolbarMapComponent){
      return this.toolbarMapComponent.isEditableMode();
    }
    return false;
  }

  public getGeometryType() : string {
    if(this.toolbarMapComponent){
      return this.toolbarMapComponent.getGeometryType();
    }
    return undefined;
  }

}
