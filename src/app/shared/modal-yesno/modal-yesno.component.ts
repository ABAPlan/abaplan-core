import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'aba-modal-yesno',
  templateUrl: 'modal-yesno.component.html',
  styleUrls: ['modal-yesno.component.css']
})
export class ModalYesNoComponent {

  @Input('visible') visible: boolean = false;
  @Output() onYesEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCloseEvent: EventEmitter<any> = new EventEmitter();

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
  public closeWithNo(): void{
    this.visible = false;
    this.onCloseEvent.emit( {} );
  }

  private onSubmit(): void {
    this.close();
    console.log("sumbit)");
    this.onYesEvent.emit( {} );
  }

}
