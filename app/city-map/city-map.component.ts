import { Component, OnInit } from '@angular/core';
import { OptionMap, AbaMap }                from '../core/map';
import { MapService }         from '../core/map.service';

@Component({
  selector: 'aba-map',
  templateUrl: 'city-map.component.html'
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
              // this.map = AbaMap.fromOptionMap("esri-map", optionMaps[1]);

              // Show bad map
              this.map = new AbaMap("esri-map");

              console.log(this.optionMaps);
          }
        );
  }

  ngOnInit(): void {
    this.getMaps();
  }

}
