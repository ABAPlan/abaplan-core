import { NgModule }           from '@angular/core';

import { MapService }       from '../map/map.service';
import { GeoService } from "../core/geo.service";
import { VoiceService } from "../core/voice.service";
import { KmlService } from "../core/kml.service";
import { MapComponent } from "../map/map.component";
import {SharedModule} from "../shared/shared.module";
import {BlindCreatorComponent} from "./blindCreator.component";
import {StateService} from "../core/state.service";

@NgModule({
  imports:      [ SharedModule ],
  declarations: [
    BlindCreatorComponent
  ],
  providers: [
      MapService
    , GeoService
    , VoiceService
    , StateService
    , KmlService
  ]
})
export class BlindCreatorModule { }