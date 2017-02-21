import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MapService } from "../core/map.service";
import { OptionMap } from "../core/map";
import * as _ from "lodash";

@Component({
  selector: 'aba-modal-maps',
  templateUrl: 'modal-maps-list.component.html',
  styleUrls: ['modal-maps-list.component.css']
})
export class ModalMapComponent {

  @Input('visible') visible: boolean = false;
  @Output() onSelectChoice: EventEmitter<number> = new EventEmitter();

  private maps: OptionMap[] = [];
  private filteredMaps: OptionMap[] = this.maps;
  private queryInputValue: string = "";
  private activePage = 1;
  private nbPaginations = 0;

  constructor(private mapService: MapService) {
    mapService.maps().subscribe(
      (maps : OptionMap[]) => {
        this.maps = maps;
        this.filteredMaps = maps.slice(0, 10);
        this.nbPaginations = Math.floor(this.maps.length/10);
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
  public close(): void {
    this.filteredMaps = this.maps;
    this.visible = false;
    this.queryInputValue = "";
  }

  private onChange(query: string): void {
    if (query !== ""){
      this.filteredMaps =
        this
          .maps
          .filter( m => m.title.toLowerCase().includes(query.toLowerCase()) || m.uid.toString().includes(query));
      this.nbPaginations = Math.floor(this.filteredMaps.length/10);

      this.filteredMaps = this.filteredMaps.slice(0, 10);

    }else{
      this.filteredMaps =
        this.maps.slice(0, 10);
      this.nbPaginations = Math.floor(this.maps.length/10);
    }
  }

  private onClick(id: number): void {
    this.close();
    this.onSelectChoice.emit(id);
  }

  private range(n): [number] {
    return _.range(1, n+1);
  }

}
