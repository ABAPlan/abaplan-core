// good practices: https://angular.io/styleguide#!#-a-id-04-11-a-core-feature-module
import { NgModule } from "@angular/core";
import { MapService } from "../map/map.service";
import { GeoService } from "./geo.service";
import { VoiceService } from "./voice.service";

@NgModule({
  declarations: [],
  exports: [],
  imports: [],
  providers: [GeoService, MapService, VoiceService],
})
export class CoreModule {}
