import Draw = require("esri/toolbars/draw");
import Edit = require("esri/toolbars/edit");

import { DrawInfoBasicGeometry } from "./drawInfoBasicGeometry";

export class DrawInfoPolygon extends DrawInfoBasicGeometry {
  constructor(texture?: string) {
    if (!texture) {
      texture = "black";
    }

    super(Draw.POLYGON, texture, (Edit.SCALE |
      Edit.MOVE |
      Edit.ROTATE |
      Edit.EDIT_VERTICES |
      Edit.ROTATE) as any);
  }
}
