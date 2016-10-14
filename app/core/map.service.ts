import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Map, MapType } from './map';

@Injectable()
export class MapService {

  constructor(private http: Http) {
  }

  addMap(
    title: string = "",
    height: number,
    width: number,
    mapType: MapType,
    creatorId: number,
    graphics: string = ""
  ) {
    // TODO: compute hash, id, date and return an Observable<Map>
  }

  map(id: number) {

  }

  maps() {

  }


}