import { Component, Input } from "@angular/core";




@Component({
  selector: 'aba-toolbar-map',
  templateUrl: 'toolbar.component.html',
  styles: ['.show-grid { margin-bottom:10px; }']
})
export class ToolbarMapComponent {

  @Input() activeTab: any;

  private drawTools: Array<any> = [
    {
      heading: "Cercle"
    },
    {
      heading: "Polygone"
    },
    {
      heading: "Traitillés"
    },
    {
      heading: "Passage piétons"
    }
  ];
  private activeDrawTool;

  private editTools: Array<any> = [
    {
      heading: "Sélectionner"
    },
    {
      heading: "Supprimer"
    },
  ];
  private activeEditTool;

  editableMode: boolean = false;

  constructor(){
  }

  public isActiveDrawTool(tool: any) {
    return tool === this.activeDrawTool;
  }
  public isActiveEditTool(tool: any) {
    return tool === this.activeEditTool;
  }
  public changeEditableState(): void {
    this.editableMode = !this.editableMode;
  }

  public isEditableMode(): boolean {
    return this.editableMode;
  }

  public isEditableEditButton(): boolean {
    if(this.activeTab){
      return this.activeTab.kind !== 'osm';
    }
    return false;
  }
}


