import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { OptionMap, AbaMap } from './map';
import { LayerType } from './layer';
import { MapService } from './map.service';
import ArcgisSearch = require('esri/dijit/Search');
const img_loading = require("file?name=./assets/img/[name].[ext]!./assets/img/spin.gif");

import 'rxjs/add/operator/toPromise';
import Extent = require("esri/geometry/Extent");
import Graphic = require("esri/graphic");
import Layer = require("esri/layers/layer");
import Point = require("esri/geometry/Point");

import * as br from 'braille';


@Component({
  selector: 'aba-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  //optionMaps: OptionMap[];
  map : AbaMap;
  search: ArcgisSearch;

  mapLoading : boolean = false;
  imgLoading : string = img_loading;

  needZoom : boolean = false;

  @Output() onMapInstancied: EventEmitter<OptionMap> = new EventEmitter();
  @Input() searchable: boolean = true;

  readonly ZOOM_LEVEL_MINIMUM : number = 16;

  mapZoom = "";

  constructor(private mapService: MapService) {
  }

  getDefaultMap(): void {
    this.mapService
      .defaultMap()
      .subscribe(
        optionMap => {
          console.log(optionMap);
          this.initMap(optionMap);
        }
      );
  }

  ngOnInit(): void {
  }

  setLayerType(layerType : LayerType): boolean {
    if (this.map){
      this.map.setLayerVisible(layerType);
      return true;
    }
    return false;
  }

  setZoom(zoom:number):boolean{
    this.map.setZoom(zoom);
    return true;
  }

  isInMap(point : Point):boolean{
    return this.map.extent.contains(point);
  }

  centerMap(point : Point):boolean{
    this.map.centerAt(point);
    return true;
  }

  resetInfos():void{
    this.map.uid = undefined;
    this.map.title = undefined;
    this.map.owner = undefined;
    this.map.hash = undefined;
    this.map.creationDate = undefined;
  }

  private getBrailleTitle () : string{
    if(this.map.title)
      return br.toBraille(this.map.title);
    else
      return "";
  }

  private getBrailleId () : string{
    if(this.map.uid)
      return br.toBraille(String(this.map.uid));
    else
      return "";
  }

  initMap(optionMap: OptionMap, layerType? : LayerType): void {

    this.map = AbaMap.fromOptionMap("esri-map", optionMap, layerType);
    this.applyDefaultCallbackToTheMap();

    if (this.searchable){
      this.search = new ArcgisSearch(
        {
          map: this.map,
          /* useMapExtent:false, */
          enableHighlight: false,
        }, "search"
      );


       /* hack for fix placeholder
       * get the object and replace with emtpy string
       *  (pj) Issue #90
       */
      const s = this.search.sources;
      s[0].placeholder = "";
      this.search.set("sources", s);

    }

    this.checkNeedZoom();
    this.onMapInstancied.emit(optionMap);
  }

  private applyDefaultCallbackToTheMap(): void {
    this.map.onUpdateStart = () => this.mapLoading = true;
    this.map.onUpdateEnd = () => this.mapLoading = false;

    // Zoom restriction
    this.map.on("zoom-end", () => this.checkNeedZoom());
  }


  // Show or hide 'need zoom' message
  public checkNeedZoom(): boolean{
    this.needZoom = (this.map.getLevel() < this.ZOOM_LEVEL_MINIMUM);
    if(this.mapLoading)
      this.mapLoading = false;
    return this.needZoom;
  }

  public selectMapId(id: number): void {
    this.mapService.map(id).subscribe(
      optionMap => {

        // Fixed: Must destroy before attributing a new instance
        this.map.destroy();
        this.map = AbaMap.fromOptionMap("esri-map", optionMap);
        this.checkNeedZoom();

        // Call onMapInstancied event to prevent others components of new map
        this.onMapInstancied.emit(optionMap);

        this.applyDefaultCallbackToTheMap();

        if (optionMap.layerType){
          this.setLayerType(optionMap.layerType);
        }else{
          this.setLayerType( {kind: "osm"});
        }

      }
    );
  }

  public saveMapWithTitle(title: string): void {
    this.map.title = title;
    this.mapService.add(this.map.toOptionMap()).subscribe( i => this.map.uid = i );
  }

}
