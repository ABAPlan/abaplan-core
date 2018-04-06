import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ModalMapComponent } from "../editor/modal-maps-list/modal-maps-list.component";
import { ModalSaveMapComponent } from "../editor/modal-save-map/modal-save-map.component";
import { SharedModule } from "../shared/shared.module";
import { MapComponent } from "./map.component";

@NgModule({
  declarations: [
    /*
    MapComponent
    , ModalSaveMapComponent
    , ModalMapComponent
    */
  ],
  imports: [
    /*
      CommonModule
    , FormsModule
    , SharedModule
    */
  ],
  providers: [
    /* MapService*/
  ],
})
export class MapModule {}
