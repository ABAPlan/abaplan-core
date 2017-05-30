import { NgModule }           from '@angular/core';


import { MapService }       from '../map/map.service';
import { GeoService } from "../core/geo.service";
import { VoiceService } from "../core/voice.service";
import { KmlService } from "../core/kml.service";
import { MapComponent } from "../map/map.component";
import {SharedModule} from "../shared/shared.module";
import {TouchpadComponent} from "./touchpad.component";
import {StateService} from "../core/state.service";
import {TransportService} from "../core/transport.service";

@NgModule({
  imports:      [ SharedModule ],
  declarations: [
    TouchpadComponent
  ],
  providers: [
      MapService
    , GeoService
    , VoiceService
    , StateService
    , KmlService
    , TransportService
  ]
})
export class TouchpadModule { }
