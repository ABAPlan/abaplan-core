import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import Extent = require('esri/geometry/Extent');
import OpenStreetMapLayer = require('esri/layers/OpenStreetMapLayer');
import * as _ from "lodash";

import {RootLayer, CityRootBrailleLayer, SquareRootBrailleLayer, OsmRootLayer, LayerType, Square, City} from './layer';
import Layer = require("esri/layers/layer");

export class OptionMap {
  public constructor(
    public height: number,
    public width: number,
    public city: number,
    public extent: string,
    public uid?: number,
    public title?: string,
    public owner?: number,
    public graphics?: any,
    public hash?: string,
    public creationDate?: string,
    public layerType?: LayerType
  ) {}

}

export class AbaMap extends ArcgisMap {

  private layers: RootLayer[] = [];

  public uid?: number;
  public title?: string;
  public owner?: number;
  public hash?: string;
  public creationDate?: string;

  // Create a new fresh instance
  public constructor(divId: Node | string, extent?: Extent, layerType? : LayerType) {

    super(divId, { logo: false, slider: false });

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

    this.setExtent(extent);

    this.layers.push(new OsmRootLayer());
    this.layers.push(new SquareRootBrailleLayer());
    this.layers.push(new CityRootBrailleLayer());

    this.addLayers(_.flatten(this.layers.map ( l => l.layers() )));

    this.setLayerVisible({kind:"osm"});

    this.layers
      .forEach( (layer) => {
          layer.on("update", (evt:{layer:Layer; }) => 
            console.log("updatelayer")
          );
          layer.on("update-start", (evt:any) => {
            console.log("startlayer");
          });
          layer.on("update-end", (evt:any) => {
            console.log("endlayer");
          });
          layer.on("resume", (evt:any) => {
            console.log("resumelayer");
          });
          layer.on("suspend", (evt:any) => {
            console.log("supsendlayer");
          });
          layer.on("load", (evt:any) => {
              console.log("layerLoaded");
          });
          layer.on("error", (evt:any) => {
              console.log("errorlayer");
          });
          layer.on("visibility-change", (evt:any) => {
              console.log("visibilitylayer");
          });
          layer.on("refresh-interval-change", (evt:any) => {
              console.log("visibilitylayer");
          });
        }
      );
  }

  public setLayerVisible(layerType: LayerType) {
    this.layers
      .forEach( (layer) => {
              
        if(layerType.kind === layer.id){
          layer.show();

        }else{
          layer.hide();
          layer.suspend();
        }       
      }
      );
  }

  public static fromOptionMap(divId: Node | string, optionMap: OptionMap, layerType? : LayerType): AbaMap {

    const abaMap: AbaMap = new AbaMap(divId, new Extent(JSON.parse(optionMap.extent)));

    abaMap.uid = optionMap.uid;
    abaMap.height = optionMap.height;
    abaMap.width = optionMap.width;

    if(layerType)
      abaMap.setLayerVisible(layerType);
    else
      abaMap.setLayerVisible(optionMap.layerType);

    abaMap.title = optionMap.title;
    abaMap.owner = optionMap.owner;

    if(optionMap.graphics) {
      const json: any = JSON.parse(optionMap.graphics);
      json.forEach( (graphic) => abaMap.graphics.add(new Graphic(graphic)));
    }

    abaMap.hash = optionMap.hash;
    abaMap.creationDate = optionMap.creationDate;

    return abaMap;
  }

  public toOptionMap(): OptionMap {

    let optionMap: OptionMap = new OptionMap(this.height, this.width, 0, this.extent.toJson());
    optionMap.title = this.title;

    let graphics = this.graphics.graphics.filter( g => g.symbol !== undefined).map( g => g.toJson() );
    optionMap.graphics = graphics;

    if ( this.isCityMap() ) {
      optionMap.city = 1;
    } else {
      optionMap.city = 0;
    }

    return optionMap;
  }

  public isCityMap(): boolean {
    return this.layers.some( (l: RootLayer) => l.layers().some( (l: Layer) => l.id === 'city' && l.visible));
  }
}
