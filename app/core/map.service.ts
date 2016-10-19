import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Map, MapType } from './map';

@Injectable()
export class MapService {

  private mapsUrl = "app/maps";

  constructor(private http: Http) {
  }

  add(
    title: string = "",
    height: number,
    width: number,
    mapType: MapType,
    creatorId: number,
    graphics: string = ""
  ) {
    // TODO: compute hash, id, date and return an Observable<Map>
  }

  map(id: number): Observable<Map> {
    return this.http.get(this.mapsUrl + `/${id}`).map( (r: Response) => r.json().data as Map );
  }

  maps(): Observable<Map[]> {
    return this.http.get(this.mapsUrl).map( (r: Response) => r.json().data as Map[] );
  }

  delete(id: number) {}


}