import { Component } from '@angular/core';

import {TranslateService} from 'ng2-translate';
import {ScalarObservable} from 'rxjs/observable/ScalarObservable';
@Component({
  selector: 'aba-plan',
  template: '  <a (click)="changeLang(\'en\')">EN</a>  <a (click)="changeLang(\'fr\')">FR</a> <router-outlet></router-outlet>'

})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    let languages = ['en', 'fr'];
    translateService.addLangs(languages);
    translateService.setDefaultLang('en');
    translateService.use('fr');

  }
  changeLang(lang: string) {
    this.translateService.use(lang);
  }



}
