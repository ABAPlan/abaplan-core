// good practices: https://angular.io/styleguide#!#-a-id-04-11-a-core-feature-module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [ ],
  exports:      [ ],
  providers:    [ ]
})

export class CoreModule {
}
