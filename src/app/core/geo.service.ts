import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
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
    const data: string[] = [];

    const direction =
      "search_" + this.geoProvider.direction(target, point).direction;
    const dist = this.geoProvider.distance(target, point);

    if (dist >= 1000) {
      data.push(direction);
      data.push("searchTo");
      data.push(String(Math.floor(dist / 1000)));
      data.push("searchKilometer");
      return data;
    } else if (dist > 20) {
      data.push(direction);
      data.push("searchTo");
      data.push(String(Math.floor(dist)));
      data.push("searchMeter");
      return data;
    } else {
      data.push("searchArrived");
      return data;
    }
  }
}
