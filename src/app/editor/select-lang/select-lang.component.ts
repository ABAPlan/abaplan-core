import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TranslateService } from "ng2-translate";

@Component({
  selector: "aba-select-lang",
  styleUrls: ["select-lang.component.css"],
  templateUrl: "select-lang.component.html",
})
export class SelectLangComponent {
  private _langsDropDowns: string[] = this.translateService.getLangs();
  private _activeLangsDropDowns: string = this.translateService.getBrowserLang();

  constructor(private translateService: TranslateService) {}

  /** Triggerd when user change the lang */
  public onChange(newValue) {
    this.translateService.use(newValue);
  }
}
