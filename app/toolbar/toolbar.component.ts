import { Component, Input, Output, EventEmitter } from "@angular/core";
import { LayerType } from '../core/layer';
import { DrawType } from '../core/map';

interface DrawTool { kind: 'draw' }
interface EditTool { kind: 'edit' }

interface ITool { heading: string, image?: string }

type Tool = (DrawTool | EditTool | ActionTool) & ITool;
interface DrawTool { kind: 'draw', drawType : DrawType }
interface EditTool { kind: 'edit' }
interface ActionTool { kind: 'action' }

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
      image: require("file?name=./assets/[name].[ext]!./img/move.png")
    },
    {
      heading: "Sélectionner",
      kind: 'edit',
      image: require("file?name=./assets/[name].[ext]!./img/select.png")
    },
    {
      heading: "Supprimer",
      kind: 'edit',
      image: require("file?name=./assets/[name].[ext]!./img/delete.png")
    },
    {
      heading: "Cercle",
      kind: 'draw',
      drawType : <DrawType>{ kind: 'circle' },
      image: require("file?name=./assets/[name].[ext]!./img/circle.png")
    },
    {
      heading: "Polygone",
      kind: 'draw',
      drawType : <DrawType>{ kind: 'polygon' },
      image: require("file?name=./assets/[name].[ext]!./img/polygon.png")
    },
    {
      heading: "Traitillés",
      kind: 'draw',
      drawType : <DrawType>{ kind: 'line' },
      image: require("file?name=./assets/[name].[ext]!./img/dotted.png")
    },
    {
      heading: "Passage piétons",
      kind: 'draw',
      drawType : <DrawType>{ kind: 'pedestrian' },
      image: require("file?name=./assets/[name].[ext]!./img/pedestrian.png")
    },
    {
      heading: "Imprimer",
      kind: 'action',
      image: require("file?name=./assets/[name].[ext]!./img/print.png")
    },
    {
      heading: "Sauvegarder",
      kind: 'action',
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
    this.activeTool = tool;
    this.onUpdateTool.emit(tool);
  }

  public changeEditableState(): void {
      this.activeTool = this.tools[0];
  }

  public getActiveToolKind(): string{
    return this.activeTool.kind;
  }

  public getDrawType(): string{
    if(this.activeTool.kind === "draw"){
      let tool : DrawTool = <DrawTool>this.activeTool;
      return tool.drawType.kind;
    }
    else return undefined;
  }

  public isEditableEditButton(): boolean {
    if(this.activeTab){
      return this.activeTab.kind !== 'osm';
    }
    return false;
  }
}
