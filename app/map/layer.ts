import OpenStreetMapLayer = require("esri/layers/OpenStreetMapLayer");
import Layer = require('esri/layers/layer');
import SimpleLineSymbol = require('esri/symbols/SimpleLineSymbol');
import SimpleFillSymbol = require('esri/symbols/SimpleFillSymbol');
import PictureFillSymbol = require('esri/symbols/PictureFillSymbol');
import PictureMarkerSymbol = require('esri/symbols/PictureMarkerSymbol');
import UniqueValueRenderer = require('esri/renderers/UniqueValueRenderer');
import FeatureLayer = require('esri/layers/FeatureLayer');
import SimpleRenderer = require('esri/renderers/SimpleRenderer');
import Color = require('esri/Color');
import urlUtils = require('esri/urlUtils');
import * as _ from "lodash";
import Graphic = require("esri/graphic");
import geometryEngine = require("esri/geometry/geometryEngine");
import esriConfig = require('esri/config');

import { removeCommonSegments } from './polygon';
import {LayerOptions} from "esri";

export type LayerType = City | Square | Osm;
export interface City { kind: "city"; }
export interface Square { kind: "square"; }
export interface Osm { kind: "osm"; }

//esriConfig.defaults.io.corsDetection = false;

urlUtils.addProxyRule({
  urlPrefix: "https://hepiageo.hesge.ch",
  //proxyUrl : "http://localhost:8880/proxy/proxy.php"
  proxyUrl : "https://audiotactile.ovh/proxy/proxy.php"
});


const surface = {
  hard: [
    "ilot",
    "trottoir",
    "autre_revetement_dur",
    "rocher",
    "place_aviation"
  ],
  building: [
    "batiment"
  ],
  water: [
    "eau_stagnante",
    "bassin",
    "cours_eau",
    "fontaine"
  ],
  green: [
    "roseliere",
    "paturage_boise_ouvert",
    "tourbiere",
    "autre_verte",
    "autre_culture_intensive",
    "paturage_boise_dense",
    "autre_boisee",
    "jardin",
    "foret_dense",
    "vigne",
    "champ_pre_paturage"
  ],
  linear:  [
    "route_chemin",
    "chemin_de_fer"
  ]
};

const HARD_SYMBOL = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color('black'));

const url_traitilles = require("file?name=./assets/[name].[ext]!./../core/img/traitilles.png");
const url_cercle = require("file?name=./assets/[name].[ext]!./../core/img/cercle.png");

const BUILDING_SYMBOL = new PictureFillSymbol(url_traitilles, null, 15, 15);
const WATER_SYMBOL = new PictureFillSymbol(url_cercle, null, 15, 15);
const GREEN_SYMBOL = new PictureFillSymbol(url_traitilles, null, 25, 25);

const URL_FEATURE_LAYER = "https://hepiageo.hesge.ch/arcgis/rest/services/audiotactile/audiotactile/FeatureServer/";
const URL_FEATURE_LAYER_SURFACE = URL_FEATURE_LAYER + '3';
const URL_FEATURE_LAYER_LINEAR = URL_FEATURE_LAYER + '1';

/**
 * Base class for a layer view in the ArcgisMap dom
 */
export abstract class RootLayer extends Layer {
  protected subLayers: Layer[] = [];
  constructor(lt: LayerType){
    super( {id: lt.kind } as LayerOptions );
  }
  public setVisibility(state: boolean): void {
    this.subLayers.forEach( layer => layer.setVisibility(state));
  }
  public layers(): Layer[] {
    return this.subLayers;
  }
}

/**
 * ArcgisMap Layer for City Braille representation
 */
export class CityRootBrailleLayer extends RootLayer {

  constructor(){
    super( {kind: 'city'} );
    this.subLayers.push(new CityBrailleSubLayer());
  }
}

/**
 * ArcgisMap Layer for Square Braille representation
 */
export class SquareRootBrailleLayer extends RootLayer {
  constructor(){
    super( {kind: 'square'} );
    this.subLayers.push(new SquareBrailleSubLayer());
    this.subLayers.push(new RailroadBrailleSubLayer());
  }
}

/**
 * ArcgisMap Layer for OpenStreet Map representation
 */
export class OsmRootLayer extends RootLayer {
  constructor(){
    super( {kind: 'osm'} );
    this.subLayers.push(new OsmSubLayer());
  }
}

/**
 * Sublayer for city details
 */
class CityBrailleSubLayer extends FeatureLayer {

