import {Injectable} from "@angular/core";

import { GOOGLE_GEOCODE_KEY } from './secret';
import googleMaps = require("google-maps");
import Point = require("esri/geometry/Point");
import { Observable } from 'rxjs/Observable';
import WebMercatorUtils = require('esri/geometry/webMercatorUtils');
import LatLng = google.maps.LatLng;

@Injectable()
export class GeoService {

  private readonly geoProvider: IGeoProvider = new GoogleProvider();

  constructor() { }

  public address(location: Point | string): Observable<string | undefined> {
    return this.geoProvider.address(location);
  }

  public point(address: string): Observable<Point | undefined> {
    return this.geoProvider.point(address);
  }

  public distance(p1: Point, p2: Point): number {
    return this.geoProvider.distance(p1, p2);
  }

}

interface IGeoProvider {
  address(location: Point | string): Observable<string | undefined>;
  point(address: string): Observable<Point | undefined>;
  distance(p1: Point, p2: Point): number;
}

class GoogleProvider {

  // https://developers.google.com/maps/documentation/javascript/libraries?hl=fr

  constructor(){
    googleMaps.KEY = GOOGLE_GEOCODE_KEY;
    googleMaps.LIBRARIES = ['geometry'];
    googleMaps.load();
  }

  public address(point: Point): Observable<string | undefined> {

    const geocoder = new google.maps.Geocoder();
    const p = new google.maps.LatLng(point.y, point.x);

    return Observable.create(
      obs => {
        geocoder.geocode(
          { location: p },
          (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK) {
              console.log(results);
              obs.next(results[0]);
            } else {
              obs.next(undefined);
            }
          }
        );
      }
    );
  }

  public point(address: string): Observable<Point | undefined> {

    const geocoder = new google.maps.Geocoder();

    return Observable.create(
      obs => {
        geocoder.geocode(
          { address: address },
          (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK) {
              const latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
              const point: Point = new Point(latLng.lng(), latLng.lat());
              obs.next(point);
            } else {
              obs.next(undefined);
            }
          }
        );
      }
    );

  }

  public distance(point1: Point, point2: Point): number {
    const p1: LatLng = new google.maps.LatLng(point1.y, point1.x);
    const p2: LatLng = new google.maps.LatLng(point2.y, point2.x);
    return google.maps.geometry.spherical.computeDistanceBetween(p1, p2); //.toFixed(0);
  }
}
