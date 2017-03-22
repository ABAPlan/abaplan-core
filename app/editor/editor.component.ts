import { Component, ViewChild, Input } from '@angular/core';
import { LayerType } from '../core/layer';
import { MapComponent } from '../map/map.component'
import { OptionMap } from '../core/map';
import {
  ToolbarMapComponent,
  Tool,
  DrawTool,
  EditTool,
  ActionTool, Command, Move, KindTool
} from "../toolbar/toolbar.component";

import { AbaDrawEdit } from './drawEditMap';
import { PrintService } from "../printable-map/print-map.service";
import {ModalMapComponent} from "../modal-maps-list/modal-maps-list.component";
import {ModalSaveMapComponent} from "../modal-save-map/modal-save-map.component";

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

  @ViewChild(ModalMapComponent) modalMapComponent: ModalMapComponent;
  @ViewChild(ModalSaveMapComponent) modalSaveMapComponent: ModalSaveMapComponent;

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

  //public onUpdateTool(tool : Tool) {
  public onUpdateTool(tool: Command & KindTool) {

    // Personalized operation on command
    switch (tool.command) {

      case "move":
        this.drawEdit.enableDraw(false);
        this.mapComponent.map.enableMapNavigation();
        break;

      case "select":
        this.drawEdit.enableDraw(false);
        this.drawEdit.enableEdit(true);
        this.mapComponent.map.disableMapNavigation();
        break;

      case "delete":
        this.drawEdit.enableDraw(false);
        this.drawEdit.enableDelete(true);
        this.mapComponent.map.disableMapNavigation();
        break;

      case "print":
        let title = this.mapComponent.map.title;
        let date = this.mapComponent.map.creationDate;
        let map = this.getMapString();
        this.printService.printMap(title,date,map);
        break;

      case "open":
        this.modalMapComponent.open();
        break;
      case "save":
        this.modalSaveMapComponent.open();
        break;
      default:
        console.warn("action buttons not implemented");

    }

    // Global operation on kind
    switch (tool.kind) {
      case "draw" :
        this.mapComponent.map.disableMapNavigation();
        const drawTool = tool as DrawTool;
        this.drawEdit.enableDraw(true, drawTool.drawType);
        this.drawEdit.enableDelete(false);
        this.drawEdit.enableEdit(false);
      break;

      case "action" :
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

  /* Fire when a user change the map title  */
  private updateMapTitle(title: string): void {
    this.title = this.defaultTitle + " - " + title;
  }

  /* Fire when a user create a map */
  private saveMapTitle(title: string): void {
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

  /* Fires when a user select a map in the modal view */
  public mapSelected(info: [number, string]): void {
    console.log("ALOOOOOOOOOOOOORS");
    console.log(info);
    // We send this id upper
    this.updateMapId(info[0]);
    this.updateMapTitle(info[1]);
  }

  /* Fires when a user insert a map in the modal view */
  public mapInsert(info: any): void {
    console.log(info);
    // We send this title upper
    this.updateMapTitle(info.title);
    this.saveMapTitle(info.title);
  }
}
