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
import artyomjs = require('artyom.js');

// Get an unique ArtyomJS instance
const artyom = artyomjs.ArtyomBuilder.getInstance();


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

    artyom.initialize({
        lang: "fr-FR", // GreatBritain english
        continuous: false, // Listen forever
        soundex: true,// Use the soundex algorithm to increase accuracy
        debug: true, // Show messages in the console
        listen: true // Start to listen commands !
    });

    this.service.map(id)
      .subscribe((optionMap: OptionMap) => {
        this.map.initMap(optionMap, {kind:"osm"});
        this.map.map.disableMapNavigation();
        this.map.map.on("click", (event:any) => {
          let point : Point = <Point> WebMercatorUtils.webMercatorToGeographic(event.mapPoint);
          let p = new google.maps.LatLng(point.y, point.x);
          let geocoder = new google.maps.Geocoder();
          geocoder.geocode({location:p},
            (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
              if (status === google.maps.GeocoderStatus.OK) {
                const address =results[0].
                               address_components[0].
                               long_name+' '+
                               results[0].
                               address_components[1].
                               long_name;
                console.log(address);
                artyom.say(address);
              }
            }
          );
        })
      }
    );
  }

}
