import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Map, MapType } from './map';

import { LayerService } from './layer.service';
import {LayerType, Osm} from './layer';

import Extent = require('esri/geometry/Extent');
import ArcgisMap = require('esri/map');
import Layer = require("esri/layers/layer");



@Injectable()
export class MapService {

  private mapsUrl = "app/maps";

  constructor(private http: Http, private layerService: LayerService) {
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

  create(domName: string, extent?: Extent): ArcgisMap {

    if(!extent){
      extent = new Extent({
        xmin: 780000.0,
        ymin: 5720000.0,
        xmax: 1105000.0,
        ymax: 6100000.0,
        spatialReference: {
          wkid: 102100
        }
      });
    }

    const options = {
      extent: extent,
      logo: false,
      slider: false,
    };

    const arcgisMap: ArcgisMap = new ArcgisMap(domName, options);

    const layers = [];
    layers.push(this.layerService.createLayer( {kind: "osm"} ));
    layers.push(this.layerService.createLayer( {kind: "city"} ));
    layers.push(this.layerService.createLayer( {kind: "square"} ));

    arcgisMap.addLayers(layers);

    return arcgisMap;

  }

}