import { NgModule }           from '@angular/core';


import { MapService }       from '../core/map.service';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports:      [ SharedModule ],
  declarations: [ ],
  providers:    [ MapService ]
})
export class EditorModule { }
