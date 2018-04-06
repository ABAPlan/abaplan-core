import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { LayerType } from "../../map/layer";
import { DrawType } from "../drawEditMap";

import { TranslateService } from "ng2-translate";

import * as blackTextureFillUrl from "Assets/img/textures/blackTextureFill.png";
import * as whiteTextureFillUrl from "Assets/img/textures/whiteTextureFill.png";

import * as waterIconUrl from "Assets/img/icons/textures/water.png";

import * as deleteIconUrl from "Assets/img/icons/mouseActions/delete.png";
import * as moveIconUrl from "Assets/img/icons/mouseActions/move.png";
import * as selectIconUrl from "Assets/img/icons/mouseActions/select.png";

import * as circleIconUrl from "Assets/img/icons/shapes/circle.png";
import * as pedestrianIconUrl from "Assets/img/icons/shapes/pedestrian.png";
import * as polygonIconUrl from "Assets/img/icons/shapes/polygon.png";
import * as tiledLinesIconUrl from "Assets/img/icons/shapes/tiledLines.png";

import * as openIconUrl from "Assets/img/icons/operations/open.png";
import * as printIconUrl from "Assets/img/icons/operations/print.png";
import * as saveIconUrl from "Assets/img/icons/operations/save.png";

export interface ITool {// tslint:disable-line interface-name
  image?: string;
  command: string;
}

export interface DrawTool {
  kind: "draw";
  drawType: DrawType;
}
export interface ActionTool {
  kind: "action";
}
export interface EditTool {
  kind: "edit";
}
export interface TextureTool {
  kind: "texture";
  color: string;
  texture: string;
}

export type Command =
  | Move
  | Select
  | Delete
  | Texture
  | DrawCircle
  | DrawPolygon
  | DrawTraits
  | DrawPedestrian
  | Print
  | Open
  | Save
  | Fill;
export interface Move {
  command: "move";
}
export interface Select {
  command: "select";
}
export interface Delete {
  command: "delete";
}
export interface Texture {
  command: "texture";
}
export interface DrawCircle {
  command: "draw_circle";
}
export interface DrawPolygon {
  command: "draw_polygon";
}
export interface DrawTraits {
  command: "draw_traits";
}
export interface DrawPedestrian {
  command: "draw_pedestrian";
}
export interface Print {
  command: "print";
}
export interface Open {
  command: "open";
}
export interface Save {
  command: "save";
}

export interface Fill {
  command: "fill";
}

export type KindTool = DrawTool | EditTool | ActionTool | TextureTool;
export type Tool = KindTool & ITool & Command;

@Component({
  selector: "aba-toolbar-map",
  styleUrls: ["toolbar.component.css"],
  templateUrl: "toolbar.component.html",
})
export class ToolbarMapComponent {
  @Input() public activeTab: LayerType;
  @Output() public onUpdateTool: EventEmitter<Tool> = new EventEmitter();

  // Array of state for the fill button
  private fillState: Tool[] = [
    {
      color: "white",
      command: "fill",
      image: blackTextureFillUrl,
      kind: "texture",
      texture: "black",
    },
    {
      color: "black",
      command: "fill",
      image: whiteTextureFillUrl,
      kind: "texture",
      texture: "white",
    },
    {
      color: "black",
      command: "fill",
      image: waterIconUrl,
      kind: "texture",
      texture: "water",
    },
  ];
  private activeFill: number = 0;

  private tools: Tool[] = [
    {
      command: "move",
      image: moveIconUrl,
      kind: "edit",
    },
    {
      command: "select",
      image: selectIconUrl,
      kind: "edit",
    },
    {
      command: "delete",
      image: deleteIconUrl,
      kind: "edit",
    },
    {
      command: "draw_circle",
      drawType: { kind: "circle" } as DrawType,
      image: circleIconUrl,
      kind: "draw",
    },
    {
      command: "draw_polygon",
      drawType: { kind: "polygon" } as DrawType,
      image: polygonIconUrl,
      kind: "draw",
    },
    {
      command: "draw_traits",
      drawType: { kind: "line" } as DrawType,
      image: tiledLinesIconUrl,
      kind: "draw",
    },
    {
      command: "draw_pedestrian",
      drawType: { kind: "pedestrian" } as DrawType,
      image: pedestrianIconUrl,
      kind: "draw",
    },
    {
      command: "print",
      image: printIconUrl,
      kind: "action",
    },
    {
      command: "open",
      image: openIconUrl,
      kind: "action",
    },
    {
      command: "save",
      image: saveIconUrl,
      kind: "action",
    },
    {
      color: (this.fillState[this.activeFill] as TextureTool).color,
      command: "fill",
      image: this.fillState[this.activeFill].image,
      kind: "texture",
      texture: (this.fillState[this.activeFill] as TextureTool).texture,
    },
  ];
  private activeTool: Tool = this.tools[0];

  constructor(private translateService: TranslateService) {}

  public changeFillTool(): string {
    const item: TextureTool = this.tools.filter(
      (tool) => tool.command === "fill",
    )[0] as TextureTool;
    this.increaseActiveFill();
    item.color = (this.fillState[this.activeFill] as TextureTool).color;
    (item as Tool).image = this.fillState[this.activeFill].image;
    item.texture = (this.fillState[this.activeFill] as TextureTool).texture;

    return item.texture;
  }

  public isActive(tool: Tool) {
    return tool === this.activeTool;
  }

  public onClick(tool: Tool) {
    this.activeTool = tool;
    this.onUpdateTool.emit(tool);
  }

  public changeEditableState(): void {
    this.activeTool = this.tools[0];
  }

  public getActiveToolKind(): string {
    return this.activeTool.kind;
  }

  public isEditableEditButton(): boolean {
    if (this.activeTab) {
      return this.activeTab.kind !== "osm";
    }
    return false;
  }

  private drawTools(): Tool[] {
    return this.tools.filter((tool) => tool.kind === "draw");
  }

  private editTools(): Tool[] {
    return this.tools.filter((tool) => tool.kind === "edit");
  }

  private actionTools(): Tool[] {
    return this.tools.filter((tool) => tool.kind === "action");
  }

  private textureTools(): Tool[] {
    return this.tools.filter((tool) => tool.kind === "texture");
  }

  private increaseActiveFill(): void {
    this.activeFill++;
    if (this.fillState.length === this.activeFill) {
      this.activeFill = 0;
    }
  }
}
