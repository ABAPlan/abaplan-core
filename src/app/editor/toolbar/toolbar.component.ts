import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { LayerType } from '../../map/layer';
import { DrawType } from '../drawEditMap';

import {TranslateService} from 'ng2-translate';

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

export interface ITool {  image?: string, command: string }

export interface DrawTool { kind: 'draw', drawType : DrawType }
export interface ActionTool { kind: 'action' }
export interface EditTool { kind: 'edit' }
export interface TextureTool { kind: 'texture',color:string,texture:string}

export type Command = Move | Select | Delete | Texture | DrawCircle | DrawPolygon | DrawTraits | DrawPedestrian | Print | Open | Save | Fill;
export interface Move { command: "move"; }
export interface Select { command: "select"; }
export interface Delete { command: "delete"; }
export interface Texture { command: "texture"; }
export interface DrawCircle { command: "draw_circle"; }
export interface DrawPolygon { command: "draw_polygon"; }
export interface DrawTraits { command: "draw_traits"; }
export interface DrawPedestrian { command: "draw_pedestrian"; }
export interface Print { command: "print"; }
export interface Open { command: "open"; }
export interface Save { command: "save"; }

export interface Fill { command: "fill"; }

export type KindTool = (DrawTool | EditTool | ActionTool | TextureTool);
export type Tool = KindTool & ITool & Command;

@Component({
  selector: 'aba-toolbar-map',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarMapComponent {

  @Input() activeTab: LayerType;
  @Output() onUpdateTool: EventEmitter<Tool> = new EventEmitter();

  // Array of state for the fill button 
  private fillState : Array<Tool> = [
    {
      kind: 'texture',
      command: 'fill',
      image: blackTextureFillUrl,
      color: 'white',
      texture: 'black'
    },
    {
      kind: 'texture',
      command: 'fill',
      image: whiteTextureFillUrl,
      color: 'black',
      texture: 'white'
    },
    {
      kind: 'texture',
      command: 'fill',
      image: waterIconUrl,
      color: 'black',
      texture: 'water'
    },
  ];
  private activeFill: number = 0;

  private tools: Array<Tool> = [
    {
      kind: 'edit',
      command: 'move',
      image: moveIconUrl,
    },
    {
      kind: 'edit',
      command: 'select',
      image: selectIconUrl,
    },
    {
      kind: 'edit',
      command: 'delete',
      image: deleteIconUrl,
    },
    {
      kind: 'draw',
      command: 'draw_circle',
      drawType : <DrawType>{ kind: 'circle' },
      image: circleIconUrl,
    },
    {
      kind: 'draw',
      command: 'draw_polygon',
      drawType : <DrawType>{ kind: 'polygon' },
      image: polygonIconUrl,
    },
    {
      kind: 'draw',
      command: 'draw_traits',
      drawType : <DrawType>{ kind: 'line' },
      image: tiledLinesIconUrl,
    },
    {
      kind: 'draw',
      command: 'draw_pedestrian',
      drawType : <DrawType>{ kind: 'pedestrian' },
      image: pedestrianIconUrl,
    },
    {
      kind: 'action',
      command: 'print',
      image: printIconUrl,
    },
    {
      kind: 'action',
      command: 'open',
      image: openIconUrl,
    },
    {
      kind: 'action',
      command: 'save',
      image: saveIconUrl,
    },
    {
      kind: 'texture',
      command: 'fill',
      image: this.fillState[this.activeFill].image,
      color: (this.fillState[this.activeFill]as TextureTool).color,
      texture : (this.fillState[this.activeFill]as TextureTool).texture
    }
  ];
  private activeTool: Tool = this.tools[0];
  


  constructor(private translateService: TranslateService){ }


  private drawTools(): Array<Tool> {
    return this.tools.filter( (tool) => tool.kind === 'draw');
  }

  private editTools(): Array<Tool> {
    return this.tools.filter( (tool) => tool.kind === 'edit');
  }

  private actionTools(): Array<Tool> {
    return this.tools.filter( (tool) => tool.kind === 'action');
  }

  private textureTools(): Array<Tool> {
    return this.tools.filter( (tool) => tool.kind === 'texture');
  }

  public changeFillTool():string{
    const item : TextureTool = (this.tools.filter( (tool) => tool.command === 'fill'))[0] as TextureTool;
    this.increaseActiveFill();
    item.color = (this.fillState[this.activeFill]as TextureTool).color;
    (item as Tool).image = this.fillState[this.activeFill].image;
    item.texture = (this.fillState[this.activeFill]as TextureTool).texture;

    return item.texture;
  }

  private increaseActiveFill() : void{
    this.activeFill++;
    if(this.fillState.length == this.activeFill)
      this.activeFill = 0;
  }

  public isActive(tool: Tool){
    return tool === this.activeTool;
  }

  public onClick(tool: Tool) {
    this.activeTool = tool;
    this.onUpdateTool.emit(tool);
  }

  public changeEditableState(): void {
      this.activeTool = this.tools[0];
  }

  public getActiveToolKind(): string{
    return this.activeTool.kind;
  }

  public isEditableEditButton(): boolean {
    if(this.activeTab){
      return this.activeTab.kind !== 'osm';
    }
    return false;
  }

}
