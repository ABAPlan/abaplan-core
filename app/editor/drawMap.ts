import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import Extent = require('esri/geometry/Extent');
import OpenStreetMapLayer = require('esri/layers/OpenStreetMapLayer');

import ArcgisDraw = require('esri/toolbars/draw');
import ArcgisEdit = require('esri/toolbars/edit');

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
  private editEnabled : boolean;

  private drawTypes : { [name:string] : DrawInfo; } = {
    'circle' : new DrawInfoCircle(),
    'polygon' : new DrawInfoPolygon(),
    'line' : new DrawInfoPolyline(),
    'pedestrian' : new DrawInfoPedestrian()
  };

  private edit : ArcgisEdit;

  public constructor(map : ArcgisMap) {
    super(map);
    this.map = map;
    this.edit = new ArcgisEdit(map);

    this.enableDelete(false);
    this.enableEdit(false);

    this.map.graphics.on("click", (e:{graphic:any}) => {
      /** For delete */
      if(this.deleteEnabled){
        // For current release
        if(e.graphic.attributes && e.graphic.attributes.kind){
          this.drawTypes[e.graphic.attributes.kind].delete(this.map, e.graphic);
        }
        // For old release compatibility : pedestrian => to delete in future..
        else if (e.graphic.attributes && e.graphic.attributes.passage_pieton){
          this.drawTypes['pedestrian'].delete(this.map, e.graphic);
        }
        // For old release compatibility : all shapes => to delete in future..
        else {
          this.map.graphics.remove(e.graphic);
        }
      }
      /** For edit */
      if(this.editEnabled){
        if(e.graphic.attributes && e.graphic.attributes.kind){
          // Get the type
          let drawType = this.drawTypes[e.graphic.attributes.kind];
          let editTools : any = drawType.editTools;
          let graphics = this.map.graphics;

          // Get the graphic to edit
          let graphicToEdit : Graphic = drawType.getEditionGraphic(this.map, 
            this.drawGraphicFunction(e.graphic.attributes.kind),
            e.graphic);

            // Activate
          this.edit.activate(editTools, graphicToEdit);
        }
        /*
        // For old release compatibility : pedestrian => to delete in future..
        else if (e.graphic.attributes && e.graphic.attributes.passage_pieton){
          //this.drawTypes['pedestrian'].delete(this.map, e.graphic);
        }
        // For old release compatibility : all shapes  => to delete in future..
        else {
          this.edit.activate(<any>(ArcgisEdit.SCALE | ArcgisEdit.MOVE), e.graphic);
        }
        */
      }
    }
    );

    // On edit desactivate : call finishEdit
    this.edit.on("deactivate", (event: { graphic: Graphic; info: any; tool: string }) => {
      let drawType = this.drawTypes[event.graphic.attributes.kind];
      drawType.finishEdit( 
        this.map,
        this.drawGraphicFunction(event.graphic.attributes.kind),
        event.graphic )
    }); 
  }

  public drawGraphicFunction = (typeKind:string) => {
      console.log("Function with:" + typeKind);
      return (graphic: Graphic) => {
          if(!graphic.attributes) 
            graphic.attributes = {};
          graphic.attributes.kind = /*this.currentEditTypeKind*/typeKind;
          this.map.graphics.add(graphic);
        }
  }; 

  public onDrawComplete(event) {
    // Call draw complete of current draw info
    let currentDrawTypeKind = this.currentDrawTypeKind;
    let graphics = this.map.graphics;

    this.currentDrawInfo.draw(
      // Callback to add graphics
      this.drawGraphicFunction(currentDrawTypeKind),
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

  public enableEdit(enable:boolean) {
    this.editEnabled = enable;
    if(!enable)
      this.edit.deactivate();
  }
}
