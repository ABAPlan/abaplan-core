
import {Component, ViewChild, ElementRef} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MapService } from '../map/map.service';
import { GeoService } from '../core/geo.service';
import { VoiceService } from '../core/voice.service';
import { StateService } from "../core/state.service";
import { KmlService } from "../core/kml.service";
import { OptionMap } from '../map/map';
import { MapComponent } from '../map/map.component';

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

  private readonly zoomLevel: number = 16;
  private readonly layerType : any = {kind: "city"};
  private readonly maxPoints : number = 3;

  test = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    
    private voiceService : VoiceService,
    
    private geoService : GeoService,
    private translateService: TranslateService,

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
      this.voiceService.initialization();
      this.prepareVoiceCommand();
      this.voiceService.say("Salutation voyageur");
    }

     document.onclick = (ev: MouseEvent) => {
        this.voiceService.simulate("Ajoute Jonction");
      //  this.voiceService.simulate("Ajoute Rolle");
      /*if(!this.test)
        window.location.replace('touchpad-voice/285');

     if(this.points.length == 0)
        this.searchAddress("5 fief-de-chapitre");
     if(this.points.length == 1)
          this.searchAddress("boulevard carl-vogt");
     if(this.points.length == 2 && this.test){
        this.printMap();
        this.test = false;
     }*/
     
         
    };
  }

  ngOnInit(): void {
    //Init the Map
    this.mapComponent.getDefaultMap();
    this.mapComponent.setLayerType(this.layerType);
    this.mapComponent.setZoom(this.zoomLevel);
    this.mapComponent.map.disableMapNavigation();
  }

  /* Compute average Point */
  private averagePoint(): Point{
    let lat_av : number = 0;
    let lon_av : number = 0;

    this.points.forEach((point)=>{
         lat_av += point.getLatitude();
         lon_av += point.getLongitude();
    });

    return new Point(lon_av/this.points.length,lat_av/this.points.length);
  }

  /* Check if a point is in the map  */
  private isInMap(point : Point):boolean{
    return this.mapComponent.isInMap(point);
  }

  /* Check if all the points is in the map */
  private pointsInMap():boolean{
      return this.points.every((p)=>this.isInMap(p));
  }

  /* Try to add a new Point */
  private addPoint(address:string){
      this.geoService.point(address).subscribe(
      (searchPoint: Point) => {
        if (searchPoint === undefined){
          this.voiceService.say(this.getStringTranslation("searchKo"));
        }else{
            this.points.push(searchPoint);
            if(this.points.length == 1){
                this.mapComponent.centerMap(searchPoint);
                this.centerPoint = searchPoint;
                this.voiceService.say("Point ajouté");
            }else{
                const average : Point = this.averagePoint();               
                this.mapComponent.centerMap(average);

                if(this.pointsInMap()){
                    this.voiceService.say("Point ajouté");
                    this.centerPoint = average;
                }else{
                    this.voiceService.say("Point non ajouté");
                    this.mapComponent.centerMap(this.centerPoint);
                }
            }
        }
      }
    );
  }

  /* Save the Map in Database */
  private saveMap(title:string){
    this.mapComponent.saveMapWithTitle(title);
  }

  /* Print the map when the update end */
  private printMap(){
    if(!this.mapComponent.mapLoading)
        window.print();
    else
        this.mapComponent.map.onUpdateEnd = () => 
              {
                this.mapComponent.mapLoading = false;
                window.print();
                //At the end load the older UpdateEnd
                this.mapComponent.map.onUpdateEnd = () => this.mapComponent.mapLoading = false;
              };
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

      this.voiceService.addCommand(
        ["Ajoute *"],
        "blablou",
        (i: number, wildcard: string) => this.addPoint(wildcard)
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
