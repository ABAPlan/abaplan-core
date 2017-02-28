import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { OptionMap, AbaMap } from '../core/map';
import { LayerType } from '../core/layer';
import { MapService } from '../core/map.service';
import ArcgisSearch = require('esri/dijit/Search');
const img_loading = require("file?name=./assets/[name].[ext]!./img/spin.gif");

import 'rxjs/add/operator/toPromise';
import { DrawType } from '../editor/drawEditMap';
import Extent = require("esri/geometry/Extent");
import Graphic = require("esri/graphic");

@Component({
  selector: 'aba-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  optionMaps: OptionMap[];
  map : AbaMap;
  search: ArcgisSearch;

  mapLoading : boolean = false;
  imgLoading : string = img_loading;

  needZoom : boolean = false;

  @Output() mapInstancied = new EventEmitter();
  @Input() drawType : string;
  @Input() searchable: boolean = true;

  readonly ZOOM_LEVEL_MINIMUM : number = 16;

  constructor(private mapService: MapService) {
  }

  getDefaultMap(): void {
    this.mapService
        .map(160)
        .subscribe(
          optionMap => {
            //this.optionMaps = optionMaps;
            this.initMap(optionMap);
          }
        );
  }

  ngOnInit(): void {

  }

  setLayerType(layerType : LayerType): boolean {
    if (this.map){
      this.map.setLayerVisible(layerType);
      return true;
    }
    return false;
  }


  initMap(optionMap: OptionMap, layerType? : LayerType): void {

    this.map = AbaMap.fromOptionMap("esri-map", optionMap, layerType);

    this.applyDefaultCallbackToTheMap();

    this.search = new ArcgisSearch(
      {
        map: this.map,
        /* useMapExtent:false, */
        enableHighlight: false
      }, "search"
    );

    this.mapInstancied.emit(optionMap);
  }

  private applyDefaultCallbackToTheMap(): void {

    this.map.on("update-start", () => this.mapLoading = true);
    this.map.on("update-end", () => this.mapLoading = false);

    // Zoom restriction
    this.map.on("zoom-end", (event: { level : number}) => {
        if(event.level){
          // Show or hide 'need zoom' message
          this.needZoom = (event.level < this.ZOOM_LEVEL_MINIMUM);

          // If yes, stop loading
          if(this.needZoom)
            this.mapLoading = false;
        }
      }
    );
  }

  public selectMapId(id: number): void {
    this.mapService.map(id).subscribe(
      optionMap => {

        // Fixed: Must destroy before attributing a new instance
        this.map.destroy();
        this.map = AbaMap.fromOptionMap("esri-map", optionMap);

        // Call mapInstancied event to prevent others components of new map
        this.mapInstancied.emit(optionMap);

        this.applyDefaultCallbackToTheMap();

        this.setLayerType(optionMap.layerType);

      }
    );
  }
  public saveMapWithTitle(title: string): void {
    this.map.title = title;
    this.mapService.add(this.map.toOptionMap()).subscribe( i => this.map.uid = i );
  }
}
