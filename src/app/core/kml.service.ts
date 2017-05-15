import {Injectable} from "@angular/core";

import * as tokml from 'tokml';
import * as geoJson from 'geojson';
import * as fileSaver from 'file-saver';

interface Point{name:string | undefined,lat:number | undefined,lng:number | undefined};


@Injectable()
export class KmlService {

  private datas : Array<Point> = [];
  private lastPoint : Point = {name:undefined,lat:undefined,lng:undefined};
  private isDeletable : Boolean = false;

  constructor() {
   }

  private emtpylastPoint(){
    this.lastPoint.lng = undefined;
    this.lastPoint.lat = undefined;
    this.lastPoint.name = undefined;
  }

  public currentPoint(name:string,longitude:number,latitude:number):void{
// add check of number Latitudes range from -90 to 90 Longitudes range from -180 to 180.
    this.lastPoint.lat = latitude;
    this.lastPoint.lng = longitude;
    this.lastPoint.name = name;
  }

  public addCurrentPoint():Boolean{
    if(this.lastPoint.lng == undefined)
      return false;

    this.datas.push({name:this.lastPoint.name,lat:this.lastPoint.lat,lng:this.lastPoint.lng});
    this.emtpylastPoint();
    this.isDeletable = true;
    return true;
  }

  public deletLastPoint():Boolean{
    if(!this.isDeletable)
      return false;

    this.datas = this.datas.slice(0,this.datas.length-2);
    this.isDeletable = false;
    return true;
  }

  public toKml():Boolean{
    if(this.datas.length <1)
      return false;

    let geojsonObject = geoJson.parse(this.datas, {Point: ['lat', 'lng']});
    let kmlNameDescription = tokml(geojsonObject, {
          documentName: 'Initeraire'
    });
    //kmlNameDescription
    let file = new Blob([kmlNameDescription], { type: 'text/kml;charset=utf-8' });
    fileSaver.saveAs(file, 'file.kml');
    console.log(kmlNameDescription);
    return true;
  }

  public endCurrentSession():void{
    this.datas = [];
    this.emtpylastPoint();
    this.isDeletable = false;
  }

}
