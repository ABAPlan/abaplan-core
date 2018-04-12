import Color = require("esri/Color");
import FeatureLayer = require("esri/layers/FeatureLayer");
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");

import * as _ from "lodash";
import { URL_FEATURE_LAYER_SURFACE } from "../../../conf/featureLayerApiUrls";
import Surfaces from "../../../conf/surfaces";
import { removeCommonSegments } from "../polygon";
import { BUILDING_SYMBOL, HARD_SYMBOL, WATER_SYMBOL } from "../symbols";

/**
 * Sublayer for square details
 */
export default class SquareBrailleSubLayer extends FeatureLayer {
  constructor() {
    super(URL_FEATURE_LAYER_SURFACE, {
      id: "square",
    });

    const defaultSymbol = new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_NULL,
      new Color("black"),
      0,
    );
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    // TODO: check the line below
    // const champs = Surfaces.green.concat(Surfaces.building, Surfaces.hard, Surfaces.water, Surfaces.linear);
    const champs = Surfaces.building.concat(
      Surfaces.hard,
      Surfaces.water,
      Surfaces.linear,
    );
    const LINEAR_SYMBOL = new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color("black"),
      3,
    );

    Surfaces.linear.forEach((value) => renderer.addValue(value, LINEAR_SYMBOL));
    Surfaces.water.forEach((value) => renderer.addValue(value, WATER_SYMBOL));
    Surfaces.building.forEach((value) => renderer.addValue(value, BUILDING_SYMBOL));
    Surfaces.hard.forEach((value) => renderer.addValue(value, HARD_SYMBOL));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);
  }

  /* this function mutate a graphic to transform a list of coordinates representing a rings to a list of
     * segments. Thanks to this, we can remove segments intersections later.
     * Because some fields are not accessible for the Esri/Graphic type, we get it as an pojo js object
     * (jca)
     */
  private transform(graphic: any): void {
    const xs: number[][][] = [];

    // Esri lib doesn't refresh all element on a map, we have to keep the original reference of the rings as a
    // good comparator
    if (graphic.geometry.originalRings === undefined) {
      graphic.geometry.originalRings = graphic.geometry.rings;
      graphic.geometry.xmin = _.minBy(
        graphic.geometry.originalRings[0],
        (g) => g[0],
      )[0];
      graphic.geometry.xmax = _.maxBy(
        graphic.geometry.originalRings[0],
        (g) => g[0],
      )[0];
      graphic.geometry.ymin = _.minBy(
        graphic.geometry.originalRings[0],
        (g) => g[1],
      )[1];
      graphic.geometry.ymax = _.maxBy(
        graphic.geometry.originalRings[0],
        (g) => g[1],
      )[1];
    }
    graphic.geometry.originalRings.forEach((r) => {
      const set: number[] = _.flatten(r.map((g) => [g, g])).slice(1) as number[];
      set.pop();
      xs.push(_.chunk(set, 2));
    });
    graphic.geometry.rings = _.flatten(xs);
  }

  /* Fires when a layer has finished updating its content
     * We compare way-objects segments and remove those which intersect
     * (jca)
     */
  private onUpdateEnd() {
    const pathsGraphics = this.graphics.filter(
      (g) => g.attributes.type === "route_chemin",
    );
    pathsGraphics.forEach((g) => this.transform(g));

    const railwaysGraphics = this.graphics.filter(
      (g) => g.attributes.type === "chemin_de_fer",
    );
    railwaysGraphics.forEach((g) => this.transform(g));

    removeCommonSegments(pathsGraphics);
    removeCommonSegments(railwaysGraphics);

    // Reorder paths
    railwaysGraphics
      .filter((g) => g.getShape() !== null)
      .forEach((g) => g.getShape().moveToFront());
    pathsGraphics
      .filter((g) => g.getShape() !== null)
      .forEach((g) => g.getShape().moveToFront());

    this.redraw();
  }
}
