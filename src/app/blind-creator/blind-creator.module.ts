import { NgModule } from "@angular/core";
import { GeoService } from "../core/geo.service";
import { VoiceService } from "../core/voice.service";
import { MapService } from "../map/map.service";
import { SharedModule } from "../shared/shared.module";
import { BlindCreatorComponent } from "./blind-creator.component";

@NgModule({
  declarations: [BlindCreatorComponent],
  imports: [SharedModule],
  providers: [MapService, GeoService, VoiceService],
})
export class BlindCreatorModule {}
