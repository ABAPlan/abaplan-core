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

export type LayerType = City | Square | Osm;
export interface City { kind: "city"; }
export interface Square { kind: "square"; }
export interface Osm { kind: "osm"; }

export type AbaLayer = OsmLayer | CityBrailleLayer | SquareBrailleLayer;

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

const url_traitilles = require("file?name=./assets/[name].[ext]!./img/traitilles.png");
const url_cercle = require("file?name=./assets/[name].[ext]!./img/cercle.png");

const BUILDING_SYMBOL = new PictureFillSymbol(url_traitilles, null, 15, 15);
const WATER_SYMBOL = new PictureFillSymbol(url_cercle, null, 15, 15);
const GREEN_SYMBOL = new PictureFillSymbol(url_traitilles, null, 25, 25);

const URL_FEATURE_LAYER = "https://hepiageo.hesge.ch/arcgis/rest/services/audiotactile/audiotactile/FeatureServer/3";

export class CityBrailleLayer extends FeatureLayer {

  constructor() {

    super(URL_FEATURE_LAYER, {
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

export class SquareBrailleLayer extends FeatureLayer {

  constructor() {

    super(URL_FEATURE_LAYER, {
      id: 'square',
    });

    //const defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, null, null);
    const defaultSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, null, null);
    const renderer = new UniqueValueRenderer(defaultSymbol, "type");

    //const champs = surface.green.concat(surface.building, surface.hard, surface.water, surface.linear);
    const champs = surface.building.concat(surface.hard, surface.water, surface.linear);
    const LINEAR_SYMBOL = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 3);

    surface.linear.forEach((value) => renderer.addValue(value, LINEAR_SYMBOL));
    //surface.green.forEach((value) => renderer.addValue(value, GREEN_SYMBOL));
    surface.water.forEach((value) => renderer.addValue(value, WATER_SYMBOL));
    surface.building.forEach((value) => renderer.addValue(value, BUILDING_SYMBOL));
    surface.hard.forEach((value) => renderer.addValue(value, HARD_SYMBOL));

    this.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    //this.setDefinitionExpression("type='route_chemin' or type='chemin_de_fer'");
    this.setRenderer(renderer);
  }

  enumerate(n) {

    let ys = [];
    let processed = [];
    let xs = _.range(0, n);
    xs.forEach( (x) => {
      processed.push(x);
      let zs = _.difference(xs, processed);
      zs.forEach( (z) => ys.push([x, z]));
    });
    return ys;

  }

  indexSubArray(xs, ys) {
    let xi = 0;
    let yi = 0;
    while ( xi < xs.length - ys.length){
      if (xs[xi] === +ys[yi]){
        yi += 1;
        if (yi === ys.length) {
          return xi;
        }
      } else {
        yi = 0;
      }
      xi += 1;
    }
    return -1;
  }

  onGraphicAdd(graphic){
    if (graphic.attributes.type === 'route_chemin'){
      const set = _.flatten(graphic.geometry.rings[0].map( g => [g, g])).slice(1);
      set.pop();
      graphic.geometry.rings = _.chunk(set, 2);



     // const set1 = _.chunk(graphic.geometry.rings[0], 2);
      //const set2 = _.chunk(graphic.geometry.rings[0].slice(1), 2);





//      console.log(graphic);
    }
  }

  onUpdateEnd(error, info){

    // Reorder paths
    this.graphics.filter( g => g.attributes.type === 'route_chemin' && g.getShape() !== null).forEach(g => g.getShape().moveToFront());

    const graphics = this.graphics.filter( g => g.attributes.type === 'route_chemin' && g.getShape() );
    const coordinates = graphics.map( g => _.flatten(g.geometry.toJson().rings).map( ([x, y]) => {  return {"x": x, "y": y}; } ) );
    const conflicts = this.enumerate(coordinates.length).map( ([a, b]) => { return {'a': a, 'b': b, 'conflicts': _.intersectionWith(coordinates[a], coordinates[b], _.isEqual)} });
    console.log(coordinates);
    console.log(conflicts);

    //console.log(graphics);

    //graphics.forEach( g=> console.log(g.geometry.toJson().rings ));
    /*
    conflicts.forEach( o  => {
      let g1: any = this.graphics[o.a];
      let g2: any = this.graphics[o.b];
      //g1.geometry.rings.forEach(r => o.conflicts.forEach( c => console.log("(" + c.x + "," + c.y + "),(" + r[0] + "," + r[1] +")" )));
      //g2.geometry.rings.forEach(r => o.conflicts.forEach( c => console.log("(" + c.x + "," + c.y + "),(" + r[0] + "," + r[1] +")" )));
     // g2.geometry.rings.forEach(r => console.log(_.some(o.conflicts, c => (c.x === r[0] && c.y === r[1]) || (c.x === r[1] && c.y === r[0]))));
     // _.remove(g1.geometry.rings, r => _.some(o.conflicts, c => (c.x === r[0] && c.y === r[1]) || (c.x === r[1] && c.y === r[0])));
     // _.remove(g2.geometry.rings, r => _.some(o.conflicts, c => (c.x === r[0] && c.y === r[1]) || (c.x === r[1] && c.y === r[0])));
      /*
      g1.rings = _.filter(g1.rings, r => _.some(o.conflicts, c => (c.x === r[0] && c.y === r[1]) || (c.x === r[1] && c.y === r[0])));
      g2.rings = _.filter(g2.rings, r => _.some(o.conflicts, c => (c.x === r[0] && c.y === r[1]) || (c.x === r[1] && c.y === r[0])));
      console.log("---");
    });
  */
    /*
    let g = graphics[0];


    let shape = g.getShape();

    shape.setStroke({color: "#333", style: "Dash", cap: "round"});
    console.log(shape);
    shape.segments = shape.segments[0];
    console.log(shape);

    g.getShape().setShape(shape);
    */


    this.redraw();

    /*
    console.log( g._shape);
    g._shape.shape.path = g._shape.shape.path.slice(0, g._shape.shape.path.length);
    // g._shape = Object.assign({}, g._shape);
    console.log(g._shape.shape);
    console.log( g._shape);
    console.log(g);
    */

  //  g.geometry.type = 'polyline';
//    g.geometry.paths = g.geometry.rings;




//    this.clear();
    //this.graphics = [];
    //this.redraw();
    //this.graphics = [g];
    //this.redraw();

    /*

    let comparison = graphics.map( g =>  _.chunk(g.getShape().segments[0].args, 2).map( coord => coord[0] + " " + coord[1]));

    let conflicts = [];
    this.enumerate(comparison.length).forEach( ([x, y]) => conflicts.push(_.intersection(comparison[x], comparison[y])));

    conflicts = conflicts.filter( c => c.length > 0 );
    conflicts = conflicts.map( c => _.flatten(c.map( d => _.split(d, ' ')) ));
    console.log(graphics[0]);
    console.log(graphics[0].getShape().segments);
    if (this.indexSubArray(graphics[0].getShape().segments[0].args, conflicts[0]) >= 0){
      let indice = this.indexSubArray(graphics[0].getShape().segments[0].args, conflicts[0]);
      let g : any = graphics[0].getShape();
      console.log(indice);
      g.segments[0].args = g.segments[0].args.slice(0, 9);
      console.log(g);

    }
    console.log(this.indexSubArray(graphics[0].getShape().segments[0].args, conflicts[1]));

    this.clear();

    let g : any = graphics[0];
    console.log(g.geometry.rings[0]);
    g.geometry.rings[0] = _.slice(g.geometry.rings[0], 0, 19);
    this.graphics = [graphics[0]];
    this.redraw();

*/

  }
}

export class OsmLayer extends OpenStreetMapLayer {
  public id: string = "osm";
  constructor() {
    super();
    this.setMaxScale(25);
  }
}
