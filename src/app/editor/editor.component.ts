import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "ng2-translate";
import { ScalarObservable } from "rxjs/observable/ScalarObservable";
import { LayerType } from "../map/layer";
import { OptionMap } from "../map/map";
import { MapComponent } from "../map/map.component";
import { ModalYesNoComponent } from "../shared/modal-yesno/modal-yesno.component";
import { AbaDrawEdit } from "./drawEditMap";
import { ModalMapComponent } from "./modal-maps-list/modal-maps-list.component";
import { ModalSaveMapComponent } from "./modal-save-map/modal-save-map.component";
import { ToolbarMapComponent } from "./toolbar/toolbar.component";

type ButtonInfo = LayerType;

@Component({
  selector: "aba-editor",
  styleUrls: ["editor.component.css"],
  templateUrl: "editor.component.html",
})
export class EditorComponent {
  @ViewChild(MapComponent) public mapComponent: MapComponent;
  @ViewChild(ToolbarMapComponent) public toolbarMapComponent: ToolbarMapComponent;

  @ViewChild(ModalMapComponent) public modalMapComponent: ModalMapComponent;
  @ViewChild(ModalSaveMapComponent) public modalSaveMapComponent: ModalSaveMapComponent;
  @ViewChild(ModalYesNoComponent) public modalYesNoComponent: ModalYesNoComponent;

  public readonly defaultTitle: string = "AbaPlans";
  public flagSavable: boolean = false;
  public title = this.defaultTitle;

  public drawEdit: AbaDrawEdit;

  private _btnInfos: ButtonInfo[] = [
    {
      kind: "osm",
    },
    {
      kind: "square",
    },
    {
      kind: "city",
    },
  ];
  private _activeButtonInfo: ButtonInfo = this._btnInfos[0];

  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.mapComponent.getDefaultMap();
  }

  public ngAfterViewInit() {
    // Init default btnInfo to first
    this.setActive(this._btnInfos[0]);
  }

  public initMap(optionMap: OptionMap) {
    if (optionMap.layerType) {
      this.selectTabByLayerType(optionMap.layerType);
    } else {
      this.selectTabByLayerType({ kind: "osm" });
    }
    // Not Savable when the map load isn't save
    if (optionMap.title) {
      this.flagSavable = true;
    }

    this.mapComponent.map.on("mouse-drag-end", () => {
      this.flagSavable = false;
      this.title = this.defaultTitle;
      this.mapComponent.resetInfos();
    });

    this.drawEdit = new AbaDrawEdit(this.mapComponent.map);
  }

  private onClick(btnInfo: ButtonInfo) {
    this.setActive(btnInfo);
    this.mapComponent.mapZoom = (this.translateService.get(
      "mapZoom",
    ) as ScalarObservable<string>).value;
  }

  private updateTool(toolId: string) {
    switch (toolId) {
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

      // Should be a draw shape
      default:
        this.mapComponent.map.disableMapNavigation();
        this.drawEdit.enableDraw(true, toolId);
        this.drawEdit.enableDelete(false);
        this.drawEdit.enableEdit(false);
        break;
    }
  }

  private operation(operationId: string) {
    switch (operationId) {
      case "print":
        if (!this.flagSavable) {
          this.modalYesNoComponent.open();
        } else {
          (window as any).print();
        }
        break;

      case "open":
        this.modalMapComponent.open();
        break;

      case "save":
        this.modalSaveMapComponent.open();
        break;

      default:
        if (process.env.NODE_ENV !== "production") {
          // tslint:disable-next-line no-console
          console.warn("operation not implemented");
        }
        break;
    }

    this.drawEdit.enableDraw(false);
    this.drawEdit.enableDelete(false);
    this.drawEdit.enableEdit(false);
  }

  private isActive(btnInfo: ButtonInfo) {
    return btnInfo === this._activeButtonInfo;
  }

  private setActive(btnInfo: ButtonInfo) {
    this._activeButtonInfo = btnInfo;
    if (this.mapComponent) {
      this.mapComponent.setLayerType(btnInfo);
    }
  }

  private selectTabByLayerType(layerType: LayerType): void {
    // Find first layer type _btnInfos
    this._btnInfos.forEach((btnInfo) => {
      if (btnInfo.kind === layerType.kind) {
        this.setActive(btnInfo);
      }
    });
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
    if (process.env.NODE_ENV !== "production") {
      // tslint:disable-next-line no-console
      console.log("Merde");
    }
    this.modalSaveMapComponent.open();
  }

  private printMapWithoutSaving(): void {
    (window as any).print();
  }
}
