/* Refractoring from Chappatte code */

import { Injectable } from '@angular/core';

import { Layer } from 'esri-mods';
/*
import {
  SimpleLineSymbol,
  SimpleFillSymbol,
  PictureFillSymbol,
  PictureMarkerSymbol,
  UniqueValueRenderer,
  FeatureLayer,
  SimpleRenderer
} from 'esri-mods';
*/

export type LayerType = Default | City | Square | Osm;
interface Default { kind: "default"; }
interface City { kind: "city"; }
interface Square { kind: "square"; }
interface Osm { kind: "osm"; }


@Injectable()
export class LayerService {

  constructor() {}

  createLayer(layerType: LayerType){

    /*
    var defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, null, null);
    var renderer = new UniqueValueRenderer(defaultSymbol, "type");

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

    const symbol_surfaceDure = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, 'black');
    const symbol_building = new PictureFillSymbol("/editeur/examples/images/traitilles.png", null, 15, 15);
    const symbol_water = new PictureFillSymbol("/editeur/examples/images/cercle.png", null, 15, 15);
    const symbol_green = new PictureFillSymbol("/editeur/examples/images/traitilles.png", null, 25, 25);

    let champs;
    let symbol_el_linaires;

    if (layerType.kind === 'city'){
      champs = surface.linear.concat(surface.water, surface.green);
      symbol_el_linaires = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, 'black');
    } else if (layerType.kind === 'square'){
      symbol_el_linaires = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, "black", 10);
      champs = surface.building.concat(surface.hard, surface.water, surface.green, surface.linear);

      surface.building.forEach( (value) => renderer.addValue(value, symbol_building));
      surface.hard.forEach( (value) => renderer.addValue(value, symbol_surfaceDure));
    }

    surface.water.forEach( (value) => renderer.addValue(value, symbol_water) );
    surface.green.forEach( (value) => renderer.addValue(value, symbol_green) );

    surface.linear.forEach( (value) => renderer.addValue(value, symbol_el_linaires));

    const featureLayerUrl = "https://hepiageo.hesge.ch/arcgis/rest/services/audiotactile/audiotactile/FeatureServer/";
    const featureLayer = new FeatureLayer(featureLayerUrl + '3', {
      id: 'cs_surfaceCS',
      outFields: ["type"],
    });
    featureLayer.setDefinitionExpression("type='" + champs.join("' or type='") + "'");
    featureLayer.setRenderer(renderer);

    return featureLayer;

     */
  }


  hash(layer, hashMethod) {
    // on crée un tableau associatif par objectid pour être sûr qu'ils soient dans le même ordre
    var allElements = {};
    for (var i = 0; i < layer.graphics.length; i++) {
      // TODO: S'assurer que les objectid soient bien unique et qu'ils ne risquent pas d'être mis à jour
      allElements[layer.graphics[i].attributes.objectid] = layer.graphics[i].attributes.objectid;
    }

    var json = JSON.stringify(allElements);
    return hashMethod(json);
  }
}