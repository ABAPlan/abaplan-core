// good practices: https://angular.io/styleguide/#!#-a-id-04-10-a-shared-feature-module

import { NgModule } from "@angular/core";
import { TakePipe } from "./take.pipe";
import { DropPipe } from "./drop.pipe";
import { LengthPipe } from "./length.pipe";


@NgModule({
  imports: [
  ],
  declarations: [
    TakePipe
  , DropPipe
  , LengthPipe
  ],
  exports: [
    TakePipe
  , DropPipe
  , LengthPipe
  ],
  providers: [ ]
})
export class SharedModule { }



