import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import Extent = require('esri/geometry/Extent');
import OpenStreetMapLayer = require('esri/layers/OpenStreetMapLayer');

import ArcgisDraw = require('esri/toolbars/draw');

import {DrawInfo,
        DrawInfoPedestrian,
        DrawInfoPolyline,
        DrawInfoPolygon,
        DrawInfoCircle} from './draw'

interface CircleDrawType { kind: 'circle' }
interface PolygonDrawType { kind: 'polygon' }
interface LineDrawType { kind: 'line' }
interface PedestrianDrawType { kind: 'pedestrian' }

export type DrawType =
  ( CircleDrawType  |
    PolygonDrawType |
    LineDrawType    |
    PedestrianDrawType);

export class AbaDraw extends ArcgisDraw {
  private map : ArcgisMap;
  private currentDrawInfo : DrawInfo;

  private drawTypes : { [name:string] : DrawInfo; } = {
    'circle' : new DrawInfoCircle(),
    'polygon' : new DrawInfoPolygon(),
    'line' : new DrawInfoPolyline(),
    'pedestrian' : new DrawInfoPedestrian()
  };

  public constructor(map : ArcgisMap) {
    super(map);
    this.map = map;
  }

  public onDrawComplete(event) {
    this.currentDrawInfo.drawComplete(this.map, event);
  }

  public setEditableMode(editableMode : boolean) {
    // Default draw type
    this.currentDrawInfo = this.drawTypes['circle']; // TODO: fix bug circle first cause bug...

    if(editableMode){
      this.activate(this.currentDrawInfo.geometryType);
    }
    else{
      this.deactivate();
    }
  }

  public setDrawType(drawType : DrawType) {
    this.currentDrawInfo = this.drawTypes[drawType.kind];
    this.activate(this.currentDrawInfo.geometryType);
  }
}
