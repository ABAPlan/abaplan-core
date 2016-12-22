import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import SimpleLineSymbol = require('esri/symbols/SimpleLineSymbol');
import PictureFillSymbol = require('esri/symbols/PictureFillSymbol');
import SimpleFillSymbol = require('esri/symbols/SimpleFillSymbol');
import Symbol = require('esri/symbols/Symbol');
import Color = require('esri/Color');
import Polygon = require('esri/geometry/Polygon');
import Draw = require('esri/toolbars/draw');
import * as _ from "lodash";

//import * as Vector from '../core/vector2d';
import { Vector2d, subVec, addVec, norm, multVec, perp, clone } from '../core/vector2d';

export interface DrawInfo {
  geometryType : string;
  drawComplete(map : ArcgisMap, event) : void;
};

/**
 * Base class for basic geometry type
 */
export class DrawInfoBasicGeometry implements DrawInfo{
  private symbol : Symbol;
  public geometryType : string;

  constructor(geometryType : string, symbol: Symbol) {
    this.geometryType = geometryType;
    this.symbol = symbol;
  }

  drawComplete(map : ArcgisMap, event) {
    map.graphics.add(new Graphic(event.geometry, this.symbol));
  }
}

export class DrawInfoCircle extends DrawInfoBasicGeometry {
    constructor(color? : Color){
        if(!color)
            color = new Color([0, 0, 0, 1]);

        super(Draw.CIRCLE,
              new SimpleFillSymbol(
                  SimpleFillSymbol.STYLE_SOLID,
                  null,
                  color)
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
              )
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
                  color)
        );
    }
}

export class DrawInfoPedestrian implements DrawInfo {
  public geometryType : string = Draw.LINE;
  public pedestrianFillSize : number = 20;
  constructor() {

  }

  drawComplete(map : ArcgisMap, event) {
    //map.graphics.add(new Graphic(event.geometry, this.symbol));
    var A = {x:0, y:0};
    A.x = event.geometry.paths[0][0][0];
    A.y = event.geometry.paths[0][0][1];

    var B = { x: 0, y: 0 };
    B.x = event.geometry.paths[0][1][0];
    B.y = event.geometry.paths[0][1][1];

    this.createPedestrianPathway(A, B, event.geometry.spatialReference, map);
  }


  /** This feature draw a pedetrian pathway on the map
   *  (jca)
   */
  createPedestrianPathway (origin, destination, spatialRef, arcgisMap) {

    const pedestrianWidth = 5;

    let A: Vector2d = clone(origin);
    let B: Vector2d = clone(destination);

    const AB: Vector2d = subVec(B, A);
    const perpAB: Vector2d = perp(AB);

    const lengthAB = norm(AB);
    const lengthPerpAB = norm(perpAB);

    let nbIter = Math.max(3, Math.floor( lengthAB / 2.5 ));
    nbIter = nbIter % 2 == 0 ? nbIter+1 : nbIter;

    const unitPerpAB = multVec(pedestrianWidth/lengthPerpAB, perpAB);
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

        arcgisMap.graphics.add(new Graphic(geometry, symbol, {
          "shape": this.geometryType,
          "texture": symbol,
          "passage_pieton": true
        }));
      }
    );
  }
}
