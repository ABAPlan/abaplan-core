import { NgModule }           from '@angular/core';


import { MapService }       from '../map/map.service';
import { GeoService } from "../core/geo.service";
import { VoiceService } from "../core/voice.service";
import { MapComponent } from "../map/map.component";
import {SharedModule} from "../shared/shared.module";
import {TouchpadComponent} from "./touchpad.component";

@NgModule({
  imports:      [ SharedModule ],
  declarations: [
    TouchpadComponent
  ],
  providers: [
      MapService
    , GeoService
    , VoiceService
  ]
})
export class TouchpadModule { }