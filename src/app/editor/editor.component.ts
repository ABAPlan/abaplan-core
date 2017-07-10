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
import { ModalMapComponent } from "./modal-maps-list/modal-maps-list.component";
import { ModalSaveMapComponent } from "./modal-save-map/modal-save-map.component";
import {ModalYesNoComponent} from "../shared/modal-yesno/modal-yesno.component";

import {TranslateService} from 'ng2-translate';
import {ScalarObservable} from 'rxjs/observable/ScalarObservable';
import * as br from 'braille';

type ButtonInfo = LayerType ;

@Component({
  selector: 'aba-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css']
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
      kind : 'osm'
    },
    {
      kind : 'square'
    },
    {
      kind : 'city'
    }
  ];
  private _activeButtonInfo: ButtonInfo = this._btnInfos[0];

  constructor(private translateService: TranslateService) {

  }

  private onClick(btnInfo: ButtonInfo) {
    this.setActive(btnInfo);
    this.mapComponent.mapZoom = (this.translateService.get("mapZoom")as ScalarObservable<string>).value;
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

      case "fill":
        this.drawEdit.changeTexture(
          this.toolbarMapComponent.changeFillTool());
        break;

      case "print":
        if (!this.flagSavable)
          this.modalYesNoComponent.open();
        else 
          window.print();
            
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
    //Not Savable when the map load isn't save
    if(optionMap.title)
      this.flagSavable = true;

    this.mapComponent.map.on('mouse-drag-end', () => {
      this.flagSavable = false;
      this.title = this.defaultTitle;
      this.mapComponent.resetInfos();
    });

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
    window.print();
  }

  private getBrailleTitle () : string{
    if(this.mapComponent.map.title)
      return br.toBraille(this.mapComponent.map.title);
    else
      return "";
  }

  private getBrailleId () : string{
    if(this.mapComponent.map.uid)
      return br.toBraille(String(this.mapComponent.map.uid));
    else
      return "";
  }

  ngOnInit(): void {
    this.mapComponent.getDefaultMap();
  }

  ngAfterViewInit() {
    // Init default btnInfo to first
    this.setActive(this._btnInfos[0]);
  }

}
