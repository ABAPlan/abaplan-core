import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { OptionMap, AbaMap } from '../core/map';
import { LayerType } from '../core/layer';
import { MapService } from '../core/map.service';
import ArcgisSearch = require('esri/dijit/Search');
const img_loading = require("file?name=./img/[name].[ext]!./img/spin.gif");

import 'rxjs/add/operator/toPromise';
import Extent = require("esri/geometry/Extent");
import Graphic = require("esri/graphic");
import Layer = require("esri/layers/layer");

@Component({
  selector: 'aba-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  //optionMaps: OptionMap[];
  map : AbaMap;
  search: ArcgisSearch;

  mapLoading : boolean = false;
  imgLoading : string = img_loading;

  needZoom : boolean = false;

  @Output() mapInstancied = new EventEmitter();
  @Input() searchable: boolean = true;

  readonly ZOOM_LEVEL_MINIMUM : number = 16;

  constructor(private mapService: MapService) {
  }

  getDefaultMap(): void {
    this.mapService
      .defaultMap()
      .subscribe(
        optionMap => {
          console.log(optionMap);
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

    if (this.searchable){
      this.search = new ArcgisSearch(
        {
          map: this.map,
          /* useMapExtent:false, */
          enableHighlight: false
        }, "search"
      );
    }

    this.checkNeedZoom();
    this.mapInstancied.emit(optionMap);
  }

  private applyDefaultCallbackToTheMap(): void {
    this.map.on("layer-add", (evt : {layer:Layer})=> {
      console.log("layer-add", evt.layer);
      evt.layer.on("update-start", (evt2:{layer2:Layer; }) => {
        if(evt.layer.visible)
          this.mapLoading = true;      
        console.log("startlayer", evt2);
      });
      evt.layer.on("update-end", (evt2:{layer2:Layer; }) => {
        if(evt.layer.visible)
          this.mapLoading = false;
        console.log("endlayer", evt2);
      });
      evt.layer.on("suspend", (evt2:{layer2:Layer; }) => {
        this.mapLoading = false;
        console.log("suspend", evt2);
      });
    });

    // Zoom restriction
    this.map.on("zoom-end", () => this.checkNeedZoom());
  }

  // Show or hide 'need zoom' message
  public checkNeedZoom(): boolean{
    this.needZoom = (this.map.getLevel() < this.ZOOM_LEVEL_MINIMUM);
    if(this.mapLoading)
      this.mapLoading = false;
    return this.needZoom;
  }

  public selectMapId(id: number): void {
    this.mapService.map(id).subscribe(
      optionMap => {

        // Fixed: Must destroy before attributing a new instance
        this.map.destroy();
        this.map = AbaMap.fromOptionMap("esri-map", optionMap);
        this.checkNeedZoom();

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
