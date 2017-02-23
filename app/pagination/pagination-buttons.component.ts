import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MapService } from "../core/map.service";
import { OptionMap } from "../core/map";
import * as _ from "lodash";

const Pagination = require('../core/puresc-helper/paginate');


@Component({
  selector: 'aba-pagination-buttons',
  templateUrl: 'pagination-buttons.component.html',
  styleUrls: ['pagination-buttons.component.css']
})
export class PaginationComponent {

  private activePage: number;
  @Input() collectionSize: number;
  @Input() chunkSize: number;
  @Output() selectedPageChange: EventEmitter<number> = new EventEmitter();
  @Input()
  get selectedPage() { return this.activePage; }
  set selectedPage(val: number){
    this.activePage = val;
    this.selectedPageChange.emit(val);
  }


  constructor(){

  }

  private paginationButtonClick(id: string): void {
    this.activePage = parseInt(id);
    this.selectedPageChange.emit(this.activePage);
  }
  private movePagination(inc: number): void {
    this.paginationButtonClick((this.activePage+inc).toString());
  }

  private paginate(activePage: string, size: number): string[] {
    const length = Math.ceil(size/this.chunkSize);
    return Pagination.paginate(length)(parseInt(activePage));
  }
}
