import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import SimpleLineSymbol = require('esri/symbols/SimpleLineSymbol');
import PictureFillSymbol = require('esri/symbols/PictureFillSymbol');
import SimpleFillSymbol = require('esri/symbols/SimpleFillSymbol');
import Symbol = require('esri/symbols/Symbol');
import Color = require('esri/Color');
import Polygon = require('esri/geometry/Polygon');
import Draw = require('esri/toolbars/draw');
import Edit = require('esri/toolbars/edit');
import GeometryEngine = require('esri/geometry/geometryEngine');
import Polyline = require('esri/geometry/Polyline');
import SpatialReference = require('esri/SpatialReference');
import * as _ from "lodash";

//import * as Vector from '../core/vector2d';
import { Vector2d, subVec, addVec, norm, multVec, perp, clone } from '../core/vector2d';

export type DrawGraphic = (graphic: Graphic) => void;

export interface DrawInfo {
  // Geometry to draw when user create the geometry
  geometryType : string; 

  // Possible edit tools like <any>(ArcgisEdit.SCALE | ArcgisEdit.MOVE)
  editTools : any; 

  draw(drawGraphic : DrawGraphic, event) : void;
  delete(map : ArcgisMap, clickedGraphic : Graphic) : void;
  getEditionGraphic(map : ArcgisMap, drawGraphic : DrawGraphic, clickedGraphic : Graphic) : Graphic;
  finishEdit(map : ArcgisMap, drawGraphic : DrawGraphic, graphic : Graphic) : void;
};

/**
 * Base class for basic geometry type
 */
export class DrawInfoBasicGeometry implements DrawInfo{
  private symbol : Symbol;
  public geometryType : string;
  public editTools : any;

  constructor(geometryType : string, symbol: Symbol, editTools : any) {
    this.geometryType = geometryType;
    this.symbol = symbol;
    this.editTools = editTools;
  }

  draw(drawGraphic : DrawGraphic, event) {
    console.log(event.geometry);
    console.log(this.symbol);
    drawGraphic(new Graphic(event.geometry, this.symbol));
  }

  delete(map : ArcgisMap, clickedGraphic : Graphic) : void {
    map.graphics.remove(clickedGraphic);
  }

  getEditionGraphic(map : ArcgisMap, drawGraphic : DrawGraphic, clickedGraphic : Graphic) : Graphic {
    return clickedGraphic;
  }

  finishEdit(map : ArcgisMap, drawGraphic : DrawGraphic, graphic : Graphic) {}
}

export class DrawInfoCircle extends DrawInfoBasicGeometry {
    constructor(color? : Color){
        if(!color)
            color = new Color([0, 0, 0, 1]);

        super(Draw.CIRCLE,
              new SimpleFillSymbol(
                  SimpleFillSymbol.STYLE_SOLID,
                  null,
                  color),
              <any>(Edit.SCALE | Edit.MOVE)
        );
    }
}

export class DrawInfoPolyline extends DrawInfoBasicGeometry {
    constructor(color? : Color){
        if(!color)
            color = new Color([0, 0, 0, 1]);

        super(Draw.POLYLINE,
              new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_LONGDASH,
                  color,
                  3
              ),
              <any>(Edit.SCALE | Edit.MOVE | Edit.ROTATE | Edit.EDIT_VERTICES) 
        );
    }
}

export class DrawInfoPolygon extends DrawInfoBasicGeometry {
    constructor(color? : Color){
        if(!color)
            color = new Color([0, 0, 0, 1]);

        super(Draw.POLYGON,
              new SimpleFillSymbol(
                  SimpleFillSymbol.STYLE_SOLID,
                  null,
                  color),
              <any>(Edit.SCALE | Edit.MOVE | Edit.ROTATE | Edit.EDIT_VERTICES | Edit.ROTATE) 
        );
    }
}

export class DrawInfoPedestrian implements DrawInfo {
  public geometryType : string = Draw.LINE;
  public pedestrianFillSize : number = 20;
  public editTools : any = <any>(Edit.MOVE | Edit.SCALE | Edit.EDIT_VERTICES) ;
  readonly pedestrianWidth : number = 5;

  constructor() {

  }

