import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { OptionMap, AbaMap } from '../core/map';
import { LayerType } from '../core/layer';
import { MapService } from '../core/map.service';
import ArcgisSearch = require('esri/dijit/Search');
const img_loading = require("file?name=./assets/[name].[ext]!./img/spin.gif");

import { DrawType } from '../editor/drawMap';

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

  readonly ZOOM_LEVEL_MINIMUM : number = 16;

  constructor(private mapService: MapService) {
  }

  getMaps(): void {
    this.mapService
        .maps()
        .subscribe(
          optionMaps => {
            this.optionMaps = optionMaps;
            this.initMap(this.optionMaps[0]);
          }
        );
  }

  ngOnInit(): void {
    this.getMaps();
  }

  setLayerType(layerType : LayerType): boolean {
    if (this.map){
      this.map.setLayerVisible(layerType);
      return true;
    }
    return false;
  }

  initMap(optionMap: OptionMap): void {
    this.map = AbaMap.fromOptionMap("esri-map", optionMap);
    this.map.on("update-start", () => this.mapLoading = true);
    this.map.on("update-end", () => this.mapLoading = false);

    this.map.on("zoom-end", (event: { level : number}) => {
        if(event.level){
          // Show or hide 'need zoom' message
          this.needZoom = (event.level < this.ZOOM_LEVEL_MINIMUM);

          // If yes, stop loading
          if(this.needZoom)
            this.mapLoading = false; 
        }
        console.log(event);
      }
    );


    this.search = new ArcgisSearch(
      {
        map: this.map,
        /* useMapExtent:false, */
        enableHighlight: false
      },
      "search"
    );

    this.mapInstancied.emit(optionMap);
  }

}
