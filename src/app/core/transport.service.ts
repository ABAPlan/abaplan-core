import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import Point = require('esri/geometry/Point');
import { Observable } from 'rxjs/Observable';


@Injectable()
export class TransportService {

  private transportProvider: transportProvider = new OpendataCHProvider(this.http);
  public currentPoint: Point;

  constructor(private http: Http) { }

  public stationsNearby(): Observable<any | undefined> {
    return this.transportProvider.getStationsNearby(this.currentPoint);
  }

  public closerStationFilter(station: string): Observable<any | undefined> {
    return this.transportProvider.getStationInfo(station);
  }

}

interface transportProvider {
 getStationsNearby(point:Point);
 getStationInfo(station:string);
}

class OpendataCHProvider implements transportProvider {
  private url = 'http://transport.opendata.ch/v1/';

  constructor(private http: Http) {
  }

  public getStationsNearby(point:Point){
      const request:string = 'locations?x='+point.y+'&y='+point.x+'&type=station';
      return this.http.get(this.url+request);
  }

  public getStationInfo(station:string){
      const request:string = 'stationboard?station="'+station+'"&limit=10';
      return this.http.get(this.url+request);
  }
 


}
