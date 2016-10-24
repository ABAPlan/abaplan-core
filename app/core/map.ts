import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import Extent = require('esri/geometry/Extent');
import OpenStreetMapLayer = require('esri/layers/OpenStreetMapLayer');

import {AbaLayer, CityBrailleLayer, SquareBrailleLayer, OsmLayer, LayerType} from './layer';

// Enum for the kind of map
export type MapType = City | Square;
interface City { kind: "city"; }
interface Square { kind: "square"; }


export class OptionMap {
  public constructor(
    public uid: number,
    public height: number,
    public width: number,
    public mapType: MapType,
    public extent: string,
    public title?: string,
    public owner?: number,
    public graphics?: string,
    public hash?: string,
    public dateCreation?: string,
  ) {}

}

export class AbaMap extends ArcgisMap {

  private layers: AbaLayer[] = [];

  public uid?: number;
  public title?: string;
  public owner?: number;
  public hash?: string;
  public dateCreation?: string;

  // Create a new fresh instance
  public constructor(divId: Node | string, extent?: Extent) {

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

    this.layers.push(new OsmLayer());
    this.layers.push(new CityBrailleLayer());
    this.layers.push(new SquareBrailleLayer());

    this.setLayerVisible({ kind: 'osm' });

    this.addLayers(this.layers);

  }

  public setLayerVisible(layerType: LayerType) {

    this.layerIds
      .filter( (layerId) => layerId !== layerType.kind)
      .forEach( (layerId) => this.getLayer[layerId].setVisibility(false));

    this.getLayer(layerType.kind).setVisibility(true);

  }

  public static fromOptionMap(divId: Node | string, optionMap: OptionMap): AbaMap {

    const abaMap: AbaMap = new AbaMap(divId, new Extent(optionMap.extent));

    abaMap.uid = optionMap.uid;
    abaMap.height = optionMap.height;
    abaMap.width = optionMap.width;

    abaMap.setLayerVisible(optionMap.mapType);

    abaMap.title = optionMap.title;
    abaMap.owner = optionMap.owner;

    if(optionMap.graphics) {
      const json: any = JSON.parse(optionMap.graphics);
      json.graphics.forEach( (graphic) => abaMap.graphics.add(new Graphic(graphic)));
    }

    abaMap.hash = optionMap.hash;
    abaMap.dateCreation = optionMap.dateCreation;

    return abaMap;

  }
}


/*
export class AbaMapWithInfo extends AbaMap {
// Construct an AbaMap from OptionMap

  private uid: number;
  private title?: string;
  private owner?: number;
  private hash?: string;
  private dateCreation?: string;

  public constructor(divId: Node | string, optionMap: OptionMap) {

    super(divId);
    this.uid = optionMap.uid;
    this.height = optionMap.height;
    this.width = optionMap.width;

    this.setLayerVisible(optionMap.mapType);

    // TODO: convert extent to json
    this.setExtent(new Extent(optionMap.extent));

    this.title = optionMap.title;
    this.owner = optionMap.owner;

    if(optionMap.graphics) {
      const json: any = JSON.parse(optionMap.graphics);
      json.graphics.forEach( (graphic) => this.graphics.add(new Graphic(graphic)));
    }

    this.hash = optionMap.hash;

    this.dateCreation = optionMap.dateCreation;

  }

}


*/










