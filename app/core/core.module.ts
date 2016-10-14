import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from './map.service';
import { HttpModule, JsonpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [ ],
  exports:      [ ],
  providers:    [ MapService ]
})

export class CoreModule {
}