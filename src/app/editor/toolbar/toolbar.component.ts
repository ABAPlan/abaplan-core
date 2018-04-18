import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as deleteIconUrl from "Assets/img/icons/mouseActions/delete.png";
import * as moveIconUrl from "Assets/img/icons/mouseActions/move.png";
import * as selectIconUrl from "Assets/img/icons/mouseActions/select.png";
import * as openIconUrl from "Assets/img/icons/operations/open.png";
import * as printIconUrl from "Assets/img/icons/operations/print.png";
import * as saveIconUrl from "Assets/img/icons/operations/save.png";
import * as circleIconUrl from "Assets/img/icons/shapes/circle.png";
import * as pedestrianIconUrl from "Assets/img/icons/shapes/pedestrian.png";
import * as polygonIconUrl from "Assets/img/icons/shapes/polygon.png";
import * as tiledLinesIconUrl from "Assets/img/icons/shapes/tiledLines.png";
import * as blackTextureFillUrl from "Assets/img/icons/textures/black.png";
import * as vegetationIconUrl from "Assets/img/icons/textures/vegetation.png";
import * as waterIconUrl from "Assets/img/icons/textures/water.png";
import * as whiteTextureFillUrl from "Assets/img/icons/textures/white.png";
import { TranslateService } from "ng2-translate";
import { LayerType } from "../../map/layer";

export interface Button {
  tooltip: string;
  imageURL: string;
  id: string;
}

@Component({
  selector: "aba-toolbar-map",
  styleUrls: ["toolbar.component.css"],
  templateUrl: "toolbar.component.html",
})
export class ToolbarMapComponent {
  @Input() public activeTab: LayerType;
  @Output() public onUpdateTool: EventEmitter<string> = new EventEmitter();
  @Output() public onUpdateTexture: EventEmitter<string> = new EventEmitter();
  @Output() public onOperation: EventEmitter<string> = new EventEmitter();

  private toolButtons: Button[] = [
    {
      id: "move",
      imageURL: moveIconUrl,
      tooltip: "move",
    },
    {
      id: "select",
      imageURL: selectIconUrl,
      tooltip: "select",
    },
    {
      id: "delete",
      imageURL: deleteIconUrl,
      tooltip: "delete",
    },
    {
      id: "circle",
      imageURL: circleIconUrl,
      tooltip: "draw_circle",
    },
    {
      id: "polygon",
      imageURL: polygonIconUrl,
      tooltip: "draw_polygon",
    },
    {
      id: "line",
      imageURL: tiledLinesIconUrl,
      tooltip: "draw_traits",
    },
    {
      id: "pedestrian",
      imageURL: pedestrianIconUrl,
      tooltip: "draw_pedestrian",
    },
  ];

  private textureButtons: Button[] = [
    {
      id: "black",
      imageURL: blackTextureFillUrl,
      tooltip: "texture_black",
    },
    {
      id: "white",
      imageURL: whiteTextureFillUrl,
      tooltip: "texture_white",
    },
    {
      id: "water",
      imageURL: waterIconUrl,
      tooltip: "texture_water",
    },
    {
      id: "vegetation",
      imageURL: vegetationIconUrl,
      tooltip: "texture_vegetation",
    },
  ];

  private operationButtons: Button[] = [
    {
      id: "print",
      imageURL: printIconUrl,
      tooltip: "print",
    },
    {
      id: "open",
      imageURL: openIconUrl,
      tooltip: "open",
    },
    {
      id: "save",
      imageURL: saveIconUrl,
      tooltip: "save",
    },
  ];

  private activeToolId: string = this.toolButtons[0].id;
  private activeTextureId: string = this.textureButtons[0].id;

  constructor(private translateService: TranslateService) {}

  public toolButtonClick(toolId: string): void {
    this.activeToolId = toolId;
    this.onUpdateTool.emit(toolId);
  }

  public textureButtonClick(textureId: string): void {
    this.activeTextureId = textureId;
    this.onUpdateTexture.emit(textureId);
  }

  public operationButtonClick(operationId: string): void {
    this.onOperation.emit(operationId);
  }

  public isToolButtonActive(toolId: string) {
    return this.activeToolId === toolId;
  }

  public isTextureButtonActive(textureId: string) {
    return this.activeTextureId === textureId;
  }
}
