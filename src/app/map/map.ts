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

  public currentLayerVisible : LayerType;
  public onUpdateStart? : () => void;
  public onUpdateEnd? : () => void;

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
    let finalLayers = _.flatten(this.layers.map ( l => l.layers() ));

    this.setLayerVisible({kind:"osm"});

    this.registerUpdateEventsOnLayers();

    this.addLayers(finalLayers);

  }

  // Register update state of each layers
  public registerUpdateEventsOnLayers() {
    this.layers.forEach((layer) => {
      layer.onUpdateStart = () => {
        if(layer.id == this.currentLayerVisible.kind && this.onUpdateStart)
          this.onUpdateStart();
      }
      layer.onUpdateEnd = () => {
        if(layer.id == this.currentLayerVisible.kind && this.onUpdateEnd)
          this.onUpdateEnd();
      }
    })
  }

  public setLayerVisible(layerType: LayerType) {
    // Set current layer visible
    this.currentLayerVisible = layerType;

    this.layers.forEach( 
      (layer) => {
        layer.setVisibility( layerType.kind === layer.id );
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
    else if (optionMap.layerType)
      abaMap.setLayerVisible(optionMap.layerType);
    else
      abaMap.setLayerVisible( {kind: "osm"} );

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
