import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { METERS_BY_KILOMETER } from "../../conf/internationalSystem";
import { SEARCH_BY_PRESS_PRECISION_IN_METERS } from "../../conf/touchpad-voice";
import { GeoProvider, GoogleProvider } from "./googleProvider";

import Point = require("esri/geometry/Point");
import WebMercatorUtils = require("esri/geometry/webMercatorUtils");

export interface SearchedPointIndications {
  reached: boolean;
  direction?: string;
  distance?: number;
  unit?: string;
}

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
  public directionToText(target: Point, point: Point): SearchedPointIndications {
    const direction =
      "search_" + this.geoProvider.direction(target, point).direction;
    const distanceInMeters = this.geoProvider.distance(target, point);

    // If distant that at less one kilometer
    if (distanceInMeters >= METERS_BY_KILOMETER) {
      return {
        direction,
        distance: Math.floor(distanceInMeters / METERS_BY_KILOMETER),
        reached: false,
        unit: "si_unit_km",
      };
    }

    // If distant that more than the precision
    if (distanceInMeters > SEARCH_BY_PRESS_PRECISION_IN_METERS) {
      return {
        direction,
        distance: Math.floor(distanceInMeters),
        reached: false,
        unit: "si_unit_m",
      };
    }

    return {reached: true};
  }
}
