import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {OptionMap, AbaMap } from './map';
import { LayerType } from './layer';
import Sqlite = require('sqlite');

@Injectable()
export class MapService {

  private mapsUrl = "app/maps";
  private divId: Node | string = 'map-div';
  private database: any;

  constructor(private http: Http) {

    (new Sqlite("audiotaczhadmin")).then(db => {
        this.database = db;
     }, error => {
          console.log("OPEN DB ERROR", error);
     });
  }

  add(abaMap: AbaMap) {
    /*
    SQL lite with angular 2
     Comment (JCA) : All these attributes could be access from AbaMap (extending ArcgisMap)

     title: string = "",
     height: number,
     width: number,
     layerType: LayerType,
     creatorId: number,
     graphics: string = ""
     esri this.graphics
     )
     */
     var pub= 1; //??????
     var city = 0;

     var jsonGraph ="";
     var i = 0;
     while(typeof abaMap.graphics[i] !== 'undefined'){
       i++;
       jsonGraph += abaMap.graphics[i].ToJson;
     }

     var insert = "INSERT INTO people (uid,creatorId,public,title,width,height,extent,hash,graphics,city,creationDate) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
     this.database.execSQL(insert, [abaMap.uid,abaMap.owner,pub,abaMap.title,abaMap.width,abaMap.height,abaMap.extent,abaMap.hash,jsonGraph,city,abaMap.dateCreation]).then(id => {
           console.log("INSERT OK", id);
       }, error => {
           console.log("INSERT ERROR", error);
       });
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
