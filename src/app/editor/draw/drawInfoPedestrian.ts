import Color = require("esri/Color");
import GeometryEngine = require("esri/geometry/geometryEngine");
import Polygon = require("esri/geometry/Polygon");
import Polyline = require("esri/geometry/Polyline");
import Graphic = require("esri/graphic");
import ArcgisMap = require("esri/map");
import SpatialReference = require("esri/SpatialReference");
import PictureFillSymbol = require("esri/symbols/PictureFillSymbol");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import EsriSymbol = require("esri/symbols/Symbol");
import Draw = require("esri/toolbars/draw");
import Edit = require("esri/toolbars/edit");

import * as _ from "lodash";

import {
  addVec,
  clone,
  multVec,
  norm,
  perp,
  subVec,
  Vector2d,
} from "../../core/vector2d";

import { DrawGraphic, DrawInfo, DrawInfoBasicGeometry } from "./drawInfoBasicGeometry";

export class DrawInfoPedestrian implements DrawInfo {
  public geometryType: string = Draw.LINE;
  public pedestrianFillSize: number = 20;
  public editTools: any = (Edit.MOVE | Edit.SCALE | Edit.EDIT_VERTICES) as any;
  private readonly pedestrianWidth: number = 5;
  private lastId: number = 0;

  public changeTexture(texture: string) {
    // eslint:disable-line no-empty
  }

  public draw(drawGraphic: DrawGraphic, event) {
    const A = { x: 0, y: 0 };
    A.x = event.geometry.paths[0][0][0];
    A.y = event.geometry.paths[0][0][1];

    const B = { x: 0, y: 0 };
    B.x = event.geometry.paths[0][1][0];
    B.y = event.geometry.paths[0][1][1];

    this.createPedestrianPathway(
      A,
      B,
      event.geometry.spatialReference,
      drawGraphic,
    );
  }

  public delete(map: ArcgisMap, clickedGraphic: Graphic): void {
    // Get all graphics with same id
    const graphicsToDelete: Graphic[] = this.getListSameGraphics(
      map.graphics.graphics,
      clickedGraphic,
    );

    this.deleteGraphics(map, graphicsToDelete);
  }

  public deleteGraphics(map: ArcgisMap, graphicsToDelete: Graphic[]): void {
    graphicsToDelete.forEach((graphic) => map.graphics.remove(graphic));
  }

  public getEditionGraphic(
    map: ArcgisMap,
    drawGraphic: DrawGraphic,
    clickedGraphic: Graphic,
  ): Graphic {
    // Get the list of graphics contains this id
    const graphics: Graphic[] = this.getListSameGraphics(
      map.graphics.graphics,
      clickedGraphic,
    );

    // Get origin and destination saved in first square
    const origin = graphics[0].attributes.origin;
    const destination = graphics[0].attributes.destination;

    this.deleteGraphics(map, graphics);

    const ori = origin;
    const dest = destination;
    const polyline = new Polyline(new SpatialReference({ wkid: 102100 }));
    polyline.addPath([[ori.x, ori.y], [dest.x, dest.y]]);

    const editionGraphic = new Graphic(
      polyline,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([0, 0, 0, 1]),
        this.pedestrianWidth,
      ),
    );
    drawGraphic(editionGraphic);

    return editionGraphic;
  }

  /** Return all graphics of the map wich have same graphic of clickedGraphic
   */
  public getListSameGraphics(
    graphicsMap: Graphic[],
    clickedGraphic: Graphic,
  ): Graphic[] {
    const graphics: Graphic[] = [];
    graphicsMap.forEach((g) => {
      if (this.isIdenticId(g, clickedGraphic)) {
        graphics.push(g);
      }
    });
    return graphics;
  }

  public finishEdit(map: ArcgisMap, drawGraphic: DrawGraphic, graphic: Graphic) {
    const polyline: Polyline = graphic.geometry as Polyline;
    const ori = { x: polyline.paths[0][0][0], y: polyline.paths[0][0][1] };
    const dest = { x: polyline.paths[0][1][0], y: polyline.paths[0][1][1] };
    this.createPedestrianPathway(
      ori,
      dest,
      graphic.geometry.spatialReference,
      drawGraphic,
    );
    map.graphics.remove(graphic);
  }

  public onLoad(graphics?: Graphic[]): void {
    if (graphics) {
      graphics.forEach((g) => {
        try {
          const id = g.attributes.id;
          if (id > this.lastId) {
            this.lastId = id;
          }
        } catch (error) {
          // tslint:disable-next-line no-console
          console.error("Pedestrian has no id or bad id");
        }
      });
    }
  }

  /** This feature draw a pedetrian pathway on the map
   *  (jca)
   */
  private createPedestrianPathway(
    origin,
    destination,
    spatialRef,
    drawGraphic: DrawGraphic,
  ) {
    this.lastId++;
    const A: Vector2d = clone(origin);
    const B: Vector2d = clone(destination);

    const AB: Vector2d = subVec(B, A);
    const perpAB: Vector2d = perp(AB);

    const lengthAB = norm(AB);
    const lengthPerpAB = norm(perpAB);

    let nbIter = Math.max(3, Math.floor(lengthAB / 2.5));
    nbIter = nbIter % 2 === 0 ? nbIter + 1 : nbIter;

    const unitPerpAB = multVec(this.pedestrianWidth / lengthPerpAB, perpAB);
    const unitAB = multVec(1 / nbIter, AB);

    let A_ = clone(A);

    _.range(nbIter).forEach((index) => {
      const C1 = subVec(A_, unitPerpAB);
      const C2 = addVec(A_, unitPerpAB);
      A_ = addVec(A_, unitAB);
      const C3 = addVec(A_, unitPerpAB);
      const C4 = subVec(A_, unitPerpAB);

      const geometry: Polygon = new Polygon([
        [C1.x, C1.y],
        [C2.x, C2.y],
        [C3.x, C3.y],
        [C4.x, C4.y],
      ]);
      geometry.setSpatialReference(spatialRef);

      const symbol =
        (index + 1) % 2
          ? new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
              new Color([0, 0, 0, 1]),
            )
          : new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
              new Color([255, 255, 255, 1]),
            );

      // Save id pedestrian to attributes
      const attributes: {id: number, origin?: any, destination?: any} = { id: this.lastId };
      // Save origin and destination on first square
      if (index === 0) {
        attributes.origin = origin;
        attributes.destination = destination;
      }
      // Draw graphic
      drawGraphic(new Graphic(geometry, symbol, attributes));
    });
  }

  private isIdenticId(g1: Graphic, g2: Graphic): boolean {
    // Check id defined
    if (
      !(
        g1 &&
        g1.attributes &&
        g1.attributes.id &&
        g2 &&
        g2.attributes &&
        g2.attributes.id
      )
    ) {
      return false;
    }

    // No object, simple same id
    if (g1.attributes.id === g2.attributes.id) {
      return true;
    }

    // Object : check all attributes
    return this.isIdenticObjectId(g1.attributes.id, g2.attributes.id);
  }

  // Check recursively is all attribue of objects are identics
  private isIdenticObjectId(obj1, obj2): boolean {
    if (obj1 instanceof Object && obj2 instanceof Object) {
      for (const attr in obj1) {
        if (obj1[attr] instanceof Object) {
          return this.isIdenticObjectId(obj1[attr], obj2[attr]);
        } else {
          if (obj1[attr] !== obj2[attr]) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }
}
