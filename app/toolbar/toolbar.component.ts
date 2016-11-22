import { Component, Input } from "@angular/core";
import { LayerType } from '../core/layer';

interface ITool { heading: string }
type Tool = (DrawTool | EditTool) & ITool;
interface DrawTool { kind: 'draw' }
interface EditTool { kind: 'edit' }

@Component({
  selector: 'aba-toolbar-map',
  templateUrl: 'toolbar.component.html',
  styles: ['.show-grid { margin-bottom:10px; }']
})
export class ToolbarMapComponent {

  @Input() activeTab: LayerType;

  private tools: Array<Tool> = [
    {
      heading: "Cercle",
      kind: 'draw'
    },
    {
      heading: "Polygone",
      kind: 'draw'
    },
    {
      heading: "Traitillés",
      kind: 'draw'
    },
    {
      heading: "Passage piétons",
      kind: 'draw'
    },
    {
      heading: "Sélectionner",
      kind: 'edit'
    },
    {
      heading: "Supprimer",
      kind: 'edit'
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

  public isEditableEditButton(): boolean {
    if(this.activeTab){
      return this.activeTab.kind !== 'osm';
    }
    return false;
  }
}


