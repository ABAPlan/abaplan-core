import { Component, Input, Output, EventEmitter } from "@angular/core";
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'aba-select-lang',
  templateUrl: 'select-lang.component.html',
  styleUrls: ['select-lang.component.css']
})
export class SelectLangComponent {

  private _langsDropDowns : Array<string> = this.translateService.getLangs();
  private _activeLangsDropDowns : string = this.translateService.getBrowserLang();;

  constructor(private translateService: TranslateService) {
  }

  /** Triggerd when user change the lang */
  onChange(newValue) {
    this.translateService.use(newValue);
  }

}
