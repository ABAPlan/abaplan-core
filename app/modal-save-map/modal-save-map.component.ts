import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'aba-modal-save-map',
  templateUrl: 'modal-save-map.component.html',
  styleUrls: ['modal-save-map.component.css']
})
export class ModalSaveMapComponent {

  @Input('visible') visible: boolean = false;
  @Output() onMapSubmit: EventEmitter<any> = new EventEmitter();

  private title: string = "";

  constructor() {
  }

  private isVisible(): boolean {
    return this.visible;
  }

  public open(): void {
    this.visible = true;
  }
  public close(): void{
    this.visible = false;
  }

  private onSubmit(): void {
    this.close();
    this.onMapSubmit.emit( {title: this.title} );
  }

}
