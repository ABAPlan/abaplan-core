import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TranslateService } from "ng2-translate";

@Component({
  selector: "aba-modal-save-map",
  styleUrls: ["modal-save-map.component.css"],
  templateUrl: "modal-save-map.component.html",
})
export class ModalSaveMapComponent {
  @Input("visible") public visible: boolean = false;
  @Output() public onSaveEvent: EventEmitter<any> = new EventEmitter();

  private title: string = "";

  constructor(private translateService: TranslateService) {}

  public open(): void {
    this.visible = true;
  }

  public close(): void {
    this.visible = false;
  }

  private isVisible(): boolean {
    return this.visible;
  }

  private onSubmit(): void {
    this.close();
    this.onSaveEvent.emit({ title: this.title });
  }
}
