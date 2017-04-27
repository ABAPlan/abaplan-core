import { Component } from '@angular/core';
import {TranslateService} from 'ng2-translate';
@Component({
  selector: 'aba-plan',
  template: '<router-outlet>{{"title"| translate}}</router-outlet>'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use('fr');
  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
}
