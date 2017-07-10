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
  onLoad(graphics : Graphic[]) : void;
  changeTexture(texture : string) : void;
};

/**
 * Base class for basic geometry type
 */
export class DrawInfoBasicGeometry implements DrawInfo{
  private symbol : Symbol;
  public geometryType : string;
  public editTools : any;

  private urlDot = require("file?name=./assets/[name].[ext]!./dot.png");
  private blackColor =  new Color([0, 0, 0, 1]);
  private whiteColor =  new Color([255, 255, 255, 1]);

  //Array of all the texture available
  private textureTypes : { [name:string] : Symbol; } = {
    'water' : new PictureFillSymbol(this.urlDot,
                              new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),16,16),
    'black' : new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
                              this.blackColor),
    'white' : new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
                              this.whiteColor),
  };

  constructor(geometryType : string, symbol: string, editTools : any) {
    this.geometryType = geometryType;
    this.symbol = this.textureTypes[symbol];
    this.editTools = editTools;
  }

  changeTexture(texture : string){
      this.symbol = this.textureTypes[texture];
  }

  draw(drawGraphic : DrawGraphic, event) {
    drawGraphic(new Graphic(event.geometry, this.symbol));
  }

  delete(map : ArcgisMap, clickedGraphic : Graphic) : void {
    map.graphics.remove(clickedGraphic);
  }

  getEditionGraphic(map : ArcgisMap, drawGraphic : DrawGraphic, clickedGraphic : Graphic) : Graphic {
    return clickedGraphic;
  }

  finishEdit(map : ArcgisMap, drawGraphic : DrawGraphic, graphic : Graphic) {}
  onLoad(graphics : Graphic[]) : void {}
}

export class DrawInfoCircle extends DrawInfoBasicGeometry {
    constructor(texture? : string){
        if(!texture)
            texture = "black";

        super(Draw.CIRCLE,texture,
              <any>(Edit.SCALE | Edit.MOVE)
        );

        
    }
}

export class DrawInfoPolygon extends DrawInfoBasicGeometry {
    constructor(texture? : string){
        if(!texture)
            texture = "black";


        super(Draw.POLYGON,texture,
              <any>(Edit.SCALE | Edit.MOVE | Edit.ROTATE | Edit.EDIT_VERTICES | Edit.ROTATE) 
        );
    }
}

export class DrawInfoPolyline extends DrawInfoBasicGeometry {
    constructor(texture? : string){
        if(!texture)
            texture = "black";

        super(Draw.POLYLINE,texture,
              <any>(Edit.SCALE | Edit.MOVE | Edit.ROTATE | Edit.EDIT_VERTICES) 
        );
    }
}

export class DrawInfoPedestrian implements DrawInfo {
  public geometryType : string = Draw.LINE;
  public pedestrianFillSize : number = 20;
  public editTools : any = <any>(Edit.MOVE | Edit.SCALE | Edit.EDIT_VERTICES) ;
  readonly pedestrianWidth : number = 5;
  private lastId : number = 0;

  constructor() {

  }

  changeTexture(texture : string){}

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
    this.lastId++;
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
          new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL), new Color([0, 0, 0, 1])) :
          new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL), new Color([255, 255, 255, 1]));
        
        // Save id pedestrian to attributes
        let attributes = {id:this.lastId};
        // Save origin and destination on first square
        if(index === 0){
          attributes["origin"] = origin;
          attributes["destination"] = destination;
        }
        // Draw graphic
        drawGraphic(new Graphic(geometry, symbol, attributes));
      }
    );
  }
  
  delete(map : ArcgisMap, clickedGraphic : Graphic) : void {
    // Get all graphics with same id
    let graphicsToDelete : Graphic[] = 
      this.getListSameGraphics(map.graphics.graphics, clickedGraphic);

    this.deleteGraphics(map, graphicsToDelete);
  }

  deleteGraphics(map : ArcgisMap, graphicsToDelete : Graphic[]) : void {
    for (let g of graphicsToDelete)
      map.graphics.remove(g);
  }

  getEditionGraphic(map : ArcgisMap, drawGraphic : DrawGraphic, clickedGraphic : Graphic) : Graphic {
    // Get the list of graphics contains this id
    let graphics : Graphic[] = 
      this.getListSameGraphics(map.graphics.graphics, clickedGraphic);

    // Get origin and destination saved in first square
    let origin = graphics[0].attributes.origin;
    let destination = graphics[0].attributes.destination;

    this.deleteGraphics(map, graphics);

    let ori = origin;
    let dest = destination;
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
  getListSameGraphics(graphicsMap : Graphic[], clickedGraphic : Graphic) : Graphic[] {
    let graphics : Graphic[] = [];
    graphicsMap.forEach( (g) => {
        if(this.isIdenticId(g, clickedGraphic)) 
          graphics.push(g)
      }
    )
    return graphics;
  }

  private isIdenticId(g1 : Graphic, g2 : Graphic) : boolean {
    // Check id defined
    if (!(g1 && g1.attributes && g1.attributes.id &&
          g2 && g2.attributes && g2.attributes.id)){
        return false;
    }

    // No object, simple same id
    if (g1.attributes.id == g2.attributes.id){
      return true;
    }

    // Object : check all attributes
    return this.isIdenticObjectId(g1.attributes.id, g2.attributes.id);
  }

  // Check recursively is all attribue of objects are identics
  private isIdenticObjectId(obj1, obj2) : boolean {
    if(obj1 instanceof Object && obj2 instanceof Object){
      for(let attr in obj1){
        if(obj1[attr] instanceof Object)
          return this.isIdenticObjectId(obj1[attr], obj2[attr]);
        else{
          if(obj1[attr] !== obj2[attr]){
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  finishEdit(map : ArcgisMap, drawGraphic : DrawGraphic, graphic : Graphic) {
    let polyline : Polyline = <Polyline> graphic.geometry; 
    let ori = {x:polyline.paths[0][0][0], y:polyline.paths[0][0][1]};
    let dest = {x:polyline.paths[0][1][0], y:polyline.paths[0][1][1]};
    this.createPedestrianPathway(ori, dest, graphic.geometry.spatialReference, drawGraphic );
    map.graphics.remove(graphic);
  }

  onLoad(graphics? : Graphic[]) : void {
    if(graphics){
      graphics.forEach((g) => {
        try {
          let id = g.attributes.id;
          if(id > this.lastId)
            this.lastId = id;
        }
        catch (error) {
          console.error("Pedestrian has no id or bad id");
        }
      });
    }
  } 
}
