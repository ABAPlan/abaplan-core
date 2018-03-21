import Extent = require("esri/geometry/Extent");
import Graphic = require("esri/graphic");
import Layer = require("esri/layers/layer");
import OpenStreetMapLayer = require("esri/layers/OpenStreetMapLayer");
import ArcgisMap = require("esri/map");

import * as _ from "lodash";
import {
  City,
  CityRootBrailleLayer,
  LayerType,
  OsmRootLayer,
  RootLayer,
  Square,
  SquareRootBrailleLayer,
} from "./layer";

export interface OptionMap {
  height: number;
  width: number;
  city: number;
  extent: string;
  uid?: number;
  title?: string;
  owner?: number;
  graphics?: any;
  hash?: string;
  creationDate?: string;
  layerType?: LayerType;
}

export class AbaMap extends ArcgisMap {
  public static fromOptionMap(
    divId: Node | string,
    optionMap: OptionMap,
    layerType?: LayerType,
  ): AbaMap {
    const abaMap: AbaMap = new AbaMap(
      divId,
      new Extent(JSON.parse(optionMap.extent)),
    );

    abaMap.uid = optionMap.uid;
    abaMap.height = optionMap.height;
    abaMap.width = optionMap.width;

    if (layerType) {
      abaMap.setLayerVisible(layerType);
    } else if (optionMap.layerType) {
      abaMap.setLayerVisible(optionMap.layerType);
    } else {
      abaMap.setLayerVisible({ kind: "osm" });
    }

    abaMap.title = optionMap.title;
    abaMap.owner = optionMap.owner;

    if (optionMap.graphics) {
      const json: any = JSON.parse(optionMap.graphics);
      json.forEach((graphic) => abaMap.graphics.add(new Graphic(graphic)));
    }

    abaMap.hash = optionMap.hash;
    abaMap.creationDate = optionMap.creationDate;

    return abaMap;
  }

  public uid?: number;
  public title?: string;
  public owner?: number;
  public hash?: string;
  public creationDate?: string;

  public currentLayerVisible: LayerType;
  public onUpdateStart?: () => void;
  public onUpdateEnd?: () => void;

  private layers: RootLayer[] = [];

  // Create a new fresh instance
  public constructor(
    divId: Node | string,
    extent?: Extent,
    layerType?: LayerType,
  ) {
    super(divId, { logo: false, slider: false });

    if (!extent) {
      extent = new Extent({
        spatialReference: {
          wkid: 102100,
        },
        xmax: 1105000.0,
        xmin: 780000.0,
        ymax: 6100000.0,
        ymin: 5720000.0,
      });
    }

    this.setExtent(extent);

    this.layers.push(new OsmRootLayer());
    this.layers.push(new SquareRootBrailleLayer());
    this.layers.push(new CityRootBrailleLayer());
    const finalLayers = _.flatten(this.layers.map((l) => l.layers()));

    this.setLayerVisible({ kind: "osm" });

    this.registerUpdateEventsOnLayers();

    this.addLayers(finalLayers);
  }

  // Register update state of each layers
  public registerUpdateEventsOnLayers() {
    this.layers.forEach((layer) => {
      layer.onUpdateStart = () => {
        if (layer.id === this.currentLayerVisible.kind && this.onUpdateStart) {
          this.onUpdateStart();
        }
      };
      layer.onUpdateEnd = () => {
        if (layer.id === this.currentLayerVisible.kind && this.onUpdateEnd) {
          this.onUpdateEnd();
        }
      };
    });
  }

  public setLayerVisible(layerType: LayerType) {
    // Set current layer visible
    this.currentLayerVisible = layerType;

    this.layers.forEach((layer) => {
      layer.setVisibility(layerType.kind === layer.id);
    });
  }

  public toOptionMap(): OptionMap {
    const optionMap: OptionMap = {
      city: 0,
      extent: this.extent.toJson(),
      height: this.height,
      width: this.width,
    };
    optionMap.title = this.title;

    const graphics = this.graphics.graphics
      .filter((g) => g.symbol !== undefined)
      .map((g) => g.toJson());
    optionMap.graphics = graphics;

    if (this.isCityMap()) {
      optionMap.city = 1;
    } else {
      optionMap.city = 0;
    }

    return optionMap;
  }

  public isCityMap(): boolean {
    return this.layers.some((rootLayer: RootLayer) =>
      rootLayer.layers().some((l: Layer) => l.id === "city" && l.visible),
    );
  }
}
