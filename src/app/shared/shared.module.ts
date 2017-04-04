// good practices: https://angular.io/styleguide/#!#-a-id-04-10-a-shared-feature-module

import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';

import { TakePipe } from "./take.pipe";
import { DropPipe } from "./drop.pipe";
import { LengthPipe } from "./length.pipe";
import { HttpModule } from "@angular/http";
import { MapComponent } from "../map/map.component";
import { CommonModule } from "@angular/common";
import {AppRoutingModule} from "../app-routing.module";
import {ModalYesNoComponent} from "./modal-yesno/modal-yesno.component";


@NgModule({
  imports: [
      FormsModule
    , HttpModule // editor component
    , CommonModule
    , AppRoutingModule
  ],
  declarations: [
      TakePipe
    , DropPipe
    , LengthPipe
    , MapComponent
    , ModalYesNoComponent
  ],
  exports: [
      FormsModule
    , TakePipe
    , DropPipe
    , LengthPipe
    , CommonModule
    , MapComponent
    , AppRoutingModule
    , ModalYesNoComponent
  ],
  providers: [ ]
})
export class SharedModule { }



