import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";

import { LayerType } from "./layer";
import { AbaMap, OptionMap } from "./map";

const LAYER_TYPE_ID: { [id: number]: LayerType } = {
  0: { kind: "square" },
  1: { kind: "city" },
};

@Injectable()
export class MapService {
  private mapsUrl = "https://audiotactile.ovh/proxy/index.php/";
  private divId: Node | string = "map-div";

  constructor(private http: Http) {}

  public add(optionMap: OptionMap): Observable<number> {
    return this.http
      .post(this.mapsUrl, JSON.stringify(optionMap))
      .map((r) => r.json().id);
  }

  public map(id: number): Observable<OptionMap> {
    return this.http
      .get(this.mapsUrl + `maps/${id}`)
      .map((r: Response) => this.build(r.json()));
  }

  public defaultMap(): Observable<OptionMap> {
    const startExtent = {
      xmax: 1105000.0,
      xmin: 780000.0,
      ymax: 6100000.0,
      ymin: 5720000.0,

      spatialReference: {
        wkid: 102100,
      },
    };

    return Observable.create((o) => {
      const om: OptionMap = {
        city: 0,
        extent: JSON.stringify(startExtent),
        height: 800,
        width: 1176,
      };
      om.layerType = { kind: "osm" };
      o.next(om);
    });
  }

  public maps(): Observable<OptionMap[]> {
    return this.http.get(this.mapsUrl + "maps").map((r: Response) => {
      const os = r.json() as OptionMap[];
      return os.map((o) => this.build(o));
    });
  }

  /**
   * Build a complete OptionMap from the basic OptionMap
   */
  private build(optionMap: OptionMap): OptionMap {
    optionMap.layerType = LAYER_TYPE_ID[optionMap.city];
    return optionMap;
  }
}
