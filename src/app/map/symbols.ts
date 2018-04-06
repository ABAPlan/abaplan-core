import Color = require("esri/Color");
import PictureFillSymbol = require("esri/symbols/PictureFillSymbol");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");

import * as blackDotTextureUrl from "Assets/img/textures/blackDot.png";
import * as tiledLinesTextureUrl from "Assets/img/textures/traitilles.png";

export const HARD_SYMBOL = new SimpleFillSymbol(
  SimpleFillSymbol.STYLE_SOLID,
  new SimpleLineSymbol(),
  new Color("black"),
);

export const BUILDING_SYMBOL = new PictureFillSymbol(
  tiledLinesTextureUrl,
  new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
  15,
  15,
);

export const WATER_SYMBOL = new PictureFillSymbol(
  blackDotTextureUrl,
  new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
  15,
  15,
);

export const GREEN_SYMBOL = new PictureFillSymbol(
  tiledLinesTextureUrl,
  new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
  25,
  25,
);
