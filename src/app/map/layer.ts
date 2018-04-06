import { LayerOptions } from "esri";
import Color = require("esri/Color");
import esriConfig = require("esri/config");
import geometryEngine = require("esri/geometry/geometryEngine");
import Graphic = require("esri/graphic");
import Layer = require("esri/layers/layer");
import OpenStreetMapLayer = require("esri/layers/OpenStreetMapLayer");
import SimpleRenderer = require("esri/renderers/SimpleRenderer");
import PictureFillSymbol = require("esri/symbols/PictureFillSymbol");
import PictureMarkerSymbol = require("esri/symbols/PictureMarkerSymbol");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import urlUtils = require("esri/urlUtils");

import * as _ from "lodash";

export type LayerType = City | Square | Osm;
export interface City {
  kind: "city";
}
export interface Square {
  kind: "square";
}
export interface Osm {
  kind: "osm";
}

urlUtils.addProxyRule({
  proxyUrl: "https://audiotactile.ovh/proxy/proxy.php",
  urlPrefix: "https://hepiageo.hesge.ch",
});

/**
 * Base class for a layer view in the ArcgisMap dom
 */
export abstract class RootLayer {
  public id: string;
  public onUpdateStart?: () => void;
  public onUpdateEnd?: () => void;

  protected subLayers: Layer[] = [];
  protected nbLayerUpdating: number = 0;

  constructor(lt: LayerType) {
    this.id = lt.kind;
  }

  public setVisibility(state: boolean): void {
    this.subLayers.forEach((layer) => layer.setVisibility(state));
  }

  public layers(): Layer[] {
    return this.subLayers;
  }

  protected addLayer(layer: Layer): void {
    this.registerLoadEventsOnLayer(layer);
    this.subLayers.push(layer);
  }

  protected registerLoadEventsOnLayer(layer: Layer): void {
    // On start
    layer.on("update-start", () => {
      // First layer load start ?
      if (this.nbLayerUpdating === 0) {
        this.nbLayerUpdating = this.subLayers.length;

        if (this.onUpdateStart) {
          this.onUpdateStart();
        }
      }
    });

    // On end
    layer.on("update-end", () => {
      this.nbLayerUpdating--;

      // Last layer load end ?
      if (this.nbLayerUpdating === 0 && this.onUpdateEnd) {
        this.onUpdateEnd();
      }
    });
  }
}
