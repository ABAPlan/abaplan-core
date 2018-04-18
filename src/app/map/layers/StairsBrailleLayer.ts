import Color = require("esri/Color");
import FeatureLayer = require("esri/layers/FeatureLayer");
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");

import { URL_FEATURE_LAYER_LINEAR } from "../../../conf/featureLayerApiUrls";

/**
 * Sublayer for stairs details
 */
export default class StairsBrailleLayer extends FeatureLayer {
  constructor() {
    super(URL_FEATURE_LAYER_LINEAR, {
      id: "stairs",
    });

    const defaultSymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_NULL,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL),
      new Color("black"),
    );
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    const object1 = "escalier_important";
    const object2 = "tunnel_passage_inferieur_galerie";
    const champs = [object1, object2];

    renderer.addValue(
      object1,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 1),
    );
    renderer.addValue(
      object2,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 1),
    );

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);
  }
}
