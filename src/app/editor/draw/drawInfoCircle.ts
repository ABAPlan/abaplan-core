import Draw = require("esri/toolbars/draw");
import Edit = require("esri/toolbars/edit");

import { DrawInfoBasicGeometry } from "./drawInfoBasicGeometry";

export class DrawInfoCircle extends DrawInfoBasicGeometry {
  constructor(texture?: string) {
    if (!texture) {
      texture = "black";
    }

    super(Draw.CIRCLE, texture, (Edit.SCALE | Edit.MOVE) as any);
  }
}
