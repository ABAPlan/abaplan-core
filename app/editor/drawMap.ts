import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import Extent = require('esri/geometry/Extent');
import OpenStreetMapLayer = require('esri/layers/OpenStreetMapLayer');

import ArcgisDraw = require('esri/toolbars/draw');
import {DrawGraphic,
        DrawInfo,
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
  private currentDrawTypeKind : string; // Remember the string key of drawTypes[]
  private deleteEnabled : boolean;
  
  private drawTypes : { [name:string] : DrawInfo; } = {
    'circle' : new DrawInfoCircle(),
    'polygon' : new DrawInfoPolygon(),
    'line' : new DrawInfoPolyline(),
    'pedestrian' : new DrawInfoPedestrian()
  };

  public constructor(map : ArcgisMap) {
    super(map);
    this.map = map;

    this.enableDelete(false);

    this.map.graphics.on("click", (e:{graphic:any}) => {
      //this.edit.activate(ArcgisEdit.MOVE, e.graphic);
      //this.edit.activate(ArcgisEdit.EDIT_VERTICES, e.graphic);

      if(this.deleteEnabled){
        if(e.graphic.attributes && e.graphic.attributes.kind){
          console.log(e.graphic.attributes.kind);
          this.drawTypes[e.graphic.attributes.kind].delete(this.map, e.graphic);
        }
      }
    }
    );
  }

  public onDrawComplete(event) {
    // Call draw complete of current draw info
    this.currentDrawInfo.drawComplete(
      // Callback to add graphics
      ( graphic: Graphic ) => {
        if(!graphic.attributes) 
          graphic.attributes = {};
        graphic.attributes.kind = this.currentDrawTypeKind;
        this.map.graphics.add(graphic);
      }, 
      event);
  }

  public disable() {
    this.deactivate();
  }

  public enable(drawType : DrawType) {
    let kind : string = drawType.kind;
    this.currentDrawTypeKind = kind;
    this.currentDrawInfo = this.drawTypes[kind];
    this.activate(this.currentDrawInfo.geometryType);
  }

  public enableDelete(enable:boolean) {
    this.deleteEnabled = enable;
  }
}
