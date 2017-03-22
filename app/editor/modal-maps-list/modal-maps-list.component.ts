import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MapService } from "../../core/map.service";
import { OptionMap } from "../../core/map";
import * as _ from "lodash";



@Component({
  selector: 'aba-modal-maps',
  templateUrl: 'modal-maps-list.component.html',
  styleUrls: ['modal-maps-list.component.css']
})
export class ModalMapComponent {

  @Input('visible') visible: boolean = false;
  @Output() onSelectEvent: EventEmitter<[number, string]> = new EventEmitter();

  private maps: OptionMap[] = [];
  private queryInputValue: string = "";
  private activePage = 1;
  private readonly chunkListSize = 8;


  constructor(private mapService: MapService) {
  }

  private isVisible(): boolean {
    return this.visible;
  }

  public open(): void {
    this.visible = true;
    this.activePage = 1;
    this.queryInputValue = "";

    this.mapService.maps().subscribe(
      (maps : OptionMap[]) => {
        this.maps = maps;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  public close(): void {
    this.visible = false;
  }

  private onChange(): void {
      this.activePage = 1;
  }

  private onClick(info: [number, string]): void {
    this.close();
    this.onSelectEvent.emit(info);
  }

  private range(n): number[] {
    return _.range(1, n+1);
  }

  private updateSelectedPage(idPage: number){
    this.activePage = idPage;
  }

}
