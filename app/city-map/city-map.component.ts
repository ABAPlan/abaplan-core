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
          optionMaps => this.optionMaps = optionMaps
        );
    console.log(this.optionMaps);
    this.map = new AbaMap("aba-map");
  }

  ngOnInit(): void {
    this.getMaps();
  }

}