import { NgModule } from "@angular/core";
import { TranslateModule } from "ng2-translate";
/* Services */
import { MapService } from "../map/map.service";
/* External Components */
import { PaginationComponent } from "../shared/pagination/pagination-buttons.component";
import { SharedModule } from "../shared/shared.module";
/* Internal Components */
import { EditorComponent } from "./editor.component";
/* Internal Pipes */
import { FilterMapsPipe } from "./modal-maps-list/filtermaps.pipe";
import { ModalMapComponent } from "./modal-maps-list/modal-maps-list.component";
import { ModalSaveMapComponent } from "./modal-save-map/modal-save-map.component";
import { SelectLangComponent } from "./select-lang/select-lang.component";
import { ToolbarMapComponent } from "./toolbar/toolbar.component";

@NgModule({
  declarations: [
    SelectLangComponent,
    EditorComponent,
    ModalMapComponent,
    ModalSaveMapComponent,
    ToolbarMapComponent,
    FilterMapsPipe,
    PaginationComponent,
  ],
  imports: [SharedModule, TranslateModule],
  providers: [MapService],
})
export class EditorModule {}
