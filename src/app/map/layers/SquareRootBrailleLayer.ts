import {RootLayer} from "../layer";
import RailroadBrailleSubLayer from "./RailroadBrailleSubLayer";
import SquareBrailleSubLayer from "./SquareBrailleSubLayer";

/**
 * ArcgisMap Layer for Square Braille representation
 */
export default class SquareRootBrailleLayer extends RootLayer {
  constructor() {
    super({ kind: "square" });
    this.addLayer(new SquareBrailleSubLayer());
    this.addLayer(new RailroadBrailleSubLayer());
  }
}
