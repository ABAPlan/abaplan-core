import { Component } from "@angular/core";
import { TranslateService } from "ng2-translate";

@Component({
  selector: "aba-plan",
  template: "<hotkeys-cheatsheet></hotkeys-cheatsheet><router-outlet></router-outlet>",
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    // Init Translate Service for the site
    const languages = ["fr", "en", "de", "it"];
    translateService.addLangs(languages);
    translateService.setDefaultLang("fr");
    languages.forEach((lang) => translateService.use(lang));
    translateService.use(this.translateService.getBrowserLang());
  }

}
