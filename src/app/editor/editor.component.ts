import { Component, ViewChild } from '@angular/core';
import { LayerType } from '../map/layer';
import { MapComponent } from '../map/map.component'
import { OptionMap } from '../map/map';
import {
    ToolbarMapComponent
  , DrawTool
  , Command
  , KindTool
} from "./toolbar/toolbar.component";

import { AbaDrawEdit } from './drawEditMap';
import { PrintService } from "../core/print-map.service";
import { ModalMapComponent } from "./modal-maps-list/modal-maps-list.component";
import { ModalSaveMapComponent } from "./modal-save-map/modal-save-map.component";
import {ModalYesNoComponent} from "../shared/modal-yesno/modal-yesno.component";

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
  @ViewChild(ModalYesNoComponent) modalYesNoComponent: ModalYesNoComponent;

  private readonly defaultTitle: string = "AbaPlans";
  private flagSavable: boolean = false;
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

  private onClick(btnInfo: ButtonInfo) {
    this.setActive(btnInfo);
  }

  private updateTool(tool: Command & KindTool) {

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
        if (!this.flagSavable){
          this.modalYesNoComponent.open();
        } else {
          console.log("NOON");
          let title = this.mapComponent.map.title;
          let date = this.mapComponent.map.creationDate;
          let map = this.getMapString();
          this.printService.printMap(map, title, date);
        }
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

  private isActive(btnInfo: ButtonInfo) {
    return btnInfo === this._activeButtonInfo;
  }

  private setActive(btnInfo: ButtonInfo){
    this._activeButtonInfo = btnInfo;
    if (this.mapComponent)
      this.mapComponent.setLayerType(btnInfo);
  }

  private selectTabByLayerType(layerType : LayerType) : void {
    // Find first layer type _btnInfos
    this._btnInfos.forEach( (btnInfo) => {
        if (btnInfo.kind == layerType.kind)
          this.setActive(btnInfo)
      }
    );
  }

  public initMap(optionMap : OptionMap){
    if (optionMap.layerType){
      this.selectTabByLayerType(optionMap.layerType);
    } else {
      this.selectTabByLayerType( {kind: "osm"} );
    }
    this.flagSavable = true;

    this.mapComponent.map.on('mouse-drag-end', () => this.flagSavable = false);

    this.drawEdit = new AbaDrawEdit(this.mapComponent.map);
  }

  // Fire when a user choose a map
  private updateMapId(id: number): void {
    this.mapComponent.selectMapId(id);
  }

  // Fire when a user change the map title
  private updateMapTitle(title: string): void {
    this.title = this.defaultTitle + " - " + title;
  }

  /* Fire when a user create a map */
  private saveMapTitle(title: string): void {
    this.mapComponent.saveMapWithTitle(title);
  }

  private getMapString() {
    // Converts Map to String
    let map = this.mapComponent.map.root;
    let serializer = new XMLSerializer();
    let ser = serializer.serializeToString(map);
    return ser;
  }

  private selectMap(info: [number, string]): void {
    // We send this id upper
    this.updateMapId(info[0]);
    this.updateMapTitle(info[1]);
  }

  private insertMap(info: any): void {
    // We send this title upper
    this.updateMapTitle(info.title);
    this.saveMapTitle(info.title);
    this.flagSavable = true;
  }

  private setMapAsSavable($event): void {
    console.log("Merde");
    this.modalSaveMapComponent.open();
  }

  private printMapWithoutSaving(): void {
    let map = this.getMapString();
    console.log("======");
    this.printService.printMap(map);
  }

  ngOnInit(): void {
    this.mapComponent.getDefaultMap();
  }

  ngAfterViewInit() {
    // Init default btnInfo to first
    this.setActive(this._btnInfos[0]);
  }

}
