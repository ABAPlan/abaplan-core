import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as loadingSpinnerUrl from "Assets/img/spin.gif";
import * as br from "braille";
import "rxjs/add/operator/toPromise";
import { LayerType } from "./layer";
import { AbaMap, OptionMap } from "./map";
import { MapService } from "./map.service";

import ArcgisSearch = require("esri/dijit/Search");
import Extent = require("esri/geometry/Extent");
import Point = require("esri/geometry/Point");
import Graphic = require("esri/graphic");
import Layer = require("esri/layers/layer");

@Component({
  selector: "aba-map",
  styleUrls: ["map.component.css"],
  templateUrl: "map.component.html",
})
export class MapComponent {
  public get loadingSpinnerURL(): string { return String(loadingSpinnerUrl); }
  public map: AbaMap;
  public mapLoading: boolean = false;
  public mapZoom = "";

  @Output()
  public onMapInstancied: EventEmitter<OptionMap> = new EventEmitter();
  @Input()
  public searchable: boolean = true;

  private needZoom: boolean = false;
  private search: ArcgisSearch;
  private readonly ZOOM_LEVEL_MINIMUM: number = 16;

  constructor(private mapService: MapService) {}

  public getDefaultMap(): void {
    this.mapService.defaultMap().subscribe((optionMap) => {
      this.initMap(optionMap);
    });
  }

  public setLayerType(layerType: LayerType): boolean {
    if (this.map) {
      this.map.setLayerVisible(layerType);
      return true;
    }
    return false;
  }

  public setZoom(zoom: number): void {
    this.map.setZoom(zoom);
  }

  public isInMap(point: Point): boolean {
    return this.map.extent.contains(point);
  }

  public centerMap(point: Point): void {
    this.map.centerAt(point);
  }

  public resetInfos(): void {
    this.map.uid = undefined;
    this.map.title = undefined;
    this.map.owner = undefined;
    this.map.hash = undefined;
    this.map.creationDate = undefined;
  }

  public initMap(optionMap: OptionMap, layerType?: LayerType): void {
    this.map = AbaMap.fromOptionMap("esri-map", optionMap, layerType);
    this.applyDefaultCallbackToTheMap();

    if (this.searchable) {
      this.search = new ArcgisSearch(
        {
          enableHighlight: false,
          map: this.map,
          /* useMapExtent:false, */
        },
        "search",
      );

      /* hack for fix placeholder
       * get the object and replace with emtpy string
       *  (pj) Issue #90
       */
      const s = this.search.sources;
      s[0].placeholder = "";
      this.search.set("sources", s);
    }

    this.checkNeedZoom();
    this.onMapInstancied.emit(optionMap);
  }

  // Show or hide 'need zoom' message
  public checkNeedZoom(): boolean {
    this.needZoom = this.map.getLevel() < this.ZOOM_LEVEL_MINIMUM;
    if (this.mapLoading) {
      this.mapLoading = false;
    }
    return this.needZoom;
  }

  public selectMapId(id: number): void {
    this.mapService.map(id).subscribe((optionMap) => {
      // Fixed: Must destroy before attributing a new instance
      this.map.destroy();
      this.map = AbaMap.fromOptionMap("esri-map", optionMap);
      this.checkNeedZoom();

      // Call onMapInstancied event to prevent others components of new map
      this.onMapInstancied.emit(optionMap);

      this.applyDefaultCallbackToTheMap();

      if (optionMap.layerType) {
        this.setLayerType(optionMap.layerType);
      } else {
        this.setLayerType({ kind: "osm" });
      }
    });
  }

  public saveMapWithTitle(title: string): void {
    this.map.title = title;
    this.mapService
      .add(this.map.toOptionMap())
      .subscribe((i) => (this.map.uid = i));
  }

  private getBrailleTitle(): string {
    return (this.map && this.map.title) ? br.toBraille(this.map.title) : "";
  }

  private getBrailleId(): string {
    return (this.map && this.map.uid) ? br.toBraille(String(this.map.uid)) : "";
  }

  private getTitle(): string {
    return (this.map && this.map.title) ? String(this.map.title) : "";
  }

  private getId(): string {
    return (this.map && this.map.uid) ? String(this.map.uid) : "";
  }

  private applyDefaultCallbackToTheMap(): void {
    this.map.onUpdateStart = () => (this.mapLoading = true);
    this.map.onUpdateEnd = () => (this.mapLoading = false);

    // Zoom restriction
    this.map.on("zoom-end", () => this.checkNeedZoom());
  }
}
