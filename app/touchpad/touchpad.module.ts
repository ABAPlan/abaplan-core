import { NgModule }           from '@angular/core';


import { MapService }       from '../core/map.service';
import { GeoService } from "../core/geo.service";
import { VoiceService } from "../core/voice.service";
import { MapComponent } from "../map/map.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports:      [ SharedModule ],
  declarations: [
  ],
  providers: [
      MapService
    , GeoService
    , VoiceService
  ]
})
export class TouchpadModule { }