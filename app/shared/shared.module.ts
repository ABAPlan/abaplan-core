// good practices: https://angular.io/styleguide/#!#-a-id-04-10-a-shared-feature-module

import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';

import { TakePipe } from "./take.pipe";
import { DropPipe } from "./drop.pipe";
import { LengthPipe } from "./length.pipe";
import {HttpModule} from "@angular/http";


@NgModule({
  imports: [
      FormsModule
    , HttpModule // editor component
  ],
  declarations: [
    TakePipe
  , DropPipe
  , LengthPipe
  ],
  exports: [
      FormsModule
    , TakePipe
    , DropPipe
    , LengthPipe
  ],
  providers: [ ]
})
export class SharedModule { }



