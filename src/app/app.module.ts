import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

import {TranslateModule} from "ng2-translate";

/* Feature Modules:
 * - TouchpadModule for voices interactivity with touchpad device
 * - EditorModule for editing, creating and saving new maps
 */
import { TouchpadModule } from "./touchpad/touchpad.module";
import { EditorModule } from "./editor/editor.module";

@NgModule({
  imports: [
    TranslateModule.forRoot()
    , BrowserModule
    , CoreModule
    , AppRoutingModule
    , TouchpadModule
    , EditorModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }]
})

export class AppModule { }
