import { Component, Input } from "@angular/core";
import { LayerType } from '../core/layer';
import { DrawType } from '../core/map';

interface DrawTool { kind: 'draw' }
interface EditTool { kind: 'edit' }

interface ITool { heading: string, icon?: string }

type Tool = (DrawTool | EditTool | ActionTool) & ITool;
interface DrawTool { kind: 'draw', drawType : DrawType }
interface EditTool { kind: 'edit' }
interface ActionTool { kind: 'action' }

@Component({
  selector: 'aba-toolbar-map',
  templateUrl: 'toolbar.component.html',
  styles: ['.show-grid { margin-bottom:10px; } .btn-primary { padding-bottom:10px; }']
})
export class ToolbarMapComponent {

  @Input() activeTab: LayerType;

  private tools: Array<Tool> = [
    {
      heading: "Déplacer",
      kind: 'edit',
      icon: 'glyphicon-move'
    },
    {
      heading: "Sélectionner",
      kind: 'edit'
    },
    {
      heading: "Supprimer",
      kind: 'edit',
      icon: 'glyphicon-remove'
    },
    {
      heading: "Cercle",
      kind: 'draw',
      drawType : <DrawType>{ kind: 'circle' }
    },
    {
      heading: "Polygone",
      kind: 'draw',
      drawType : <DrawType>{ kind: 'polygon' }
    },
    {
      heading: "Traitillés",
      kind: 'draw',
      drawType : <DrawType>{ kind: 'line' }
    },
    {
      heading: "Passage piétons",
      kind: 'draw',
      drawType : <DrawType>{ kind: 'pedestrian' }
    },
    {
      heading: "Imprimer",
      kind: 'action',
      icon: 'glyphicon-print'
    },
    {
      heading: "Sauvegarder",
      kind: 'action',
      icon: 'glyphicon-floppy-save'
    },
  ];
  private activeTool?: Tool;


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
  }

  public changeEditableState(): void {
    if ( this.isEditableMode() ){
      this.activeTool = undefined;
    }else{
      this.activeTool = this.tools[0];
    }
  }

  public isEditableMode(): boolean {
    return this.activeTool !== undefined;
  }

  public getActiveToolKind(): string{
    if(this.activeTool)
      return this.activeTool.kind;
    //TODO: ELSE ?
  }

  public getDrawType(): string{
    if(this.activeTool && this.activeTool.kind === "draw"){
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
