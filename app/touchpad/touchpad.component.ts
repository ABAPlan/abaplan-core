import { Component, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MapService } from '../core/map.service';
import { OptionMap, AbaMap } from '../core/map';
import { MapComponent } from '../map/map.component'
import { GOOGLE_GEOCODE_KEY } from './secret'
import WebMercatorUtils = require('esri/geometry/webMercatorUtils');
import Geometry = require('esri/geometry/Geometry');
import Point = require('esri/geometry/Point')
import googleMaps = require("google-maps"); 

@Component({
  selector: 'aba-touchpad',
  templateUrl: 'touchpad.component.html',
  styleUrls: ['touchpad.component.css']
})

export class TouchpadComponent {
  @ViewChild(MapComponent)
  private map: MapComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MapService
  ){ }

  ngOnInit() {
    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];
    googleMaps.KEY = GOOGLE_GEOCODE_KEY;
    googleMaps.load();

    this.service.map(id)
      .subscribe((optionMap: OptionMap) => {
        this.map.initMap(optionMap, {kind:"osm"});
        this.map.map.disableMapNavigation();
        this.map.map.on("click", (event:any) => {
          let point : Point = <Point> WebMercatorUtils.webMercatorToGeographic(event.mapPoint);
          let p = new google.maps.LatLng(point.y, point.x);
          console.log(p);
        })
      }
    );
  }

}
