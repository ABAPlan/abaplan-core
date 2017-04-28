// good practices: https://angular.io/styleguide#!#-a-id-04-11-a-core-feature-module
import { NgModule } from '@angular/core';
import { GeoService } from "./geo.service";
import { MapService } from "../map/map.service";
import { VoiceService } from "./voice.service";


@NgModule({
  imports: [],
  declarations: [ ],
  exports: [ ],
  providers:
    [ GeoService
    , MapService
    , VoiceService
    ]
})

export class CoreModule { }
