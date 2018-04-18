import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as _ from "lodash";
import { TranslateService } from "ng2-translate";
import { OptionMap } from "../../map/map";
import { MapService } from "../../map/map.service";

@Component({
  selector: "aba-modal-maps",
  styleUrls: ["modal-maps-list.component.css"],
  templateUrl: "modal-maps-list.component.html",
})
export class ModalMapComponent {
  @Input("visible") public visible: boolean = false;
  @Output() public onSelectEvent: EventEmitter<[number, string]> = new EventEmitter();

  private maps: OptionMap[] = [];
  private queryInputValue: string = "";
  private activePage = 1;
  private readonly chunkListSize = 8;

  constructor(
    private mapService: MapService,
    private translateService: TranslateService,
  ) {}

  public open(): void {
    this.visible = true;
    this.activePage = 1;
    this.queryInputValue = "";

    this.mapService.maps().subscribe(
      (maps: OptionMap[]) => {
        this.maps = maps;
      },
      (error) => console.error(error), // tslint:disable-line no-console
    );
  }

  public close(): void {
    this.visible = false;
  }

  private isVisible(): boolean {
    return this.visible;
  }

  private onChange(): void {
    this.activePage = 1;
  }

  private onClick(info: [number, string]): void {
    this.close();
    this.onSelectEvent.emit(info);
  }

  private range(n): number[] {
    return _.range(1, n + 1);
  }

  private updateSelectedPage(idPage: number) {
    this.activePage = idPage;
  }
}
