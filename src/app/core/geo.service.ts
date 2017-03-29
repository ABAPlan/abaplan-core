import {Injectable} from "@angular/core";

import { GOOGLE_GEOCODE_KEY } from './secret';
import googleMaps = require("google-maps");
import Point = require("esri/geometry/Point");
import { Observable } from 'rxjs/Observable';
import LatLng = google.maps.LatLng;

@Injectable()
export class GeoService {

  private readonly geoProvider: IGeoProvider = new GoogleProvider();

  constructor() { }

  public address(location: Point | string): Observable<string | undefined> {
    return this.geoProvider.address(location);
  }

  public point(address: string): Observable<LatLng | undefined> {
    return this.geoProvider.point(address);
  }

  public distance(p1: LatLng, p2: LatLng): number {
    return this.geoProvider.distance(p1, p2);
  }

}

interface IGeoProvider {
  address(location: Point | string): Observable<string | undefined>;
  point(address: string): Observable<LatLng | undefined>;
  distance(p1: LatLng, p2: LatLng): number;
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

  public point(address: string): Observable<LatLng | undefined> {

    const geocoder = new google.maps.Geocoder();

    return Observable.create(
      obs => {
        geocoder.geocode(
          { address: address },
          (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK) {
              obs.next(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
            } else {
              obs.next(undefined);
            }
          }
        );
      }
    );

  }

  public distance(p1: LatLng, p2: LatLng): number {
    return google.maps.geometry.spherical.computeDistanceBetween(p1, p2); //.toFixed(0);
  }
}
