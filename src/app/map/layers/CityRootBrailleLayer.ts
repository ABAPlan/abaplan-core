import { RootLayer } from "../layer";
import CityBrailleSubLayer from "./CityBrailleSubLayer";

/**
 * ArcgisMap Layer for City Braille representation
 */
export default class CityRootBrailleLayer extends RootLayer {
  constructor() {
    super({ kind: "city" });
    this.addLayer(new CityBrailleSubLayer());
  }
}
