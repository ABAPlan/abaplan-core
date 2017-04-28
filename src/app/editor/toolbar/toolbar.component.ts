import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { LayerType } from '../../map/layer';
import { DrawType } from '../drawEditMap';

import {TranslateService} from 'ng2-translate';

export interface ITool { heading: string, image?: string, command: string }

export interface DrawTool { kind: 'draw', drawType : DrawType }
export interface ActionTool { kind: 'action' }
export interface EditTool { kind: 'edit' }

export type Command = Move | Select | Delete | DrawCircle | DrawPolygon | DrawTraits | DrawPedestrian | Print | Open | Save;
export interface Move { command: "move"; }
export interface Select { command: "select"; }
export interface Delete { command: "delete"; }
export interface DrawCircle { command: "draw_circle"; }
export interface DrawPolygon { command: "draw_polygon"; }
export interface DrawTraits { command: "draw_traits"; }
export interface DrawPedestrian { command: "draw_pedestrian"; }
export interface Print { command: "print"; }
export interface Open { command: "open"; }
export interface Save { command: "save"; }

export type KindTool = (DrawTool | EditTool | ActionTool);
export type Tool = KindTool & ITool & Command;

@Component({
  selector: 'aba-toolbar-map',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarMapComponent {

  @Input() activeTab: LayerType;
  @Output() onUpdateTool: EventEmitter<Tool> = new EventEmitter();

  private tools: Array<Tool> = [
    {
      heading: "Déplacer",
      kind: 'edit',
      command: 'move',
      image: require("file?name=./assets/[name].[ext]!./img/move.png")
    },
    {
      heading: "Sélectionner",
      kind: 'edit',
      command: 'select',
      image: require("file?name=./assets/[name].[ext]!./img/select.png")
    },
    {
      heading: "Supprimer",
      kind: 'edit',
      command: 'delete',
      image: require("file?name=./assets/[name].[ext]!./img/delete.png")
    },
    {
      heading: "Cercle",
      kind: 'draw',
      command: 'draw_circle',
      drawType : <DrawType>{ kind: 'circle' },
      image: require("file?name=./assets/[name].[ext]!./img/circle.png")
    },
    {
      heading: "Polygone",
      kind: 'draw',
      command: 'draw_polygon',
      drawType : <DrawType>{ kind: 'polygon' },
      image: require("file?name=./assets/[name].[ext]!./img/polygon.png")
    },
    {
      heading: "Traitillés",
      kind: 'draw',
      command: 'draw_traits',
      drawType : <DrawType>{ kind: 'line' },
      image: require("file?name=./assets/[name].[ext]!./img/dotted.png")
    },
    {
      heading: "Passage piétons",
      kind: 'draw',
      command: 'draw_pedestrian',
      drawType : <DrawType>{ kind: 'pedestrian' },
      image: require("file?name=./assets/[name].[ext]!./img/pedestrian.png")
    },
    {
      heading: "Imprimer",
      kind: 'action',
      command: 'print',
      image: require("file?name=./assets/[name].[ext]!./img/print.png")
    },
    {
      heading: "Ouvrir",
      kind: 'action',
      command: 'open',
      image: require("file?name=./assets/[name].[ext]!./img/open.png")
    },
    {
      heading: "Sauvegarder",
      kind: 'action',
      command: 'save',
      image: require("file?name=./assets/[name].[ext]!./img/save.png")
    },
  ];
  private activeTool: Tool = this.tools[0];


  constructor(private translate: TranslateService){ }


  private drawTools(): Array<Tool> {
    return this.tools.filter( (tool) => tool.kind === 'draw');
  }

  private editTools(): Array<Tool> {
    return this.tools.filter( (tool) => tool.kind === 'edit');
  }

  private actionTools(): Array<Tool> {
    return this.tools.filter( (tool) => tool.kind === 'action');
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
