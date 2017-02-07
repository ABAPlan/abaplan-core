import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {OptionMap, AbaMap } from './map';
import { LayerType } from './layer';


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

  add(optionMap: OptionMap) {


    console.log(optionMap);
    let rep = this.http.post(
      this.mapsUrl, JSON.stringify(optionMap)
    ).toPromise().then(data => console.log(data)).catch( err => console.log( err ));

    console.log(rep);
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
        (r: Response) => this.build(r.json())
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