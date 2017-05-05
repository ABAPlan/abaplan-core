import { NgModule }           from '@angular/core';

import { SharedModule } from "../shared/shared.module";

/* Services */
import { MapService }       from '../map/map.service';
import { PrintService } from "../core/print-map.service";

/* Internal Components */
import { ModalMapComponent } from "./modal-maps-list/modal-maps-list.component";
import { ModalSaveMapComponent } from "./modal-save-map/modal-save-map.component";
import { ToolbarMapComponent } from "./toolbar/toolbar.component";
import { EditorComponent } from "./editor.component";
import { SelectLangComponent } from "./select-lang/select-lang.component";

/* Internal Pipes */
import { FilterMapsPipe } from "./modal-maps-list/filtermaps.pipe";

/* External Components */
import { PaginationComponent } from "../shared/pagination/pagination-buttons.component";

import {TranslateModule} from "ng2-translate";

@NgModule({
  imports:      [ SharedModule,  TranslateModule ],
  declarations: [
      SelectLangComponent
    , EditorComponent
    , ModalMapComponent
    , ModalSaveMapComponent
    , ToolbarMapComponent
    , FilterMapsPipe
    , PaginationComponent
  ],
  providers:    [ MapService, PrintService ]
})
export class EditorModule { }
