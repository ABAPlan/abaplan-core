import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { METERS_BY_KILOMETER } from "../../conf/internationalSystem";
import { SEARCH_BY_PRESS_PRECISION_IN_METERS } from "../../conf/touchpad-voice";
import { GeoProvider, GoogleProvider } from "./googleProvider";

import Point = require("esri/geometry/Point");
import WebMercatorUtils = require("esri/geometry/webMercatorUtils");

@Injectable()
export class GeoService {
  private readonly geoProvider: GeoProvider = new GoogleProvider();

  public address(location: Point): Observable<string | undefined> {
    return this.geoProvider.address(location);
  }

  public point(address: string): Observable<Point | undefined> {
    return this.geoProvider.point(address);
  }

  /** Translate Direction in key word for translate */
  public directionToText(target: Point, point: Point): string[] {
    const direction =
      "search_" + this.geoProvider.direction(target, point).direction;
    const distanceInMeters = this.geoProvider.distance(target, point);

    // If distant that at less one kilometer
    if (distanceInMeters >= METERS_BY_KILOMETER) {
      return [
        direction,
        "searchTo",
        String(Math.floor(distanceInMeters / METERS_BY_KILOMETER)),
        "searchKilometer",
      ];
    }

    // If distant that more than the precision
    if (distanceInMeters > SEARCH_BY_PRESS_PRECISION_IN_METERS) {
      return [
        direction,
        "searchTo",
        String(String(Math.floor(distanceInMeters))),
        "searchMeter",
      ];
    }

    return ["searchArrived"];
  }
}
