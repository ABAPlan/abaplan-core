import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* Bootstrap modules */
import { TabsModule } from 'ng2-bootstrap/ng2-bootstrap';

/* Rx tools */
import 'rxjs/add/operator/map';

/* App root */
import { AppComponent } from './app.component';

/* Feature Modules */
import { CoreModule } from './core/core.module';
import  { CityMapModule } from './navigator/navigator.module';
import  { CityMapComponent } from './navigator/navigator.component';

import { ToolbarMapComponent } from './toolbar/toolbar.component';

/* Routing Module */
// import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports:      [
    BrowserModule,
    CityMapModule,
    CoreModule,
    TabsModule
  ],
  declarations: [ AppComponent, CityMapComponent, ToolbarMapComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
