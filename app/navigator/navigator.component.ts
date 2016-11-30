import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { OptionMap, AbaMap } from '../core/map';
import { LayerType } from '../core/layer';
import { MapService } from '../core/map.service';
import ArcgisSearch = require('esri/dijit/Search');
const img_loading = require("file?name=./assets/[name].[ext]!./img/spin.gif");

@Component({
  selector: 'aba-map',
  templateUrl: 'navigator.component.html',
  styles: ['#esri-map { width: 1176px; height: 800px; border-style: solid; border-width: 2px;} .row { padding-bottom: 4px; }']
})


export class CityMapComponent implements OnInit {

  optionMaps: OptionMap[];
  map : AbaMap;
  search: ArcgisSearch;

  mapLoading : boolean = false;
  imgLoading : string = img_loading;

  @Output() mapInstancied = new EventEmitter();
  @Input() editableMode : boolean;
  @Input() geometryType : string;

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

  ngOnChanges(changes: SimpleChanges) {
    if(changes['editableMode'] && this.map){
      this.map.setEditableMode(this.editableMode);
    }
    if(changes['geometryType'] && this.map){
      this.map.setGeometryType(this.geometryType);
    }
  }

  setLayerType(layerType : LayerType): boolean {
    if(this.map){
      this.map.setLayerVisible(layerType);
      return true;
    }
    return false;
  }

  initMap(optionMap: OptionMap): void {
    this.map = AbaMap.fromOptionMap("esri-map", optionMap);
    this.map.on("update-start", () => this.mapLoading = true);
    this.map.on("update-end", () => this.mapLoading = false);

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
