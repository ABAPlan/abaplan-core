import Extent = require("esri/geometry/Extent");
import Graphic = require("esri/graphic");
import OpenStreetMapLayer = require("esri/layers/OpenStreetMapLayer");
import ArcgisMap = require("esri/map");

import ArcgisDraw = require("esri/toolbars/draw");
import ArcgisEdit = require("esri/toolbars/edit");

import { DrawInfo } from "./draw/drawInfoBasicGeometry";
import { DrawInfoCircle } from "./draw/drawInfoCircle";
import { DrawInfoPedestrian } from "./draw/drawInfoPedestrian";
import { DrawInfoPolygon } from "./draw/drawInfoPolygon";
import { DrawInfoPolyline } from "./draw/drawInfoPolyline";

export class AbaDrawEdit {
  private map: ArcgisMap;
  private currentDrawInfo: DrawInfo;
  private currentDrawTypeKind: string; // Remember the string key of drawTypes[]

  private deleteEnabled: boolean;
  private editEnabled: boolean;

  /**
   * DrawTypes object foreach kind
   * Warning, must have same kinds with DrawType
   */
  private drawTypes: { [name: string]: DrawInfo } = {
    circle: new DrawInfoCircle(),
    line: new DrawInfoPolyline(),
    pedestrian: new DrawInfoPedestrian(),
    polygon: new DrawInfoPolygon(),
  };

  private edit: ArcgisEdit;
  private draw: ArcgisDraw;

  public constructor(map: ArcgisMap) {
    this.map = map;
    this.edit = new ArcgisEdit(map);
    this.draw = new ArcgisDraw(map);

    this.loadAllDrawTypes();

    this.registerOnDrawComplete();
    this.registerOnMapClickGraphic();
    this.registerOnEditDeactivate();

    this.enableDelete(false);
    this.enableEdit(false);
  }

  public registerOnMapClickGraphic() {
    this.map.graphics.on("click", (e: { graphic: any }) => {
      /** For delete */
      if (this.deleteEnabled) {
        // For current release
        if (e.graphic.attributes && e.graphic.attributes.kind) {
          this.drawTypes[e.graphic.attributes.kind].delete(this.map, e.graphic);
        } else if (
          e.graphic.attributes &&
          e.graphic.attributes.passage_pieton
        ) {
          // For old release compatibility : pedestrian => to delete in future..
          this.drawTypes.pedestrian.delete(this.map, e.graphic);
        } else {
          // For old release compatibility : all shapes => to delete in future..
          this.map.graphics.remove(e.graphic);
        }
      }
      /** For edit */
      if (this.editEnabled) {
        if (e.graphic.attributes && e.graphic.attributes.kind) {
          // Get the type
          const drawType = this.drawTypes[e.graphic.attributes.kind];
          const editTools: any = drawType.editTools;
          const graphics = this.map.graphics;

          // Get the graphic to edit
          const graphicToEdit: Graphic = drawType.getEditionGraphic(
            this.map,
            this.drawGraphicFunction(e.graphic.attributes.kind),
            e.graphic,
          );

          // Activate
          this.edit.activate(editTools, graphicToEdit);
        }
      }
    });
  }

  // On edit deactivate : call finishEdit of drawType
  public registerOnEditDeactivate() {
    this.edit.on(
      "deactivate",
      (event: { graphic: Graphic; info: any; tool: string }) => {
        const drawType = this.drawTypes[event.graphic.attributes.kind];
        drawType.finishEdit(
          this.map,
          this.drawGraphicFunction(event.graphic.attributes.kind),
          event.graphic,
        );
      },
    );
  }

  // On draw complete : call draw of drawType
  public registerOnDrawComplete() {
    this.draw.on("draw-complete", (event) => {
      // Call draw complete of current draw info
      const currentDrawTypeKind = this.currentDrawTypeKind;
      const graphics = this.map.graphics;

      this.currentDrawInfo.draw(
        // Callback to add graphics
        this.drawGraphicFunction(currentDrawTypeKind),
        event,
      );
    });
  }

  // Load all graphics by draw types
  public loadAllDrawTypes = () => {
    // Class all graphics by kind
    const graphicsDrawTypes = {};
    this.map.graphics.graphics.forEach((g) => {
      try {
        const kind = g.attributes.kind;

        if (this.drawTypes[kind] === undefined && process.env.NODE_ENV !== "production") {
          // tslint:disable-next-line no-console
          console.warn("Graphic kind not supported (kind not implemented)");
        } else {
          if (!graphicsDrawTypes[kind]) {
            graphicsDrawTypes[kind] = [];
          } else {
            graphicsDrawTypes[kind].push(g);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          // tslint:disable-next-line no-console
          console.warn("Graphic kind not supported (empty kind)", g);
        }
      }
    });

    // Load all graphics by kind
    Object.keys(this.drawTypes).forEach((type) => this.drawTypes[type].onLoad(graphicsDrawTypes[type]));
  }

  public drawGraphicFunction = (typeKind: string) => {
    return (graphic: Graphic) => {
      if (!graphic.attributes) {
        graphic.attributes = {};
      }

      graphic.attributes.kind = /*this.currentEditTypeKind*/ typeKind;
      this.map.graphics.add(graphic);
    };
  }

  public enableDraw(enable: boolean, drawType?: string) {
    if (enable && drawType) {
      this.currentDrawTypeKind = drawType;
      this.currentDrawInfo = this.drawTypes[drawType];
      this.draw.activate(this.currentDrawInfo.geometryType);
    } else {
      this.draw.deactivate();
    }
  }

  /* Change Texture of all the draw type */
  public changeTexture(texture: string) {
    // Can't access directly to all the object need to get the key first
    Object.keys(this.drawTypes).forEach((key) =>
      this.drawTypes[key].changeTexture(texture),
    );
  }

  public enableDelete(enable: boolean) {
    this.deleteEnabled = enable;
  }

  public enableEdit(enable: boolean) {
    this.editEnabled = enable;
    if (!enable) {
      this.edit.deactivate();
    }
  }
}
