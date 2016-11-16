import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { OptionMap, AbaMap } from '../core/map';
import { LayerType } from '../core/layer';
import { MapService } from '../core/map.service';
import ArcgisSearch = require('esri/dijit/Search');

@Component({
  selector: 'aba-map',
  templateUrl: 'city-map.component.html',
  styles: ['#esri-map { width: 1029px; height: 700px; }']
})


export class CityMapComponent implements OnInit {

  optionMaps: OptionMap[];
  map : AbaMap;
  nextLayerType : LayerType;
  search: ArcgisSearch;

  @Output() mapInstancied = new EventEmitter();

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
    if(this.map){
      this.map.setLayerVisible(layerType);
      return true;
    }
    return false;
  }

  initMap(optionMap?: OptionMap): void {
    if(optionMap){
      this.map = AbaMap.fromOptionMap("esri-map", this.optionMaps[0]);
      this.search = new ArcgisSearch(
        {
          map: this.map,
          /* useMapExtent:false, */
          enableHighlight: false
        },
        "search"
      );

      this.mapInstancied.emit(this.map);
    }
  }

}
