import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "ng2-translate";
import "rxjs/add/operator/switchMap";
import { ScalarObservable } from "rxjs/observable/ScalarObservable";
import { GeoService } from "../core/geo.service";
import { KmlService } from "../core/kml.service";
import { StateService } from "../core/state.service";
import { TransportService } from "../core/transport.service";
import { Plane2d, transform, Vector2d } from "../core/vector2d";
import { VoiceService } from "../core/voice.service";
import { OptionMap } from "../map/map";
import { MapComponent } from "../map/map.component";
import { MapService } from "../map/map.service";
import { AbaplanHotkeysService } from "../shared/abaplanHotkeysService";

import Geometry = require("esri/geometry/Geometry");
import Point = require("esri/geometry/Point");
import WebMercatorUtils = require("esri/geometry/webMercatorUtils");
import Graphic = require("esri/graphic");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import LatLng = google.maps.LatLng;

interface Translations {
  value: string;
}

@Component({
  providers: [],
  selector: "aba-touchpad",
  styleUrls: ["touchpad.component.css"],
  templateUrl: "touchpad.component.html",
})
export class TouchpadComponent {
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  private nbClick: number = 0;
  private readonly defaultVector: Vector2d = {x: 0, y: 0};
  private devicePlane: Plane2d = {
    A: this.defaultVector,
    B: this.defaultVector,
    C: this.defaultVector,
    D: this.defaultVector,
  } as Plane2d;
  private divPlane: Plane2d = {
    A: this.defaultVector,
    B: this.defaultVector,
    C: this.defaultVector,
    D: this.defaultVector,
  } as Plane2d;

