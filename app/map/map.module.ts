import { NgModule }           from '@angular/core';


//import { MapService }       from './map.service';
import {SharedModule} from "../shared/shared.module";
import {MapComponent} from "./map.component";
import {CommonModule} from "@angular/common";
import {ModalSaveMapComponent} from "../editor/modal-save-map/modal-save-map.component";
import {ModalMapComponent} from "../editor/modal-maps-list/modal-maps-list.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    /*
      CommonModule
    , FormsModule
    , SharedModule
    */
  ],
  declarations: [
    /*
      MapComponent
    , ModalSaveMapComponent
    , ModalMapComponent
    */
  ],
  providers:    [ /*MapService */]
})
export class MapModule { }