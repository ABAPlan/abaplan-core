// good practices: https://angular.io/styleguide/#!#-a-id-04-10-a-shared-feature-module

import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';

import { TakePipe } from "./take.pipe";
import { DropPipe } from "./drop.pipe";
import { LengthPipe } from "./length.pipe";
import {HttpModule} from "@angular/http";
import {MapComponent} from "../map/map.component";
import {CommonModule} from "@angular/common";


@NgModule({
  imports: [
      FormsModule
    , HttpModule // editor component
    , CommonModule
  ],
  declarations: [
      TakePipe
    , DropPipe
    , LengthPipe
    , MapComponent
  ],
  exports: [
      FormsModule
    , TakePipe
    , DropPipe
    , LengthPipe
    , MapComponent
    , CommonModule
  ],
  providers: [ ]
})
export class SharedModule { }



