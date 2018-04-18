import Draw = require("esri/toolbars/draw");
import Edit = require("esri/toolbars/edit");

import { DrawInfoBasicGeometry } from "./drawInfoBasicGeometry";

export class DrawInfoPolyline extends DrawInfoBasicGeometry {
  constructor(texture?: string) {
    if (!texture) {
      texture = "black";
    }

    super(Draw.POLYLINE, texture, (Edit.SCALE |
      Edit.MOVE |
      Edit.ROTATE |
      Edit.EDIT_VERTICES) as any);
  }
}
