import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {OptionMap, AbaMap } from './map';
import { LayerType } from './layer';


@Injectable()
export class MapService {

  //private mapsUrl = "app/maps";
  private mapsUrl = "https://audiotactile.ovh/proxy/index.php/";
  private divId: Node | string = 'map-div';

  constructor(private http: Http) {
  }

  add(abaMap: AbaMap) {
    /*

     Comment (JCA) : All these attributes could be access from AbaMap (extending ArcgisMap)

     title: string = "",
     height: number,
     width: number,
     layerType: LayerType,
     creatorId: number,
     graphics: string = ""
     )
     */

  }

  map(id: number): Observable<OptionMap> {
    return this.http.get(
      this.mapsUrl + `maps/${id}`).map(
        (r: Response) => r.json() as OptionMap
    );
  }

  maps(): Observable<OptionMap[]> {
    return this.http.get(this.mapsUrl + 'maps').map( (r: Response) => r.json() as OptionMap[] );
  }

  delete(id: number) {}

}