  constructor() {

    super(URL_FEATURE_LAYER_SURFACE, {
      id: 'city',
    });

    const defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, null, null);
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    const champs = surface.linear.concat(surface.water, surface.green);
    const LINEAR_SYMBOL = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color("black"));

    surface.water.forEach( (value) => renderer.addValue(value, WATER_SYMBOL) );
    //surface.green.forEach( (value) => renderer.addValue(value, GREEN_SYMBOL) );
    surface.linear.forEach( (value) => renderer.addValue(value, LINEAR_SYMBOL));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);

  }

}

/**
 * Sublayer for square details
 */
class SquareBrailleSubLayer extends FeatureLayer {

  constructor() {

    super(URL_FEATURE_LAYER_SURFACE, {
      id: 'square',
    });

    //const defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, null, null);
    const defaultSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, null, null);
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    //const champs = surface.green.concat(surface.building, surface.hard, surface.water, surface.linear);
    const champs = surface.building.concat(surface.hard, surface.water, surface.linear);
    const LINEAR_SYMBOL = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 3);

    surface.linear.forEach((value) => renderer.addValue(value, LINEAR_SYMBOL));
    surface.water.forEach((value) => renderer.addValue(value, WATER_SYMBOL));
    surface.building.forEach((value) => renderer.addValue(value, BUILDING_SYMBOL));
    surface.hard.forEach((value) => renderer.addValue(value, HARD_SYMBOL));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);
  }


  /* this function mutate a graphic to transform a list of coordinates representing a rings to a list of
   * segments. Thanks to this, we can remove segments intersections later.
   * Because some fields are not accessible for the Esri/Graphic type, we get it as an pojo js object
   * (jca)
   */
  transform(graphic: any): void {

    const xs = [];

    // Esri lib doesn't refresh all element on a map, we have to keep the original reference of the rings as a
    // good comparator
    if (graphic.geometry.originalRings === undefined) {
      graphic.geometry.originalRings = graphic.geometry.rings;
      graphic.geometry.xmin = _.minBy(graphic.geometry.originalRings[0], g => g[0] )[0];
      graphic.geometry.xmax = _.maxBy(graphic.geometry.originalRings[0], g => g[0] )[0];
      graphic.geometry.ymin = _.minBy(graphic.geometry.originalRings[0], g => g[1] )[1];
      graphic.geometry.ymax = _.maxBy(graphic.geometry.originalRings[0], g => g[1] )[1];
    }
    graphic.geometry.originalRings.forEach(r => {
      const set = _.flatten(r.map( g => [g, g])).slice(1);
      set.pop();
      xs.push(_.chunk(set, 2));
    });
    graphic.geometry.rings = _.flatten(xs);
  }

  /* Fires when a layer has finished updating its content
   * We compare way-objects segments and remove those which intersect
   * (jca)
   */
  onUpdateEnd(){

    const pathsGraphics = this.graphics.filter( g => g.attributes.type === 'route_chemin');
    pathsGraphics.forEach( g => this.transform(g) );

    const railwaysGraphics = this.graphics.filter( g => g.attributes.type === 'chemin_de_fer');
    railwaysGraphics.forEach( g => this.transform(g) );

    removeCommonSegments(pathsGraphics);
    removeCommonSegments(railwaysGraphics);

    // Reorder paths
    railwaysGraphics.filter(g => g.getShape() !== null).forEach(g => g.getShape().moveToFront());
    pathsGraphics.filter(g => g.getShape() !== null).forEach(g => g.getShape().moveToFront());

    this.redraw();

  }
}

/**
 * Sublayer for stairs details
 */
class StairsBrailleLayer extends FeatureLayer {

  constructor() {

    super(URL_FEATURE_LAYER_LINEAR, {
      id: 'stairs',
    });

    const defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, null, null);
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    const object1 = 'escalier_important';
    const object2 = 'tunnel_passage_inferieur_galerie';
    const champs = [object1, object2];

    renderer.addValue(object1, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 1));
    renderer.addValue(object2, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 1));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);

  }

}

/**
 * Sublayer for railroad details
 */
class RailroadBrailleSubLayer extends FeatureLayer {

  constructor() {

    super(URL_FEATURE_LAYER_LINEAR, {
      id: 'railroad',
    });

    const defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, null, null);
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    const object = 'voie_ferree';
    const champs = [object];

    renderer.addValue(object, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 3));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);

  }
}

class OsmSubLayer extends OpenStreetMapLayer {
  public id: string = "osm";
  constructor() {
    super();
    this.setMaxScale(25);
  }
}
