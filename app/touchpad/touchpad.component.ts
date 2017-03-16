import { Component, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MapService } from '../core/map.service';
import { VoiceService } from './voice.service';
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
  styleUrls: ['touchpad.component.css'],
  providers : [VoiceService]
})

export class TouchpadComponent {
  @ViewChild(MapComponent)
  private map: MapComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private voiceService : VoiceService
  ){ }

  ngOnInit() {
    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];
    googleMaps.KEY = GOOGLE_GEOCODE_KEY;
    googleMaps.load();

    this.mapService.map(id)
      .subscribe((optionMap: OptionMap) => {

        this.map.map = AbaMap.fromOptionMap("esri-map", optionMap);
        this.map.map.setLayerVisible( { kind: "osm" });

        this.map.map.disableMapNavigation();
        this.map.map.on("click", (event:any) => {
          let point : Point = <Point> WebMercatorUtils.webMercatorToGeographic(event.mapPoint);
          let p = new google.maps.LatLng(point.y, point.x);
          let geocoder = new google.maps.Geocoder();
          geocoder.geocode({location:p},
            (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
              if (status === google.maps.GeocoderStatus.OK) {
                this.voiceService.sayGeocodeResult(results[0]);
              }
            }
          );
        })
      }
    );
  }

}
