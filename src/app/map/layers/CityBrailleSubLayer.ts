import Color = require("esri/Color");
import FeatureLayer = require("esri/layers/FeatureLayer");
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");

import {WATER_SYMBOL} from "../symbols";

import {URL_FEATURE_LAYER_SURFACE} from "../../../conf/featureLayerApiUrls";
import Surfaces from "../../../conf/surfaces";

/**
 * Sublayer for city details
 */
export default class CityBrailleSubLayer extends FeatureLayer {
  constructor() {
    super(URL_FEATURE_LAYER_SURFACE, {
      id: "city",
    });

    const defaultSymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_NULL,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
      new Color("black"),
    );
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    const champs = Surfaces.linear.concat(Surfaces.water, Surfaces.green);
    const LINEAR_SYMBOL = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
      new Color("black"),
    );
    // TODO: check this lines
    // const LINEAR_SYMBOL = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 3);

    Surfaces.water.forEach((value) => renderer.addValue(value, WATER_SYMBOL));
    // surface.green.forEach( (value) => renderer.addValue(value, GREEN_SYMBOL) );
    Surfaces.linear.forEach((value) => renderer.addValue(value, LINEAR_SYMBOL));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);
  }
}
