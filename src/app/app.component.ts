import { Component } from '@angular/core';
import {TranslateService} from 'ng2-translate';
@Component({
  selector: 'aba-plan',
  template: '  <a (click)="changeLang(\'en\')">EN</a>  <a (click)="changeLang(\'fr\')">FR</a> <router-outlet></router-outlet>'

})
export class AppComponent {
  constructor(private translate: TranslateService) {
    let languages = ['en', 'fr'];
    translate.addLangs(languages);
    translate.setDefaultLang('en');
    translate.use('fr');
  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
}
