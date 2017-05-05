import { Component } from '@angular/core';

import {TranslateService} from 'ng2-translate';
import {ScalarObservable} from 'rxjs/observable/ScalarObservable';
@Component({
  selector: 'aba-plan',
  template: '<router-outlet></router-outlet>'

})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    // Init Translate Service for the site
    let languages = ['fr', 'en'];
    translateService.addLangs(languages);
    translateService.setDefaultLang('fr');
    translateService.use(languages[0]);

  }

}
