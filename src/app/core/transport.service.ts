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

/*
  public getCloserStation(point:Point){
      this.transportProvider.getStations(point).subscribe(
      station => {
        if (station){
          console.log(station.json().stations);
          this.getBusByStation(station.json(),0);
        }
      }
    );
   // console.log(this.transportProvider.getStations(point));
  }
/*
  private getBusByStation(station : any,index : number){
      if(index < station.stations.length)
        this.transportProvider.getStationByBus(station.stations[index].name).subscribe(
              st => {
                  let n = "14";
                  if(st.json().stationboard.some(elem => elem.number == n))
                    console.log(st.json().station);
                  else{
                      setTimeout(() =>this.getBusByStation(station,index+1), 1000)
                      //this.getBusByStation(station,index+1);
                  }              
                }
          )
  }*/




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
