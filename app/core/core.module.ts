import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    JsonpModule
    //, InMemoryWebApiModule.forRoot(InMemoryDataService)
  ],
  declarations: [ ],
  exports:      [ ],
  providers:    [ ]
})

export class CoreModule {
}
