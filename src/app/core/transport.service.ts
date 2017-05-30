import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import Point = require('esri/geometry/Point')


@Injectable()
export class TransportService {

  private transportProvider: transportProvider = new OpendataCHProvider(this.http);

  constructor(private http: Http) { }

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

  private getBusByStation(station : any,index : number){
      if(index < station.stations.length)
        this.transportProvider.getStationByBus(station.stations[index].name).subscribe(
              st => {
                  let n = "14";
                  if(st.json().stationboard.some(elem => elem.number == n))
                    console.log(st.json().station/*.coordinate*/);
                  else{
                      setTimeout(() =>this.getBusByStation(station,index+1), 1000)
                      //this.getBusByStation(station,index+1);
                  }
                   
                }
          )
  }




}

interface transportProvider {
 getStations(point:Point);
 getStationByBus(station:string);
}

class OpendataCHProvider implements transportProvider {
  private url = 'http://transport.opendata.ch/v1/';

  constructor(private http: Http) {

  }

  public getStations(point:Point){
      const request:string = 'locations?x='+point.y+'&y='+point.x+'&type=station';
      return this.http.get(this.url+request);
  }

  public getStationByBus(station:string){
      const request:string = 'stationboard?station="'+station+'"&limit=10';
      return this.http.get(this.url+request);
  }
 


}
