import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { OptionMap, MapType } from './map';


@Injectable()
export class MapService {

  private mapsUrl = "app/maps";
  private divId: Node | string = 'map-div';

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
    // TODO: compute hash, id, date and return an Observable<OptionMap>
  }

  map(id: number): Observable<OptionMap> {
    return this.http.get(
      this.mapsUrl + `/${id}`).map(
        (r: Response) => r.json().data as OptionMap
    );
  }

  maps(): Observable<OptionMap[]> {
    return this.http.get(this.mapsUrl).map( (r: Response) => r.json().data as OptionMap[] );
  }

  delete(id: number) {}

}