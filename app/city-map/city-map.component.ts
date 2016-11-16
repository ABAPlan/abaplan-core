import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { OptionMap, AbaMap } from '../core/map';
import { LayerType } from '../core/layer';
import { MapService } from '../core/map.service';

@Component({
  selector: 'aba-map',
  templateUrl: 'city-map.component.html',
  styles: ['#esri-map { width: 1176px; height: 800px; }']
})


export class CityMapComponent implements OnInit {

  optionMaps: OptionMap[];
  map : AbaMap;
  nextLayerType : LayerType;

  @Output() mapInstancied = new EventEmitter();

  constructor(private mapService: MapService) { }

  getMaps(): void {
    this.mapService
        .maps()
        .subscribe(
          optionMaps => {
              this.optionMaps = optionMaps;

              // Show nothing
              this.map = AbaMap.fromOptionMap("esri-map", this.optionMaps[0]);
              this.mapInstancied.emit(this.map);
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

}
