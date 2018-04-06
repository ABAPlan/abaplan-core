import { Http } from "@angular/http";
import Point = require("esri/geometry/Point");

export interface TransportProvider {
  getStationsNearby(point: Point);
  getStationInfo(station: string);
}

export class OpendataCHProvider implements TransportProvider {
  private url = "https://transport.opendata.ch/v1/";

  constructor(private http: Http) {}

  public getStationsNearby(point: Point) {
    const request: string =
      "locations?x=" + point.y + "&y=" + point.x + "&type=station";
    return this.http.get(this.url + request);
  }

  public getStationInfo(station: string) {
    const request: string = 'stationboard?station="' + station + '"&limit=10';
    return this.http.get(this.url + request);
  }
}
