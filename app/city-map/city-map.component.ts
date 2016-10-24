import { Component, OnInit } from '@angular/core';
import { OptionMap }                from '../core/map';
import { MapService }         from '../core/map.service';

@Component({
  moduleId: module.id,
  selector: 'aba-map',
  templateUrl: 'city-map.component.html'
})

export class CityMapComponent implements OnInit {

  optionMaps: OptionMap[];

  constructor(private mapService: MapService) { }

  getMaps(): void {
    this.mapService
        .maps()
        .subscribe(
          optionMaps => this.optionMaps = optionMaps
        );
    console.log(this.optionMaps);
  }

  ngOnInit(): void {
    this.getMaps();
  }

}