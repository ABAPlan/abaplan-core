import { Component, OnInit } from '@angular/core';
import { Map }                from '../core/map';
import { MapService }         from '../core/map.service';

@Component({
  moduleId: module.id,
  selector: 'aba-map',
  templateUrl: 'city-map.component.html'
})
export class CityMapComponent implements OnInit {

  maps: Map[];

  constructor(private mapService: MapService) { }

  getMaps(): void {
    this.mapService
        .maps()
        .subscribe(
          maps => this.maps = maps
        );
  }

  ngOnInit(): void {
    this.getMaps();
  }

}