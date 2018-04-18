// good practices: https://angular.io/styleguide/#!#-a-id-04-10-a-shared-feature-module

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "../app-routing.module";
import { MapComponent } from "../map/map.component";
import { DropPipe } from "./drop.pipe";
import { LengthPipe } from "./length.pipe";
import { ModalYesNoComponent } from "./modal-yesno/modal-yesno.component";
import { TakePipe } from "./take.pipe";

@NgModule({
  declarations: [
    TakePipe,
    DropPipe,
    LengthPipe,
    MapComponent,
    ModalYesNoComponent,
  ],
  exports: [
    FormsModule,
    TakePipe,
    DropPipe,
    LengthPipe,
    CommonModule,
    MapComponent,
    AppRoutingModule,
    ModalYesNoComponent,
  ],
  imports: [
    FormsModule,
    HttpModule, // editor component
    CommonModule,
    AppRoutingModule,
  ],
  providers: [],
})
export class SharedModule { }
