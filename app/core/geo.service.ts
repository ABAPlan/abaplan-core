import {Injectable} from "@angular/core";

import { GOOGLE_GEOCODE_KEY } from '../touchpad/secret';
import googleMaps = require("google-maps");
import Point = require("esri/geometry/Point");
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeoService {

  private readonly geoProvider: IGeoProvider = new GoogleProvider();

  constructor() { }

  public address(point: Point): Observable<string | undefined> {
    return this.geoProvider.address(point);
  }

}

interface IGeoProvider {
  address(point: Point): Observable<string | undefined>;
}

class GoogleProvider {

  constructor(){
    googleMaps.KEY = GOOGLE_GEOCODE_KEY;
    googleMaps.load();
  }

  public address(point: Point): Observable<string | undefined> {
    console.log(point);
    let p = new google.maps.LatLng(point.y, point.x);
    let geocoder = new google.maps.Geocoder();

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
}
