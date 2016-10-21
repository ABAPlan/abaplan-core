import { NgModule }           from '@angular/core';

import { CommonModule } from '@angular/common';

import { MapService }       from '../core/map.service';
import { LayerService }       from '../core/layer.service';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ],
  providers:    [ MapService, LayerService ]
})
export class CityMapModule { }