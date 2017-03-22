import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { LayerType } from '../core/layer';
import { DrawType } from '../editor/drawEditMap';

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

export type Tool = (DrawTool | EditTool | ActionTool) & ITool & Command;

@Component({
  selector: 'aba-toolbar-map',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarMapComponent {

  @Input() activeTab: LayerType;
  @Output() onUpdateTool: EventEmitter<Tool> = new EventEmitter();
  @Output() onSelectMap: EventEmitter<number> = new EventEmitter();
  @Output() onModalMapOpen: EventEmitter<object> = new EventEmitter();
  @Output() onModalSaveMapOpen: EventEmitter<object> = new EventEmitter();

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


  constructor(){ }


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
    console.log(tool);
    this.activeTool = tool;
    this.onUpdateTool.emit(tool);
    if (tool.heading === 'Ouvrir'){
//      this.modalMapComponent.open();
      this.onModalMapOpen.emit({});
    } else if (tool.heading === 'Sauvegarder') {
//      this.modalSaveMapComponent.open();
      this.onModalSaveMapOpen.emit({});
    }
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

  /* Fires when a user select a map in the modal view */
  /*
  private mapSelected(info: [number, string]): void {
    // We send this id upper
    this.onSelectMap.emit(info[0]);
    this.onSetMapTitle.emit(info[1]);
  }
  */

  /* Fires when a user insert a map in the modal view */
  /*
  private mapInsert(info: any): void {
    // We send this title upper
    this.onSetMapTitle.emit(info.title);
    this.onSaveMapWithTitle.emit(info.title);
  }
  */
}