  draw(drawGraphic : DrawGraphic, event) {
    var A = {x:0, y:0};
    A.x = event.geometry.paths[0][0][0];
    A.y = event.geometry.paths[0][0][1];

    var B = { x: 0, y: 0 };
    B.x = event.geometry.paths[0][1][0];
    B.y = event.geometry.paths[0][1][1];

    this.createPedestrianPathway(A, B, event.geometry.spatialReference, drawGraphic);
  }


  /** This feature draw a pedetrian pathway on the map
   *  (jca)
   */
  createPedestrianPathway (origin, destination, spatialRef, drawGraphic : DrawGraphic) {
    let idPedestrianPathway = {origin:origin, destination:destination};

    let A: Vector2d = clone(origin);
    let B: Vector2d = clone(destination);

    const AB: Vector2d = subVec(B, A);
    const perpAB: Vector2d = perp(AB);

    const lengthAB = norm(AB);
    const lengthPerpAB = norm(perpAB);

    let nbIter = Math.max(3, Math.floor( lengthAB / 2.5 ));
    nbIter = nbIter % 2 == 0 ? nbIter+1 : nbIter;

    const unitPerpAB = multVec(this.pedestrianWidth/lengthPerpAB, perpAB);
    const unitAB = multVec(1/nbIter, AB);

    let A_ = clone(A);

    _.range(nbIter).forEach(
      index => {

        let C1 = subVec(A_, unitPerpAB);
        let C2 = addVec(A_, unitPerpAB);
        A_ = addVec(A_, unitAB);
        let C3 = addVec(A_, unitPerpAB);
        let C4 = subVec(A_, unitPerpAB);

        const geometry: Polygon = new Polygon([[C1.x, C1.y], [C2.x, C2.y], [C3.x, C3.y], [C4.x, C4.y]]);
        geometry.setSpatialReference(spatialRef);

        const symbol = (index+1) % 2 ?
          new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([0, 0, 0, 1])) :
          new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([255, 255, 255, 1]));

        drawGraphic(new Graphic(geometry, symbol, {
          "id" : idPedestrianPathway
        }));
      }
    );
  }
  
  delete(map : ArcgisMap, clickedGraphic : Graphic) : void {
    // Get all graphics with same id
    let graphicsToDelete : Graphic[] = 
      this.getListGraphics(map.graphics.graphics, clickedGraphic);

    this.deleteGraphics(map, graphicsToDelete);
  }

  deleteGraphics(map : ArcgisMap, graphicsToDelete : Graphic[]) : void {
    for (let g of graphicsToDelete)
      map.graphics.remove(g);
  }

  getEditionGraphic(map : ArcgisMap, drawGraphic : DrawGraphic, clickedGraphic : Graphic) : Graphic {
    let graphics : Graphic[] = 
      this.getListGraphics(map.graphics.graphics, clickedGraphic);
    this.deleteGraphics(map, graphics);

    let ori = clickedGraphic.attributes.id.origin;
    let dest = clickedGraphic.attributes.id.destination;
    let polyline = new Polyline(new SpatialReference({wkid:102100}));
    polyline.addPath([[ori.x, ori.y], [dest.x, dest.y]]);

    let editionGraphic =  new Graphic(
      polyline, 
      new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 1]), 
              this.pedestrianWidth)
    );
    drawGraphic(editionGraphic);
   
    return editionGraphic;
  }

  /** Return all graphics of the map wich have same graphic of clickedGraphic 
   */
  getListGraphics(graphicsMap : Graphic[], clickedGraphic : Graphic) : Graphic[] {
    let graphics : Graphic[] = [];
    for (let g of graphicsMap) {
      if (g && g.attributes && clickedGraphic && clickedGraphic.attributes
        && g.attributes.id == clickedGraphic.attributes.id){
        graphics.push(g);
      }
    }
    return graphics;
  }

  finishEdit(map : ArcgisMap, drawGraphic : DrawGraphic, graphic : Graphic) {
    console.log("finishEdit");
    let polyline : Polyline = <Polyline> graphic.geometry; 
    let ori = {x:polyline.paths[0][0][0], y:polyline.paths[0][0][1]};
    let dest = {x:polyline.paths[0][1][0], y:polyline.paths[0][1][1]};
    this.createPedestrianPathway(ori, dest, graphic.geometry.spatialReference, drawGraphic );
    map.graphics.remove(graphic);
  }
}
