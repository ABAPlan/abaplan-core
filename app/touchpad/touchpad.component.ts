import {Component, ViewChild, ElementRef} from "@angular/core";
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
import Graphic = require("esri/graphic");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import {Vector2d, Plane2d, transform} from '../core/vector2d';

@Component({
  selector: 'aba-touchpad',
  templateUrl: 'touchpad.component.html',
  styleUrls: ['touchpad.component.css'],
  providers : [VoiceService]
})

export class TouchpadComponent {
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  private nbClick: number = 0;
  private devicePlane: Plane2d = <Plane2d> { A: undefined, B: undefined, C: undefined, D: undefined };
  private divPlane: Plane2d = <Plane2d> { A: undefined, B: undefined, C: undefined, D: undefined };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private voiceService : VoiceService,
    private _elementRef: ElementRef
  ){

    document.onclick = (ev: MouseEvent) => {
      console.log(ev);
        if (!this.isCalibrated()) {
          /*
           * Calibration mode.
           * At the beginning, we detect the 4th corner of the device to map with de real div esri map
           */
          switch (this.nbClick) {
            case 1:
              /* Note: clientX and clientY for firefox compatibility */
              this.devicePlane.A = <Vector2d> {x: ev.x || ev.clientX, y: ev.y || ev.clientY};

              const geo = this.mapComponent.map.extent;

              this.divPlane.C = <Vector2d> {x: geo.xmin, y: geo.ymin };
              this.divPlane.D = <Vector2d> {x: geo.xmax, y: geo.ymin };
              this.divPlane.A = <Vector2d> {x: geo.xmin, y: geo.ymax };
              this.divPlane.B = <Vector2d> {x: geo.xmax, y: geo.ymax };
              console.log("---");
              console.log(this.divPlane);
              break;
            case 2:
              this.devicePlane.B = <Vector2d> {x: ev.x || ev.clientX, y: ev.y || ev.clientY};
              break;
            case 3:
              this.devicePlane.C = <Vector2d> {x: ev.x || ev.clientX, y: ev.y || ev.clientY};
              break;
            case 4:
              this.devicePlane.D = <Vector2d> {x: ev.x || ev.clientX, y: ev.y || ev.clientY};
              // Calibration done!
              break;
          }
          this.nbClick += 1;

        } else if (this.isCalibrated()) {

          /* Transformation from device coordinates to esri map coordinates */

          // Detect current `P` point
          let OP = { x: ev.x || ev.clientX, y: ev.y || ev.clientY };

          // `P'` is the transformed final point on the esri map
          let OP_ = transform(OP, this.devicePlane, this.divPlane);
          console.log(OP, OP_);

          // Transform to EsriPoint
          let mappedPoint = new Point(OP_.x, OP_.y);
          let point : Point = <Point> WebMercatorUtils.webMercatorToGeographic(mappedPoint);

          let p = new google.maps.LatLng(point.y, point.x);
          let geocoder = new google.maps.Geocoder();
          geocoder.geocode({location:p},
            (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
              if (status === google.maps.GeocoderStatus.OK) {
                this.voiceService.sayGeocodeResult(results[0]);
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
    };
  }

  private isCalibrated(): boolean {
    return this.nbClick > 4;
  }
  

  onClick() {
    if (this.nbClick === 0) {
      // Enable full screen

      // Issue #76 and #77
      this.mapComponent.map.setLayerVisible( { kind: "osm" });

      const elem = <any> document.getElementsByTagName('body')[0];
      const f = elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
      f.call(elem);
    }
  }

  ngOnInit() {
    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];
    googleMaps.KEY = GOOGLE_GEOCODE_KEY;
    googleMaps.load();

    this.mapService.map(id)
      .subscribe((optionMap: OptionMap) => {

        this.mapComponent.initMap(optionMap);

        /* jca: hack for the issue #76 and #77
         * To load an OSM map on a map saved with a different layer, we must load osm right
         * after the beginning of the original layer.
         */
        this.mapComponent.map.on("extent-change", () => {
          this.mapComponent.map.setLayerVisible( { kind: "osm" });
        });

        this.mapComponent.map.disableMapNavigation();

      }
    );
  }

}
