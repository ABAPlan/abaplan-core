import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {OptionMap, AbaMap } from './map';
import { LayerType } from './layer';
import 'rxjs/add/operator/toPromise';

const LayerTypeId: { [id: number]: LayerType } = {
  0: { kind: "square" },
  1: { kind: "city" }
};

@Injectable()
export class MapService {

  //private mapsUrl = "app/maps";
  private mapsUrl = "https://audiotactile.ovh/proxy/index.php/";
  private divId: Node | string = 'map-div';

  constructor(private http: Http) {
  }

  add(optionMap: OptionMap): Observable<number> {

    return this.http.post(
      this.mapsUrl, JSON.stringify(optionMap)
    ).map( r => r.json().id );

  }

  map(id: number): Observable<OptionMap> {
    return this.http.get(
      this.mapsUrl + `maps/${id}`).map(
        (r: Response) => this.build(r.json())
    );
  }

  defaultMap(): Observable<OptionMap> {
    const startExtent = {
      xmin: 780000.0,
      ymin: 5720000.0,
      xmax: 1105000.0,
      ymax: 6100000.0,

      spatialReference: {
        wkid: 102100
      }
    };

    return Observable.create(
      o => {
        const om = new OptionMap(800, 1176, 0, JSON.stringify(startExtent));
        om.layerType = { kind: "osm" };
        o.next(om)
      }
    );
  }

  maps(): Observable<OptionMap[]> {
    return this.http.get(this.mapsUrl + 'maps').map( (r: Response) => {
      let os = r.json() as OptionMap[]
      return os.map(o => this.build(o) );
    } );
  }

  delete(id: number) {}

  /**
   * Build a complete OptionMap from the basic OptionMap
   */
  private build(optionMap: OptionMap): OptionMap {
    optionMap.layerType = LayerTypeId[optionMap.city];
    return optionMap;
  }
}