import { NgModule }           from '@angular/core';

import { MapService }       from '../map/map.service';
import { GeoService } from "../core/geo.service";
import { VoiceService } from "../core/voice.service";
import {SharedModule} from "../shared/shared.module";
import {BlindCreatorComponent} from "./blind-creator.component";

@NgModule({
  imports:      [ SharedModule ],
  declarations: [
    BlindCreatorComponent
  ],
  providers: [
      MapService
    , GeoService
    , VoiceService
  ]
})
export class BlindCreatorModule { }