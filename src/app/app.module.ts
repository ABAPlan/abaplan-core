import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HotkeyModule } from "angular2-hotkeys";
import { TranslateModule } from "ng2-translate";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BlindCreatorModule } from "./blind-creator/blind-creator.module";
import { CoreModule } from "./core/core.module";
import { EditorModule } from "./editor/editor.module";
import { AbaplanHotkeysService } from "./shared/abaplanHotkeysService";
import { TouchpadModule } from "./touchpad/touchpad.module";

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    TouchpadModule,
    EditorModule,
    BlindCreatorModule,
    TranslateModule.forRoot(),
    HotkeyModule.forRoot(),
  ],
  providers: [
    AbaplanHotkeysService,
    {provide: APP_BASE_HREF, useValue : "/" },
  ],
})

export class AppModule {}
