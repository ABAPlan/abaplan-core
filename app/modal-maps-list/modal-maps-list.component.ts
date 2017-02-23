import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MapService } from "../core/map.service";
import { OptionMap } from "../core/map";
import * as _ from "lodash";

const Pagination = require('../core/puresc-helper/paginate');


@Component({
  selector: 'aba-modal-maps',
  templateUrl: 'modal-maps-list.component.html',
  styleUrls: ['modal-maps-list.component.css']
})
export class ModalMapComponent {

  @Input('visible') visible: boolean = false;
  @Output() onSelectChoice: EventEmitter<number> = new EventEmitter();

  private maps: OptionMap[] = [];
  private queryInputValue: string = "";
  private activePage = 1;


  constructor(private mapService: MapService) {
    mapService.maps().subscribe(
      (maps : OptionMap[]) => {
        this.maps = maps;
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
    this.visible = false;
    this.queryInputValue = "";
  }

  private onChange(query: string): void {
      this.activePage = 1;
  }

  private onClick(id: number): void {
    this.close();
    this.onSelectChoice.emit(id);
  }

  private range(n): number[] {
    return _.range(1, n+1);
  }

  private paginationButtonClick(id: string): void {
    this.activePage = parseInt(id);
  }
  private movePagination(inc: number): void {
    this.paginationButtonClick((this.activePage+inc).toString());
  }

  private paginate(activePage: string, maps: OptionMap[]): string[] {
    const length = Math.ceil(maps.length/10);
    return Pagination.paginate(length)(parseInt(activePage));
  }
}
