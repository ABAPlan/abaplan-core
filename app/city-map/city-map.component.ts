import { Component, OnInit } from '@angular/core';
import { Map }                from '../core/map';
import { MapService }         from '../core/map.service';

@Component({
  moduleId: module.id,
  selector: 'aba-map',
  template: `
<ul>
  <li *ngFor="let map of maps">
    {{map.title}}: ({{map.height}}, {{map.width}})
  </li>
</ul>
`
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