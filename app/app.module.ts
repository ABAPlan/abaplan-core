import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* Rx tools */
import 'rxjs/add/operator/map';

/* App root */
import { AppComponent } from './app.component';

/* Feature Modules */
import { CoreModule } from './core/core.module';
import  { CityMapModule } from './city-map/city-map.module';
import  { CityMapComponent } from './city-map/city-map.component';

/* Routing Module */
// import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports:      [
    BrowserModule,
    CityMapModule,
    CoreModule
  ],
  declarations: [ AppComponent, CityMapComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
