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

import {RootLayer, CityRootBrailleLayer, SquareRootBrailleLayer, OsmRootLayer, LayerType, Square, City} from './layer';

const LayerTypeId: { [id: number]: LayerType } = {
  0: { kind: "square" },
  1: { kind: "city" }
};

export class OptionMap {
  public constructor(
    public uid: number,
    public height: number,
    public width: number,
    public city: number,
    public extent: string,
    public title?: string,
    public owner?: number,
    public graphics?: string,
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

    this.layers.push(new OsmRootLayer());
    this.layers.push(new SquareRootBrailleLayer());
    this.layers.push(new CityRootBrailleLayer());

   // this.layers.push(new RailroadBrailleLayer());
    //this.layers.push(new StairsBrailleLayer());

    this.addLayers(_.flatten(this.layers.map ( l => l.layers() )));

    this.setLayerVisible({kind:"osm"});
  }

  public setLayerVisible(layerType: LayerType) {
    console.log(layerType);
    this.layers
      .forEach( (layer) => {
          layer.setVisibility( layerType.kind === layer.id );
      }
      );
  }

  public static fromOptionMap(divId: Node | string, optionMap: OptionMap): AbaMap {

    console.log(optionMap);
    const abaMap: AbaMap = new AbaMap(divId, new Extent(JSON.parse(optionMap.extent)));

    abaMap.uid = optionMap.uid;
    abaMap.height = optionMap.height;
    abaMap.width = optionMap.width;

    console.log(optionMap.city);
    optionMap.layerType = LayerTypeId[optionMap.city];
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
}
