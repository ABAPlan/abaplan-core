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
import { MapModule } from './map/map.module';
import { MapComponent } from './map/map.component';
import { TouchpadComponent } from './touchpad/touchpad.component'
import { EditorComponent } from './editor/editor.component'

import { ToolbarMapComponent } from './toolbar/toolbar.component';
import { ModalMapComponent } from "./modal-maps-list/modal-maps-list.component";
import { ModalSaveMapComponent } from "./modal-save-map/modal-save-map.component";

import { PaginationComponent } from "./pagination/pagination-buttons.component"
import { FilterMapsPipe } from './modal-maps-list/filtermaps.pipe';
import { TakePipe, DropPipe, LengthPipe } from './core/pipes/collections.pipe';

import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
  imports: [
    BrowserModule
  , MapModule
  , CoreModule
  , TabsModule
  , FormsModule
  , AppRoutingModule
  ],
  declarations: [ 
    AppComponent
  , EditorComponent
  , TouchpadComponent
  , MapComponent
  , ToolbarMapComponent
  , ModalMapComponent
  , ModalSaveMapComponent
  , FilterMapsPipe
  , TakePipe
  , DropPipe
  , LengthPipe
  , PaginationComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }]
})

export class AppModule { }
