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

        switch (this.stateService.activeMode().mode){
          case "reading":
            this.locateClick(ev);
            break;
          case "searching":
            this.searchLocationClick(ev);
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
      }
    );

    this.voiceService.addCommand(
      ["putain", "merde", "chier", "salope", "saloperie", "ça race", "enculer", "pute", "putain", "ta mère la pute", "ta gueule"],
      "grossièreté",
      (i) => {
        if (i%3===0) {
          this.voiceService.say("Par pitié, calmez vous");
        } else if (i%3 === 1){
          this.voiceService.say("C'est fini, oui ?");
        }else{
          this.voiceService.say("Plait-il ?");
        }
      }
    );

  }

  private locateClick(ev: MouseEvent): void {

    // Transformation from device coordinates to esri map coordinates

    // Detect current `P` point
    const OP = { x: ev.x || ev.clientX, y: ev.y || ev.clientY };

    // `P'` is the transformed final point on the esri map
    const OP_ = transform(OP, this.devicePlane, this.divPlane);

    // Transform to EsriPoint
    const mappedPoint = new Point(OP_.x, OP_.y);
    const point : Point = <Point> WebMercatorUtils.webMercatorToGeographic(mappedPoint);

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

  private searchLocationClick(ev: MouseEvent): void {

  }


}
