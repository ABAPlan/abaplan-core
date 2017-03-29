import {Component, ViewChild, ElementRef} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MapService } from '../map/map.service';
import { GeoService } from '../core/geo.service';
import { VoiceService } from '../core/voice.service';
import { StateService } from "../core/state.service";
import { OptionMap } from '../map/map';
import { MapComponent } from '../map/map.component'

import WebMercatorUtils = require('esri/geometry/webMercatorUtils');
import Geometry = require('esri/geometry/Geometry');
import Point = require('esri/geometry/Point')
import Graphic = require("esri/graphic");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import {Vector2d, Plane2d, transform} from '../core/vector2d';
import LatLng = google.maps.LatLng;

@Component({
  selector: 'aba-touchpad',
  templateUrl: 'touchpad.component.html',
  styleUrls: ['touchpad.component.css'],
  providers : []
})
export class TouchpadComponent {
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  private nbClick: number = 0;
  private readonly defaultVector: Vector2d = {x: 0, y: 0};
  private devicePlane: Plane2d = <Plane2d> { A: this.defaultVector, B: this.defaultVector, C: this.defaultVector, D: this.defaultVector};
  private divPlane: Plane2d = <Plane2d> { A: this.defaultVector, B: this.defaultVector, C: this.defaultVector, D: this.defaultVector};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private voiceService : VoiceService,
    private stateService : StateService,
    private geoService : GeoService,
    private _elementRef: ElementRef
  ){

    this.prepareVoiceCommand();
    this.voiceService.say("Appuyez au centre de la dalle");

    document.onclick = (ev: MouseEvent) => {
      if (!this.isCalibrated()) {
        /*
         * Calibration mode.
         * At the beginning, we detect the 4th corner of the device to map with de real div esri map
         */
        switch (this.nbClick) {
          case 0:
            this.voiceService.say("Appuyez en haut à gauche");
            break;
          case 1:
            /* Note: clientX and clientY for firefox compatibility */
            this.devicePlane.A = <Vector2d> {x: ev.x || ev.clientX, y: ev.y || ev.clientY};

            const geo = this.mapComponent.map.extent;

            this.divPlane.C = <Vector2d> {x: geo.xmin, y: geo.ymin };
            this.divPlane.D = <Vector2d> {x: geo.xmax, y: geo.ymin };
            this.divPlane.A = <Vector2d> {x: geo.xmin, y: geo.ymax };
            this.divPlane.B = <Vector2d> {x: geo.xmax, y: geo.ymax };

            this.voiceService.say("en haut à droite");
            break;

          case 2:
            this.devicePlane.B = <Vector2d> {x: ev.x || ev.clientX, y: ev.y || ev.clientY};

            this.voiceService.say("en bas à gauche");
            break;
          case 3:
            this.devicePlane.C = <Vector2d> {x: ev.x || ev.clientX, y: ev.y || ev.clientY};

            this.voiceService.say("en bas à droite");
            break;
          case 4:
            this.devicePlane.D = <Vector2d> {x: ev.x || ev.clientX, y: ev.y || ev.clientY};

            this.voiceService.say("Dalle calibrée");
            break;
        }
        this.nbClick += 1;

      } else if (this.isCalibrated()) {

        // Transformation from device coordinates to esri map coordinates

        // Detect current `P` point
        const OP = { x: ev.x || ev.clientX, y: ev.y || ev.clientY };

        // `P'` is the transformed final point on the esri map
        const OP_ = transform(OP, this.devicePlane, this.divPlane);

        // Transform to EsriPoint
        const mappedPoint = new Point(OP_.x, OP_.y);
        const touchPoint : Point = <Point> WebMercatorUtils.webMercatorToGeographic(mappedPoint);

        switch (this.stateService.activeMode().mode){
          case "reading":
            this.locateClick(touchPoint);
            break;
          case "searching":
            this.geoService.point("1, rue de la prairie").subscribe(
              data => {
                if (data){
                  this.searchLocationClick(touchPoint, data);
                }
              }
            );
            break;
        }

      }
    };
  }

  private isCalibrated(): boolean {
    return this.nbClick > 4;
  }
  

  onClick() {
    // Enable full screen
    const elem = <any> document.getElementsByTagName('body')[0];
    const f = elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
    f.call(elem);
  }

  ngOnInit() {

      // (+) converts string 'id' to a number
      let id = +this.route.snapshot.params['id'];

    this.mapService.map(id)
      .subscribe((optionMap: OptionMap) => {

          this.mapComponent.initMap(optionMap);

          /* jca: hack for the issue #76 and #77
           * To load an OSM map on a map saved with a different layer, we must load osm right
           * after the beginning of the original layer.
           */
          this.mapComponent.map.on("layer-reorder", () => {
            //this.mapComponent.map.setLayerVisible({kind: "osm"});
          });
          this.mapComponent.map.on("extent-change", () => {
            this.mapComponent.map.setLayerVisible({kind: "osm"});
          });

          this.mapComponent.map.disableMapNavigation();

        }
      );
  }

  private prepareVoiceCommand(): void {

    // Reading mode (default)
    this.voiceService.addCommand(
      ["lecture"],
      "lecture, mode par défaut",
      () => {
        this.stateService.changeMode( {mode: "reading"} );
        this.voiceService.say("Mode lecture activé");
      }
    );

    // Searching mode
    this.voiceService.addCommand(
      ["rechercher *", "recherche *", "chercher *", "cherche *"],
      "Recherche d'un emplacement",
      (i, wildcard) => {
        this.stateService.changeMode( {mode: "searching"} );
        this.voiceService.say("Mode recherche activé");


        //this.voiceService.say(this.geoService.address(wildcard));










      }
    );

    this.voiceService.addCommand(
      ["putain", "merde", "chier", "salope", "saloperie", "ça race", "enculer", "pute", "putain", "ta mère la pute", "ta gueule"],
      "grossièreté",
      (i) => {
        if (i%3===0) {
          this.voiceService.say("Par pitié, calmez vous");
        } else if (i%3 === 1){
          this.voiceService.say("On dit Zut !");
        }else{
          this.voiceService.say("Plait-il ?");
        }
      }
    );

  }

  private locateClick(point: Point): void {


    this.geoService.address(point).subscribe(
      address => {
        console.log("address", address);
        if (address){
          this.voiceService.sayGeocodeResult(address);
        }
      }
    );

    const symbol = new SimpleMarkerSymbol({
      color: [226, 119, 40],
      outline: { color: [255, 255, 255], width: 2 },
    });
    const graphic = new Graphic(point, symbol);
    this.mapComponent.map.graphics.add(graphic);
  }

  private searchLocationClick(touchPoint: Point, location: LatLng): void {

    const touchLatLng = new google.maps.LatLng(touchPoint.y, touchPoint.x);
    const direction = this.direction(location,touchLatLng);
    const dist = this.geoService.distance(location, touchLatLng);

    if (dist >= 1000) {
      this.voiceService.say(direction + " a " + Math.floor(dist/1000) + " kilomètre");
    } else  if (dist > 20){
      this.voiceService.say(direction + " a " + Math.floor(dist) + " mètres");
    } else {
      this.voiceService.say("Vous êtes arrivé");
    }

  }

  // Chappatte's bullshit code refactored:
  private direction(p1: LatLng, p2: LatLng): string {
    const cNO_ANGLE = 999;
    const dx = p2.lat() - p1.lat();
    const dy = p2.lng() - p1.lng();
    let radian;

    //azimuth a la sacha
    if (dx > 0) {
      radian = (Math.PI * 0.5) - Math.atan(dy / dx);
    } else if (dx < 0) {
      radian = (Math.PI * 1.5) - Math.atan(dy / dx);
    } else if (dy > 0) {
      radian = 0;
    } else if (dy < 0) {
      radian = Math.PI;
    } else {
      radian = cNO_ANGLE; // the 2 points are equal}
    }

    const angle = radian * 180 / Math.PI;

    if (angle < 22.5 || angle >= 337.5) {
      return "A gauche";
    } else if (angle < 67.5) {
      return "En bas a gauche";
    } else if (angle < 112.5) {
      return "En bas";
    } else if (angle < 157.5) {
      return "En bas a droite";
    } else if (angle < 202.5) {
      return "A droite";
    } else if (angle < 247.5) {
      return "En haut a droite";
    } else if (angle < 292.5) {
      return "En haut";
    } else if (angle < 337.5) {
      return "En haut a gauche";
    }
    return "A gauche";

  }

}
