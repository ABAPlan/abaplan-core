import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as _ from 'lodash'

@Component({
  selector: "aba-pagination-buttons",
  styleUrls: ["pagination-buttons.component.css"],
  templateUrl: "pagination-buttons.component.html"
})
export class PaginationComponent {
  get activePageNumero(): number {
    return this._activePageNumero;
  }
  set activePageNumero(newValue: number) {
    this._activePageNumero = newValue;
  }

  @Input() private collectionSize: number;
  @Input() private chunkSize: number;
  get pageNumber() {
    return Math.ceil(this.collectionSize / this.chunkSize);
  }
  @Output()
  private selectedPageChange: EventEmitter<number> = new EventEmitter();
  @Input()
  get selectedPage() {
    return this.activePageNumero;
  }
  set selectedPage(val: number) {
    this.activePageNumero = val;
    this.selectedPageChange.emit(val);
  }

  private _activePageNumero: number;

  private paginationButtonClick(id: string): void {
    this.activePageNumero = +id;
    this.selectedPageChange.emit(this.activePageNumero);
  }
  private movePagination(inc: number): void {
    this.paginationButtonClick((this.activePageNumero + inc).toString());
  }

  public getPagination(): Array<string> {
    // no pages
    if (this.pageNumber === 0) {
      return [];
    }
    // less than 10 pages
    else if (this.pageNumber < 10) {
      return _.range(1, this.pageNumber + 1).map((value, index) => String(index));
    }
    // more than 10 pages
    else {
      // currently in the 5 first
      if (this.activePageNumero <= 5) {
        return [
          ..._.range(1, 7 + 1).map(value => String(value)),
          '...',
          ..._.range(this.pageNumber - 1, this.pageNumber + 1).map(value => String(value))
        ]
      }
      // currently in the 5 last
      else if (this.activePageNumero >= this.pageNumber - 5) {
        return [
          ..._.range(1, 2 + 1).map(value => String(value)),
          "...",
          ..._.range(this.pageNumber - 6, this.pageNumber + 1).map(value => String(value))
        ];
      }
      // in the middle
      else {
        return [
          ..._.range(1, 2 + 1).map(value => String(value)),
          "...",
          ..._.range(this.activePageNumero - 1, this.activePageNumero + 4).map(value => String(value)),
          "...",
          ..._.range(this.pageNumber - 1, this.pageNumber + 1).map(value => String(value))
        ];
      }
    }
  }
}
