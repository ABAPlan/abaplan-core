import { Component, Input } from "@angular/core";
import { MapService } from "../core/map.service";
import {OptionMap} from "../core/map";

@Component({
  selector: 'aba-modal-maps',
  templateUrl: 'modal-maps-list.component.html',
  styleUrls: ['modal-maps-list.component.css']
})
export class ModalMapComponent {

  @Input('visible') visible: boolean = false;

  constructor(private mapService: MapService) {
    mapService.maps().subscribe(
      (maps : OptionMap[]) => {
        maps.forEach( m => console.log(m) );
      },
      (error) => {
        console.log(error);
      }
    );

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
}
