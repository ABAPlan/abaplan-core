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

  /**
  * Calcul de la prochaine coordonnées d'un point du passage
  * Piétons tel que la distance soit toujours constante
  * Résoudre les équations y = mx + k et d = sqrt(pow(x2-x1, 2) + pow(y2-y1, 2))
  * (rch)
  */
  nextCoord (A, l, m, k, D1, D2) {
    var a = Math.pow(m, 2) + 1;
    var b = (2 * k * m) - (2 * A.y * m) - (2 * A.x);
    var c = Math.pow(k, 2) - (2 * A.y * k) + Math.pow(A.x, 2) + Math.pow(A.y, 2) - Math.pow(l, 2);

    var delta = Math.pow(b, 2) - (4 * a * c);
    var x;
    var y;

    if (delta < 0) {
      console.log("pas de solution");
    } else if (delta == 0) {
      x = (-b) / (2 * a);
    } else {
      var p1 = ((-b) - Math.sqrt(delta)) / (2 * a);
      var p2 = ((-b) + Math.sqrt(delta)) / (2 * a);
      if (D2.x - D1.x >= 0) {
        x = (p1 > p2) ? p1 : p2;
      } else {
        x = (p1 < p2) ? p1 : p2;
      }
    }

    y = m * x + k;

    return { x: x, y: y };
  }


  /* no comment by the original author
   * (rch)
   */
  createPedestrianPathway (origin, destination, spatialRef, arcgisMap) {

    const pedestrianWidth = 5;

    let A: Vector2d = clone(origin);
    let B: Vector2d = clone(destination);

    const AB: Vector2d = subVec(B, A);
    const perpAB: Vector2d = perp(AB);

    const lengthAB = norm(AB);
    const lengthPerpAB = norm(perpAB);
    const unitPerpAB = multVec(pedestrianWidth/lengthPerpAB, perpAB);
    const unitAB = multVec(pedestrianWidth/lengthAB, AB);

    const nbIter = Math.floor( lengthAB / 2.5 );
    _.range(nbIter).forEach(
      index => console.log(index)









    );

    let C1 = subVec(A, unitPerpAB);
    let C2 = addVec(A, unitPerpAB);
    let A_ = addVec(A, unitAB);
    let C3 = addVec(A_, unitPerpAB);
    let C4 = subVec(A_, unitPerpAB);

    const geometry: Polygon = new Polygon([[C1.x, C1.y], [C2.x, C2.y], [C3.x, C3.y], [C4.x, C4.y]]);
    geometry.setSpatialReference(spatialRef);

    const symbol: SimpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([0, 0, 0, 1]));

    arcgisMap.graphics.add(new Graphic(geometry, symbol, {
      "shape": this.geometryType,
      "texture": symbol,
      "passage_pieton": true
    }));

  }






    /*



    // Distance entre les deux points composant le segment de droite dessiné
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));

    console.log("--------------");
    console.log(AB);


    // Pente entre les points A et B
    var m = (B.y - A.y) / (B.x - A.x);
    var k = A.y - (m * A.x); // ordonnée à l'origine de la droite décrite par les points A et B

    // longueur et largeur d'une bande du passage piétons
    let pedestrianFillSizeZoom = this.pedestrianFillSize - arcgisMap.getZoom();
    var l = 2.5 * pedestrianFillSizeZoom;
    var h = 5 * pedestrianFillSizeZoom;

    // Théorème de Thalès
    var x = h * (B.y - A.y) / AB;
    var y = h * (B.x - A.x) / AB;



    //console.log(Math.round(AB / l));
    let nbRectangles = Math.round(AB / l);
    nbRectangles = nbRectangles % 2 == 0 ? nbRectangles + 1 : nbRectangles;

    var C = { x: A.x - x, y: A.y + y };
    var D = { x: 0, y: 0 };
    var E = { x: 0, y: 0 };
    var F = { x: A.x + x, y: A.y - y };
    var geometries = [];
    for (var i = 0; i < nbRectangles ; i++) {
      // Calcul des points du rectangle autour du segment de droite

      k = C.y - (m * C.x);
      C = this.nextCoord(C, l, m, k, A, B);
      D = this.nextCoord(C, l, m, k, A, B);

      k = F.y - (m * F.x);
      F = this.nextCoord(F, l, m, k, A, B);
      E = this.nextCoord(F, l, m, k, A, B);

      // Création du rectangle autour de la droite
      var geometry = new Polygon([[C.x, C.y], [D.x, D.y], [E.x, E.y], [F.x, F.y]]);
      geometry.setSpatialReference(spatialRef);

      let symbol = (i+1)%2 ?
        new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([0, 0, 0, 1])) :
        new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([255, 255, 255, 1]));


      geometries.push(geometry);


     // arcgisMap.graphics.add(new Graphic(geometry, symbol, { "shape": this.geometryType, "texture": symbol, "passage_pieton": true }));

  /*
    }

    //////// EditTools.ppAdded();

    console.log(geometries.length + " polygon required to draw this pedestrian pathways");
    console.log(geometries.length);

    // Créé une geometrie avec tous les polygones, mais on ne peut plus avoir une alternance de noir/blanc
    // puisqu'un seul polygone avec un symbole
    //geometry = geometryEngine.union(geometries);
    //this.arcgisMap.graphics.add(new Graphic(geometry, symbol, { "shape": this.currentToolname, "texture": this.fillType, "passage_pieton": true }));

  }

   */
}
