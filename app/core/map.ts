import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import Extent = require('esri/geometry/Extent');
import OpenStreetMapLayer = require('esri/layers/OpenStreetMapLayer');
import * as _ from "lodash";

/*
import {AbaDraw, DrawType} from '../editor/drawMap';
import {DrawInfo,
        DrawInfoPedestrian,
        DrawInfoPolyline,
        DrawInfoPolygon,
        DrawInfoCircle} from '../editor/draw'
public setEditableMode(editableMode : boolean){
  this.draw.setEditableMode(editableMode);
}

public setDrawType(drawType : DrawType){
  this.draw.setDrawType(drawType);
}*/

import {AbaLayer, CityBrailleLayer, SquareBrailleLayer, OsmLayer, LayerType, Osm, StairsBrailleLayer} from './layer';

export class OptionMap {
  public constructor(
    public uid: number,
    public height: number,
    public width: number,
    public layerType: LayerType,
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
    this.layers.push(new SquareBrailleLayer());
    this.layers.push(new CityBrailleLayer());
    this.layers.push(new StairsBrailleLayer());

    this.addLayers(this.layers);

    this.setLayerVisible({kind:"osm"});
  }

  public setLayerVisible(layerType: LayerType) {
    this.layers
      .forEach( (layer) => {
          console.log(layer.id + ": " + _.includes(layer.id, layerType.kind));
          layer.setVisibility(_.includes(layer.id, layerType.kind));
      }
      );
  }

  public static fromOptionMap(divId: Node | string, optionMap: OptionMap): AbaMap {

    const abaMap: AbaMap = new AbaMap(divId, new Extent(JSON.parse(optionMap.extent)));

    abaMap.uid = optionMap.uid;
    abaMap.height = optionMap.height;
    abaMap.width = optionMap.width;

    abaMap.setLayerVisible(optionMap.layerType);

    abaMap.title = optionMap.title;
    abaMap.owner = optionMap.owner;

    if(optionMap.graphics) {
      const json: any = JSON.parse(optionMap.graphics);
      json.forEach( (graphic) => abaMap.graphics.add(new Graphic(graphic)));
    }

    abaMap.hash = optionMap.hash;
    abaMap.dateCreation = optionMap.dateCreation;

    return abaMap;
  }
}
