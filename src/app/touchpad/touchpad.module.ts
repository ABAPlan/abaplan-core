import { NgModule } from "@angular/core";
import { GeoService } from "../core/geo.service";
import { KmlService } from "../core/kml.service";
import { StateService } from "../core/state.service";
import { TransportService } from "../core/transport.service";
import { VoiceService } from "../core/voice.service";
import { MapService } from "../map/map.service";
import { SharedModule } from "../shared/shared.module";
import { TouchpadComponent } from "./touchpad.component";

@NgModule({
  declarations: [TouchpadComponent],
  imports: [SharedModule],
  providers: [
    MapService,
    GeoService,
    VoiceService,
    StateService,
    KmlService,
    TransportService,
  ],
})
export class TouchpadModule {}
