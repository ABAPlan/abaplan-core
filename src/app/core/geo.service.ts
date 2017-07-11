import {Injectable} from "@angular/core";

import { GOOGLE_GEOCODE_KEY } from './secret';
import googleMaps = require("google-maps");
import Point = require("esri/geometry/Point");
import { Observable } from 'rxjs/Observable';
import WebMercatorUtils = require('esri/geometry/webMercatorUtils');
import LatLng = google.maps.LatLng;
import { Direction } from './direction';



@Injectable()
export class GeoService {

  private readonly geoProvider: IGeoProvider = new GoogleProvider();

  constructor() { }

  public address(location: Point): Observable<string | undefined> {
    return this.geoProvider.address(location);
  }

  public point(address: string): Observable<Point | undefined> {
    return this.geoProvider.point(address);
  }

  /** Translate Direction in key word for translate */
  public directionToText(target: Point, point: Point): Array<string> {
    let data : Array<string> = [];

    let direction = "search_" + this.geoProvider.direction(target, point).direction;
    const dist = this.geoProvider.distance(target, point);

    if (dist >= 1000) {
      data.push(direction);
      data.push("searchTo");
      data.push(String(Math.floor(dist/1000)));
      data.push("searchKilometer");
      return data;
    } else  if (dist > 20){
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

interface IGeoProvider {
  address(location: Point): Observable<string | undefined>;
  point(address: string): Observable<Point | undefined>;
  distance(p1: Point, p2: Point): number;
  direction(point1: Point, point2: Point): Direction;
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

  // Chappatte's bullshit code refactored:
  public direction(point1: Point, point2: Point): Direction {
    const p1: LatLng = new google.maps.LatLng(point1.y, point1.x);
    const p2: LatLng = new google.maps.LatLng(point2.y, point2.x);
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
      return { direction: "left" };
    } else if (angle < 67.5) {
      return { direction: "lower_left"};
    } else if (angle < 112.5) {
      return { direction: "lower"};
    } else if (angle < 157.5) {
      return { direction: "lower_right"};
    } else if (angle < 202.5) {
      return { direction: "right"};
    } else if (angle < 247.5) {
      return { direction: "upper_right"};
    } else if (angle < 292.5) {
      return { direction: "upper"};
    } else if (angle < 337.5) {
      return { direction: "upper_left"};
    }
    return { direction: "center" };

  }
}
