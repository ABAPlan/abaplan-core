import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {OptionMap, AbaMap } from './map';
import { LayerType } from './layer';
var sqlite3 = require('sqlite3').verbose();


@Injectable()
export class MapService {

  private mapsUrl = "app/maps";
  private divId: Node | string = 'map-div';
  private db: any;

  constructor(private http: Http) {
    this.db = new sqlite3.Database(':memory:');
    this.db.run("CREATE TABLE `maps` ( `uid` INTEGER PRIMARY KEY AUTOINCREMENT, `creatorId` INTEGER, `public` INTEGER, `title` TEXT, `width` INTEGER, `height` INTEGER, `extent` TEXT, `hash` TEXT, `graphics` TEXT, `city` INTEGER, `creationDate` TEXT );");
  }

  add(abaMap: AbaMap) {
     //Const
     const pub= 1;
     const city = 0;

     //Graph Json to String
     let jsonGraph ="";
     abaMap.graphics.graphics.forEach((graphic) => jsonGraph+=graphic.toJson());

     let stmt = this.db.prepare("INSERT INTO people (uid,creatorId,public,title,width,height,extent,hash,graphics,city,creationDate) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
     stmt.run(abaMap.uid,abaMap.owner,pub,abaMap.title,abaMap.width,abaMap.height,abaMap.extent,abaMap.hash,jsonGraph,city,abaMap.dateCreation);
     stmt.finalize();
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
