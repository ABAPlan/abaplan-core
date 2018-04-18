import { Injectable } from "@angular/core";
import * as fileSaver from "file-saver";
import * as geoJson from "geojson";
import * as tokml from "tokml";

interface Point {
  name: string | undefined;
  lat: number | undefined;
  lng: number | undefined;
}

@Injectable()
export class KmlService {
  private datas: Point[] = [];
  private lastPoint: Point = {
    lat: undefined,
    lng: undefined,
    name: undefined,
  };
  private isDeletable: boolean = false;

  /** Set current point */
  public currentPoint(longitude: number, latitude: number): void {
    this.lastPoint.lat = latitude;
    this.lastPoint.lng = longitude;
  }

  /** Add Current Point to Datas with a bool of sucess */
  public addCurrentPoint(name: string): boolean {
    if (this.lastPoint.lng === undefined) {
      return false;
    }

    this.datas.push({
      lat: this.lastPoint.lat,
      lng: this.lastPoint.lng,
      name,
    });
    this.emtpylastPoint();
    this.isDeletable = true;
    return true;
  }

  /** Delete Last Point (only once) with a bool of sucess */
  public deletLastPoint(): boolean {
    if (!this.isDeletable) {
      return false;
    }

    this.datas.slice(0, this.datas.length - 2);
    this.isDeletable = false;
    return true;
  }

  /** DownLoad kml file with a bool of sucess */
  public toKml(nameFile: string): boolean {
    if (this.datas.length < 1) {
      return false;
    }

    const geojsonObject = geoJson.parse(this.datas, { Point: ["lng", "lat"] });
    const kmlNameDescription = tokml(geojsonObject, {
      documentName: "Itinerary",
    });

    const file = new Blob([kmlNameDescription], {
      type: "text/kml;charset=utf-8",
    });
    fileSaver.saveAs(file, nameFile + ".kml");
    return true;
  }

  /** Reset all var */
  public endCurrentSession(): void {
    this.datas = [];
    this.emtpylastPoint();
    this.isDeletable = false;
  }

  /** Delete value in the current point */
  private emtpylastPoint() {
    this.lastPoint.lng = undefined;
    this.lastPoint.lat = undefined;
    this.lastPoint.name = undefined;
  }
}
