import {Injectable} from "@angular/core";

import { GOOGLE_GEOCODE_KEY } from '../touchpad/secret';
import googleMaps = require("google-maps");
import Point = require("esri/geometry/Point");


@Injectable()
export class GeoService {

  private readonly geoProvider: IGeoProvider = new GoogleProvider();

  constructor() { }

  public address(point: Point): string | undefined {
    return geoProvider.address(point);
  }

}

interface IGeoProvider {
  address(point: Point): string | undefined;
}

class GoogleProvider {

  private readonly googleMaps.KEY = GOOGLE_GEOCODE_KEY;

  constructor(){
    googleMaps.load();
  }

  public address(point: Point){
    let p = new google.maps.LatLng(point.y, point.x);
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: p },
      (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK) {
          return results[0];
        }
      }
    );

    return undefined;

  }
}
