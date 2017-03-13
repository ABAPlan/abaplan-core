import { Component, ViewChild, Input } from '@angular/core';
import { LayerType } from '../core/layer';
import { MapComponent } from '../map/map.component'
import { OptionMap } from '../core/map';
import {ToolbarMapComponent,
        Tool,
        DrawTool,
        EditTool,
        ActionTool} from "../toolbar/toolbar.component";

import { AbaDrawEdit } from './drawEditMap';
import { PrintService } from "../printable-map/print-map.service";

interface IButtonInfo { heading: string }
type ButtonInfo = LayerType & IButtonInfo;


@Component({
  selector: 'aba-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css'],
  providers: [PrintService]
})
export class EditorComponent {

  @ViewChild(MapComponent) mapComponent: MapComponent;
  @ViewChild(ToolbarMapComponent) toolbarMapComponent: ToolbarMapComponent;

  private readonly defaultTitle: string = "AbaPlan";
  title = this.defaultTitle;

  drawEdit : AbaDrawEdit;

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

  constructor(private printService: PrintService) {}

  ngOnInit(): void {
    this.mapComponent.getDefaultMap();
  }

  public onClick(btnInfo: ButtonInfo) {
    this.setActive(btnInfo);
  }

  public onUpdateTool(tool : Tool) {
    switch (tool.kind) {
      case "draw" :
        this.mapComponent.map.disableMapNavigation();
        const drawTool = tool as DrawTool;

        this.drawEdit.enableDraw(true, drawTool.drawType);
        this.drawEdit.enableDelete(false);
        this.drawEdit.enableEdit(false);
      break;

      case "edit" :
        this.drawEdit.enableDraw(false);
        this.drawEdit.enableDelete(tool.heading == "Supprimer");
        this.drawEdit.enableEdit(tool.heading == "Sélectionner");
        if(tool.heading == "Déplacer")
          this.mapComponent.map.enableMapNavigation();
        else
          this.mapComponent.map.disableMapNavigation();

        console.warn("edit buttons not implemented");
        console.log(tool);
      break;

      case "action" :

        if(tool.heading == "Imprimer"){
          console.log("Action Print");

          let title = this.mapComponent.map.title;
          let date = this.mapComponent.map.creationDate;
          let map = this.getMapString();

          this.printService.printMap(title,date,map);
        }
        else{
          console.warn("action buttons not implemented");
        }

        console.log(tool);

        this.drawEdit.enableDraw(false);
        this.drawEdit.enableDelete(false);
        this.drawEdit.enableEdit(false);
      break;

      default :
        console.warn("default not implemented");
        console.log(tool);

        this.drawEdit.enableDraw(false);
        this.drawEdit.enableDelete(false);
        this.drawEdit.enableEdit(false);
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
    this.drawEdit = new AbaDrawEdit(this.mapComponent.map);
  }

  /* Fire when a user choose a map */
  private updateMapId(id: number): void {
    this.mapComponent.selectMapId(id);
  }

  /* Fire when a user create a map */
  private updateMapTitle(title: string): void {
    this.title = this.defaultTitle + " - " + title;
    this.mapComponent.saveMapWithTitle(title);
  }

  private getMapString(){
    // Converts Map to String
    let map = this.mapComponent.map.root;
    let serializer = new XMLSerializer();
    let ser = serializer.serializeToString(map);
    return ser;
  }

  ngAfterViewInit() {
    // Init default btnInfo to first
    this.setActive(this._btnInfos[0]);
  }
}
