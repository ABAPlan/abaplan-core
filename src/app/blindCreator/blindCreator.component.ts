
import {Component, ViewChild, ElementRef} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MapService } from '../map/map.service';
import { GeoService } from '../core/geo.service';
import { VoiceService } from '../core/voice.service';
import { StateService } from "../core/state.service";
import { KmlService } from "../core/kml.service";
import { OptionMap } from '../map/map';
import { MapComponent } from '../map/map.component'

import WebMercatorUtils = require('esri/geometry/webMercatorUtils');
import Geometry = require('esri/geometry/Geometry');
import Point = require('esri/geometry/Point')
import Graphic = require("esri/graphic");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import {Vector2d, Plane2d, transform} from '../core/vector2d';
import LatLng = google.maps.LatLng;
import Multipoint = require("esri/geometry/Multipoint")

import {TranslateService} from "ng2-translate";
import {ScalarObservable} from 'rxjs/observable/ScalarObservable';

interface translations  {value : string};

@Component({
  selector: 'aba-blindCreator',
  templateUrl: 'blindCreator.component.html',
  styleUrls: ['blindCreator.component.css'],
  providers : []
})
export class BlindCreatorComponent {
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  private points:Array<Point> = new Array<Point>();
  private centerPoint : Point;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private voiceService : VoiceService,
    private stateService : StateService,
    private geoService : GeoService,
    private translateService: TranslateService,
    private kmlService: KmlService,
    private _elementRef: ElementRef
  ){

    /**Init the voice commands and start calibration
    *
    * Can't be directly in the constructor beacause of
    * compatibity with voice Commands (library can't charge voice early)
    * Hack with onReady callback to be call after
    * init of page
    *  (pj)
    */
    document.onreadystatechange= () => {
     // this.voiceService.initialization();
    //  this.prepareVoiceCommand();
      //this.voiceService.say(this.getStringTranslation("touchpadCenter"));
    }

     document.onclick = (ev: MouseEvent) => {
     if(this.points.length == 0)
        this.searchAddress("5 fief-de-chapitre");
     if(this.points.length == 1)
          this.searchAddress("Avenue de la jonction");
      if(this.points.length == 2)
         this.searchAddress("Rolle");
    };
  }

  ngOnInit(): void {
    this.mapComponent.getDefaultMap();
    this.mapComponent.setLayerType({kind: "city"});
    this.mapComponent.setZoom(16);
    this.mapComponent.map.disableMapNavigation();
  }

  private averagePoint(): Point{
    let lat_av : number = 0;
    let lon_av : number = 0;

     this.points.forEach((point)=>{
         lat_av += point.getLatitude();
         lon_av += point.getLongitude();
    });

    return new Point(lon_av/this.points.length,lat_av/this.points.length);
  }

  private isInMap(point : Point):boolean{
    return this.mapComponent.isInMap(point);
  }

  private pointsInMap():boolean{
      return this.points.every((p)=>this.isInMap(p));
  }

  private searchAddress(address:string){
      this.geoService.point(address).subscribe(
      (searchPoint: Point) => {
        if (searchPoint === undefined){
          this.voiceService.say(this.getStringTranslation("searchKo"));
        }else{
            this.points.push(searchPoint);
            if(this.points.length == 1){
                this.mapComponent.centerMap(searchPoint);
                this.centerPoint = searchPoint;
            }else{
                const average : Point = this.averagePoint();               
                this.mapComponent.centerMap(average);

                if(this.pointsInMap()){
                    console.log("ok");
                    this.centerPoint = average;
                    // message OK
                }else{
                    console.log("ko");
                    this.mapComponent.centerMap(this.centerPoint);
                    // message KO
                }
            }
        }
      }
    );
  }

  private saveMap(title:string){
    this.mapComponent.saveMapWithTitle(title);
  }


  /** Change language of application */
  private changeLang(langTranslate : string,langVoice : string):void{
        this.translateService.use(langTranslate);
        this.voiceService.changeLang(langVoice);
  }

  /** Add Commands */
  private prepareVoiceCommand() {
    // Loop for add command in each lang of application
    let langs = this.translateService.getLangs();
    for(let entry of langs){
      this.translateService.use(entry);
      let codeVoice = this.getStringTranslation("codeLangVoice");

      // Switch Lang command
      this.voiceService.addCommand(
        [this.getStringTranslation("myLang")],
        this.getStringTranslation("codeLang"),
        () => this.changeLang(entry,codeVoice)
      );

    }
    this.translateService.use(this.translateService.getBrowserLang());
  }

  /** Return string by id and current lang of application */
  private getStringTranslation(s: string) : string {
    return (this.translateService.get(s)as ScalarObservable<string>).value;
  }

  /** Return array of string by id and current lang of application */
  private getStringTranslations(s: string) : Array<string> {
    return  (this.translateService.get(s)as ScalarObservable<Array<translations>>).value.map(object => object.value);

  }
}
