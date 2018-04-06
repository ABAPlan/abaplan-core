import Color = require("esri/Color");
import FeatureLayer = require("esri/layers/FeatureLayer");
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");

import {URL_FEATURE_LAYER_LINEAR} from "../../../conf/featureLayerApiUrls";

/**
 * Sublayer for railroad details
 */
export default class RailroadBrailleSubLayer extends FeatureLayer {
  constructor() {
    super(URL_FEATURE_LAYER_LINEAR, {
      id: "railroad",
    });

    const defaultSymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_NULL,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
      new Color("black"),
    );
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    const object = "voie_ferree";
    const champs = [object];

    renderer.addValue(
      object,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 3),
    );

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);
  }
}
