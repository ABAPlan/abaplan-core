import { Component, ViewChild, Input } from '@angular/core';
import { LayerType } from './core/layer';
import { MapComponent } from './map/map.component'
import { OptionMap } from './core/map';
import {ToolbarMapComponent,
        Tool,
        DrawTool,
        EditTool,
        ActionTool} from "./toolbar/toolbar.component";

import { AbaDraw } from './editor/drawMap';

interface IButtonInfo { heading: string }
type ButtonInfo = LayerType & IButtonInfo;


@Component({
  selector: 'aba-plan',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {

  @ViewChild(MapComponent) mapComponent: MapComponent;
  @ViewChild(ToolbarMapComponent) toolbarMapComponent: ToolbarMapComponent;

  title = "AbaPlan";

  draw : AbaDraw;

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

  public onUpdateTool(tool : Tool) {;
    switch (tool.kind) {
      case "draw" :
        const drawTool = tool as DrawTool;
        this.draw.enable(drawTool.drawType);
      break;

      case "edit" :
        this.draw.disable();
        console.warn("edit buttons not implemented");
        console.log(tool);
      break;

      case "action" :
        console.warn("action buttons not implemented");
        console.log(tool);
      break

      default :
        console.warn("default not implemented");
        console.log(tool);
      break;
    }
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
    this.draw = new AbaDraw(this.mapComponent.map);
  }

  ngAfterViewInit() {
    // Init default btnInfo to first
    this.setActive(this._btnInfos[0]);
  }
}
