import {RootLayer} from "../layer";
import OsmSubLayer from "./OsmSubLayer";

/**
 * ArcgisMap Layer for OpenStreet Map representation
 */
export default class OsmRootLayer extends RootLayer {
  constructor() {
    super({ kind: "osm" });
    this.addLayer(new OsmSubLayer());
  }
}
