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

import * as blackDotTextureUrl from "Assets/img/textures/blackDot.png";
import * as tiledLinesTextureUrl from "Assets/img/textures/traitilles.png";

export type DrawGraphic = (graphic: Graphic) => void;

export interface DrawInfo {
  // Geometry to draw when user create the geometry
  geometryType: string;

  // Possible edit tools like <any>(ArcgisEdit.SCALE | ArcgisEdit.MOVE)
  editTools: any;

  draw(drawGraphic: DrawGraphic, event): void;
  delete(map: ArcgisMap, clickedGraphic: Graphic): void;
  getEditionGraphic(
    map: ArcgisMap,
    drawGraphic: DrawGraphic,
    clickedGraphic: Graphic,
  ): Graphic;
  finishEdit(map: ArcgisMap, drawGraphic: DrawGraphic, graphic: Graphic): void;
  onLoad(graphics: Graphic[]): void;
  changeTexture(texture: string): void;
}

/**
 * Base class for basic geometry type
 */
export class DrawInfoBasicGeometry implements DrawInfo {
  public geometryType: string;
  public editTools: any;
  private symbol: EsriSymbol;

  private blackColor = new Color([0, 0, 0, 1]);
  private whiteColor = new Color([255, 255, 255, 1]);

  // Array of all the texture available
  private textureTypes: { [name: string]: EsriSymbol } = {
    black: new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
      this.blackColor,
    ),
    vegetation: new PictureFillSymbol(
      tiledLinesTextureUrl,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
      16,
      16,
    ),
    water: new PictureFillSymbol(
      blackDotTextureUrl,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
      16,
      16,
    ),
    white: new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
      this.whiteColor,
    ),
  };

  constructor(geometryType: string, symbol: string, editTools: any) {
    this.geometryType = geometryType;
    this.symbol = this.textureTypes[symbol];
    this.editTools = editTools;
  }

  public changeTexture(texture: string) {
    this.symbol = this.textureTypes[texture];
  }

  public draw(drawGraphic: DrawGraphic, event) {
    drawGraphic(new Graphic(event.geometry, this.symbol));
  }

  public delete(map: ArcgisMap, clickedGraphic: Graphic): void {
    map.graphics.remove(clickedGraphic);
  }

  public getEditionGraphic(
    map: ArcgisMap,
    drawGraphic: DrawGraphic,
    clickedGraphic: Graphic,
  ): Graphic {
    return clickedGraphic;
  }

  // TODO: if it work whitout, remove definitively these dead lines
  public finishEdit(map: ArcgisMap, drawGraphic: DrawGraphic, graphic: Graphic) {
    // tslint:disable-line no-empty
  }

  public onLoad(graphics: Graphic[]): void {
    // tslint:disable-line no-empty
  }
}
