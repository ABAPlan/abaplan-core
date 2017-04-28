import { Component, Input, Output, EventEmitter } from "@angular/core";
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'aba-modal-save-map',
  templateUrl: 'modal-save-map.component.html',
  styleUrls: ['modal-save-map.component.css']
})
export class ModalSaveMapComponent {

  @Input('visible') visible: boolean = false;
  @Output() onSaveEvent: EventEmitter<any> = new EventEmitter();

  private title: string = "";

  constructor(private translate: TranslateService) {
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
    this.onSaveEvent.emit( {title: this.title} );
  }

}
