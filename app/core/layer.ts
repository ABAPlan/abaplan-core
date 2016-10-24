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
import { LayerType } from './layer';

export type LayerType = City | Square | Osm;
interface City { kind: "city"; }
interface Square { kind: "square"; }
interface Osm { kind: "osm"; }

export type AbaLayer = OsmLayer | CityBrailleLayer | SquareBrailleLayer;

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
const BUILDING_SYMBOL = new PictureFillSymbol("src/traitilles.png", null, 15, 15);
const WATER_SYMBOL = new PictureFillSymbol("src/cercle.png", null, 15, 15);
const GREEN_SYMBOL = new PictureFillSymbol("src/traitilles.png", null, 25, 25);

const URL_FEATURE_LAYER = "https://hepiageo.hesge.ch/arcgis/rest/services/audiotactile/audiotactile/FeatureServer/3";


export class CityBrailleLayer extends FeatureLayer {

  constructor() {

    super(URL_FEATURE_LAYER, {
      //id: 'cs_surfaceCS',
      id: 'city',
      outFields: ["type"],
    });

    const defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, null, null);
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    const champs = surface.linear.concat(surface.water, surface.green);
    const LINEAR_SYMBOL = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color("black"));

    surface.water.forEach( (value) => renderer.addValue(value, WATER_SYMBOL) );
    surface.green.forEach( (value) => renderer.addValue(value, GREEN_SYMBOL) );
    surface.linear.forEach( (value) => renderer.addValue(value, LINEAR_SYMBOL));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);

  }
}

export class SquareBrailleLayer extends FeatureLayer {
  constructor() {

    super(URL_FEATURE_LAYER, {
      id: 'square',
      outFields: ["type"],
    });

    const defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, null, null);
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    const champs = surface.building.concat(surface.hard, surface.water, surface.green, surface.linear);
    const LINEAR_SYMBOL = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 10);

    surface.building.forEach( (value) => renderer.addValue(value, BUILDING_SYMBOL));
    surface.hard.forEach( (value) => renderer.addValue(value, HARD_SYMBOL));
    surface.water.forEach( (value) => renderer.addValue(value, WATER_SYMBOL) );
    surface.green.forEach( (value) => renderer.addValue(value, GREEN_SYMBOL) );
    surface.linear.forEach( (value) => renderer.addValue(value, LINEAR_SYMBOL));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    this.setRenderer(renderer);

  }
}

export class OsmLayer extends OpenStreetMapLayer {
  constructor() {
    super();
    this.id = "osm";
    this.setMaxScale(25);
  }
}

