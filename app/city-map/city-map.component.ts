import { Component, OnInit, Input} from '@angular/core';
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

  constructor(private mapService: MapService) { }

  getMaps(): void {
    this.mapService
        .maps()
        .subscribe(
          optionMaps => {
              this.optionMaps = optionMaps;

              // Show nothing
              this.map = AbaMap.fromOptionMap("esri-map", this.optionMaps[0]);

              // Show bad map
              //this.map = new AbaMap("esri-map");

              console.log(this.optionMaps);
          }
        );
  }

  ngOnInit(): void {
    this.getMaps();
  }

  setLayerType(layerType : LayerType): void {
    this.map.setLayerVisible(layerType);
  }

}
