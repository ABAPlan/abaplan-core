import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";

import { AppRoutingModule } from "./app-routing.module";

import {TranslateModule} from "ng2-translate";

import {} from "@types/googlemaps";

/* Feature Modules:
 * - TouchpadModule for voices interactivity with touchpad device
 * - EditorModule for editing, creating and saving new maps
 * - BlindCreatorModule for creating and saving new maps for blind people
 */
import { BlindCreatorModule } from "./blind-creator/blind-creator.module";
import { EditorModule } from "./editor/editor.module";
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
  ],
  providers: [{provide: APP_BASE_HREF, useValue : "/" }],
})

export class AppModule { }
