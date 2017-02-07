import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* Bootstrap modules */
import { TabsModule } from 'ng2-bootstrap';

/* Rx tools */
import 'rxjs/add/operator/map';

/* App root */
import { AppComponent } from './app.component';

/* Feature Modules */
import { CoreModule } from './core/core.module';
import  { MapModule } from './map/map.module';
import  { MapComponent } from './map/map.component';

import { ToolbarMapComponent } from './toolbar/toolbar.component';
import { ModalMapComponent } from "./modal-maps-list/modal-maps-list.component";
import { ModalSaveMapComponent } from "./modal-save-map/modal-save-map.component";

import { FormsModule } from '@angular/forms';

/* Routing Module */
// import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports: [
      BrowserModule
    , MapModule
    , CoreModule
    , TabsModule
    , FormsModule
  ],
  declarations: [ AppComponent, MapComponent, ToolbarMapComponent, ModalMapComponent, ModalSaveMapComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
