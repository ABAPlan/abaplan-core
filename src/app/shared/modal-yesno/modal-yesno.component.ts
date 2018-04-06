import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "aba-modal-yesno",
  styleUrls: ["modal-yesno.component.css"],
  templateUrl: "modal-yesno.component.html",
})
export class ModalYesNoComponent {

  @Input("visible") public visible: boolean = false;
  @Output() public onYesEvent: EventEmitter<any> = new EventEmitter();
  @Output() public onCloseEvent: EventEmitter<any> = new EventEmitter();

  private title: string = "";

  public open(): void {
    this.visible = true;
  }

  public close(): void {
    this.visible = false;
  }

  public closeWithNo(): void {
    this.visible = false;
    this.onCloseEvent.emit( {} );
  }

  private isVisible(): boolean {
    return this.visible;
  }

  private onSubmit(): void {
    this.close();
    this.onYesEvent.emit( {} );
  }

}