  private searchingPoint: Point | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private voiceService: VoiceService,
    private stateService: StateService,
    private geoService: GeoService,
    private translateService: TranslateService,
    private kmlService: KmlService,
    private transportService: TransportService,
    private _elementRef: ElementRef,
    private hotkey: AbaplanHotkeysService,
  ) {

    // TODO: move this outside of the code
    hotkey.addHotkeys([
      {
        callback: () => {
          this.readCommand();
          return false;
        },
        description: "Passe en mode plan (lecture)",
        hotkeys: ["l", "p"],
      },
      {
        callback: () => {
          this.searchStation();
          return false;
        },
        description: "Passe en mode transport",
        hotkeys: "t",
      },
      {
        callback: () => {
          this.itineraryCommand();
          return false;
        },
        description: "Passe en mode itinéraire",
        hotkeys: "i",
      },
    ]);

    /**Init the voice commands and start calibration
     *
     * Can"t be directly in the constructor beacause of
     * compatibity with voice Commands (library can"t charge voice early)
     * Hack with onReady callback to be call after
     * init of page
     *  (pj)
     */
    document.onreadystatechange = () => {
      this.voiceService.initialization();
      this.prepareVoiceCommand();
      this.voiceService.say(this.getStringTranslation("touchpadCenter"));
    };

    document.onclick = (ev: MouseEvent) => {
      if (!this.isCalibrated()) {
        /*
         * Calibration mode.
         * At the beginning, we detect the 4th corner of the device to map with de real div esri map
         */
        switch (this.nbClick) {
          case 0:
            this.voiceService.say(this.getStringTranslation("touchpadTopLeft"));
            break;
          case 1:
            /* Note: clientX and clientY for firefox compatibility */
            this.devicePlane.A = {
              x: ev.x || ev.clientX,
              y: ev.y || ev.clientY,
            } as Vector2d;

            const geo = this.mapComponent.map.extent;

            this.divPlane.C = {x: geo.xmin, y: geo.ymin } as Vector2d;
            this.divPlane.D = {x: geo.xmax, y: geo.ymin } as Vector2d;
            this.divPlane.A = {x: geo.xmin, y: geo.ymax } as Vector2d;
            this.divPlane.B = {x: geo.xmax, y: geo.ymax } as Vector2d;

            this.voiceService.say(this.getStringTranslation("touchpadTopRight"));
            break;

          case 2:
            this.devicePlane.B = {x: ev.x || ev.clientX, y: ev.y || ev.clientY} as Vector2d;

            this.voiceService.say(this.getStringTranslation("touchpadBottomLeft"));
            break;
          case 3:
            this.devicePlane.C = {x: ev.x || ev.clientX, y: ev.y || ev.clientY} as Vector2d;

            this.voiceService.say(this.getStringTranslation("touchpadBottomRight"));
            break;
          case 4:
            this.devicePlane.D = {x: ev.x || ev.clientX, y: ev.y || ev.clientY} as Vector2d;

            this.voiceService.say(this.getStringTranslation("touchpadOk"));
            break;
        }
        this.nbClick += 1;

      } else {

        // Transformation from device coordinates to esri map coordinates

        // Detect current `P` point
        const OP = { x: ev.x || ev.clientX, y: ev.y || ev.clientY };

        // `P"` is the transformed final point on the esri map
        const OP_ = transform(OP, this.devicePlane, this.divPlane);

        // Transform to EsriPoint
        const mappedPoint = new Point(OP_.x, OP_.y);
        const touchPoint: Point = WebMercatorUtils.webMercatorToGeographic(mappedPoint) as Point;
        this.transportService.currentPoint = touchPoint;

        switch (this.stateService.activeMode().mode) {
          case "reading":
            this.locateClick(touchPoint);
            break;
          case "searching":
            if (this.searchingPoint !== undefined) {
              this.searchLocationClick(this.searchingPoint, touchPoint);
            } else {
              this.voiceService.say("Recherche en cours");
            }
            break;
          case "itinerary":
            this.kmlService.currentPoint(touchPoint.y, touchPoint.x);
            this.locateClick(touchPoint);
            break;
        }

        const symbol = new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: { color: [255, 255, 255], width: 2 },
        });
        const graphic = new Graphic(touchPoint, symbol);
        this.mapComponent.map.graphics.add(graphic);

      }
    };

  }

  private isCalibrated(): boolean {
    return this.nbClick > 4;
  }

  private onClick() {
    // Enable full screen
    this.mapComponent.map.setLayerVisible({kind: "osm"});
    const elem = document.getElementsByTagName("body")[0] as any;
    const f = elem.requestFullscreen ||
      elem.msRequestFullscreen ||
      elem.mozRequestFullScreen ||
      elem.webkitRequestFullscreen;
    f.call(elem);
  }

  private ngOnInit() {

    // (+) converts string "id" to a number
    const id = +this.route.snapshot.params.id;

    this.mapService.map(id)
      .subscribe((optionMap: OptionMap) => {

        this.mapComponent.initMap(optionMap);

        /* jca: hack for the issue #76 and #77
         * To load an OSM map on a map saved with a different layer, we must load osm right
         * after the beginning of the original layer.
         */
        this.mapComponent.map.on("layer-reorder", () => {
          // TODO: check the line below
          // this.mapComponent.map.setLayerVisible({kind: "osm"});
        });
        this.mapComponent.map.on("extent-change", () => {
          this.mapComponent.map.setLayerVisible({kind: "osm"});

          const map = document.getElementById("esri-map");
          if (map !== null) {
            const style = map.style;
            style.height = optionMap.height + "px";
            style.width = optionMap.width + "px";
          }

        });

        this.mapComponent.map.disableMapNavigation();

        this.mapComponent.map.width = optionMap.width;
        this.mapComponent.map.height = optionMap.height;

      });
  }

  /** Switch to reading mode and notify the user */
  private readCommand(): void {
    this.stateService.changeMode( {mode: "reading"} );
    this.voiceService.say(this.getStringTranslation("readActive"));
  }

  /** Switch to search mode and notify the user */
  private searchCommand(i: number, wildcard: string): void {
    this.searchingPoint = undefined;
    this.stateService.changeMode( {mode: "searching"} );
    this.voiceService.say(this.getStringTranslation("searchOk") + wildcard);

    this.geoService.point(wildcard).subscribe(
      (searchPoint: Point) => {
        this.searchingPoint = searchPoint;
        if (searchPoint === undefined) {
          this.voiceService.say(this.getStringTranslation("searchKo"));
          this.stateService.changeMode( {mode: "reading"} );
        }
      },
    );
  }

  /** Search the closest station */
  private searchStation(): void {
    this.searchingPoint = undefined;
    this.stateService.changeMode( {mode: "searching"} );

    this.transportService.stationsNearby().subscribe(
      (stations: any) => {
        if (stations) {
            const correspondingStation = stations.json()
              .stations.find((station) => station.coordinate.x !== null && station.coordinate.y !== null);

            if (correspondingStation) {
              const point = new Point(correspondingStation.coordinate.y, correspondingStation.coordinate.x);
              this.searchingPoint = point;
              this.voiceService.say(this.getStringTranslation("transportOKDescri") + correspondingStation.name);
              return;
            }
        }

        // If we get to this point, that mean that something went wrong with the station search
        this.voiceService.say(this.getStringTranslation("transportKODescri"));
        this.readCommand();
      },
    );
  }

  /** Search the closest station by line */
  private searchStationByLine(i: number, wildcard: string): void {
    this.searchingPoint = undefined;
    this.stateService.changeMode( {mode: "searching"} );

    this.transportService.stationsNearby().subscribe(
      (stations: any) => {
        if (stations) {
            this.voiceService.say(this.getStringTranslation("transportOKDescri") + wildcard);
            this.getBusByStation(stations.json(), 0, wildcard);
        } else {
          this.voiceService.say(this.getStringTranslation("transportKODescri") + wildcard);
          this.readCommand();
        }
      },
    );
  }

  /* Check if stops contains specific line */
  private getBusByStation(station: any, index: number, line: string) {
      if (index < station.stations.length) {
        this.transportService.closerStationFilter(station.stations[index].name).subscribe(
          (st) => {
            if (st.json().stationboard.some((elem) => elem.number === line)) {
              const returnedStation = st.json().station;
              const point = new Point(returnedStation.coordinate.y, returnedStation.coordinate.x);
              this.searchingPoint = point;
            } else {
              setTimeout(() => this.getBusByStation(station, index + 1, line), 400);
            }
          },
        );
      } else {
        this.voiceService.say(this.getStringTranslation("transportKODescri"));
        this.readCommand();
      }
  }

  /** Switch to itinerary mode */
  private itineraryCommand(): void {
    this.stateService.changeMode( {mode: "itinerary"} );
    this.voiceService.say(this.getStringTranslation("itineraryActive"));
    // In case of the user switch mod in middle of session , reset values
    this.kmlService.endCurrentSession();
  }

  /** Add last Press Location */
  private itineraryAddCommand(i: number, wildcard: string): void {
    if (this.stateService.activeMode().mode === "itinerary") {
      if (this.kmlService.addCurrentPoint(wildcard)) {
        this.voiceService.say(this.getStringTranslation("itineraryAddPoint") + wildcard);
      } else {
        this.voiceService.say(this.getStringTranslation("itineraryAddPointError"));
      }
    } else {
      this.voiceService.say(this.getStringTranslation("itineraryError"));
    }
  }

  /** Delet last add point */
  private itineraryDeletLastCommand(): void {
    if (this.stateService.activeMode().mode === "itinerary") {
      if (this.kmlService.deletLastPoint()) {
        this.voiceService.say(this.getStringTranslation("itineraryDelet"));
      } else {
        this.voiceService.say(this.getStringTranslation("itineraryDeletLastError"));
      }
    } else {
      this.voiceService.say(this.getStringTranslation("itineraryError"));
    }
  }

  /** Stop the current Session */
  private itineraryStopSession(): void {
    this.kmlService.endCurrentSession();
    this.readCommand();
  }

  private itineraryEndSession(i: number, wildcard: string): void {
    if (this.kmlService.toKml(wildcard)) {
      this.voiceService.say(this.getStringTranslation("itinerarySave"));
      this.kmlService.endCurrentSession();
      this.readCommand();
    } else {
      this.voiceService.say(this.getStringTranslation("itinerarySaveError"));
    }
  }

  /** Notity the user in terms of input number  */
  private offendCommand(i: number): void {
    if (i % 3 === 0) {
      this.voiceService.say(this.getStringTranslation("offendTextOne"));
    } else if (i % 3 === 1) {
      this.voiceService.say(this.getStringTranslation("offendTextTwo"));
    } else {
      this.voiceService.say(this.getStringTranslation("offendTextTree"));
    }
  }

  /** Change language of application */
  private changeLang(langTranslate: string, langVoice: string): void {
    this.translateService.use(langTranslate);
    this.voiceService.changeLang(langVoice);
  }

  /** Help Command */
  private helpCommand(i: number, wildcard: string, langTranslate: string): void {
    const currentLang = this.translateService.currentLang;
    this.translateService.use(langTranslate);
    if (process.env.NODE_ENV !== "production") {
      // tslint:disable-next-line no-console
      console.log(wildcard);
      // tslint:disable-next-line no-console
      console.log(this.getStringTranslations("itineraryId")[0]);
    }
    switch (wildcard) {
      case this.getStringTranslations("readId")[0]:
        this.voiceService.say(this.getStringTranslation("readHelp"));
        break;
      case this.getStringTranslations("itineraryId")[0]:
        this.voiceService.say(this.getStringTranslation("itineraryHelp"));
        this.voiceService.say(this.getStringTranslations("itineraryAddId")[0]
                              + this.getStringTranslation("itineraryAddHelp"));
        this.voiceService.say(this.getStringTranslations("itineraryDeletId")[0]
                              + this.getStringTranslation("itineraryDelHelp"));
        this.voiceService.say(this.getStringTranslations("itinerarySaveId")[0]
                              + this.getStringTranslation("itinerarySaveHelp"));
        this.voiceService.say(this.getStringTranslations("itineraryAbortId")[0]
                              + this.getStringTranslation("itineraryEndHelp"));
        break;
      case this.getStringTranslations("searchId")[0].replace(" *", ""):
        this.voiceService.say(this.getStringTranslation("searchHelp"));
        break;
      default:
        this.voiceService.say(this.getStringTranslation("mainHelpIntro"));
        // Read Command
        this.voiceService.say(this.getStringTranslation("mainHelpMode")
                              + this.getStringTranslations("readId")[0]);
        this.voiceService.say(this.getStringTranslation("mainHelpDo")
                              + this.getStringTranslation("readDescri"));
        // Search Command
        this.voiceService.say(this.getStringTranslation("mainHelpMode")
                              + this.getStringTranslations("searchId")[0]);
        this.voiceService.say(this.getStringTranslation("mainHelpDo")
                              + this.getStringTranslation("searchDescri"));

        // Search Transport Command
        this.voiceService.say(this.getStringTranslation("mainHelpMode")
                              + this.getStringTranslations("transportId")[0]);
        this.voiceService.say(this.getStringTranslation("mainHelpDo")
                              + this.getStringTranslation("transportDescri"));

        // Itinerary Command
        this.voiceService.say(this.getStringTranslation("mainHelpMode")
                              + this.getStringTranslations("itineraryId")[0]);
        this.voiceService.say(this.getStringTranslation("mainHelpDo")
                              + this.getStringTranslation("itineraryDescri"));
        // * help
        this.voiceService.say(this.getStringTranslation("mainHelp*"));

        // lang
        this.voiceService.say(this.getStringTranslation("mainHelpLang"));
        break;
    }
    this.translateService.use(currentLang);
  }

  /** Add Commands */
  private prepareVoiceCommand() {
    // Loop for add command in each lang of application
    const langs = this.translateService.getLangs();
    for (const entry of langs) {
      this.translateService.use(entry);
      const codeVoice = this.getStringTranslation("codeLangVoice");

      // Reading mode (default)
      this.voiceService.addCommand(
        this.getStringTranslations("readId"),
        this.getStringTranslation("readDescri"),
        () => this.readCommand(),
      );

      // Searching mode
      this.voiceService.addCommand(
        this.getStringTranslations("searchId"),
        this.getStringTranslation("searchDescri"),
        (i: number, wildcard: string) => this.searchCommand(i, wildcard),
      );

      // React to insults command
      this.voiceService.addCommand(
        this.getStringTranslations("offendId"),
        this.getStringTranslation("offendDescri"),
        (i: number) => this.offendCommand(i),
      );

      // Switch Lang command
      this.voiceService.addCommand(
        [this.getStringTranslation("myLang")],
        this.getStringTranslation("codeLang"),
        () => this.changeLang(entry, codeVoice),
      );

      // switch to itinerary Mode
      this.voiceService.addCommand(
        this.getStringTranslations("itineraryId"),
        this.getStringTranslation("itineraryDescri"),
        () => this.itineraryCommand(),
      );

      // itinerary Mode - Add
      this.voiceService.addCommand(
        this.getStringTranslations("itineraryAddId"),
        this.getStringTranslation("itineraryAddDescri"),
        (i: number, wildcard: string) => this.itineraryAddCommand(i, wildcard),
      );

      // itinerary Mode - Delet Last
      this.voiceService.addCommand(
        this.getStringTranslations("itineraryDeletId"),
        this.getStringTranslation("itineraryDeletDescri"),
        () => this.itineraryDeletLastCommand(),
      );

      // itinerary Mode - Abort
      this.voiceService.addCommand(
        this.getStringTranslations("itineraryAbortId"),
        this.getStringTranslation("itineraryAbortDescri"),
        () => this.itineraryStopSession(),
      );

      // itinerary Mode - Save As
      this.voiceService.addCommand(
        this.getStringTranslations("itinerarySaveId"),
        this.getStringTranslation("itinerarySaveDescri"),
        (i: number, wildcard: string) => this.itineraryEndSession(i, wildcard),
      );

      // Search Station
      this.voiceService.addCommand(
        this.getStringTranslations("transportId"),
        this.getStringTranslation("transportDescri"),
        () => this.searchStation(),
      );

      // Search Station
      this.voiceService.addCommand(
        this.getStringTranslations("transportSearchId"),
        this.getStringTranslation("transportSearchDescri"),
        (i: number, wildcard: string) => this.searchStationByLine(i, wildcard),
      );

      // itinerary Mode - Save As
      this.voiceService.addCommand(
        this.getStringTranslations("helpId"),
        this.getStringTranslation("helpDescri"),
        (i: number, wildcard: string) => this.helpCommand(i, wildcard, entry),
      );

    }
    this.translateService.use(this.translateService.getBrowserLang());
  }

  /** Locate click and notity the user */
  private locateClick(point: Point): void {

    this.geoService.address(point).subscribe(
      (address) => {
        if (address) {
          this.voiceService.sayGeocodeResult(address);
        }
      },
    );
  }

  /** Notity the user of direction */
  private searchLocationClick(location: Point, touchPoint: Point): void {
    const data: string[] = this.geoService.directionToText(location, touchPoint);
    let diction: string;
    if (data.length > 1) {// ["search_upper", "searchTo", "522", "searchKilometer"]
      diction = this.getStringTranslation(data[0]) + " " + this.getStringTranslation(data[1])
                + " " + data[2] + " " + this.getStringTranslation(data[3]);
    } else {
      diction = this.getStringTranslation(data[0]);
    }
    this.voiceService.say(diction);
  }

  /** Return string by id and current lang of application */
  private getStringTranslation(s: string): string {
    return (this.translateService.get(s)as ScalarObservable<string>).value;
  }

  /** Return array of string by id and current lang of application */
  private getStringTranslations(s: string): string[] {
    return  (this.translateService.get(s)as ScalarObservable<Translations[]>).value.map((object) => object.value);

  }
}
