import { Component, ViewChild } from "@angular/core";

import { TranslateService } from "ng2-translate";

import Point = require("esri/geometry/Point");
import "rxjs/add/operator/switchMap";
import { ScalarObservable } from "rxjs/observable/ScalarObservable";

import { GeoService } from "../core/geo.service";
import { VoiceService } from "../core/voice.service";
import { MapComponent } from "../map/map.component";
import { MapService } from "../map/map.service";

interface Translations {
  value: string;
}

@Component({
  providers: [],
  selector: "aba-blindCreator",
  styleUrls: ["blind-creator.component.css"],
  templateUrl: "blind-creator.component.html",
})
export class BlindCreatorComponent {
  @ViewChild(MapComponent) private mapComponent: MapComponent;
  private points: Point[] = new Array<Point>();
  private centerPoint: Point;
  private isSave: boolean = false;
  private readonly zoomLevel: number = 16;
  private readonly layerType: any = { kind: "city" };
  private readonly maxPoints: number = 3;

  constructor(
    private voiceService: VoiceService,
    private geoService: GeoService,
    private translateService: TranslateService,
  ) {
    /**Init the voice commands and start calibration
     *
     * Can't be directly in the constructor beacause of
     * compatibity with voice Commands (library can't charge voice early)
     * Hack with onReady callback to be call after
     * init of page
     *  (pj)
     */
    document.onreadystatechange = () => {
      this.voiceService.initialization();
      this.prepareVoiceCommand();
      this.voiceService.say(this.getStringTranslation("blindCreatorEntry"));
    };
  }

  public ngOnInit(): void {
    // Init the Map
    this.mapComponent.getDefaultMap();
    this.mapComponent.setLayerType(this.layerType);
    this.mapComponent.setZoom(this.zoomLevel);
    this.mapComponent.map.disableMapNavigation();
  }

  /* Compute average Point */
  private averagePoint(): Point {
    if (this.points.length === 0) {
      return new Point(0, 0);
    } else if (this.points.length === 1) {
      return this.points[0];
    } else {
      let latitudeAverage: number = 0;
      let longitudeAverage: number = 0;

      this.points.forEach((point) => {
        latitudeAverage += point.getLatitude();
        longitudeAverage += point.getLongitude();
      });

      return new Point(
        longitudeAverage / this.points.length,
        latitudeAverage / this.points.length,
      );
    }
  }

  /* Check if a point is in the map  */
  private isInMap(point: Point): boolean {
    return this.mapComponent.isInMap(point);
  }

  /* Check if all the points is in the map */
  private pointsInMap(): boolean {
    return this.points.every((p) => this.isInMap(p));
  }

  /* Check if the user can add a new point */
  private checkLimit(): boolean {
    return this.points.length + 1 <= this.maxPoints;
  }

  /* Try to add a new Point */
  private addPoint(address: string) {
    if (!this.isSave) {
      if (this.checkLimit()) {
        this.geoService.point(address).subscribe((searchPoint: Point) => {
          if (searchPoint === undefined) {
            this.voiceService.say(this.getStringTranslation("searchKo"));
          } else {
            this.points.push(searchPoint);
            if (this.points.length === 1) {
              this.mapComponent.centerMap(searchPoint);
              this.centerPoint = searchPoint;
              this.voiceService.say(this.getStringTranslation("bcAddPoint"));
            } else {
              const average: Point = this.averagePoint();
              this.mapComponent.centerMap(average);

              if (this.pointsInMap()) {
                this.voiceService.say(this.getStringTranslation("bcAddPoint"));
                this.centerPoint = average;
              } else {
                this.points.pop();
                this.voiceService.say(
                  this.getStringTranslation("bcNotAddPoint"),
                );
                this.mapComponent.centerMap(this.centerPoint);
              }
            }
          }
        });
      } else {
        this.voiceService.say(this.getStringTranslation("bcTooManyPoints"));
      }
    } else {
      this.voiceService.say(this.getStringTranslation("bcAlreadySave"));
    }
  }

  /* Save the Map in Database */
  private saveMap(title: string) {
    if (!this.isSave) {
      this.mapComponent.saveMapWithTitle(title);
      this.voiceService.say(this.getStringTranslation("bcSave") + title);
      this.isSave = true;
    } else {
      this.voiceService.say(this.getStringTranslation("bcAlreadySave"));
    }
  }

  /* Print the map when the update end */
  private printMap() {
    if (this.isSave) {
      if (!this.mapComponent.mapLoading) {
        (window as any).print();
      } else {
        this.mapComponent.map.onUpdateEnd = () => {
          this.mapComponent.mapLoading = false;
          (window as any).print();
          // At the end load the older UpdateEnd
          this.mapComponent.map.onUpdateEnd = () =>
            (this.mapComponent.mapLoading = false);
        };
      }
    } else {
      this.voiceService.say(this.getStringTranslation("bcNeedSave"));
    }
  }

  /* Redirect to Touchpad if the map is save */
  private redirectionToTouchpad(): void {
    if (this.isSave) {
      if (this.mapComponent.map.uid) {
        this.voiceService.say(
          this.getStringTranslation("bcRedirection") +
            String(this.mapComponent.map.uid),
        );
        window.location.replace(
          "touchpad-voice/" + String(this.mapComponent.map.uid),
        );
      } else {
        this.voiceService.say(this.getStringTranslation("bcSaving"));
      }
    } else {
      this.voiceService.say(this.getStringTranslation("bcNeedSave"));
    }
  }

  /** Change language of application */
  private changeLang(langTranslate: string, langVoice: string): void {
    this.translateService.use(langTranslate);
    this.voiceService.changeLang(langVoice);
  }

  /** Add Commands */
  private prepareVoiceCommand() {
    // Loop for add command in each lang of application
    const langs = this.translateService.getLangs();
    for (const entry of langs) {
      this.translateService.use(entry);
      const codeVoice = this.getStringTranslation("codeLangVoice");

      // Switch Lang command
      this.voiceService.addCommand(
        [this.getStringTranslation("myLang")],
        this.getStringTranslation("codeLang"),
        () => this.changeLang(entry, codeVoice),
      );

      // Add Point to the map
      this.voiceService.addCommand(
        this.getStringTranslations("bcAddId"),
        this.getStringTranslation("bcAddDescri"),
        (i: number, wildcard: string) => this.addPoint(wildcard),
      );

      // Save Map
      this.voiceService.addCommand(
        this.getStringTranslations("bcSaveId"),
        this.getStringTranslation("bcSaveDescri"),
        (i: number, wildcard: string) => this.saveMap(wildcard),
      );

      // Print Map
      this.voiceService.addCommand(
        this.getStringTranslations("bcPrintId"),
        this.getStringTranslation("bcPrintDecri"),
        () => this.printMap(),
      );

      // Redirection to Touchpad
      this.voiceService.addCommand(
        this.getStringTranslations("bcRedirectionId"),
        this.getStringTranslation("bcRedirectionDescri"),
        () => this.redirectionToTouchpad(),
      );
    }
    this.translateService.use(this.translateService.getBrowserLang());
  }

  /** Return string by id and current lang of application */
  private getStringTranslation(s: string): string {
    return (this.translateService.get(s) as ScalarObservable<string>).value;
  }

  /** Return array of string by id and current lang of application */
  private getStringTranslations(s: string): string[] {
    return (this.translateService.get(s) as ScalarObservable<
      Translations[]
    >).value.map((object) => object.value);
  }
}
